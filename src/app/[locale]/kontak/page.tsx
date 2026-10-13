import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/page-heading";
import { getDictionary, isLocale } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";
import { buildGeneralWhatsAppUrl, displayWhatsAppNumber } from "@/lib/whatsapp";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { locale } = await params; return isLocale(locale) ? pageMetadata(locale, "contact") : {}; }
export default async function ContactPage({ params }: Props) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const t = getDictionary(locale);
  const whatsappUrl = buildGeneralWhatsAppUrl(locale);
  return <><PageHeading eyebrow={t.contact.eyebrow} title={t.contact.title} intro={t.contact.intro}/><section className="site-container contact-grid"><div className="contact-primary"><p className="eyebrow">DIRWANA ARCHITECT</p><h2>{t.contact.hours}</h2><a className="button button-bronze" href={whatsappUrl} target="_blank" rel="noopener noreferrer">{t.common.consult}<ArrowUpRight size={18}/></a><p>{t.contact.note}</p><Link href={`/${locale}/kalkulator`} className="text-link">{t.common.estimate}<ArrowUpRight size={17}/></Link></div><div className="contact-details"><div><MapPin/><span><small>{t.contact.address}</small><strong>Jl. Patih Jelantik No. 7<br/>Dauh Puri Klod, Kec. Denpasar Barat<br/>Denpasar, Bali</strong></span></div><div><Mail/><span><small>{t.contact.email}</small><a href="mailto:dirwanabuilding@gmail.com">dirwanabuilding@gmail.com</a></span></div><div><MessageCircle/><span><small>{t.contact.whatsapp}</small><a href={whatsappUrl} target="_blank" rel="noopener noreferrer">{displayWhatsAppNumber} <ArrowUpRight size={16}/></a></span></div></div></section></>;
}
