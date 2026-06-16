#!/usr/bin/env node
/** Regenerate PNG icons from SVG: node scripts/render-icons.mjs */
import sharp from "sharp";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const iconsDir = join(root, "public/icons");

async function render(svgName, pngName, size) {
  const src = join(iconsDir, svgName);
  const dest = join(iconsDir, pngName);
  await sharp(readFileSync(src)).resize(size, size).png().toFile(dest);
  console.log(`✓ ${pngName} (${size}x${size})`);
}

await render("icon.svg", "icon-512.png", 512);
await render("icon-maskable.svg", "icon-512-maskable.png", 512);
await render("icon.svg", "icon-192.png", 192);
await render("icon.svg", "apple-touch-icon.png", 180);
