import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { Body, Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  register(@Body() registerDto: RegisterUserDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  profile(@Req() req: RequestWithUser) {
    return this.authService.profile({
      email: req.user.email,
    });
  }

  @UseGuards(AuthGuard)
  @Get('validate-token')
  validateToken() {
    return { valid: true };
  }
}
