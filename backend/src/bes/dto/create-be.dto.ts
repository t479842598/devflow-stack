import { IsString, IsOptional } from 'class-validator';
export class CreateBesDto {
  @IsOptional() @IsString() proj: string;
  @IsString() name: string;
  @IsString() type: string;
  @IsString() stack: string;
  @IsString() detail: string;
  @IsString() status: string;
}
