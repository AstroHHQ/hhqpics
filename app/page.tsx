/**
 * 首页 —— 摄影作品展示。
 * 引导文案 + PhotoContainer（统计 / 筛选 / 瀑布流 / 弹窗）。
 */

import PhotoContainer from "@/components/PhotoContainer";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      {/* 引导文案 */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
          摄影作品
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          按相机、镜头、焦距筛选浏览
        </p>
      </div>

      {/* 照片容器 — 包含统计、筛选、网格、弹窗 */}
      <PhotoContainer />
    </div>
  );
}
