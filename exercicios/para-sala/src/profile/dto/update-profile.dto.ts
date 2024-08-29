import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdateProfileDto {
  @IsUUID()
  @IsOptional()
  readonly userId?: string;

  @IsString()
  @IsOptional()
  readonly minibio?: string;

  @IsString()
  @IsOptional()
  readonly avatar?: string;
}
