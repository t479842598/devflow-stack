import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBesDto } from './dto/create-be.dto';
import { UpdateBesDto } from './dto/update-be.dto';
import { ListQueryDto } from '../common/dto/list-query.dto';

@Injectable()
export class BesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateBesDto) {
    const data: any = { ...dto };

    return this.prisma.backend.create({ data });
  }

  async findAll(query: ListQueryDto) {
    const { page, limit, search, status, owner } = query;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) where.title = { contains: search, mode: 'insensitive' };
    if (status) where.status = status;
    if (owner) where.owner = owner;
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.backend.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.backend.count({ where }),
    ]);
    return { rows, page, limit, total };
  }

  findOne(id: string) {
    return this.prisma.backend.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateBesDto) {
    const data: any = { ...dto };

    return this.prisma.backend.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.backend.delete({ where: { id } });
  }
}
