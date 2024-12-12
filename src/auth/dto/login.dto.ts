import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  
    @ApiProperty({
        description: 'User email address',
        example: 'prueba@example.com'
    })
    @Transform(({ value }: {value: string}) => value.trim().toLowerCase())
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'clave123'
    })
    @IsString()
    @MinLength(6)
    password: string;
}
