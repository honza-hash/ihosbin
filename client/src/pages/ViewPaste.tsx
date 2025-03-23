import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertTriangle, ChevronLeft, Code, Download, FileText, Heart, MessageSquare, Share2, ThumbsDown } from "lucide-react";
import 'highlight.js/styles/github-dark.css';
import hljs from 'highlight.js';

type Paste = {
  id: number;
  title: string | null;
  content: string;
  language: string;
  visibility: string;
  expiration: string;
  created_at: string;
  views: number;
  likes: number;
};

type Comment = {
  id: number;
  paste_id: number;
  content: string;
  created_at: string;
};

export default function ViewPaste({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [abuseReason, setAbuseReason] = useState("");
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [_, navigate] = useLocation();

  // Fetch paste
  const {
    data: paste,
    isLoading: pasteLoading,
    isError: pasteError,
    error: pasteErrorData
  } = useQuery<Paste>({
    queryKey: [`/api/pastes/${id}`],
    enabled: !isNaN(id),
    refetchOnWindowFocus: false,
  });

  // Fetch comments
  const {
    data: comments,
    isLoading: commentsLoading,
  } = useQuery<Comment[]>({
    queryKey: [`/api/pastes/${id}/comments`],
    enabled: !isNaN(id),
    refetchOnWindowFocus: false,
  });

  // Fetch like status
  const {
    data: likeStatus,
    isLoading: likeStatusLoading,
  } = useQuery<{ liked: boolean }>({
    queryKey: [`/api/pastes/${id}/like`],
    enabled: !isNaN(id),
    refetchOnWindowFocus: false,
  });

  // Handle like/unlike
  const likeMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/pastes/${id}/like`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pastes/${id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/pastes/${id}/like`] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to like/unlike paste",
        variant: "destructive",
      });
    },
  });

  // Handle comment submission
  const commentMutation = useMutation({
    mutationFn: (content: string) => apiRequest("POST", `/api/pastes/${id}/comments`, { content }),
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: [`/api/pastes/${id}/comments`] });
      toast({
        title: "Comment Added",
        description: "Your comment has been posted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post comment",
        variant: "destructive",
      });
    },
  });

  // Handle abuse report
  const reportAbuseMutation = useMutation({
    mutationFn: (reason: string) => apiRequest("POST", `/api/report-abuse`, { paste_id: id, reason }),
    onSuccess: () => {
      setAbuseReason("");
      setReportDialogOpen(false);
      toast({
        title: "Report Submitted",
        description: "Thank you for your report. Our team will review it shortly.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit report",
        variant: "destructive",
      });
    },
  });

  // Apply syntax highlighting
  useEffect(() => {
    if (paste && paste.content) {
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [paste]);

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      commentMutation.mutate(comment);
    }
  };

  const handleReportAbuse = (e: React.FormEvent) => {
    e.preventDefault();
    if (abuseReason.trim()) {
      reportAbuseMutation.mutate(abuseReason);
    }
  };

  const handleDownload = () => {
    if (!paste) return;
    
    const fileName = paste.title 
      ? `${paste.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${paste.language}` 
      : `paste_${id}.${paste.language}`;
    
    const blob = new Blob([paste.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast({
          title: "Link Copied",
          description: "Paste link has been copied to clipboard",
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy link",
          variant: "destructive",
        });
      });
  };

  if (pasteLoading) {
    return (
      <div className="pb-12">
        <Card className="mb-6 animate-pulse">
          <CardContent className="p-6">
            <div className="h-6 w-1/3 bg-muted rounded mb-4"></div>
            <div className="h-4 w-1/4 bg-muted rounded mb-6"></div>
            <div className="h-64 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (pasteError || !paste) {
    return (
      <div className="pb-12">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Paste Not Found</h2>
              <p className="text-muted-foreground mb-6">
                {pasteErrorData instanceof Error 
                  ? pasteErrorData.message 
                  : "The paste you're looking for doesn't exist or has expired."}
              </p>
              <Link href="/create">
                <Button>Create a New Paste</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-2">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </div>

      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 md:p-6 border-b">
            <h1 className="text-xl md:text-2xl font-semibold mb-2">
              {paste.title || 'Untitled Paste'}
            </h1>
            <div className="flex flex-wrap items-center text-sm text-muted-foreground">
              <span className="mr-4 mb-1">
                <Code className="inline h-4 w-4 mr-1" /> {paste.language}
              </span>
              <span className="mr-4 mb-1">
                <time dateTime={paste.created_at} className="inline-flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDate(paste.created_at)}
                </time>
              </span>
              <span className="mr-4 mb-1">
                <svg className="h-4 w-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {paste.views} {paste.views === 1 ? 'view' : 'views'}
              </span>
              <span className="mb-1">
                <Heart className="h-4 w-4 mr-1 inline" />
                {paste.likes} {paste.likes === 1 ? 'like' : 'likes'}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <pre className="p-4 m-0 rounded-none">
              <code className={`language-${paste.language}`}>
                {paste.content}
              </code>
            </pre>
          </div>
        </CardContent>
        <CardFooter className="py-3 px-4 md:px-6 border-t flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-3 mb-2 md:mb-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={likeMutation.isPending}
              className={`${likeStatus?.liked ? 'text-primary' : ''}`}
            >
              <Heart className={`h-4 w-4 mr-1 ${likeStatus?.liked ? 'fill-current' : ''}`} />
              {likeStatus?.liked ? 'Liked' : 'Like'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Comments {comments ? `(${comments.length})` : ''}
            </Button>
          </div>
          <div className="flex items-center space-x-1">
            <a href={`/api/pastes/${id}/raw`} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" title="View Raw">
                <FileText className="h-4 w-4" />
              </Button>
            </a>
            <Button variant="ghost" size="icon" onClick={handleDownload} title="Download">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShareLink} title="Share">
              <Share2 className="h-4 w-4" />
            </Button>
            <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Report Abuse">
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Report Abuse</DialogTitle>
                  <DialogDescription>
                    Please describe why you're reporting this paste. Our team will review it as soon as possible.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleReportAbuse} className="space-y-4 mt-4">
                  <Textarea
                    placeholder="Explain why this paste violates our Terms of Service..."
                    value={abuseReason}
                    onChange={(e) => setAbuseReason(e.target.value)}
                    className="min-h-[100px]"
                    required
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={reportAbuseMutation.isPending || !abuseReason.trim()}>
                      {reportAbuseMutation.isPending ? "Submitting..." : "Submit Report"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      </Card>

      <div id="comments-section" className="pt-4">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        <Card>
          <CardContent className="p-4 md:p-6">
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mb-3"
                required
              />
              <Button 
                type="submit" 
                disabled={commentMutation.isPending || !comment.trim()}
              >
                {commentMutation.isPending ? "Posting..." : "Post Comment"}
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="space-y-6">
              {commentsLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex space-x-4">
                      <div className="h-10 w-10 rounded-full bg-muted"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/4 bg-muted rounded"></div>
                        <div className="h-3 bg-muted rounded"></div>
                        <div className="h-3 w-5/6 bg-muted rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-4">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10">
                        {comment.id.toString().charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline">
                        <p className="text-sm font-medium">Anonymous</p>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
