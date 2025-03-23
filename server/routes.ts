import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { checkBlacklist } from "./blacklist";
import { sendAbuseReport, sendSupportTicket } from "./webhooks";
import { z } from "zod";
import { insertPasteSchema, insertCommentSchema, insertReportSchema, insertTicketSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handler middleware
  const handleError = (err: unknown, res: Response) => {
    console.error("API Error:", err);
    
    if (err instanceof ZodError) {
      // Handle validation errors
      const validationError = fromZodError(err);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationError.details 
      });
    }
    
    // Default error
    return res.status(500).json({ message: 'Internal server error' });
  };

  // GET: API Info and Statistics
  app.get("/api/info", async (_req: Request, res: Response) => {
    try {
      // Get statistics from storage
      const stats = await storage.getStatistics();
      
      // Return API information with statistics
      res.json({
        name: "ihosbin.fun API",
        version: "1.0.0-beta",
        status: "operational",
        baseUrl: "https://beta.ihosbin.fun/api",
        statistics: stats,
        endpoints: [
          { path: "/api/trending", description: "Get trending pastes" },
          { path: "/api/latest", description: "Get latest pastes" },
          { path: "/api/paste/:id", description: "Get paste by ID or short URL" },
          { path: "/api/paste/:id/raw", description: "Get raw paste content" },
          { path: "/api/paste/:id/download", description: "Download paste" },
          { path: "/api/paste/:id/comments", description: "Get paste comments" },
          { path: "/api/paste/:id/like", description: "Like a paste" },
          { path: "/api/info", description: "Get API information and statistics" }
        ]
      });
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // GET: Get trending pastes
  app.get("/api/trending", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const period = (req.query.period as string) || 'week';
      
      const pastes = await storage.getTrendingPastes(limit, period);
      res.json(pastes);
    } catch (err) {
      handleError(err, res);
    }
  });

  // GET: Get latest pastes
  app.get("/api/latest", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const pastes = await storage.getLatestPastes(limit);
      res.json(pastes);
    } catch (err) {
      handleError(err, res);
    }
  });

  // POST: Create a new paste
  app.post("/api/paste", async (req: Request, res: Response) => {
    try {
      const pasteData = insertPasteSchema.parse(req.body);
      
      // Check content against blacklist
      const blacklistCheck = checkBlacklist(pasteData.content);
      if (blacklistCheck.blocked) {
        return res.status(403).json({ message: blacklistCheck.reason });
      }
      
      const paste = await storage.createPaste(pasteData);
      res.status(201).json(paste);
    } catch (err) {
      handleError(err, res);
    }
  });

  // GET: Get a paste by ID
  app.get("/api/paste/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        // Try to get paste by short URL
        const paste = await storage.getPasteByShortUrl(req.params.id);
        if (!paste) {
          return res.status(404).json({ message: "Paste not found" });
        }
        
        // Increment view count
        await storage.incrementPasteViews(paste.id);
        return res.json(paste);
      }
      
      const paste = await storage.getPasteById(id);
      if (!paste) {
        return res.status(404).json({ message: "Paste not found" });
      }
      
      // Increment view count
      await storage.incrementPasteViews(paste.id);
      res.json(paste);
    } catch (err) {
      handleError(err, res);
    }
  });

  // GET: Get paste raw content
  app.get("/api/paste/:id/raw", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      let paste;
      if (isNaN(id)) {
        // Try to get paste by short URL
        paste = await storage.getPasteByShortUrl(req.params.id);
      } else {
        paste = await storage.getPasteById(id);
      }
      
      if (!paste) {
        return res.status(404).json({ message: "Paste not found" });
      }
      
      // Set content type based on syntax
      const contentTypes: { [key: string]: string } = {
        javascript: 'application/javascript',
        typescript: 'application/typescript',
        json: 'application/json',
        html: 'text/html',
        css: 'text/css',
        xml: 'application/xml',
        markdown: 'text/markdown',
        plaintext: 'text/plain',
      };
      
      const contentType = contentTypes[paste.syntax] || 'text/plain';
      
      // Increment view count
      await storage.incrementPasteViews(paste.id);
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `inline; filename="${paste.id}.${getFileExtension(paste.syntax)}"`);
      res.send(paste.content);
    } catch (err) {
      handleError(err, res);
    }
  });

  // GET: Download paste content
  app.get("/api/paste/:id/download", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      let paste;
      if (isNaN(id)) {
        // Try to get paste by short URL
        paste = await storage.getPasteByShortUrl(req.params.id);
      } else {
        paste = await storage.getPasteById(id);
      }
      
      if (!paste) {
        return res.status(404).json({ message: "Paste not found" });
      }
      
      // Set content type for download
      const contentType = 'text/plain';
      const filename = paste.title 
        ? `${paste.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${getFileExtension(paste.syntax)}` 
        : `paste_${paste.id}.${getFileExtension(paste.syntax)}`;
      
      // Increment view count
      await storage.incrementPasteViews(paste.id);
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(paste.content);
    } catch (err) {
      handleError(err, res);
    }
  });

  // POST: Like a paste
  app.post("/api/paste/:id/like", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      const paste = await storage.getPasteById(id);
      if (!paste) {
        return res.status(404).json({ message: "Paste not found" });
      }
      
      await storage.likePaste(id);
      res.json({ success: true });
    } catch (err) {
      handleError(err, res);
    }
  });

  // POST: Handle Discord webhook interactions
  app.post("/api/webhook/discord", async (req: Request, res: Response) => {
    try {
      const { type, data } = req.body;
      
      if (type === 2) { // Button interaction
        const [action, id] = data.custom_id.split(':');
        
        if (action === 'delete_paste') {
          // Delete paste and create blacklist entry
          const paste = await storage.getPasteById(parseInt(id));
          if (paste) {
            await storage.deletePaste(parseInt(id));
            await storage.addToBlacklist(paste.content);
            return res.json({ 
              type: 4,
              data: { content: `✅ Paste ${id} deleted and content blacklisted` }
            });
          }
        }
      }
      
      res.json({ type: 4, data: { content: "❌ Invalid action" } });
    } catch (err) {
      handleError(err, res);
    }
  });

  // GET: Get comments for a paste
  app.get("/api/paste/:id/comments", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      const paste = await storage.getPasteById(id);
      if (!paste) {
        return res.status(404).json({ message: "Paste not found" });
      }
      
      const comments = await storage.getCommentsByPasteId(id);
      res.json(comments);
    } catch (err) {
      handleError(err, res);
    }
  });

  // POST: Add a comment to a paste
  app.post("/api/paste/:id/comments", async (req: Request, res: Response) => {
    try {
      const pasteId = parseInt(req.params.id);
      
      const paste = await storage.getPasteById(pasteId);
      if (!paste) {
        return res.status(404).json({ message: "Paste not found" });
      }
      
      // Parse comment data
      const commentInput = insertCommentSchema.parse({
        ...req.body,
        pasteId
      });
      
      // Check comment content against blacklist
      const blacklistCheck = checkBlacklist(commentInput.content);
      if (blacklistCheck.blocked) {
        return res.status(403).json({ message: blacklistCheck.reason });
      }
      
      const comment = await storage.createComment(commentInput);
      res.status(201).json(comment);
    } catch (err) {
      handleError(err, res);
    }
  });

  // POST: Report abuse
  app.post("/api/report", async (req: Request, res: Response) => {
    try {
      const reportData = insertReportSchema.parse(req.body);
      
      // Verify paste exists
      const paste = await storage.getPasteById(reportData.pasteId);
      if (!paste) {
        return res.status(404).json({ message: "Paste not found" });
      }
      
      // Create report
      const report = await storage.createReport(reportData);
      
      // Send to Discord webhook
      await sendAbuseReport(report, paste);
      
      res.status(201).json({ message: "Report submitted successfully" });
    } catch (err) {
      handleError(err, res);
    }
  });

  // POST: Submit support ticket
  app.post("/api/support", async (req: Request, res: Response) => {
    try {
      const ticketData = insertTicketSchema.parse(req.body);
      
      // Create ticket
      const ticket = await storage.createTicket(ticketData);
      
      // Send to Discord webhook
      await sendSupportTicket(ticket);
      
      res.status(201).json({ message: "Support ticket submitted successfully" });
    } catch (err) {
      handleError(err, res);
    }
  });

  // Helper function to get file extension based on syntax
  function getFileExtension(syntax: string): string {
    const extensionMap: { [key: string]: string } = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      csharp: 'cs',
      html: 'html',
      css: 'css',
      php: 'php',
      ruby: 'rb',
      go: 'go',
      rust: 'rs',
      c: 'c',
      cpp: 'cpp',
      shell: 'sh',
      sql: 'sql',
      json: 'json',
      yaml: 'yml',
      markdown: 'md',
      xml: 'xml',
      plaintext: 'txt'
    };
    
    return extensionMap[syntax] || 'txt';
  }

  const httpServer = createServer(app);
  return httpServer;
}
