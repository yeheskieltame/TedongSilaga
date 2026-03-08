import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { TEDONG_MARKET_ABI } from "@/constants/tedong_market_abi";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { marketAddress, tx_locked_hash } = await req.json();

    if (!marketAddress || !tx_locked_hash) {
      return NextResponse.json({ error: "marketAddress and tx_locked_hash are required" }, { status: 400 });
    }

    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
    if (!rpcUrl) {
      return NextResponse.json({ error: "NEXT_PUBLIC_RPC_URL is missing in env" }, { status: 500 });
    }

    console.log(`Calling standalone CRE API server (localhost:8081) for market ${marketAddress} with lock tx: ${tx_locked_hash}`);

    // Call the external CRE API service
    const creApiUrl = process.env.CRE_API_URL || "http://localhost:8081/api/resolve";
    
    const creResponse = await fetch(creApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        marketAddress,
        tx_locked_hash
      })
    });

    if (!creResponse.ok) {
      const errorData = await creResponse.json();
      console.error("CRE API failed:", errorData);
      throw new Error(errorData.error || "CRE API Server Error");
    }

    const creData = await creResponse.json();
    console.log("CRE Data:", creData.winner, creData.txHash);
    
    // Extract winner and transaction hash from CRE API response
    const winner = creData.winner || 3; 
    const hash = creData.txHash || null;

    if (!hash || hash === "unknown") {
      console.warn("CRE workflow finished but returned unknown settlement txHash.");
    }

    // Aggressive Supabase update for the demo UI
    await supabase
      .from("markets")
      .update({ status: "Resolved", winner: winner })
      .eq("market_address", marketAddress);

    // =========================================================
    // UPDATE BUFFALO LEADERBOARD STATS
    // =========================================================
    try {
      const { data: marketData } = await supabase
        .from("markets")
        .select("buffalo_a_name, buffalo_b_name")
        .eq("market_address", marketAddress)
        .single();

      if (marketData) {
        // We only need a public client to read the total pool
        const client = createPublicClient({
          transport: http(rpcUrl),
        });
        
        const totalPoolRaw = await client.readContract({
          address: marketAddress as `0x${string}`,
          abi: TEDONG_MARKET_ABI,
          functionName: "getTotalPool",
        }) as bigint;
        
        const totalPoolFormatted = Number(totalPoolRaw) / 1e6; // Convert to decimal

        // 3. Fungsi pembantu untuk mengupdate 1 kerbau
        const updateBuffaloStats = async (name: string, isWinner: boolean) => {
          const { data: currentBuffalo } = await supabase
            .from("buffalo")
            .select("id, total_match, total_wins, total_winning_pool")
            .ilike("buffalo_name", name)
            .maybeSingle();

          if (currentBuffalo) {
            await supabase
              .from("buffalo")
              .update({
                total_match: (currentBuffalo.total_match || 0) + 1,
                total_wins: isWinner ? (currentBuffalo.total_wins || 0) + 1 : currentBuffalo.total_wins || 0,
                total_winning_pool: isWinner 
                  ? Number(currentBuffalo.total_winning_pool || 0) + totalPoolFormatted 
                  : Number(currentBuffalo.total_winning_pool || 0)
              })
              .eq("id", currentBuffalo.id);
          }
        };

        // 4. Update kedua kerbau
        await updateBuffaloStats(marketData.buffalo_a_name, winner === 1);
        await updateBuffaloStats(marketData.buffalo_b_name, winner === 2);
        console.log(`Leaderboard updated for ${marketData.buffalo_a_name} & ${marketData.buffalo_b_name} based on CRE result`);
      }
    } catch (err) {
      console.error("Failed to update buffalo leaderboard stats:", err);
    }

    return NextResponse.json({ success: true, hash: hash || "unknown", source: "cre-workflow" });
  } catch (error: unknown) {
    console.error("Resolve error:", error);
    let msg = "Internal Error";
    if (error instanceof Error) {
       msg = (error as { shortMessage?: string }).shortMessage || error.message;
    }
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
