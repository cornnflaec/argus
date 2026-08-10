import {
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

jest.mock('../prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';

describe('AuthService', () => {
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const authService = new AuthService(
    prismaMock as unknown as PrismaService,
  );

  it('should hash a password', async () => {
    const hash = await authService.hashPassword(
      'TestPassword123',
    );

    expect(hash).not.toBe('TestPassword123');
    expect(hash).toContain('$argon2');
  });

  it('should verify a valid password', async () => {
    const hash = await authService.hashPassword(
      'TestPassword123',
    );

    const result = await authService.verifyPassword(
      'TestPassword123',
      hash,
    );

    expect(result).toBe(true);
  });

  it('should reject an invalid password', async () => {
    const hash = await authService.hashPassword(
      'TestPassword123',
    );

    const result = await authService.verifyPassword(
      'WrongPassword',
      hash,
    );

    expect(result).toBe(false);
  });
});