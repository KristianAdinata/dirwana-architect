import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/i18n";

export function pageMetadata(locale: Locale, key: "home" | "calculator" | "services" | "portfolio" | "about" | "contact", description?: string): Metadata {
  const t = getDictionary(locale);
  const title = t.meta[key];
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const path = key === "home" ? "" : `/${key === "calculator" ? "kalkulator" : key === "services" ? "layanan" : key === "portfolio" ? "portofolio" : key === "about" ? "tentang" : "kontak"}`;
  return {
    title,
    description: description ?? t.meta.homeDesc,
    ...(site ? { alternates: { canonical: `${site}/${locale}${path}`, languages: { "id-ID": `${site}/id${path}`, "en-US": `${site}/en${path}` } } } : {}),
    openGraph: { title, description: description ?? t.meta.homeDesc, locale: locale === "id" ? "id_ID" : "en_US", type: "website", ...(site ? { images: [{ url: `${site}/images/portfolio/villa/mr-leo-apple-orchard-01.jpg`, width: 800, height: 450, alt: "Mr. Leo Apple Orchard Kerobokan" }] } : {}) },
  };
}
