import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { resend } from "@/lib/resend";
import { supabaseAdmin } from "@/lib/supabase";

interface LeadPayload {
  vardas: string;
  imone?: string;
  email: string;
  telefonas?: string;
  komandos_dydis?: string;
  situacija?: string;
  source?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const str = (
  value: FormDataEntryValue | null | undefined,
): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

async function readPayload(request: Request): Promise<LeadPayload | null> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const json = (await request.json()) as Record<string, unknown>;
    const vardas = typeof json.vardas === "string" ? json.vardas.trim() : "";
    const email = typeof json.email === "string" ? json.email.trim() : "";
    if (!vardas || !email) return null;
    return {
      vardas,
      email,
      imone: typeof json.imone === "string" ? json.imone.trim() : undefined,
      telefonas:
        typeof json.telefonas === "string" ? json.telefonas.trim() : undefined,
      komandos_dydis:
        typeof json.komandos_dydis === "string"
          ? json.komandos_dydis.trim()
          : undefined,
      situacija:
        typeof json.situacija === "string" ? json.situacija.trim() : undefined,
      source: typeof json.source === "string" ? json.source.trim() : undefined,
    };
  }

  const form = await request.formData();
  const vardas = str(form.get("vardas"));
  const email = str(form.get("email"));
  if (!vardas || !email) return null;
  return {
    vardas,
    email,
    imone: str(form.get("imone")),
    telefonas: str(form.get("telefonas")),
    komandos_dydis: str(form.get("komandos_dydis")),
    situacija: str(form.get("situacija")),
    source: str(form.get("source")),
  };
}

const escapeHtml = (input: string): string =>
  input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderEmail = (lead: LeadPayload): string => {
  const row = (label: string, value?: string): string =>
    value
      ? `<tr><td style="padding:6px 12px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">${escapeHtml(label)}</td><td style="padding:6px 12px;font-size:14px;">${escapeHtml(value)}</td></tr>`
      : "";

  return `
    <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;">
      <h2 style="font-size:18px;margin:0 0 12px;">Nauja B2B užklausa</h2>
      <p style="font-size:14px;color:#555;margin:0 0 16px;">Užklausa iš <strong>${escapeHtml(lead.source ?? "tinklapis")}</strong>.</p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden;">
        ${row("Vardas", lead.vardas)}
        ${row("Įmonė", lead.imone)}
        ${row("El. paštas", lead.email)}
        ${row("Telefonas", lead.telefonas)}
        ${row("Komandos dydis", lead.komandos_dydis)}
        ${row("Situacija", lead.situacija)}
      </table>
    </div>
  `;
};

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const lead = await readPayload(request);
    if (!lead) {
      return NextResponse.json(
        { error: "Trūksta privalomų laukų." },
        { status: 400 },
      );
    }
    if (!EMAIL_RE.test(lead.email)) {
      return NextResponse.json(
        { error: "Neteisingas el. pašto formatas." },
        { status: 400 },
      );
    }

    const supabase = supabaseAdmin();
    const { error: insertError } = await supabase.from("leads").insert({
      vardas: lead.vardas,
      imone: lead.imone ?? null,
      email: lead.email,
      telefonas: lead.telefonas ?? null,
      komandos_dydis: lead.komandos_dydis ?? null,
      situacija: lead.situacija ?? null,
    });

    if (insertError) {
      console.error("[leads] supabase insert failed", insertError);
      return NextResponse.json(
        { error: "Nepavyko išsaugoti užklausos." },
        { status: 500 },
      );
    }

    try {
      const fromTo = env.resendFromEmail();
      await resend().emails.send({
        from: fromTo,
        to: fromTo,
        replyTo: lead.email,
        subject: `Nauja B2B užklausa: ${lead.vardas}${lead.imone ? ` · ${lead.imone}` : ""}`,
        html: renderEmail(lead),
      });
    } catch (mailError) {
      // Notification failure should not fail the request — lead is already stored.
      console.error("[leads] resend notification failed", mailError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[leads] unexpected error", error);
    return NextResponse.json(
      { error: "Įvyko klaida. Pabandyk dar kartą." },
      { status: 500 },
    );
  }
}
