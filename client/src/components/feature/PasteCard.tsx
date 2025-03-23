import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";
import { Paste } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { Heart, MessageSquare, Code, Eye, Download, Copy, Flag } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useClipboard } from "@/hooks/use-paste";
import { useState } from "react";
import ReportDialog from "./ReportDialog";

interface PasteCardProps {
  paste: Paste;
}

export default function PasteCard({ paste }: PasteCardProps) {
  const { toast } = useToast();
  const { copyToClipboard } = useClipboard();
  const queryClient = useQueryClient();
  const [showReportDialog, setShowReportDialog] = useState(false);
  
  const likeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/paste/${paste.id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/latest"] });
      toast({
        title: "Thanks for the like!",
      });
    },
  });
  
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!likeMutation.isPending) {
      likeMutation.mutate();
    }
  };
  
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    copyToClipboard(paste.content);
    toast({
      title: "Copied to clipboard",
    });
  };
  
  const handleReport = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowReportDialog(true);
  };
  
  return (
    <>
      <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-lg">{paste.title || "Untitled"}</h3>
            <div className="flex items-center space-x-3 text-sm text-slate-400">
              <span>{formatDistanceToNow(new Date(paste.createdAt), { addSuffix: true })}</span>
              <span className="flex items-center"><Code className="mr-1 h-4 w-4" /> {paste.syntax}</span>
              <span className="flex items-center"><Eye className="mr-1 h-4 w-4" /> {paste.views}</span>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={likeMutation.isPending}
              className="text-slate-400 hover:text-white"
              title="Like"
            >
              <Heart className="mr-1 h-4 w-4" /> {paste.likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
              title="Comments"
              asChild
            >
              <Link href={`/paste/${paste.shortUrl}#comments`}>
                <MessageSquare className="mr-1 h-4 w-4" /> {paste.commentsCount}
              </Link>
            </Button>
          </div>
        </div>
        
        <Link href={`/paste/${paste.shortUrl}`}>
          <div className="relative overflow-hidden max-h-[220px]">
            <CodeBlock code={paste.content} language={paste.syntax} preview />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-800 to-transparent"></div>
          </div>
        </Link>
        
        <div className="p-3 border-t border-slate-700 flex justify-between">
          <div className="flex space-x-2">
            <a href={`/api/paste/${paste.shortUrl}/raw`} target="_blank" className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded transition-colors">
              Raw
            </a>
            <a href={`/api/paste/${paste.shortUrl}/download`} className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded transition-colors flex items-center">
              <Download className="mr-1 h-3 w-3" /> Download
            </a>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleCopy}
              className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 h-auto rounded"
            >
              <Copy className="mr-1 h-3 w-3" /> Copy
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleReport}
            className="text-xs text-slate-400 hover:text-red-400 h-auto"
          >
            <Flag className="mr-1 h-3 w-3" /> Report
          </Button>
        </div>
      </div>
      
      <ReportDialog 
        isOpen={showReportDialog} 
        onClose={() => setShowReportDialog(false)} 
        pasteId={paste.id} 
      />
    </>
  );
}
