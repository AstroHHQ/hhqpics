"use client";

/**
 * PhotoContainer —— 客户端状态管理中心。
 *
 * 职责：
 * - 管理筛选条件 filters 和当前选中照片 selectedPhotoId
 * - 组合渲染 StatsPanel、FilterBar、PhotoGrid、PhotoModal
 */

import { useState, useMemo } from "react";
import {
  getStats,
  getFilterOptions,
  filterPhotos,
  type Filters,
} from "@/lib/photos";
import StatsPanel from "./StatsPanel";
import FilterBar from "./FilterBar";
import PhotoGrid from "./PhotoGrid";
import PhotoModal from "./PhotoModal";

export default function PhotoContainer() {
  const [filters, setFilters] = useState<Filters>({
    camera: null,
    lens: null,
    focalLength: null,
  });
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(null);

  // 数据是静态的，用 useMemo 只算一次
  const stats = useMemo(() => getStats(), []);
  const filterOptions = useMemo(() => getFilterOptions(), []);

  // 根据筛选条件过滤
  const filteredPhotos = useMemo(() => filterPhotos(filters), [filters]);

  // 更新单个筛选条件
  const handleFilterChange = (key: keyof Filters, value: string | null) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 重置所有筛选
  const handleResetFilters = () => {
    setFilters({ camera: null, lens: null, focalLength: null });
  };

  // 弹窗导航：上一张 / 下一张
  const currentIndex = selectedPhotoId
    ? filteredPhotos.findIndex((p) => p.id === selectedPhotoId)
    : -1;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedPhotoId(filteredPhotos[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredPhotos.length - 1) {
      setSelectedPhotoId(filteredPhotos[currentIndex + 1].id);
    }
  };

  return (
    <>
      {/* 统计面板 */}
      <StatsPanel stats={stats} />

      {/* 筛选栏 */}
      <FilterBar
        options={filterOptions}
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* 照片瀑布流 */}
      <PhotoGrid
        photos={filteredPhotos}
        onPhotoClick={(id) => setSelectedPhotoId(id)}
      />

      {/* 照片详情弹窗 */}
      {selectedPhotoId && (
        <PhotoModal
          photoId={selectedPhotoId}
          photos={filteredPhotos}
          onClose={() => setSelectedPhotoId(null)}
          onPrev={currentIndex > 0 ? handlePrev : undefined}
          onNext={
            currentIndex < filteredPhotos.length - 1 ? handleNext : undefined
          }
        />
      )}
    </>
  );
}
