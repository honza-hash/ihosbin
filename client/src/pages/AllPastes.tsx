import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { formatDate, truncateString } from "@/lib/utils";
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
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent">
            All Pastes
          </h1>
          <p className="text-slate-400 mt-2">Browse through all the latest pastes submitted by our community</p>
        </div>
        <Link href="/#new-paste">
          <Button className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-lg shadow-teal-900/20 border-none">
            Create New Paste
          </Button>
        </Link>
      </div>

      {isLoading && (
        <div className="grid gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-5 border border-slate-700 rounded-lg bg-slate-800/30">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                <Skeleton className="h-7 w-2/5" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-4 w-full mt-4" />
              <Skeleton className="h-4 w-5/6 mt-2" />
              <Skeleton className="h-4 w-4/6 mt-2" />
              <div className="flex flex-col md:flex-row justify-between mt-5 gap-3">
                <Skeleton className="h-5 w-32" />
                <div className="flex gap-4">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-red-400 p-6 border border-red-900/50 bg-red-950/20 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Error Loading Pastes
          </h3>
          <p className="mt-2 text-red-300/80">We couldn't load the pastes. Please try again later or refresh the page.</p>
        </div>
      )}

      {pastes && pastes.length === 0 && (
        <div className="text-center py-16 border border-slate-800 rounded-xl bg-slate-900/30">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 mx-auto text-slate-600">
            <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
            <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"></path>
            <line x1="9" y1="9" x2="10" y2="9"></line>
            <line x1="9" y1="13" x2="15" y2="13"></line>
            <line x1="9" y1="17" x2="15" y2="17"></line>
          </svg>
          <h3 className="text-2xl font-bold mt-4 text-slate-300">No pastes found</h3>
          <p className="text-slate-400 mt-2 max-w-md mx-auto">Looks like there aren't any pastes yet. Be the first to create one and start sharing your code!</p>
          <Link href="/#new-paste">
            <Button className="mt-6 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700">
              Create The First Paste
            </Button>
          </Link>
        </div>
      )}

      {pastes && pastes.length > 0 && (
        <div className="grid gap-6">
          {pastes.map((paste: Paste) => (
            <Link key={paste.id} href={`/paste/${paste.shortUrl}`}>
              <div className="p-5 border border-slate-700 rounded-lg bg-gradient-to-b from-slate-800 to-slate-850 hover:shadow-lg hover:shadow-emerald-900/10 hover:border-slate-600 transition-all duration-200 cursor-pointer">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    {paste.title || "Untitled Paste"}
                  </h2>
                  <span className="text-sm bg-slate-700/70 px-3 py-1 rounded-full text-teal-300 font-medium capitalize">
                    {paste.language}
                  </span>
                </div>
                <p className="text-slate-400 mt-3 font-mono text-sm border-l-2 border-teal-800/50 pl-3 py-1">
                  {truncateString(paste.content, 180)}
                </p>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-5 text-xs text-slate-500">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-teal-600/70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 6v6l4 2"></path>
                    </svg>
                    Created {formatDate(paste.created_at)}
                  </span>
                  <div className="flex items-center space-x-4 mt-2 md:mt-0">
                    <span className="flex items-center text-slate-500">
                      <svg className="w-4 h-4 mr-1 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      {paste.views} views
                    </span>
                    <span className="flex items-center text-slate-500">
                      <svg className={`w-4 h-4 mr-1 ${paste.likes > 0 ? 'text-rose-500' : 'text-slate-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={paste.likes > 0 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      {paste.likes} likes
                    </span>
                    <span className="flex items-center text-emerald-400">
                      View Paste <ChevronRight className="h-4 w-4 ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}