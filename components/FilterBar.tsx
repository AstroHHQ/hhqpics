"use client";

/**
 * FilterBar —— 筛选栏。
 *
 * 三个下拉选择器：相机 / 镜头 / 焦距。
 * 已选筛选可单独清除，也可一键重置全部。
 */

import type { FilterOptions, Filters } from "@/lib/photos";

interface Props {
  options: FilterOptions;
  filters: Filters;
  onChange: (key: keyof Filters, value: string | null) => void;
  onReset: () => void;
}

/** 下拉选项的 key */
const FILTER_KEYS: { key: keyof Filters; label: string }[] = [
  { key: "camera", label: "相机" },
  { key: "lens", label: "镜头" },
  { key: "focalLength", label: "焦距" },
];

export default function FilterBar({ options, filters, onChange, onReset }: Props) {
  // 是否有任何已选筛选
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {FILTER_KEYS.map(({ key, label }) => {
        const values =
          key === "camera"
            ? options.cameras
            : key === "lens"
              ? options.lenses
              : options.focalLengths;
        const current = filters[key];

        return (
          <div key={key} className="relative">
            <select
              value={current || ""}
              onChange={(e) => onChange(key, e.target.value || null)}
              className="
                appearance-none bg-white border border-gray-200
                rounded-lg px-3 py-2 pr-8
                text-sm text-gray-700
                focus:outline-none focus:ring-2 focus:ring-gray-200
                cursor-pointer
              "
            >
              <option value="">全部{label}</option>
              {values.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            {/* 下拉箭头 */}
            <svg
              className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </div>
        );
      })}

      {/* 清除筛选 */}
      {hasFilters && (
        <button
          onClick={onReset}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          清除筛选
        </button>
      )}
    </div>
  );
}
