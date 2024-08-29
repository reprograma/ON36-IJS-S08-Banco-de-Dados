import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsUUID()
  @IsNotEmpty()
  readonly userId: string;

  @IsUUID(undefined, { each: true })
  @IsOptional()
  readonly tagIds?: string[];
}
