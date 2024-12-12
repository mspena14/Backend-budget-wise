import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDecimal, IsDate, IsUUID, IsDateString } from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'Expense name',
    example: "Seguro de vida",
})
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Expense name',
    example: "Seguro de vida",
})
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Expense amount',
    example: "100.000",
})
  @IsDecimal()
  @IsNotEmpty()
  amount: number;

 @ApiProperty({
    description: 'Expense date',
    example: "2024-12-12",
})
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'Category id',
    example: "123e4567-e89b-12d3-a456-426614174000",
})
  @IsUUID()
  @IsNotEmpty()
  categoryId: string; 
}
