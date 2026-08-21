import { IsString, IsOptional } from 'class-validator';
export class CreateEnvsDto {
  @IsOptional() @IsString() proj: string;
  @IsString() name: string;
  @IsString() scene: string;
  @IsString() status: string;
  @IsString() owner: string;
  @IsString() due?: string;
  @IsString() note: string;
}
