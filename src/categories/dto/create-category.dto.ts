import { Transform } from "class-transformer";
import { IsDecimal, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: { value: string}) => value.toLowerCase())
    name: string;

    @IsOptional()
    @IsDecimal()
    amount?: number;

    @IsNotEmpty()
    @IsUUID()
    budgetId: string
}
