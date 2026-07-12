import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import StarryBackground from "@/components/StarryBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { Loader2, Sparkles, Mail, Lock, User } from "lucide-react";
import SEOHead from "@/components/SEOHead";

type Mode = "login" | "register";

export default function Login() {
  const { language } = useLanguage();
  const isZh = language === "zh";
  const { isAuthenticated, loading, refresh } = useAuth();
  const [, setLocation] = useLocation();

  const returnTo = useMemo(() => {
    if (typeof window === "undefined") return "/";
    const p = new URLSearchParams(window.location.search).get("returnTo");
    if (!p || !p.startsWith("/") || p.startsWith("//")) return "/";
    return p;
  }, []);

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (!loading && isAuthenticated) {
      setLocation(returnTo);
    }
  }, [loading, isAuthenticated, returnTo, setLocation]);

  const loginMut = trpc.auth.login.useMutation({
    onSuccess: async () => {
      toast.success(isZh ? "登录成功" : "Signed in");
      await refresh();
      window.location.href = returnTo;
    },
    onError: (err) => toast.error(err.message),
  });

  const registerMut = trpc.auth.register.useMutation({
    onSuccess: async () => {
      toast.success(
        isZh
          ? "注册成功！已开通 14 天免费无限使用"
          : "Welcome! 14-day free unlimited trial started"
      );
      await refresh();
      window.location.href = returnTo;
    },
    onError: (err) => toast.error(err.message),
  });

  const pending = loginMut.isPending || registerMut.isPending;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      loginMut.mutate({ email: email.trim(), password });
    } else {
      registerMut.mutate({
        email: email.trim(),
        password,
        name: name.trim() || undefined,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title={isZh ? "登录" : "Sign in"} path="/login" noindex />
      <StarryBackground />
      <Navbar />

      <main className="flex-1 pt-24 pb-12 flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-[#d4a843]/25 bg-card/80 backdrop-blur">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#d4a843]/15 mb-1">
                <Sparkles className="w-6 h-6 text-[#d4a843]" />
              </div>
              <h1 className="text-2xl font-display font-bold">
                {mode === "login"
                  ? isZh
                    ? "登录 Fortune Insight"
                    : "Sign in to Fortune Insight"
                  : isZh
                    ? "创建账号"
                    : "Create account"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isZh
                  ? "注册即送 14 天免费无限使用 · 无需跳转第三方"
                  : "14-day free unlimited trial · no third-party redirect"}
              </p>
            </div>

            <div className="flex rounded-lg border border-border p-1 bg-muted/30">
              <button
                type="button"
                className={`flex-1 py-2 text-sm rounded-md transition-colors ${
                  mode === "login"
                    ? "bg-[#d4a843] text-[#1a1030] font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setMode("login")}
              >
                {isZh ? "登录" : "Sign in"}
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-sm rounded-md transition-colors ${
                  mode === "register"
                    ? "bg-[#d4a843] text-[#1a1030] font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setMode("register")}
              >
                {isZh ? "注册" : "Register"}
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {mode === "register" && (
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {isZh ? "昵称（可选）" : "Name (optional)"}
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isZh ? "怎么称呼你" : "How should we call you"}
                    autoComplete="name"
                    disabled={pending}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {isZh ? "邮箱" : "Email"}
                </label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={pending}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  {isZh ? "密码" : "Password"}
                </label>
                <Input
                  type="password"
                  required
                  minLength={mode === "register" ? 8 : 1}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    mode === "register"
                      ? isZh
                        ? "至少 8 位"
                        : "At least 8 characters"
                      : isZh
                        ? "你的密码"
                        : "Your password"
                  }
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  disabled={pending}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#d4a843] hover:bg-[#c49a38] text-[#1a1030] font-semibold"
                disabled={pending}
              >
                {pending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : mode === "login" ? (
                  isZh ? (
                    "登录"
                  ) : (
                    "Sign in"
                  )
                ) : isZh ? (
                  "注册并开始试用"
                ) : (
                  "Create account & start trial"
                )}
              </Button>
            </form>

            <p className="text-xs text-center text-muted-foreground">
              {isZh ? (
                <>
                  继续即表示同意{" "}
                  <Link href="/terms" className="underline hover:text-foreground">
                    服务条款
                  </Link>{" "}
                  与{" "}
                  <Link href="/privacy" className="underline hover:text-foreground">
                    隐私政策
                  </Link>
                </>
              ) : (
                <>
                  By continuing you agree to our{" "}
                  <Link href="/terms" className="underline hover:text-foreground">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline hover:text-foreground">
                    Privacy Policy
                  </Link>
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
