import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { CreatePolicyDto } from './dto/create-policy.dto';

@Injectable()
export class PoliciesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findByClient(
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

    return this.prisma.policy.findMany({
      where: {
        clientId,
      },
      orderBy: {
        policyNumber: 'asc',
      },
    });
  }

  async findOne(
    userId: string,
    policyId: string,
  ) {
    const policy =
      await this.prisma.policy.findFirst({
        where: {
          id: policyId,
          client: {
            ownerId: userId,
          },
        },
      });

    if (!policy) {
      throw new NotFoundException(
        'Policy not found',
      );
    }

    return policy;
  }

  async create(
    userId: string,
    clientId: string,
    dto: CreatePolicyDto,
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

    const existingPolicy =
      await this.prisma.policy.findUnique({
        where: {
          policyNumber: dto.policyNumber,
        },
      });

    if (existingPolicy) {
      throw new BadRequestException(
        'A policy with this policy number already exists',
      );
    }

    return this.prisma.policy.create({
      data: {
        policyNumber: dto.policyNumber,
        clientId,

        policyOwner: dto.policyOwner,
        insured: dto.insured,

        issueDate: dto.issueDate
          ? new Date(dto.issueDate)
          : null,

        policyType: dto.policyType,
        policyName: dto.policyName,
        policyCurrency: dto.policyCurrency,

        faceAmount: dto.faceAmount,

        premiumMode: dto.premiumMode,
        premiumAmount: dto.premiumAmount,
        excessPremium: dto.excessPremium,
        totalPremium: dto.totalPremium,

        premiumDueDate: dto.premiumDueDate
          ? new Date(dto.premiumDueDate)
          : null,

        lastPaymentAmount:
          dto.lastPaymentAmount,

        lastPaymentDate: dto.lastPaymentDate
          ? new Date(dto.lastPaymentDate)
          : null,

        vulTotalPaymentsMade:
          dto.vulTotalPaymentsMade,

        policyStatus: dto.policyStatus,

        lapseCeaseDate: dto.lapseCeaseDate
          ? new Date(dto.lapseCeaseDate)
          : null,

        policyAdvanceBalance:
          dto.policyAdvanceBalance,

        prepaidAmount: dto.prepaidAmount,

        fundCashValue: dto.fundCashValue,

        fundCashValueAsOfDate:
          dto.fundCashValueAsOfDate
            ? new Date(dto.fundCashValueAsOfDate)
            : null,

        contactNumber: dto.contactNumber,
        email: dto.email,
        billingAddress: dto.billingAddress,
      },
    });
  }
}