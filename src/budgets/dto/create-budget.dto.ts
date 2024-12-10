import { IsDateString, IsNotEmpty } from "class-validator";

export class CreateBudgetDto {
    @IsDateString()
    @IsNotEmpty()
    startDate: string;
}
