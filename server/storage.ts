import { pastes, comments, reports, tickets, users, 
  type User, type InsertUser, type Paste, type InsertPaste, 
  type Comment, type InsertComment, type Report, type InsertReport, 
  type Ticket, type InsertTicket } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql as sqlBuilder, and, isNull, lte, gte, or } from "drizzle-orm";
import { nanoid } from "nanoid";

export interface IStorage {
  // User methods (retained from original)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Paste methods
  createPaste(paste: InsertPaste): Promise<Paste>;
  getPasteById(id: number): Promise<Paste | undefined>;
  getPasteByShortUrl(shortUrl: string): Promise<Paste | undefined>;
  incrementPasteViews(id: number): Promise<void>;
  likePaste(id: number): Promise<void>;
  getTrendingPastes(limit?: number, period?: string): Promise<Paste[]>;
  getLatestPastes(limit?: number): Promise<Paste[]>;
  deletePaste(id: number): Promise<void>;

  // Comment methods
  createComment(comment: InsertComment): Promise<Comment>;
  getCommentsByPasteId(pasteId: number): Promise<Comment[]>;

  // Report methods
  createReport(report: InsertReport): Promise<Report>;
  getReports(resolved?: boolean): Promise<Report[]>;
  resolveReport(id: number): Promise<void>;

  // Support ticket methods
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  getTickets(resolved?: boolean): Promise<Ticket[]>;
  resolveTicket(id: number): Promise<void>;

