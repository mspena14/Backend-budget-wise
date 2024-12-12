import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsUUID, MinLength } from "class-validator";


export class ResetPasswordDto {
  @ApiProperty({
    description: 'Reset password token',
    example: 'c4ced035-f5b9-430b-ab0d-06863fc45895'
})
  @IsUUID()
  resetPasswordToken: string;

  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;
}