#!/bin/sh
# Run Valhalla's tests in a browser. No node needed.
#
#   bin/test.sh            build the tests and run them in headless Chrome or Chromium
#   bin/test.sh --build    only build them; then open test/index.html in any browser
set -e

root=$(cd "$(dirname "$0")/.." && pwd)

if [ "$(uname -s)-$(uname -m)" = "Linux-x86_64" ]; then
	esbuild="$root/bin/esbuild"
else
	esbuild=$(command -v esbuild || true)
	[ -n "$esbuild" ] || { echo "install esbuild (https://esbuild.github.io/getting-started) or: go install github.com/evanw/esbuild/cmd/esbuild@v0.25.8"; exit 1; }
fi

# one script without modules, so the page also works from file://
"$esbuild" "$root/test/index.ts" --bundle --format=iife --target=es2022 \
	--loader:.svg=text --outfile="$root/test/out/tests.js" --log-level=warning

[ "$1" = "--build" ] && { echo "Built. Open test/index.html in a browser."; exit 0; }

browser=""
for candidate in "$CHROME" google-chrome chromium chromium-browser \
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; do
	[ -n "$candidate" ] && command -v "$candidate" >/dev/null 2>&1 && { browser=$candidate; break; }
	[ -x "$candidate" ] && { browser=$candidate; break; }
done
[ -n "$browser" ] || { echo "No Chrome or Chromium found (set CHROME=/path/to/browser). Open test/index.html in a browser instead."; exit 1; }

output=$("$browser" --headless=new --disable-gpu --no-sandbox --allow-file-access-from-files \
	--virtual-time-budget=20000 --dump-dom "file://$root/test/index.html" 2>/dev/null)

results=$(printf '%s' "$output" | sed -n '/<pre id="results"/,/<\/pre>/p' | sed 's/<[^>]*>//g; s/&gt;/>/g; s/&lt;/</g; s/&amp;/\&/g; s/&quot;/"/g')
[ -n "$results" ] || { echo "The tests did not finish. Open test/index.html in a browser to see why."; exit 1; }

printf '%s\n' "$results" | grep '^FAIL' || true
summary=$(printf '%s\n' "$results" | grep '^RESULT')
echo "${summary#RESULT } tests passed"
! printf '%s\n' "$results" | grep -q '^FAIL'
