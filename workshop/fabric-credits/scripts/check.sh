#!/usr/bin/env bash
set -eo pipefail
SAMPLES="${FABRIC_SAMPLES:-$HOME/fabric-workshop/fabric-samples}"
echo "Checking the prepared Ubuntu environment..."
test "$(node --version)" = "v22.23.3" || { echo "Use nvm use 22.23.3"; exit 1; }
command -v git >/dev/null
command -v jq >/dev/null
docker compose version
test "$(docker info --format '{{.OSType}}')" = "linux"
test -x "$SAMPLES/bin/peer" || { echo "Fabric tools missing. Follow the installation guide."; exit 1; }
"$SAMPLES/bin/peer" version | grep -q '2.5.16'
test "$(git -C "$SAMPLES" rev-parse HEAD)" = "3c63eac4e303e8348c42637d7ed337727645b9ce" || { echo "Sample revision differs from the installation guide."; exit 1; }
echo "Environment checks passed. Run npm ci and npm run prepare:kit before workshop day."
