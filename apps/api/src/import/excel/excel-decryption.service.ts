import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import * as officeCrypto from 'officecrypto-tool';

@Injectable()
export class ExcelDecryptionService {
  async decrypt(
    buffer: Buffer,
    password: string,
  ): Promise<Buffer> {
    if (!password) {
      throw new BadRequestException(
        'Excel password is required',
      );
    }

    try {
      const decrypted =
        await officeCrypto.decrypt(
          buffer,
          {
            password,
          },
        );

      return Buffer.from(decrypted);
    } catch {
      throw new BadRequestException(
        'Unable to decrypt Excel file. Please verify the password.',
      );
    }
  }
}