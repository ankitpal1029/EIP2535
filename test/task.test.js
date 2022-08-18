import {
  getInheritedSelectors,
  getSelectors,
  removeSelectors,
} from "../scripts/helpers";

import { deployDiamond } from "../scripts/deploy";

import { assert } from "chai";
import { ethers } from "hardhat";

describe("Diamond Test", async () => {
  let diamondAddress,
    FacetA,
    FacetB,
    DiamondContract,
    accounts,
    CallFacetAUpgraded;

  before(async function () {
    diamondAddress = await deployDiamond();
    accounts = await ethers.getSigners();
    FacetA = await ethers.getContractAt("A", diamondAddress, accounts[0]);
    FacetB = await ethers.getContractAt("B", diamondAddress, accounts[0]);
    CallFacetAUpgraded = await ethers.getContractAt(
      "AUpgraded",
      diamondAddress,
      accounts[0]
    );
    DiamondContract = await ethers.getContractAt(
      "Diamond",
      diamondAddress,
      accounts[0]
    );
    // contractA = await ethers.getContractAt("A", diamondAddress, accounts[0]);
    // contractB = await ethers.getContractAt("B", diamondAddress, accounts[0]);
  });

  it("Should run getter setter functions", async () => {
    // await contractA.setter(3);
    let val = await FacetA.getter();
    assert.equal(val.toString(), "0");

    await FacetA.setter(10);
    val = await FacetA.getter();
    assert.equal(val.toString(), "10");
  });

  it("Should upgrade contract A and verify perisistance", async () => {
    let val = await FacetA.getter();
    assert.equal(val.toString(), "10");

    // deploy new facet for contract A
    const FacetAUpgraded = await ethers.getContractFactory("AUpgraded");
    const facetAUpgraded = await FacetAUpgraded.deploy();
    await facetAUpgraded.deployed();
    console.log(`FacetAUpgraded deployed to: ${facetAUpgraded.address}`);
    let inheritedFunctionsMap = new Map();
    inheritedFunctionsMap = getInheritedSelectors(
      FacetB,
      inheritedFunctionsMap
    );
    inheritedFunctionsMap = getInheritedSelectors(
      DiamondContract,
      inheritedFunctionsMap
    );
    console.log("listing selectors");
    // console.log(getSelectors(facetAUpgraded, inheritedFunctionsMap));
    // call replace functions
    DiamondContract.replaceFunctions(
      facetAUpgraded.address,
      getSelectors(facetAUpgraded, inheritedFunctionsMap)
    );
    val = await CallFacetAUpgraded.getter();
    assert.equal(val.toString(), "10");
  });
});
