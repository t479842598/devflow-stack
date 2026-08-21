# Changelog

## [v1.0.2] - 2026-08-21

### 🐛 修复
- **macOS 产物上传**：修正交叉编译路径（`target/aarch64-apple-darwin/release/bundle/`），macOS `.dmg` 现已成功上传到 Release

## [v1.0.1] - 2026-08-21

### 🐛 修复
- **登录报错修复**：前端 API 路径 `/api/v1` → `/api`，与后端 `setGlobalPrefix('api')` 对齐，解决登录时报 `Unexpected token '<'`（响应 HTML 被当 JSON 解析）
- **macOS 产物上传**：修正 GitHub Actions 产物路径，确保 macOS `.app` / `.dmg` 上传到 Release

## [v1.0.0] - 2026-08-21

### ✨ 正式版发布

首个正式版发布，三端齐备。

**新增**
- **技术选型中心**：6 类场景（管理系统 / Agent 开发 / 微信小程序 / 支付宝小程序 / 抖音小程序 / HBuilderX 多平台 / Vue 项目）× 前端/后端框架四维对比（开发效率、性能体验、维护成本、后端匹配），AI 规则引擎推荐 + 综合分排序
- **需求管理**：录入、拆解、P0/P1/P2 优先级、状态跟踪，AI 拆解子任务建议
- **设计计划**：设计文档大纲生成、阶段排期 + 内联 SVG 甘特图，关联选型结果
- **前端样式**：UI 组件库 / 设计规范 / 页面样式资源管理，按选型结果推荐组件库
- **后端框架**：架构分层建议、RESTful 接口清单生成、OpenAPI 规范
- **环境与联调**：开发 / 测试 / 预发 / 生产环境事项管理，联调状态跟踪
- **交付管理**：测试 / 部署 / 上线交付状态跟踪，AI 上线检查清单
- **AI 规划助手**：每个模块内置规则引擎推荐 + 一键复制 AI 提示词
- **统一操作流**：选型 → 提需求 → 设计计划 → 前端样式 → 后端框架 → 环境联调 → 交付，一站式场景化工作流
- **Web 端**：Vue3 + Vite + TS + Pinia 单页工作台，移动端适配
- **桌面端**：Tauri 2.0 跨 macOS / Windows，系统托盘 + 原生菜单
- **后端**：NestJS + Prisma + MySQL + Redis，JWT + RBAC 认证，Swagger 文档
- **CI/CD**：GitHub Actions 双 OS（macOS aarch64 / Windows x86_64）自动打包发布

### 修复
- 首个版本无历史修复

### 技术栈
- 前端：Vue 3.5 / Vite 6 / TypeScript 5.7 / Pinia 2.2
- 桌面：Tauri 2.0 / Rust stable
- 后端：NestJS 10 / Prisma 6 / MySQL 8 / Redis 7 / JWT
