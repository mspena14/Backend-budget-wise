import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Budget } from '../../budgets/entities/budget.entity';
import { AuditableEntity } from '../../common/entites/auditable.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @Column({ type: 'text', unique: true })
  @ApiProperty({
    description: 'Email address of the user',
    example: 'prueba@example.com',
  })
  email: string;

  @Column({ type: 'text', name: 'fullname', nullable: false })
  @ApiProperty({
    description: 'Full name of the user',
    example: 'Prueba example',
  })
  fullName: string;

  @Column({ type: 'text', nullable: false })
  @ApiProperty({
    description: 'Password of the user',
    example: 'clave123',
  })
  password: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    description: 'Phone number of the user',
    example: '3216549870',
  })
  phone: string;

  @Column({
    type: 'text',
    unique: true,
    name: 'reset_password_token',
    nullable: true,
  })
  @ApiProperty({
    description: 'Reset password token',
    example: '123e4567-e89b-12d3-a456-426614174055',
  })
  resetPasswordToken: string;

  @ApiHideProperty()
  @OneToMany(() => Budget, (budget) => budget.user, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  budgets: Budget[];
}
