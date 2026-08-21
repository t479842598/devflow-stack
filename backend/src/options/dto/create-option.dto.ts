import { IsString, IsOptional } from 'class-validator';
export class CreateOptionsDto {
  @IsOptional() @IsString() proj: string;
  @IsString() front: string;
  @IsString() back: string;
  @IsString() eff: number;
  @IsString() perf: number;
  @IsString() cost: number;
  @IsString() bm: number;
  @IsString() pros: string;
  @IsString() risks: string;
  @IsString() recmd: boolean;
  @IsString() final: boolean;
  @IsString() source: string;
}
