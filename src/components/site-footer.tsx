import Link from "next/link";
import { ArrowUpRight, Instagram, Mail, MapPin } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { getDictionary, type Locale } from "@/i18n";
import contact from "@/config/contact.json";
import { buildGeneralWhatsAppUrl, consultationAdmins } from "@/lib/whatsapp";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <footer className="site-footer">
      <div className="site-container footer-top">
        <div>
          <Link href={`/${locale}`} className="footer-brand">
            <strong>DIRWANA ARCHITECT</strong>
            <small>DESIGN &amp; BUILD</small>
          </Link>
          <p>{t.footer.copy}</p>
        </div>
        <div>
          <span className="footer-label">{t.footer.navigation}</span>
          <div className="footer-links">
            <Link href={`/${locale}/kalkulator`}>{t.nav.calculator}</Link>
            <Link href={`/${locale}/layanan`}>{t.nav.services}</Link>
            <Link href={`/${locale}/portofolio`}>{t.nav.portfolio}</Link>
            <Link href={`/${locale}/tentang`}>{t.nav.about}</Link>
          </div>
        </div>
        <div>
          <span className="footer-label">{t.nav.contact}</span>
          <div className="footer-contact-address">
            <MapPin size={17} aria-hidden="true" />
            <div>
              <address>Jl. Patih Jelantik No. 7<br />Dauh Puri Klod, Denpasar Barat<br />Denpasar, Bali</address>
              <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer">
                {t.contact.openMaps} <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
          {contact.emails.map((email) => (
            <a className="footer-contact-link" key={email} href={`mailto:${email}`}>
              <Mail size={17} aria-hidden="true" /><span>{email}</span>
            </a>
          ))}
          {consultationAdmins.map((admin) => (
            <a className="footer-contact-link" key={admin.id} href={buildGeneralWhatsAppUrl(locale, admin.id)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon /><span>{t.common[admin.id]} · {admin.displayPhone}</span><ArrowUpRight size={15} aria-hidden="true" />
            </a>
          ))}
          <a className="footer-contact-link" href={contact.instagramUrl} target="_blank" rel="noopener noreferrer">
            <Instagram size={17} aria-hidden="true" /><span>{contact.instagramHandle}</span><ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="site-container footer-bottom">
        <span>© {new Date().getFullYear()} DIRWANA ARCHITECT. {t.footer.rights}</span>
      </div>
    </footer>
  );
}
