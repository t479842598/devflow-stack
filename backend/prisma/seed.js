/** Prisma 种子：创建 1 个管理员 + 1 个示例项目 + 1 条选型（示例） */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminPwd = await bcrypt.hash(process.env.ADMIN_PWD || 'admin12345', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      displayName: '管理员',
      passwordHash: adminPwd,
      role: 'admin',
    },
  });

  const projName = '示例：供应链管理系统';
  await prisma.project.upsert({
    where: { name: projName },
    update: {},
    create: {
      name: projName,
      scene: '管理系统',
      scale: '中型',
      ownTeam: '全栈小组',
      desc: '内部订单、库存、采购一体化管理',
      targetDate: new Date(Date.now() + 90 * 86400000),
      status: '需求梳理',
      currentStep: 2,
      owner: undefined,
    },
  });

  await prisma.requirement.create({
    data: {
      proj: projName,
      title: '批量导入 Excel 订单（P0）',
      desc: '支持 sku/orderNo/customer 三级映射，模板校验+异步导入',
      priority: 'P0',
      status: '待排期',
      ownerName: '李强',
      due: new Date(Date.now() - 2 * 86400000), // 已逾期 2 天 → 首页逾期提醒
    },
  });

  await prisma.techOption.create({
    data: {
      proj: projName,
      front: 'Vue3 + Vite + Element Plus',
      back: 'NestJS + Prisma + MySQL',
      eff: 9,
      perf: 8,
      cost: 8,
      bm: 9,
      pros: 'TS 全栈、NestJS 模块化、Prisma 类型安全',
      risks: 'Node 在高并发 CPU 密集场景需横向扩容',
      recmd: true,
      final: true,
      source: 'ai',
    },
  });

  await prisma.envItem.create({
    data: {
      proj: projName,
      name: '开发环境：Docker + MySQL + Redis',
      scene: '开发环境搭建',
      status: '进行中',
      owner: '李强',
      due: new Date(Date.now() - 1 * 86400000),
    },
  });

  await prisma.deliverItem.create({
    data: {
      proj: projName,
      name: '测试用例：批量导入 1000 行订单压力测试',
      type: '测试用例',
      env: '测试',
      status: '待处理',
      owner: '测试组',
      due: new Date(Date.now() + 3 * 86400000),
    },
  });

  console.log('Seed OK');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
