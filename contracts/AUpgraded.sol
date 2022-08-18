// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.9;

import {Diamond} from "./Diamond.sol";
import {B} from "./B.sol";
import "hardhat/console.sol";

contract AUpgraded is Diamond, B {
    function getter() public view returns (uint256) {
        DiamondStorage storage ds = diamondStorage();
        // console.log("Getter value %s", ds.counter);
        return ds.counter;
    }

    function setter(uint256 updateBy) public {
        DiamondStorage storage ds = diamondStorage();
        ds.counter += updateBy;
        // console.log(ds.counter);
    }
}
