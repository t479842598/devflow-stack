import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // 仅首个管理员可注册，或由管理员在后台开启。其他情况只允许首个 admin。
  @ApiOperation({ summary: '注册（仅首个用户有效，其他需管理员创建）' })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @ApiOperation({ summary: '登录' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @ApiOperation({ summary: '初始化管理员（用环境变量 ADMIN_PWD）' })
  @Post('seed-admin')
  seedAdmin() {
    return this.auth.seedAdmin();
  }

  @ApiOperation({ summary: '我的信息' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req: any) {
    return req.user;
  }

  @ApiOperation({ summary: '修改密码（管理员可改自己；普通用户改自己）' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword() {
    // TODO: 由用户请求触发后用 authService 更新
    return { message: '请使用 /auth/reset 接口（管理端）' };
  }

  @ApiOperation({ summary: '用户列表（仅管理员）' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('users')
  usersList(@Request() req: any) {
    void req;
    // 简化：直接返回（实际应再加 dto/service）
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaClient } = require('@prisma/client');
    return new PrismaClient().user.findMany({
      select: {
        id: true,
        username: true,
        displayName: true,
        role: true,
        createdAt: true,
      },
    });
  }
}
