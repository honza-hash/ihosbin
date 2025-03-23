import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (retained from original schema)
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

// Syntax highlighting languages enum
export const syntaxEnum = pgEnum("syntax", [
  "plaintext", "javascript", "typescript", "python", "java", "csharp", 
  "html", "css", "php", "ruby", "go", "rust", "c", "cpp", 
  "shell", "sql", "json", "yaml", "markdown", "xml"
]);

// Expiration enum
export const expirationEnum = pgEnum("expiration", [
  "never", "10m", "1h", "1d", "1w", "1m", "1y"
]);

// Pastes table
export const pastes = pgTable("pastes", {
  id: serial("id").primaryKey(),
  title: text("title"),
  content: text("content").notNull(),
  syntax: syntaxEnum("syntax").notNull().default("plaintext"),
  expiration: expirationEnum("expiration").notNull().default("never"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  views: integer("views").default(0).notNull(),
  likes: integer("likes").default(0).notNull(),
  commentsCount: integer("comments_count").default(0).notNull(),
  isPrivate: boolean("is_private").default(false).notNull(),
  shortUrl: text("short_url").notNull().unique(),
});

export const insertPasteSchema = createInsertSchema(pastes)
  .omit({ id: true, createdAt: true, views: true, likes: true, commentsCount: true, shortUrl: true, expiresAt: true });

export type InsertPaste = z.infer<typeof insertPasteSchema>;
export type Paste = typeof pastes.$inferSelect;

// Comments table
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  pasteId: integer("paste_id").notNull().references(() => pastes.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdAt: true });

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

// Abuse reports table
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  pasteId: integer("paste_id").notNull().references(() => pastes.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolved: boolean("resolved").default(false).notNull(),
});

export const insertReportSchema = createInsertSchema(reports).omit({ id: true, createdAt: true, resolved: true });

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;

// Support tickets table
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  email: text("email"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolved: boolean("resolved").default(false).notNull(),
});

export const insertTicketSchema = createInsertSchema(tickets).omit({ id: true, createdAt: true, resolved: true });

export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = typeof tickets.$inferSelect;
