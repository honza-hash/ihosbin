import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { pastes, comments, reports, tickets, users } from "@shared/schema";

// Initialize postgres client with provided connection string from environment variable
const connectionString = process.env.DATABASE_URL || "";
console.log("Connecting to database...");
const client = postgres(connectionString);

// Initialize Drizzle ORM
export const db = drizzle(client, { schema: { pastes, comments, reports, tickets, users } });
