"use client";

import { Bell, Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search clients, campaigns, templates..."
          className="pl-9"
        />
      </div>

      {/* Right */}
      <div className="ml-6 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-3 border-l pl-4">
          <Avatar>
            <AvatarFallback>DM</AvatarFallback>
          </Avatar>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium">
              Dei Morales
            </p>

            <p className="text-xs text-muted-foreground">
              Financial Advisor
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}