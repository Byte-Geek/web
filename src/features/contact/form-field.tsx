import type { InputHTMLAttributes, ReactNode } from "react";

type FormFieldProps = {
  id: string;
  label: string;
  isRequired?: boolean;
  error?: string;
  hint?: string;
  children: (describedBy: string | undefined) => ReactNode;
};

export function FormField({ id, label, isRequired, error, hint, children }: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className="field">
      <label htmlFor={id} className="sr-only">
        {label} {isRequired && <span className="text-hot">*</span>}
      </label>
      {children(describedBy)}
      {hint && (
        <span id={hintId} className="sr-only">
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className="field-error">
          {error}
        </span>
      )}
    </div>
  );
}

export const inputProps = (
  id: string,
  name: string,
  describedBy: string | undefined,
  isInvalid: boolean,
): InputHTMLAttributes<HTMLInputElement> => ({
  id,
  name,
  className: "input",
  "aria-describedby": describedBy,
  "aria-invalid": isInvalid || undefined,
});
