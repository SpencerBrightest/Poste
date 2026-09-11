import Link from "next/link";
import { AtSign, BriefcaseBusiness, Camera, Globe2, PlayCircle } from "lucide-react";

// Renders the compact reference-inspired footer for Poste's public pages.
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-brand-column"><Link className="brand" href="/"><span className="brand-mark">P</span><span>poste</span></Link><p>The calm, intuitive workspace for creators, freelancers, and small teams building a consistent social presence.</p></div>
        <FooterGroup title="Product" links={[["Publishing", "#publishing"], ["Analytics", "#analytics"], ["AI advisor", "#engagement"], ["Integrations", "#workflow"]]} />
        <FooterGroup title="Resources" links={[["Content ideas", "#engagement"], ["Workflow guide", "#workflow"], ["Help center", "#resources"], ["API docs", "#resources"]]} />
        <FooterGroup title="Company" links={[["About Poste", "#top"], ["Contact", "mailto:hello@poste.co"], ["Careers", "#top"], ["Press kit", "#top"]]} />
        <FooterGroup title="Legal & trust" links={[["Privacy policy", "#top"], ["Terms of service", "#top"], ["Security", "#top"]]} />
      </div>
      <div className="footer-bottom"><span>© 2026 Poste. All rights reserved.</span><div className="footer-socials"><a href="#top" aria-label="Poste community"><AtSign size={15} /></a><a href="#top" aria-label="Poste photo feed"><Camera size={15} /></a><a href="#top" aria-label="Poste professional network"><BriefcaseBusiness size={15} /></a><a href="#top" aria-label="Poste video feed"><PlayCircle size={15} /></a></div><div className="footer-settings"><span><Globe2 size={13} /> English</span><span>FCFA</span></div></div>
    </footer>
  );
}

// Renders one grouped set of footer navigation links.
function FooterGroup({ title, links }: { title: string; links: string[][] }) {
  return <div className="footer-links-group"><h3>{title}</h3>{links.map(([label, href]) => <a href={href} key={label}>{label}</a>)}</div>;
}
