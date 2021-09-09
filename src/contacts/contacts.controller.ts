import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Contact, Prisma } from '@prisma/client';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

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

  @Delete('/:id')
  async delete(@Param('id') id): Promise<Contact> {
    return await this.contactsService.delete(Number(id));
  }
}
