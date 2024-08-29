import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsUUID()
  @IsOptional()
  readonly userId?: string;

  @IsUUID(undefined, { each: true })
  @IsOptional()
  readonly tagIds?: string[];
}
