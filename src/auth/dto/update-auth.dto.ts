import { PartialType } from '@nestjs/mapped-types';
import { registerDTO } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(registerDTO) {}
