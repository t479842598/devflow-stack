# TechFlow 后端（NestJS + Prisma + MySQL + Redis）

技术选型与项目管理工作台的完整后端。前端 Vue3 工作台通过 REST API 直连本服务。

## 快速开始

```bash
# 1. 本地开发（推荐用 docker-compose 拉起 MySQL+Redis，省去手动装）
cd tech-flow-backend
cp .env.example .env

# 2. 启动依赖（MySQL + Redis）
docker-compose up -d mysql redis

# 3. 安装依赖 + 初始化数据库
npm install
npx prisma migrate dev       # 首次会创建 schema
npx prisma db seed           # 创建 admin / 示例项目

# 4. 启动后端
npm run dev                  # http://localhost:3000  + Swagger /docs
```

健康检查：`GET /api/auth/profile`（需登录 JWT）。

## 全量 Docker 一键拉起

```bash
docker-compose up -d --build
curl http://localhost:3000/api/auth/login -d '{"username":"admin","password":"admin12345"}' \
  -H "Content-Type: application/json"
```

## API 一览（全部需 Bearer JWT，除 POST /api/auth/login）

| 业务 | 路径 | 操作 |
|------|------|------|
| 认证 | `/api/auth/register`,`/api/auth/login`,`/api/auth/seed-admin`,`/api/auth/profile` | POST/GET |
| 项目 | `/api/projects` | GET 列表/POST 新建/GET :id 详情/PATCH/DELETE |
| 需求 | `/api/requirements` | 同上 |
| 技术选型 | `/api/options` | 同上 |
| 设计计划 | `/api/designs` | 同上 |
| 前端样式 | `/api/fes` | 同上 |
| 后端框架 | `/api/bes` | 同上 |
| 环境与联调 | `/api/envs` | 同上 |
| 交付管理 | `/api/dels` | 同上 |
| AI 提示词 | `/api/ai-prompt/project/:id`, `/api/ai-prompt/recommend/:scene` | GET |

## 数据模型（8 张 Prisma 模型）

`User` / `Project` / `TechOption` / `Requirement` / `DesignPlan` / `Frontend` / `Backend` / `EnvItem` / `DeliverItem`

项目名 `Project.name` 是所有明细表的业务关联键（级联删除）。

## 首次生产部署建议

1. `docker-compose up -d`
2. `POST /api/auth/seed-admin`（用 `ADMIN_PWD` 环境变量初始化 admin）
3. 前端工作台配置 `API_BASE=https://api.your-domain.com`
4. 在 nginx/caddy 层做 HTTPS + 访问日志
