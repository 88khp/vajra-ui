#!/usr/bin/env bash
# vajra-ui is NOT a normal dependency in website/package.json — it's not
# possible to depend on it via yarn's "file:.." protocol, because yarn
# classic (1.x) COPIES the target directory for file: deps rather than
# symlinking. Since website/ lives inside the vajra-ui repo, that copy
# recursively includes website/ itself, which includes node_modules/vajra-ui,
# which includes website/ again — infinite self-nesting that exhausted disk
# space the first time this was tried (grew to 3GB+ before being caught).
#
# The fix: a real symlink (not yarn's copy) from website/node_modules/vajra-ui
# to the repo root, created here as a postinstall step so `yarn install`
# always leaves it in a working state instead of needing to be run once and
# never touched again.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEBSITE_DIR="$(dirname "$SCRIPT_DIR")"
LINK_PATH="$WEBSITE_DIR/node_modules/vajra-ui"
TARGET="../.."

mkdir -p "$WEBSITE_DIR/node_modules"

if [ -L "$LINK_PATH" ] && [ "$(readlink "$LINK_PATH")" = "$TARGET" ]; then
  :
else
  rm -rf "$LINK_PATH"
  ln -s "$TARGET" "$LINK_PATH"
  echo "Linked website/node_modules/vajra-ui -> repo root"
fi

# vajra-core is a separately published package, normally installed from
# npm (see package.json). While iterating locally before a publish, link it
# to the sibling vajra-core checkout instead so fixes there are visible
# in the docs site without needing a real npm publish first. Safe to symlink
# directly (not the relative-path trick above) since vajra-core lives
# outside this repo — no self-nesting risk.
CORE_LINK_PATH="$WEBSITE_DIR/node_modules/@88khp/vajra-core"
CORE_TARGET="/Users/rishavjha/Desktop/vajra-ui-core"

if [ -d "$CORE_TARGET" ]; then
  mkdir -p "$WEBSITE_DIR/node_modules/@88khp"
  if [ ! -L "$CORE_LINK_PATH" ] || [ "$(readlink "$CORE_LINK_PATH")" != "$CORE_TARGET" ]; then
    rm -rf "$CORE_LINK_PATH"
    ln -s "$CORE_TARGET" "$CORE_LINK_PATH"
    echo "Linked website/node_modules/@88khp/vajra-core -> $CORE_TARGET"
  fi
fi

# Same local-iteration reasoning as vajra-core above: link the sibling
# vajra-icons checkout instead of the npm-published copy so fixes there
# (e.g. its package.json "exports" map) are visible here without needing a
# real npm publish first.
ICONS_LINK_PATH="$WEBSITE_DIR/node_modules/@88khp/vajra-icons"
ICONS_TARGET="/Users/rishavjha/Desktop/vajra-ui-icons"

if [ -d "$ICONS_TARGET" ]; then
  mkdir -p "$WEBSITE_DIR/node_modules/@88khp"
  if [ ! -L "$ICONS_LINK_PATH" ] || [ "$(readlink "$ICONS_LINK_PATH")" != "$ICONS_TARGET" ]; then
    rm -rf "$ICONS_LINK_PATH"
    ln -s "$ICONS_TARGET" "$ICONS_LINK_PATH"
    echo "Linked website/node_modules/@88khp/vajra-icons -> $ICONS_TARGET"
  fi
fi
