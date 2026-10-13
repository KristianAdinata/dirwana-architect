import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/page-heading";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { getDictionary, isLocale } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";
import { projects } from "@/lib/projects";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { locale } = await params; return isLocale(locale) ? pageMetadata(locale, "portfolio") : {}; }
export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const t = getDictionary(locale);
  return <><PageHeading eyebrow={t.portfolio.eyebrow} title={t.portfolio.title} intro={t.portfolio.intro}/><section className="site-container portfolio-page"><PortfolioGrid projects={projects} locale={locale}/></section></>;
}
