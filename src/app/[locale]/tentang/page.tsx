import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/page-heading";
import { getDictionary, isLocale } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { locale } = await params; return isLocale(locale) ? pageMetadata(locale, "about") : {}; }
export default async function AboutPage({ params }: Props) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const t = getDictionary(locale);
  return <><PageHeading eyebrow={t.about.eyebrow} title={t.about.title} intro={t.about.intro}/><div className="site-container wide-image"><Image src="/images/portfolio/rumah-tinggal/nuansa-balian-house-01.jpg" alt={t.about.imageAlt} fill priority sizes="(max-width: 900px) 100vw, 1200px"/></div><section className="site-section site-container about-grid"><div><p className="eyebrow">DIRWANA ARCHITECT</p><h2>{t.about.since}</h2><p>{t.about.work}</p></div><div><p>{t.about.paragraph1}</p><p>{t.about.paragraph2}</p><Link href={`/${locale}/kontak`} className="text-link">{t.common.consult}<ArrowUpRight size={18}/></Link></div></section></>;
}
