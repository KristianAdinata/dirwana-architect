import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/kalkulator", "/layanan", "/portofolio", "/tentang", "/kontak", ...projects.map((project) => `/portofolio/${project.slug}`)];
  return (["id", "en"] as const).flatMap((locale) => paths.map((path) => ({ url: `${siteUrl}/${locale}${path}`, changeFrequency: "monthly" as const, priority: path === "" ? 1 : 0.7 })));
}
