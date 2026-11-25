"use server";

import { headers } from "next/headers";
import { saveContactMessage } from "@/cms/queries";
import { isRateLimited, verifyTurnstile } from "./guards";
import { notifyByEmail } from "./notify";
import { type ContactState, contactSchema, invalidFields } from "./schema";

const FORM_FIELDS = ["name", "email", "phone", "company", "topic", "message", "consent"] as const;

async function clientIp() {
  const requestHeaders = await headers();
  return requestHeaders.get("cf-connecting-ip") ?? requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
}

export async function sendContactMessage(_previous: ContactState, form: FormData): Promise<ContactState> {
  if (form.get("website")) return { status: "sent" };

  const values = Object.fromEntries(FORM_FIELDS.map((field) => [field, form.get(field) ?? ""]));
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) return { status: "invalid", fields: invalidFields(values) };

  const ip = await clientIp();
  if (isRateLimited(ip)) return { status: "error", reason: "rate" };
  if (!(await verifyTurnstile(String(form.get("cf-turnstile-response") ?? ""), ip))) return { status: "error", reason: "captcha" };

  const message = parsed.data;
  const locale = String(form.get("locale") ?? "ro").slice(0, 2);
  try {
    await saveContactMessage({
      name: message.name,
      email: message.email,
      phone: message.phone || undefined,
      company: message.company || undefined,
      topic: message.topic || undefined,
      subject: message.company ? `${message.name} · ${message.company}` : message.name,
      message: message.message,
      locale,
    });
  } catch {
    return { status: "error", reason: "server" };
  }
  await notifyByEmail(message, locale).catch(() => undefined);
  return { status: "sent" };
}
