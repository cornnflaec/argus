'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
      <div className="flex min-h-full items-center justify-center">
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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-muted-foreground">
          Welcome back, {user.name}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Clients
          </p>

          <p className="mt-2 text-2xl font-bold">
            —
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Campaigns
          </p>

          <p className="mt-2 text-2xl font-bold">
            —
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Emails Sent
          </p>

          <p className="mt-2 text-2xl font-bold">
            —
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Templates
          </p>

          <p className="mt-2 text-2xl font-bold">
            —
          </p>
        </div>
      </div>
    </div>
  );
}