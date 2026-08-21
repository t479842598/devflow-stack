# CHANGELOG

## [0.10.0] - 2026-08-21

### 新增
- **工作台 MVP**：技术选型 → 需求管理 → 设计计划 → 前端样式 → 后端框架 → 环境与联调 → 交付管理 全七模块
- **AI 规划助手**：每个模块的规则引擎 + 一键复制 AI 提示词
- **数据库**：8 张核心业务表 + 用户表（projects / options / reqs / designs / fes / bes / envs / deliverables / users）
- **三端同步**：
  - Web：Vue 3 + Vite + TypeScript
  - Desktop：Tauri 2.0 (macOS / Windows / Linux)
  - Prototype：单文件 HTML + 资料库数据表
- **架构**：NestJS + Prisma + MySQL + Redis（REST API / Swagger / JWT / RBAC）
- **开发体验**：Docker Compose 服务编排、Prisma ORM、Vite HMR、TS 严格模式

### 内置知识库
- 7 大应用场景：管理系统、Agent 开发、微信 / 支付宝 / 抖音小程序、HBuilderX 跨端、Vue 项目
- 场景化推荐：前端 + 后端最佳搭配组合、常用组件库、API 模板

### 工程化
- **版本同步脚本**：scripts/sync-version.mjs（一键同步 package.json / tauri.conf.json / Cargo.toml）
- **代码规范**：ESLint + Prettier + TypeScript Strict
- **文档体系**：README 三端 + AI 提示词上下文模板

