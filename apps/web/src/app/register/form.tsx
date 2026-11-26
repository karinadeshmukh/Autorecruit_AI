"use client";

import { Button, Input, Label } from "@/components/ui";
import { useState } from "react";
import { signIn } from "next-auth/react";

export function RegisterForm({ role }: { role: "CANDIDATE" | "COMPANY_ADMIN" }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not register");
      setPending(false);
      return;
    }
    await signIn("credentials", {
      email: fd.get("email"),
      password: fd.get("password"),
      redirect: false,
    });
    window.location.href = role === "CANDIDATE" ? "/app" : "/hr";
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      {role === "COMPANY_ADMIN" && (
        <div>
          <Label>Company name</Label>
          <Input name="companyName" required />
        </div>
      )}
      <div>
        <Label>Your name</Label>
        <Input name="name" required />
      </div>
      <div>
        <Label>Email</Label>
        <Input name="email" type="email" required />
      </div>
      <div>
        <Label>Password</Label>
        <Input name="password" type="password" minLength={8} required />
      </div>
      <input type="hidden" name="role" value={role} />
      {error && <p className="text-sm text-coral">{error}</p>}
      <Button className="w-full" disabled={pending}>
        {pending ? "Creating…" : "Continue"}
      </Button>
    </form>
  );
}
