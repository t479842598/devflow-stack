import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDelsDto } from './dto/create-del.dto';
import { UpdateDelsDto } from './dto/update-del.dto';
import { ListQueryDto } from '../common/dto/list-query.dto';

@Injectable()
export class DelsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateDelsDto) {
    const data: any = { ...dto };
    if (dto.due) data.due = new Date(dto.due);
    return this.prisma.deliverItem.create({ data });
  }

  async findAll(query: ListQueryDto) {
    const { page, limit, search, status, owner } = query;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) where.title = { contains: search, mode: 'insensitive' };
    if (status) where.status = status;
    if (owner) where.owner = owner;
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.deliverItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.deliverItem.count({ where }),
    ]);
    return { rows, page, limit, total };
  }

  findOne(id: string) {
    return this.prisma.deliverItem.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateDelsDto) {
    const data: any = { ...dto };
    if (dto.due) data.due = new Date(dto.due);
    return this.prisma.deliverItem.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.deliverItem.delete({ where: { id } });
  }
}
