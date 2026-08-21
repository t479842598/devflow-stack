import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDesignsDto } from './dto/create-design.dto';
import { UpdateDesignsDto } from './dto/update-design.dto';
import { ListQueryDto } from '../common/dto/list-query.dto';

@Injectable()
export class DesignsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateDesignsDto) {
    const data: any = { ...dto };
    if (dto.start) data.start = new Date(dto.start);
    if (dto.end) data.end = new Date(dto.end);
    return this.prisma.designPlan.create({ data });
  }

  async findAll(query: ListQueryDto) {
    const { page, limit, search, status, owner } = query;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) where.title = { contains: search, mode: 'insensitive' };
    if (status) where.status = status;
    if (owner) where.owner = owner;
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.designPlan.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.designPlan.count({ where }),
    ]);
    return { rows, page, limit, total };
  }

  findOne(id: string) {
    return this.prisma.designPlan.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateDesignsDto) {
    const data: any = { ...dto };
    if (dto.start) data.start = new Date(dto.start);
    if (dto.end) data.end = new Date(dto.end);
    return this.prisma.designPlan.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.designPlan.delete({ where: { id } });
  }
}
