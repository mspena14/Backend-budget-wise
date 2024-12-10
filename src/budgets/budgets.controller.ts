import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  UseGuards,
  Put,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard'; 
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { Budget } from './entities/budget.entity';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface'; 

@UseGuards(AuthGuard)
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  async create(
    @Body() createBudgetDto: CreateBudgetDto,
    @Req() req: RequestWithUser,
  ): Promise<Budget> {
    const userId = req.user.user_id;
    return this.budgetsService.createBudget(userId, createBudgetDto);
  }

  @Get()
  async findAll(@Req() req: RequestWithUser): Promise<Budget[]> {
    const userId = req.user.user_id;
    return this.budgetsService.findAllBudgets(userId);
  }

  @Get('findOneById/:id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: RequestWithUser,
  ): Promise<Budget> {
    const userId = req.user.user_id;
    return this.budgetsService.findOneBudgetById(id, userId);
  }

  @Get('current')
  async findCurrent(@Req() req: RequestWithUser): Promise<Budget> {
    const userId = req.user.user_id;
    return this.budgetsService.findCurrentBudgetByUserId(userId);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<Budget> {
    const userId = req.user.user_id;
    return this.budgetsService.deleteBudget(id, userId);
  }
}
