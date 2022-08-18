// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.9;

import {Diamond} from "./Diamond.sol";

contract A is Diamond {
    function getter() public view onlyAdminA returns (uint256) {
        DiamondStorage storage ds = diamondStorage();
        return ds.counter;
    }

    function setter() public onlyAdminA {
        DiamondStorage storage ds = diamondStorage();
        ds.counter++;
    }

    modifier onlyAdminA() {
        DiamondStorage storage ds = diamondStorage();
        require(ds.AdminA == msg.sender, "Not Authorized: Not admin A");
        _;
    }
}
