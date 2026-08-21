import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequirementsDto } from './dto/create-requirement.dto';
import { UpdateRequirementsDto } from './dto/update-requirement.dto';
import { ListQueryDto } from '../common/dto/list-query.dto';

@Injectable()
export class RequirementsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateRequirementsDto) {
    const data: any = { ...dto };
    if (dto.due) data.due = new Date(dto.due);
    return this.prisma.requirement.create({ data });
  }

  async findAll(query: ListQueryDto) {
    const { page, limit, search, status, owner } = query;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) where.title = { contains: search, mode: 'insensitive' };
    if (status) where.status = status;
    if (owner) where.owner = owner;
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.requirement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.requirement.count({ where }),
    ]);
    return { rows, page, limit, total };
  }

  findOne(id: string) {
    return this.prisma.requirement.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateRequirementsDto) {
    const data: any = { ...dto };
    if (dto.due) data.due = new Date(dto.due);
    return this.prisma.requirement.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.requirement.delete({ where: { id } });
  }
}
