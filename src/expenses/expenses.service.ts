import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { UsersService } from 'src/users/users.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    private readonly categoriesService: CategoriesService,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createExpense(
    createExpenseDto: CreateExpenseDto,
    userId: string,
  ): Promise<Expense> {
    const { categoryId, amount, date } = createExpenseDto;
    const userFound = await this.usersService.validateUserExistence(userId);

    console.log('pasa esto');

    const category = await this.categoriesService.findCategoryById(
      categoryId,
      userFound.id,
    );

    if (category.budget.user.id !== userId) throw new UnauthorizedException();

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const budgetStartDate = category.budget.startDate;
    const budgetEndDate = category.budget.endDate;
    const isAValidDate = date <= budgetEndDate && date >= budgetStartDate;
    if (!isAValidDate)
      throw new BadRequestException(
        `You cannot create a new expense without a valid date, it must be between ${budgetStartDate} and ${budgetEndDate}`,
      );
    const stringAmount = String(amount);
    const parsedAmount = parseFloat(stringAmount.replace(/\.00$/, '').trim());
    const expenses = await this.expenseRepository.find({
      where: { category },
    });
    expenses.map((category) => {
      let amount = String(category.amount);

      category.amount = parseFloat(amount.replace(/\.00$/, '').trim());
    });
    const totalExpenses = expenses.reduce(
      (acc, expense) => acc + expense.amount,
      0,
    );
    const newTotalExpenses = totalExpenses + parsedAmount;
    console.log(newTotalExpenses);

    if (totalExpenses < category.amount * 0.7) {
      if (newTotalExpenses >= category.amount * 0.7) {
        await this.notificationsService.notifyUserAboutBudgetExceed(
          userId,
          category.amount,
          parsedAmount,
          newTotalExpenses,
        );
      }
    }

    const newExpense = this.expenseRepository.create({
      ...createExpenseDto,
      category,
    });

    try {
      const expenseCreated = await this.expenseRepository.save(newExpense);
      return expenseCreated;
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(
        'There was an error saving the expense',
        error,
      );
    }
  }

  async findExpenseById(id: string, userId: string): Promise<Expense> {
    const expenseFound = await this.expenseRepository.findOne({
      where: { id },
      relations: ['category.budget.user'],
    });

    if (!expenseFound) throw new NotFoundException('Expense not found');

    if (expenseFound.category.budget.user.id !== userId) {
      throw new UnauthorizedException(
        'You do not have permission to access this expense',
      );
    }

    return expenseFound;
  }

  async findExpensesByCategoryId(
    categoryId: string,
    userId: string,
  ): Promise<Expense[]> {
    const category = await this.categoriesService.findCategoryById(
      categoryId,
      userId,
    );

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return await this.expenseRepository.find({
      where: { category },
      relations: ['category'],
    });
  }

  async updateExpense(
    id: string,
    updateExpenseDto: CreateExpenseDto,
    userId: string,
  ): Promise<Expense> {
    const expenseFound = await this.findExpenseById(id, userId);

    if (updateExpenseDto.categoryId) {
      const category = await this.categoriesService.findCategoryById(
        updateExpenseDto.categoryId,
        userId,
      );
      expenseFound.category = category;
    }

    const updatedExpense = Object.assign(expenseFound, updateExpenseDto);

    try {
      const expenseSaved = await this.expenseRepository.save(updatedExpense);
      return expenseSaved;
    } catch (error) {
      throw new InternalServerErrorException(
        'There was an error updating the expense',
        error,
      );
    }
  }

  async deleteExpense(id: string, userId: string): Promise<Expense> {
    const expenseFound = await this.findExpenseById(id, userId);

    try {
      await this.expenseRepository.softRemove(expenseFound);
      return expenseFound;
    } catch (error) {
      throw new InternalServerErrorException(
        'There was an error deleting the expense',
        error,
      );
    }
  }
}
