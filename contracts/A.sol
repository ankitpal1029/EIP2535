// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.9;

import {Diamond} from "./Diamond.sol";
import "hardhat/console.sol";

contract A is Diamond {
    function getter() public view onlyAdminA returns (uint256) {
        DiamondStorage storage ds = diamondStorage();
        // console.log("In A.sol %s", ds.counter);
        return ds.counter;
    }

    function setter(uint256 updateBy) public onlyAdminA {
        DiamondStorage storage ds = diamondStorage();
        ds.counter += updateBy;
    }

    modifier onlyAdminA() {
        DiamondStorage storage ds = diamondStorage();
        require(ds.AdminA == msg.sender, "Not Authorized: Not admin A");
        _;
    }
}
