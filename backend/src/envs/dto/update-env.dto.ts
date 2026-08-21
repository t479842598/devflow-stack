import { PartialType } from '@nestjs/swagger';
import { CreateEnvsDto } from './create-env.dto';
export class UpdateEnvsDto extends PartialType(CreateEnvsDto) {}
