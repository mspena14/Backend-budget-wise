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
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity('budgets')
export class Budget extends AuditableEntity{
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Budget id',
    example: "123e4567-e89b-12d3-a456-426614174000",
})
  id: string;

  @Column({
    type: 'decimal',
    name: 'total_amount',
    precision: 10,
    scale: 2,
    default: 0,
  })
  @ApiProperty({
    description: 'Category totalAmount',
    example: "1.000.000",
})
  totalAmount: number;

  @Column({ type: 'date', name: 'start_date', nullable: false })
  @ApiProperty({
    description: 'Category startDate',
    example: "2024-12-01",
})
  startDate: string;

  @Column({ type: 'date', name: 'end_date', nullable: false})
  @ApiProperty({
    description: 'Category endDate',
    example: "2024-12-31",
})
  endDate: string;

  @ApiHideProperty()
  @ManyToOne(() => User, (user) => user.budgets)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiHideProperty()
  @OneToMany(() => Category, (category) => category.budget, { onDelete: "CASCADE", cascade: true })
  categories: Category[];

  @BeforeInsert()
  calculateEndDate() {
    const parsedStartDate = new Date(this.startDate);
    parsedStartDate.setMonth(parsedStartDate.getMonth() + 2, 0);
    this.endDate = `${parsedStartDate.getFullYear()}-${parsedStartDate.getMonth() + 1}-${parsedStartDate.getDate()}`;
  }
}
