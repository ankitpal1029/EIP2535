// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.9;

import {Diamond} from "./Diamond.sol";
import {B} from "./B.sol";

contract AUpgraded is Diamond, B {
    function getter() public view returns (uint256) {
        DiamondStorage storage ds = diamondStorage();
        return ds.counter;
    }

    function setter() public {
        DiamondStorage storage ds = diamondStorage();
        ds.counter++;
    }
}
