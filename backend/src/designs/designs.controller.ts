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
import { DesignsService } from './designs.service';
import { CreateDesignsDto } from './dto/create-design.dto';
import { UpdateDesignsDto } from './dto/update-design.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ListQueryDto } from '../common/dto/list-query.dto';

@ApiTags('designs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('designs')
export class DesignsController {
  constructor(private readonly service: DesignsService) {}

  @ApiOperation({ summary: '创建设计计划' })
  @Post()
  create(@Body() dto: CreateDesignsDto) {
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

  @ApiOperation({ summary: '更新设计计划' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDesignsDto) {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: '删除设计计划' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
