#!/bin/sh
set -eu

LOCKFILE_HASH_FILE="node_modules/.package-lock.hash"
CURRENT_LOCKFILE_HASH="$(sha256sum package-lock.json | awk '{print $1}')"
INSTALLED_LOCKFILE_HASH=""

if [ -f "$LOCKFILE_HASH_FILE" ]; then
  INSTALLED_LOCKFILE_HASH="$(cat "$LOCKFILE_HASH_FILE")"
fi

if [ ! -d node_modules ] || [ "$CURRENT_LOCKFILE_HASH" != "$INSTALLED_LOCKFILE_HASH" ]; then
  echo "Installing frontend dependencies..."
  npm ci
  printf '%s' "$CURRENT_LOCKFILE_HASH" > "$LOCKFILE_HASH_FILE"
fi

exec npm run dev
