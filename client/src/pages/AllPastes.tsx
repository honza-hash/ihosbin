import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { formatDate, truncateString } from "@/lib/utils";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Paste = {
  id: number;
  title: string | null;
  content: string;
  language: string;
  shortUrl: string;
  visibility: string;
  created_at: string;
  views: number;
  likes: number;
};

export default function AllPastes() {
  const { data: pastes, isLoading, error } = useQuery({
    queryKey: ["/api/latest", 50], // Fetch 50 latest pastes
    queryFn: async ({ queryKey }) => {
      const limit = queryKey[1];
      const res = await fetch(`/api/latest?limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch pastes");
      return res.json();
    },
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
            All Pastes
          </h1>
          <Link href="/#new-paste">
            <Button className="bg-primary hover:bg-primary/90">
              Create New Paste
            </Button>
          </Link>
        </div>

        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="p-4 border border-slate-700 rounded-lg">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-6 w-1/6" />
                </div>
                <Skeleton className="h-4 w-5/6 mt-3" />
                <Skeleton className="h-4 w-4/6 mt-2" />
                <div className="flex justify-between mt-4">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-5 w-1/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-red-500 p-4 border border-red-300 bg-red-900/10 rounded-lg">
            Failed to load pastes. Please try again later.
          </div>
        )}

        {pastes && pastes.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium">No pastes found</h3>
            <p className="text-slate-400 mt-2">Be the first to create a paste!</p>
            <Link href="/#new-paste">
              <Button className="mt-4 bg-primary hover:bg-primary/90">
                Create New Paste
              </Button>
            </Link>
          </div>
        )}

        {pastes && pastes.length > 0 && (
          <div className="space-y-4">
            {pastes.map((paste: Paste) => (
              <Link key={paste.id} href={`/paste/${paste.shortUrl}`}>
                <div className="p-4 border border-slate-700 rounded-lg hover:border-slate-500 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-medium">
                      {paste.title || "Untitled Paste"}
                    </h2>
                    <span className="text-sm bg-slate-700 px-2 py-1 rounded-full">
                      {paste.language}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mt-2">
                    {truncateString(paste.content, 150)}
                  </p>
                  <div className="flex justify-between items-center mt-4 text-xs text-slate-500">
                    <span>Created {formatDate(paste.created_at)}</span>
                    <div className="flex items-center space-x-3">
                      <span>{paste.views} views</span>
                      <span>{paste.likes} likes</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}