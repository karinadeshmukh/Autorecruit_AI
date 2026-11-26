import { Logo } from "@/components/logo";
import { RegisterForm } from "./form";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <Logo />
      <h1 className="mt-8 text-3xl font-extrabold">Create your profile</h1>
      <p className="mt-2 text-muted">Candidates keep a living resume and apply in a few clicks.</p>
      <RegisterForm role="CANDIDATE" />
    </div>
  );
}
