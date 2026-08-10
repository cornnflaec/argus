

import { Test, TestingModule } from '@nestjs/testing';
import {
  beforeEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals';

jest.mock('./prisma.service', () => ({
  PrismaService: class PrismaService {},
}));


import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';

describe('AppController', () => {
  let appController: AppController;

  const prismaMock = {
    $queryRaw: async () => [{ '?column?': 1 }],
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return the API and database health status', async () => {
      await expect(appController.health()).resolves.toEqual({
        status: 'ok',
        service: 'argus-api',
        database: 'connected',
      });
    });
  });
});