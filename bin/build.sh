#!/bin/sh
# Build Valhalla for the browser. No Node.js needed: esbuild is a single file in bin/.
#
#   bin/build.sh           build out/main.js once
#   bin/build.sh --watch   build again every time a file changes
set -e
root=$(cd "$(dirname "$0")/.." && pwd)

# bin/esbuild is for Linux on x86_64; anywhere else, use the one installed on the system.
if [ "$(uname -s)-$(uname -m)" = "Linux-x86_64" ]; then
	esbuild="$root/bin/esbuild"
else
	esbuild=$(command -v esbuild || true)
	[ -n "$esbuild" ] || { echo "install esbuild (brew install esbuild, or: go install github.com/evanw/esbuild/cmd/esbuild@v0.25.8)"; exit 1; }
fi

"$esbuild" "$root/src/main.ts" --bundle --format=esm --target=es2022 \
	--loader:.svg=text --outfile="$root/out/main.js" --log-level=warning "$@"
