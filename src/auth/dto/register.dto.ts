import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'Usuario de prueba'
})
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'User email address',
    example: 'prueba@example.com'
})
  @Transform(({ value }: {value: string}) => value.trim().toLowerCase())
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'clave123'
})
  @Transform(({ value }: {value: string}) => value.trim())
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User phone number',
    example: '3216549870'
})
  @IsOptional()
  @IsString()
  phone?: string;
}
