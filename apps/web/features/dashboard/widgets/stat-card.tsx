import { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  variant?: "primary" | "danger" | "accent";
}

const variantStyles = {
  primary: {
    icon: "bg-primary/10 text-primary",
  },
  danger: {
    icon: "bg-destructive/10 text-destructive",
  },
  accent: {
    icon: "bg-accent text-accent-foreground",
  },
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "primary",
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <p className="mt-2 text-3xl font-semibold tracking-tight">
            {value}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${variantStyles[variant].icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}