#!/bin/sh
# Build Valhalla for the browser. No Node.js needed: esbuild is a single file in bin/.
#
#   bin/build.sh           build out/main.js once
#   bin/build.sh --watch   build again every time a file changes
set -e
root=$(cd "$(dirname "$0")/.." && pwd)
"$root/bin/esbuild" "$root/src/main.ts" --bundle --format=esm --target=es2022 \
	--loader:.svg=text --outfile="$root/out/main.js" --log-level=warning "$@"
