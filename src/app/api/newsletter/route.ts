import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { resend } from "@/lib/resend";
import { supabaseAdmin } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ParsedRequest {
  email: string | null;
  source: string | null;
  isForm: boolean;
}

async function parseRequest(request: Request): Promise<ParsedRequest> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const json = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const email = typeof json.email === "string" ? json.email.trim() : null;
    const source = typeof json.source === "string" ? json.source.trim() : null;
    return {
      email: email && email.length > 0 ? email : null,
      source,
      isForm: false,
    };
  }

  const form = await request.formData();
  const rawEmail = form.get("email");
  const rawSource = form.get("source");
  const email =
    typeof rawEmail === "string" && rawEmail.trim().length > 0
      ? rawEmail.trim()
      : null;
  const source =
    typeof rawSource === "string" && rawSource.trim().length > 0
      ? rawSource.trim()
      : null;
  return { email, source, isForm: true };
}

const welcomeHtml = (skoolUrl: string | undefined): string => `
  <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#111;">
    <h2 style="font-size:20px;margin:0 0 12px;">Sveiki atvykę į AI Studijos bendruomenę 👋</h2>
    <p style="font-size:15px;line-height:1.55;margin:0 0 16px;">
      Ačiū, kad prisijungei. Žemiau — kvietimas į uždarą AI Studijos bendruomenę, kurioje žmonės iš Lietuvos dalinasi savo AI darbais, klausimais ir atradimais.
    </p>
    ${
      skoolUrl
        ? `<p style="margin:0 0 24px;"><a href="${skoolUrl}" style="display:inline-block;background:#0a0a0a;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600;font-size:14px;">Prisijungti prie bendruomenės</a></p>`
        : `<p style="font-size:14px;color:#555;margin:0 0 24px;">Bendruomenės nuoroda atkeliaus atskiru laišku per artimiausią parą.</p>`
    }
    <p style="font-size:13px;color:#666;line-height:1.55;margin:0;">
      Jei turi klausimų, tiesiog atsakyk į šį laišką — perskaitysiu asmeniškai.
    </p>
    <p style="font-size:13px;color:#666;line-height:1.55;margin:12px 0 0;">— Nojus, AI Studijos</p>
  </div>
`;

export async function POST(request: Request): Promise<Response> {
  try {
    const { email, source, isForm } = await parseRequest(request);

    if (!email || !EMAIL_RE.test(email)) {
      if (isForm) {
        return NextResponse.redirect(
          new URL("/?error=newsletter", env.siteUrl),
          303,
        );
      }
      return NextResponse.json(
        { error: "Neteisingas el. pašto formatas." },
        { status: 400 },
      );
    }

    const supabase = supabaseAdmin();
    const { error: upsertError } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        { email, source: source ?? null },
        { onConflict: "email", ignoreDuplicates: false },
      );

    if (upsertError) {
      // If it's a true duplicate the upsert should not throw — but if RLS or
      // something else blocks, log and treat the user-facing result as ok-ish.
      console.error("[newsletter] supabase upsert failed", upsertError);
    }

    try {
      const fromEmail = env.resendFromEmail();
      const skoolUrl = process.env.SKOOL_INVITE_URL || undefined;
      await resend().emails.send({
        from: fromEmail,
        to: email,
        subject: "Sveiki atvykę į AI Studijos bendruomenę",
        html: welcomeHtml(skoolUrl),
      });
    } catch (mailError) {
      console.error("[newsletter] welcome email failed", mailError);
    }

    if (isForm) {
      return NextResponse.redirect(
        new URL("/aciu-uz-prenumerata", env.siteUrl),
        303,
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[newsletter] unexpected error", error);
    return NextResponse.json(
      { error: "Įvyko klaida. Pabandyk dar kartą." },
      { status: 500 },
    );
  }
}
