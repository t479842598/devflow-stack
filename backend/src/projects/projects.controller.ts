import {
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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ListQueryDto } from '../common/dto/list-query.dto';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  @ApiOperation({ summary: '创建项目（自动初始化首条设计计划 + 6 条环境项）' })
  @UseGuards(RolesGuard)
  @Roles('admin', 'member')
  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: '项目列表（含计数 + 统计聚合）' })
  @Get()
  findAll(@Query() query: ListQueryDto) {
    return this.service.findAll(query);
  }

  @ApiOperation({ summary: '单项目详情（含需求/选型/设计/前端/后端/环境/交付全量）' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: '更新项目' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: '删除项目（级联删除关联数据）' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
