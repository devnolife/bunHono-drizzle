import { db, client } from "db";
import { users } from "schema";

(async () => {
  try {
    client.connect();
    await db.insert(users).values({
      username: "admin",
      password: new Bun.CryptoHasher("md5")
        .update("samaKemarin00")
        .digest("hex"),
      role: "admin",
    });
    console.log("Seed data inserted");
    client.end();
  } catch (error: any) {
    console.error(error.message);
  }
})();
