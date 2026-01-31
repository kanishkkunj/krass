import path from "node:path";
import { fileURLToPath } from "node:url";
import { readdir, stat, writeFile, chmod, rename, rm } from "node:fs/promises";
import crypto from "node:crypto";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const targets = [
  path.join(projectRoot, "src", "assets", "portfolio"),
  path.join(projectRoot, "public", "images"),
  path.join(projectRoot, "public", "company.jpg"),
];

const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MAX_DIMENSION = 2400;
const JPEG_QUALITY = 72;
const PNG_QUALITY = 80;
const WEBP_QUALITY = 68;

async function gatherFiles(entryPath, collection) {
  try {
    const fileStat = await stat(entryPath);
    if (fileStat.isDirectory()) {
      const entries = await readdir(entryPath);
      await Promise.all(
        entries.map((entry) =>
          gatherFiles(path.join(entryPath, entry), collection)
        )
      );
    } else if (fileStat.isFile()) {
      const ext = path.extname(entryPath).toLowerCase();
      if (supportedExtensions.has(ext)) {
        collection.push(entryPath);
      }
    }
  } catch (error) {
    console.warn(`Skipping ${entryPath}: ${error.message}`);
  }
}

function applyFormat(pipeline, ext) {
  if (ext === ".png") {
    return pipeline.png({
      quality: PNG_QUALITY,
      compressionLevel: 9,
      palette: true,
    });
  }

  if (ext === ".webp") {
    return pipeline.webp({
      quality: WEBP_QUALITY,
    });
  }

  return pipeline.jpeg({
    quality: JPEG_QUALITY,
    mozjpeg: true,
  });
}

async function compressImage(filePath) {
  const originalStat = await stat(filePath);
  const ext = path.extname(filePath).toLowerCase();

  const metadata = await sharp(filePath).metadata();
  let pipeline = sharp(filePath).rotate();

  if (
    metadata.width &&
    metadata.height &&
    (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION)
  ) {
    pipeline = pipeline.resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  pipeline = applyFormat(pipeline, ext);

  const optimizedBuffer = await pipeline.toBuffer();

  if (optimizedBuffer.length >= originalStat.size * 0.98) {
    return { filePath, skipped: true };
  }

  const tempPath = `${filePath}.tmp-${crypto.randomUUID()}`;
  await writeFile(tempPath, optimizedBuffer);
  await chmod(filePath, 0o666).catch(() => undefined);
  await rm(filePath).catch(() => undefined);
  await rename(tempPath, filePath);
  const savedKb = (originalStat.size - optimizedBuffer.length) / 1024;
  return { filePath, savedKb };
}

async function main() {
  const files = [];
  for (const target of targets) {
    await gatherFiles(target, files);
  }

  if (!files.length) {
    console.log("No image files found for compression.");
    return;
  }

  let totalSaved = 0;
  let compressedCount = 0;
  let skippedCount = 0;

  for (const filePath of files) {
    const result = await compressImage(filePath);
    if (result.skipped) {
      skippedCount += 1;
      continue;
    }

    compressedCount += 1;
    totalSaved += result.savedKb ?? 0;
    console.log(
      `Compressed ${path.relative(projectRoot, result.filePath)} (-${result.savedKb?.toFixed(
        1
      )} kB)`
    );
  }

  console.log("Compression summary:");
  console.log(`  Files processed: ${files.length}`);
  console.log(`  Files optimized: ${compressedCount}`);
  console.log(`  Files skipped: ${skippedCount}`);
  console.log(`  Total savings: ${totalSaved.toFixed(1)} kB`);
}

main().catch((error) => {
  console.error("Image compression failed:", error);
  process.exit(1);
});
