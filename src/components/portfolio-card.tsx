import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getDictionary, type Locale } from "@/i18n";
import type { Project } from "@/lib/projects";

export function PortfolioCard({ project, locale, priority = false }: { project: Project; locale: Locale; priority?: boolean }) {
  const t = getDictionary(locale);
  return <Link href={`/${locale}/portofolio/${project.slug}`} className="portfolio-card" aria-label={`${t.common.viewProject}: ${project.title}`}>
    <div className="portfolio-card-image"><Image src={project.images[0]} alt={`${project.title} — ${t.categories[project.category as keyof typeof t.categories]}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw" priority={priority} /></div>
    <div className="portfolio-card-meta"><span>{t.categories[project.category as keyof typeof t.categories]} · {project.year}</span><ArrowUpRight size={19}/></div>
    <h3>{project.title}</h3><p>{t.status[project.status as keyof typeof t.status]}</p>
  </Link>;
}
