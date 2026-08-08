import {
  Cake,
  CalendarDays,
  Mail,
  Users,
} from "lucide-react";

import { QuickActions } from "../widgets/quick-actions";
import { RecentActivity } from "../widgets/recent-activity";
import { StatCard } from "../widgets/stat-card";
import { TodaysEvents } from "../widgets/todays-events";

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Here's what's happening with your clients today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Clients"
          value="248"
          description="Total clients"
          icon={Users}
          variant="primary"
        />

        <StatCard
          title="Birthdays"
          value="5"
          description="Today"
          icon={Cake}
          variant="accent"
        />

        <StatCard
          title="Premium Due"
          value="14"
          description="This week"
          icon={CalendarDays}
          variant="danger"
        />

        <StatCard
          title="Campaigns"
          value="12"
          description="Sent this month"
          icon={Mail}
          variant="primary"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TodaysEvents />
        <RecentActivity />
      </div>
    </div>
  );
}