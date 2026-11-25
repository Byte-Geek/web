import "server-only";
import type { ContactInput } from "./schema";

const RESEND_URL = "https://api.resend.com/emails";
const RESEND_TIMEOUT_MS = 8000;
const MAX_SUBJECT_LENGTH = 120;

function plainTextBody(message: ContactInput, locale: string) {
  const optional = [
    ["Telefon", message.phone],
    ["Organizație", message.company],
    ["Subiect", message.topic],
  ].flatMap(([label, value]) => (value ? [`${label}: ${value}`] : []));
  return [`Nume: ${message.name}`, `Email: ${message.email}`, ...optional, `Limba: ${locale}`, "", message.message].join("\n");
}

export async function notifyByEmail(message: ContactInput, locale: string) {
  const { RESEND_API_KEY: apiKey, CONTACT_TO: to, CONTACT_FROM: from } = process.env;
  if (!apiKey || !to || !from) return;
  await fetch(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: message.email,
      subject: `[INTELLECT] Mesaj nou: ${message.name}`.slice(0, MAX_SUBJECT_LENGTH),
      text: plainTextBody(message, locale),
    }),
    signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
  });
}
