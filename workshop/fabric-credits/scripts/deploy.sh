#!/usr/bin/env bash
set -eo pipefail
KIT="$(cd "$(dirname "$0")/.." && pwd)"
SAMPLES="${FABRIC_SAMPLES:-$HOME/fabric-workshop/fabric-samples}"
SEQUENCE="${CC_SEQUENCE:-1}"
if ! [[ "$SEQUENCE" =~ ^[1-9][0-9]*$ ]]; then echo "CC_SEQUENCE must be a positive integer"; exit 1; fi
cd "$SAMPLES/test-network"
./network.sh deployCC -c mychannel -ccn campuscredits -ccp "$KIT/chaincode" -ccl javascript -ccv "$SEQUENCE.0" -ccs "$SEQUENCE"
echo "Deployed sequence $SEQUENCE. Start the application from the kit folder with npm start."
