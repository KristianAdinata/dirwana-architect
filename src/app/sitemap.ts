import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!site) return [];
  const paths = ["", "/kalkulator", "/layanan", "/portofolio", "/tentang", "/kontak", ...projects.map((project) => `/portofolio/${project.slug}`)];
  return (["id", "en"] as const).flatMap((locale) => paths.map((path) => ({ url: `${site}/${locale}${path}`, changeFrequency: "monthly" as const, priority: path === "" ? 1 : 0.7 })));
}
