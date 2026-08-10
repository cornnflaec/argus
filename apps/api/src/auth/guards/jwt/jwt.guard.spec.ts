import {
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtAuthGuard } from './jwt.guard';

describe('JwtAuthGuard', () => {
  const jwtMock = {
  verifyAsync: jest.fn() as jest.MockedFunction<
    (token: string) => Promise<unknown>
  >,
};

  const guard = new JwtAuthGuard(
    jwtMock as unknown as JwtService,
  );

  const createContext = (cookies: Record<string, string> = {}) => {
    const request = {
      cookies,
      user: undefined,
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    };

    return {
      context: context as unknown as ExecutionContext,
      request,
    };
  };

  it('should reject a request without a session cookie', async () => {
    const { context } = createContext();

    await expect(
      guard.canActivate(context),
    ).rejects.toThrow(
      new UnauthorizedException('Authentication required'),
    );
  });

  it('should reject an invalid JWT', async () => {
    jwtMock.verifyAsync.mockRejectedValueOnce(
      new Error('Invalid token'),
    );

    const { context } = createContext({
      argus_session: 'invalid-token',
    });

    await expect(
      guard.canActivate(context),
    ).rejects.toThrow(
      new UnauthorizedException('Invalid or expired session'),
    );
  });

    it('should accept a valid JWT and attach the user payload', async () => {
    const payload = {
      sub: 'user-123',
      email: 'dei@example.com',
    };

    jwtMock.verifyAsync.mockResolvedValueOnce(payload);

    const { context, request } = createContext({
      argus_session: 'valid-token',
    });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(request.user).toEqual(payload);
    expect(jwtMock.verifyAsync).toHaveBeenCalledWith(
      'valid-token',
    );
  });
});