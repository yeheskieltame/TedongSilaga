export const TedongMarketABI = [
  {
    type: "event",
    name: "MarketLocked",
    inputs: [
      { name: "market", type: "address", indexed: true },
      { name: "dataSourceUrl", type: "string", indexed: false },
    ],
  },
  {
    type: "function",
    name: "resolveMarket",
    inputs: [{ name: "result", type: "uint8" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "status",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "buffaloIdA",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "buffaloIdB",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "eventName",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "dataSourceUrl",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "winner",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
] as const;
