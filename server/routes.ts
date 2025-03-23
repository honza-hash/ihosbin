import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPasteSchema, insertCommentSchema, insertAbuseReportSchema, insertSupportTicketSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { sendAbuseReportToDiscord, sendSupportTicketToDiscord } from "./utils/discord";
import { loadBlacklistFromFile, checkBlacklist } from "./utils/blacklist";

// Helper to get client IP address
const getClientIp = (req: Request): string => {
  return req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '';
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Load blacklist from file if it exists
  await loadBlacklistFromFile();

  // Create a paste
  app.post('/api/pastes', async (req: Request, res: Response) => {
    try {
      const pasteData = insertPasteSchema.parse(req.body);
      
      // Check if content matches blacklist
      const containsBlacklisted = await checkBlacklist(pasteData.content);
      if (containsBlacklisted) {
        return res.status(400).json({ 
          message: 'Content contains blacklisted patterns. Please review our Terms of Service.' 
        });
      }

      const clientIp = getClientIp(req);
      const paste = await storage.createPaste(pasteData, clientIp);
      
      res.status(201).json(paste);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error('Error creating paste:', error);
        res.status(500).json({ message: 'Could not create paste' });
      }
    }
  });

  // Get a paste by ID
  app.get('/api/pastes/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      
      const paste = await storage.getPaste(id);
      if (!paste) {
        return res.status(404).json({ message: 'Paste not found' });
      }
      
      // Increment view count
      await storage.incrementPasteViews(id);
      
      res.json(paste);
    } catch (error) {
      console.error('Error fetching paste:', error);
      res.status(500).json({ message: 'Could not retrieve paste' });
    }
  });

  // Get trending pastes
  app.get('/api/pastes/trending/:sort', async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const sort = req.params.sort || 'popular';
      
      let pastes;
      switch (sort) {
        case 'recent':
          pastes = await storage.getRecentPastes(limit, offset);
          break;
        case 'views':
          pastes = await storage.getMostViewedPastes(limit, offset);
          break;
        case 'popular':
        default:
          pastes = await storage.getTrendingPastes(limit, offset);
          break;
      }
      
      res.json(pastes);
    } catch (error) {
      console.error('Error fetching trending pastes:', error);
      res.status(500).json({ message: 'Could not retrieve trending pastes' });
    }
  });

  // Get comments for a paste
  app.get('/api/pastes/:id/comments', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      
      const comments = await storage.getCommentsByPasteId(id);
      res.json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: 'Could not retrieve comments' });
    }
  });

  // Add a comment to a paste
  app.post('/api/pastes/:id/comments', async (req: Request, res: Response) => {
    try {
      const pasteId = parseInt(req.params.id);
      if (isNaN(pasteId)) {
        return res.status(400).json({ message: 'Invalid paste ID format' });
      }
      
      // Check if paste exists
      const paste = await storage.getPaste(pasteId);
      if (!paste) {
        return res.status(404).json({ message: 'Paste not found' });
      }
      
      const commentData = insertCommentSchema.parse({
        ...req.body,
        paste_id: pasteId
      });
      
      // Check if content matches blacklist
      const containsBlacklisted = await checkBlacklist(commentData.content);
      if (containsBlacklisted) {
        return res.status(400).json({ 
          message: 'Content contains blacklisted patterns. Please review our Terms of Service.' 
        });
      }

      const clientIp = getClientIp(req);
      const comment = await storage.createComment(commentData, clientIp);
      
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Could not create comment' });
      }
    }
  });

  // Like a paste
  app.post('/api/pastes/:id/like', async (req: Request, res: Response) => {
    try {
      const pasteId = parseInt(req.params.id);
      if (isNaN(pasteId)) {
        return res.status(400).json({ message: 'Invalid paste ID format' });
      }
      
      // Check if paste exists
      const paste = await storage.getPaste(pasteId);
      if (!paste) {
        return res.status(404).json({ message: 'Paste not found' });
      }
      
      const clientIp = getClientIp(req);
      
      // Check if already liked
      const hasLiked = await storage.hasLiked(pasteId, clientIp);
      
      // Toggle like/unlike
      if (hasLiked) {
        await storage.unlikePaste(pasteId, clientIp);
        res.json({ liked: false });
      } else {
        await storage.likePaste({ paste_id: pasteId, ip_address: clientIp });
        res.json({ liked: true });
      }
    } catch (error) {
      console.error('Error liking paste:', error);
      res.status(500).json({ message: 'Could not process like action' });
    }
  });

  // Check if user has liked a paste
  app.get('/api/pastes/:id/like', async (req: Request, res: Response) => {
    try {
      const pasteId = parseInt(req.params.id);
      if (isNaN(pasteId)) {
        return res.status(400).json({ message: 'Invalid paste ID format' });
      }
      
      const clientIp = getClientIp(req);
      const hasLiked = await storage.hasLiked(pasteId, clientIp);
      
      res.json({ liked: hasLiked });
    } catch (error) {
      console.error('Error checking like status:', error);
      res.status(500).json({ message: 'Could not check like status' });
    }
  });

  // Submit an abuse report
  app.post('/api/report-abuse', async (req: Request, res: Response) => {
    try {
      const reportData = insertAbuseReportSchema.parse(req.body);
      
      // Check if paste exists
      const paste = await storage.getPaste(reportData.paste_id);
      if (!paste) {
        return res.status(404).json({ message: 'Paste not found' });
      }
      
      const clientIp = getClientIp(req);
      const report = await storage.createAbuseReport(reportData, clientIp);
      
      // Send to Discord webhook
      await sendAbuseReportToDiscord(report, paste);
      
      res.status(201).json({ message: 'Abuse report submitted successfully' });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error('Error creating abuse report:', error);
        res.status(500).json({ message: 'Could not submit abuse report' });
      }
    }
  });

  // Submit a support ticket
  app.post('/api/support', async (req: Request, res: Response) => {
    try {
      const ticketData = insertSupportTicketSchema.parse(req.body);
      
      // Check if content matches blacklist
      const containsBlacklisted = await checkBlacklist(ticketData.message);
      if (containsBlacklisted) {
        return res.status(400).json({ 
          message: 'Message contains blacklisted patterns. Please review our Terms of Service.' 
        });
      }

      const clientIp = getClientIp(req);
      const ticket = await storage.createSupportTicket(ticketData, clientIp);
      
      // Send to Discord webhook
      await sendSupportTicketToDiscord(ticket);
      
      res.status(201).json({ message: 'Support ticket submitted successfully' });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error('Error creating support ticket:', error);
        res.status(500).json({ message: 'Could not submit support ticket' });
      }
    }
  });

  // Raw paste content endpoint
  app.get('/api/pastes/:id/raw', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      
      const paste = await storage.getPaste(id);
      if (!paste) {
        return res.status(404).json({ message: 'Paste not found' });
      }
      
      // Increment view count
      await storage.incrementPasteViews(id);
      
      res.set('Content-Type', 'text/plain');
      res.send(paste.content);
    } catch (error) {
      console.error('Error fetching raw paste:', error);
      res.status(500).json({ message: 'Could not retrieve paste' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
