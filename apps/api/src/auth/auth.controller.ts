import {
  Body,
  Controller,
  HttpCode,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt/jwt.guard';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: any,
  ) {
    const result = await this.authService.login(
      dto.email,
      dto.password,
    );

    response.cookie('argus_session', result.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      user: result.user,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() request: any) {
    const user = await this.authService.getCurrentUser(
      request.user.sub,
    );

    return {
      user,
    };
  }

  @Post('logout')
  @HttpCode(204)
  async logout(
    @Res({ passthrough: true }) response: any,
  ) {
    response.clearCookie('argus_session', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
  }
}