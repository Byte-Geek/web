"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icon } from "./icon";

const FEEDBACK_MS = 1600;

export function CopyButton({ text, label }: { text?: string; label?: string }) {
  const t = useTranslations("Common");
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text ?? location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), FEEDBACK_MS);
  };

  return (
    <button type="button" className="btn btn-sm" onClick={copy}>
      <Icon name="copy" />
      <span aria-live="polite">{isCopied ? t("copied") : (label ?? t("copy"))}</span>
    </button>
  );
}
