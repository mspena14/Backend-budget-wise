import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Budget } from '../../budgets/entities/budget.entity';
import { AuditableEntity } from '../../common/entites/auditable.entity';

@Entity('users')
export class User extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', name: 'fullname', nullable: false })
  fullName: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ type: 'text', nullable: true })
  phone: string;

  @Column({
    type: 'text', 
    unique: true, 
    name: 'reset_password_token', 
    nullable: true
  })
  resetPasswordToken: string;

  @OneToMany(() => Budget, (budget) => budget.user, { onDelete: "CASCADE", cascade: true })
  budgets: Budget[];
}

