import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SORT_OPTIONS, formatDate } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { Code, Heart, Eye, FileText, Download, Share2, ThumbsDown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Trending() {
  const [sortBy, setSortBy] = useState<string>("popular");
  const { toast } = useToast();

  const { 
    data: pastes, 
    isLoading, 
    isError,
    refetch 
  } = useQuery({
    queryKey: [`/api/pastes/trending/${sortBy}`],
    refetchOnWindowFocus: false,
  });

  const handleSortChange = (value: string) => {
    setSortBy(value);
    // Query key will change causing a refetch
  };

  const handleShareLink = (id: number) => {
    const url = `${window.location.origin}/paste/${id}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast({
          title: "Link Copied",
          description: "Paste link has been copied to clipboard"
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy link",
          variant: "destructive"
        });
      });
  };

  return (
    <div className="pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Trending Pastes</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select sort option" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <Skeleton className="h-5 w-1/3 mb-2" />
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="p-4">
                  <Skeleton className="h-[120px] w-full" />
                </div>
                <div className="p-4 border-t">
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive mb-4">Failed to load trending pastes</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </CardContent>
        </Card>
      ) : pastes && pastes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pastes.map((paste: any) => (
            <Card key={paste.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4 border-b">
                  <div>
                    <h3 className="font-medium">
                      <Link href={`/paste/${paste.id}`} className="hover:text-primary">
                        {paste.title || 'Untitled Paste'}
                      </Link>
                    </h3>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      <span className="mr-3"><Code className="inline h-3 w-3 mr-1" /> {paste.language}</span>
                      <span><time dateTime={paste.created_at}>{formatDate(paste.created_at)}</time></span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <span className="px-2 py-1 text-xs font-medium rounded bg-primary/10 text-primary">
                      <Heart className="inline h-3 w-3 mr-1" /> {paste.likes}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-muted text-muted-foreground">
                      <Eye className="inline h-3 w-3 mr-1" /> {paste.views}
                    </span>
                  </div>
                </div>
                <div className="p-4 overflow-x-auto bg-muted/10">
                  <pre className="text-sm font-mono rounded">
                    <code>
                      {paste.content.length > 200 
                        ? paste.content.substring(0, 200) + '...'
                        : paste.content}
                    </code>
                  </pre>
                </div>
                <div className="px-4 py-3 border-t flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Link href={`/paste/${paste.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </Link>
                  </div>
                  <div className="flex items-center space-x-1">
                    <a href={`/api/pastes/${paste.id}/raw`} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="View Raw">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </a>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleShareLink(paste.id); }}>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Share">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No pastes found</p>
            <Link href="/create">
              <Button>Create a Paste</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
