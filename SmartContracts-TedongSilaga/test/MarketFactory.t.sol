// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {MarketFactory} from "../src/MarketFactory.sol";
import {TedongMarket} from "../src/TedongMarket.sol";
import {MockERC20} from "./mocks/MockERC20.sol";

contract MarketFactoryTest is Test {
    MarketFactory public factory;
    MockERC20 public token;

    address owner = makeAddr("owner");
    address resolver = makeAddr("resolver");
    address platformWallet = makeAddr("platform");
    address culturalFund = makeAddr("cultural");
    address randomUser = makeAddr("randomUser");

    function setUp() public {
        token = new MockERC20("Worldcoin", "WLD");

        vm.prank(owner);
        factory = new MarketFactory(
            resolver,
            platformWallet,
            culturalFund,
            address(token)
        );
    }

    // forge test --match-test test_FullFlow_CreateAndUseMarket -vvv
    function test_FullFlow_CreateAndUseMarket() public {
        console.log(
            "=== FULL FLOW: Factory -> Create -> Stake -> Resolve -> Claim ==="
        );
        console.log("");

        console.log("[1] Owner creates market 'Rambu Solo Makale'");
        vm.prank(owner);
        address marketAddr = factory.createMarket(
            "Rambu Solo Makale",
            "Salu",
            "Bonga",
            "https://facebook.com/groups/desa-toraja"
        );
        console.log("    market address:", marketAddr);
        console.log("    total markets:", factory.getMarketCount());
        console.log("");

        TedongMarket market = TedongMarket(marketAddr);
        console.log("[2] Verify market configuration");
        console.log("    admin   :", market.admin());
        console.log("    resolver:", market.resolver());
        console.log("    token   :", address(market.token()));
        assertEq(market.admin(), owner);
        assertEq(market.resolver(), resolver);
        assertEq(address(market.token()), address(token));
        console.log("");

        address budi = makeAddr("budi");
        address andi = makeAddr("andi");
        token.mint(budi, 50 ether);
        token.mint(andi, 50 ether);

        vm.prank(budi);
        token.approve(marketAddr, type(uint256).max);
        vm.prank(andi);
        token.approve(marketAddr, type(uint256).max);

        console.log("[3] Budi stakes 10 WLD on Salu");
        vm.prank(budi);
        market.stake(1, 10 ether);
        console.log("    poolA:", market.totalPoolA());

        console.log("[4] Andi stakes 10 WLD on Bonga");
        vm.prank(andi);
        market.stake(2, 10 ether);
        console.log("    poolB:", market.totalPoolB());
        console.log("");

        console.log("[5] Owner locks market");
        vm.prank(owner);
        market.lockMarket();

        console.log("[6] Resolver resolves: Salu wins (1)");
        vm.prank(resolver);
        market.resolveMarket(1);
        console.log("    winner:", market.winner());
        console.log("    winningPool:", market.winningPool());
        console.log("    platformFee:", token.balanceOf(platformWallet));
        console.log("    culturalFee:", token.balanceOf(culturalFund));
        console.log("");

        console.log("[7] Budi claims winnings");
        uint256 budiBefore = token.balanceOf(budi);
        vm.prank(budi);
        market.claimWinnings();
        console.log("    payout:", token.balanceOf(budi) - budiBefore);

        console.log("");
        console.log("=== PASS ===");
    }

    // forge test --match-test test_CreateMultipleMarkets -vvv
    function test_CreateMultipleMarkets() public {
        console.log("=== Create Multiple Markets ===");

        vm.startPrank(owner);

        address m1 = factory.createMarket(
            "Event 1",
            "A1",
            "B1",
            "https://fb.com/1"
        );
        console.log("[1] market 1:", m1);

        address m2 = factory.createMarket(
            "Event 2",
            "A2",
            "B2",
            "https://fb.com/2"
        );
        console.log("[2] market 2:", m2);

        vm.stopPrank();

        assertEq(factory.getMarketCount(), 2);
        console.log("    total:", factory.getMarketCount());

        address[] memory markets = factory.getDeployedMarkets();
        assertEq(markets[0], m1);
        assertEq(markets[1], m2);
        console.log("=== PASS ===");
    }

    // forge test --match-test test_RevertCreateNotOwner -vvv
    function test_RevertCreateNotOwner() public {
        console.log("=== Revert: create by non-owner ===");
        vm.prank(randomUser);
        vm.expectRevert(MarketFactory.NotOwner.selector);
        factory.createMarket("X", "A", "B", "https://fb.com");
        console.log("    revert: NotOwner");
    }
}
