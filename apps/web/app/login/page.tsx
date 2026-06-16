import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-16">
      <p className="text-sm text-muted">Private journal</p>
      <h1 className="mt-2 font-display text-3xl text-primary">Music OS</h1>
      <p className="mt-3 text-secondary leading-relaxed">
        A warm space for practice, reflection, and your coach — not a habit
        tracker.
      </p>
      {params.error === "config" ? (
        <p className="mt-4 rounded-lg border border-border bg-elevated px-3 py-2 text-sm text-secondary">
          Server is missing <code className="text-primary">MUSIC_OS_PASSWORD</code>.
          Copy <code className="text-primary">.env.example</code> to{" "}
          <code className="text-primary">apps/web/.env.local</code>.
        </p>
      ) : null}
      <LoginForm nextPath={params.next ?? "/studio"} />
    </main>
  );
}
