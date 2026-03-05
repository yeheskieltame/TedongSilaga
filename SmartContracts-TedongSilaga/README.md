# Smart Contracts — Tedong Silaga

Solidity smart contracts for the Tedong Silaga decentralized prediction market. Built with Foundry and OpenZeppelin.

## Contracts

| Contract            | Description                                                          |
| ------------------- | -------------------------------------------------------------------- |
| `MarketFactory.sol` | Factory that deploys a new `TedongMarket` for each match             |
| `TedongMarket.sol`  | Per-match contract handling stakes, locking, resolution, and payouts |
| `MockUSDC.sol`      | Faucet-enabled mock USDC token for testnet deployment                |

## MarketFactory Functions

| Function                                                         | Access | Description                                                   |
| ---------------------------------------------------------------- | ------ | ------------------------------------------------------------- |
| `createMarket(eventName, buffaloIdA, buffaloIdB, dataSourceUrl)` | Owner  | Deploys a new `TedongMarket` contract and records its address |
| `getDeployedMarkets()`                                           | Public | Returns array of all deployed market addresses                |
| `getMarketCount()`                                               | Public | Returns the total number of created markets                   |

## TedongMarket Functions

| Function                | Access   | Description                                                                                                |
| ----------------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| `stake(choice, amount)` | Public   | Stake ERC-20 tokens on Buffalo A (1) or Buffalo B (2). Only when status is `Open`                          |
| `lockMarket()`          | Admin    | Locks the market when the match starts. Emits `MarketLocked` event with `dataSourceUrl` for CRE to pick up |
| `resolveMarket(result)` | Resolver | Sets winner (1 = A, 2 = B, 3 = draw). Deducts 2% fee and transfers to platform + cultural fund wallets     |
| `claimWinnings()`       | Public   | Winners claim proportional share of the pool. Draw refunds all stakers minus fees                          |
| `getTotalPool()`        | Public   | Returns combined pool size (poolA + poolB)                                                                 |
| `getUserStake(user)`    | Public   | Returns a user's stake on both sides (stakeA, stakeB)                                                      |

## TedongMarket Custom Errors

| Error                 | Trigger                                                    |
| --------------------- | ---------------------------------------------------------- |
| `NotAdmin()`          | Non-admin calls `lockMarket()`                             |
| `NotResolver()`       | Non-resolver calls `resolveMarket()`                       |
| `MarketNotOpen()`     | `stake()` or `lockMarket()` called when market is not Open |
| `MarketNotLocked()`   | `resolveMarket()` called when market is not Locked         |
| `MarketNotResolved()` | `claimWinnings()` called when market is not Resolved       |
| `InvalidChoice()`     | `stake()` called with choice other than 1 or 2             |
| `ZeroAmount()`        | `stake()` called with amount 0                             |
| `AlreadyClaimed()`    | User calls `claimWinnings()` twice                         |
| `NothingToClaim()`    | Loser or non-staker calls `claimWinnings()`                |
| `InvalidWinner()`     | `resolveMarket()` called with result other than 1, 2, or 3 |

## MockUSDC Functions

| Function                | Access | Description                           |
| ----------------------- | ------ | ------------------------------------- |
| `faucet()`              | Public | Mint 1000 USDC (6 decimals) to caller |
| `faucetTo(address)`     | Public | Mint 1000 USDC to specified address   |
| `faucetAmount(uint256)` | Public | Mint custom amount to caller          |

## Deployed Addresses

| Contract      | Network     | Address |
| ------------- | ----------- | ------- |
| MockUSDC      | World Chain | `TBD`   |
| MarketFactory | World Chain | `TBD`   |

## Development

### Build

```bash
forge build
```

### Test

```bash
# Run all tests
forge test -vvv

# Run specific test
forge test --match-test test_FullFlow_BuffaloAWins -vvv
forge test --match-test test_EndToEndFlow -vvv
```

### Deploy

```bash
# Step 1: Copy env and fill in values
cp .env.example .env

# Step 2: Deploy MockUSDC token
forge script script/DeployToken.s.sol:DeployToken --rpc-url $RPC_URL --broadcast --verify

# Step 3: Copy MockUSDC address to .env as TOKEN_ADDRESS

# Step 4: Deploy MarketFactory
forge script script/DeployMarket.s.sol:DeployMarket --rpc-url $RPC_URL --broadcast --verify
```

### Project Structure

```
SmartContracts-TedongSilaga/
├── src/
│   ├── TedongMarket.sol       # Per-match prediction market
│   ├── MarketFactory.sol      # Factory to deploy markets
│   └── MockUSDC.sol           # Faucet token for testnet
├── test/
│   ├── TedongMarket.t.sol     # 10 tests (full flow + access control)
│   ├── MarketFactory.t.sol    # 3 tests (factory flow + access control)
│   ├── Deploy.t.sol           # 4 tests (deployment simulation)
│   └── mocks/
│       └── MockERC20.sol      # Simple mock for unit tests
├── script/
│   ├── DeployToken.s.sol      # Deploy MockUSDC only
│   └── DeployMarket.s.sol     # Deploy MarketFactory only
├── .env.example               # Required environment variables
└── foundry.toml               # Foundry configuration
```
