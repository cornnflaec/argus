import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { ExcelNormalizerService } from './excel-normalizer.service';
import { ExcelReaderService } from './excel-reader.service';

export interface ParsedPolicy {
  policyNumber: string;
  policyOwner: string | null;
  insured: string | null;

  issueDate: Date | null;
  policyType: string | null;
  policyName: string | null;
  policyCurrency: string | null;

  faceAmount: string | null;

  premiumMode: string | null;
  premiumAmount: string | null;
  excessPremium: string | null;
  totalPremium: string | null;

  premiumDueDate: Date | null;

  lastPaymentAmount: string | null;
  lastPaymentDate: Date | null;

  vulTotalPaymentsMade: string | null;

  policyStatus: string | null;
  lapseCeaseDate: Date | null;

  policyAdvanceBalance: string | null;
  prepaidAmount: string | null;
  fundCashValue: string | null;
  fundCashValueAsOfDate: Date | null;

  contactNumber: string | null;
  email: string | null;
  billingAddress: string | null;
}

@Injectable()
export class PolicyParserService {
  private readonly expectedHeaders = [
    'Policy number',
    'Policy owner',
    'Insured',
    'Issue date',
    'Policy type',
    'Policy name',
    'Policy currency',
    'Face amount',
    'Premium mode',
    'Premium amount',
    'Excess premium',
    'Total premium',
    'Premium due date',
    'Last payment amount',
    'Last payment date',
    'VUL Total payments made',
    'Policy status',
    'Lapse/Cease date',
    'Policy advance balance',
    'Prepaid amount',
    'Fund/Cash value',
    'Fund / Cash value as of date',
    'Contact number',
    'Email address',
    'Billing address',
  ];

  constructor(
    private readonly reader: ExcelReaderService,
    private readonly normalizer: ExcelNormalizerService,
  ) {}

  parse(
    workbook: Parameters<
      ExcelReaderService['getSheet']
    >[0],
  ): ParsedPolicy[] {
    const sheet =
      this.reader.getSheet(
        workbook,
        'All Individual Clients',
      );

    const rows =
      this.reader.sheetToRows(sheet);

    const headerIndex =
      this.findHeaderIndex(rows);

    if (headerIndex === -1) {
      throw new BadRequestException(
        'Policy Excel header row could not be found',
      );
    }

    const headers =
      rows[headerIndex];

    this.validateHeaders(headers);

    const policies: ParsedPolicy[] = [];

    for (
      let index = headerIndex + 1;
      index < rows.length;
      index++
    ) {
      const row = rows[index];

      if (!row || this.isEmptyRow(row)) {
        continue;
      }

      const policyNumber =
        this.normalizer.normalizePolicyNumber(
          row[0],
        );

      if (!policyNumber) {
        continue;
      }

      policies.push({
        policyNumber,

        policyOwner:
          this.normalizer.normalizeString(
            row[1],
          ),

        insured:
          this.normalizer.normalizeString(
            row[2],
          ),

        issueDate:
          this.normalizer.normalizeDate(
            row[3],
          ),

        policyType:
          this.normalizer.normalizeString(
            row[4],
          ),

        policyName:
          this.normalizer.normalizeString(
            row[5],
          ),

        policyCurrency:
          this.normalizer.normalizeString(
            row[6],
          ),

        faceAmount:
          this.normalizer.normalizeDecimal(
            row[7],
          ),

        premiumMode:
          this.normalizer.normalizeString(
            row[8],
          ),

        premiumAmount:
          this.normalizer.normalizeDecimal(
            row[9],
          ),

        excessPremium:
          this.normalizer.normalizeDecimal(
            row[10],
          ),

        totalPremium:
          this.normalizer.normalizeDecimal(
            row[11],
          ),

        premiumDueDate:
          this.normalizer.normalizeDate(
            row[12],
          ),

        lastPaymentAmount:
          this.normalizer.normalizeDecimal(
            row[13],
          ),

        lastPaymentDate:
          this.normalizer.normalizeDate(
            row[14],
          ),

        vulTotalPaymentsMade:
          this.normalizer.normalizeDecimal(
            row[15],
          ),

        policyStatus:
          this.normalizer.normalizeString(
            row[16],
          ),

        lapseCeaseDate:
          this.normalizer.normalizeDate(
            row[17],
          ),

        policyAdvanceBalance:
          this.normalizer.normalizeDecimal(
            row[18],
          ),

        prepaidAmount:
          this.normalizer.normalizeDecimal(
            row[19],
          ),

        fundCashValue:
          this.normalizer.normalizeDecimal(
            row[20],
          ),

        fundCashValueAsOfDate:
          this.normalizer.normalizeDate(
            row[21],
          ),

        contactNumber:
          this.normalizer.normalizeContactNumber(
            row[22],
          ),

        email:
          this.normalizer.normalizeEmail(
            row[23],
          ),

        billingAddress:
          this.normalizer.normalizeString(
            row[24],
          ),
      });
    }

    return policies;
  }

  private findHeaderIndex(
    rows: unknown[][],
  ): number {
    const requiredHeaders = [
      'policy number',
      'policy owner',
      'insured',
      'issue date',
      'policy type',
      'policy name',
      'policy currency',
      'face amount',
    ];

    return rows.findIndex((row) => {
      const headers = row.map((cell) =>
        String(cell ?? '')
          .trim()
          .replace(/\s+/g, ' ')
          .toLowerCase(),
      );

      return requiredHeaders.every(
        (header) =>
          headers.includes(header),
      );
    });
  }

  private validateHeaders(
    headers: unknown[],
  ) {
    const normalizedHeaders =
      headers.map((header) =>
        String(header ?? '')
          .trim()
          .replace(/\s+/g, ' ')
          .toLowerCase(),
      );

    for (
      const expected of this.expectedHeaders
    ) {
      const normalizedExpected =
        expected
          .trim()
          .replace(/\s+/g, ' ')
          .toLowerCase();

      if (
        !normalizedHeaders.includes(
          normalizedExpected,
        )
      ) {
        throw new BadRequestException(
          `Policy Excel file is missing column: ${expected}`,
        );
      }
    }
  }

  private isEmptyRow(
    row: unknown[],
  ): boolean {
    return row.every(
      (value) =>
        value === null ||
        value === undefined ||
        String(value).trim() === '',
    );
  }
}