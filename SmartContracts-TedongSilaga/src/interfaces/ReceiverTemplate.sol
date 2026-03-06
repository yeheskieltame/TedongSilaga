// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {IReceiver} from "./IReceiver.sol";

/// @title ReceiverTemplate - CRE Forwarder receiver base contract
/// @notice Validates that reports come from the trusted Chainlink Forwarder
/// @dev From Chainlink CRE Bootcamp (simplified for Tedong Silaga)
abstract contract ReceiverTemplate is IReceiver {
    address private s_forwarderAddress;

    error InvalidForwarderAddress();
    error InvalidSender(address sender, address expected);

    event ForwarderAddressUpdated(
        address indexed previousForwarder,
        address indexed newForwarder
    );

    /// @param _forwarderAddress Chainlink Forwarder contract address
    constructor(address _forwarderAddress) {
        if (_forwarderAddress == address(0)) revert InvalidForwarderAddress();
        s_forwarderAddress = _forwarderAddress;
        emit ForwarderAddressUpdated(address(0), _forwarderAddress);
    }

    /// @notice Returns the configured forwarder address
    function getForwarderAddress() external view returns (address) {
        return s_forwarderAddress;
    }

    /// @inheritdoc IReceiver
    function onReport(bytes calldata, bytes calldata report) external override {
        if (msg.sender != s_forwarderAddress)
            revert InvalidSender(msg.sender, s_forwarderAddress);
        _processReport(report);
    }

    /// @notice Process the decoded report data
    /// @param report The report calldata
    function _processReport(bytes calldata report) internal virtual;

    /// @inheritdoc IERC165
    function supportsInterface(
        bytes4 interfaceId
    ) public pure virtual override returns (bool) {
        return
            interfaceId == type(IReceiver).interfaceId ||
            interfaceId == type(IERC165).interfaceId;
    }
}
