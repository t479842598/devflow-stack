import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFesDto } from './dto/create-fe.dto';
import { UpdateFesDto } from './dto/update-fe.dto';
import { ListQueryDto } from '../common/dto/list-query.dto';

@Injectable()
export class FesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateFesDto) {
    const data: any = { ...dto };

    return this.prisma.frontend.create({ data });
  }

  async findAll(query: ListQueryDto) {
    const { page, limit, search, status, owner } = query;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) where.title = { contains: search, mode: 'insensitive' };
    if (status) where.status = status;
    if (owner) where.owner = owner;
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.frontend.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.frontend.count({ where }),
    ]);
    return { rows, page, limit, total };
  }

  findOne(id: string) {
    return this.prisma.frontend.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateFesDto) {
    const data: any = { ...dto };

    return this.prisma.frontend.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.frontend.delete({ where: { id } });
  }
}
