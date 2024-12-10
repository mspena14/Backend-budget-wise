import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  
    @Transform(({ value }: {value: string}) => value.trim().toLowerCase())
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}
