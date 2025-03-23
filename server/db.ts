import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import { pastes, comments, reports, tickets, users } from "@shared/schema";

// Initialize Neon client
const sql = neon(process.env.DATABASE_URL || "");

// Initialize Drizzle ORM
export const db = drizzle(sql, { schema: { pastes, comments, reports, tickets, users } });
