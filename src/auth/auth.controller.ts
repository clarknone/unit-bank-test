import { Controller, Post, Body, BadRequestException, UseGuards } from '@nestjs/common';
import { isInstance } from 'class-validator';
import { AuthService } from './auth.service';
import { GetAuthUser } from './decorators/user.decorators';
import {
  ForgotPasswordDto,
  RefreshTokenDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from './dto/create-auth.dto';
import { JwtAuthGuard } from '../helper/guard/auth.guard';
import { IAuthUser } from './interfaces/auth.interface';
import { IErrorResponse } from './interfaces/response.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() data: SignUpDto): Promise<IAuthUser> {
    return this.authService.signup(data);
  }

  @Post('login')
  async login(@Body() data: SignInDto): Promise<IAuthUser> {
    return this.authService.signin(data);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@GetAuthUser() user: IAuthUser) {
    return this.authService.logout(user);
  }

  @Post('refresh')
  refresh(@Body() data: RefreshTokenDto) {
    return this.authService.refreshToken(data);
  }

  @Post('forgotpassword')
  forgotPassword(@Body() data: ForgotPasswordDto) {
    return this.authService.forgotPassword(data);
  }

  @Post('resetpassword')
  resetPassword(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data);
  }
}
