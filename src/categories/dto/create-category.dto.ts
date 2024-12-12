import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDecimal, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({
        description: 'Category name',
        example: 'Seguros'
    })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: { value: string}) => value.toLowerCase())
    name: string;

    @ApiProperty({
        description: 'Category amount',
        example: "200.000",
    })
    @IsOptional()
    @IsDecimal()
    amount?: number;

    @ApiProperty({
        description: 'Budget id',
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @IsNotEmpty()
    @IsUUID()
    budgetId: string
}
