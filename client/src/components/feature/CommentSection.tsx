import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Comment } from "@shared/schema";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

interface CommentSectionProps {
  pasteId: number;
  commentsCount: number;
}

export default function CommentSection({ pasteId, commentsCount }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: [`/api/paste/${pasteId}/comments`],
    staleTime: 30000, // 30 seconds
  });
  
  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest("POST", `/api/paste/${pasteId}/comments`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/paste/${pasteId}/comments`] });
      queryClient.invalidateQueries({ queryKey: [`/api/paste/${pasteId}`] });
      setNewComment("");
      toast({
        title: "Comment added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding comment",
        description: `${error}`,
        variant: "destructive",
      });
    },
  });
  
  const handleSubmitComment = () => {
    if (!newComment.trim()) {
      toast({
        title: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    addCommentMutation.mutate(newComment);
  };
  
  return (
    <div className="mt-4 border-t border-slate-700 pt-4 px-4 pb-4" id="comments">
      <h4 className="font-medium mb-2">Comments ({commentsCount})</h4>
      
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="bg-slate-700 p-3 rounded animate-pulse">
              <div className="flex justify-between items-center mb-1">
                <div className="h-4 bg-slate-600 rounded w-20"></div>
                <div className="h-3 bg-slate-600 rounded w-16"></div>
              </div>
              <div className="h-10 bg-slate-600 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {(!comments || comments.length === 0) ? (
            <p className="text-slate-400 text-sm">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-slate-700 p-3 rounded">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Anonymous</span>
                  <span className="text-xs text-slate-400">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      )}
      
      <div className="mt-4">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full bg-slate-700 text-slate-300 p-3 rounded resize-none focus:ring-primary focus:outline-none h-20"
        />
        <div className="mt-2 flex justify-end">
          <Button
            onClick={handleSubmitComment}
            disabled={addCommentMutation.isPending}
            className="bg-primary hover:bg-primary/90 text-white font-medium"
          >
            {addCommentMutation.isPending ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
