import {
  FileSpreadsheet,
  Mail,
  UserPlus,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const activities = [
  {
    text: "Birthday campaign sent",
    detail: "12 clients",
    time: "2 hours ago",
    icon: Mail,
  },
  {
    text: "Client list imported",
    detail: "245 clients",
    time: "Yesterday",
    icon: FileSpreadsheet,
  },
  {
    text: "New client added",
    detail: "Sarah Garcia",
    time: "Yesterday",
    icon: UserPlus,
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={`${activity.text}-${activity.time}`}
              className="flex gap-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  {activity.text}
                </p>

                <p className="text-xs text-muted-foreground">
                  {activity.detail}
                </p>
              </div>

              <span className="whitespace-nowrap text-xs text-muted-foreground">
                {activity.time}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}