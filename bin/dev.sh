#!/bin/sh
# Run Valhalla while working on it: esbuild serves the folder and builds out/main.js again on every
# request, so reloading the page shows the latest code. No Node.js needed.
#
#   bin/dev.sh          serve on http://localhost:8000
#   PORT=9000 bin/dev.sh
set -e
root=$(cd "$(dirname "$0")/.." && pwd)
port=${PORT:-8000}
echo "Valhalla on http://localhost:$port (Ctrl C stops it)"
exec "$root/bin/build.sh" --servedir="$root" --serve="localhost:$port"
