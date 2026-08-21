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
import { BesService } from './bes.service';
import { CreateBesDto } from './dto/create-be.dto';
import { UpdateBesDto } from './dto/update-be.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ListQueryDto } from '../common/dto/list-query.dto';

@ApiTags('bes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bes')
export class BesController {
  constructor(private readonly service: BesService) {}

  @ApiOperation({ summary: '创建后端框架' })
  @Post()
  create(@Body() dto: CreateBesDto) {
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

  @ApiOperation({ summary: '更新后端框架' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBesDto) {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: '删除后端框架' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
