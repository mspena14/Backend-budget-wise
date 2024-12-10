import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Budget } from 'src/budgets/entities/budget.entity';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetsService } from 'src/budgets/budgets.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @Inject(forwardRef(() => BudgetsService)) private readonly budgetsService: BudgetsService,
    private readonly usersService: UsersService,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto, userId: string) {
    const { budgetId } = createCategoryDto;
    const budgetFound = await this.budgetsService.findOneBudgetById(
      budgetId,
      userId,
    );

    const newCategory = this.categoryRepository.create({
      ...createCategoryDto,
      budget: budgetFound,
    });

    const categoryCreated = await this.categoryRepository.save(newCategory);
    if (!categoryCreated) throw new InternalServerErrorException('There was an error saving the category');

    await this.budgetsService.updateBudgetTotalAmount(budgetFound);

    return categoryCreated;
  }

  async findCategoryById(id: string, userId: string): Promise<Category> {
    const userFound = await this.usersService.validateUserExistence(userId);
    const categoryFound = await this.categoryRepository.findOne({
      where: { id, budget: { user: userFound }}, relations:['budget.user']
    });

    if (!categoryFound) throw new NotFoundException('Category not found');
    return categoryFound;
  }

  async findCategoriesByBudgetId(
    budgetId: string,
    userId: string,
  ): Promise<Category[]> {
    const userFound = await this.usersService.validateUserExistence(userId);
    const budgetFound = await this.budgetsService.findOneBudgetById(
      budgetId,
      userFound.id,
    );

    if (!budgetFound) throw new NotFoundException('Budget not found');
    try {
      return await this.categoryRepository.find({
        where: { budget: budgetFound },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'There was an error finding the categories',
        error,
      );
    }
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    userId: string,
  ): Promise<Category> {
    const userFound = await this.usersService.validateUserExistence(userId);
    const categoryFound = await this.categoryRepository.findOne({
      where: { id, budget: { user: userFound } },
      relations:['budget.user']
    });

    if (!categoryFound) throw new NotFoundException('Category not found');

    const updatedCategory = Object.assign(categoryFound, updateCategoryDto);

    try {
      const categorySaved = await this.categoryRepository.save(updatedCategory);
      await this.budgetsService.updateBudgetTotalAmount(categorySaved.budget);
      return categorySaved
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'There was an error saving the category',
        error,
      );
    }
  }

  async deleteCategory(id: string, userId: string): Promise<Category> {
    const userFound = await this.usersService.validateUserExistence(userId);
    const categoryFound = await this.categoryRepository.findOne({
      where: { id, budget: { user: userFound } },
      relations:['budget.user']
    });

    if (!categoryFound) throw new NotFoundException('Category not found');
    
    try {
      await this.categoryRepository.softRemove(categoryFound);
      await this.budgetsService.updateBudgetTotalAmount(categoryFound.budget);
      return categoryFound;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'There was an error deleting the category',
        error,
      );
    }
  }

  async createDefaultCategoriesForBudget(newBudget: Budget) {
    const categories = [
      { name: "vivienda" },
      { name: "alimentación" },
      { name: "transporte" },
      { name: "salud" },
      { name: "educación" },
      { name: "ahorro" },
      { name: "entretenimiento" },
      { name: "ropa" },
      { name: "deudas" },
      { name: "servicios públicos" }
    ]
    
    try {
      const newCategories =  categories.map((category) =>
        this.categoryRepository.create({
          name: category.name,
          budget: newBudget,
        }),        
      );
      console.log(newCategories);

      await this.categoryRepository.save(newCategories);
    } catch (error) {
      throw new InternalServerErrorException(
        'There was an error saving the previous categories',
      );
    }
  }

  async createCategoriesForPreviousBudget(prevBudget: Budget, newBudget: Budget): Promise<void> {
    const categories = await this.findCategoriesForPreviousBudget(prevBudget);
    console.log(categories);
    
    try {
      const newCategories =  categories.map((category) =>
        this.categoryRepository.create({
          name: category.name,
          budget: newBudget,
        }),        
      );
      console.log(newCategories);

      await this.categoryRepository.save(newCategories);
    } catch (error) {
      throw new InternalServerErrorException(
        'There was an error saving the previous categories',
      );
    }
  }

  private async findCategoriesForPreviousBudget(
    budget: Budget,
  ): Promise<Category[]> {
    try {
      console.log('budget id from findCategoriesFor Previous', budget.id);
      
      const categoriesFound: Category[] = await this.categoryRepository.find({
        where: { budget: {id: budget.id} },
      });
      console.log('categoriesFound from findCategoriesfor previous==', categoriesFound);
      
      return categoriesFound;
    } catch (error) {
      throw new InternalServerErrorException(
        'There was an error finding the previous categories',
      );
    }
  }
}
