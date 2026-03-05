// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {
    SafeERC20
} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract TedongMarket {
    using SafeERC20 for IERC20;

    enum Status {
        Open,
        Locked,
        Resolved
    }

    struct Config {
        address admin;
        address resolver;
        address platformWallet;
        address culturalFundWallet;
        address token;
    }

    struct Info {
        string eventName;
        string buffaloIdA;
        string buffaloIdB;
        string dataSourceUrl;
    }

    error NotAdmin();
    error NotResolver();
    error MarketNotOpen();
    error MarketNotLocked();
    error MarketNotResolved();
    error InvalidChoice();
    error ZeroAmount();
    error AlreadyClaimed();
    error NothingToClaim();
    error InvalidWinner();

    event Staked(address indexed user, uint8 choice, uint256 amount);
    event MarketLocked(address indexed market, string dataSourceUrl);
    event MarketResolved(uint8 winner);
    event WinningsClaimed(address indexed user, uint256 amount);
    event FeesDistributed(uint256 platformFee, uint256 culturalFee);

    address public admin;
    address public resolver;
    address public platformWallet;
    address public culturalFundWallet;
    IERC20 public token;

    string public eventName;
    string public buffaloIdA;
    string public buffaloIdB;
    string public dataSourceUrl;

    Status public status;
    uint8 public winner;

    uint256 public totalPoolA;
    uint256 public totalPoolB;
    uint256 public winningPool;

    mapping(address => uint256) public stakesA;
    mapping(address => uint256) public stakesB;
    mapping(address => bool) public claimed;

    constructor(Config memory _cfg, Info memory _info) {
        admin = _cfg.admin;
        resolver = _cfg.resolver;
        platformWallet = _cfg.platformWallet;
        culturalFundWallet = _cfg.culturalFundWallet;
        token = IERC20(_cfg.token);
        eventName = _info.eventName;
        buffaloIdA = _info.buffaloIdA;
        buffaloIdB = _info.buffaloIdB;
        dataSourceUrl = _info.dataSourceUrl;
    }

    function stake(uint8 choice, uint256 amount) external {
        if (status != Status.Open) revert MarketNotOpen();
        if (choice != 1 && choice != 2) revert InvalidChoice();
        if (amount == 0) revert ZeroAmount();

        token.safeTransferFrom(msg.sender, address(this), amount);

        if (choice == 1) {
            stakesA[msg.sender] += amount;
            totalPoolA += amount;
        } else {
            stakesB[msg.sender] += amount;
            totalPoolB += amount;
        }

        emit Staked(msg.sender, choice, amount);
    }

    function lockMarket() external {
        if (msg.sender != admin) revert NotAdmin();
        if (status != Status.Open) revert MarketNotOpen();

        status = Status.Locked;
        emit MarketLocked(address(this), dataSourceUrl);
    }

    function resolveMarket(uint8 result) external {
        if (msg.sender != resolver) revert NotResolver();
        if (status != Status.Locked) revert MarketNotLocked();
        if (result < 1 || result > 3) revert InvalidWinner();

        winner = result;
        status = Status.Resolved;

        uint256 totalPool = totalPoolA + totalPoolB;
        uint256 platformFee = totalPool / 100;
        uint256 culturalFee = totalPool / 100;

        if (platformFee > 0) token.safeTransfer(platformWallet, platformFee);
        if (culturalFee > 0)
            token.safeTransfer(culturalFundWallet, culturalFee);

        winningPool = totalPool - platformFee - culturalFee;

        emit FeesDistributed(platformFee, culturalFee);
        emit MarketResolved(result);
    }

    function claimWinnings() external {
        if (status != Status.Resolved) revert MarketNotResolved();
        if (claimed[msg.sender]) revert AlreadyClaimed();

        uint256 userStake;
        uint256 winnerTotal;

        if (winner == 1) {
            userStake = stakesA[msg.sender];
            winnerTotal = totalPoolA;
        } else if (winner == 2) {
            userStake = stakesB[msg.sender];
            winnerTotal = totalPoolB;
        } else {
            userStake = stakesA[msg.sender] + stakesB[msg.sender];
            winnerTotal = totalPoolA + totalPoolB;
        }

        if (userStake == 0) revert NothingToClaim();

        claimed[msg.sender] = true;

        uint256 payout = (winningPool * userStake) / winnerTotal;
        token.safeTransfer(msg.sender, payout);

        emit WinningsClaimed(msg.sender, payout);
    }

    function getTotalPool() external view returns (uint256) {
        return totalPoolA + totalPoolB;
    }

    function getUserStake(
        address user
    ) external view returns (uint256, uint256) {
        return (stakesA[user], stakesB[user]);
    }
}
