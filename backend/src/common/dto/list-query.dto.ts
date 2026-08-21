import { IsOptional, IsNumber, Min, Max, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class ListQueryDto {
  @IsOptional()
  @Transform(({ value }) => Number(value) || 1)
  @IsNumber() @Min(1)
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => Math.min(Number(value) || 50, 200))
  @IsNumber() @Min(1) @Max(200)
  limit: number = 50;

  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() sortField?: string;
  @IsOptional() @IsString() sortDir?: 'asc' | 'desc';
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() owner?: string;
}
