"use client";

import {
  BarChart3,
  Image,
  LayoutDashboard,
  Mail,
  Megaphone,
  Settings,
  Users,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Clients",
    href: "/dashboard/clients",
    icon: Users,
  },
  {
    name: "Campaigns",
    href: "/campaigns",
    icon: Megaphone,
  },
  {
    name: "Email Studio",
    href: "/email",
    icon: Mail,
  },
  {
    name: "Assets",
    href: "/assets",
    icon: Image,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-background">
      {/* Brand */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            A
          </div>

          <div>
            <p className="font-semibold">
              Argus
            </p>

            <p className="text-xs text-muted-foreground">
              Advisor Platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />

              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t p-4">
        <div className="rounded-lg bg-accent p-3">
          <p className="text-xs font-medium text-accent-foreground">
            Private Workspace
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Your client data stays under your control.
          </p>
        </div>
      </div>
    </aside>
  );
}