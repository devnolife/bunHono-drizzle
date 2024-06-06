import { BeasiswaService } from "../services/beasiswa.service";
import { beasiswa } from "schema";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { db } from "db";
export class BeasiswaControllers {
  private beasiswaService: BeasiswaService;
  constructor() {
    this.beasiswaService = new BeasiswaService();
  }
  async register(c: any) {
    try {
      const { userId } = c.get("jwtPayload");
      const { jenisBeasiswaId, urlFile, detailJenis } = await c.req.json();
      const user = await db.query.beasiswa.findFirst({
        where: eq(beasiswa.nim, userId),
      });
      if (user) {
        throw new HTTPException(400, {
          message: "Mahasiswa telah terdaftar !",
        });
      }
      return this.beasiswaService.registerBeasiswa(
        userId,
        Number(jenisBeasiswaId),
        Number(detailJenis),
        urlFile
      );
    } catch (e: any) {
      throw e;
    }
  }
}
