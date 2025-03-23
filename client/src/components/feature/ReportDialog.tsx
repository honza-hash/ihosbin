import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pasteId: number;
}

export default function ReportDialog({ isOpen, onClose, pasteId }: ReportDialogProps) {
  const [reason, setReason] = useState("");
  const { toast } = useToast();
  
  const reportMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/report", { pasteId, reason });
    },
    onSuccess: () => {
      toast({
        title: "Report submitted",
        description: "Thank you for reporting this content.",
      });
      setReason("");
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error submitting report",
        description: `${error}`,
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = () => {
    if (!reason.trim()) {
      toast({
        title: "Please provide a reason",
        description: "A reason is required to submit a report.",
        variant: "destructive",
      });
      return;
    }
    
    reportMutation.mutate();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle>Report Abuse</DialogTitle>
          <DialogDescription className="text-slate-400">
            Please provide details about why this content violates our terms of service.
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4">
          <Textarea
            placeholder="Describe the issue (e.g., malware, copyright violation, illegal content)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="bg-slate-700 border-slate-600 text-slate-200 focus:ring-primary focus:border-primary h-32"
          />
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={reportMutation.isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {reportMutation.isPending ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
