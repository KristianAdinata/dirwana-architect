import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EstimatorWizard } from "@/components/estimator-wizard";
import { PageHeading } from "@/components/page-heading";
import { getDictionary, isLocale } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { locale } = await params; return isLocale(locale) ? pageMetadata(locale, "calculator") : {}; }
export default async function CalculatorPage({ params }: Props) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const t = getDictionary(locale);
  return <><PageHeading eyebrow={t.calc.eyebrow} title={t.calc.title} intro={t.calc.intro}/><EstimatorWizard locale={locale}/></>;
}
