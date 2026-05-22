import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出，纯前端站点
  output: "export",
  // GitHub Pages 子路径
  basePath: "/hhqpics",
  // 静态导出不支持 Next.js 图片优化
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
