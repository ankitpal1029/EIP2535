/* global ethers */

import { ContractFactory } from "ethers";
import { ethers } from "hardhat";

const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 };

// get function selectors from ABI

function getInheritedSelectors(contract, map) {
  // const map = new Map();
  const signatures = Object.keys(contract.interface.functions);
  const selectors = signatures.reduce((acc, val) => {
    if (val !== "init(bytes)") {
      // console.log(`${contract.interface.getSighash(val)}: ${val}`);
      map.set(contract.interface.getSighash(val), true);
      acc.push(contract.interface.getSighash(val));
    }
    return acc;
  }, []);
  return map;
}

function getSelectors(contract, diamondMap) {
  const signatures = Object.keys(contract.interface.functions);
  const selectors = signatures.reduce((acc, val) => {
    if (val !== "init(bytes)") {
      if (!diamondMap.get(contract.interface.getSighash(val))) {
        console.log(`${contract.interface.getSighash(val)}: ${val}`);
        acc.push(contract.interface.getSighash(val));
      }
    }
    return acc;
  }, []);
  console.log("******************");
  selectors.contract = contract;
  selectors.remove = remove;
  selectors.get = get;
  return selectors;
}

// get function selector from function signature
function getSelector(func) {
  const abiInterface = new ethers.utils.Interface([func]);
  return abiInterface.getSighash(ethers.utils.Fragment.from(func));
}

// used with getSelectors to remove selectors from an array of selectors
// functionNames argument is an array of function signatures
function remove(functionNames) {
  const selectors = this.filter((v) => {
    for (const functionName of functionNames) {
      if (v === this.contract.interface.getSighash(functionName)) {
        return false;
      }
    }
    return true;
  });
  selectors.contract = this.contract;
  selectors.remove = this.remove;
  selectors.get = this.get;
  return selectors;
}

// used with getSelectors to get selectors from an array of selectors
// functionNames argument is an array of function signatures
function get(functionNames) {
  const selectors = this.filter((v) => {
    for (const functionName of functionNames) {
      if (v === this.contract.interface.getSighash(functionName)) {
        return true;
      }
    }
    return false;
  });
  selectors.contract = this.contract;
  selectors.remove = this.remove;
  selectors.get = this.get;
  return selectors;
}

// remove selectors using an array of signatures
function removeSelectors(selectors, signatures) {
  const iface = new ethers.utils.Interface(
    signatures.map((v) => "function " + v)
  );
  const removeSelectors = signatures.map((v) => iface.getSighash(v));
  selectors = selectors.filter((v) => !removeSelectors.includes(v));
  return selectors;
}

// find a particular address position in the return value of diamondLoupeFacet.facets()
function findAddressPositionInFacets(facetAddress, facets) {
  for (let i = 0; i < facets.length; i++) {
    if (facets[i].facetAddress === facetAddress) {
      return i;
    }
  }
}

export {
  getSelectors,
  getSelector,
  FacetCutAction,
  remove,
  removeSelectors,
  findAddressPositionInFacets,
  getInheritedSelectors,
};

// exports.getSelectors = getSelectors;
// exports.getSelector = getSelector;
// exports.FacetCutAction = FacetCutAction;
// exports.remove = remove;
// exports.removeSelectors = removeSelectors;
// exports.findAddressPositionInFacets = findAddressPositionInFacets;
