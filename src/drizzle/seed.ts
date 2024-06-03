import { client2, client, db2 } from "db";
import { fakultas } from "../drizzle/schema2";
import { prodi } from "../drizzle/schema";
import { eq } from "drizzle-orm";

(async () => {
  try {
    client.connect();
    client2.connect();
    const fakultasData = await db2.query.fakultas.findMany();
    console.log(fakultasData);
  } catch (error: any) {
    console.error(error.message);
  }
})();
