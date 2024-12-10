import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Budget } from '../../budgets/entities/budget.entity';
import { Expense } from 'src/expenses/entities/expense.entity';
import { AuditableEntity } from '../../common/entites/auditable.entity';

@Entity('categories')
export class Category extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0})
  amount: number;

  @ManyToOne(() => Budget, (budget) => budget.categories)
  @JoinColumn({ name: 'budget_id' })
  budget: Budget;

  @OneToMany(() => Expense, (expense) => expense.category, { onDelete: "CASCADE", cascade: true })
  expenses: Expense[];
}

