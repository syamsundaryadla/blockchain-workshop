#!/usr/bin/env bash
set -eo pipefail
cd "$(dirname "$0")/.."
bash scripts/check.sh
SAMPLES="${FABRIC_SAMPLES:-$HOME/fabric-workshop/fabric-samples}"
cd "$SAMPLES/test-network"
./network.sh up createChannel -ca -c mychannel -i 2.5.16 -cai 1.5.17
