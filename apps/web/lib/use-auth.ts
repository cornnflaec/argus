'use client';

import { useEffect, useState } from 'react';

import { getCurrentUser, User } from './auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}