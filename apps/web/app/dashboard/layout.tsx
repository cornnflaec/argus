import { DashboardLayout } from '@/components/dashboard-layout';

interface DashboardRouteLayoutProps {
  children: React.ReactNode;
}

export default function DashboardRouteLayout({
  children,
}: DashboardRouteLayoutProps) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}