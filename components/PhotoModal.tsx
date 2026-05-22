"use client";

/**
 * PhotoModal —— 照片详情弹窗。
 *
 * 全屏覆盖，左图右 EXIF。
 * - 按 Esc 关闭
 * - 按 ← → 切换前后照片
 * - 点击遮罩区域关闭
 * - 右上角关闭按钮
 */

import { useEffect, useCallback } from "react";
import type { Photo } from "@/lib/photos";
import { getPhotoUrl } from "@/lib/photos";

interface Props {
  photoId: number;
  photos: Photo[];
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

/** EXIF 字段显示配置 */
const EXIF_FIELDS: { label: string; key: keyof Photo }[] = [
  { label: "相机型号", key: "cameraModel" },
  { label: "镜头型号", key: "lensModel" },
  { label: "焦距", key: "focalLength" },
  { label: "光圈", key: "aperture" },
  { label: "快门", key: "shutterSpeed" },
  { label: "ISO", key: "iso" },
  { label: "拍摄时间", key: "dateTaken" },
  { label: "尺寸", key: "width" }, // 特殊处理
];

export default function PhotoModal({
  photoId,
  photos,
  onClose,
  onPrev,
  onNext,
}: Props) {
  const photo = photos.find((p) => p.id === photoId);
  const index = photo ? photos.indexOf(photo) : -1;

  // 键盘事件
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    // 阻止页面滚动
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  if (!photo) return null;

  /** 格式化尺寸 */
  const formatDimensions = (p: Photo): string => {
    if (p.width && p.height) return `${p.width} × ${p.height}`;
    return "—";
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center"
      onClick={onClose}
    >
      {/* 内容区 — 点击不关闭 */}
      <div
        className="bg-white rounded-2xl overflow-hidden flex max-w-5xl w-[95vw] max-h-[90vh] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 左侧：照片 */}
        <div className="flex-1 bg-gray-900 flex items-center justify-center min-w-0">
          <img
            src={getPhotoUrl(photo.filename)}
            alt={`照片 ${photo.id}`}
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>

        {/* 右侧：EXIF 面板 */}
        <div className="w-72 shrink-0 p-6 overflow-y-auto">
          {/* 关闭按钮 */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">照片详情</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 导航按钮 */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={onPrev}
              disabled={!onPrev}
              className="flex-1 text-xs py-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-default hover:bg-gray-50 transition-colors"
            >
              ← 上一张
            </button>
            <button
              onClick={onNext}
              disabled={!onNext}
              className="flex-1 text-xs py-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-default hover:bg-gray-50 transition-colors"
            >
              下一张 →
            </button>
          </div>

          <p className="text-xs text-gray-400 mb-3">
            {index + 1} / {photos.length}
          </p>

          {/* EXIF 字段 */}
          <dl className="space-y-1">
            {EXIF_FIELDS.map(({ label, key }) => (
              <div
                key={key}
                className="flex justify-between py-1.5 border-b border-gray-50 last:border-0"
              >
                <dt className="text-xs text-gray-400">{label}</dt>
                <dd className="text-xs text-gray-700 font-medium">
                  {key === "width"
                    ? formatDimensions(photo)
                    : String(photo[key] ?? "—")}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
