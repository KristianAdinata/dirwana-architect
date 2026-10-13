import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/i18n";
import { siteUrl } from "@/lib/site-url";

export function pageMetadata(locale: Locale, key: "home" | "calculator" | "services" | "portfolio" | "about" | "contact", description?: string): Metadata {
  const t = getDictionary(locale);
  const title = t.meta[key];
  const path = key === "home" ? "" : `/${key === "calculator" ? "kalkulator" : key === "services" ? "layanan" : key === "portfolio" ? "portofolio" : key === "about" ? "tentang" : "kontak"}`;
  return {
    title,
    description: description ?? t.meta.homeDesc,
    alternates: { canonical: `${siteUrl}/${locale}${path}`, languages: { "id-ID": `${siteUrl}/id${path}`, "en-US": `${siteUrl}/en${path}` } },
    openGraph: { title, description: description ?? t.meta.homeDesc, locale: locale === "id" ? "id_ID" : "en_US", type: "website", images: [{ url: `${siteUrl}/images/portfolio/villa/mr-leo-apple-orchard-01.jpg`, width: 800, height: 450, alt: "Mr. Leo Apple Orchard Kerobokan" }] },
  };
}
