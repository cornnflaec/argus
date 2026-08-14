import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';

import { ClientParserService } from './excel/client-parser.service';
import { ExcelNormalizerService } from './excel/excel-normalizer.service';
import { ExcelReaderService } from './excel/excel-reader.service';
import { PolicyParserService } from './excel/policy-parser.service';

import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { ExcelDecryptionService } from './excel/excel-decryption.service';

@Module({
  imports: [
    AuthModule,
  ],

  controllers: [
    ImportController,
  ],

  providers: [
    PrismaService,
    ExcelDecryptionService,
    ExcelReaderService,
    ExcelNormalizerService,
    ClientParserService,
    PolicyParserService,
    ImportService,
  ],

  exports: [
    ImportService,
  ],
})
export class ImportModule {}  