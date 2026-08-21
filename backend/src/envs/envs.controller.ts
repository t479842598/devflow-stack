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
import { EnvsService } from './envs.service';
import { CreateEnvsDto } from './dto/create-env.dto';
import { UpdateEnvsDto } from './dto/update-env.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ListQueryDto } from '../common/dto/list-query.dto';

@ApiTags('envs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('envs')
export class EnvsController {
  constructor(private readonly service: EnvsService) {}

  @ApiOperation({ summary: '创建环境与联调' })
  @Post()
  create(@Body() dto: CreateEnvsDto) {
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

  @ApiOperation({ summary: '更新环境与联调' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEnvsDto) {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: '删除环境与联调' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
