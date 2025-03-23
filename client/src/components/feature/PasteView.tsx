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
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div>
          <h3 className="font-medium text-lg">{paste.title || "Untitled Paste"}</h3>
          <div className="flex items-center space-x-3 text-sm text-slate-400">
            <span>
              {formatDistanceToNow(new Date(paste.createdAt), { addSuffix: true })}
            </span>
            <span className="flex items-center">
              <Code className="mr-1 h-4 w-4" /> {paste.syntax}
            </span>
            <span className="flex items-center">
              <Eye className="mr-1 h-4 w-4" /> {paste.views}
            </span>
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
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <CodeBlock code={paste.content} language={paste.syntax} />
      </div>
      
      <div className="p-4 border-t border-slate-700">
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <a href={`/api/paste/${id}/raw`} target="_blank" className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded transition-colors flex items-center">
              Raw
            </a>
            <a href={`/api/paste/${id}/download`} className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded transition-colors flex items-center">
              <Download className="mr-1 h-3 w-3" /> Download
            </a>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleCopyContent}
              className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 h-auto rounded"
            >
              <Copy className="mr-1 h-3 w-3" /> Copy
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleCopyUrl}
              className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 h-auto rounded"
            >
              <Share className="mr-1 h-3 w-3" /> Share
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowReportDialog(true)}
            className="text-xs text-slate-400 hover:text-red-400 h-auto"
          >
            <Flag className="mr-1 h-3 w-3" /> Report
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
