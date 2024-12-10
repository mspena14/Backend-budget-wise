import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { AuditableEntity } from '../../common/entites/auditable.entity';

@Entity('budgets')
export class Budget extends AuditableEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    name: 'total_amount',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalAmount: number;

  @Column({ type: 'date', name: 'start_date', nullable: false })
  startDate: string;

  @Column({ type: 'date', name: 'end_date', nullable: false})
  endDate: string;

  @ManyToOne(() => User, (user) => user.budgets)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Category, (category) => category.budget, { onDelete: "CASCADE", cascade: true })
  categories: Category[];

  @BeforeInsert()
  calculateEndDate() {
    const parsedStartDate = new Date(this.startDate);
    parsedStartDate.setMonth(parsedStartDate.getMonth() + 2, 0);
    this.endDate = `${parsedStartDate.getFullYear()}-${parsedStartDate.getMonth() + 1}-${parsedStartDate.getDate()}`;
  }
}
