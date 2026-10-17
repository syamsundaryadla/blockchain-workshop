"use strict";

// This is the completed rule. `npm run use:starter` installs the exercise.
function prepareTransfer(senderBalance, recipientBalance, rawAmount) {
  if (typeof rawAmount !== "string" || !/^[1-9][0-9]*$/.test(rawAmount)) {
    throw new Error("Use a positive whole-number amount");
  }
  const amount = Number(rawAmount);
  if (!Number.isSafeInteger(amount)) {
    throw new Error("Amount is too large");
  }
  if (senderBalance < amount) {
    throw new Error("Insufficient credits");
  }
  const nextSender = senderBalance - amount;
  const nextRecipient = recipientBalance + amount;
  if (
    !Number.isSafeInteger(nextSender) ||
    !Number.isSafeInteger(nextRecipient)
  ) {
    throw new Error("Resulting balance is too large");
  }
  return { amount, senderBalance: nextSender, recipientBalance: nextRecipient };
}
module.exports = { prepareTransfer };
