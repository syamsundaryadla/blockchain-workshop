import { copyFile } from "node:fs/promises";
const choice = process.argv[2];
if (!["starter", "solution"].includes(choice))
  throw Error("Choose starter or solution");
await copyFile(
  new URL(`../${choice}/transfer-rules.js`, import.meta.url),
  new URL("../chaincode/lib/transfer-rules.js", import.meta.url),
);
console.log(
  `Installed ${choice} in chaincode/lib/transfer-rules.js. This replaces its previous contents. Deploy again after editing.`,
);
