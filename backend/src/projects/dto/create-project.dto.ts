import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
} from 'class-validator';
import type { Scene } from '../../common/scenes';

export class CreateProjectDto {
  @IsString() name: string;
  @IsString() scene: Scene;
  @IsOptional() @IsString() scale?: string;
  @IsOptional() @IsString() ownTeam?: string;
  @IsOptional() @IsString() desc?: string;
  @IsOptional() @IsDateString() targetDate?: string;
  @IsOptional() @IsString() ownerId?: string;
  @IsOptional() @IsNumber() currentStep?: number;
}
