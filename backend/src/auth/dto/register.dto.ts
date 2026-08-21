import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString() @IsNotEmpty() username: string;
  @IsString() @MinLength(6) password: string;
  @IsOptional() @IsString() displayName?: string;
  @IsOptional() @IsString() role?: string;
}
