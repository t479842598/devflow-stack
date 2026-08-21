import { PartialType } from '@nestjs/swagger';
import { CreateDelsDto } from './create-del.dto';
export class UpdateDelsDto extends PartialType(CreateDelsDto) {}
