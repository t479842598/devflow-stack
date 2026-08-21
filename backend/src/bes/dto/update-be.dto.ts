import { PartialType } from '@nestjs/swagger';
import { CreateBesDto } from './create-be.dto';
export class UpdateBesDto extends PartialType(CreateBesDto) {}
