// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    uint8 private constant DECIMALS = 6;
    uint256 public constant FAUCET_AMOUNT = 1000 * 10 ** DECIMALS;

    event Faucet(address indexed to, uint256 amount);

    constructor() ERC20("Mock USDC", "USDC") {}

    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }

    function faucet() external {
        _mint(msg.sender, FAUCET_AMOUNT);
        emit Faucet(msg.sender, FAUCET_AMOUNT);
    }

    function faucetTo(address to) external {
        _mint(to, FAUCET_AMOUNT);
        emit Faucet(to, FAUCET_AMOUNT);
    }

    function faucetAmount(uint256 amount) external {
        _mint(msg.sender, amount);
        emit Faucet(msg.sender, amount);
    }
}
