import { Suspense, lazy, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import PageLoadingSkeleton from "./components/PageLoadingSkeleton";
import { useAnimationFallback } from "./hooks/useAnimationFallback";
import { useReferral } from "./hooks/useReferral";
import { lazyWithRetry, clearChunkReloadFlag } from "./lib/lazyWithRetry";
import UpdateNotification from "./components/UpdateNotification";

// Clear the chunk reload flag on successful app load
clearChunkReloadFlag();

// 首页懒加载 - 减少主bundle大小，骨架屏提供即时视觉反馈
const Home = lazyWithRetry(() => import("./pages/Home"));

// LiveChat延迟加载（非首屏关键）
const LiveChat = lazy(() => import("./components/LiveChat"));
const MobileStickyBar = lazy(() => import("./components/MobileStickyBar"));

// 其他页面懒加载 - 使用lazyWithRetry自动处理部署后的chunk失效问题
const Tarot = lazyWithRetry(() => import("./pages/Tarot"));
const Bazi = lazyWithRetry(() => import("./pages/Bazi"));
const Horoscope = lazyWithRetry(() => import("./pages/Horoscope"));
const Growth = lazyWithRetry(() => import("./pages/Growth"));
const Profile = lazyWithRetry(() => import("./pages/Profile"));
const Community = lazyWithRetry(() => import("./pages/Community"));
const Membership = lazyWithRetry(() => import("./pages/Membership"));
const Dream = lazyWithRetry(() => import("./pages/Dream"));
const Compatibility = lazyWithRetry(() => import("./pages/Compatibility"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound"));
const Contact = lazyWithRetry(() => import("./pages/Contact"));
const About = lazyWithRetry(() => import("./pages/About"));
const FAQ = lazyWithRetry(() => import("./pages/FAQ"));
const Privacy = lazyWithRetry(() => import("./pages/Privacy"));
const Terms = lazyWithRetry(() => import("./pages/Terms"));
const Charity = lazyWithRetry(() => import("./pages/Charity"));
const AdminContacts = lazyWithRetry(() => import("./pages/AdminContacts"));
const AdminChat = lazyWithRetry(() => import("./pages/AdminChat"));
const AdminChatStats = lazyWithRetry(() => import("./pages/AdminChatStats"));
const Notifications = lazyWithRetry(() => import("./pages/Notifications"));
const AdminNotifications = lazyWithRetry(() => import("./pages/AdminNotifications"));
const Referral = lazyWithRetry(() => import("./pages/Referral"));
const AdminEmailMarketing = lazyWithRetry(() => import("./pages/AdminEmailMarketing"));
const ShareRedirect = lazyWithRetry(() => import("./pages/ShareRedirect"));
const AdminShareStats = lazyWithRetry(() => import("./pages/AdminShareStats"));
const AdminMembership = lazyWithRetry(() => import("./pages/AdminMembership"));
const AdminDashboard = lazyWithRetry(() => import("./pages/AdminDashboard"));
const Login = lazyWithRetry(() => import("./pages/Login"));

/**
 * 延迟加载LiveChat组件 - 首屏渲染完成后3秒再加载
 * 避免与关键路径资源竞争网络带宽
 */
function DeferredLiveChat() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // 使用requestIdleCallback（如果可用）或setTimeout延迟加载
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(() => setShouldLoad(true), { timeout: 3000 });
      return () => cancelIdleCallback(id);
    } else {
      const timer = setTimeout(() => setShouldLoad(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!shouldLoad) return null;

  return (
    <Suspense fallback={null}>
      <LiveChat />
    </Suspense>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoadingSkeleton />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/tarot"} component={Tarot} />
        <Route path={"/bazi"} component={Bazi} />
        <Route path={"/horoscope"} component={Horoscope} />
        <Route path={"/growth"} component={Growth} />
        <Route path={"/profile"} component={Profile} />
        <Route path={"/community"} component={Community} />
        <Route path={"/membership"} component={Membership} />
        <Route path={"/dream"} component={Dream} />
        <Route path={"/compatibility"} component={Compatibility} />
        <Route path={"/contact"} component={Contact} />
        <Route path={"/about"} component={About} />
        <Route path={"/faq"} component={FAQ} />
        <Route path={"/privacy"} component={Privacy} />
        <Route path={"/terms"} component={Terms} />
        <Route path={"/charity"} component={Charity} />
        <Route path={"/admin"} component={AdminDashboard} />
        <Route path={"/admin/contacts"} component={AdminContacts} />
        <Route path={"/admin/chat"} component={AdminChat} />
        <Route path={"/admin/chat/stats"} component={AdminChatStats} />
        <Route path={"/notifications"} component={Notifications} />
        <Route path={"/admin/notifications"} component={AdminNotifications} />
        <Route path={"/referral"} component={Referral} />
        <Route path={"/admin/email-marketing"} component={AdminEmailMarketing} />
        <Route path={"/admin/share-stats"} component={AdminShareStats} />
        <Route path={"/admin/membership"} component={AdminMembership} />
        <Route path={"/login"} component={Login} />
        <Route path={"/share"} component={ShareRedirect} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function AnimationFallback() {
  useAnimationFallback(2000);
  return null;
}

function ReferralTracker() {
  useReferral();
  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Toaster />
            <UpdateNotification />
            <Router />
            <AnimationFallback />
            <ReferralTracker />
            <DeferredLiveChat />
            <Suspense fallback={null}><MobileStickyBar /></Suspense>
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
