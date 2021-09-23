import { Prisma, User } from '.prisma/client';
import { Body, Controller, Delete, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { hasRoles } from './auth/decorator/roles.decorator';

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
  login(@Request() req): any {
    return this.authService.login(req.user, true);
  }

}
