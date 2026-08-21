import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOptionsDto } from './dto/create-option.dto';
import { UpdateOptionsDto } from './dto/update-option.dto';
import { ListQueryDto } from '../common/dto/list-query.dto';

@Injectable()
export class OptionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateOptionsDto) {
    const data: any = { ...dto };

    return this.prisma.techOption.create({ data });
  }

  async findAll(query: ListQueryDto) {
    const { page, limit, search, status, owner } = query;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) where.title = { contains: search, mode: 'insensitive' };
    if (status) where.status = status;
    if (owner) where.owner = owner;
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.techOption.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.techOption.count({ where }),
    ]);
    return { rows, page, limit, total };
  }

  findOne(id: string) {
    return this.prisma.techOption.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateOptionsDto) {
    const data: any = { ...dto };

    return this.prisma.techOption.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.techOption.delete({ where: { id } });
  }
}
