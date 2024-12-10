import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { v4 } from 'uuid';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { RegisterUserDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(registerUserDto: RegisterUserDto): Promise<User> {
    const userCreated = this.usersRepository.create(registerUserDto);

    if (!userCreated)
      throw new BadRequestException('There was an error creating the user');
    return await this.usersRepository.save(userCreated);
  }

  async findOneById(id: string): Promise<User | null> {
    const userFound = await this.usersRepository.findOne({ where: { id } });
    return userFound || null;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const userFound = await this.usersRepository.findOne({ where: { email }, relations: ['budgets.categories.expenses'] });

    return userFound || null;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    userId: string,
  ): Promise<User> {
    if (id !== userId) throw new UnauthorizedException();

    const userFound = await this.findOneById(id);
    if (!userFound) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }

    const userUpdated = Object.assign(userFound, updateUserDto);

    return await this.usersRepository.save(userUpdated);
  }

  async removeUser(id: string, userId: string): Promise<User> {
    if (id !== userId) throw new UnauthorizedException();

    const userFound = await this.findOneById(id);
    if (!userFound) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }
    await this.usersRepository.softRemove(userFound);
    return userFound;
  }

  async requestResetPassword(requestResetPasswordDto: RequestResetPasswordDto) {
    try {
      const { email } = requestResetPasswordDto;

      const user: User = await this.findOneByEmail(email);
      user.resetPasswordToken = v4();
      this.usersRepository.save(user);
      const userResetPasswordToken = user.resetPasswordToken;
      const userFullName = user.fullName;

      return { email, userFullName, userResetPasswordToken };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new QueryFailedError('Bad request', undefined, error);
      } else {
        throw new InternalServerErrorException(
          error.message || 'Internal server error',
        );
      }
    }
  }

  async findOneByResetPasswordToken(resetPasswordToken: string): Promise<User> {
    const user: User = await this.usersRepository.findOne({
      where: { resetPasswordToken },
    });

    if (!user) {
      throw new NotFoundException('User not found or invalid reset token');
    }

    return user;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    try {
      const { resetPasswordToken, password } = resetPasswordDto;
      const user: User =
        await this.findOneByResetPasswordToken(resetPasswordToken);

      user.password = await bcrypt.hash(password, 8);
      user.resetPasswordToken = null;
      this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new BadRequestException();
      }
      throw new InternalServerErrorException(
        error.message || 'Internal server error',
      );
    }
  }

  async userOwnerValidation(tokenId: string, owner?: User): Promise<User> {
    const userFound: User = await this.findOneById(tokenId);

    const authorizated = userFound.id === owner.id ? true : false;

    if (!userFound || !authorizated) throw new UnauthorizedException();
    return userFound;
  }

  async validateUserExistence(tokenId: string): Promise<User> {
    const userFound = await this.findOneById(tokenId);
    console.log(userFound)
    if (!userFound) throw new UnauthorizedException();
    return userFound;
  }
}
