import { Module } from '@nestjs/common';
import { FesController } from './fes.controller';
import { FesService } from './fes.service';

@Module({
  controllers: [FesController],
  providers: [FesService],
})
export class FesModule {}
