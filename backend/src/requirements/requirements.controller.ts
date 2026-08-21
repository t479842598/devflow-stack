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
import { RequirementsService } from './requirements.service';
import { CreateRequirementsDto } from './dto/create-requirement.dto';
import { UpdateRequirementsDto } from './dto/update-requirement.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ListQueryDto } from '../common/dto/list-query.dto';

@ApiTags('requirements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('requirements')
export class RequirementsController {
  constructor(private readonly service: RequirementsService) {}

  @ApiOperation({ summary: '创建需求' })
  @Post()
  create(@Body() dto: CreateRequirementsDto) {
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

  @ApiOperation({ summary: '更新需求' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRequirementsDto) {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: '删除需求' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
