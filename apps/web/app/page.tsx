import { DashboardLayout } from "@/components/dashboard-layout";

export default function Home() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back, Dei.
        </p>
      </div>
    </DashboardLayout>
  );
}