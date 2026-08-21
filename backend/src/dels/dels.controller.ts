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
import { DelsService } from './dels.service';
import { CreateDelsDto } from './dto/create-del.dto';
import { UpdateDelsDto } from './dto/update-del.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ListQueryDto } from '../common/dto/list-query.dto';

@ApiTags('dels')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dels')
export class DelsController {
  constructor(private readonly service: DelsService) {}

  @ApiOperation({ summary: '创建交付管理' })
  @Post()
  create(@Body() dto: CreateDelsDto) {
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

  @ApiOperation({ summary: '更新交付管理' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDelsDto) {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: '删除交付管理' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
