import { Prisma, User } from '.prisma/client';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private appService: AppService,
  ) {}

  @Post('register')
  async register(
    @Body() userCreateInput: Prisma.UserCreateInput,
  ): Promise<User> {
    return await this.appService.register(userCreateInput);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const { accessToken, expireAt, rtid, user } = await this.authService.login(
      req.user,
    );
    const expires = new Date();
    expires.setDate(Date.now() + 1000 * 60 * 15);

    res.cookie('accessToken', accessToken, {
      path: '/',
      httpOnly: false,
      expires,
      secure: true,
    });

    return await accessToken;
  }

  @Post('rt')
  async exToken(@Body() info: { id: number; name: string }): Promise<any> {
    return await this.authService.exToken(info);
  }
}
