import { PartialType } from '@nestjs/swagger';
import { CreateFesDto } from './create-fe.dto';
export class UpdateFesDto extends PartialType(CreateFesDto) {}
