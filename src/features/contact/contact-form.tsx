"use client";

import Script from "next/script";
import { useLocale, useTranslations } from "next-intl";
import { type FormEvent, useActionState, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { sendContactMessage } from "./actions";
import { FormField, inputProps } from "./form-field";
import { type ContactState, invalidFields, type RequiredField, TOPICS } from "./schema";

const ERROR_KEYS: Record<RequiredField, string> = { name: "errName", email: "errEmail", message: "errMessage", consent: "errConsent" };
const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js";

function SentMessage({ onReset }: { onReset: () => void }) {
  const t = useTranslations("Contact.form");
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  return (
    <div className="glass grid content-start justify-items-start gap-4 p-8" role="status">
      <span className="icon-box text-success">
        <Icon name="check" className="icon text-success" />
      </span>
      <h2 ref={heading} tabIndex={-1} className="heading-2">
        {t("sentTitle")}
      </h2>
      <p className="text-muted">{t("sentText")}</p>
      <button type="button" className="btn" onClick={onReset}>
        {t("again")}
      </button>
    </div>
  );
}

export function ContactForm({ privacyHref, fallbackEmail }: { privacyHref: string; fallbackEmail: string }) {
  const t = useTranslations("Contact.form");
  const locale = useLocale();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [state, submit, isPending] = useActionState<ContactState, FormData>(sendContactMessage, { status: "idle" });
  const [invalid, setInvalid] = useState<RequiredField[]>([]);
  const [isSentDismissed, setIsSentDismissed] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const status = useRef<HTMLDivElement>(null);
  const shouldFocusError = useRef(false);

  const reportInvalid = (fields: RequiredField[]) => {
    shouldFocusError.current = true;
    setInvalid(fields);
  };

  useEffect(() => {
    if (state.status === "invalid") {
      shouldFocusError.current = true;
      setInvalid(state.fields);
    }
    if (state.status === "error") status.current?.focus();
    if (state.status === "sent") setIsSentDismissed(false);
  }, [state]);

  useEffect(() => {
    if (!shouldFocusError.current || !invalid.length) return;
    shouldFocusError.current = false;
    form.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
  }, [invalid]);

  if (state.status === "sent" && !isSentDismissed) return <SentMessage onReset={() => setIsSentDismissed(true)} />;

  const validateBeforeSubmit = (event: FormEvent<HTMLFormElement>) => {
    const fields = invalidFields(Object.fromEntries(new FormData(event.currentTarget)));
    if (!fields.length) return;
    event.preventDefault();
    reportInvalid(fields);
  };

  const isInvalid = (field: RequiredField) => invalid.includes(field);
  const errorFor = (field: RequiredField) => (isInvalid(field) ? t(ERROR_KEYS[field]) : undefined);
  const clear = (field: RequiredField) => isInvalid(field) && setInvalid((fields) => fields.filter((item) => item !== field));
  const serverError =
    state.status === "error"
      ? state.reason === "server"
        ? t("errServer", { email: fallbackEmail })
        : t(state.reason === "rate" ? "errRate" : "errCaptcha")
      : null;
  const summary = invalid.length ? t("errSummary", { n: invalid.length }) : serverError;

  return (
    <form
      ref={form}
      className="grid content-start gap-3.5"
      action={submit}
      noValidate
      aria-labelledby="form-title"
      onSubmit={validateBeforeSubmit}
    >
      {siteKey && <Script src={TURNSTILE_SCRIPT} strategy="lazyOnload" />}
      <div className="sr-only">
        <h2 id="form-title">{t("title")}</h2>
        <p>{t("required")}</p>
      </div>

      <div ref={status} tabIndex={-1} role="status" aria-live="polite" className={summary || isPending ? "callout" : ""}>
        {isPending ? (
          <>
            <span className="spinner" aria-hidden="true" />
            {t("sending")}
          </>
        ) : (
          summary && (
            <>
              <Icon name="alert" className="icon text-hot" />
              {summary}
            </>
          )
        )}
      </div>

      <input type="hidden" name="locale" value={locale} />
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <FormField id="contact-name" label={t("name")} isRequired error={errorFor("name")}>
          {(describedBy) => (
            <input
              {...inputProps("contact-name", "name", describedBy, isInvalid("name"))}
              placeholder={`${t("name")} *`}
              autoComplete="name"
              maxLength={120}
              onInput={() => clear("name")}
            />
          )}
        </FormField>
        <FormField id="contact-company" label={t("company")}>
          {(describedBy) => (
            <input
              {...inputProps("contact-company", "company", describedBy, false)}
              placeholder={t("company")}
              autoComplete="organization"
              maxLength={160}
            />
          )}
        </FormField>
        <FormField id="contact-email" label={t("email")} isRequired error={errorFor("email")}>
          {(describedBy) => (
            <input
              {...inputProps("contact-email", "email", describedBy, isInvalid("email"))}
              placeholder={`${t("email")} *`}
              type="email"
              inputMode="email"
              autoComplete="email"
              spellCheck={false}
              maxLength={200}
              onInput={() => clear("email")}
            />
          )}
        </FormField>
        <FormField id="contact-phone" label={t("phone")}>
          {(describedBy) => (
            <input
              {...inputProps("contact-phone", "phone", describedBy, false)}
              placeholder={t("phone")}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={40}
            />
          )}
        </FormField>
      </div>

      <FormField id="contact-topic" label={t("topic")}>
        {(describedBy) => (
          <select id="contact-topic" name="topic" className="input" defaultValue="" aria-describedby={describedBy}>
            <option value="">{t("topicPlaceholder")}</option>
            {TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {t(`topics.${topic}`)}
              </option>
            ))}
          </select>
        )}
      </FormField>

      <FormField id="contact-message" label={t("message")} isRequired hint={t("messageHint")} error={errorFor("message")}>
        {(describedBy) => (
          <textarea
            id="contact-message"
            name="message"
            className="input"
            placeholder={`${t("message")} *`}
            maxLength={5000}
            aria-describedby={describedBy}
            aria-invalid={isInvalid("message") || undefined}
            onInput={() => clear("message")}
          />
        )}
      </FormField>

      <div className="field">
        <label className="flex items-start gap-3 text-[13px] font-normal text-muted">
          <input
            type="checkbox"
            name="consent"
            className="mt-1 size-5 flex-none accent-accent"
            aria-invalid={isInvalid("consent") || undefined}
            aria-describedby={isInvalid("consent") ? "contact-consent-error" : undefined}
            onChange={() => clear("consent")}
          />
          <span>
            {t("consent")}{" "}
            <a href={privacyHref} className="text-accent-text">
              {t("consentLink")}
            </a>
          </span>
        </label>
        {isInvalid("consent") && (
          <span id="contact-consent-error" className="field-error">
            {errorFor("consent")}
          </span>
        )}
      </div>

      {siteKey && <div className="cf-turnstile" data-sitekey={siteKey} data-theme="auto" data-language={locale} data-size="flexible" />}

      <button type="submit" className="btn btn-accent w-full justify-center" aria-disabled={isPending || undefined}>
        {isPending ? t("sending") : t("send")}
        <Icon name="arrow" />
      </button>
    </form>
  );
}
