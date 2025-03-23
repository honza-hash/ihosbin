import { pgTable, text, serial, integer, boolean, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model kept for compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Paste model
export const pastes = pgTable("pastes", {
  id: serial("id").primaryKey(),
  title: text("title"),
  content: text("content").notNull(),
  language: text("language").notNull().default("text"),
  visibility: text("visibility").notNull().default("public"),
  expiration: text("expiration").notNull().default("never"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  views: integer("views").notNull().default(0),
  likes: integer("likes").notNull().default(0),
  ip_address: text("ip_address"),
});

export const insertPasteSchema = createInsertSchema(pastes).omit({
  id: true,
  created_at: true,
  views: true,
  likes: true,
  ip_address: true,
});

export type InsertPaste = z.infer<typeof insertPasteSchema>;
export type Paste = typeof pastes.$inferSelect;

// Comments model
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  paste_id: integer("paste_id").notNull().references(() => pastes.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  ip_address: text("ip_address"),
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  created_at: true,
  ip_address: true,
});

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

// Likes tracking (to prevent multiple likes from same IP)
export const pasteLikes = pgTable("paste_likes", {
  id: serial("id").primaryKey(),
  paste_id: integer("paste_id").notNull().references(() => pastes.id, { onDelete: "cascade" }),
  ip_address: text("ip_address").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
  return {
    unique_like: primaryKey({ columns: [table.paste_id, table.ip_address] }),
  };
});

export const insertPasteLikeSchema = createInsertSchema(pasteLikes).omit({
  id: true,
  created_at: true,
});

export type InsertPasteLike = z.infer<typeof insertPasteLikeSchema>;
export type PasteLike = typeof pasteLikes.$inferSelect;

// Abuse reports
export const abuseReports = pgTable("abuse_reports", {
  id: serial("id").primaryKey(),
  paste_id: integer("paste_id").notNull().references(() => pastes.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  ip_address: text("ip_address"),
  resolved: boolean("resolved").notNull().default(false),
});

export const insertAbuseReportSchema = createInsertSchema(abuseReports).omit({
  id: true,
  created_at: true,
  ip_address: true,
  resolved: true,
});

export type InsertAbuseReport = z.infer<typeof insertAbuseReportSchema>;
export type AbuseReport = typeof abuseReports.$inferSelect;

// Support tickets
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  email: text("email"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  ip_address: text("ip_address"),
  resolved: boolean("resolved").notNull().default(false),
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  created_at: true,
  ip_address: true,
  resolved: true,
});

export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;

// Blacklist for malicious content
export const blacklist = pgTable("blacklist", {
  id: serial("id").primaryKey(),
  pattern: text("pattern").notNull().unique(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  reason: text("reason"),
});

export const insertBlacklistSchema = createInsertSchema(blacklist).omit({
  id: true,
  created_at: true,
});

export type InsertBlacklist = z.infer<typeof insertBlacklistSchema>;
export type Blacklist = typeof blacklist.$inferSelect;
