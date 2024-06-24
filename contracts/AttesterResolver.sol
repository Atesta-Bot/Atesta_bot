// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import { SchemaResolver } from "../SchemaResolver.sol";

import { IEAS, Attestation } from "../../IEAS.sol";

// /**
//  * @title A sample schema resolver that checks whether the attestation is from a specific attester.
//  */
// contract AttesterResolver is SchemaResolver {
//     address private immutable _targetAttester;

//     constructor(IEAS eas, address targetAttester) SchemaResolver(eas) {
//         _targetAttester = targetAttester;
//     }

//     function onAttest(Attestation calldata attestation, uint256 /*value*/) internal view override returns (bool) {
//         return attestation.attester == _targetAttester;
//     }

//     function onRevoke(Attestation calldata /*attestation*/, uint256 /*value*/) internal pure override returns (bool) {
//         return true;
//     }
// }

//mutable list of attesters

contract AttesterResolver is SchemaResolver {
    address[] private _targetAttesters;
    mapping(address => bool) private _isTargetAttester;

    constructor(IEAS eas) SchemaResolver(eas) {}

    function addTargetAttester(address targetAttester) external {
        require(!_isTargetAttester[targetAttester], "Attester already added.");
        _targetAttesters.push(targetAttester);
        _isTargetAttester[targetAttester] = true;
    }

    function removeTargetAttester(address targetAttester) external {
        require(_isTargetAttester[targetAttester], "Attester not found.");
        _isTargetAttester[targetAttester] = false;
        for (uint256 i = 0; i < _targetAttesters.length; i++) {
            if (_targetAttesters[i] == targetAttester) {
                _targetAttesters[i] = _targetAttesters[_targetAttesters.length - 1];
                _targetAttesters.pop();
                break;
            }
        }
    }

    function onAttest(Attestation calldata attestation, uint256 /*value*/) internal view override returns (bool) {
        return _isTargetAttester[attestation.attester];
    }

    function onRevoke(Attestation calldata /*attestation*/, uint256 /*value*/) internal pure override returns (bool) {
        return true;
    }
}
