import { z } from "zod";

export const TOPICS = ["software", "security", "intelligence", "polygraph", "other"] as const;
const REQUIRED_FIELDS = ["name", "email", "message", "consent"] as const;
export type RequiredField = (typeof REQUIRED_FIELDS)[number];

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().trim().max(200),
  phone: optionalText(40),
  company: optionalText(160),
  topic: z.enum(TOPICS).optional().or(z.literal("")),
  message: z.string().trim().min(20).max(5000),
  consent: z.literal("on"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactState =
  | { status: "idle" }
  | { status: "invalid"; fields: RequiredField[] }
  | { status: "error"; reason: "captcha" | "rate" | "server" }
  | { status: "sent" };

export function invalidFields(values: Record<string, unknown>): RequiredField[] {
  const result = contactSchema.safeParse(values);
  if (result.success) return [];
  const paths = new Set(result.error.issues.map((issue) => String(issue.path[0])));
  return REQUIRED_FIELDS.filter((field) => paths.has(field));
}
