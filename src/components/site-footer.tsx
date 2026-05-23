import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-muted-foreground sm:px-6 sm:py-12 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <Link href="/" className="flex items-center gap-2 text-foreground">
            <span
              aria-hidden
              className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground"
            >
              AI
            </span>
            <span className="text-base font-semibold tracking-tight">
              AI Studijos
            </span>
          </Link>
          <p className="max-w-xs text-xs leading-relaxed">
            Praktiniai dirbtinio intelekto mokymai lietuviams. Greitas video
            kursas, mėnesiniai webinarai, mokymai komandai.
          </p>
        </div>

        <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-xs sm:grid-cols-3">
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Produktai</p>
            <Link href="/kursas" className="block hover:text-foreground">
              47 € kursas
            </Link>
            <Link href="/bootcamp" className="block hover:text-foreground">
              Mėnesinis bootcamp
            </Link>
            <Link href="/verslui" className="block hover:text-foreground">
              Mokymai komandai
            </Link>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Apie</p>
            <Link href="/apie" className="block hover:text-foreground">
              Kas mes
            </Link>
            <Link href="/kontaktai" className="block hover:text-foreground">
              Kontaktai
            </Link>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Teisinis</p>
            <Link href="/privatumas" className="block hover:text-foreground">
              Privatumas
            </Link>
            <Link href="/salygos" className="block hover:text-foreground">
              Sąlygos
            </Link>
          </div>
        </nav>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-4 text-[11px] text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} AI Studijos. Visos teisės saugomos.
        </div>
      </div>
    </footer>
  );
}
