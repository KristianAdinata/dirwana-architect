import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/page-heading";
import { getDictionary, isLocale } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { locale } = await params; return isLocale(locale) ? pageMetadata(locale, "services") : {}; }
export default async function ServicesPage({ params }: Props) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const t = getDictionary(locale);
  return <><PageHeading eyebrow={t.services.eyebrow} title={t.services.title} intro={t.services.intro}/><div className="site-container wide-image"><Image src="/images/portfolio/villa/kwanji-villa-01.jpg" alt={t.services.imageAlt} fill priority sizes="(max-width: 900px) 100vw, 1200px"/></div><section className="site-section site-container"><div className="service-page-list">{t.services.items.map((item, index) => <article key={item.title}><span>0{index + 1}</span><div><h2>{item.title}</h2><p>{item.text}</p></div><ArrowUpRight size={22}/></article>)}</div><div className="services-note"><p>{t.services.note}</p><Link href={`/${locale}/kalkulator`} className="button button-dark">{t.common.estimate}<ArrowUpRight size={17}/></Link></div></section></>;
}
