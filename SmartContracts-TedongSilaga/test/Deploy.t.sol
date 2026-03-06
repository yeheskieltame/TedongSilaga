// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {MarketFactory} from "../src/MarketFactory.sol";
import {TedongMarket} from "../src/TedongMarket.sol";
import {MockUSDC} from "../src/MockUSDC.sol";

contract DeployTokenTest is Test {
    address deployer = makeAddr("deployer");
    address budi = makeAddr("budi");
    address andi = makeAddr("andi");

    // forge test --match-test test_DeployToken -vvv
    function test_DeployToken() public {
        console.log("=== Step 1: Deploy MockUSDC ===");
        console.log("");

        vm.prank(deployer);
        MockUSDC usdc = new MockUSDC();

        console.log("MockUSDC address:", address(usdc));
        console.log("Name            :", usdc.name());
        console.log("Symbol          :", usdc.symbol());
        console.log("Decimals        :", usdc.decimals());
        console.log("Faucet amount   :", usdc.FAUCET_AMOUNT());
        console.log("");

        assertEq(usdc.decimals(), 6);
        assertEq(usdc.FAUCET_AMOUNT(), 1000 * 10 ** 6);
        console.log("=== PASS ===");
    }

    // forge test --match-test test_FaucetUnlimited -vvv
    function test_FaucetUnlimited() public {
        console.log("=== Faucet: unlimited claims ===");
        console.log("");

        MockUSDC usdc = new MockUSDC();

        console.log("[1] faucet() - default 1000 USDC");
        vm.prank(budi);
        usdc.faucet();
        assertEq(usdc.balanceOf(budi), 1000 * 10 ** 6);
        console.log("    budi:", usdc.balanceOf(budi));

        console.log("[2] faucet() again - no limit");
        vm.prank(budi);
        usdc.faucet();
        assertEq(usdc.balanceOf(budi), 2000 * 10 ** 6);
        console.log("    budi:", usdc.balanceOf(budi));

        console.log("[3] faucetTo() - mint to another address");
        vm.prank(budi);
        usdc.faucetTo(andi);
        assertEq(usdc.balanceOf(andi), 1000 * 10 ** 6);
        console.log("    andi:", usdc.balanceOf(andi));

        console.log("[4] faucetAmount() - custom amount");
        vm.prank(andi);
        usdc.faucetAmount(5000 * 10 ** 6);
        assertEq(usdc.balanceOf(andi), 6000 * 10 ** 6);
        console.log("    andi:", usdc.balanceOf(andi));

        console.log("");
        console.log("=== PASS ===");
    }
}

