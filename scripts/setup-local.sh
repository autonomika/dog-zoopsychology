#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "→ PostgreSQL (Docker)..."
docker compose up -d
sleep 3

echo "→ Схема БД..."
npm run db:push

echo ""
echo "✅ Готово. Запуск: npm run dev"
echo "   E2E: npm run test:e2e"
