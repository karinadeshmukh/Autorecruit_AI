import { Logo } from "@/components/logo";
import { RegisterForm } from "../form";

export default function CompanyRegisterPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <Logo />
      <h1 className="mt-8 text-3xl font-extrabold">Hire with AutoRecruit</h1>
      <p className="mt-2 text-muted">Create a company workspace. You stay in control of every hire.</p>
      <RegisterForm role="COMPANY_ADMIN" />
    </div>
  );
}
