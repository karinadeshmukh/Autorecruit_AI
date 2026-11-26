import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-lime text-ink text-sm">A</span>
      <span className={light ? "text-white" : "text-ink"}>AutoRecruit</span>
    </Link>
  );
}
