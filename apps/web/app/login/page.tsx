import Link from "next/link";
import { Brand, Card, SectionLabel } from "@music/ui";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-8">
      <header className="flex items-center justify-between">
        <Link href="/" aria-label="Back to home">
          <Brand />
        </Link>
        <Link href="/" className="text-sm text-secondary transition hover:text-primary">
          <span aria-hidden>&larr;</span> Home
        </Link>
      </header>

      <div className="flex flex-1 flex-col justify-center py-12">
        <SectionLabel>Private journal</SectionLabel>
        <h1 className="mt-5 font-display text-4xl leading-tight tracking-tightish text-primary">
          Welcome back
        </h1>
        <p className="mt-4 leading-relaxed text-secondary">
          A warm room for practice, reflection, and your coach — never a habit
          tracker. Unlock to step inside.
        </p>

        {params.error === "config" ? (
          <p className="mt-6 rounded-lg border border-border bg-elevated px-3.5 py-3 text-sm text-secondary">
            Server is missing{" "}
            <code className="text-primary">MUSIC_OS_PASSWORD</code>. Copy{" "}
            <code className="text-primary">.env.example</code> to{" "}
            <code className="text-primary">apps/web/.env.local</code>.
          </p>
        ) : null}

        <Card variant="elevated" className="mt-7">
          <LoginForm nextPath={params.next ?? "/studio"} />
        </Card>
      </div>
    </main>
  );
}
