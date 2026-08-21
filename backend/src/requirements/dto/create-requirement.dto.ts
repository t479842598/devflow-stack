import { IsString, IsOptional } from 'class-validator';
export class CreateRequirementsDto {
  @IsOptional() @IsString() proj: string;
  @IsString() title: string;
  @IsString() desc?: string;
  @IsString() priority: string;
  @IsString() status: string;
  @IsString() ownerId?: string;
  @IsString() ownerName: string;
  @IsString() due?: string;
}
