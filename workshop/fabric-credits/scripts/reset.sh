#!/usr/bin/env bash
set -eo pipefail
SAMPLES="${FABRIC_SAMPLES:-$HOME/fabric-workshop/fabric-samples}"
echo "Removing this sample test network, all its channels, ledger data and generated identities."
echo "Stop the Node application first. This is only for the disposable workshop network."
cd "$SAMPLES/test-network"
./network.sh down
