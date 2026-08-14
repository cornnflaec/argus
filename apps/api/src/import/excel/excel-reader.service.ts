import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class ExcelReaderService {
  readWorkbook(
    buffer: Buffer,
  ): XLSX.WorkBook {
    try {
      return XLSX.read(buffer, {
        type: 'buffer',
        cellDates: true,
        cellNF: true,
        cellText: true,
      });
    } catch {
      throw new BadRequestException(
        'Unable to read Excel workbook',
      );
    }
  }

  getSheet(
    workbook: XLSX.WorkBook,
    sheetName: string,
  ): XLSX.WorkSheet {
    const sheet =
      workbook.Sheets[sheetName];

    if (!sheet) {
      throw new BadRequestException(
        `Excel sheet "${sheetName}" was not found`,
      );
    }

    return sheet;
  }

  sheetToRows(
    sheet: XLSX.WorkSheet,
  ): unknown[][] {
    return XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: null,
      raw: true,
    });
  }
}