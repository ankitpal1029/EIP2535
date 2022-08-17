// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.9;

import {Diamond} from "./Diamond.sol";

contract B is Diamond {
    function addAdmin(address _addAdmin) public superAdminOnly {
        DiamondStorage storage ds = diamondStorage();
        ds.admins[_addAdmin] = true;
    }

    function removeAdmin(address _removeAddress) public superAdminOnly {
        DiamondStorage storage ds = diamondStorage();
        delete ds.admins[_removeAddress];
    }

    function transferAdminRole(address _transferToAddress)
        public
        superAdminOnly
    {
        DiamondStorage storage ds = diamondStorage();
        delete ds.admins[msg.sender];
        ds.admins[_transferToAddress] = true;
    }

    function renounceAdminRole() public superAdminOnly {
        DiamondStorage storage ds = diamondStorage();
        delete ds.admins[msg.sender];
    }

    modifier superAdminOnly() {
        DiamondStorage storage ds = diamondStorage();
        require(ds.superAdmin == msg.sender, "Not Authorized: Not super admin");
        _;
    }
}
