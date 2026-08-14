import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { ClientParserService } from './excel/client-parser.service';
import { ExcelDecryptionService } from './excel/excel-decryption.service';
import { ExcelReaderService } from './excel/excel-reader.service';
import { PolicyParserService } from './excel/policy-parser.service';
import multer from 'multer';
multer

@Injectable()
export class ImportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reader: ExcelReaderService,
    private readonly decryptor: ExcelDecryptionService,
    private readonly clientParser: ClientParserService,
    private readonly policyParser: PolicyParserService,
  ) {}

  async preview(
    clientsFile: Express.Multer.File,
    clientsPassword: string,
    policiesFile: Express.Multer.File,
    policiesPassword: string,
  ) {
    const parsed = await this.parseFiles(
      clientsFile,
      clientsPassword,
      policiesFile,
      policiesPassword,
    );

    const matching = this.matchPolicies(
      parsed.clients,
      parsed.policies,
    );

    return {
      clients: {
        total: parsed.clients.length,
      },

      policies: {
        total: parsed.policies.length,
      },

      matching: {
        matched: matching.matched.length,
        unmatched: matching.unmatched.length,
      },

      unmatchedPolicies:
        matching.unmatched.map((policy) => ({
          policyNumber: policy.policyNumber,
          policyOwner: policy.policyOwner,
          email: policy.email,
          contactNumber: policy.contactNumber,
        })),
    };
  }

  async import(
    userId: string,
    clientsFile: Express.Multer.File,
    clientsPassword: string,
    policiesFile: Express.Multer.File,
    policiesPassword: string,
  ) {
    const parsed = await this.parseFiles(
      clientsFile,
      clientsPassword,
      policiesFile,
      policiesPassword,
    );

    const matching = this.matchPolicies(
      parsed.clients,
      parsed.policies,
    );

    if (matching.unmatched.length > 0) {
      throw new BadRequestException(
        `Cannot import because ${matching.unmatched.length} policies could not be matched to a client`,
      );
    }

    return this.prisma.$transaction(
      async (tx) => {
        const clientMap =
          new Map<string, string>();

        let createdClients = 0;
        let updatedClients = 0;

        let createdPolicies = 0;
        let updatedPolicies = 0;

        /*
         * Import clients
         */
        for (const client of parsed.clients) {
          let existingClient =
            client.email
              ? await tx.client.findFirst({
                  where: {
                    ownerId: userId,
                    email: client.email,
                  },
                })
              : null;

          if (
            !existingClient &&
            client.contactNumber
          ) {
            existingClient =
              await tx.client.findFirst({
                where: {
                  ownerId: userId,
                  contactNumber:
                    client.contactNumber,
                },
              });
          }

          if (existingClient) {
            const updated =
              await tx.client.update({
                where: {
                  id: existingClient.id,
                },

                data: {
                  name: client.name,

                  email:
                    client.email ??
                    existingClient.email,

                  contactNumber:
                    client.contactNumber,

                  location:
                    client.location,

                  dateOfBirth:
                    client.dateOfBirth,
                },
              });

            clientMap.set(
              this.clientKey(client),
              updated.id,
            );

            updatedClients++;
          } else {
            const created =
              await tx.client.create({
                data: {
                  name: client.name,

                  email:
                    client.email ??
                    this.generateTemporaryEmail(
                      client,
                    ),

                  contactNumber:
                    client.contactNumber,

                  location:
                    client.location,

                  dateOfBirth:
                    client.dateOfBirth,

                  ownerId: userId,
                },
              });

            clientMap.set(
              this.clientKey(client),
              created.id,
            );

            createdClients++;
          }
        }

        /*
         * Import policies
         */
        for (const policy of parsed.policies) {
          const client =
            this.findClientForPolicy(
              parsed.clients,
              policy,
            );

          if (!client) {
            throw new BadRequestException(
              `Unable to match policy ${policy.policyNumber}`,
            );
          }

          const clientId =
            clientMap.get(
              this.clientKey(client),
            );

          if (!clientId) {
            throw new BadRequestException(
              `Unable to determine client for policy ${policy.policyNumber}`,
            );
          }

          const existingPolicy =
            await tx.policy.findUnique({
              where: {
                policyNumber:
                  policy.policyNumber,
              },

              include: {
                client: {
                  select: {
                    ownerId: true,
                  },
                },
              },
            });

          if (
            existingPolicy &&
            existingPolicy.client.ownerId !== userId
          ) {
            throw new BadRequestException(
              // `Policy ${policy.policyNumber} belongs to another account`,
              `Containing polices already belongs to another advisor. Ensure the correct file is being uploaded.`
            );
          }

          const data = {
            clientId,

            policyOwner:
              policy.policyOwner ?? '',

            insured:
              policy.insured ?? '',

            issueDate:
              policy.issueDate,

            policyType:
              policy.policyType,

            policyName:
              policy.policyName,

            policyCurrency:
              policy.policyCurrency,

            faceAmount:
              policy.faceAmount,

            premiumMode:
              policy.premiumMode,

            premiumAmount:
              policy.premiumAmount,

            excessPremium:
              policy.excessPremium,

            totalPremium:
              policy.totalPremium,

            premiumDueDate:
              policy.premiumDueDate,

            lastPaymentAmount:
              policy.lastPaymentAmount,

            lastPaymentDate:
              policy.lastPaymentDate,

            vulTotalPaymentsMade:
              policy.vulTotalPaymentsMade,

            policyStatus:
              policy.policyStatus,

            lapseCeaseDate:
              policy.lapseCeaseDate,

            policyAdvanceBalance:
              policy.policyAdvanceBalance,

            prepaidAmount:
              policy.prepaidAmount,

            fundCashValue:
              policy.fundCashValue,

            fundCashValueAsOfDate:
              policy.fundCashValueAsOfDate,

            contactNumber:
              policy.contactNumber,

            email:
              policy.email,

            billingAddress:
              policy.billingAddress,
          };

          if (existingPolicy) {
            await tx.policy.update({
              where: {
                id: existingPolicy.id,
              },

              data,
            });

            updatedPolicies++;
          } else {
            await tx.policy.create({
              data: {
                policyNumber:
                  policy.policyNumber,

                ...data,
              },
            });

            createdPolicies++;
          }
        }

        return {
          clients: {
            created: createdClients,
            updated: updatedClients,
          },

          policies: {
            created: createdPolicies,
            updated: updatedPolicies,
          },
        };
      },
    );
  }

  private async parseFiles(
    clientsFile: Express.Multer.File,
    clientsPassword: string,
    policiesFile: Express.Multer.File,
    policiesPassword: string,
  ) {
    if (!clientsFile) {
      throw new BadRequestException(
        'Clients Excel file is required',
      );
    }

    if (!policiesFile) {
      throw new BadRequestException(
        'Policies Excel file is required',
      );
    }

    if (!clientsPassword) {
      throw new BadRequestException(
        'Clients Excel password is required',
      );
    }

    if (!policiesPassword) {
      throw new BadRequestException(
        'Policies Excel password is required',
      );
    }

    const clientsBuffer =
      await this.decryptor.decrypt(
        clientsFile.buffer,
        clientsPassword,
      );

    const policiesBuffer =
      await this.decryptor.decrypt(
        policiesFile.buffer,
        policiesPassword,
      );

    const clientsWorkbook =
      this.reader.readWorkbook(
        clientsBuffer,
      );

    const policiesWorkbook =
      this.reader.readWorkbook(
        policiesBuffer,
      );

    const clients =
      this.clientParser.parse(
        clientsWorkbook,
      );

    const policies =
      this.policyParser.parse(
        policiesWorkbook,
      );

    return {
      clients,
      policies,
    };
  }

  private matchPolicies(
    clients: Array<{
      name: string;
      email: string | null;
      contactNumber: string | null;
    }>,
    policies: Array<{
      policyNumber: string;
      policyOwner: string | null;
      email: string | null;
      contactNumber: string | null;
    }>,
  ) {
    const matched: typeof policies = [];
    const unmatched: typeof policies = [];

    for (const policy of policies) {
      const emailMatches = policy.email
        ? clients.filter(
            (client) =>
              client.email ===
              policy.email,
          )
        : [];

      if (emailMatches.length === 1) {
        matched.push(policy);
        continue;
      }

      const contactMatches =
        policy.contactNumber
          ? clients.filter(
              (client) =>
                client.contactNumber ===
                policy.contactNumber,
            )
          : [];

      if (contactMatches.length === 1) {
        matched.push(policy);
        continue;
      }

      unmatched.push(policy);
    }

    return {
      matched,
      unmatched,
    };
  }

  private findClientForPolicy(
    clients: Array<{
      name: string;
      email: string | null;
      contactNumber: string | null;
    }>,
    policy: {
      email: string | null;
      contactNumber: string | null;
    },
  ) {
    if (policy.email) {
      const matches =
        clients.filter(
          (client) =>
            client.email ===
            policy.email,
        );

      if (matches.length === 1) {
        return matches[0];
      }
    }

    if (policy.contactNumber) {
      const matches =
        clients.filter(
          (client) =>
            client.contactNumber ===
            policy.contactNumber,
        );

      if (matches.length === 1) {
        return matches[0];
      }
    }

    return null;
  }

  private clientKey(
    client: {
      name: string;
      email: string | null;
      contactNumber: string | null;
    },
  ) {
    return (
      client.email ??
      `contact:${client.contactNumber}`
    );
  }

  private generateTemporaryEmail(
    client: {
      name: string;
      contactNumber: string | null;
    },
  ) {
    const identifier =
      client.contactNumber ??
      client.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');

    return `import-${identifier}@argus.local`;
  }
}