import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Budget } from '../../budgets/entities/budget.entity';
import { Expense } from 'src/expenses/entities/expense.entity';
import { AuditableEntity } from '../../common/entites/auditable.entity';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

@Entity('categories')
export class Category extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Category id',
    example: "123e4567-e89b-12d3-a456-426614174000",
})
  id: string;

  @Column({ type: 'text', nullable: false })
  @ApiProperty({
    description: 'Category name',
    example: "Seguros",
})
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0})
  @ApiProperty({
    description: 'Category amount',
    example: "200.000",
})
  amount: number;

  @ApiHideProperty()
  @ManyToOne(() => Budget, (budget) => budget.categories)
  @JoinColumn({ name: 'budget_id' })
  budget: Budget;

  @ApiHideProperty()
  @OneToMany(() => Expense, (expense) => expense.category, { onDelete: "CASCADE", cascade: true })
  expenses: Expense[];
}

