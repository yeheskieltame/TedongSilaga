import { NextResponse } from "next/server";
import { createWalletClient, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { TEDONG_MARKET_ABI } from "@/constants/tedong_market_abi";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { marketAddress } = await req.json();

    if (!marketAddress) {
      return NextResponse.json({ error: "marketAddress is required" }, { status: 400 });
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

    console.log(`Locking market ${marketAddress} with admin ${account.address}`);

    const { request } = await client.simulateContract({
      account,
      address: marketAddress as `0x${string}`,
      abi: TEDONG_MARKET_ABI,
      functionName: "lockMarket",
    });

    const hash = await client.writeContract(request);
    
    // Wait for receipt
    await client.waitForTransactionReceipt({ hash });

    // Optional: aggressively update Supabase to avoid waiting for indexer sync during demo
    await supabase
      .from("markets")
      .update({ status: "Locked" })
      .eq("market_address", marketAddress);

    return NextResponse.json({ success: true, hash });
  } catch (error: unknown) {
    console.error("Lock error:", error);
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
