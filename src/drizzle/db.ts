import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";
import "dotenv/config";

export const client = new Client({
  host: "kamusbugis.unismuh.ac.id",
  port: 5041,
  user: "postgres",
  password: "ifbumm",
  database: "bumm",
});

export const db = drizzle(client, { schema });
