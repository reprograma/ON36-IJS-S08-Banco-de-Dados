import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsUUID(undefined, { each: true })
  readonly taskIds?: string[];
}
