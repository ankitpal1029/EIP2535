import { getSelectors, removeSelectors } from "../scripts/helpers";

import { deployDiamond } from "../scripts/deploy";

import { chai } from "chai";
import { ethers } from "hardhat";

describe("Diamond Test", async () => {
  let diamondAddress, FacetA, FacetB, FacetAUpgraded;

  beforeEach(async () => {
    diamondAddress = await deployDiamond();
    FacetA = await ethers.getContractAt("A", diamondAddress);
    FacetB = await ethers.getContractAt("B", diamondAddress);
    FacetAUpgraded = await ethers.getContractAt("AUpgraded", diamondAddress);
  });
});
