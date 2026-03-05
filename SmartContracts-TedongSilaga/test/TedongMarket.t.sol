// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {TedongMarket} from "../src/TedongMarket.sol";
import {MockERC20} from "./mocks/MockERC20.sol";

contract TedongMarketTest is Test {
    TedongMarket public market;
    MockERC20 public token;

    address admin = makeAddr("admin");
    address resolver = makeAddr("resolver");
    address platformWallet = makeAddr("platform");
    address culturalFund = makeAddr("cultural");
    address budi = makeAddr("budi");
    address andi = makeAddr("andi");

    uint256 constant STAKE = 10 ether;

    function _deployMarket() internal returns (TedongMarket) {
        TedongMarket.Config memory cfg = TedongMarket.Config({
            admin: admin,
            resolver: resolver,
            platformWallet: platformWallet,
            culturalFundWallet: culturalFund,
            token: address(token)
        });

        TedongMarket.Info memory info = TedongMarket.Info({
            eventName: "Rambu Solo Makale",
            buffaloIdA: "Salu",
            buffaloIdB: "Bonga",
            dataSourceUrl: "https://facebook.com/groups/desa-toraja"
        });

        return new TedongMarket(cfg, info);
    }

    function setUp() public {
        token = new MockERC20("Worldcoin", "WLD");
        market = _deployMarket();

        token.mint(budi, 100 ether);
        token.mint(andi, 100 ether);

        vm.prank(budi);
        token.approve(address(market), type(uint256).max);

        vm.prank(andi);
        token.approve(address(market), type(uint256).max);
    }

    // forge test --match-test test_FullFlow_BuffaloAWins -vvv
    function test_FullFlow_BuffaloAWins() public {
        console.log("=== FULL FLOW: Buffalo A (Salu) Wins ===");
        console.log("");

        console.log("[1] Budi stakes 10 WLD on Salu (Buffalo A)");
        vm.prank(budi);
        market.stake(1, STAKE);
        console.log("    totalPoolA:", market.totalPoolA());

        console.log("[2] Andi stakes 10 WLD on Bonga (Buffalo B)");
        vm.prank(andi);
        market.stake(2, STAKE);
        console.log("    totalPoolB:", market.totalPoolB());
        console.log("    totalPool :", market.getTotalPool());
        console.log("");

        console.log("[3] Admin locks market (match starts)");
        vm.prank(admin);
        market.lockMarket();
        console.log("    status: Locked");
        console.log("");

        console.log("[4] Chainlink CRE resolves: Salu (1) wins");
        vm.prank(resolver);
        market.resolveMarket(1);
        console.log("    winner:", market.winner());
        console.log("    winningPool:", market.winningPool());
        console.log("    platformFee:", token.balanceOf(platformWallet));
        console.log("    culturalFee:", token.balanceOf(culturalFund));
        console.log("");

        console.log("[5] Budi claims winnings");
        uint256 budiBefore = token.balanceOf(budi);
        vm.prank(budi);
        market.claimWinnings();
        uint256 budiPayout = token.balanceOf(budi) - budiBefore;
        console.log("    payout:", budiPayout);
        console.log("    balance:", token.balanceOf(budi));
        console.log("");

        console.log("[6] Andi (loser) tries to claim - should revert");
        vm.prank(andi);
        vm.expectRevert(TedongMarket.NothingToClaim.selector);
        market.claimWinnings();
        console.log("    revert: NothingToClaim (correct)");
        console.log("");

        uint256 totalPool = STAKE * 2;
        uint256 expectedFee = totalPool / 100;
        uint256 expectedPayout = totalPool - (expectedFee * 2);
        assertEq(budiPayout, expectedPayout);
        assertEq(token.balanceOf(platformWallet), expectedFee);
        assertEq(token.balanceOf(culturalFund), expectedFee);
        console.log("=== PASS ===");
    }

    // forge test --match-test test_FullFlow_Draw -vvv
    function test_FullFlow_Draw() public {
        console.log("=== FULL FLOW: Draw / Cancelled (winner = 3) ===");
        console.log("");

        console.log("[1] Budi stakes 10 WLD on Salu");
        vm.prank(budi);
        market.stake(1, STAKE);

        console.log("[2] Andi stakes 10 WLD on Bonga");
        vm.prank(andi);
        market.stake(2, STAKE);
        console.log("    totalPool:", market.getTotalPool());
        console.log("");

        console.log("[3] Admin locks market");
        vm.prank(admin);
        market.lockMarket();

        console.log("[4] CRE resolves: draw (3)");
        vm.prank(resolver);
        market.resolveMarket(3);
        console.log("    winningPool:", market.winningPool());
        console.log("");

        uint256 budiBefore = token.balanceOf(budi);
        uint256 andiBefore = token.balanceOf(andi);

        console.log("[5] Budi claims refund");
        vm.prank(budi);
        market.claimWinnings();
        uint256 budiRefund = token.balanceOf(budi) - budiBefore;
        console.log("    refund:", budiRefund);

        console.log("[6] Andi claims refund");
        vm.prank(andi);
        market.claimWinnings();
        uint256 andiRefund = token.balanceOf(andi) - andiBefore;
        console.log("    refund:", andiRefund);
        console.log("");

        assertEq(budiRefund, andiRefund);
        console.log("    both refunds equal:", budiRefund);
        console.log("=== PASS ===");
    }

    // forge test --match-test test_RevertStakeInvalidChoice -vvv
    function test_RevertStakeInvalidChoice() public {
        console.log("=== Revert: invalid choice ===");
        vm.prank(budi);
        vm.expectRevert(TedongMarket.InvalidChoice.selector);
        market.stake(0, STAKE);
        console.log("    revert: InvalidChoice");
    }

    // forge test --match-test test_RevertStakeZeroAmount -vvv
    function test_RevertStakeZeroAmount() public {
        console.log("=== Revert: zero amount ===");
        vm.prank(budi);
        vm.expectRevert(TedongMarket.ZeroAmount.selector);
        market.stake(1, 0);
        console.log("    revert: ZeroAmount");
    }

    // forge test --match-test test_RevertStakeWhenLocked -vvv
    function test_RevertStakeWhenLocked() public {
        console.log("=== Revert: stake when market is locked ===");
        vm.prank(admin);
        market.lockMarket();

        vm.prank(budi);
        vm.expectRevert(TedongMarket.MarketNotOpen.selector);
        market.stake(1, STAKE);
        console.log("    revert: MarketNotOpen");
    }

    // forge test --match-test test_RevertLockNotAdmin -vvv
    function test_RevertLockNotAdmin() public {
        console.log("=== Revert: lock by non-admin ===");
        vm.prank(budi);
        vm.expectRevert(TedongMarket.NotAdmin.selector);
        market.lockMarket();
        console.log("    revert: NotAdmin");
    }

    // forge test --match-test test_RevertResolveNotResolver -vvv
    function test_RevertResolveNotResolver() public {
        console.log("=== Revert: resolve by non-resolver ===");
        vm.prank(admin);
        market.lockMarket();

        vm.prank(budi);
        vm.expectRevert(TedongMarket.NotResolver.selector);
        market.resolveMarket(1);
        console.log("    revert: NotResolver");
    }

    // forge test --match-test test_RevertResolveNotLocked -vvv
    function test_RevertResolveNotLocked() public {
        console.log("=== Revert: resolve when not locked ===");
        vm.prank(resolver);
        vm.expectRevert(TedongMarket.MarketNotLocked.selector);
        market.resolveMarket(1);
        console.log("    revert: MarketNotLocked");
    }

    // forge test --match-test test_RevertDoubleClaim -vvv
    function test_RevertDoubleClaim() public {
        console.log("=== Revert: double claim ===");
        vm.prank(budi);
        market.stake(1, STAKE);

        vm.prank(admin);
        market.lockMarket();

        vm.prank(resolver);
        market.resolveMarket(1);

        vm.prank(budi);
        market.claimWinnings();

        vm.prank(budi);
        vm.expectRevert(TedongMarket.AlreadyClaimed.selector);
        market.claimWinnings();
        console.log("    revert: AlreadyClaimed");
    }

    // forge test --match-test test_RevertClaimNotResolved -vvv
    function test_RevertClaimNotResolved() public {
        console.log("=== Revert: claim before resolved ===");
        vm.prank(budi);
        market.stake(1, STAKE);

        vm.prank(budi);
        vm.expectRevert(TedongMarket.MarketNotResolved.selector);
        market.claimWinnings();
        console.log("    revert: MarketNotResolved");
    }
}
