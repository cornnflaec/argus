import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt/jwt.guard';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientsService } from './clients.service';

@Controller('api/clients')
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() request: any) {
    return this.clientsService.findAll(
      request.user.sub,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() request: any,
    @Body() dto: CreateClientDto,
  ) {
    return this.clientsService.create(
      request.user.sub,
      dto,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Req() request: any,
    @Param('id') id: string,
  ) {
    return this.clientsService.findOne(
      request.user.sub,
      id,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Req() request: any,
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
  ) {
    return this.clientsService.update(
      request.user.sub,
      id,
      dto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Req() request: any,
    @Param('id') id: string,
  ) {
    return this.clientsService.remove(
      request.user.sub,
      id,
    );
  }
}