import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { pastes, comments, reports, tickets, users } from "@shared/schema";

// Initialize postgres client with provided connection string
const connectionString = "postgresql://neondb_owner:npg_fPeh45ArWxcw@ep-damp-sun-a9at743h-pooler.gwc.azure.neon.tech/neondb?sslmode=require";
const client = postgres(connectionString);

// Initialize Drizzle ORM
export const db = drizzle(client, { schema: { pastes, comments, reports, tickets, users } });
