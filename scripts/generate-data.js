/**
 * 数据生成脚本 —— 扫描 public/photos/ 下所有照片，
 * 用 exifreader 提取 EXIF，用 image-size 读取尺寸，
 * 生成 data/photos.json。
 *
 * 用法：npm run generate
 */

const fs = require("fs");
const path = require("path");
const { ExifReader } = require("exifreader");
const sizeOf = require("image-size");

// 支持的扩展名
const SUPPORTED_EXTS = new Set([".jpg", ".jpeg", ".png"]);

// public/photos 目录
const PHOTOS_DIR = path.join(__dirname, "..", "public", "photos");
// 输出的 JSON 文件
const OUTPUT_FILE = path.join(__dirname, "..", "data", "photos.json");

/**
 * 从 EXIF tags 中安全提取字符串。
 * 优先取 description，否则用 value。
 */
function getString(tags, name) {
  const tag = tags[name];
  if (!tag) return null;
  return tag.description || String(tag.value || "").trim() || null;
}

/** 提取 ISO 数值 */
function getNumber(tags, name) {
  const tag = tags[name];
  if (!tag || tag.value === undefined) return null;
  const num = Number(tag.value);
  return Number.isNaN(num) ? null : num;
}

/** 提取焦距（说明文字，如 "70mm"） */
function getFocalLength(tags) {
  const desc = getString(tags, "FocalLength");
  if (desc) return desc;
  // 有些照片没有 description，只有 value 如 70
  const tag = tags["FocalLength"];
  if (tag?.value) return String(tag.value) + "mm";
  return null;
}

/** 提取光圈（说明文字，如 "f/2.8"） */
function getAperture(tags) {
  const desc = getString(tags, "FNumber");
  if (desc) return desc;
  const tag = tags["FNumber"];
  if (tag?.value) return "f/" + tag.value;
  return null;
}

/** 提取快门（说明文字，如 "1/250"） */
function getShutterSpeed(tags) {
  const desc = getString(tags, "ExposureTime");
  if (desc) return desc;
  // 如果没有 description，尝试从 value 拼
  const tag = tags["ExposureTime"];
  if (tag?.value) {
    const val = tag.value;
    // 如果 val < 1，显示为 1/xxx
    if (typeof val === "number" && val < 1 && val > 0)
      return "1/" + Math.round(1 / val);
    return String(val);
  }
  return null;
}

/** 提取拍摄时间，转 ISO 8601 */
function getDateTaken(tags) {
  const tag = tags["DateTimeOriginal"];
  if (!tag) return null;
  if (tag.description) {
    // "2024:01:15 14:30:00" → "2024-01-15T14:30:00"
    return String(tag.description).replace(
      /^(\d{4}):(\d{2}):(\d{2}) /,
      "$1-$2-$3T"
    );
  }
  return null;
}

/** 处理单张照片 */
function processPhoto(filePath, relPath) {
  const buffer = fs.readFileSync(filePath);
  const tags = ExifReader.load(buffer);

  // 图片尺寸
  let width = null;
  let height = null;
  try {
    const dims = sizeOf(filePath);
    width = dims.width;
    height = dims.height;
  } catch {}

  return {
    filename: relPath, // 相对路径，如 "DSC0001.jpg"
    // EXIF 字段
    cameraModel: getString(tags, "Model"),
    lensModel: getString(tags, "LensModel"),
    focalLength: getFocalLength(tags),
    iso: getNumber(tags, "ISOSpeedRatings"),
    aperture: getAperture(tags),
    shutterSpeed: getShutterSpeed(tags),
    dateTaken: getDateTaken(tags),
    // 尺寸
    width,
    height,
  };
}

/** 递归扫描目录 */
function walkDir(dir, baseDir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath, baseDir));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTS.has(ext)) {
        const relPath = path.relative(baseDir, fullPath);
        files.push(fullPath);
      }
    }
  }
  return files;
}

// 主流程
console.log("扫描照片目录:", PHOTOS_DIR);

if (!fs.existsSync(PHOTOS_DIR)) {
  console.error("目录不存在，请先创建 public/photos/ 并放入照片");
  process.exit(1);
}

const photoPaths = walkDir(PHOTOS_DIR, PHOTOS_DIR);
console.log(`找到 ${photoPaths.length} 张照片`);

const photos = photoPaths.map((fp, i) => {
  const relPath = path.relative(PHOTOS_DIR, fp);
  console.log(`  [${i + 1}/${photoPaths.length}] ${relPath}`);
  try {
    return processPhoto(fp, relPath);
  } catch (err) {
    console.error(`  处理失败: ${relPath}`, err.message);
    return null;
  }
}).filter(Boolean);

// 添加 id
photos.forEach((p, i) => {
  p.id = i + 1;
});

// 确保 data 目录存在
const dataDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(photos, null, 2));
console.log(`已生成 ${OUTPUT_FILE} (${photos.length} 条记录)`);
