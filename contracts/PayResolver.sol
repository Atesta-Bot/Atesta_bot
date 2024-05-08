// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import { Address } from "@openzeppelin/contracts/utils/Address.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import { SchemaResolver } from "../SchemaResolver.sol";

import { IEAS, Attestation } from "../../IEAS.sol";



/// @title PayingResolver with token
/// @notice A sample schema resolver that pays to an address provided in the attestation data .
contract PayingResolver is SchemaResolver {


     IERC20 private immutable _targetToken;
     using SafeERC20 for IERC20;

    constructor(IEAS eas,  IERC20 targetToken) SchemaResolver(eas) {
       _targetToken = targetToken;
    }

    function isPayable() public pure override returns (bool) {
        return true;
    }

    struct AttestationData {
    address paymentAddress;
    uint256 amount;
    string comments;
    }

    function onAttest(Attestation calldata attestation, uint256 /*value*/) internal override returns (bool) {
        //removed for testing
        // if (value > 0) {
        //     return false;
        // }
     AttestationData memory attestationData = abi.decode(attestation.data, (AttestationData));
        address paymentAddress = attestationData.paymentAddress;  
        uint256 amount = attestationData.amount;  

        //pay using ether
        // payable(paymentAddress).transfer(amount);

        //pay using token
        _targetToken.safeTransfer(paymentAddress, amount);

        return true;
    }

       function onRevoke(Attestation calldata /*attestation*/, uint256 /*value*/) internal pure override returns (bool) {
        return true;
    }

}