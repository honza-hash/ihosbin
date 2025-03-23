import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Paste } from "@shared/schema";
import { CodeBlock } from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Heart, Code, Eye, Download, Copy, Share, Flag } from "lucide-react";
import { useClipboard } from "@/hooks/use-paste";
import CommentSection from "./CommentSection";
import ReportDialog from "./ReportDialog";

interface PasteViewProps {
  id: string;
}

export default function PasteView({ id }: PasteViewProps) {
  const { toast } = useToast();
  const { copyToClipboard } = useClipboard();
  const [showReportDialog, setShowReportDialog] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: paste, isLoading, error } = useQuery<Paste>({
    queryKey: [`/api/paste/${id}`],
    staleTime: 60000, // 1 minute
  });
  
  const likeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/paste/${paste?.id}/like`);
    },
    onSuccess: () => {
      // Update the paste data with new like count
      queryClient.invalidateQueries({ queryKey: [`/api/paste/${id}`] });
      toast({
        title: "Thanks for the like!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to like the paste: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  const handleLike = () => {
    if (!likeMutation.isPending) {
      likeMutation.mutate();
    }
  };
  
  const handleCopyContent = () => {
    if (paste) {
      copyToClipboard(paste.content);
      toast({
        title: "Copied to clipboard",
      });
    }
  };
  
  const handleCopyUrl = () => {
    copyToClipboard(window.location.href);
    toast({
      title: "URL copied to clipboard",
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !paste) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold text-red-500">Error loading paste</h2>
        <p className="text-slate-300 mt-2">
          This paste may have expired or doesn't exist.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg overflow-hidden shadow-xl border border-slate-700">
      <div className="p-5 border-b border-slate-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="font-bold text-xl bg-gradient-to-r from-teal-400 to-emerald-500 text-transparent bg-clip-text">
            {paste.title || "Untitled Paste"}
          </h3>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mt-2">
            <span className="flex items-center bg-slate-800/50 px-2 py-1 rounded-full">
              <svg className="w-4 h-4 mr-1 text-teal-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              {formatDistanceToNow(new Date(paste.createdAt), { addSuffix: true })}
            </span>
            <span className="flex items-center bg-slate-800/50 px-2 py-1 rounded-full">
              <Code className="mr-1 h-4 w-4 text-emerald-400" /> 
              <span className="capitalize">{paste.syntax}</span>
            </span>
            <span className="flex items-center bg-slate-800/50 px-2 py-1 rounded-full">
              <Eye className="mr-1 h-4 w-4 text-emerald-400" /> {paste.views}
            </span>
          </div>
        </div>
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLike}
            disabled={likeMutation.isPending}
            className="bg-slate-800 hover:bg-slate-700 hover:text-emerald-400 transition-all duration-200 border-slate-700"
            title="Like this paste"
          >
            <Heart className={`mr-2 h-4 w-4 ${paste.likes > 0 ? 'text-rose-500 fill-rose-500' : ''}`} /> 
            {paste.likes} {paste.likes === 1 ? 'Like' : 'Likes'}
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <CodeBlock code={paste.content} language={paste.syntax} />
      </div>
      
      <div className="p-5 border-t border-slate-700 bg-slate-800/30">
        <div className="flex flex-wrap justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <a 
              href={`/api/paste/${id}/raw`} 
              target="_blank" 
              className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-md transition-colors flex items-center border border-slate-700 hover:border-slate-600 hover:text-emerald-400"
            >
              <Code className="mr-1 h-3 w-3" /> Raw
            </a>
            <a 
              href={`/api/paste/${id}/download`} 
              className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-md transition-colors flex items-center border border-slate-700 hover:border-slate-600 hover:text-emerald-400"
            >
              <Download className="mr-1 h-3 w-3" /> Download
            </a>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCopyContent}
              className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 h-auto rounded-md border-slate-700 hover:border-slate-600 hover:text-emerald-400"
            >
              <Copy className="mr-1 h-3 w-3" /> Copy
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCopyUrl}
              className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 h-auto rounded-md border-slate-700 hover:border-slate-600 hover:text-emerald-400"
            >
              <Share className="mr-1 h-3 w-3" /> Share
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowReportDialog(true)}
            className="text-xs text-slate-400 hover:text-red-400 h-auto px-3 py-2"
          >
            <Flag className="mr-1 h-3 w-3" /> Report Abuse
          </Button>
        </div>
      </div>
      
      <CommentSection pasteId={paste.id} commentsCount={paste.commentsCount} />
      
      <ReportDialog 
        isOpen={showReportDialog} 
        onClose={() => setShowReportDialog(false)} 
        pasteId={paste.id} 
      />
    </div>
  );
}
