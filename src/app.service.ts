import { Prisma, User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async register(userCreateInput: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({
      data: userCreateInput,
    });
  }
}
