import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useTranslation } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { 
  Sparkles, 
  Menu, 
  X, 
  User, 
  LogOut,
  Moon,
  Star,
  Compass,
  Users,
  Crown,
  CloudMoon,
  Gift,
  Heart,
  LayoutDashboard,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import StreakBadge from "@/components/StreakBadge";
import NotificationBell from "@/components/NotificationBell";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, language } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/tarot", label: t.nav.tarot, icon: Moon },
    { href: "/bazi", label: t.nav.bazi, icon: Star },
    { href: "/horoscope", label: t.nav.horoscope, icon: Compass },
    { href: "/dream", label: t.nav.dream, icon: CloudMoon },
    { href: "/compatibility", label: t.nav.compatibility, icon: Heart },
    { href: "/community", label: t.nav.community, icon: Users },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const siteTitle = language === "zh" ? "洞察未来" : "Fortune Insight";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? "glass border-b border-[rgba(212,168,67,0.1)] shadow-[0_4px_30px_rgba(0,0,0,0.3)]" 
        : "bg-transparent border-b border-transparent"
    }`}>
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <Sparkles className="w-7 h-7 text-[#d4a843] transition-all duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-[rgba(212,168,67,0.3)] blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-lg font-display font-bold gradient-text tracking-wider">{siteTitle}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-1.5 transition-all duration-300 rounded-lg ${
                      isActive 
                        ? "text-[#d4a843] bg-[rgba(212,168,67,0.1)]" 
                        : "text-muted-foreground hover:text-foreground hover:bg-[rgba(212,168,67,0.05)]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-sm">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher variant="minimal" className="hidden sm:flex" />

            <Link href="/membership">
              <Button 
                variant="outline" 
                size="sm"
                className="hidden sm:flex gap-1.5 border-[rgba(212,168,67,0.3)] text-[#d4a843] hover:bg-[rgba(212,168,67,0.1)] hover:border-[rgba(212,168,67,0.5)] rounded-lg"
              >
                <Crown className="w-3.5 h-3.5" />
                <span className="text-sm">{t.nav.membership}</span>
              </Button>
            </Link>

            {isAuthenticated && <StreakBadge />}
            {isAuthenticated && <NotificationBell />}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative rounded-lg">
                    <Avatar className="w-8 h-8 border border-[rgba(212,168,67,0.3)]">
                      <AvatarFallback className="bg-[rgba(212,168,67,0.15)] text-[#d4a843] text-sm font-medium">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 glass-card border-[rgba(212,168,67,0.1)]">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user?.name || (language === "zh" ? "用户" : "User")}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-[rgba(212,168,67,0.1)]" />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="w-4 h-4" />
                      {t.nav.userCenter}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/membership" className="flex items-center gap-2 cursor-pointer">
                      <Crown className="w-4 h-4" />
                      {t.nav.membership}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/referral" className="flex items-center gap-2 cursor-pointer">
                      <Gift className="w-4 h-4" />
                      {language === 'zh' ? '邀请好友' : 'Invite Friends'}
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2 cursor-pointer text-[#d4a843]">
                        <LayoutDashboard className="w-4 h-4" />
                        {language === "zh" ? "运营后台" : "Admin console"}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-[rgba(212,168,67,0.1)]" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    {t.common.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                asChild 
                size="sm"
                className="bg-[#d4a843] hover:bg-[#c09030] text-[#0d0f1a] font-medium rounded-lg"
              >
                <a href={getLoginUrl()}>{t.common.login}</a>
              </Button>
            )}

            <div className="flex items-center gap-1 md:hidden">
              {isAuthenticated && <NotificationBell />}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[rgba(212,168,67,0.1)]">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-3 rounded-lg ${
                        isActive 
                          ? "text-[#d4a843] bg-[rgba(212,168,67,0.1)]" 
                          : "text-muted-foreground"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              <Link href="/membership">
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 rounded-lg ${
                    location === "/membership" 
                      ? "text-[#d4a843] bg-[rgba(212,168,67,0.1)]" 
                      : "text-[#d4a843]"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Crown className="w-5 h-5" />
                  {t.nav.membership}
                </Button>
              </Link>
              <div className="pt-2 border-t border-[rgba(212,168,67,0.1)] mt-2">
                <LanguageSwitcher variant="default" className="w-full justify-start" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
