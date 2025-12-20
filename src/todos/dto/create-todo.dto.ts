import { IsBoolean, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  isCompleted: boolean;
}
