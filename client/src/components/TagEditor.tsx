import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tag, Plus, X, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

// 推荐标签
const suggestedTags = [
  "重要", "有趣", "待分析", "预示", "童年记忆",
  "工作相关", "感情相关", "家人", "旅行", "冒险",
  "神秘", "美好", "警示", "灵感", "重复出现"
];

interface TagEditorProps {
  dreamId: number;
  currentTags: string[];
  onSave: (tags: string[]) => Promise<void>;
  trigger?: React.ReactNode;
}

export default function TagEditor({ dreamId, currentTags, onSave, trigger }: TagEditorProps) {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string[]>(currentTags);
  const [newTag, setNewTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (!trimmedTag) return;
    if (tags.includes(trimmedTag)) {
      toast.error("标签已存在");
      return;
    }
    if (tags.length >= 10) {
      toast.error("最多添加10个标签");
      return;
    }
    setTags([...tags, trimmedTag]);
    setNewTag("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(tags);
      toast.success("标签已保存");
      setOpen(false);
    } catch (error) {
      toast.error("保存失败，请重试");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setTags(currentTags);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="text-violet-400 hover:text-violet-300">
            <Tag className="w-4 h-4 mr-1" />
            标签
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="glass-card border-primary/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-violet-400" />
            编辑梦境标签
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* 当前标签 */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">当前标签</h4>
            <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-lg bg-background/50 border border-border/50">
              {tags.length === 0 ? (
                <span className="text-sm text-muted-foreground">暂无标签，添加一些吧~</span>
              ) : (
                tags.map(tag => (
                  <Badge 
                    key={tag} 
                    className="bg-violet-500/80 hover:bg-violet-500 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))
              )}
            </div>
          </div>

          {/* 添加新标签 */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">添加新标签</h4>
            <div className="flex gap-2">
              <Input
                placeholder="输入标签名称..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag(newTag)}
                className="bg-background/50"
                maxLength={20}
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => addTag(newTag)}
                disabled={!newTag.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 推荐标签 */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">推荐标签</h4>
            <div className="flex flex-wrap gap-2">
              {suggestedTags
                .filter(tag => !tags.includes(tag))
                .slice(0, 10)
                .map(tag => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-violet-500/20 transition-colors"
                    onClick={() => addTag(tag)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>

          {/* 保存按钮 */}
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleSave} 
              className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500"
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              保存标签
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
