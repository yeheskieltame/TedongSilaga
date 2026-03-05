// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {MockUSDC} from "../src/MockUSDC.sol";

// Step 1: Deploy MockUSDC token
// forge script script/DeployToken.s.sol:DeployToken --rpc-url $RPC_URL --broadcast --verify
//
// After deployment, copy the MockUSDC address and set it in .env as TOKEN_ADDRESS
contract DeployToken is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        console.log("=== Deploy MockUSDC ===");
        console.log("Deployer:", vm.addr(deployerKey));

        vm.startBroadcast(deployerKey);
        MockUSDC mockUsdc = new MockUSDC();
        vm.stopBroadcast();

        console.log("");
        console.log("MockUSDC deployed at:", address(mockUsdc));
        console.log("Name    :", mockUsdc.name());
        console.log("Symbol  :", mockUsdc.symbol());
        console.log("Decimals:", mockUsdc.decimals());
        console.log("");
        console.log("Next: set TOKEN_ADDRESS in .env to", address(mockUsdc));
        console.log(
            "Then run: forge script script/DeployMarket.s.sol:DeployMarket --rpc-url $RPC_URL --broadcast --verify"
        );
        console.log("=== Done ===");
    }
}
