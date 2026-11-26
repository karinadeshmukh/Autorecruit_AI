import { Logo } from "@/components/logo";
import { LoginForm } from "./form";
import { HeroPeople } from "@/components/illustrations";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="flex flex-col justify-center px-8 py-12 md:px-16">
        <Logo />
        <h1 className="mt-10 text-3xl font-extrabold">Welcome back</h1>
        <p className="mt-2 text-muted">Sign in to continue hiring or applying.</p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
      <div className="lime-glow hidden items-center justify-center md:flex">
        <HeroPeople />
      </div>
    </div>
  );
}
