import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { BudgetsService } from 'src/budgets/budgets.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private readonly budgetsService: BudgetsService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user: User = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email not registered');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) { 
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, user_id: user.id };

    const token = await this.jwtService.signAsync(payload);

    const userId = user.id;

    return {
      token,
      email,
      userId,
    };
  }

  async register({ fullName, email, password, phone }: RegisterUserDto) {
    try {
      const salt: string = bcrypt.genSaltSync();
      const userCreated: User = await this.userService.createUser({
        fullName,
        email,
        password: await bcrypt.hash(password, salt),
        phone,
      });
      const registerResponse = {
        id: userCreated.id,
        email: userCreated.email,
      };
      const currentDate = new Date();
      const firstDayOfMonthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      console.log(firstDayOfMonthDate);
      const createBudgetDto = {
        startDate: firstDayOfMonthDate.toISOString().split('T')[0],
      };

      await this.budgetsService.createBudget(userCreated.id, createBudgetDto);
      return registerResponse;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`The email ${email} is already registered.`);
      } else {
        throw new InternalServerErrorException(
          error.message || 'Internal server error',
        );
      }
    }
  }
  async profile({ email }: { email: string }) {
    return await this.userService.findOneByEmail(email);
  }
}
