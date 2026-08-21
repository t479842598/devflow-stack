import { IsString, IsOptional } from 'class-validator';
export class CreateDelsDto {
  @IsOptional() @IsString() proj: string;
  @IsString() name: string;
  @IsString() type: string;
  @IsString() env: string;
  @IsString() status: string;
  @IsString() owner: string;
  @IsString() due?: string;
  @IsString() note: string;
}
