import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnvsDto } from './dto/create-env.dto';
import { UpdateEnvsDto } from './dto/update-env.dto';
import { ListQueryDto } from '../common/dto/list-query.dto';

@Injectable()
export class EnvsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateEnvsDto) {
    const data: any = { ...dto };
    if (dto.due) data.due = new Date(dto.due);
    return this.prisma.envItem.create({ data });
  }

  async findAll(query: ListQueryDto) {
    const { page, limit, search, status, owner } = query;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) where.title = { contains: search, mode: 'insensitive' };
    if (status) where.status = status;
    if (owner) where.owner = owner;
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.envItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.envItem.count({ where }),
    ]);
    return { rows, page, limit, total };
  }

  findOne(id: string) {
    return this.prisma.envItem.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateEnvsDto) {
    const data: any = { ...dto };
    if (dto.due) data.due = new Date(dto.due);
    return this.prisma.envItem.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.envItem.delete({ where: { id } });
  }
}
