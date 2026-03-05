// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {MarketFactory} from "../src/MarketFactory.sol";

// Step 2: Deploy MarketFactory (requires TOKEN_ADDRESS in .env)
// forge script script/DeployMarket.s.sol:DeployMarket --rpc-url $RPC_URL --broadcast --verify
contract DeployMarket is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address resolver = vm.envAddress("RESOLVER_ADDRESS");
        address platformWallet = vm.envAddress("PLATFORM_WALLET");
        address culturalFundWallet = vm.envAddress("CULTURAL_FUND_WALLET");
        address tokenAddress = vm.envAddress("TOKEN_ADDRESS");

        console.log("=== Deploy MarketFactory ===");
        console.log("Deployer       :", vm.addr(deployerKey));
        console.log("Resolver       :", resolver);
        console.log("Platform Wallet:", platformWallet);
        console.log("Cultural Fund  :", culturalFundWallet);
        console.log("Token          :", tokenAddress);

        vm.startBroadcast(deployerKey);

        MarketFactory factory = new MarketFactory(
            resolver,
            platformWallet,
            culturalFundWallet,
            tokenAddress
        );

        vm.stopBroadcast();

        console.log("");
        console.log("MarketFactory deployed at:", address(factory));
        console.log("Owner:", factory.owner());
        console.log("=== Done ===");
    }
}
