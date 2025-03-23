import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Paste } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PasteCard from "@/components/feature/PasteCard";

export default function Trending() {
  const [period, setPeriod] = useState("week");
  const [limit, setLimit] = useState(20);
  
  const { data: pastes, isLoading } = useQuery<Paste[]>({
    queryKey: [`/api/trending?limit=${limit}&period=${period}`],
    staleTime: 300000, // 5 minutes
  });
  
  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Trending Pastes</h1>
        <div className="flex space-x-2">
          <Select defaultValue={period} onValueChange={setPeriod}>
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
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
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
    </div>
  );
}
