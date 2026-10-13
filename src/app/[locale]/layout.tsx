import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { isLocale, locales } from "@/i18n";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "DIRWANA ARCHITECT — DESIGN & BUILD", template: "%s | DIRWANA ARCHITECT" },
  icons: { icon: "/branding/favicon-concept.svg" },
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
};

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <html lang={locale}><body><SiteHeader locale={locale}/><main id="main-content">{children}</main><SiteFooter locale={locale}/></body></html>;
}
