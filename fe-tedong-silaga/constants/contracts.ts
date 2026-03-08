export const MARKET_FACTORY_ADDRESS = "0x49b4eec85810d31044dc7F06d1714Dcb93Cb96aA";
export const MOCK_USDC_ADDRESS = "0x6c4A665934214351e2886540a273Dc1A1dfAf775";

export const MARKET_FACTORY_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_eventName", "type": "string" },
      { "internalType": "string", "name": "_buffaloIdA", "type": "string" },
      { "internalType": "string", "name": "_buffaloIdB", "type": "string" },
      { "internalType": "string", "name": "_dataSourceUrl", "type": "string" }
    ],
    "name": "createMarket",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "market", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "eventName", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "buffaloIdA", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "buffaloIdB", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "dataSourceUrl", "type": "string" }
    ],
    "name": "MarketCreated",
    "type": "event"
  }
] as const;
