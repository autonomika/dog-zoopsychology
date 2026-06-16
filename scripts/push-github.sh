#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

# ~/.config owned by root on some Macs — use a writable gh config dir
export GH_CONFIG_DIR="${GH_CONFIG_DIR:-$HOME/.local/share/gh}"
mkdir -p "$GH_CONFIG_DIR"

if ! gh auth status >/dev/null 2>&1; then
  echo "Сначала войдите в GitHub:"
  echo "  ./scripts/gh-auth.sh"
  echo "Или: GH_CONFIG_DIR=\"\$HOME/.local/share/gh\" gh auth login -h github.com -p https -w"
  exit 1
fi

REPO="${1:-dog-zoopsychology}"
VISIBILITY="${2:-public}"

if git remote get-url origin >/dev/null 2>&1; then
  echo "Remote origin уже настроен."
else
  gh repo create "$REPO" --"$VISIBILITY" --source=. --remote=origin --description "EdTech: zoopsychology course with auth, tests, YooKassa payments"
fi

git push -u origin main

echo ""
echo "✅ GitHub: https://github.com/$(gh api user -q .login)/$REPO"
