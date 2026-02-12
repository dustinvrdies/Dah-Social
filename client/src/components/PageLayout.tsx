import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";
import { LegalFooter } from "./LegalFooter";
import { CookieConsent } from "./CookieConsent";

interface PageLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideNav?: boolean;
}

export function PageLayout({ children, hideHeader = false, hideNav = false }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!hideHeader && <AppHeader />}
      <main className="flex-1 pb-24">
        {children}
      </main>
      <LegalFooter />
      {!hideNav && <BottomNav />}
      <CookieConsent />
    </div>
  );
}
