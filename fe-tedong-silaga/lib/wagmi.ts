import { createConfig, http } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import { defineChain } from "viem";

// ── World Chain Sepolia (Testnet) ───────────────────────────────────────────
export const worldChainSepolia = defineChain({
  id: 4801,
  name: "World Chain Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://worldchain-sepolia.g.alchemy.com/public"] },
    public:  { http: ["https://worldchain-sepolia.g.alchemy.com/public"] },
  },
  blockExplorers: {
    default: { name: "World Chain Sepolia Explorer", url: "https://worldchain-sepolia.explorer.alchemy.com" },
  },
  testnet: true,
});

// ── Wagmi Config ───────────────────────────────────────────────────────────
export const wagmiConfig = createConfig({
  chains: [worldChainSepolia],
  connectors: [
    injected(),        // Handles MetaMask, Rabby, Coinbase, etc.
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "YOUR_WC_PROJECT_ID",
    }),
  ],
  transports: {
    [worldChainSepolia.id]: http(),
  },
  ssr: true,         // Required for Next.js App Router
});
