import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { PortfolioCard } from "@/components/portfolio-card";
import { getDictionary, isLocale } from "@/i18n";
import { projects, projectDescription } from "@/lib/projects";

type Props = { params: Promise<{ locale: string; slug: string }> };
export function generateStaticParams() { return projects.flatMap((project) => ["id", "en"].map((locale) => ({ locale, slug: project.slug }))); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!isLocale(locale) || !project) return {};
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return { title: project.title, description: projectDescription(project, locale), openGraph: { title: project.title, description: projectDescription(project, locale), ...(site ? { images: [{ url: `${site}${project.images[0]}`, alt: project.title }] } : {}) }, ...(site ? { alternates: { canonical: `${site}/${locale}/portofolio/${slug}`, languages: { "id-ID": `${site}/id/portofolio/${slug}`, "en-US": `${site}/en/portofolio/${slug}` } } } : {}) };
}
export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const t = getDictionary(locale);
  const related = projects.filter((item) => item.category === project.category && item.slug !== project.slug).slice(0, 3);
  const category = t.categories[project.category as keyof typeof t.categories];
  return <>
    <div className="project-top site-container"><Link href={`/${locale}/portofolio`} className="back-link"><ArrowLeft size={17}/>{t.nav.portfolio}</Link><p className="eyebrow">{category} · {project.year}</p><h1>{project.title}</h1><p className="project-status">{t.status[project.status as keyof typeof t.status]}</p></div>
    <div className="project-hero site-container"><Image src={project.images[0]} alt={`${project.title}, ${category}, ${t.status[project.status as keyof typeof t.status]}`} fill priority sizes="(max-width: 900px) 100vw, 1200px"/></div>
    <section className="site-container project-info"><div><p className="eyebrow">{t.portfolio.details}</p><h2>{projectDescription(project, locale)}</h2></div><dl><div><dt>{t.common.year}</dt><dd>{project.year}</dd></div><div><dt>{t.common.status}</dt><dd>{t.status[project.status as keyof typeof t.status]}</dd></div><div><dt>{t.common.location}</dt><dd>{project.location ?? t.common.notListed}</dd></div><div><dt>{t.common.landArea}</dt><dd>{project.landAreaM2 ? `${project.landAreaM2} m²` : t.common.notListed}</dd></div><div><dt>{t.common.buildingArea}</dt><dd>{project.buildingAreaM2 ? `${project.buildingAreaM2} m²` : t.common.notListed}</dd></div></dl></section>
    <section className="site-container project-gallery"><div className="section-heading"><div><p className="eyebrow">{t.portfolio.gallery}</p><h2>{project.title}</h2></div></div><div className="gallery-grid">{project.images.slice(1).map((image, index) => <div className="gallery-image" key={image}><Image src={image} alt={`${project.title} — ${t.portfolio.gallery.toLowerCase()} ${index + 2}`} fill sizes="(max-width: 640px) 100vw, 50vw"/></div>)}</div></section>
    {related.length > 0 && <section className="site-section related-section"><div className="site-container"><div className="section-heading"><div><p className="eyebrow">{t.portfolio.related}</p><h2>{t.common.explore}</h2></div><Link href={`/${locale}/portofolio`} className="text-link">{t.common.allProjects}<ArrowUpRight size={18}/></Link></div><div className="portfolio-grid">{related.map((item) => <PortfolioCard key={item.slug} project={item} locale={locale}/>)}</div></div></section>}
  </>;
}
