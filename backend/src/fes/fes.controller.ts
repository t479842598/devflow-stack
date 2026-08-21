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
import { FesService } from './fes.service';
import { CreateFesDto } from './dto/create-fe.dto';
import { UpdateFesDto } from './dto/update-fe.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ListQueryDto } from '../common/dto/list-query.dto';

@ApiTags('fes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('fes')
export class FesController {
  constructor(private readonly service: FesService) {}

  @ApiOperation({ summary: '创建前端样式' })
  @Post()
  create(@Body() dto: CreateFesDto) {
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

  @ApiOperation({ summary: '更新前端样式' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFesDto) {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: '删除前端样式' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
