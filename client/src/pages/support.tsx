import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ReportDialog from "@/components/feature/ReportDialog";

export default function Support() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportPasteId, setReportPasteId] = useState<number | null>(null);
  
  const { toast } = useToast();
  
  const supportMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/support", { email, subject, message });
    },
    onSuccess: () => {
      toast({
        title: "Support ticket submitted",
        description: "We'll get back to you soon!",
      });
      // Reset form
      setEmail("");
      setSubject("");
      setMessage("");
    },
    onError: (error) => {
      toast({
        title: "Error submitting ticket",
        description: `${error}`,
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim()) {
      toast({
        title: "Subject is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!message.trim()) {
      toast({
        title: "Message is required",
        variant: "destructive",
      });
      return;
    }
    
    supportMutation.mutate();
  };
  
  const handleOpenReportDialog = () => {
    // For demonstration purposes, we'll use a dummy paste ID
    // In a real implementation, you would show a form to enter or select a paste ID
    setReportPasteId(1);
    setShowReportDialog(true);
  };
  
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Support</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription className="text-slate-400">
              Have a question or suggestion? Send us a message.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-slate-200"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="What's this about?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-slate-200"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-slate-200 min-h-[120px]"
                  required
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSubmit}
              disabled={supportMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-white w-full"
            >
              {supportMutation.isPending ? "Sending..." : "Send Message"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700" id="report">
          <CardHeader>
            <CardTitle>Report Abuse</CardTitle>
            <CardDescription className="text-slate-400">
              Found something that violates our terms? Report it here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">
              If you come across content that violates our Terms of Service, such as:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              <li>Malware or harmful code</li>
              <li>Personal information</li>
              <li>Copyright violations</li>
              <li>Illegal content</li>
              <li>Spam or advertising</li>
            </ul>
            <p className="text-slate-300">
              Please report it immediately. We take all reports seriously and will review them promptly.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleOpenReportDialog}
              className="bg-red-600 hover:bg-red-700 text-white w-full"
            >
              Report Content
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Is ihosbin.fun truly anonymous?</h3>
            <p className="text-slate-300 mt-1">
              Yes, we don't require any registration or personal information to create or view pastes.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg">How long are pastes stored?</h3>
            <p className="text-slate-300 mt-1">
              Pastes are stored according to the expiration time you select when creating them. Options range from 10 minutes to never expiring.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg">Can I delete my paste?</h3>
            <p className="text-slate-300 mt-1">
              Currently, pastes can only be automatically deleted based on expiration. Contact support if you need a paste removed urgently.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg">What content is not allowed?</h3>
            <p className="text-slate-300 mt-1">
              We prohibit malware, personal information, illegal content, and spam. See our Terms of Service for details.
            </p>
          </div>
        </div>
      </div>
      
      {showReportDialog && reportPasteId && (
        <ReportDialog
          isOpen={showReportDialog}
          onClose={() => setShowReportDialog(false)}
          pasteId={reportPasteId}
        />
      )}
    </div>
  );
}
