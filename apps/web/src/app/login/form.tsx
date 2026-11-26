"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button, Input, Label } from "@/components/ui";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: fd.get("email"),
      password: fd.get("password"),
      redirect: false,
    });
    if (res?.error) {
      setError("Invalid email or password");
      setPending(false);
      return;
    }
    window.location.href = params.get("callbackUrl") || "/post-login";
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-sm space-y-4">
      <div>
        <Label>Email</Label>
        <Input name="email" type="email" required />
      </div>
      <div>
        <Label>Password</Label>
        <Input name="password" type="password" required />
      </div>
      {error && <p className="text-sm text-coral">{error}</p>}
      <Button className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Continue"}
      </Button>
      <p className="text-sm text-muted">
        New here? <a className="font-semibold text-ink" href="/register">Create a candidate account</a>
        {" · "}
        <a className="font-semibold text-ink" href="/register/company">Hire with AutoRecruit</a>
      </p>
    </form>
  );
}
