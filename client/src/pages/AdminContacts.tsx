import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Mail, 
  MessageSquare, 
  Clock, 
  User,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  XCircle,
  MessageCircleReply,
  Eye,
  Calendar,
  Tag
} from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

const statusConfig = {
  pending: { label: "待处理", color: "bg-yellow-500/20 text-yellow-500", icon: AlertCircle },
  replied: { label: "已回复", color: "bg-blue-500/20 text-blue-500", icon: MessageCircleReply },
  resolved: { label: "已解决", color: "bg-green-500/20 text-green-500", icon: CheckCircle },
  closed: { label: "已关闭", color: "bg-gray-500/20 text-gray-500", icon: XCircle },
};

const categoryConfig: Record<string, { label: string; color: string }> = {
  general: { label: "一般咨询", color: "bg-slate-500/20 text-slate-400" },
  technical: { label: "技术支持", color: "bg-purple-500/20 text-purple-400" },
  billing: { label: "账单问题", color: "bg-orange-500/20 text-orange-400" },
  partnership: { label: "商务合作", color: "bg-cyan-500/20 text-cyan-400" },
  feedback: { label: "意见反馈", color: "bg-pink-500/20 text-pink-400" },
  other: { label: "其他", color: "bg-gray-500/20 text-gray-400" },
};

export default function AdminContacts() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState<string>("");

  const { data: submissions, isLoading, refetch } = trpc.contact.getAll.useQuery();

  const updateStatusMutation = trpc.contact.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("状态更新成功");
      refetch();
      setSelectedSubmission(null);
    },
    onError: (error) => {
      toast.error("更新失败", { description: error.message });
    },
  });

  // 权限检查
  if (user?.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">无权限访问</h2>
              <p className="text-muted-foreground">此页面仅限管理员访问</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // 过滤数据
  const filteredSubmissions = submissions?.filter((sub) => {
    const matchesSearch = 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || sub.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  }) || [];

  // 统计数据
  const stats = {
    total: submissions?.length || 0,
    pending: submissions?.filter(s => s.status === "pending").length || 0,
    replied: submissions?.filter(s => s.status === "replied").length || 0,
    resolved: submissions?.filter(s => s.status === "resolved").length || 0,
  };

  const handleUpdateStatus = () => {
    if (!selectedSubmission || !newStatus) return;
    updateStatusMutation.mutate({
      id: selectedSubmission.id,
      status: newStatus as "pending" | "replied" | "resolved" | "closed",
      adminNotes: adminNotes || undefined,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">联系表单管理</h1>
          <p className="text-muted-foreground">查看和管理用户提交的联系表单</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">总工单</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">待处理</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <MessageCircleReply className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.replied}</p>
                  <p className="text-xs text-muted-foreground">已回复</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.resolved}</p>
                  <p className="text-xs text-muted-foreground">已解决</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索姓名、邮箱或主题..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="状态筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待处理</SelectItem>
                  <SelectItem value="replied">已回复</SelectItem>
                  <SelectItem value="resolved">已解决</SelectItem>
                  <SelectItem value="closed">已关闭</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="类型筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  {Object.entries(categoryConfig).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submissions List */}
        <Card>
          <CardHeader>
            <CardTitle>工单列表</CardTitle>
            <CardDescription>共 {filteredSubmissions.length} 条记录</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">加载中...</div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">暂无数据</div>
            ) : (
              <div className="space-y-3">
                {filteredSubmissions.map((submission) => {
                  const StatusIcon = statusConfig[submission.status as keyof typeof statusConfig]?.icon || AlertCircle;
                  return (
                    <div
                      key={submission.id}
                      className="p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{submission.subject}</h4>
                            <Badge className={categoryConfig[submission.category]?.color || ""}>
                              {categoryConfig[submission.category]?.label || submission.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {submission.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {submission.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(submission.createdAt), "MM-dd HH:mm", { locale: zhCN })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={statusConfig[submission.status as keyof typeof statusConfig]?.color || ""}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[submission.status as keyof typeof statusConfig]?.label || submission.status}
                          </Badge>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedSubmission(submission);
                                  setNewStatus(submission.status);
                                  setAdminNotes(submission.adminNotes || "");
                                }}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                查看
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>工单详情</DialogTitle>
                                <DialogDescription>
                                  #{submission.id} - {submission.subject}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">提交人</p>
                                    <p className="font-medium">{submission.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">邮箱</p>
                                    <p className="font-medium">{submission.email}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">类型</p>
                                    <Badge className={categoryConfig[submission.category]?.color || ""}>
                                      {categoryConfig[submission.category]?.label || submission.category}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">提交时间</p>
                                    <p className="font-medium">
                                      {format(new Date(submission.createdAt), "yyyy-MM-dd HH:mm:ss", { locale: zhCN })}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">消息内容</p>
                                  <div className="p-3 rounded-lg bg-muted/50 whitespace-pre-wrap">
                                    {submission.message}
                                  </div>
                                </div>
                                <div className="border-t pt-4">
                                  <p className="text-sm text-muted-foreground mb-2">更新状态</p>
                                  <Select value={newStatus} onValueChange={setNewStatus}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">待处理</SelectItem>
                                      <SelectItem value="replied">已回复</SelectItem>
                                      <SelectItem value="resolved">已解决</SelectItem>
                                      <SelectItem value="closed">已关闭</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-2">管理员备注</p>
                                  <Textarea
                                    placeholder="添加内部备注..."
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    rows={3}
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      window.open(`mailto:${submission.email}?subject=Re: ${submission.subject}`, "_blank");
                                    }}
                                  >
                                    <Mail className="w-4 h-4 mr-1" />
                                    发送邮件
                                  </Button>
                                  <Button
                                    onClick={handleUpdateStatus}
                                    disabled={updateStatusMutation.isPending}
                                  >
                                    {updateStatusMutation.isPending ? "保存中..." : "保存更改"}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
