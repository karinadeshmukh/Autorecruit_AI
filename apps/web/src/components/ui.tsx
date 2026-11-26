import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Button({
  className,
  variant = "primary",
  href,
  target,
  rel,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "lime" | "ghost" | "danger";
  href?: string;
  target?: string;
  rel?: string;
}) {
  const styles = {
    primary: "bg-ink text-white hover:bg-black",
    secondary: "bg-white text-ink border border-ink/10 hover:border-ink/30",
    lime: "bg-lime text-ink hover:brightness-95",
    ghost: "bg-transparent text-ink hover:bg-black/5",
    danger: "bg-coral text-white hover:brightness-95",
  }[variant];
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:opacity-50",
    styles,
    className
  );
  if (href) {
    return (
      <Link href={href} target={target} rel={rel} className={cls}>
        {props.children}
      </Link>
    );
  }
  return <button suppressHydrationWarning className={cls} {...props} />;
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-3xl bg-card p-6 card-float border border-black/5", className)}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      suppressHydrationWarning
      className={cn(
        "w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-ink",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      suppressHydrationWarning
      className={cn(
        "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink",
        className
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1.5 block text-sm font-medium", className)} {...props} />;
}

export function Badge({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "lime" | "ink" | "yellow" | "coral";
}) {
  const map = {
    muted: "bg-black/5 text-muted",
    lime: "bg-lime text-ink",
    ink: "bg-ink text-white",
    yellow: "bg-sunflower/30 text-ink",
    coral: "bg-coral/15 text-coral",
  };
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", map[tone])}>
      {children}
    </span>
  );
}

export function ScoreRing({ score }: { score: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, score)) / 100) * c;
  return (
    <div className="relative h-14 w-14">
      <svg viewBox="0 0 56 56" className="-rotate-90">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#eee" strokeWidth="6" />
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke="#c8f04d"
          strokeWidth="6"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-xs font-bold">{Math.round(score)}</span>
    </div>
  );
}
