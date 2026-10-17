#!/bin/sh
# Make the Bubble tokens of each accent the settings offer, with Bubble's own generator.
# Run it again after updating Bubble. Needs Go; the files it writes are kept in the repository.
#
#   bin/accents.sh                      with Bubble cloned next to Valhalla, in ../bubble
#   BUBBLE=/path/to/bubble bin/accents.sh
set -e
root=$(cd "$(dirname "$0")/.." && pwd)
bubble=${BUBBLE:-$root/../bubble}
[ -d "$bubble" ] || { echo "clone https://github.com/akrck02/bubble next to Valhalla, or set BUBBLE=/path/to/bubble"; exit 1; }
mkdir -p "$root/styles/accents"

# name and colour; gold is Valhalla's own, from its logo. Keep in step with src/settings.ts.
while read -r name colour; do
	(cd "$bubble" && go run ./cmd/bubble-css -accent "$colour") > "$root/styles/accents/$name.css"
done <<COLOURS
gold #F6BD60
blue #2C5C9E
teal #2BB3A3
red #EF5350
green #3DDC84
COLOURS
echo "Wrote the accents in styles/accents."
