import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/page-heading";
import { getDictionary, isLocale } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";
import contact from "@/config/contact.json";
import { buildGeneralWhatsAppUrl, consultationAdmins } from "@/lib/whatsapp";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { locale } = await params; return isLocale(locale) ? pageMetadata(locale, "contact") : {}; }
export default async function ContactPage({ params }: Props) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const t = getDictionary(locale);
  return <><PageHeading eyebrow={t.contact.eyebrow} title={t.contact.title} intro={t.contact.intro}/><section className="site-container contact-grid"><div className="contact-primary"><p className="eyebrow">DIRWANA ARCHITECT</p><h2>{t.contact.hours}</h2><div className="contact-admin-actions" role="group" aria-label={t.common.consult}>{consultationAdmins.map((admin) => <a key={admin.id} className="button button-bronze" href={buildGeneralWhatsAppUrl(locale, admin.id)} target="_blank" rel="noopener noreferrer">{t.common[admin.id]} · {admin.displayPhone}<ArrowUpRight size={18}/></a>)}</div><p>{t.contact.note}</p><Link href={`/${locale}/kalkulator`} className="text-link">{t.common.estimate}<ArrowUpRight size={17}/></Link></div><div className="contact-details"><div><MapPin/><span><small>{t.contact.address}</small><strong>Jl. Patih Jelantik No. 7<br/>Dauh Puri Klod, Kec. Denpasar Barat<br/>Denpasar, Bali</strong><a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer">{t.contact.openMaps}<ArrowUpRight size={16}/></a></span></div><div><Mail/><span><small>{t.contact.email}</small>{contact.emails.map((email) => <a key={email} href={`mailto:${email}`}>{email}</a>)}</span></div><div><MessageCircle/><span><small>{t.contact.whatsapp}</small>{consultationAdmins.map((admin) => <a key={admin.id} href={buildGeneralWhatsAppUrl(locale, admin.id)} target="_blank" rel="noopener noreferrer">{t.common[admin.id]} · {admin.displayPhone} <ArrowUpRight size={16}/></a>)}</span></div><div><Instagram/><span><small>{t.common.instagram}</small><a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer">{contact.instagramHandle}<ArrowUpRight size={16}/></a></span></div></div></section></>;
}
