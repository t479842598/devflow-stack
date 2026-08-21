import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (exists) throw new UnauthorizedException('用户名已存在');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        passwordHash,
        displayName: dto.displayName || dto.username,
        role: dto.role || 'member',
      },
    });
    return this.buildToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (!user) throw new UnauthorizedException('用户名或密码错误');
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('用户名或密码错误');
    return this.buildToken(user);
  }

  async seedAdmin() {
    const exist = await this.prisma.user.findUnique({
      where: { username: 'admin' },
    });
    if (exist) return exist;
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PWD || 'admin123', 10);
    return this.prisma.user.create({
      data: {
        username: 'admin',
        displayName: '管理员',
        passwordHash,
        role: 'admin',
      },
    });
  }

  private buildToken(user: {
    id: string;
    username: string;
    displayName: string;
    role: string;
  }) {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      displayName: user.displayName,
    };
    return {
      access_token: this.jwt.sign(payload),
      user: payload,
    };
  }
}
