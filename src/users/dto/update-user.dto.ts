import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from 'src/auth/dto/register.dto';

export class UpdateUserDto extends PartialType(RegisterUserDto) {}
