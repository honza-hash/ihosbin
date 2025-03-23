import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { Paste } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PasteCard from "./PasteCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface TrendingPastesProps {
  limit?: number;
  showHeader?: boolean;
  showViewAll?: boolean;
}

export default function TrendingPastes({ 
  limit = 4, 
  showHeader = true,
  showViewAll = true 
}: TrendingPastesProps) {
  const [period, setPeriod] = useState("week");
  
  const { data: pastes, isLoading } = useQuery<Paste[]>({
    queryKey: [`/api/trending?limit=${limit}&period=${period}`],
    staleTime: 300000, // 5 minutes
  });
  
  const handlePeriodChange = (value: string) => {
    setPeriod(value);
  };
  
  return (
    <section id="trending" className="py-10 border-t border-slate-800">
      {showHeader && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Trending Pastes</h2>
          <div className="flex space-x-2">
            <Select defaultValue={period} onValueChange={handlePeriodChange}>
              <SelectTrigger className="bg-slate-800 text-slate-300 border-none focus:ring-primary">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="bg-slate-800 rounded-lg overflow-hidden shadow-lg h-64 animate-pulse">
              <div className="h-10 bg-slate-700 mb-2"></div>
              <div className="px-4 h-full">
                <div className="h-full bg-slate-700/50 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {(!pastes || pastes.length === 0) ? (
            <div className="bg-slate-800 rounded-lg p-6 text-center">
              <p className="text-slate-300">No trending pastes found for this period.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastes.map((paste) => (
                <PasteCard key={paste.id} paste={paste} />
              ))}
            </div>
          )}
        </>
      )}
      
      {showViewAll && (
        <div className="mt-6 text-center">
          <Link href="/trending">
            <Button variant="link" className="text-primary hover:text-primary/90 font-medium">
              View All Trending Pastes <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}
