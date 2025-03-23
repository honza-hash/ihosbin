import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Expand, ListOrdered } from "lucide-react";
import type { InsertPaste } from "@shared/schema";
import { AVAILABLE_LANGUAGES, EXPIRATION_OPTIONS } from "@/lib/constants";

export default function PasteEditor() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [syntax, setSyntax] = useState("plaintext");
  const [expiration, setExpiration] = useState("never");
  const [isPrivate, setIsPrivate] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const createPasteMutation = useMutation({
    mutationFn: async (pasteData: InsertPaste) => {
      const response = await apiRequest("POST", "/api/paste", pasteData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Paste created successfully!",
        description: "Redirecting to your new paste...",
      });
      setLocation(`/paste/${data.shortUrl}`);
    },
    onError: (error) => {
      toast({
        title: "Error creating paste",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update line numbers when content changes
  useEffect(() => {
    if (showLineNumbers && lineNumbersRef.current) {
      const lineCount = content.split("\n").length;
      lineNumbersRef.current.innerHTML = Array.from(
        { length: lineCount },
        (_, i) => `<div>${i + 1}</div>`
      ).join("");
    }
  }, [content, showLineNumbers]);
  
  // Handle fullscreen mode
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isFullscreen]);
  
  const toggleLineNumbers = () => {
    setShowLineNumbers(!showLineNumbers);
    if (textareaRef.current) {
      textareaRef.current.style.paddingLeft = !showLineNumbers ? "2.5rem" : "1rem";
    }
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Paste content cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    createPasteMutation.mutate({
      title: title || undefined,
      content,
      syntax,
      expiration,
      isPrivate,
    });
  };
  
  return (
    <section id="new-paste" className={`py-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900 p-4' : ''}`}>
      <div className={`${!isFullscreen && 'py-4'}`}>
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent">
          Create New Paste
        </h2>
        <div className="bg-gradient-to-b from-slate-800 to-slate-850 rounded-lg overflow-hidden shadow-xl border border-slate-700">
          <div className="p-4 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3 items-center">
              <Select defaultValue={syntax} onValueChange={setSyntax}>
                <SelectTrigger className="min-w-[180px] bg-slate-800 text-slate-200 border-slate-600 hover:border-teal-500 focus:ring-teal-500 focus:border-teal-500 transition-colors">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {AVAILABLE_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value} className="focus:bg-slate-700 focus:text-white">
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select defaultValue={expiration} onValueChange={setExpiration}>
                <SelectTrigger className="min-w-[150px] bg-slate-800 text-slate-200 border-slate-600 hover:border-teal-500 focus:ring-teal-500 focus:border-teal-500 transition-colors">
                  <SelectValue placeholder="Expiration" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {EXPIRATION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="focus:bg-slate-700 focus:text-white">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2 bg-slate-800 px-3 py-2 rounded-md border border-slate-600">
                <Checkbox
                  id="is-private"
                  checked={isPrivate}
                  onCheckedChange={(checked) => setIsPrivate(!!checked)}
                  className="text-teal-500 border-slate-500 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                />
                <Label htmlFor="is-private" className="text-sm text-slate-300 cursor-pointer">Private</Label>
              </div>
            </div>
            
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="icon"
                title="Toggle line numbers"
                onClick={toggleLineNumbers}
                className={`border-slate-600 ${showLineNumbers ? 'bg-slate-700 text-teal-400 border-teal-500/50' : 'bg-slate-800 text-slate-400 hover:text-teal-400'}`}
              >
                <ListOrdered className="h-5 w-5" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                title="Fullscreen"
                onClick={toggleFullscreen}
                className={`border-slate-600 ${isFullscreen ? 'bg-slate-700 text-teal-400 border-teal-500/50' : 'bg-slate-800 text-slate-400 hover:text-teal-400'}`}
              >
                <Expand className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="relative" ref={editorRef}>
            {showLineNumbers && (
              <div 
                ref={lineNumbersRef}
                className="absolute top-0 left-0 pt-4 pl-2 pr-2 h-full bg-slate-900/50 text-slate-500 font-mono text-sm select-none border-r border-slate-700/50"
              ></div>
            )}
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-96 bg-slate-900 text-slate-100 p-4 font-mono text-sm resize-none focus:outline-none focus:ring-0 border-none focus:border-none"
              placeholder="Paste your code or text here..."
              style={{ paddingLeft: showLineNumbers ? "2.5rem" : "1rem" }}
            />
          </div>
          
          <div className="p-5 border-t border-slate-700 bg-slate-800/30">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="w-full sm:w-auto">
                <Input
                  type="text"
                  placeholder="Optional title for your paste"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-slate-800 text-slate-200 border-slate-600 focus:ring-teal-500 focus:border-teal-500 w-full sm:min-w-[300px]"
                />
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={createPasteMutation.isPending}
                className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-lg shadow-teal-900/20 border-none font-semibold transition-all duration-200 w-full sm:w-auto"
              >
                {createPasteMutation.isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Paste"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
