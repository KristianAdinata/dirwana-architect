import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getDictionary, type Locale } from "@/i18n";
import { buildGeneralWhatsAppUrl, displayWhatsAppNumber } from "@/lib/whatsapp";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return <footer className="site-footer">
    <div className="site-container footer-top">
      <div><Link href={`/${locale}`} className="footer-brand"><strong>DIRWANA ARCHITECT</strong><small>DESIGN &amp; BUILD</small></Link><p>{t.footer.copy}</p></div>
      <div><span className="footer-label">{t.footer.navigation}</span><div className="footer-links"><Link href={`/${locale}/kalkulator`}>{t.nav.calculator}</Link><Link href={`/${locale}/layanan`}>{t.nav.services}</Link><Link href={`/${locale}/portofolio`}>{t.nav.portfolio}</Link><Link href={`/${locale}/tentang`}>{t.nav.about}</Link></div></div>
      <div><span className="footer-label">{t.nav.contact}</span><address>Jl. Patih Jelantik No. 7<br/>Dauh Puri Klod, Denpasar Barat<br/>Denpasar, Bali</address><a href="mailto:dirwanabuilding@gmail.com">dirwanabuilding@gmail.com</a><a href={buildGeneralWhatsAppUrl(locale)} target="_blank" rel="noopener noreferrer">{displayWhatsAppNumber} <ArrowUpRight size={15}/></a></div>
    </div>
    <div className="site-container footer-bottom"><span>© {new Date().getFullYear()} DIRWANA ARCHITECT. {t.footer.rights}</span><span>{t.footer.review}</span></div>
  </footer>;
}
