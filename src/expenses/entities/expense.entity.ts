import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { AuditableEntity } from 'src/common/entites/auditable.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity()
export class Expense extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Expense id',
    example: "123e4567-e89b-12d3-a456-426614174055",
})
  id: string;

  @Column({ type: 'text', nullable: false})
  @ApiProperty({
    description: 'Expense name',
    example: "Seguro de vida",
})
  name: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    description: 'Expense name',
    example: "Seguro de vida",
})
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0})
  @ApiProperty({
    description: 'Expense amount',
    example: "100.000",
})
  amount: number;

  @Column({ type: 'date', nullable: false })
  @ApiProperty({
    description: 'Expense date',
    example: "2024-12-12",
})
  date: string;

  @ApiHideProperty()
  @ManyToOne(() => Category, (category) => category.expenses)
  @JoinColumn({ name: 'category_id' })
  category: Category;   
}
