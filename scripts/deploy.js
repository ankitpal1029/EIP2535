import { ethers } from "hardhat";
import { getSelectors, FacetCutAction, getInheritedSelectors } from "./helpers";

async function deployDiamond() {
  const accounts = await ethers.getSigners();
  const contractOwner = accounts[0];

  // deploy Diamond
  const Diamond = await ethers.getContractFactory("Diamond");
  const diamond = await Diamond.deploy();
  await diamond.deployed();
  console.log("Diamond deployed:", diamond.address);

  // deploying facets
  console.log("Deploying facets");
  const FacetNames = ["A", "B"];

  let diamondMap = new Map();
  diamondMap = getInheritedSelectors(diamond, diamondMap);
  for (const facetName of FacetNames) {
    const Facet = await ethers.getContractFactory(facetName);
    const facet = await Facet.deploy();
    await facet.deployed();
    console.log(`${facetName} deployed to: ${facet.address}`);
    let tx, receipt;
    const diamondContract = await ethers.getContractAt(
      "Diamond",
      diamond.address,
      contractOwner
    );
    tx = await diamondContract.addFunctions(
      facet.address,
      getSelectors(facet, diamondMap)
    );
    receipt = await tx.wait();
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`);
    }
  }
  console.log("Diamond cut");
  return diamond.address;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  deployDiamond()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

// exports.deployDiamond = deployDiamond;
// export { deployDiamond };
