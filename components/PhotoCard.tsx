"use client";

/**
 * PhotoCard —— 单张照片卡片。
 *
 * 展示缩略图 + 底部 EXIF 简要信息（相机型号 / 焦距·光圈）。
 * 悬停时阴影加深，点击触发回调。
 */

import { useState } from "react";
import type { Photo } from "@/lib/photos";
import { getPhotoUrl } from "@/lib/photos";

interface Props {
  photo: Photo;
  onClick: (id: number) => void;
}

export default function PhotoCard({ photo, onClick }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      onClick={() => onClick(photo.id)}
      className="
        break-inside-avoid mb-6
        bg-white rounded-xl border border-gray-100
        shadow-sm hover:shadow-md
        transition-shadow duration-200
        overflow-hidden cursor-pointer
      "
    >
      {/* 缩略图 */}
      <div className="relative bg-gray-50">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
          </div>
        )}
        <img
          src={getPhotoUrl(photo.filename)}
          alt={`照片 ${photo.id}`}
          onLoad={() => setLoaded(true)}
          className={`w-full block transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* 底部 EXIF 信息 */}
      <div className="px-3 py-2.5 flex items-center justify-between">
        <span className="text-xs text-gray-600 truncate max-w-[60%]">
          {photo.cameraModel || "未知相机"}
        </span>
        <span className="text-xs text-gray-400 shrink-0">
          {[photo.focalLength, photo.aperture].filter(Boolean).join(" · ") ||
            "—"}
        </span>
      </div>
    </div>
  );
}
