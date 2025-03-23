import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle, ExpandIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LANGUAGES, EXPIRATION_OPTIONS, VISIBILITY_OPTIONS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function CreatePaste() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("text");
  const [expiration, setExpiration] = useState("never");
  const [visibility, setVisibility] = useState("public");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [_, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Paste content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (!termsAgreed) {
      toast({
        title: "Terms Agreement Required",
        description: "You must agree to the Terms of Service to create a paste",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await apiRequest("POST", "/api/pastes", {
        title: title.trim() || null,
        content,
        language,
        expiration,
        visibility,
      });

      const data = await res.json();
      
      // Redirect to the newly created paste
      navigate(`/paste/${data.id}`);
      
      toast({
        title: "Success",
        description: "Your paste has been created",
      });
    } catch (error) {
      console.error("Error creating paste:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create paste",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-12">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6">Create New Paste</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="title">Title (optional)</Label>
                <span className="text-xs text-muted-foreground">Untitled if left blank</span>
              </div>
              <Input
                id="title"
                name="title"
                placeholder="Paste title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="language">Syntax</Label>
              </div>
              <Select
                value={language}
                onValueChange={(value) => setLanguage(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="content">Paste Content</Label>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      <ExpandIcon className="h-3 w-3 mr-1" /> Expand
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[90vw] h-[80vh] flex flex-col">
                    <div className="flex-1 min-h-0">
                      <Textarea
                        className="font-mono h-full resize-none"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Type or paste your code here in fullscreen mode..."
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Textarea
                id="content"
                name="content"
                rows={12}
                placeholder="Type or paste your code here..."
                className="font-mono"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="mb-2 block">Expiration</Label>
                <Select
                  value={expiration}
                  onValueChange={(value) => setExpiration(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select expiration" />
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
              
              <div>
                <Label className="mb-2 block">Visibility</Label>
                <Select
                  value={visibility}
                  onValueChange={(value) => setVisibility(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    {VISIBILITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-start">
              <Checkbox
                id="terms"
                checked={termsAgreed}
                onCheckedChange={(checked) => setTermsAgreed(checked as boolean)}
                className="mt-1"
              />
              <div className="ml-2">
                <Label
                  htmlFor="terms"
                  className="font-normal text-sm text-muted-foreground"
                >
                  I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and understand that malicious content is not allowed
                </Label>
              </div>
            </div>
            
            {!termsAgreed && (
              <div className="flex p-3 text-sm rounded-md bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <div>
                  You must agree to the Terms of Service before creating a paste
                </div>
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !content.trim() || !termsAgreed}
            >
              {isSubmitting ? "Creating..." : "Create Paste"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
