import { ethers } from "hardhat";
import { getSelectors, FacetCutAction, getInheritedSelectors } from "./helpers";

async function recreateScene() {
  const accounts = await ethers.getSigners();
  const contractOwner = accounts[0];

  let diamondAddress = "0xAe301bd4828523a457d0485587cB0a42C9eDA912";
  let AAddress = "0x98E8c52B6a5C7477F3f0C9D785EE1bE3C1787A9F";
  let BAddress = "0x44A65106203fECd95712A5C6D04aB8b4DC104E81";

  let FacetA = await ethers.getContractAt("A", diamondAddress, accounts[0]);
  let FacetB = await ethers.getContractAt("B", diamondAddress, accounts[0]);
  let DiamondContract = await ethers.getContractAt(
    "Diamond",
    diamondAddress,
    accounts[0]
  );

  let facetAUpgradedContract = await ethers.getContractAt(
    "AUpgraded",
    "0xd29D23Dd8138B167Bf15C139CEf316C7e326dcb6",
    accounts[0]
  );

  let FacetAUpgraded = await ethers.getContractAt("AUpgraded", diamondAddress);

  //   call getter function
  let val = await FacetA.getter();
  console.log(`Value of getter ${val.toString()}`);

  await FacetA.setter(10);
  val = await FacetA.getter();
  console.log(`Value of getter ${val.toString()}`);

  // fetch admin address
  val = await FacetB.returnAdminA();
  console.log(`Admin address of Contract A: ${val}`);

  // upgrade contract A to contract AUpgraded
  let inheritedFunctionsMap = new Map();
  inheritedFunctionsMap = getInheritedSelectors(FacetB, inheritedFunctionsMap);
  inheritedFunctionsMap = getInheritedSelectors(
    DiamondContract,
    inheritedFunctionsMap
  );
  DiamondContract.replaceFunctions(
    facetAUpgradedContract.address,
    // "0xd29D23Dd8138B167Bf15C139CEf316C7e326dcb6",
    getSelectors(facetAUpgradedContract, inheritedFunctionsMap)
  );

  await FacetB.addAdmin(accounts[1].address);
  val = await FacetB.returnAdminA();
  console.log(`Admin A has been changed to: ${val}`);

  const CallFacetAUpgradedNewAdmin = await ethers.getContractAt(
    "AUpgraded",
    diamondAddress,
    accounts[1]
  );

  val = await CallFacetAUpgradedNewAdmin.getter();
  console.log(`Value of counter: ${val.toString()}`);

  await CallFacetAUpgradedNewAdmin.setter(81);
  val = await CallFacetAUpgradedNewAdmin.getter();
  console.log(`Value of counter: ${val.toString()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  recreateScene()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
