import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { STANDARD_SCENES } from '../common/scenes';

const KB = {
  '管理系统': {
    pairs: [
      { front: 'Vue3 + Vite + Element Plus', back: 'NestJS + Prisma + MySQL', team: '全栈 TS，最稳' },
      { front: 'Vue3 + Vite + Element Plus', back: 'Spring Boot + MyBatis-Plus', team: '企业级首选' },
    ],
    uiRecs: ['Element Plus', 'ECharts', 'wangEditor', 'UnoCSS'],
    arch:
      'Controller → Service → DAO；RBAC 权限（用户/角色/菜单）；审计日志独立中间件；Prisma 事务；Redis 缓存用户菜单与热点列表。',
    apiTmpl: [
      ['GET', '/api/{module}/list', '分页列表（含筛选/排序）'],
      ['GET', '/api/{module}/:id', '详情'],
      ['POST', '/api/{module}', '新增'],
      ['PATCH', '/api/{module}/:id', '更新'],
      ['DELETE', '/api/{module}/:id', '删除'],
      ['POST', '/api/{module}/export', '导出 CSV（后台任务）'],
      ['POST', '/api/auth/login', '登录'],
      ['GET', '/api/auth/profile', '我的信息'],
      ['GET', '/api/auth/menus', '按角色下发菜单'],
    ],
  },
  'Agent开发': {
    pairs: [
      { front: 'Vue3 + Vite + Pinia + markdown-it', back: 'Hono + LangChain.js', team: '边缘部署、流式好' },
      { front: 'Vue3 + Vite', back: 'FastAPI + LangChain', team: 'Python AI 生态全' },
    ],
  },
  微信小程序: {
    pairs: [
      { front: '微信原生 + TypeScript', back: 'NestJS + MySQL', team: '性能最优' },
      { front: 'uni-app(Vue3)', back: 'NestJS', team: '多端复用' },
    ],
  },
  支付宝小程序: {
    pairs: [
      { front: '支付宝原生', back: 'NestJS + MySQL', team: '支付/信用能力直接' },
      { front: 'uni-app(Vue3)', back: 'NestJS', team: '代码复用微信' },
    ],
  },
  抖音小程序: {
    pairs: [
      { front: '抖音原生', back: 'NestJS + MySQL + Redis', team: '担保支付、审核最快' },
      { front: 'uni-app(Vue3)', back: 'NestJS', team: '多端试错' },
    ],
  },
  HBuilderX多平台: {
    pairs: [
      { front: 'uni-app x + UTS', back: 'NestJS + Prisma', team: 'APP 原生性能好' },
      { front: 'uni-app(Vue3)', back: 'NestJS', team: '生态最全' },
    ],
  },
  Vue项目: {
    pairs: [
      { front: 'Vue3 + Vite + Element Plus', back: 'NestJS', team: '中后台标杆' },
      { front: 'Vue3 + Nuxt3', back: 'NestJS', team: 'SSR/SEO' },
    ],
  },
};

@Injectable()
export class AiPromptService {
  constructor(private readonly prisma: PrismaService) {}

  /** 构建工作台前端可直接渲染或发给外部 AI 的整体提示词 */
  async buildProjectPrompt(projectId: string) {
    const proj = await this.prisma.project.findUniqueOrThrow({
      where: { id: projectId },
    });
    const reqs = await this.prisma.requirement.findMany({
      where: { proj: proj.name },
      select: {
        title: true,
        priority: true,
        status: true,
        due: true,
        ownerName: true,
      },
      orderBy: [{ priority: 'asc' }, { due: 'asc' }],
    });
    const options = await this.prisma.techOption.findMany({
      where: { proj: proj.name },
    });
    const bes = await this.prisma.backend.findMany({
      where: { proj: proj.name },
    });
    const envs = await this.prisma.envItem.findMany({
      where: { proj: proj.name },
    });
    const finalPair = (options || []).find((o: any) => o.final) || (options || [])[0] || null;

    const sceneTips = KB[proj.scene as keyof typeof KB] || null;

    const prompt = [
      `# ${proj.name} · 一站式项目评审提示词（由工作台自动生成）`,
      `- 项目类别：${proj.scene}（${proj.scale}）`,
      `- 目标上线：${proj.targetDate?.toISOString()?.slice(0, 10) || '待定'}`,
      `- 当前阶段：${proj.status} / step=${proj.currentStep}`,
      `- 最终选型（暂定）：${finalPair ? finalPair.front + ' ⇄ ' + finalPair.back : '未选定'}`,
      `- 需求概况：共 ${reqs.length} 条，P0=${reqs.filter((r) => r.priority === 'P0').length}，P1=${reqs.filter((r) => r.priority === 'P1').length}`,
      `- 已配置后端：${bes.length ? bes.map((b) => `${b.name}(${b.type})`).join('；') : '无'}`,
      `- 环境进度：${envs.length ? envs.map((e) => `${e.name}:${e.status}`).join('、') : '无'}`,
      ``,
      `请你作为「${proj.scene}」场景的资深架构师，帮我评估：`,
      `1. 当前选型与后端配置能否支撑需求清单（列出 P0 需求清单）？`,
      `2. 设计计划（阶段拆分、排期、资源）是否合理？请给出优化建议。`,
      `3. 后端是否有遗漏（如：权限、审计、日志、缓存、消息队列）？`,
      `4. 环境与联调是否覆盖：开发、测试、预发、生产、联调、代码评审、发布审批？`,
      `5. 给我一个可落地的「下一步行动清单」（Top 5，标注负责人、优先级、预估工期）。`,
    ].join('\n');

    return {
      projectId,
      projectName: proj.name,
      scene: proj.scene,
      finalPair,
      requirements: reqs,
      backends: bes,
      envs,
      sceneRecommendations: sceneTips,
      prompt,
      scenes: STANDARD_SCENES,
    };
  }

  /** 生成「在线选型推荐」（可直接入参人工复写） */
  async recommend(scene: string) {
    const kb = KB[scene as keyof typeof KB];
    if (!kb) return { scene, ok: false, message: '不支持的场景' };
    return {
      scene,
      ok: true,
      recommendations: kb.pairs,
      uiRecs: (kb as any).uiRecs || [],
      archText: (kb as any).arch || '',
      apiTemplates: (kb as any).apiTmpl || [],
    };
  }
}
