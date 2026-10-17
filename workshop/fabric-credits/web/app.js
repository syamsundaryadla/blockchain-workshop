const $ = (id) => document.getElementById(id);
let busy = false;
function report(title, text, type = "", transactionId = "") {
  $("result").className = `result ${type}`;
  $("result-title").textContent = title;
  $("result-text").textContent = text;
  $("transaction").textContent = transactionId
    ? `Committed transaction: ${transactionId}`
    : "";
}
function showBalances(data) {
  $("alice").textContent = String(data.alice);
  $("bob").textContent = String(data.bob);
  $("total").textContent = String(data.alice + data.bob);
  $("read-status").textContent =
    `Last read from the Fabric ledger at ${new Date().toLocaleTimeString()}.`;
}
function pending(value) {
  busy = value;
  document
    .querySelectorAll("button,input,select")
    .forEach((el) => (el.disabled = value));
}
async function api(route, data) {
  const response = await fetch(
    route,
    data === undefined
      ? {}
      : {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
  );
  const result = await response.json();
  if (!response.ok) throw Error(result.error || "The operation failed");
  return result;
}
async function refresh() {
  if (busy) return;
  pending(true);
  try {
    showBalances(await api("/api/balances"));
    report(
      "Balances read from Fabric.",
      "Predict what should happen before requesting the next transfer.",
    );
  } catch (e) {
    $("read-status").textContent =
      "Ledger read failed. Any displayed balances are from an earlier read.";
    report(
      "Could not read the ledger.",
      `${e.message} Check the network and deployment; initialize once if the wallets do not exist.`,
      "rejected",
    );
  } finally {
    pending(false);
  }
}
$("signer").addEventListener("change", () => {
  $("from").value = $("signer").value;
  $("to").value = $("signer").value === "alice" ? "bob" : "alice";
});
$("forbidden").addEventListener("click", () => {
  $("signer").value = "bob";
  $("from").value = "alice";
  $("to").value = "bob";
  $("amount").value = "1";
  report(
    "Predict the permission check.",
    "Bob will sign a request to debit Alice. Press Request transfer; the contract should reject it.",
  );
  $("send").focus();
});
$("refresh").addEventListener("click", refresh);
$("initialize").addEventListener("click", async () => {
  if (busy) return;
  pending(true);
  report(
    "Initializing the demo…",
    "Waiting for a valid Fabric commit.",
    "pending",
  );
  try {
    const data = await api("/api/initialize", {});
    showBalances(data);
    report(
      "Initialization committed.",
      "Alice has 100 and Bob has 50. Initialization cannot be repeated.",
      "",
      data.transactionId,
    );
  } catch (e) {
    report("Initialization did not complete.", e.message, "rejected");
  } finally {
    pending(false);
  }
});
$("transfer-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy) return;
  const request = {
    signer: $("signer").value,
    from: $("from").value,
    to: $("to").value,
    amount: $("amount").value,
  };
  pending(true);
  report(
    "Requesting the transfer…",
    "Waiting for a valid commit before confirming success.",
    "pending",
  );
  try {
    const data = await api("/api/transfer", request);
    showBalances(data);
    report(
      "Transfer committed · VALID",
      `${request.amount} credits moved from ${request.from} to ${request.to}. Read both resulting balances.`,
      "",
      data.transactionId,
    );
  } catch (e) {
    report(
      "Transfer was not confirmed.",
      `${e.message} Read the balances again to check the ledger state.`,
      "rejected",
    );
  } finally {
    pending(false);
  }
});
refresh();
