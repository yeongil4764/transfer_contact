import { Prisma, User } from '.prisma/client';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guard/local-auth.guard';

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

  @Post('login')
  @UseGuards(AuthGuard('local2'))
  login(@Request() req): any {
    console.log(req.user);
    return this.authService.login(req.user);
  }

  // @Post('login')
  // login2(@Body() user: User): any {
  //   console.log('login');

  //   return this.authService.login(user);
  // }
}
