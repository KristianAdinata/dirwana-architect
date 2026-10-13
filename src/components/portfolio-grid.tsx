"use client";

import { useState } from "react";
import { PortfolioCard } from "@/components/portfolio-card";
import { getDictionary, type Locale } from "@/i18n";
import type { Project } from "@/lib/projects";

export function PortfolioGrid({ projects, locale }: { projects: Project[]; locale: Locale }) {
  const t = getDictionary(locale);
  const [category, setCategory] = useState("all");
  const categories = ["all", "villa", "rumah-tinggal", "apartment", "interior"] as const;
  const filtered = category === "all" ? projects : projects.filter((project) => project.category === category);
  return <>
    <div className="portfolio-filters" role="group" aria-label={locale === "id" ? "Filter kategori proyek" : "Filter project category"}>
      {categories.map((key) => <button key={key} type="button" className={category === key ? "active" : ""} aria-pressed={category === key} onClick={() => setCategory(key)}>{t.categories[key]}<span>{key === "all" ? projects.length : projects.filter((project) => project.category === key).length}</span></button>)}
    </div>
    {filtered.length ? <div className="portfolio-grid">{filtered.map((project, index) => <PortfolioCard key={project.slug} project={project} locale={locale} priority={index < 3}/>)}</div> : <p>{t.portfolio.empty}</p>}
  </>;
}
