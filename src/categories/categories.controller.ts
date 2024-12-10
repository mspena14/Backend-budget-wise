import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard'; 
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { Category } from './entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';

@UseGuards(AuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: RequestWithUser,
  ): Promise<Category> {
    const userId = req.user.user_id;
    return this.categoriesService.createCategory(createCategoryDto, userId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<Category> {
    const userId = req.user.user_id;
    
    return this.categoriesService.findCategoryById(id, userId);
  }

  @Get('budget/:budgetId')
  async findByBudget(
    @Param('budgetId') budgetId: string,
    @Req() req: RequestWithUser,
  ): Promise<Category[]> {
    const userId = req.user.user_id;
    console.log(userId);
    
    return this.categoriesService.findCategoriesByBudgetId(budgetId, userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req: RequestWithUser,
  ): Promise<Category> {
    const userId = req.user.user_id;
    return this.categoriesService.updateCategory(id, updateCategoryDto, userId);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<Category> {
    const userId = req.user.user_id;
    return this.categoriesService.deleteCategory(id, userId);
  }
}
