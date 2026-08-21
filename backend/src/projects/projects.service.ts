import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ListQueryDto } from '../common/dto/list-query.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 创建项目级连带：
   *  - 自动写入首条设计计划「需求分析」
   *  - 自动写入 6 条环境与联调事项
   */
  async create(dto: CreateProjectDto) {
    const project = await this.prisma.project.create({
      data: {
        name: dto.name,
        scene: dto.scene,
        scale: dto.scale || '中型',
        ownTeam: dto.ownTeam || '',
        desc: dto.desc || '',
        targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
        status: '立项',
        currentStep: 1,
        ownerId: dto.ownerId || undefined,
      },
    });

    // 首条设计计划：需求分析
    await this.prisma.designPlan.create({
      data: {
        proj: project.name,
        title: '需求分析（首阶段）',
        stage: '需求分析',
        points:
          '梳理需求清单并确认范围；明确 P0/P1 需求与截止期；完成评审。',
        start: new Date(),
        end: new Date(Date.now() + 7 * 86400000),
      },
    });

    // 6 条环境与联调
    const envScenes = [
      '开发环境搭建',
      '测试环境部署',
      '前后端联调',
      '代码评审',
      '预发环境验证',
      '生产发布准备',
    ];
    const now = new Date();
    for (let i = 0; i < envScenes.length; i++) {
      await this.prisma.envItem.create({
        data: {
          proj: project.name,
          name: envScenes[i],
          scene: envScenes[i],
          due: new Date(now.getTime() + (7 + i * 3) * 86400000),
        },
      });
    }

    return project;
  }

  /**
   * 首页总览：所有项目 + 总需求数（含每张卡的统计）。
   */
  async findAll(query: ListQueryDto) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;
    const where = search
      ? { name: { contains: search, mode: 'insensitive' as const } }
      : {};

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          _count: {
            select: {
              requirements: true,
              options: true,
              designs: true,
              fes: true,
              bes: true,
              envs: true,
              dels: true,
            },
          },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    // 汇总几张关键计数，给工作台统计卡片用
    const statusAgg = await this.prisma.project.groupBy({
      by: ['status'],
      _count: { _all: true },
    });
    const reqCount = await this.prisma.requirement.count();
    const doneProj = statusAgg.find((s) => s.status === '已交付')?._count._all || 0;

    return {
      rows,
      page,
      limit,
      total,
      agg: {
        projects: total,
        requirements: reqCount,
        doneProjects: doneProj,
      },
    };
  }

  async findOne(id: string) {
    const [proj, reqs, options, designs, fes, bes, envs, dels] =
      await this.prisma.$transaction([
        this.prisma.project.findUniqueOrThrow({
          where: { id },
          include: { owner: { select: { username: true, displayName: true } } },
        }),
        this.prisma.requirement.findMany({
          where: { proj: '=' },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.techOption.findMany({
          where: { proj: '=' },
          orderBy: { createdAt: 'asc' },
        }),
        this.prisma.designPlan.findMany({
          where: { proj: '=' },
          orderBy: { start: 'asc' },
        }),
        this.prisma.frontend.findMany({
          where: { proj: '=' },
        }),
        this.prisma.backend.findMany({
          where: { proj: '=' },
        }),
        this.prisma.envItem.findMany({
          where: { proj: '=' },
        }),
        this.prisma.deliverItem.findMany({
          where: { proj: '=' },
        }),
      ]);
    // 上述 proj 是 name，不是 id，所以一定要用 proj. findUnique 的结果名做查询
    const pName = (proj as any).name;
    const [
      reqs2,
      options2,
      designs2,
      fes2,
      bes2,
      envs2,
      dels2,
    ] = await this.prisma.$transaction([
      this.prisma.requirement.findMany({
        where: { proj: pName },
        orderBy: { createdAt: 'desc' },
        include: { owner: { select: { displayName: true, username: true } } },
      }),
      this.prisma.techOption.findMany({
        where: { proj: pName },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.designPlan.findMany({
        where: { proj: pName },
        orderBy: { start: 'asc' },
      }),
      this.prisma.frontend.findMany({ where: { proj: pName } }),
      this.prisma.backend.findMany({ where: { proj: pName } }),
      this.prisma.envItem.findMany({ where: { proj: pName } }),
      this.prisma.deliverItem.findMany({ where: { proj: pName } }),
    ]);
    return {
      project: proj,
      requirements: reqs2 || reqs,
      options: options2 || options,
      designs: designs2 || designs,
      fes: fes2 || fes,
      bes: bes2 || bes,
      envs: envs2 || envs,
      dels: dels2 || dels,
    };
  }

  async update(id: string, dto: UpdateProjectDto) {
    const data: any = { ...dto };
    if (dto.targetDate) data.targetDate = new Date(dto.targetDate);
    return this.prisma.project.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }
}
