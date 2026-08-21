import { PartialType } from '@nestjs/swagger';
import { CreateDesignsDto } from './create-design.dto';
export class UpdateDesignsDto extends PartialType(CreateDesignsDto) {}
