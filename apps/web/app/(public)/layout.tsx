import { PublicHeader } from "@/components/public/PublicHeader";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader />
      {/* Footer is not global — the no-scroll home splash renders its own
       *  legal line; scrolling pages import <SiteFooter /> directly. */}
      <main>{children}</main>
    </>
  );
}
