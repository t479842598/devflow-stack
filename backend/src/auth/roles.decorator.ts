import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

// 用法：@Roles('admin') @Roles('admin', 'member')
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
