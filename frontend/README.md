# DevFlow 项目管理 · Vue 3 前端

对接 NestJS 后端（默认 `http://localhost:3000/api/v1`）。

## 启动

```bash
npm install
cp .env.example .env.development
npm run dev    # http://localhost:5173
```

## 打包

```bash
npm run build   # 输出 dist/
```

## 目录

- `src/App.vue` — 主壳（顶部 + 状态切换）
- `src/api/client.ts` — 统一的 fetch 客户端（JWT、错误处理）
- `src/store/app.ts` — Pinia 主 store
- `src/modules/` — 7 个模块组件
