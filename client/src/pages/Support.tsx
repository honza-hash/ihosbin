import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { HelpCircle, Mail, MessageSquare, AlertTriangle } from "lucide-react";

export default function Support() {
  const [activeTab, setActiveTab] = useState("support");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [abuseReason, setAbuseReason] = useState("");
  const [pasteId, setPasteId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/support", {
        email: email.trim() || null,
        subject: subject.trim(),
        message: message.trim(),
      });
      
      // Reset form
      setEmail("");
      setSubject("");
      setMessage("");
      
      toast({
        title: "Support Ticket Submitted",
        description: "Thank you for contacting us. We will respond as soon as possible.",
      });
    } catch (error) {
      console.error("Error submitting support ticket:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit support ticket",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAbuseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasteId.trim() || !abuseReason.trim()) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate paste ID is a number
    const id = parseInt(pasteId);
    if (isNaN(id)) {
      toast({
        title: "Invalid Paste ID",
        description: "Please enter a valid numeric paste ID",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/report-abuse", {
        paste_id: id,
        reason: abuseReason.trim(),
      });
      
      // Reset form
      setPasteId("");
      setAbuseReason("");
      
      toast({
        title: "Abuse Report Submitted",
        description: "Thank you for your report. Our team will review it shortly.",
      });
    } catch (error) {
      console.error("Error submitting abuse report:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit abuse report",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-12">
      <h1 className="text-2xl font-bold mb-6">Support Center</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="support">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Support
          </TabsTrigger>
          <TabsTrigger value="abuse" id="report-abuse">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Report Abuse
          </TabsTrigger>
          <TabsTrigger value="faq">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="support" className="mt-0">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave blank if you prefer to remain anonymous, but we won't be able to respond directly.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject <span className="text-destructive">*</span></Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="message"
                    placeholder="Please describe your issue in detail"
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Submitting..." : "Submit Support Request"}
                </Button>
                
                <p className="text-center text-sm text-muted-foreground mt-4">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Our team typically responds within 24-48 hours.
                </p>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="abuse" className="mt-0">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleAbuseSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paste-id">Paste ID <span className="text-destructive">*</span></Label>
                  <Input
                    id="paste-id"
                    placeholder="Enter the numeric ID of the paste (e.g., 123)"
                    value={pasteId}
                    onChange={(e) => setPasteId(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    The paste ID is the number in the URL when viewing a paste (e.g., /paste/123).
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="abuse-reason">Reason for Report <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="abuse-reason"
                    placeholder="Please explain why this paste violates our Terms of Service"
                    rows={6}
                    value={abuseReason}
                    onChange={(e) => setAbuseReason(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Submitting..." : "Submit Abuse Report"}
                </Button>
                
                <p className="text-center text-sm text-muted-foreground mt-4">
                  <AlertTriangle className="inline h-4 w-4 mr-1" />
                  We take all abuse reports seriously and will review the content promptly.
                </p>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="faq" className="mt-0">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What is ihosbin.fun?</h3>
                <p className="text-muted-foreground">
                  ihosbin.fun is a modern, anonymous pastebin alternative that allows you to share code snippets and text with syntax highlighting for various programming languages.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Do I need an account to use ihosbin.fun?</h3>
                <p className="text-muted-foreground">
                  No. ihosbin.fun is completely anonymous and does not require any registration or account creation.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">How long are pastes stored?</h3>
                <p className="text-muted-foreground">
                  You can choose the expiration time when creating a paste. Options range from 10 minutes to permanent storage, depending on your needs.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">What content is not allowed?</h3>
                <p className="text-muted-foreground">
                  We do not allow any illegal content, malware, personal information, spam, or content that violates our Terms of Service. Please see our Terms page for a complete list of prohibited content.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">How do I report abusive content?</h3>
                <p className="text-muted-foreground">
                  You can report abusive content using the "Report Abuse" tab on this page or by clicking the report button when viewing a paste.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">How does the API work?</h3>
                <p className="text-muted-foreground">
                  ihosbin.fun provides a simple REST API that allows you to programmatically create and retrieve pastes. Visit our API documentation page for more details and examples.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
