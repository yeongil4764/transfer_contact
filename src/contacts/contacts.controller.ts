import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Contact, Prisma, Token } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ContactsService } from './contacts.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@hasRoles('USER')
@Controller('contacts')
export class ContactsController {
  constructor(
    private contactsService: ContactsService,
    private authService: AuthService,
  ) {}

  @Get()
  async getAll(): Promise<Contact[]> {
    return await this.contactsService.getAll();
  }

  @Get('/:id')
  async getone(@Param('id') id): Promise<Contact> {
    return await this.contactsService.getone(Number(id));
  }

  @Post()
  async create(
    @Body() createContactInput: Prisma.ContactCreateInput,
  ): Promise<Contact> {
    return await this.contactsService.create(createContactInput);
  }

  @Put('/:id')
  async update(
    @Param('id') id,
    @Body() updateContactInput: Prisma.ContactUpdateInput,
  ): Promise<Contact> {
    return await this.contactsService.update(Number(id), updateContactInput);
  }

  @hasRoles('ADMIN')
  @Delete('/:id')
  async delete(@Param('id') id): Promise<Contact> {
    return await this.contactsService.delete(Number(id));
  }

  @Delete('rt/:id')
  async deleteRt(@Param('id') id): Promise<Token> {
    return await this.authService.deleteRefreshToken(Number(id));
  }
}
