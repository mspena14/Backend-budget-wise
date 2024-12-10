import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UsersService } from 'src/users/users.service';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async createBudget(
    userId: string,
    createBudgetDto: CreateBudgetDto,
  ): Promise<Budget> {
    const { startDate } = createBudgetDto;
    const currentDate = new Date();
    const startDateParsed = new Date(startDate);
    const firstDayOfMonthDate = new Date(startDateParsed.getFullYear(), startDateParsed.getMonth(), 1);
    const formatedFirstDayOfStartDate = firstDayOfMonthDate.toISOString().split('T')[0]

    const tokenUser = await this.usersService.findOneById(userId);
    if (!tokenUser) throw new UnauthorizedException();

    const currentBudget = await this.findCurrentBudgetByUserId(tokenUser.id);
    if (
      firstDayOfMonthDate.getMonth() === currentDate.getMonth() &&
      currentBudget
    ) {
      throw new BadRequestException(
        'You cannot create a new budget if you already have one that month',
      );
    }

    const newBudget = this.budgetRepository.create({
      user: tokenUser,
      ...createBudgetDto,
      startDate: formatedFirstDayOfStartDate
    });

    const createdBudget = await this.saveBudget(newBudget);
    
    const previousBudget = await this.budgetRepository.findOne({
      where: {
        user: tokenUser,
        endDate: this.getPreviousMonthEndDate(formatedFirstDayOfStartDate, 1),
      }, relations: ['categories'],
    });
    
    if (previousBudget) {
      await this.categoriesService.createCategoriesForPreviousBudget(
        previousBudget,
        createdBudget,
      );
    } else {
      await this.categoriesService.createDefaultCategoriesForBudget(createdBudget);
    }
    
    return createdBudget;
  }

  async saveBudget(budget: Budget): Promise<Budget> {
    try {
      return await this.budgetRepository.save(budget);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'There was an error saving the budget',
        error,
      );
    }
  }

  async findAllBudgets(tokenId: string): Promise<Budget[]> {
    const userFound = await this.usersService.findOneById(tokenId);
    if (!userFound) throw new UnauthorizedException();

    try {
      const userBudgets = await this.budgetRepository.find({
        where: { user: userFound },
        relations: ['categories'],
      });
      return userBudgets;
    } catch (error: any) {
      throw new InternalServerErrorException(
        'There was an error findind the budgets',
        error,
      );
    }
  }

  async findOneBudgetById(id: string, tokenId: string): Promise<Budget> {
    try {
      const budgetFound = await this.budgetRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      console.log(budgetFound);

      await this.usersService.userOwnerValidation(tokenId, budgetFound.user);

      return budgetFound;
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(
        'There was an error findind the budgets',
        error,
      );
    }
  }

  async findCurrentBudgetByUserId(userId: string) {
    const userFound = await this.usersService.validateUserExistence(userId);
    const currentDate = new Date();
    const currentBudget = await this.budgetRepository.findOne({
      where: {
        user: userFound,
        endDate: this.getPreviousMonthEndDate(
          currentDate.toISOString().split('T')[0],
          1,
        ),
      },
      relations: ['categories'],
    });

    return currentBudget || null;
  }

  async updateBudgetTotalAmount(budgetToUpdate: Budget): Promise<void> {
    const budgetFound = await this.findOneBudgetById(
      budgetToUpdate.id,
      budgetToUpdate.user.id,
    );
    const budgetCategories =
      await this.categoriesService.findCategoriesByBudgetId(
        budgetFound.id,
        budgetFound.user.id,
      );
      budgetCategories.map((category) => {
        let amount = String(category.amount)
        
          category.amount = parseFloat(amount.replace(/\.00$/, '').trim())
      })
      console.log((typeof budgetCategories[0].amount))
      const totalAmount = budgetCategories.reduce(
        (acc, category) => acc + category.amount,
        0,
      );
      console.log(totalAmount);
      
    budgetToUpdate.totalAmount = totalAmount;
    await this.saveBudget(budgetToUpdate);
  }

  async deleteBudget(id: string, tokenId: string): Promise<Budget> {
    const budgetToDelete = await this.budgetRepository.findOne({
      where: { id }, relations: ['user']
    });
    await this.usersService.userOwnerValidation(tokenId, budgetToDelete.user);
    await this.budgetRepository.softRemove(budgetToDelete);
    return budgetToDelete;
  }

  private getPreviousMonthEndDate(
    startDate: string,
    numberToSum: number = 0,
  ): string {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + numberToSum, 0);
    console.log(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`, 'from getPreviousMonth');
    

    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
}
