import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateProfileDto {
  @IsUUID()
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsOptional()
  readonly minibio?: string;

  @IsString()
  @IsOptional()
  readonly avatar?: string;
}
