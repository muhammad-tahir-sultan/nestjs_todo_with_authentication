import { IsEnum } from 'class-validator';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
export class updateUserDto {
  @IsEnum(UserRole, { message: "'Role must be either user or admin'" })
  role: UserRole;
}
