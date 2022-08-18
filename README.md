# Upgrade-able Smart Contract (EIP 2535)

In this project i have implemented the `EIP-2535` standard also known as Diamond upgrade-ablility. I have done this using the `Diamond Storage` architecture, Other  
forms of storage architecture have some drawback or the other:

- `Unstructured Storage`: Getter and setter needs to be set for each storage variable
- `Inherited Storage`: Facets become tightly coupled with with the proxy contract
- `Eternal Storage`: Works for simple values but not for arrays and mappings

Because of a change in the way solidity's assembly, yul is writter which lets us  
explicitly set the slot location in the evm of the storage/proxy contract. The way this works is  
by using assembly we can set the slot of a given struct, by just inheriting this parent contract  
and setting the slot everytime before accessing the values in the struct solves all the above problems.

```ts
contract Diamond{
    bytes32 constant DIAMOND_STORAGE_POSITION = keccak256("diamond.standard.diamond.storage");
    struct DiamondStorage {
        uint256 counter;
        mapping(bytes4 => FacetAddressAndSelectorPosition) facetAddressAndSelectorPosition;
        bytes4[] selectors;
        // admin A, admin B, Diamond admin
        address DiamondAdmin;
        address AdminA;
        address AdminB;
    }

    function diamondStorage()
        internal
        pure
        returns (DiamondStorage storage ds)
    {
        bytes32 position = DIAMOND_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }
}
```

Now every facet that is deployed will access data this way and each of it's functions selectors  
will be stored in a mapping of `Function Selector` hashes to `address` on which  
the function exits.
This is done by `addFunctions` function on the diamond contract:

```ts
    function addFunctions(
        address _facetAddress,
        bytes4[] memory _functionSelectors
    ) external diamondAdminOnly {
        DiamondStorage storage ds = diamondStorage();
        uint16 selectorCount = uint16(ds.selectors.length);
        for (
            uint256 selectorIndex;
            selectorIndex < _functionSelectors.length;
            selectorIndex++
        ) {
            bytes4 selector = _functionSelectors[selectorIndex];
            address oldFacetAddress = ds
                .facetAddressAndSelectorPosition[selector]
                .facetAddress;
            );
            ds.facetAddressAndSelectorPosition[
                    selector
                ] = FacetAddressAndSelectorPosition(
                _facetAddress,
                selectorCount
            );
            ds.selectors.push(selector);
            selectorCount++;
        }
    }
```

Upgrading of contracts can be done by calling the `replaceFunctions` function on Diamond.sol:

```ts
    function replaceFunctions(
        address _facetAddress,
        bytes4[] memory _functionSelectors
    ) external diamondAdminOnly {
        DiamondStorage storage ds = diamondStorage();
        for (
            uint256 selectorIndex;
            selectorIndex < _functionSelectors.length;
            selectorIndex++
        ) {
            bytes4 selector = _functionSelectors[selectorIndex];
            address oldFacetAddress = ds
                .facetAddressAndSelectorPosition[selector]
                .facetAddress;
            // replace old facet address
            ds
                .facetAddressAndSelectorPosition[selector]
                .facetAddress = _facetAddress;

        }
    }
```
