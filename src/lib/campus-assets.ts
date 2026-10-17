export const TEST_ACCOUNTS = [
  { label: "Account A", address: "0x1111111111111111111111111111111111111111" },
  { label: "Account B", address: "0x2222222222222222222222222222222222222222" },
  { label: "Account C", address: "0x3333333333333333333333333333333333333333" },
] as const;
export interface CampusAsset {
  id: string;
  name: string;
  owner: string;
}
export interface CampusAction {
  kind: "created" | "transferred";
  id: string;
  from?: string;
  to: string;
}
export interface CampusState {
  assets: Record<string, CampusAsset>;
  history: CampusAction[];
}
export const emptyCampusState = (): CampusState => ({
  assets: {},
  history: [],
});
export function readCampusAsset(state: CampusState, id: string) {
  const asset = Object.prototype.hasOwnProperty.call(state.assets, id)
    ? state.assets[id]
    : undefined;
  if (!asset) throw new Error("Asset not found");
  return asset;
}
export function createCampusAsset(
  state: CampusState,
  id: string,
  name: string,
  caller: string,
): CampusState {
  if (!id.length) throw new Error("Asset ID is required");
  if (!name.length) throw new Error("Asset name is required");
  if (Object.prototype.hasOwnProperty.call(state.assets, id))
    throw new Error("Asset already exists");
  return {
    assets: { ...state.assets, [id]: { id, name, owner: caller } },
    history: [...state.history, { kind: "created", id, to: caller }],
  };
}
export function transferCampusAsset(
  state: CampusState,
  id: string,
  newOwner: string,
  caller: string,
): CampusState {
  const asset = readCampusAsset(state, id);
  if (caller.toLowerCase() !== asset.owner.toLowerCase())
    throw new Error("Only the owner can transfer");
  if (!/^0x[0-9a-fA-F]{40}$/.test(newOwner))
    throw new Error("Enter a full 0x address with 40 hexadecimal characters");
  if (/^0x0{40}$/i.test(newOwner)) throw new Error("New owner cannot be zero");
  return {
    assets: { ...state.assets, [id]: { ...asset, owner: newOwner } },
    history: [
      ...state.history,
      { kind: "transferred", id, from: asset.owner, to: newOwner },
    ],
  };
}
