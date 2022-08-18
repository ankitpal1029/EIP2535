// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.9;

import {Diamond} from "./Diamond.sol";

contract B is Diamond {
    // add admin role for A
    function addAdmin(address _addAdmin) public adminBOnly {
        DiamondStorage storage ds = diamondStorage();
        ds.AdminA = _addAdmin;
    }

    // remove admin role for A
    function removeAdmin() public adminBOnly {
        DiamondStorage storage ds = diamondStorage();
        delete ds.AdminA;
    }

    // transfer admin role for A
    function transferAdminRole(address _transferToAddress) public adminBOnly {
        DiamondStorage storage ds = diamondStorage();
        delete ds.AdminA;
        ds.AdminA = _transferToAddress;
    }

    // renouncing admin role of B
    function renounceAdminRole() public adminBOnly {
        DiamondStorage storage ds = diamondStorage();
        delete ds.AdminB;
    }

    function returnAdminA() public view returns (address adminA) {
        DiamondStorage storage ds = diamondStorage();
        adminA = ds.AdminA;
    }

    modifier adminBOnly() {
        DiamondStorage storage ds = diamondStorage();
        require(ds.AdminB == msg.sender, "Not Authorized: Not admin B");
        _;
    }
}
