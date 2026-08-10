import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll(userId: string) {
    return this.prisma.client.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async create(
    userId: string,
    dto: CreateClientDto,
  ) {
    const existingClient =
      await this.prisma.client.findFirst({
        where: {
          ownerId: userId,
          email: dto.email,
        },
      });

    if (existingClient) {
      throw new BadRequestException(
        'A client with this email already exists',
      );
    }

    return this.prisma.client.create({
      data: {
        name: dto.name,
        email: dto.email,
        contactNumber: dto.contactNumber,
        location: dto.location,
        dateOfBirth: dto.dateOfBirth
          ? new Date(dto.dateOfBirth)
          : null,
        ownerId: userId,
      },
    });
  }

  async findOne(
    userId: string,
    clientId: string,
  ) {
    const client = await this.prisma.client.findFirst({
      where: {
        id: clientId,
        ownerId: userId,
      },
    });

    if (!client) {
      throw new NotFoundException(
        'Client not found',
      );
    }

    return client;
  }

  async update(
    userId: string,
    clientId: string,
    dto: UpdateClientDto,
  ) {
    const client = await this.findOne(
      userId,
      clientId,
    );

    return this.prisma.client.update({
      where: {
        id: client.id,
      },
      data: {
        name: dto.name,
        email: dto.email,
        contactNumber: dto.contactNumber,
        location: dto.location,
        dateOfBirth: dto.dateOfBirth
          ? new Date(dto.dateOfBirth)
          : undefined,
      },
    });
  }

  async remove(
    userId: string,
    clientId: string,
  ) {
    const client = await this.findOne(
      userId,
      clientId,
    );

    await this.prisma.client.delete({
      where: {
        id: client.id,
      },
    });

    return {
      message: 'Client deleted successfully',
    };
  }
}