import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @Transform(({ value }: {value: string}) => value.trim().toLowerCase())
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Transform(({ value }: {value: string}) => value.trim())
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
