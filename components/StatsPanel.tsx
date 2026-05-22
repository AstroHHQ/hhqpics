"use client";

/**
 * StatsPanel —— EXIF 参数统计面板。
 *
 * 横向排列 6 个统计卡片：相机、镜头、焦距、ISO、光圈、快门。
 * 每卡片显示 Top 5 参数值和出现次数。
 * 超出屏幕宽度时支持横向滚动。
 */

import type { Stats } from "@/lib/photos";

/** 卡片标题映射 */
const CARD_LABELS: { key: keyof Omit<Stats, "totalPhotos">; title: string }[] = [
  { key: "cameras", title: "相机型号" },
  { key: "lenses", title: "镜头" },
  { key: "focalLengths", title: "焦距" },
  { key: "isos", title: "ISO" },
  { key: "apertures", title: "光圈" },
  { key: "shutterSpeeds", title: "快门" },
];

interface Props {
  stats: Stats;
}

export default function StatsPanel({ stats }: Props) {
  if (stats.totalPhotos === 0) return null;

  return (
    <div className="w-full">
      {/* 照片总数 */}
      <p className="text-xs text-gray-400 mb-3">
        共 {stats.totalPhotos} 张照片
      </p>

      {/* 统计卡片 — 横向滚动 */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {CARD_LABELS.map(({ key, title }) => {
          const items = stats[key];
          return (
            <div
              key={key}
              className="
                bg-white rounded-2xl border border-gray-100
                p-4 min-w-[160px] shrink-0
              "
            >
              {/* 卡片标题 */}
              <h4 className="text-xs text-gray-400 mb-2">{title}</h4>

              {/* Top 5 */}
              {items.length === 0 && (
                <p className="text-xs text-gray-300">暂无数据</p>
              )}
              {items.slice(0, 5).map((item) => (
                <div
                  key={item.value}
                  className="flex items-center justify-between py-1 first:pt-0 last:pb-0"
                >
                  <span className="text-sm text-gray-700 truncate mr-2">
                    {item.value}
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded shrink-0">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
