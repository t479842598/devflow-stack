import { Module } from '@nestjs/common';
import { EnvsController } from './envs.controller';
import { EnvsService } from './envs.service';

@Module({
  controllers: [EnvsController],
  providers: [EnvsService],
})
export class EnvsModule {}
