#!/usr/bin/env bash
set -euo pipefail

export GH_CONFIG_DIR="${GH_CONFIG_DIR:-$HOME/.local/share/gh}"
mkdir -p "$GH_CONFIG_DIR"

echo "GitHub config: $GH_CONFIG_DIR"
gh auth login -h github.com -p https -w
