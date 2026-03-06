// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {MarketFactory} from "../src/MarketFactory.sol";

// forge script script/CreateMarket.s.sol:CreateMarket --rpc-url $RPC_URL --broadcast
contract CreateMarket is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address factoryAddr = vm.envAddress("FACTORY_ADDRESS");

        // ============================================================
        // EDIT HERE: Fill in the match data
        // ============================================================
        string memory eventName = "pangkasong";
        string memory buffaloIdA = "iwan";
        string memory buffaloIdB = "lima tiga";
        string
            memory dataSourceUrl = "https://www.facebook.com/share/p/18Kdtwd3JR/";
        // ============================================================

        MarketFactory factory = MarketFactory(factoryAddr);

        console.log("=== Create Market ===");
        console.log("Factory  :", factoryAddr);
        console.log("Event    :", eventName);
        console.log("Buffalo A:", buffaloIdA);
        console.log("Buffalo B:", buffaloIdB);
        console.log("Source   :", dataSourceUrl);

        vm.startBroadcast(deployerKey);

        address market = factory.createMarket(
            eventName,
            buffaloIdA,
            buffaloIdB,
            dataSourceUrl
        );

        vm.stopBroadcast();

        console.log("");
        console.log("Market deployed at:", market);
        console.log("");
        console.log("=== Verify Command ===");
        console.log("Run this to verify the market contract:");
        console.log("");
        console.log(
            "forge script script/VerifyMarket.s.sol:VerifyMarket --rpc-url $RPC_URL --sig 'run(address)' ",
            market
        );
        console.log("=== Done ===");
    }
}
