import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  FileFieldsInterceptor,
} from '@nestjs/platform-express';

import { JwtAuthGuard } from '../auth/guards/jwt/jwt.guard';
import { ImportService } from './import.service';

@Controller('api/import')
@UseGuards(JwtAuthGuard)
export class ImportController {
  constructor(
    private readonly importService: ImportService,
  ) {}

  @Post('excel/preview')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'clientsFile',
          maxCount: 1,
        },
        {
          name: 'policiesFile',
          maxCount: 1,
        },
      ],
      {
        limits: {
          fileSize: 20 * 1024 * 1024,
        },
      },
    ),
  )
  async preview(
    @Body()
    body: {
      clientsPassword?: string;
      policiesPassword?: string;
    },
    @UploadedFiles()
    files: {
      clientsFile?: Express.Multer.File[];
      policiesFile?: Express.Multer.File[];
    },
  ) {
    const clientsFile =
      files.clientsFile?.[0];

    const policiesFile =
      files.policiesFile?.[0];

    if (!clientsFile || !policiesFile) {
      throw new BadRequestException(
        'Both Excel files are required',
      );
    }

    if (!body.clientsPassword) {
      throw new BadRequestException(
        'CLients Excel Password are required',
      );
    }

    if (!body.policiesPassword) {
      throw new BadRequestException(
        'Policies Excel Password are required',
      );
    }

    return this.importService.preview(
      clientsFile,
      body.clientsPassword,
      policiesFile,
      body.policiesPassword
    );
  }

  @Post('excel')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'clientsFile',
        maxCount: 1,
      },
      {
        name: 'policiesFile',
        maxCount: 1,
      },
    ]),
  )
  async import(
    @Req() request: any,

    @Body()
    body: {
      clientsPassword?: string;
      policiesPassword?: string;
    },
    
    @UploadedFiles()
    files: {
      clientsFile?: Express.Multer.File[];
      policiesFile?: Express.Multer.File[];
    },
  ) {
    const clientsFile =
      files.clientsFile?.[0];

    const policiesFile =
      files.policiesFile?.[0];

    if (!clientsFile || !policiesFile) {
      throw new BadRequestException(
        'Both Excel files are required',
      );
    }

    if (!body.clientsPassword) {
      throw new BadRequestException(
        'Clients Excel password is required',
      );
    }

    if (!body.policiesPassword) {
      throw new BadRequestException(
        'Policies Excel password is required',
      );
    }

    return this.importService.import(
      request.user.sub,
      clientsFile,
      body.clientsPassword,
      policiesFile,
      body.policiesPassword
    );
  }
}