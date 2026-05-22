/**
 * 根布局 —— 全站外层框架。
 * 顶部导航栏 sticky + 毛玻璃效果。
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "hhqpics",
  description: "摄影作品展示",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-white text-gray-900">
        {/* 顶部导航栏 — 毛玻璃 */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center">
            <h1 className="text-lg font-semibold tracking-tight">hhqpics</h1>
          </div>
        </header>

        {/* 主内容区 */}
        <main className="max-w-7xl mx-auto px-6 py-12">{children}</main>
      </body>
    </html>
  );
}
