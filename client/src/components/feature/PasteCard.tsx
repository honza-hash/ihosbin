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
      <div className="bg-gradient-to-b from-slate-800 to-slate-850 rounded-lg overflow-hidden shadow-xl hover:shadow-emerald-900/20 transition-all border border-slate-700 hover:border-slate-600">
        <div className="p-4 border-b border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-lg bg-gradient-to-r from-teal-400 to-emerald-500 text-transparent bg-clip-text">
              {paste.title || "Untitled"}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mt-2">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-teal-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
                {formatDistanceToNow(new Date(paste.createdAt), { addSuffix: true })}
              </span>
              <span className="flex items-center">
                <Code className="mr-1 h-4 w-4 text-emerald-400" /> 
                <span className="capitalize">{paste.syntax}</span>
              </span>
              <span className="flex items-center">
                <Eye className="mr-1 h-4 w-4 text-emerald-400" /> {paste.views}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLike}
              disabled={likeMutation.isPending}
              className="bg-slate-800/50 border-slate-700 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
              title="Like"
            >
              <Heart className={`mr-1 h-4 w-4 ${paste.likes > 0 ? 'text-rose-500 fill-rose-500' : ''}`} /> 
              {paste.likes}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-800/50 border-slate-700 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
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
          <div className="relative overflow-hidden max-h-[220px] group">
            <CodeBlock code={paste.content} language={paste.syntax} preview />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 to-transparent"></div>
            <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors duration-300"></div>
          </div>
        </Link>
        
        <div className="p-3 border-t border-slate-700 bg-slate-800/30 flex flex-wrap justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <a 
              href={`/api/paste/${paste.shortUrl}/raw`} 
              target="_blank" 
              onClick={(e) => e.stopPropagation()}
              className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-md transition-colors flex items-center border border-slate-700 hover:border-slate-600 hover:text-emerald-400"
            >
              <Code className="mr-1 h-3 w-3" /> Raw
            </a>
            <a 
              href={`/api/paste/${paste.shortUrl}/download`} 
              onClick={(e) => e.stopPropagation()}
              className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-md transition-colors flex items-center border border-slate-700 hover:border-slate-600 hover:text-emerald-400"
            >
              <Download className="mr-1 h-3 w-3" /> Download
            </a>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCopy}
              className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 h-auto rounded-md border-slate-700 hover:border-slate-600 hover:text-emerald-400"
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
