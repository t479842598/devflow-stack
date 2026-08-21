import { PartialType } from '@nestjs/swagger';
import { CreateOptionsDto } from './create-option.dto';
export class UpdateOptionsDto extends PartialType(CreateOptionsDto) {}
