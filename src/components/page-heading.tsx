export function PageHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return <div className="page-heading site-container"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-intro">{intro}</p></div>;
}
