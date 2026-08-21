/** generate-crud-modules.mjs
 * 批量生成 Requirements/Options/Designs/Fes/Bes/Envs/Dels 的 Module/Service/Controller
 * 做法：模板字符串渲染后写回文件系统，避免一次写 6 套重复代码。
 */
import fs from 'fs';
import path from 'path';

const MODULES = [
  {
    key: 'Requirements',
    dir: 'requirements',
    model: 'requirement',
    createDto: [
      ['proj', 'String', false],
      ['title', 'String', true],
      ['desc', 'String?', true],
      ['priority', 'String', true], // P0|P1|P2
      ['status', 'String', true], // 待排期...
      ['ownerId', 'String?', true],
      ['ownerName', 'String', true],
      ['due', 'DateTime?', true],
    ],
  },
  {
    key: 'Options',
    dir: 'options',
    model: 'techOption',
    createDto: [
      ['proj', 'String', false],
      ['front', 'String', true],
      ['back', 'String', true],
      ['eff', 'Int', true],
      ['perf', 'Int', true],
      ['cost', 'Int', true],
      ['bm', 'Int', true],
      ['pros', 'String', true],
      ['risks', 'String', true],
      ['recmd', 'Boolean', true],
      ['final', 'Boolean', true],
      ['source', 'String', true],
    ],
  },
  {
    key: 'Designs',
    dir: 'designs',
    model: 'designPlan',
    createDto: [
      ['proj', 'String', false],
      ['title', 'String', true],
      ['stage', 'String', true],
      ['points', 'String', true],
      ['start', 'DateTime?', true],
      ['end', 'DateTime?', true],
      ['owner', 'String', true],
      ['link', 'String', true],
    ],
  },
  {
    key: 'Fes',
    dir: 'fes',
    model: 'frontend',
    createDto: [
      ['proj', 'String', false],
      ['name', 'String', true],
      ['type', 'String', true],
      ['frame', 'String', true],
      ['desc', 'String', true],
      ['link', 'String', true],
      ['status', 'String', true],
    ],
  },
  {
    key: 'Bes',
    dir: 'bes',
    model: 'backend',
    createDto: [
      ['proj', 'String', false],
      ['name', 'String', true],
      ['type', 'String', true],
      ['stack', 'String', true],
      ['detail', 'String', true],
      ['status', 'String', true],
    ],
  },
  {
    key: 'Envs',
    dir: 'envs',
    model: 'envItem',
    createDto: [
      ['proj', 'String', false],
      ['name', 'String', true],
      ['scene', 'String', true],
      ['status', 'String', true],
      ['owner', 'String', true],
      ['due', 'DateTime?', true],
      ['note', 'String', true],
    ],
  },
  {
    key: 'Dels',
    dir: 'dels',
    model: 'deliverItem',
    createDto: [
      ['proj', 'String', false],
      ['name', 'String', true],
      ['type', 'String', true],
      ['env', 'String', true],
      ['status', 'String', true],
      ['owner', 'String', true],
      ['due', 'DateTime?', true],
      ['note', 'String', true],
    ],
  },
];

const importTypeName = 'Create' + 'Dto';
const modelCm = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const titleKey = (key) => ({
  Requirements: '需求',
  Options: '技术选型',
  Designs: '设计计划',
  Fes: '前端样式',
  Bes: '后端框架',
  Envs: '环境与联调',
  Dels: '交付管理',
})[key];

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
  console.log('✓', file);
}

