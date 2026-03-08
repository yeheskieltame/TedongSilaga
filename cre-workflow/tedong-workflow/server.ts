import { serve } from "bun";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

const PORT = process.env.PORT || 8081;

console.log(`Starting Tedong Silaga CRE Workflow API server on port ${PORT}...`);

serve({
  port: PORT,
  // Add simple CORS headers for local development if needed directly from FE, 
  // though currently we proxy through Next.js BE
  async fetch(req) {
    const url = new URL(req.url);

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (req.method === "POST" && url.pathname === "/api/resolve") {
      try {
        const body = await req.json();
        const { marketAddress, tx_locked_hash } = body;

        if (!marketAddress || !tx_locked_hash) {
          return new Response(JSON.stringify({ error: "marketAddress and tx_locked_hash are required" }), { 
            status: 400,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        }

        console.log(`\n[API] Triggering CRE Workflow for market: ${marketAddress}`);
        console.log(`[API] Lock TX: ${tx_locked_hash}`);

        // Determine project directory (we are now in root)
        const projectRoot = process.cwd();

        // Added --evm-event-index 0 which is required by CRE CLI in non-interactive mode
        const cmd = `bunx cre workflow simulate my-workflow --non-interactive --trigger-index 0 --evm-tx-hash ${tx_locked_hash} --evm-event-index 0 --broadcast`;
        
        console.log(`[API] Engine Root: ${projectRoot}`);
        console.log(`[API] Executing: ${cmd}`);
        
        // This might take a few seconds as it connects to RPC, AI, and sends Tx
        const { stdout, stderr } = await execPromise(cmd, { cwd: projectRoot });

        console.log("[API] Workflow raw stdout:", stdout);
        if (stderr) console.error("[API] Workflow Error Output:", stderr);

        // Parse the results from the CLI output
        const match = stdout.match(/\[Step 4\] AI Result: (\d)/);
        const winner = match ? parseInt(match[1], 10) : 3; 

        const txMatch = stdout.match(/\[Step 5\] Settlement successful: (0x[a-fA-F0-9]+)/);
        const hash = txMatch ? txMatch[1] : null;

        if (!hash) {
           console.warn("[API] Could not parse settlement transaction hash from CRE output.");
        } else {
           console.log(`[API] Successfully resolved. Winner: ${winner}, Tx: ${hash}`);
        }

        return new Response(JSON.stringify({
          success: true,
          winner,
          txHash: hash || "unknown",
          logs: stdout,
        }), { 
          status: 200, 
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } 
        });

      } catch (err: any) {
        console.error("[API] Failed to run CRE Workflow:", err);
        return new Response(JSON.stringify({ 
          error: err.message || err.stderr || err.stdout || "Internal server error",
          logs: err.stdout 
        }), { 
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
    }

    return new Response(JSON.stringify({ error: "Not found", endpoint: "POST /api/resolve" }), { 
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
});
