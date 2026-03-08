import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createPublicClient, http } from "viem";
import { worldChainSepolia } from "@/lib/wagmi";
import { MARKET_FACTORY_ADDRESS, MARKET_FACTORY_ABI } from "@/constants/contracts";
import { TEDONG_MARKET_ABI } from "@/constants/tedong_market_abi";

export async function GET() {
  try {
    // 1. Initialize viem client for World Chain
    const client = createPublicClient({
      chain: worldChainSepolia,
      transport: http() // will use default alchemy from wagmi config or replace if needed
    });

    // 2. Fetch deployed markets from factory
    const deployedMarkets = await client.readContract({
      address: MARKET_FACTORY_ADDRESS as `0x${string}`,
      abi: MARKET_FACTORY_ABI,
      functionName: "getDeployedMarkets",
    }) as string[];

    if (!deployedMarkets || deployedMarkets.length === 0) {
       return NextResponse.json({ message: "No markets found on-chain", synced: 0 });
    }

    // 3. Get existing markets from Supabase
    const { data: existingBase, error: fetchError } = await supabase
      .from("markets")
      .select("market_address");
      
    if (fetchError) throw fetchError;
    
    // Create a Set of lowercase addresses for easy comparison
    const existingAddresses = new Set((existingBase || []).map(m => m.market_address.toLowerCase()));

    let syncedCount = 0;

    // 4. Loop and find new markets
    for (const marketAddr of deployedMarkets) {
      if (existingAddresses.has(marketAddr.toLowerCase())) continue;

      try {
        // Fetch market details from chain concurrently
        const [eventName, buffaloIdA, buffaloIdB, dataSourceUrl] = await Promise.all([
          client.readContract({ address: marketAddr as `0x${string}`, abi: TEDONG_MARKET_ABI, functionName: "eventName" }),
          client.readContract({ address: marketAddr as `0x${string}`, abi: TEDONG_MARKET_ABI, functionName: "buffaloIdA" }),
          client.readContract({ address: marketAddr as `0x${string}`, abi: TEDONG_MARKET_ABI, functionName: "buffaloIdB" }),
          client.readContract({ address: marketAddr as `0x${string}`, abi: TEDONG_MARKET_ABI, functionName: "dataSourceUrl" }),
        ]) as [string, string, string, string];

        // Insert to Supabase with default fields
        const { error: insertError } = await supabase
          .from("markets")
          .insert([
            {
              market_address: marketAddr,
              event_name: eventName,
              buffalo_a_name: buffaloIdA,
              buffalo_b_name: buffaloIdB,
              arena_name: dataSourceUrl || "Tedong Arena",
              embed_poster: "",
              url_embed_buffalo_a: "",
              url_embed_buffalo_b: "",
            }
          ]);
          
        if (!insertError) {
          syncedCount++;
          existingAddresses.add(marketAddr.toLowerCase());
          console.log(`Synced new market: ${marketAddr}`);
        } else {
          console.error(`Failed to insert market ${marketAddr} to Supabase:`, insertError);
        }
      } catch (marketErr) {
        console.error(`Failed to fetch details for market ${marketAddr} from chain:`, marketErr);
      }
    }

    return NextResponse.json({ 
      message: "Sync successful", 
      synced: syncedCount, 
      total: deployedMarkets.length 
    });
  } catch (error: any) {
    console.error("Sync API Error:", error);
    return NextResponse.json({ error: "Sync failed", details: error.message }, { status: 500 });
  }
}
