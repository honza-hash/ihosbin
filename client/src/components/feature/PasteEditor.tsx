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
        <h2 className="text-2xl font-bold mb-6">Create New Paste</h2>
        <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <div className="flex space-x-2 items-center">
              <Select defaultValue={syntax} onValueChange={setSyntax}>
                <SelectTrigger className="bg-slate-700 text-slate-300 border-none focus:ring-primary focus:ring-1">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select defaultValue={expiration} onValueChange={setExpiration}>
                <SelectTrigger className="bg-slate-700 text-slate-300 border-none focus:ring-primary focus:ring-1">
                  <SelectValue placeholder="Expiration" />
                </SelectTrigger>
                <SelectContent>
                  {EXPIRATION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-2 items-center">
              <Button
                variant="ghost"
                size="icon"
                title="Toggle line numbers"
                onClick={toggleLineNumbers}
                className="text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <ListOrdered className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                title="Fullscreen"
                onClick={toggleFullscreen}
                className="text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <Expand className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="relative" ref={editorRef}>
            {showLineNumbers && (
              <div 
                ref={lineNumbersRef}
                className="absolute top-0 left-0 pt-4 pl-2 pr-2 h-full bg-slate-800 text-slate-500 font-mono text-sm select-none"
              ></div>
            )}
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-96 bg-slate-900 text-slate-100 p-4 font-mono text-sm resize-none focus:outline-none focus:ring-0 border-none"
              placeholder="Paste your code or text here..."
              style={{ paddingLeft: showLineNumbers ? "2.5rem" : "1rem" }}
            />
          </div>
          
          <div className="p-4 border-t border-slate-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex space-x-4 items-center">
                <Input
                  type="text"
                  placeholder="Optional title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-slate-700 text-slate-300 border-none focus:ring-primary focus:ring-1 focus:outline-none w-full sm:w-auto"
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is-private"
                    checked={isPrivate}
                    onCheckedChange={(checked) => setIsPrivate(!!checked)}
                    className="rounded-sm bg-slate-700 border-slate-600 text-primary"
                  />
                  <Label htmlFor="is-private" className="text-sm text-slate-300">Private</Label>
                </div>
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={createPasteMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-white font-bold w-full sm:w-auto"
              >
                {createPasteMutation.isPending ? "Creating..." : "Create Paste"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
