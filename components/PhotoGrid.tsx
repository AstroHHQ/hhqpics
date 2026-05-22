"use client";

/**
 * PhotoGrid —— 照片瀑布流。
 *
 * CSS columns 实现响应式布局：
 * - 移动端 1 列
 * - sm 2 列
 * - lg 3 列
 * - xl 4 列
 */

import type { Photo } from "@/lib/photos";
import PhotoCard from "./PhotoCard";

interface Props {
  photos: Photo[];
  onPhotoClick: (id: number) => void;
}

export default function PhotoGrid({ photos, onPhotoClick }: Props) {
  // 空状态
  if (photos.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-gray-400">暂无照片</p>
      </div>
    );
  }

  return (
    <div className="w-full columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} onClick={onPhotoClick} />
      ))}
    </div>
  );
}
