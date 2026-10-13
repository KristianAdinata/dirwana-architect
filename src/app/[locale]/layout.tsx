import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { isLocale, locales } from "@/i18n";
import { siteUrl } from "@/lib/site-url";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "DIRWANA ARCHITECT — DESIGN & BUILD", template: "%s | DIRWANA ARCHITECT" },
  icons: { icon: "/branding/favicon-concept.svg" },
  metadataBase: new URL(siteUrl),
  verification: { google: "OYWCAAPuc5-A6_xphNGdNuNDX1M_tHf6SBuLCZ1ozzg" },
};

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <html lang={locale}><body><SiteHeader locale={locale}/><main id="main-content">{children}</main><SiteFooter locale={locale}/></body></html>;
}
