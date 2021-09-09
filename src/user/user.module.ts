import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from './user.service';

@Module({
  providers: [PrismaService, UserService],
  exports: [UserService, PrismaService],
})
export class UserModule {}
