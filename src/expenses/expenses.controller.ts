import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard'; 
import { Expense } from './entities/expense.entity';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@UseGuards(AuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  async create(
    @Body() createExpenseDto: CreateExpenseDto,
    @Req() req: RequestWithUser,
  ): Promise<Expense> {
    const userId = req.user.user_id;
    return this.expensesService.createExpense(createExpenseDto, userId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<Expense> {
    const userId = req.user.user_id;
    return this.expensesService.findExpenseById(id, userId);
  }

  @Get('category/:categoryId')
  async findByCategory(
    @Param('categoryId') categoryId: string,
    @Req() req: RequestWithUser,
  ): Promise<Expense[]> {
    const userId = req.user.user_id;
    return this.expensesService.findExpensesByCategoryId(categoryId, userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: CreateExpenseDto,
    @Req() req: RequestWithUser,
  ): Promise<Expense> {
    const userId = req.user.user_id;
    return this.expensesService.updateExpense(id, updateExpenseDto, userId);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<Expense> {
    const userId = req.user.user_id;
    return this.expensesService.deleteExpense(id, userId);
  }
}
