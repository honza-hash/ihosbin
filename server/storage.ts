import { 
  users, type User, type InsertUser,
  pastes, type Paste, type InsertPaste,
  comments, type Comment, type InsertComment,
  pasteLikes, type PasteLike, type InsertPasteLike,
  abuseReports, type AbuseReport, type InsertAbuseReport,
  supportTickets, type SupportTicket, type InsertSupportTicket,
  blacklist, type Blacklist, type InsertBlacklist
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql as sqlBuilder, like, and, or, not, isNull } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Paste methods
  createPaste(paste: InsertPaste, ipAddress?: string): Promise<Paste>;
  getPaste(id: number): Promise<Paste | undefined>;
  incrementPasteViews(id: number): Promise<void>;
  getTrendingPastes(limit: number, offset: number): Promise<Paste[]>;
  getRecentPastes(limit: number, offset: number): Promise<Paste[]>;
  getMostViewedPastes(limit: number, offset: number): Promise<Paste[]>;
  deletePaste(id: number): Promise<void>;
  
  // Comment methods
  createComment(comment: InsertComment, ipAddress?: string): Promise<Comment>;
  getCommentsByPasteId(pasteId: number): Promise<Comment[]>;
  
  // Like methods
  likePaste(pasteLike: InsertPasteLike): Promise<void>;
  unlikePaste(pasteId: number, ipAddress: string): Promise<void>;
  hasLiked(pasteId: number, ipAddress: string): Promise<boolean>;
  
  // Abuse report methods
  createAbuseReport(report: InsertAbuseReport, ipAddress?: string): Promise<AbuseReport>;
  
  // Support ticket methods
  createSupportTicket(ticket: InsertSupportTicket, ipAddress?: string): Promise<SupportTicket>;
  
  // Blacklist methods
  getBlacklistPatterns(): Promise<string[]>;
  addBlacklistPattern(blacklistItem: InsertBlacklist): Promise<Blacklist>;
  checkContentAgainstBlacklist(content: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Paste methods
  async createPaste(insertPaste: InsertPaste, ipAddress?: string): Promise<Paste> {
    const [paste] = await db
      .insert(pastes)
      .values({ ...insertPaste, ip_address: ipAddress })
      .returning();
    return paste;
  }

  async getPaste(id: number): Promise<Paste | undefined> {
    const [paste] = await db.select().from(pastes).where(eq(pastes.id, id));
    return paste;
  }

  async incrementPasteViews(id: number): Promise<void> {
    await db
      .update(pastes)
      .set({ views: sqlBuilder`${pastes.views} + 1` })
      .where(eq(pastes.id, id));
  }

  async getTrendingPastes(limit: number = 10, offset: number = 0): Promise<Paste[]> {
    return db
      .select()
      .from(pastes)
      .where(eq(pastes.visibility, "public"))
      .orderBy(desc(pastes.likes))
      .limit(limit)
      .offset(offset);
  }

  async getRecentPastes(limit: number = 10, offset: number = 0): Promise<Paste[]> {
    return db
      .select()
      .from(pastes)
      .where(eq(pastes.visibility, "public"))
      .orderBy(desc(pastes.created_at))
      .limit(limit)
      .offset(offset);
  }

  async getMostViewedPastes(limit: number = 10, offset: number = 0): Promise<Paste[]> {
    return db
      .select()
      .from(pastes)
      .where(eq(pastes.visibility, "public"))
      .orderBy(desc(pastes.views))
      .limit(limit)
      .offset(offset);
  }

  async deletePaste(id: number): Promise<void> {
    await db.delete(pastes).where(eq(pastes.id, id));
  }

  // Comment methods
  async createComment(insertComment: InsertComment, ipAddress?: string): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values({ ...insertComment, ip_address: ipAddress })
      .returning();
    return comment;
  }

  async getCommentsByPasteId(pasteId: number): Promise<Comment[]> {
    return db
      .select()
      .from(comments)
      .where(eq(comments.paste_id, pasteId))
      .orderBy(desc(comments.created_at));
  }

  // Like methods
  async likePaste(pasteLike: InsertPasteLike): Promise<void> {
    // Insert the like
    try {
      await db.insert(pasteLikes).values(pasteLike);
    } catch (e) {
      // Likely a duplicate key error (already liked), ignore
      return;
    }

    // Increment the like count on the paste
    await db
      .update(pastes)
      .set({ likes: sqlBuilder`${pastes.likes} + 1` })
      .where(eq(pastes.id, pasteLike.paste_id));
  }

  async unlikePaste(pasteId: number, ipAddress: string): Promise<void> {
    // Delete the like
    const result = await db
      .delete(pasteLikes)
      .where(
        and(
          eq(pasteLikes.paste_id, pasteId),
          eq(pasteLikes.ip_address, ipAddress)
        )
      )
      .returning();

    // If we deleted something, decrement the like count on the paste
    if (result.length > 0) {
      await db
        .update(pastes)
        .set({ likes: sqlBuilder`${pastes.likes} - 1` })
        .where(eq(pastes.id, pasteId));
    }
  }

  async hasLiked(pasteId: number, ipAddress: string): Promise<boolean> {
    const [like] = await db
      .select()
      .from(pasteLikes)
      .where(
        and(
          eq(pasteLikes.paste_id, pasteId),
          eq(pasteLikes.ip_address, ipAddress)
        )
      );
    return !!like;
  }

  // Abuse report methods
  async createAbuseReport(report: InsertAbuseReport, ipAddress?: string): Promise<AbuseReport> {
    const [abuseReport] = await db
      .insert(abuseReports)
      .values({ ...report, ip_address: ipAddress })
      .returning();
    return abuseReport;
  }

  // Support ticket methods
  async createSupportTicket(ticket: InsertSupportTicket, ipAddress?: string): Promise<SupportTicket> {
    const [supportTicket] = await db
      .insert(supportTickets)
      .values({ ...ticket, ip_address: ipAddress })
      .returning();
    return supportTicket;
  }

  // Blacklist methods
  async getBlacklistPatterns(): Promise<string[]> {
    const items = await db.select().from(blacklist);
    return items.map(item => item.pattern);
  }

  async addBlacklistPattern(blacklistItem: InsertBlacklist): Promise<Blacklist> {
    const [item] = await db
      .insert(blacklist)
      .values(blacklistItem)
      .returning();
    return item;
  }

  async checkContentAgainstBlacklist(content: string): Promise<boolean> {
    const patterns = await this.getBlacklistPatterns();
    return patterns.some(pattern => {
      const regex = new RegExp(pattern, 'i');
      return regex.test(content);
    });
  }
}

export const storage = new DatabaseStorage();
