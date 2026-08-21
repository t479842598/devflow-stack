import { Module } from '@nestjs/common';
import { DelsController } from './dels.controller';
import { DelsService } from './dels.service';

@Module({
  controllers: [DelsController],
  providers: [DelsService],
})
export class DelsModule {}
