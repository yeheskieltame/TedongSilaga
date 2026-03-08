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

    const privateKey = process.env.ADMIN_PRIVATE_KEY || "***REMOVED***";
    const account = privateKeyToAccount(privateKey as `0x${string}`);

    // Determine network based on env, defaulting to World Chain Sepolia
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "https://worldchain-sepolia.g.alchemy.com/public";

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

    return NextResponse.json({ success: true, hash });
  } catch (error: any) {
    console.error("Resolve error:", error);
    return NextResponse.json(
      { error: error?.shortMessage || error?.message || "Internal Error" },
      { status: 500 }
    );
  }
}
