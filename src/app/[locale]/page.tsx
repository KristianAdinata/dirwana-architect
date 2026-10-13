import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, MoveUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { PortfolioCard } from "@/components/portfolio-card";
import { getDictionary, isLocale } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";
import { projects } from "@/lib/projects";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { locale } = await params; return isLocale(locale) ? pageMetadata(locale, "home") : {}; }

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const featured = ["mr-leo-apple-orchard", "villa-kamanda", "tabanan-house-1"].map((slug) => projects.find((project) => project.slug === slug)!);
  return <>
    <section className="hero-home">
      <Image src="/images/portfolio/villa/mr-leo-apple-orchard-01.jpg" alt={t.home.heroImageAlt} fill priority sizes="100vw" className="hero-image"/>
      <div className="hero-shade"/>
      <div className="site-container hero-content"><p className="eyebrow light">{t.home.eyebrow}</p><h1>{t.home.title}</h1><p>{t.home.intro}</p><div className="hero-actions"><Link className="button button-bronze" href={`/${locale}/kalkulator`}>{t.common.estimate}<ArrowUpRight size={18}/></Link><a className="button button-outline-light" href={buildGeneralWhatsAppUrl(locale)} target="_blank" rel="noopener noreferrer">{t.common.consult}<ArrowRight size={18}/></a></div></div>
      <div className="site-container hero-bottom"><span><ArrowDown size={15}/>{t.home.scroll}</span><span>{t.home.imageCaption}</span></div>
    </section>

    <section className="intro-strip"><div className="site-container intro-strip-grid"><span>DIRWANA ARCHITECT<br/><small>DESIGN &amp; BUILD</small></span><p>{t.about.intro}</p><span className="intro-since">2018 <small>{locale === "id" ? "BERDIRI" : "FOUNDED"}</small></span></div></section>

    <section className="site-section calculator-feature"><div className="site-container feature-grid"><div className="feature-copy"><p className="eyebrow">{t.home.calculatorEyebrow}</p><h2>{t.home.calculatorTitle}</h2><p>{t.home.calculatorText}</p><ul>{[t.home.calculatorPoint1, t.home.calculatorPoint2, t.home.calculatorPoint3].map((item) => <li key={item}><Check size={17}/>{item}</li>)}</ul><Link href={`/${locale}/kalkulator`} className="text-link">{t.common.estimate}<ArrowUpRight size={18}/></Link></div><div className="feature-visual"><div className="visual-label">01 — {t.nav.calculator}</div><Image src="/images/portfolio/interior/villa-kamanda-01.jpg" alt={t.home.featureImageAlt} fill sizes="(max-width: 800px) 100vw, 50vw"/><div className="visual-overlay"><span>{t.home.featureOverlay}</span><ArrowUpRight size={25}/></div></div></div></section>

    <section className="site-section service-section"><div className="site-container"><div className="section-heading"><div><p className="eyebrow">{t.home.servicesEyebrow}</p><h2>{t.home.servicesTitle}</h2></div><Link href={`/${locale}/layanan`} className="text-link">{t.nav.services}<ArrowUpRight size={18}/></Link></div><div className="service-list">{t.services.items.map((item, index) => <Link href={`/${locale}/layanan`} className="service-row" key={item.title}><span className="service-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p><MoveUpRight size={22}/></Link>)}</div></div></section>

    <section className="site-section portfolio-section"><div className="site-container"><div className="section-heading"><div><p className="eyebrow">{t.home.portfolioEyebrow}</p><h2>{t.home.portfolioTitle}</h2><p>{t.home.portfolioText}</p></div><Link href={`/${locale}/portofolio`} className="text-link">{t.common.allProjects}<ArrowUpRight size={18}/></Link></div><div className="portfolio-grid home-grid">{featured.map((project) => <PortfolioCard key={project.slug} project={project} locale={locale}/>)}</div></div></section>

    <section className="site-section process-section"><div className="site-container process-grid"><div><p className="eyebrow">{t.home.processEyebrow}</p><h2>{t.home.processTitle}</h2></div><div className="process-list">{t.home.process.map((item, index) => <div key={item}><span>0{index + 1}</span><p>{item}</p><ArrowUpRight size={18}/></div>)}</div></div></section>

    <section className="site-section faq-section"><div className="site-container faq-grid"><div><p className="eyebrow">{t.home.faqEyebrow}</p><h2>{t.home.faqTitle}</h2></div><div>{t.home.faqs.map((faq) => <details key={faq.q}><summary>{faq.q}<span>+</span></summary><p>{faq.a}</p></details>)}</div></div></section>

    <section className="cta-band"><div className="site-container"><p className="eyebrow light">DIRWANA ARCHITECT</p><h2>{t.home.ctaTitle}</h2><p>{t.home.ctaText}</p><div className="cta-actions"><Link href={`/${locale}/kalkulator`} className="button button-bronze">{t.common.estimate}<ArrowUpRight size={17}/></Link><a href={buildGeneralWhatsAppUrl(locale)} target="_blank" rel="noopener noreferrer" className="button button-outline-light">{t.common.consult}<ArrowUpRight size={17}/></a></div></div></section>
  </>;
}
