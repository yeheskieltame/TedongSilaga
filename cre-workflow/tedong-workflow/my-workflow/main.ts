import {
  cre,
  type Runtime,
  type EVMLog,
  getNetwork,
  bytesToHex,
  hexToBase64,
  TxStatus,
  encodeCallMsg,
  Runner,
} from '@chainlink/cre-sdk';
import {
  decodeEventLog,
  decodeFunctionResult,
  encodeFunctionData,
  encodeAbiParameters,
  parseAbiParameters,
  keccak256,
  toHex,
  zeroAddress,
} from 'viem';
import { TedongMarketABI } from '../contracts/abi';
import { askGemini } from './gemini';

// ---------- Config ----------

type Config = {
  geminiModel: string;
  chainSelectorName: string;
  marketAddress: string;
  gasLimit: string;
};

// ---------- Constants ----------

const MARKET_LOCKED_SIGNATURE = 'MarketLocked(address,string)';
const RESOLVE_PARAMS = parseAbiParameters('uint8 result');

// ---------- Helpers ----------

function getEvmClient(config: Config) {
  const net = getNetwork({
    chainFamily: 'evm',
    chainSelectorName: config.chainSelectorName,
    isTestnet: config.chainSelectorName.includes('testnet'),
  });
  if (!net) throw new Error(`Network not found: ${config.chainSelectorName}`);
  return new cre.capabilities.EVMClient(net.chainSelector.selector);
}

function readString(
  runtime: Runtime<Config>,
  evmClient: InstanceType<typeof cre.capabilities.EVMClient>,
  contractAddress: string,
  functionName: 'buffaloIdA' | 'buffaloIdB' | 'eventName' | 'dataSourceUrl',
): string {
  const callData = encodeFunctionData({
    abi: TedongMarketABI,
    functionName,
  });

  const resp = evmClient
    .callContract(runtime, {
      call: encodeCallMsg({
        from: zeroAddress,
        to: contractAddress as `0x${string}`,
        data: callData,
      }),
    })
    .result();

  return decodeFunctionResult({
    abi: TedongMarketABI,
    functionName,
    data: bytesToHex(resp.data),
  }) as string;
}

// ---------- Log Trigger Handler ----------

function onLogTrigger(runtime: Runtime<Config>, log: EVMLog): string {
  runtime.log('=== Tedong Silaga: Market Resolution Workflow ===');

  try {
    // Step 1: Decode MarketLocked event
    const topics = log.topics.map((t: Uint8Array) => bytesToHex(t)) as [
      `0x${string}`,
      ...`0x${string}`[],
    ];
    const data = bytesToHex(log.data);

    const decoded = decodeEventLog({
      abi: TedongMarketABI,
      eventName: 'MarketLocked',
      data,
      topics,
    });

    const marketAddress = decoded.args.market as string;
    const dataSourceUrl = decoded.args.dataSourceUrl as string;

    runtime.log(`[Step 1] MarketLocked event detected`);
    runtime.log(`[Step 1] Market: ${marketAddress}`);
    runtime.log(`[Step 1] Data Source: ${dataSourceUrl}`);

    // Step 2: Read buffalo names from contract (EVM Read)
    runtime.log('[Step 2] Reading market details...');
    const evmClient = getEvmClient(runtime.config);

    const buffaloA = readString(runtime, evmClient, marketAddress, 'buffaloIdA');
    const buffaloB = readString(runtime, evmClient, marketAddress, 'buffaloIdB');
    const eventName = readString(runtime, evmClient, marketAddress, 'eventName');

    runtime.log(`[Step 2] Event: ${eventName}`);
    runtime.log(`[Step 2] Buffalo A: ${buffaloA}`);
    runtime.log(`[Step 2] Buffalo B: ${buffaloB}`);

    // Step 3: Scrape Facebook + Query Gemini AI
    runtime.log('[Step 3] Querying Gemini AI...');

    // For hackathon: simulated Facebook data
    // In production: use HTTPClient to scrape real data from dataSourceUrl
    const facebookText = `Acara ${eventName} hari ini sangat meriah! Pertandingan adu kerbau antara ${buffaloA} dan ${buffaloB} baru saja selesai. ${buffaloA} menang telak setelah pertarungan sengit selama 15 menit. Semua penonton bersorak gembira.`;

    const geminiResult = askGemini(runtime, buffaloA, buffaloB, facebookText);
    const winner = parseInt(geminiResult.answer, 10);
    const validWinner = winner >= 1 && winner <= 3 ? winner : 3;

    const resultMap: Record<number, string> = { 1: buffaloA, 2: buffaloB, 3: 'Draw/Cancelled' };
    runtime.log(`[Step 3] AI Result: ${validWinner} (${resultMap[validWinner]})`);

    // Step 4: Write result on-chain (EVM Write via Report)
    runtime.log('[Step 4] Writing settlement on-chain...');

    const settlementData = encodeAbiParameters(RESOLVE_PARAMS, [validWinner]);

    // Prepend metadata prefix for contract routing
    const reportData = ('0x01' + settlementData.slice(2)) as `0x${string}`;

    const reportResponse = runtime
      .report({
        encodedPayload: hexToBase64(reportData),
        encoderName: 'evm',
        signingAlgo: 'ecdsa',
        hashingAlgo: 'keccak256',
      })
      .result();

    const writeResult = evmClient
      .writeReport(runtime, {
        receiver: marketAddress,
        report: reportResponse,
        gasConfig: { gasLimit: runtime.config.gasLimit },
      })
      .result();

    if (writeResult.txStatus === TxStatus.SUCCESS) {
      const txHash = bytesToHex(writeResult.txHash || new Uint8Array(32));
      runtime.log(`[Step 4] Settlement successful: ${txHash}`);
      runtime.log('=== Resolution Complete ===');
      return JSON.stringify({
        market: marketAddress,
        event: eventName,
        buffaloA,
        buffaloB,
        winner: validWinner,
        winnerName: resultMap[validWinner],
        txHash,
      });
    }

    throw new Error(`Transaction failed: ${writeResult.txStatus}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    runtime.log(`[ERROR] ${msg}`);
    throw err;
  }
}

// ---------- Init ----------

function initWorkflow(config: Config) {
  const httpCapability = new cre.capabilities.HTTPCapability();
  const httpTrigger = httpCapability.trigger({});

  const network = getNetwork({
    chainFamily: 'evm',
    chainSelectorName: config.chainSelectorName,
    isTestnet: config.chainSelectorName.includes('testnet'),
  });

  if (!network) {
    throw new Error(`Network not found: ${config.chainSelectorName}`);
  }

  const evmClient = new cre.capabilities.EVMClient(network.chainSelector.selector);
  const eventHash = keccak256(toHex(MARKET_LOCKED_SIGNATURE));

  return [
    // Log Trigger: auto-resolves when MarketLocked event is emitted
    cre.handler(
      evmClient.logTrigger({
        addresses: [config.marketAddress],
        topics: [{ values: [eventHash] }],
        confidence: 'CONFIDENCE_LEVEL_FINALIZED',
      }),
      onLogTrigger,
    ),
    // HTTP Trigger: manual testing (placeholder)
    cre.handler(httpTrigger, (runtime: Runtime<Config>) => {
      runtime.log('HTTP trigger: use Log Trigger for market resolution');
      return 'OK';
    }),
  ];
}

export async function main() {
  const runner = await Runner.newRunner<Config>();
  await runner.run(initWorkflow);
}

main();
