'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/lib/use-auth';

export default function DashboardPage() {
  const router = useRouter();

  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-muted-foreground">
          Welcome back, {user.name}.
        </p>
      </div>
    </DashboardLayout>
  );
}