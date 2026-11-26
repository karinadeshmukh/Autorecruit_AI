import { requireRole } from "@/lib/session";
import { AiSettingsForm } from "./form";

export default async function AdminAiPage() {
  await requireRole(["PLATFORM_ADMIN"]);
  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-extrabold">AI model settings</h1>
      <p className="mt-2 text-muted">Keys stay in environment variables. This panel only switches provider and model.</p>
      <AiSettingsForm />
    </div>
  );
}
