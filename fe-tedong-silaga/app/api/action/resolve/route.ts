import { NextResponse } from "next/server";
import { createWalletClient, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { TEDONG_MARKET_ABI } from "@/constants/tedong_market_abi";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { marketAddress, winner } = await req.json();

    if (!marketAddress || !winner) {
      return NextResponse.json({ error: "marketAddress and winner are required" }, { status: 400 });
    }

    const privateKey = process.env.ADMIN_PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json({ error: "ADMIN_PRIVATE_KEY is missing in env" }, { status: 500 });
    }
    
    const account = privateKeyToAccount(privateKey as `0x${string}`);

    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
    if (!rpcUrl) {
      return NextResponse.json({ error: "NEXT_PUBLIC_RPC_URL is missing in env" }, { status: 500 });
    }

    const client = createWalletClient({
      account,
      transport: http(rpcUrl),
    }).extend(publicActions);

    console.log(`Resolving market ${marketAddress} with winner ${winner} by admin ${account.address}`);

    const { request } = await client.simulateContract({
      account,
      address: marketAddress as `0x${string}`,
      abi: TEDONG_MARKET_ABI,
      functionName: "resolveMarket",
      args: [winner],
    });

    const hash = await client.writeContract(request);
    
    // Wait for receipt
    await client.waitForTransactionReceipt({ hash });

    // Aggressive Supabase update for the demo UI
    await supabase
      .from("markets")
      .update({ status: "Resolved", winner: winner })
      .eq("market_address", marketAddress);

    // =========================================================
    // UPDATE BUFFALO LEADERBOARD STATS
    // =========================================================
    try {
      // 1. Dapatkan nama kerbau dari tabel markets
      const { data: marketData } = await supabase
        .from("markets")
        .select("buffalo_a_name, buffalo_b_name")
        .eq("market_address", marketAddress)
        .single();

      if (marketData) {
        // 2. Baca Total Pool dari Smart Contract saat ini (USDC 6 decimals)
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
        console.log(`Leaderboard updated for ${marketData.buffalo_a_name} & ${marketData.buffalo_b_name}`);
      }
    } catch (err) {
      console.error("Failed to update buffalo leaderboard stats:", err);
      // We don't throw here to ensure the resolve HTTP response still returns success.
    }

    return NextResponse.json({ success: true, hash });
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
