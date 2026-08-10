import { apiFetch } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface LoginResponse {
  user: User;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>(
    '/api/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    },
  );
}

export async function getCurrentUser(): Promise<{
  user: User;
}> {
  return apiFetch<{ user: User }>(
    '/api/auth/me',
  );
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>(
    '/api/auth/register',
    {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    },
  );
}

export async function logout(): Promise<void> {
  await apiFetch<void>(
    '/api/auth/logout',
    {
      method: 'POST',
    },
  );
}