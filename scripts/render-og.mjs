#!/usr/bin/env node
/** Social preview image: node scripts/render-og.mjs */
import sharp from "sharp";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(root, "public/og.png");

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5c6b4a"/>
      <stop offset="100%" stop-color="#818f6b"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="980" cy="120" r="180" fill="#ffffff" opacity="0.06"/>
  <circle cx="180" cy="520" r="140" fill="#ffffff" opacity="0.05"/>
  <text x="80" y="260" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="700" fill="#fefefe">Зоопсихология</text>
  <text x="80" y="330" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="700" fill="#fefefe">собаки</text>
  <text x="80" y="410" font-family="Arial, Helvetica, sans-serif" font-size="34" fill="#e8efe0">EdTech · тесты · курс · ЮKassa · PWA</text>
  <text x="80" y="560" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#d4dcc8">dog-zoopsychology.vercel.app</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(dest);
console.log("✓ og.png (1200x630)");
