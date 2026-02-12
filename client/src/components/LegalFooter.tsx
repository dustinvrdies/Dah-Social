import { Link } from "wouter";

const legalLinks = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/community-guidelines", label: "Guidelines" },
  { href: "/acceptable-use", label: "Acceptable Use" },
  { href: "/dmca", label: "DMCA" },
  { href: "/cookie-policy", label: "Cookies" },
];

export function LegalFooter() {
  return (
    <footer className="border-t border-border/50 bg-card/50 py-6 px-4 mb-16" data-testid="legal-footer">
      <div className="max-w-4xl mx-auto space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-center text-[10px] text-muted-foreground/60">
          &copy; {new Date().getFullYear()} DAH Social. All rights reserved. DAH Coins have no real-world monetary value.
        </p>
      </div>
    </footer>
  );
}
