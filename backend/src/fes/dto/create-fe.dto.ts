import { IsString, IsOptional } from 'class-validator';
export class CreateFesDto {
  @IsOptional() @IsString() proj: string;
  @IsString() name: string;
  @IsString() type: string;
  @IsString() frame: string;
  @IsString() desc: string;
  @IsString() link: string;
  @IsString() status: string;
}
