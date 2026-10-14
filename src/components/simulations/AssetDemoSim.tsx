"use client";

import React, { useState } from "react";
import { FabricAsset, FabricHistoryRecord } from "@/types/fabric";
import { INITIAL_FABRIC_ASSETS, INITIAL_FABRIC_HISTORY } from "@/lib/fabric-engine";
import { truncateHash } from "@/lib/utils";
import {
  Boxes,
  Plus,
  ArrowRightLeft,
  Edit2,
  History,
  Database,
  Search,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  X,
} from "lucide-react";

export function AssetDemoSim() {
  const [assets, setAssets] = useState<FabricAsset[]>(INITIAL_FABRIC_ASSETS);
  const [history, setHistory] = useState<FabricHistoryRecord[]>(INITIAL_FABRIC_HISTORY);
  const [mode, setMode] = useState<"simulation" | "live">("simulation");
  const [searchQuery, setSearchQuery] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAssetForTransfer, setSelectedAssetForTransfer] = useState<FabricAsset | null>(null);
  const [selectedAssetForUpdate, setSelectedAssetForUpdate] = useState<FabricAsset | null>(null);
  const [selectedAssetForHistory, setSelectedAssetForHistory] = useState<FabricAsset | null>(null);

  const [newId, setNewId] = useState("");
  const [newColor, setNewColor] = useState("blue");
  const [newSize, setNewSize] = useState(10);
  const [newOwner, setNewOwner] = useState("Alice");
  const [newValue, setNewValue] = useState(500);

  const [transferTargetOwner, setTransferTargetOwner] = useState("");

  const [updateColor, setUpdateColor] = useState("");
  const [updateSize, setUpdateSize] = useState(0);
  const [updateValue, setUpdateValue] = useState(0);

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showNotification = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  const handleReset = () => {
    setAssets(INITIAL_FABRIC_ASSETS);
    setHistory(INITIAL_FABRIC_HISTORY);
    showNotification("Reset ledger state to initial sample assets.", "success");
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = newId.trim();

    if (!trimmedId) {
      showNotification("Asset ID is required.", "error");
      return;
    }

    if (assets.some((a) => a.ID.toLowerCase() === trimmedId.toLowerCase())) {
      showNotification(`Asset with ID '${trimmedId}' already exists in World State.`, "error");
      return;
    }

    const newAsset: FabricAsset = {
      ID: trimmedId,
      Color: newColor,
      Size: Number(newSize),
      Owner: newOwner,
      AppraisedValue: Number(newValue),
    };

    const newTxRecord: FabricHistoryRecord = {
      txId: `tx-${Math.random().toString(16).substring(2, 10)}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
      isDelete: false,
      value: newAsset,
      action: "CreateAsset",
    };

    setAssets((prev) => [...prev, newAsset]);
    setHistory((prev) => [newTxRecord, ...prev]);
    setIsCreateOpen(false);
    setNewId("");
    showNotification(`Asset '${trimmedId}' successfully created on ledger.`, "success");
  };

  const handleTransferOwnership = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetForTransfer) return;
    const trimmedNewOwner = transferTargetOwner.trim();

    if (!trimmedNewOwner) {
      showNotification("New owner name cannot be empty.", "error");
      return;
    }

    const updatedAsset: FabricAsset = {
      ...selectedAssetForTransfer,
      Owner: trimmedNewOwner,
    };

    const newTxRecord: FabricHistoryRecord = {
      txId: `tx-${Math.random().toString(16).substring(2, 10)}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
      isDelete: false,
      value: updatedAsset,
      action: "TransferAsset",
    };

    setAssets((prev) =>
      prev.map((a) => (a.ID === selectedAssetForTransfer.ID ? updatedAsset : a))
    );
    setHistory((prev) => [newTxRecord, ...prev]);
    setSelectedAssetForTransfer(null);
    setTransferTargetOwner("");
    showNotification(
      `Ownership of '${selectedAssetForTransfer.ID}' transferred from ${selectedAssetForTransfer.Owner} to ${trimmedNewOwner}.`,
      "success"
    );
  };

  const handleUpdateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetForUpdate) return;

    const updatedAsset: FabricAsset = {
      ...selectedAssetForUpdate,
      Color: updateColor,
      Size: Number(updateSize),
      AppraisedValue: Number(updateValue),
    };

    const newTxRecord: FabricHistoryRecord = {
      txId: `tx-${Math.random().toString(16).substring(2, 10)}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
      isDelete: false,
      value: updatedAsset,
      action: "UpdateAsset",
    };

    setAssets((prev) =>
      prev.map((a) => (a.ID === selectedAssetForUpdate.ID ? updatedAsset : a))
    );
    setHistory((prev) => [newTxRecord, ...prev]);
    setSelectedAssetForUpdate(null);
    showNotification(`Asset '${selectedAssetForUpdate.ID}' updated successfully.`, "success");
  };

  const filteredAssets = assets.filter(
    (a) =>
      a.ID.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.Owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.Color.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full text-slate-800">
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Asset Management System</h3>
            <p className="text-xs text-slate-500">
              Interactive client implementing official Hyperledger Fabric{" "}
              <code className="text-blue-700 font-mono font-bold">asset-transfer-basic</code>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setMode("simulation")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                mode === "simulation"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Simulation Mode
            </button>
            <button
              onClick={() => {
                setMode("live");
                showNotification(
                  "Live Fabric Mode: Fallback enabled (no active external gateway backend detected). Local simulation continues safely.",
                  "success"
                );
              }}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                mode === "live"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Live Gateway Mode
            </button>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset State
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 animate-fade-in ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-red-50 border-red-300 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Action Bar (Search & Create) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, Owner, or Color..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Asset (CreateAsset)
        </button>
      </div>

      {/* Asset Table */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold">Asset ID</th>
                <th className="px-4 py-3 font-bold">Color</th>
                <th className="px-4 py-3 font-bold">Size</th>
                <th className="px-4 py-3 font-bold">Registered Owner</th>
                <th className="px-4 py-3 font-bold">Appraised Value</th>
                <th className="px-4 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredAssets.map((asset) => (
                <tr key={asset.ID} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-blue-700">{asset.ID}</td>
                  <td className="px-4 py-3.5 capitalize">
                    <span className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full border border-slate-300 shadow-inner"
                        style={{
                          backgroundColor:
                            asset.Color === "white"
                              ? "#FFFFFF"
                              : asset.Color === "black"
                              ? "#1E293B"
                              : asset.Color,
                        }}
                      />
                      <span className="font-sans text-xs text-slate-800">{asset.Color}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{asset.Size}</td>
                  <td className="px-4 py-3.5 font-sans font-bold text-slate-900">
                    {asset.Owner}
                  </td>
                  <td className="px-4 py-3.5 text-emerald-700 font-bold">
                    ${asset.AppraisedValue.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right font-sans">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedAssetForTransfer(asset);
                          setTransferTargetOwner("");
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-300 text-xs font-semibold transition-colors"
                        title="Transfer Ownership"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
                        Transfer
                      </button>

                      <button
                        onClick={() => {
                          setSelectedAssetForUpdate(asset);
                          setUpdateColor(asset.Color);
                          setUpdateSize(asset.Size);
                          setUpdateValue(asset.AppraisedValue);
                        }}
                        className="p-1.5 rounded bg-slate-100 hover:bg-amber-50 text-slate-700 border border-slate-300 text-xs transition-colors"
                        title="Update Attributes"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-amber-600" />
                      </button>

                      <button
                        onClick={() => setSelectedAssetForHistory(asset)}
                        className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs transition-colors"
                        title="View Asset History"
                      >
                        <History className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* World State Key-Value Inspector */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold text-slate-600 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-emerald-600" />
            Live StateDB World State (Current JSON Key-Value Store)
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {assets.length} Keys currently committed
          </span>
        </div>

        <pre className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 overflow-x-auto max-h-48 leading-relaxed shadow-inner">
          {JSON.stringify(
            assets.reduce((acc, curr) => {
              acc[curr.ID] = curr;
              return acc;
            }, {} as Record<string, FabricAsset>),
            null,
            2
          )}
        </pre>
      </div>

      {/* MODAL 1: Create Asset Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Create New Asset (CreateAsset)
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Asset ID (Unique Key)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. asset7"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Color</label>
                  <select
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="blue">Blue</option>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                    <option value="yellow">Yellow</option>
                    <option value="black">Black</option>
                    <option value="white">White</option>
                    <option value="gold">Gold</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Size</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newSize}
                    onChange={(e) => setNewSize(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Owner Name</label>
                <input
                  type="text"
                  required
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Appraised Value ($)</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={newValue}
                  onChange={(e) => setNewValue(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  Submit Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Transfer Ownership Modal */}
      {selectedAssetForTransfer && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                Transfer Ownership (TransferAsset)
              </h3>
              <button
                onClick={() => setSelectedAssetForTransfer(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTransferOwnership} className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-slate-600">
                  Target Asset:{" "}
                  <strong className="text-blue-700 font-mono">
                    {selectedAssetForTransfer.ID}
                  </strong>
                </div>
                <div className="text-slate-600">
                  Current Owner:{" "}
                  <strong className="text-slate-900">
                    {selectedAssetForTransfer.Owner}
                  </strong>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  New Owner Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brad, Dave, or Consortium Org"
                  value={transferTargetOwner}
                  onChange={(e) => setTransferTargetOwner(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAssetForTransfer(null)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  Transfer Ownership
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Update Asset Modal */}
      {selectedAssetForUpdate && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-amber-600" />
                Update Asset Attributes (UpdateAsset)
              </h3>
              <button
                onClick={() => setSelectedAssetForUpdate(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAsset} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-600">
                Modifying: <span className="text-blue-700 font-bold">{selectedAssetForUpdate.ID}</span>
                {" "}(Owner: {selectedAssetForUpdate.Owner})
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Color</label>
                <input
                  type="text"
                  required
                  value={updateColor}
                  onChange={(e) => setUpdateColor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Size</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={updateSize}
                    onChange={(e) => setUpdateSize(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Appraised Value ($)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={updateValue}
                    onChange={(e) => setUpdateValue(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAssetForUpdate(null)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: History Audit Trail Modal */}
      {selectedAssetForHistory && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                Ledger Audit History for {selectedAssetForHistory.ID}
              </h3>
              <button
                onClick={() => setSelectedAssetForHistory(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Distinction: The <strong className="text-slate-800">World State</strong> stores only the current owner ({selectedAssetForHistory.Owner}), whereas the <strong className="text-slate-800">Blockchain Log</strong> preserves every mutation historically.
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history
                .filter((h) => h.value.ID === selectedAssetForHistory.ID)
                .map((record, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-700">{record.action}</span>
                      <span className="text-[11px] text-slate-400">{record.timestamp}</span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      TxID: {truncateHash(record.txId, 8, 8)}
                    </div>
                    <div className="text-slate-900 font-sans text-xs">
                      Owner: {record.value.Owner} • Value: ${record.value.AppraisedValue} • Color: {record.value.Color}
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedAssetForHistory(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
