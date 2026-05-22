# hhqpics

静态摄影作品展示站，部署到 GitHub Pages。

## 技术栈

- Next.js 15（静态导出）
- Tailwind CSS 4
- TypeScript
- ExifReader（生成数据用）

## 使用方法

### 1. 放入照片

把照片放到 `public/photos/` 目录下，支持子文件夹：

```
public/photos/
├── 2024/
│   ├── DSC0001.jpg
│   └── DSC0002.jpg
└── misc/
    └── IMG_001.png
```

### 2. 生成数据

```bash
npm install
npm run generate   # 扫描照片、读 EXIF、生成 data/photos.json
```

### 3. 本地预览

```bash
npm run dev        # 开发模式预览
```

### 4. 构建

```bash
npm run generate   # 每次换照片后需要重新生成
npm run build      # 产物在 out/ 目录
```

## GitHub Pages 部署

1. 在 GitHub 上创建仓库 `hhqpics`
2. 设置 → Pages → Source 选 **GitHub Actions**
3. 推送代码到 `main` 分支，GitHub Actions 会自动构建并部署

每次更新照片后：放入新照片 → `npm run generate` → 提交 → 推送，CI 会自动重新部署。

## 项目结构

```
├── public/photos/              # 照片存放目录
├── data/photos.json            # 脚本生成的 EXIF 数据
├── scripts/generate-data.js    # 扫描照片生成 JSON
├── app/
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页
│   └── globals.css             # 全局样式
├── components/
│   ├── PhotoContainer.tsx       # 客户端状态容器
│   ├── StatsPanel.tsx           # EXIF 统计面板
│   ├── FilterBar.tsx            # 筛选栏（相机/镜头/焦距）
│   ├── PhotoGrid.tsx            # 瀑布流布局
│   ├── PhotoCard.tsx            # 照片卡片
│   └── PhotoModal.tsx           # 照片详情弹窗
├── lib/photos.ts                # 数据层（查询/统计/筛选）
└── .github/workflows/deploy.yml # GitHub Actions 自动部署
```
