import { Module } from '@nestjs/common';
import { BesController } from './bes.controller';
import { BesService } from './bes.service';

@Module({
  controllers: [BesController],
  providers: [BesService],
})
export class BesModule {}
