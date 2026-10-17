// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

// Learning project: records ownership claims, not physical possession.
contract CampusAssetRegister {
    struct Asset {
        string name;
        address owner;
    }
    mapping(string => Asset) private assets;

    event AssetCreated(string id, string name, address owner);
    event AssetTransferred(string id, address previousOwner, address newOwner);

    function createAsset(string memory id, string memory name) public {
        require(bytes(id).length > 0, "Asset ID is required");
        require(bytes(name).length > 0, "Asset name is required");
        require(assets[id].owner == address(0), "Asset already exists");
        assets[id] = Asset(name, msg.sender);
        emit AssetCreated(id, name, msg.sender);
    }

    function readAsset(string memory id)
        public view returns (string memory name, address owner)
    {
        require(assets[id].owner != address(0), "Asset not found");
        Asset storage asset = assets[id];
        return (asset.name, asset.owner);
    }

    function transferAsset(string memory id, address newOwner) public {
        require(assets[id].owner != address(0), "Asset not found");
        require(msg.sender == assets[id].owner, "Only the owner can transfer");
        require(newOwner != address(0), "New owner cannot be zero");
        address previousOwner = assets[id].owner;
        assets[id].owner = newOwner;
        emit AssetTransferred(id, previousOwner, newOwner);
    }
}
