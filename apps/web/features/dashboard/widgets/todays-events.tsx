import { Cake, CalendarDays, CreditCard } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const events = [
  {
    name: "John Doe",
    type: "Birthday",
    date: "Today",
    icon: Cake,
  },
  {
    name: "Maria Santos",
    type: "Premium Due",
    date: "Today",
    icon: CreditCard,
  },
  {
    name: "Robert Cruz",
    type: "Policy Anniversary",
    date: "Today",
    icon: CalendarDays,
  },
];

export function TodaysEvents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Events</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {events.map((event) => {
          const Icon = event.icon;

          return (
            <div
              key={`${event.name}-${event.type}`}
              className="flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {event.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  {event.type}
                </p>
              </div>

              <span className="text-xs text-muted-foreground">
                {event.date}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}