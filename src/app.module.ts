import { Module } from '@nestjs/common';
import { ContactsModule } from './contacts/contacts.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';
import { AppService } from './app.service';

@Module({
  imports: [ContactsModule, AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
