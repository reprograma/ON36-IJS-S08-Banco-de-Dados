import { IsString, IsOptional, IsEmail, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsEmail()
  @IsOptional()
  readonly email: string;

  @IsUUID()
  @IsOptional()
  readonly profileId?: string;
}
