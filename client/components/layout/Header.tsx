import { Link, NavLink } from "react-router-dom";
import { RocketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export default function Header() {
  const { t } = useLanguage();
  
  const navItems = [
    { to: "/", label: t.home, emoji: "🏠" },
    { to: "/asteroids", label: t.asteroids, emoji: "🪐" },
    { to: "/simulation", label: t.orbitalSimulation, emoji: "🌍" },
    { to: "/mission", label: t.missionCenter, emoji: "🛰️" },
    { to: "/academy", label: t.academy, emoji: "📚" },
    { to: "/impacts", label: t.impacts, emoji: "⚠️" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-6">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight text-foreground">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <RocketIcon className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <span className="text-sm uppercase text-muted-foreground">Code Nebula</span>
            <div className="text-lg glow-text">Impactor-2025 🚀</div>
          </div>
        </Link>
        <nav className="flex items-center gap-2 text-xs sm:text-sm font-medium overflow-x-auto max-w-full">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 transition-colors",
                  "text-muted-foreground hover:text-foreground hover:bg-primary/10",
                  isActive && "bg-primary/20 text-primary"
                )
              }
            >
              <span className="text-base">{item.emoji}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link to="/simulation" className="hidden md:block">
            <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/20">
              {t.launchSimulation}
            </Button>
          </Link>
          <Link to="/mission">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">{t.missionCenter}</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
