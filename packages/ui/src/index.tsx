"use client";

import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-base";

/* ---------------------------------------------------------------- Button */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "soft" | "link";
  size?: "sm" | "md";
  children: ReactNode;
};

const buttonVariants = {
  primary:
    "bg-accent text-base font-medium shadow-sm hover:bg-accent-strong active:translate-y-px disabled:opacity-50 disabled:shadow-none",
  ghost:
    "border border-border bg-transparent text-secondary hover:border-border-strong hover:text-primary disabled:opacity-50",
  soft: "bg-accent-soft text-primary hover:bg-elevated disabled:opacity-50",
  link: "text-accent underline-offset-4 hover:underline disabled:opacity-50",
};

const buttonSizes = {
  sm: "min-h-9 px-3 py-1.5 text-sm",
  md: "min-h-11 px-5 py-2.5 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    variant === "link"
      ? "inline-flex items-center gap-1 transition"
      : cx(
          "inline-flex items-center justify-center gap-2 rounded-lg transition duration-base ease-out",
          buttonSizes[size],
        );

  return (
    <button className={cx(base, buttonVariants[variant], focusRing, className)} {...props}>
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ Card */

type CardProps = HTMLAttributes<HTMLElement> & {
  variant?: "default" | "elevated" | "accent";
  interactive?: boolean;
  children: ReactNode;
};

const cardVariants = {
  default: "border-border bg-card",
  elevated: "border-border bg-card shadow-md",
  accent: "border-accent/25 bg-card shadow-glow",
};

export function Card({
  variant = "default",
  interactive = false,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <section
      className={cx(
        "rounded-2xl border p-5 sm:p-6",
        cardVariants[variant],
        interactive &&
          "transition duration-base ease-out hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lg",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

/* ------------------------------------------------------------- Typography */

export function SectionLabel({
  children,
  className = "",
  onDark = false,
}: {
  children: ReactNode;
  className?: string;
  /** Brighter accent + mark for text over photos/video */
  onDark?: boolean;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2.5 text-sm font-medium",
        onDark ? "text-accent-strong" : "text-muted",
        className,
      )}
    >
      <span
        aria-hidden
        className={cx(
          "h-1 w-7 shrink-0 rounded-full",
          onDark ? "bg-accent-strong" : "bg-accent",
        )}
      />
      {children}
    </span>
  );
}

export function Badge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ Chip */

export function Chip({
  children,
  selected = false,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cx(
        "rounded-full border px-4 py-2 text-sm transition duration-fast ease-out",
        focusRing,
        selected
          ? "border-accent bg-accent-soft text-primary shadow-sm"
          : "border-border bg-elevated text-secondary hover:border-border-strong hover:text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ----------------------------------------------------------------- Fields */

export function FieldLabel({
  children,
  htmlFor,
  hint,
}: {
  children: ReactNode;
  htmlFor?: string;
  hint?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between gap-3">
      <span className="text-sm font-medium text-secondary">{children}</span>
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

const fieldBase =
  "w-full rounded-lg border border-border bg-elevated px-3.5 py-2.5 text-primary placeholder:text-muted transition duration-fast focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/60";

export function TextInput({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(fieldBase, className)} {...props} />;
}

export function TextArea({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx(fieldBase, "resize-y leading-relaxed", className)} {...props} />;
}

export function SelectInput({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cx(fieldBase, "cursor-pointer", className)} {...props}>
      {children}
    </select>
  );
}

/* ----------------------------------------------------------------- Brand */

export function Brand({
  className = "",
  subtle = false,
}: {
  className?: string;
  subtle?: boolean;
}) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className={cx(
          "grid h-8 w-8 place-items-center rounded-lg font-display text-sm font-semibold",
          subtle
            ? "bg-accent-soft text-accent"
            : "bg-accent text-base shadow-glow",
        )}
      >
        RD
      </span>
      <span className="font-display text-base font-medium tracking-tightish text-primary">
        Music
      </span>
    </span>
  );
}
