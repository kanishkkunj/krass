import path from "node:path";
import { fileURLToPath } from "node:url";
import { readdir, stat, rm } from "node:fs/promises";
import { createReadStream } from "node:fs";
import crypto from "node:crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const portfolioDir = path.join(projectRoot, "src", "assets", "portfolio");
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

async function collectFiles(entryPath, files) {
  const stats = await stat(entryPath);
  if (stats.isDirectory()) {
    const entries = await readdir(entryPath);
    for (const entry of entries) {
      await collectFiles(path.join(entryPath, entry), files);
    }
    return;
  }

  if (stats.isFile()) {
    const ext = path.extname(entryPath).toLowerCase();
    if (supportedExtensions.has(ext)) {
      files.push(entryPath);
    }
  }
}

function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = createReadStream(filePath);
    stream.on("error", reject);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

async function removeDuplicates(files) {
  const hashMap = new Map();
  const removed = [];

  for (const filePath of files) {
    const hash = await hashFile(filePath);
    if (hashMap.has(hash)) {
      await rm(filePath);
      removed.push({ duplicate: filePath, kept: hashMap.get(hash) });
      continue;
    }

    hashMap.set(hash, filePath);
  }

  return removed;
}

async function main() {
  const files = [];
  await collectFiles(portfolioDir, files);
  if (!files.length) {
    console.log("No portfolio images found.");
    return;
  }

  console.log(`Scanning ${files.length} images for duplicates...`);
  const removed = await removeDuplicates(files);
  if (!removed.length) {
    console.log("No duplicate images detected.");
    return;
  }

  console.log("Removed duplicates:");
  removed.forEach(({ duplicate, kept }) => {
    console.log(`  Removed ${path.relative(projectRoot, duplicate)} (kept ${path.relative(projectRoot, kept)})`);
  });
}

main().catch((error) => {
  console.error("Duplicate removal failed:", error);
  process.exit(1);
});
