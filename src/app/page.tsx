import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
        Greitai
      </p>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        AI Studijos
      </h1>
      <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg">
        Praktiniai dirbtinio intelekto mokymai lietuviams. Statome — sek
        pažangą.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/kursas">47 € AI kursas</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/webinaras">Mėnesinis webinaras</Link>
        </Button>
      </div>
    </main>
  );
}
