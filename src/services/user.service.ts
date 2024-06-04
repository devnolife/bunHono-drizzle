// services/user.service.ts
import { db } from "db";
import { eq } from "drizzle-orm";
import { mhs } from "schema";

export class UserService {
  async getUserProfile(userId: string) {
    try {
      const profile = await db.query.mhs.findFirst({
        where: eq(mhs.nim, userId),
        with: {
          beasiswa: true,
        },
      });
      return {
        status: 200,
        message: "Success",
        data: profile,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
