"use strict";

function prepareTransfer(senderBalance, recipientBalance, rawAmount) {
  // TODO 1: Accept only positive whole-number text. Convert it to `amount`.
  // Reject zero, negatives, fractions, malformed text and unsafe integers.

  // TODO 2: Reject an amount greater than senderBalance.

  // TODO 3: Return { amount, senderBalance, recipientBalance } with the
  // resulting balances. Keep the combined balance unchanged and reject
  // a resulting balance outside the safe integer range.
  throw new Error("Complete the three transfer-rule TODOs first");
}
module.exports = { prepareTransfer };
