import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-foreground text-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-12 text-sm sm:px-8 sm:py-16 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <Link
            href="/"
            className="logo block text-xl font-bold tracking-tight text-background sm:text-2xl"
            style={{ fontFamily: "var(--font-logo)" }}
          >
            AI STUDIJOS
          </Link>
          <p className="max-w-xs text-xs leading-relaxed text-background/70">
            Praktiniai dirbtinio intelekto mokymai lietuviams. Video kursas,
            bootcamp ir mokymai komandai.
          </p>
        </div>

        <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-xs sm:grid-cols-3">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-background/40">
              Produktai
            </p>
            <Link
              href="/"
              className="block text-background/80 hover:text-background"
            >
              Pilnas AI Asistento Gidas
            </Link>
            <Link
              href="/dirbtuves"
              className="block text-background/80 hover:text-background"
            >
              Savaitinės AI Dirbtuvės
            </Link>
            <Link
              href="/verslui"
              className="block text-background/80 hover:text-background"
            >
              Mokymai Komandai
            </Link>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-background/40">
              Apie
            </p>
            <Link
              href="/apie"
              className="block text-background/80 hover:text-background"
            >
              Kas mes
            </Link>
            <Link
              href="/kontaktai"
              className="block text-background/80 hover:text-background"
            >
              Kontaktai
            </Link>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-background/40">
              Teisinis
            </p>
            <Link
              href="/privatumas"
              className="block text-background/80 hover:text-background"
            >
              Privatumas
            </Link>
            <Link
              href="/salygos"
              className="block text-background/80 hover:text-background"
            >
              Sąlygos
            </Link>
          </div>
        </nav>
      </div>
      <div className="border-t border-background/10">
        <div className="mx-auto max-w-6xl px-5 py-4 text-[11px] text-background/50 sm:px-8">
          © {new Date().getFullYear()} AI Studijos. Visos teisės saugomos.
        </div>
      </div>
    </footer>
  );
}
