/**
 * 数据层 —— 从预生成的 JSON 导入照片数据，
 * 提供查询、统计、筛选等纯函数。
 *
 * 因为站点是静态导出的，所以照片数据必须内联到构建产物中。
 * 每次更新照片后运行 npm run generate → npm run build 即可。
 */

import photosData from "@/data/photos.json";

// GitHub Pages 部署子路径
export const BASE_PATH = "/hhqpics";

/** 照片数据类型 */
export interface Photo {
  id: number;
  filename: string;
  cameraModel: string | null;
  lensModel: string | null;
  focalLength: string | null;
  iso: number | null;
  aperture: string | null;
  shutterSpeed: string | null;
  dateTaken: string | null;
  width: number | null;
  height: number | null;
}

/** 统计项 */
export interface StatItem {
  value: string;
  count: number;
}

/** 统计面板数据 */
export interface Stats {
  cameras: StatItem[];
  lenses: StatItem[];
  focalLengths: StatItem[];
  isos: StatItem[];
  apertures: StatItem[];
  shutterSpeeds: StatItem[];
  totalPhotos: number;
}

/** 筛选选项 */
export interface FilterOptions {
  cameras: string[];
  lenses: string[];
  focalLengths: string[];
}

/** 筛选条件 */
export interface Filters {
  camera: string | null;
  lens: string | null;
  focalLength: string | null;
}

// 类型断言：确保 JSON 数据符合 Photo[]
const photos: Photo[] = photosData as Photo[];

/** 获取所有照片 */
export function getAllPhotos(): Photo[] {
  return photos;
}

/** 按 ID 获取单张照片 */
export function getPhotoById(id: number): Photo | undefined {
  return photos.find((p) => p.id === id);
}

/** 获取照片的完整 URL（含 basePath 前缀） */
export function getPhotoUrl(filename: string): string {
  return `${BASE_PATH}/photos/${filename}`;
}

/** 将 null 统一为 "未知" */
function label(val: unknown): string {
  if (val === null || val === undefined || val === "") return "未知";
  return String(val);
}

/** 获取统计面板数据 */
export function getStats(): Stats {
  const aggregate = (fn: (p: Photo) => string): StatItem[] => {
    const map: Record<string, number> = {};
    for (const p of photos) {
      const key = label(fn(p));
      map[key] = (map[key] || 0) + 1;
    }
    return Object.entries(map)
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count);
  };

  return {
    cameras: aggregate((p) => p.cameraModel),
    lenses: aggregate((p) => p.lensModel),
    focalLengths: aggregate((p) => p.focalLength),
    isos: aggregate((p) => (p.iso != null ? String(p.iso) : "")),
    apertures: aggregate((p) => p.aperture),
    shutterSpeeds: aggregate((p) => p.shutterSpeed),
    totalPhotos: photos.length,
  };
}

/** 获取可用的筛选选项（去重排序） */
export function getFilterOptions(): FilterOptions {
  const unique = (fn: (p: Photo) => string | null): string[] => {
    const set = new Set<string>();
    for (const p of photos) {
      const val = fn(p);
      if (val) set.add(val);
    }
    return Array.from(set).sort();
  };

  return {
    cameras: unique((p) => p.cameraModel),
    lenses: unique((p) => p.lensModel),
    focalLengths: unique((p) => p.focalLength),
  };
}

/** 根据筛选条件过滤照片 */
export function filterPhotos(filters: Filters): Photo[] {
  return photos.filter((p) => {
    if (filters.camera && p.cameraModel !== filters.camera) return false;
    if (filters.lens && p.lensModel !== filters.lens) return false;
    if (filters.focalLength && p.focalLength !== filters.focalLength) return false;
    return true;
  });
}