for (const m of MODULES) {
  const base = `src/${m.dir}`;
  const dtoName = `Create${m.key}Dto`;
  const updName = `Update${m.key}Dto`;
  const serviceName = `${m.key}Service`;
  const ctrlName = `${m.key}Controller`;
  const modelName = modelCm(m.model);

  // --- create.dto.ts ---
  const fields = m.createDto
    .map(([f, t, req]) => {
      const opt = req ? '' : '@IsOptional() ';
      const tsType = t === 'String?' || t === 'DateTime?' ? 'string' : t === 'Int' ? 'number' : t === 'Boolean' ? 'boolean' : 'string';
      return `  ${opt}@IsString() ${f}${t.includes('?') ? '?' : ''}: ${tsType};`;
    })
    .join('\n');
  const dtoContent = `import { IsString, IsOptional } from 'class-validator';
export class ${dtoName} {
${fields}
}
`;

  // --- update.dto.ts ---
  const updateDto = `import { PartialType } from '@nestjs/swagger';
import { ${dtoName} } from './create-${m.dir.slice(0, -1)}.dto';
export class ${updName} extends PartialType(${dtoName}) {}
`;

  // --- service.ts ---
  const dateFields = m.createDto
    .filter(([, t]) => t.startsWith('DateTime'))
    .map(([f]) => f);
  const serviceContent = `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ${dtoName} } from './dto/create-${m.dir.slice(0, -1)}.dto';
import { ${updName} } from './dto/update-${m.dir.slice(0, -1)}.dto';
import { ListQueryDto } from '../common/dto/list-query.dto';

@Injectable()
export class ${serviceName} {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: ${dtoName}) {
    const data: any = { ...dto };
${dateFields.map((f) => `    if (dto.${f}) data.${f} = new Date(dto.${f});`).join('\n')}
    return this.prisma.${m.model}.create({ data });
  }

  async findAll(query: ListQueryDto) {
    const { page, limit, search, status, owner } = query;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) where.${'title'} = { contains: search, mode: 'insensitive' };
    if (status) where.status = status;
    if (owner) where.owner = owner;
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.${m.model}.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.${m.model}.count({ where }),
    ]);
    return { rows, page, limit, total };
  }

  findOne(id: string) {
    return this.prisma.${m.model}.findUnique({ where: { id } });
  }

  update(id: string, dto: ${updName}) {
    const data: any = { ...dto };
${dateFields.map((f) => `    if (dto.${f}) data.${f} = new Date(dto.${f});`).join('\n')}
    return this.prisma.${m.model}.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.${m.model}.delete({ where: { id } });
  }
}
`;

  // --- controller.ts ---
  const ctrlContent = `import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ${serviceName} } from './${m.dir}.service';
import { ${dtoName} } from './dto/create-${m.dir.slice(0, -1)}.dto';
import { ${updName} } from './dto/update-${m.dir.slice(0, -1)}.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ListQueryDto } from '../common/dto/list-query.dto';

@ApiTags('${m.dir}')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('${m.dir}')
export class ${ctrlName} {
  constructor(private readonly service: ${serviceName}) {}

  @ApiOperation({ summary: '创建${titleKey(m.key)}' })
  @Post()
  create(@Body() dto: ${dtoName}) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: '列表（支持分页/搜索/筛选）' })
  @Get()
  findAll(@Query() query: ListQueryDto) {
    return this.service.findAll(query);
  }

  @ApiOperation({ summary: '详情' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: '更新${titleKey(m.key)}' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: ${updName}) {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: '删除${titleKey(m.key)}' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
`;

  // --- module.ts ---
  const moduleContent = `import { Module } from '@nestjs/common';
import { ${ctrlName} } from './${m.dir}.controller';
import { ${serviceName} } from './${m.dir}.service';

@Module({
  controllers: [${ctrlName}],
  providers: [${serviceName}],
})
export class ${m.key}Module {}
`;

  write(path.join(base, 'dto', `create-${m.dir.slice(0, -1)}.dto.ts`), dtoContent);
  write(path.join(base, 'dto', `update-${m.dir.slice(0, -1)}.dto.ts`), updateDto);
  write(path.join(base, `${m.dir}.service.ts`), serviceContent);
  write(path.join(base, `${m.dir}.controller.ts`), ctrlContent);
  write(path.join(base, `${m.dir}.module.ts`), moduleContent);
}
console.log('DONE');
