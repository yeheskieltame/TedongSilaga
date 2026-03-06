// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {TedongMarket} from "../src/TedongMarket.sol";

// Verify a TedongMarket contract that was deployed via MarketFactory.
//
// Usage:
//   forge script script/VerifyMarket.s.sol:VerifyMarket \
//     --rpc-url $RPC_URL \
//     --sig "run(address)" \
//     0x109920530499795E21f62a38b27242456b189A8a
//
contract VerifyMarket is Script {
    function run(address marketAddr) external view {
        TedongMarket market = TedongMarket(marketAddr);

        TedongMarket.Config memory cfg = TedongMarket.Config({
            admin: market.admin(),
            resolver: market.resolver(),
            platformWallet: market.platformWallet(),
            culturalFundWallet: market.culturalFundWallet(),
            token: address(market.token())
        });

        TedongMarket.Info memory info = TedongMarket.Info({
            eventName: market.eventName(),
            buffaloIdA: market.buffaloIdA(),
            buffaloIdB: market.buffaloIdB(),
            dataSourceUrl: market.dataSourceUrl()
        });

        bytes memory constructorArgs = abi.encode(cfg, info);

        console.log("=== Verify TedongMarket ===");
        console.log("Market   :", marketAddr);
        console.log("Admin    :", cfg.admin);
        console.log("Resolver :", cfg.resolver);
        console.log("Event    :", info.eventName);
        console.log("Buffalo A:", info.buffaloIdA);
        console.log("Buffalo B:", info.buffaloIdB);
        console.log("");
        console.log("Constructor args (hex):");
        console.logBytes(constructorArgs);
        console.log("");
        console.log("=== Run this command to verify ===");
        console.log("");
        console.log("forge verify-contract \\");
        console.log("  ", marketAddr, " \\");
        console.log("  src/TedongMarket.sol:TedongMarket \\");
        console.log(
            "  --verifier-url 'https://api.etherscan.io/v2/api?chainid=4801' \\"
        );
        console.log("  --etherscan-api-key $ETHERSCAN_API_KEY \\");
        console.log("  --constructor-args <HEX_ABOVE> \\");
        console.log("  --watch");
        console.log("");
        console.log("=== Done ===");
    }
}
