import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold">
          Project Argus
        </h1>

        <div className="flex gap-3">
          <Button>
            Primary Action
          </Button>

          <Button variant="destructive">
            Important Action
          </Button>

          <div className="rounded-lg bg-accent px-4 py-2 text-sm font-medium">
            Apricot Accent
          </div>
        </div>
      </div>
    </main>
  );
}