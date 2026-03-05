// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {TedongMarket} from "./TedongMarket.sol";

contract MarketFactory {
    error NotOwner();

    event MarketCreated(
        address indexed market,
        string eventName,
        string buffaloIdA,
        string buffaloIdB,
        string dataSourceUrl
    );

    address public owner;
    address public resolver;
    address public platformWallet;
    address public culturalFundWallet;
    address public token;

    address[] public deployedMarkets;

    constructor(
        address _resolver,
        address _platformWallet,
        address _culturalFundWallet,
        address _token
    ) {
        owner = msg.sender;
        resolver = _resolver;
        platformWallet = _platformWallet;
        culturalFundWallet = _culturalFundWallet;
        token = _token;
    }

    function createMarket(
        string calldata _eventName,
        string calldata _buffaloIdA,
        string calldata _buffaloIdB,
        string calldata _dataSourceUrl
    ) external returns (address) {
        if (msg.sender != owner) revert NotOwner();

        TedongMarket.Config memory cfg = TedongMarket.Config({
            admin: msg.sender,
            resolver: resolver,
            platformWallet: platformWallet,
            culturalFundWallet: culturalFundWallet,
            token: token
        });

        TedongMarket.Info memory info = TedongMarket.Info({
            eventName: _eventName,
            buffaloIdA: _buffaloIdA,
            buffaloIdB: _buffaloIdB,
            dataSourceUrl: _dataSourceUrl
        });

        TedongMarket market = new TedongMarket(cfg, info);
        deployedMarkets.push(address(market));

        emit MarketCreated(
            address(market),
            _eventName,
            _buffaloIdA,
            _buffaloIdB,
            _dataSourceUrl
        );

        return address(market);
    }

    function getDeployedMarkets() external view returns (address[] memory) {
        return deployedMarkets;
    }

    function getMarketCount() external view returns (uint256) {
        return deployedMarkets.length;
    }
}
