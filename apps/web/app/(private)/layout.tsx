import type { Metadata } from "next";
import { PrivateNav } from "@/components/nav/PrivateNav";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-dvh max-w-2xl px-4 pb-8 pt-6">
      <header className="mb-8">
        <p className="text-sm text-muted">Music OS</p>
        <PrivateNav />
      </header>
      {children}
    </div>
  );
}
