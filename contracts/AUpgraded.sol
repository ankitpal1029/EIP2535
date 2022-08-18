// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.9;

import {Diamond} from "./Diamond.sol";
import {B} from "./B.sol";
import "hardhat/console.sol";

contract AUpgraded is Diamond, B {
    function getter() public view onlyAdminA returns (uint256) {
        DiamondStorage storage ds = diamondStorage();
        // console.log("AdminA: %s", ds.AdminA);
        return ds.counter;
    }

    function setter(uint256 updateBy) public onlyAdminA {
        DiamondStorage storage ds = diamondStorage();
        ds.counter += updateBy;
        // console.log(ds.counter);
    }

    modifier onlyAdminA() {
        DiamondStorage storage ds = diamondStorage();
        require(ds.AdminA == msg.sender, "Not Authorized: Not admin A");
        _;
    }
}
