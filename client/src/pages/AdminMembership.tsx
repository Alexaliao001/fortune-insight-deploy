import { useState } from "react";
import { Crown, Search, Gift, Ban, RefreshCw, Copy, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import AdminShell from "@/components/AdminShell";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MembershipType = "lifetime" | "yearly" | "monthly";

export default function AdminMembership() {
  const { language } = useLanguage();
  const isZh = language === "zh";

  const [search, setSearch] = useState("");
  const [grantType, setGrantType] = useState<MembershipType>("lifetime");
  const [note, setNote] = useState("friend");
  const [newCode, setNewCode] = useState("");
  const [newMaxUses, setNewMaxUses] = useState("30");

  const { data: users, isLoading, refetch } = trpc.payment.adminListUsers.useQuery(
    { search: search.trim() || undefined, limit: 40 },
    { refetchOnWindowFocus: false }
  );

  const { data: codes, refetch: refetchCodes } = trpc.accessCode.adminList.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const { data: redemptions, refetch: refetchRedemptions } =
    trpc.accessCode.adminRedemptions.useQuery({ limit: 20 });

  const createCode = trpc.accessCode.adminCreate.useMutation({
    onSuccess: (res) => {
      toast.success(isZh ? `已创建兑换码 ${res.code}` : `Created code ${res.code}`);
      setNewCode("");
      refetchCodes();
    },
    onError: (err) => toast.error(err.message),
  });

  const disableCode = trpc.accessCode.adminDisable.useMutation({
    onSuccess: () => {
      toast.success(isZh ? "已停用" : "Disabled");
      refetchCodes();
    },
    onError: (err) => toast.error(err.message),
  });

  const enableCode = trpc.accessCode.adminEnable.useMutation({
    onSuccess: () => {
      toast.success(isZh ? "已启用" : "Enabled");
      refetchCodes();
    },
    onError: (err) => toast.error(err.message),
  });

  const grantMutation = trpc.payment.adminGrantMembership.useMutation({
    onSuccess: (res) => {
      toast.success(
        isZh
          ? `已开通 ${res.name || res.email || res.userId} 的${res.typeLabel}`
          : `Granted ${res.type} to ${res.name || res.email || res.userId}`
      );
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const revokeMutation = trpc.payment.adminRevokeMembership.useMutation({
    onSuccess: () => {
      toast.success(isZh ? "已撤销会员" : "Membership revoked");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const typeLabel = (t: string) => {
    if (t === "lifetime") return isZh ? "终身" : "Lifetime";
    if (t === "yearly") return isZh ? "年度" : "Yearly";
    return isZh ? "月度" : "Monthly";
  };

  const inviteLink = (code: string) =>
    `${typeof window !== "undefined" ? window.location.origin : "https://fortunesite.one"}/membership?code=${code}`;

  const copyText = (text: string, okMsg: string) => {
    navigator.clipboard.writeText(text);
    toast.success(okMsg);
  };

  return (
    <AdminShell
      title={isZh ? "会员与内测码" : "Membership & Codes"}
      subtitle={
        isZh
          ? "试用状态、手动赠送、兑换码管理"
          : "Trials, gift membership, access codes"
      }
    >
      <div className="max-w-3xl space-y-6">
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              refetch();
              refetchCodes();
              refetchRedemptions();
            }}
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* ── Access codes ── */}
        <Card className="border-[#d4a843]/25">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#d4a843]" />
              {isZh ? "内测兑换码" : "Beta access codes"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                placeholder={isZh ? "新码（可空=随机）" : "New code (empty=random)"}
                className="font-mono"
              />
              <Input
                value={newMaxUses}
                onChange={(e) => setNewMaxUses(e.target.value.replace(/\D/g, ""))}
                placeholder="max"
                className="sm:w-24"
              />
              <Button
                disabled={createCode.isPending}
                onClick={() =>
                  createCode.mutate({
                    code: newCode.trim() || undefined,
                    maxUses: Math.max(1, parseInt(newMaxUses || "30", 10) || 30),
                    membershipType: "lifetime",
                    expiresInDays: 90,
                    label: "Friend beta",
                  })
                }
              >
                {isZh ? "创建" : "Create"}
              </Button>
            </div>

            {!codes?.length ? (
              <p className="text-sm text-muted-foreground">
                {isZh ? "暂无兑换码（首次打开会自动生成 FRIEND2026）" : "No codes yet (FRIEND2026 auto-seeds on first use)"}
              </p>
            ) : (
              <div className="space-y-2">
                {codes.map((c) => (
                  <div
                    key={c.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg border border-border/60"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-mono font-bold tracking-wider text-[#d4a843]">
                        {c.code}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {typeLabel(c.membershipType)} · {c.usedCount}/{c.maxUses}{" "}
                        {isZh ? "已用" : "used"}
                        {c.isExpired ? (isZh ? " · 已过期" : " · expired") : ""}
                        {c.status !== "active" ? ` · ${c.status}` : ""}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyText(
                            c.code,
                            isZh ? "已复制兑换码" : "Code copied"
                          )
                        }
                      >
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        {isZh ? "码" : "Code"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyText(
                            inviteLink(c.code),
                            isZh ? "已复制邀请链接" : "Link copied"
                          )
                        }
                      >
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        {isZh ? "链接" : "Link"}
                      </Button>
                      {c.status === "active" ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => disableCode.mutate({ id: c.id })}
                        >
                          {isZh ? "停用" : "Disable"}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => enableCode.mutate({ id: c.id })}
                        >
                          {isZh ? "启用" : "Enable"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!!redemptions?.length && (
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-2">
                  {isZh ? "最近兑换" : "Recent redemptions"}
                </p>
                <div className="space-y-1 max-h-40 overflow-y-auto text-xs">
                  {redemptions.map((r) => (
                    <div key={r.id} className="flex justify-between gap-2 text-muted-foreground">
                      <span className="font-mono">{r.code}</span>
                      <span>user #{r.userId}</span>
                      <span>{new Date(r.createdAt).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {isZh ? "赠送设置" : "Grant settings"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-xs text-muted-foreground">
                {isZh ? "会员类型" : "Type"}
              </label>
              <Select
                value={grantType}
                onValueChange={(v) => setGrantType(v as MembershipType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lifetime">
                    {isZh ? "终身（推荐）" : "Lifetime (recommended)"}
                  </SelectItem>
                  <SelectItem value="yearly">{isZh ? "年度" : "Yearly"}</SelectItem>
                  <SelectItem value="monthly">{isZh ? "月度" : "Monthly"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs text-muted-foreground">
                {isZh ? "备注（可选）" : "Note (optional)"}
              </label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={isZh ? "例如：friend / tester" : "e.g. friend / tester"}
              />
            </div>
          </CardContent>
        </Card>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              isZh
                ? "搜索名字 / 邮箱 / 用户 ID…"
                : "Search name / email / user ID…"
            }
          />
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            {isZh ? "加载中…" : "Loading…"}
          </p>
        ) : !users?.length ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            {isZh
              ? "没有用户。请让朋友先完成登录。"
              : "No users found. Ask friends to log in first."}
          </p>
        ) : (
          <div className="space-y-3">
            {users.map((u) => {
              const isMember = !!u.membership;
              return (
                <Card key={u.id} className="overflow-hidden">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {u.name || (isZh ? "未命名用户" : "Unnamed user")}
                        {u.role === "admin" && (
                          <span className="ml-2 text-xs text-orange-400">admin</span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {u.email || "—"} · ID {u.id}
                      </div>
                      <div className="text-xs mt-1">
                        {isMember ? (
                          <span className="text-[#d4a843]">
                            ✓ {typeLabel(u.membership!.type)}
                            {u.membership!.endDate
                              ? ` · until ${new Date(u.membership!.endDate).toLocaleDateString()}`
                              : isZh
                                ? " · 永久"
                                : " · forever"}
                            {u.membership!.paymentMethod?.startsWith("comp:")
                              ? isZh
                                ? " · 赠送"
                                : " · complimentary"
                              : ""}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            {isZh ? "普通用户（有次数限制）" : "Free tier (limited uses)"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        className="bg-[#d4a843] hover:bg-[#c49a38] text-[#1a1030]"
                        disabled={grantMutation.isPending}
                        onClick={() =>
                          grantMutation.mutate({
                            userId: u.id,
                            type: grantType,
                            note: note || undefined,
                          })
                        }
                      >
                        <Gift className="w-4 h-4 mr-1" />
                        {isZh ? "开通" : "Grant"}
                      </Button>
                      {isMember && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={revokeMutation.isPending}
                          onClick={() => {
                            if (
                              confirm(
                                isZh
                                  ? `确认撤销 ${u.name || u.email || u.id} 的会员？`
                                  : `Revoke membership for ${u.name || u.email || u.id}?`
                              )
                            ) {
                              revokeMutation.mutate({ userId: u.id });
                            }
                          }}
                        >
                          <Ban className="w-4 h-4 mr-1" />
                          {isZh ? "撤销" : "Revoke"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center pt-4">
          {isZh
            ? "说明：开通会员后付费功能无限次。管理员角色只开后台，不自动解锁产品。"
            : "Note: Membership unlocks paid features. Admin role only opens this console."}
        </p>
      </div>
    </AdminShell>
  );
}