contract DeployMarketTest is Test {
    address deployer = makeAddr("deployer");
    address resolver = makeAddr("resolver");
    address platformWallet = makeAddr("platform");
    address culturalFund = makeAddr("cultural");
    address budi = makeAddr("budi");
    address andi = makeAddr("andi");

    MockUSDC usdc;

    function setUp() public {
        usdc = new MockUSDC();
    }

    // forge test --match-test test_DeployMarketFactory -vvv
    function test_DeployMarketFactory() public {
        console.log("=== Step 2: Deploy MarketFactory ===");
        console.log("");
        console.log("Using token:", address(usdc));

        vm.prank(deployer);
        MarketFactory factory = new MarketFactory(
            resolver,
            platformWallet,
            culturalFund,
            address(usdc)
        );

        console.log("MarketFactory  :", address(factory));
        console.log("Owner          :", factory.owner());
        console.log("Resolver       :", factory.resolver());
        console.log("Platform Wallet:", factory.platformWallet());
        console.log("Cultural Fund  :", factory.culturalFundWallet());
        console.log("Token          :", factory.token());
        console.log("");

        assertEq(factory.owner(), deployer);
        assertEq(factory.resolver(), resolver); // This line remains unchanged as 'market' is not available here.
        assertEq(factory.token(), address(usdc));
        console.log("=== PASS ===");
    }

    // forge test --match-test test_EndToEndFlow -vvv
    function test_EndToEndFlow() public {
        console.log(
            "=== End-to-End: Token -> Factory -> Market -> Stake -> Resolve -> Claim ==="
        );
        console.log("");

        // Step 1: Token already deployed in setUp

        console.log("[1] Token deployed at:", address(usdc));
        console.log("");

        // Step 2: Deploy MarketFactory

        console.log("[2] Deploy MarketFactory");
        vm.prank(deployer);
        MarketFactory factory = new MarketFactory(
            resolver,
            platformWallet,
            culturalFund,
            address(usdc)
        );
        console.log("    factory:", address(factory));
        console.log("");

        // Step 3: Users claim faucet

        console.log("[3] Budi and Andi claim faucet");
        vm.prank(budi);
        usdc.faucet();
        vm.prank(andi);
        usdc.faucet();
        console.log("    budi:", usdc.balanceOf(budi));
        console.log("    andi:", usdc.balanceOf(andi));
        console.log("");

        // Step 4: Create market

        console.log("[4] Create market 'Rambu Solo Makale'");
        vm.prank(deployer);
        address marketAddr = factory.createMarket(
            "Rambu Solo Makale",
            "Salu",
            "Bonga",
            "https://facebook.com/groups/desa-toraja"
        );
        TedongMarket market = TedongMarket(marketAddr);
        console.log("    market    :", marketAddr);
        console.log("    eventName :", market.eventName());
        console.log("    buffaloIdA:", market.buffaloIdA());
        console.log("    buffaloIdB:", market.buffaloIdB());
        console.log("");

        // Step 5: Stake

        uint256 stakeAmount = 500 * 10 ** 6;

        console.log("[5] Budi stakes 500 USDC on Salu (Buffalo A)");
        vm.prank(budi);
        usdc.approve(marketAddr, type(uint256).max);
        vm.prank(budi);
        market.stake(1, stakeAmount);
        console.log("    poolA:", market.totalPoolA());

        console.log("[6] Andi stakes 500 USDC on Bonga (Buffalo B)");
        vm.prank(andi);
        usdc.approve(marketAddr, type(uint256).max);
        vm.prank(andi);
        market.stake(2, stakeAmount);
        console.log("    poolB:", market.totalPoolB());
        console.log("    total:", market.getTotalPool());
        console.log("");

        // Step 6: Lock

        console.log("[7] Admin locks market");
        vm.prank(deployer);
        market.lockMarket();
        console.log("    status: Locked");
        console.log("");

        // Step 7: Resolve

        console.log("[8] Chainlink CRE resolves via onReport: Salu (1) wins");
        bytes memory report = abi.encodePacked(
            bytes1(0x01),
            abi.encode(uint8(1))
        );
        vm.prank(resolver);
        market.onReport("", report);
        console.log("    winner     :", market.winner());
        console.log("    winningPool:", market.winningPool());
        console.log("    platformFee:", usdc.balanceOf(platformWallet));
        console.log("    culturalFee:", usdc.balanceOf(culturalFund));
        console.log("");

        // Step 8: Claim

        console.log("[9] Budi claims winnings");
        uint256 budiBefore = usdc.balanceOf(budi);
        vm.prank(budi);
        market.claimWinnings();
        uint256 budiPayout = usdc.balanceOf(budi) - budiBefore;
        console.log("    payout :", budiPayout);
        console.log("    balance:", usdc.balanceOf(budi));
        console.log("");

        // Verify

        console.log("[10] Final verification");
        uint256 totalPool = stakeAmount * 2;
        uint256 fee = totalPool / 100;
        uint256 expectedPayout = totalPool - (fee * 2);

        assertEq(budiPayout, expectedPayout);
        assertEq(usdc.balanceOf(platformWallet), fee);
        assertEq(usdc.balanceOf(culturalFund), fee);
        assertEq(factory.getMarketCount(), 1);

        console.log("     totalPool   :", totalPool);
        console.log("     feePerWallet:", fee);
        console.log("     budiPayout  :", expectedPayout);
        console.log("     marketCount :", factory.getMarketCount());
        console.log("");
        console.log("=== PASS ===");
    }
}
