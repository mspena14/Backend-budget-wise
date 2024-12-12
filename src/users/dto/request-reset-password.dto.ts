import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class RequestResetPasswordDto{
  @ApiProperty({
    description: 'User email',
    example: 'user@test.com'
})
  @IsEmail()
  @IsNotEmpty()
  email: string;
}