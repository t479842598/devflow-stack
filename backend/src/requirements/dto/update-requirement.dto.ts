import { PartialType } from '@nestjs/swagger';
import { CreateRequirementsDto } from './create-requirement.dto';
export class UpdateRequirementsDto extends PartialType(CreateRequirementsDto) {}
