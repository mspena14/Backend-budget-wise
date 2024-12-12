import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty } from "class-validator";

export class CreateBudgetDto {
    @ApiProperty({
        description: 'Budget startDate',
        example: '2025-01-01'
    })
    @IsDateString()
    @IsNotEmpty()
    startDate: string;
}
