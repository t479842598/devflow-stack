import { IsString, IsOptional } from 'class-validator';
export class CreateDesignsDto {
  @IsOptional() @IsString() proj: string;
  @IsString() title: string;
  @IsString() stage: string;
  @IsString() points: string;
  @IsString() start?: string;
  @IsString() end?: string;
  @IsString() owner: string;
  @IsString() link: string;
}
