import { Controller, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('/update/:id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: RequestWithUser) {
    return this.usersService.updateUser(id, updateUserDto, req.user.user_id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.usersService.removeUser(id, req.user.user_id);
  }

  @Patch('/request-password')
  @ApiOperation({ summary: 'Request a token to reset the password' })
  requestResetPassword(
    @Body() requestResetPasswordDto: RequestResetPasswordDto,
  ) {
    return this.usersService.requestResetPassword(requestResetPasswordDto);
  }

  @Patch('/reset-password')
  @ApiOperation({ summary: 'Reset password with password-token' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
    return this.usersService.resetPassword(resetPasswordDto);
  }
}
