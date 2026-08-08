import {
  FileSpreadsheet,
  MailPlus,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-3 sm:grid-cols-3">
        <Button variant="outline" className="justify-start">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Client
        </Button>

        <Button variant="outline" className="justify-start">
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Import Clients
        </Button>

        <Button variant="outline" className="justify-start">
          <MailPlus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </CardContent>
    </Card>
  );
}