import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, loginSchema, RegisterDto, registerSchema } from './auth.dto';
import { ZodValidationPipe } from 'src/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }
}
