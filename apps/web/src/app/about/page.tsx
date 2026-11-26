import { MarketingNav } from "@/components/marketing-nav";
import { Card } from "@/components/ui";

export default function AboutPage() {
  return (
    <div>
      <MarketingNav />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-extrabold">
          AI assists screening. <span className="lime-mark">HR retains authority.</span>
        </h1>
        <p className="mt-4 text-muted">
          AutoRecruit is a multi-tenant recruitment platform. Companies control workflows. Candidates own their profiles.
          Models are switchable from an admin panel — scores stay explainable and separate from hiring decisions.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card>
            <h2 className="font-bold">Resume quality</h2>
            <p className="mt-2 text-sm text-muted">Job-agnostic structure, completeness, and writing signals.</p>
          </Card>
          <Card>
            <h2 className="font-bold">Job compatibility</h2>
            <p className="mt-2 text-sm text-muted">Keyword + semantic match against a specific opening.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