  // Statistics methods
  getStatistics(): Promise<{
    totalPastes: number;
    totalComments: number;
    totalReports: number;
    totalTickets: number;
    topLanguages: Array<{ language: string; count: number }>;
    pastesLast24Hours: number;
    pastesByExpirationTime: Array<{ expiration: string; count: number }>;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User methods (from original)
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // Statistics method
  async getStatistics() {
    // Get total pastes count
    const [pastesResult] = await db.select({ count: sqlBuilder<number>`count(*)` }).from(pastes);
    const totalPastes = pastesResult?.count || 0;

    // Get total comments count
    const [commentsResult] = await db.select({ count: sqlBuilder<number>`count(*)` }).from(comments);
    const totalComments = commentsResult?.count || 0;

    // Get total reports count
    const [reportsResult] = await db.select({ count: sqlBuilder<number>`count(*)` }).from(reports);
    const totalReports = reportsResult?.count || 0;

    // Get total tickets count
    const [ticketsResult] = await db.select({ count: sqlBuilder<number>`count(*)` }).from(tickets);
    const totalTickets = ticketsResult?.count || 0;

    // Get pastes created in the last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const [recentPastesResult] = await db.select({ count: sqlBuilder<number>`count(*)` })
      .from(pastes)
      .where(gte(pastes.createdAt, oneDayAgo));
    const pastesLast24Hours = recentPastesResult?.count || 0;

    // Get top languages
    const topLanguagesResult = await db.select({
      language: pastes.syntax,
      count: sqlBuilder<number>`count(*)`
    })
    .from(pastes)
    .groupBy(pastes.syntax)
    .orderBy(desc(sqlBuilder`count(*)`))
    .limit(5);

    const topLanguages = topLanguagesResult.map(row => ({
      language: row.language,
      count: row.count
    }));

    // Get pastes by expiration time
    const expirationTimesResult = await db.select({
      expiration: pastes.expiration,
      count: sqlBuilder<number>`count(*)`
    })
    .from(pastes)
    .groupBy(pastes.expiration)
    .orderBy(desc(sqlBuilder`count(*)`));

    const pastesByExpirationTime = expirationTimesResult.map(row => ({
      expiration: row.expiration,
      count: row.count
    }));

    return {
      totalPastes,
      totalComments,
      totalReports,
      totalTickets,
      topLanguages,
      pastesLast24Hours,
      pastesByExpirationTime
    };
  }

  // Paste methods
  async createPaste(paste: InsertPaste): Promise<Paste> {
    // Generate a short URL and delete token using nanoid
    const shortUrl = nanoid(8);
    const deleteToken = nanoid(16);

    // Calculate expiration date if needed
    let expiresAt = null;
    if (paste.expiration !== 'never') {
      const now = new Date();
      switch (paste.expiration) {
        case '10m': expiresAt = new Date(now.getTime() + 10 * 60 * 1000); break;
        case '1h': expiresAt = new Date(now.getTime() + 60 * 60 * 1000); break;
        case '1d': expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); break;
        case '1w': expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); break;
        case '1m': expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); break;
        case '1y': expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); break;
      }
    }

    const [newPaste] = await db.insert(pastes).values({
      ...paste,
      shortUrl,
      deleteToken,
      expiresAt
    }).returning();
    return newPaste;
  }

  async getPasteById(id: number): Promise<Paste | undefined> {
    const [paste] = await db.select().from(pastes).where(eq(pastes.id, id));

    // Check if paste has expired
    if (paste && paste.expiresAt && new Date(paste.expiresAt) < new Date()) {
      await this.deletePaste(id);
      return undefined;
    }

    return paste;
  }

  async getPasteByShortUrl(shortUrl: string): Promise<Paste | undefined> {
    const [paste] = await db.select().from(pastes).where(eq(pastes.shortUrl, shortUrl));

    // Check if paste has expired
    if (paste && paste.expiresAt && new Date(paste.expiresAt) < new Date()) {
      await this.deletePaste(paste.id);
      return undefined;
    }

    return paste;
  }

  async incrementPasteViews(id: number): Promise<void> {
    await db.update(pastes)
      .set({ views: sqlBuilder`${pastes.views} + 1` })
      .where(eq(pastes.id, id));
  }

  async likePaste(id: number): Promise<void> {
    await db.update(pastes)
      .set({ likes: sqlBuilder`${pastes.likes} + 1` })
      .where(eq(pastes.id, id));
  }

  async getTrendingPastes(limit: number = 10, period: string = 'week'): Promise<Paste[]> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'all':
      default:
        startDate = new Date(0); // Beginning of time
        break;
    }

    // Get trending pastes based on views and likes
    return db.select().from(pastes)
      .where(and(
        gte(pastes.createdAt, startDate),
        eq(pastes.isPrivate, false),
        or(isNull(pastes.expiresAt), gte(pastes.expiresAt, now))
      ))
      .orderBy(desc(sqlBuilder`(${pastes.views} + ${pastes.likes} * 3)`)) // Weigh likes more than views
      .limit(limit);
  }

  async getLatestPastes(limit: number = 10): Promise<Paste[]> {
    const now = new Date();

    return db.select().from(pastes)
      .where(and(
        eq(pastes.isPrivate, false),
        or(isNull(pastes.expiresAt), gte(pastes.expiresAt, now))
      ))
      .orderBy(desc(pastes.createdAt))
      .limit(limit);
  }

  async deletePaste(id: number): Promise<void> {
    await db.delete(pastes).where(eq(pastes.id, id));
  }

  // Comment methods
  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();

    // Update comments count
    await db.update(pastes)
      .set({ commentsCount: sqlBuilder`${pastes.commentsCount} + 1` })
      .where(eq(pastes.id, comment.pasteId));

    return newComment;
  }

  async getCommentsByPasteId(pasteId: number): Promise<Comment[]> {
    return db.select().from(comments)
      .where(eq(comments.pasteId, pasteId))
      .orderBy(desc(comments.createdAt));
  }

  // Report methods
  async createReport(report: InsertReport): Promise<Report> {
    const [newReport] = await db.insert(reports).values(report).returning();
    return newReport;
  }

  async getReports(resolved: boolean = false): Promise<Report[]> {
    return db.select().from(reports)
      .where(eq(reports.resolved, resolved))
      .orderBy(desc(reports.createdAt));
  }

  async resolveReport(id: number): Promise<void> {
    await db.update(reports)
      .set({ resolved: true })
      .where(eq(reports.id, id));
  }

  // Support ticket methods
  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const [newTicket] = await db.insert(tickets).values(ticket).returning();
    return newTicket;
  }

  async getTickets(resolved: boolean = false): Promise<Ticket[]> {
    return db.select().from(tickets)
      .where(eq(tickets.resolved, resolved))
      .orderBy(desc(tickets.createdAt));
  }

  async resolveTicket(id: number): Promise<void> {
    await db.update(tickets)
      .set({ resolved: true })
      .where(eq(tickets.id, id));
  }
}

export const storage = new DatabaseStorage();