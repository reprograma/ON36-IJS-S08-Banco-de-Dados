import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdateTagDto {
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsUUID(undefined, { each: true })
  @IsOptional()
  readonly taskIds?: string[];
}
