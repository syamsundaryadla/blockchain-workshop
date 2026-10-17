export type WalletId = "alice" | "bob";
export interface CreditState {
  alice: number;
  bob: number;
}
export function rehearseTransfer(
  state: CreditState,
  signer: WalletId,
  from: WalletId,
  to: WalletId,
  raw: string,
): CreditState {
  if (signer !== from)
    throw Error(
      "Permission denied: the signing identity does not own this wallet.",
    );
  if (from === to) throw Error("Choose a different recipient.");
  if (!/^[1-9][0-9]*$/.test(raw))
    throw Error("Use a positive whole-number amount.");
  const amount = Number(raw);
  if (
    !Number.isSafeInteger(amount) ||
    !Number.isSafeInteger(state[to] + amount)
  )
    throw Error("Amount is too large.");
  if (state[from] < amount) throw Error("Insufficient credits.");
  return { ...state, [from]: state[from] - amount, [to]: state[to] + amount };
}
