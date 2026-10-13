"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { getDictionary, type Locale } from "@/i18n";

const links = [
  ["home", ""], ["calculator", "/kalkulator"], ["services", "/layanan"],
  ["portfolio", "/portofolio"], ["about", "/tentang"], ["contact", "/kontak"],
] as const;

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const otherLocale = locale === "id" ? "en" : "id";
  const switchPath = pathname.replace(/^\/(id|en)(?=\/|$)/, `/${otherLocale}`);
  return <header className="site-header">
    <a href="#main-content" className="skip-link">{t.nav.skip}</a>
    <div className="site-container header-inner">
      <Link href={`/${locale}`} className="brand" aria-label="DIRWANA ARCHITECT — DESIGN & BUILD" onClick={() => setOpen(false)}>
        <Image src="/branding/logo-concept.svg" alt="DIRWANA ARCHITECT — DESIGN & BUILD" width={207} height={51} priority className="brand-logo"/>
      </Link>
      <nav className="desktop-nav" aria-label={locale === "id" ? "Navigasi utama" : "Main navigation"}>
        {links.map(([key, href]) => <Link key={key} href={`/${locale}${href}`} className={pathname === `/${locale}${href}` ? "active" : ""}>{t.nav[key]}</Link>)}
      </nav>
      <div className="header-actions">
        <Link className="language-switch" href={switchPath || `/${otherLocale}`} aria-label={locale === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"} onClick={() => setOpen(false)}>{locale.toUpperCase()} <span>/</span> {otherLocale.toUpperCase()}</Link>
        <Link className="header-cta" href={`/${locale}/kalkulator`}>{t.common.estimate}<ArrowUpRight size={15}/></Link>
        <button className="mobile-menu-button" type="button" aria-label={open ? t.nav.close : t.nav.menu} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      </div>
    </div>
    {open && <nav className="mobile-nav" aria-label={locale === "id" ? "Navigasi seluler" : "Mobile navigation"}>
      {links.map(([key, href]) => <Link key={key} href={`/${locale}${href}`} onClick={() => setOpen(false)}>{t.nav[key]}<ArrowUpRight size={16}/></Link>)}
    </nav>}
  </header>;
}
