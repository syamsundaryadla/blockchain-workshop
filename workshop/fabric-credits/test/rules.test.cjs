const test = require("node:test");
const assert = require("node:assert/strict");
const { prepareTransfer } = require("../chaincode/lib/transfer-rules");
test("transfers in both directions preserve the combined credits", () => {
  const first = prepareTransfer(100, 50, "20");
  assert.deepEqual(first, {
    amount: 20,
    senderBalance: 80,
    recipientBalance: 70,
  });
  const back = prepareTransfer(
    first.recipientBalance,
    first.senderBalance,
    "10",
  );
  assert.equal(back.senderBalance, 60);
  assert.equal(back.recipientBalance, 90);
  assert.equal(back.senderBalance + back.recipientBalance, 150);
});
test("invalid values cannot become partial or rounded transfers", () => {
  for (const value of [
    "0",
    "-1",
    "2.5",
    "",
    " ",
    "20abc",
    "1e2",
    "+2",
    "01",
    "9007199254740992",
    20,
    null,
  ])
    assert.throws(() => prepareTransfer(100, 50, value));
  assert.throws(() => prepareTransfer(80, 70, "1000"), /Insufficient/);
  assert.throws(
    () => prepareTransfer(100, Number.MAX_SAFE_INTEGER, "1"),
    /too large/,
  );
});
