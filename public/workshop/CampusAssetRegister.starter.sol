// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

// Complete the three TODOs with the instructor.
// This starter compiles, but its functions deliberately reject calls.
contract CampusAssetRegister {
    struct Asset {
        string name;
        address owner;
    }
    mapping(string => Asset) private assets;

    event AssetCreated(string id, string name, address owner);
    event AssetTransferred(string id, address previousOwner, address newOwner);

    function createAsset(string memory id, string memory name) public {
        // TODO 1: Check empty fields and duplicate IDs.
        // Save Asset(name, msg.sender), then emit AssetCreated.
        revert("TODO: complete createAsset");
    }

    function readAsset(string memory id)
        public view returns (string memory name, address owner)
    {
        // TODO 2: Check that the asset exists, then return its name and owner.
        revert("TODO: complete readAsset");
    }

    function transferAsset(string memory id, address newOwner) public {
        // TODO 3: Check existence, caller ownership, and a nonzero new owner.
        // Save the old owner, update ownership, then emit AssetTransferred.
        revert("TODO: complete transferAsset");
    }
}
