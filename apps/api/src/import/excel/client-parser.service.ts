import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { ExcelNormalizerService } from './excel-normalizer.service';
import { ExcelReaderService } from './excel-reader.service';

export interface ParsedClient {
  name: string;
  email: string | null;
  contactNumber: string | null;
  location: string | null;
  dateOfBirth: Date | null;
}

@Injectable()
export class ClientParserService {
  private readonly expectedHeaders = [
    'Client name',
    'Email address',
    'Contact number',
    'Location',
    'Date of birth',
    'Age',
  ];

  constructor(
    private readonly reader: ExcelReaderService,
    private readonly normalizer: ExcelNormalizerService,
  ) {}

  parse(
    workbook: Parameters<
      ExcelReaderService['getSheet']
    >[0],
  ): ParsedClient[] {
    const sheet =
      this.reader.getSheet(
        workbook,
        'All Individual Clients',
      );

    const rows =
      this.reader.sheetToRows(sheet);

    const headerIndex =
      this.findHeaderIndex(rows);

    const headers =
      rows[headerIndex];

    this.validateHeaders(headers);

    const clients: ParsedClient[] = [];

    for (
      let index = headerIndex + 1;
      index < rows.length;
      index++
    ) {
      const row = rows[index];

      if (!row || this.isEmptyRow(row)) {
        continue;
      }

      const name =
        this.normalizer.normalizeString(
          row[0],
        );

      if (!name) {
        continue;
      }

      clients.push({
        name,
        email:
          this.normalizer.normalizeEmail(
            row[1],
          ),
        contactNumber:
          this.normalizer.normalizeContactNumber(
            row[2],
          ),
        location:
          this.normalizer.normalizeString(
            row[3],
          ),
        dateOfBirth:
          this.normalizer.normalizeDate(
            row[4],
          ),
      });
    }

    return clients;
  }

  private findHeaderIndex(
  rows: unknown[][],
  ): number {
    return rows.findIndex((row) => {
      const headers = row.map((cell) =>
        String(cell ?? '')
          .trim()
          .replace(/\s+/g, ' ')
          .toLowerCase(),
      );

      return this.expectedHeaders.every(
        (header) =>
          headers.includes(
            header
              .trim()
              .replace(/\s+/g, ' ')
              .toLowerCase(),
          ),
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
          `Clients Excel file is missing column: ${expected}`,
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