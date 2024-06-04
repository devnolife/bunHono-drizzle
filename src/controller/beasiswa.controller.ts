import { BeasiswaService } from "../services/beasiswa.service";
import { findUnique } from "utils";
import { mhs } from "schema";
import { eq } from "drizzle-orm";
export class BeasiswaControllers {
  private beasiswaService: BeasiswaService;
  constructor() {
    this.beasiswaService = new BeasiswaService();
  }
  async register(c: any) {
    const { userId } = c.get("jwtPayload");
    const { jenisBeasiswaId, nilaiRaport, urlFile } = await c.req.json();
    const user = await findUnique(mhs, eq(mhs.nim, userId));
    if (user) {
      return {
        status: 400,
        message: "User telah terdaftar",
      };
    }
    return this.beasiswaService.registerBeasiswa(
      userId,
      jenisBeasiswaId,
      nilaiRaport,
      urlFile
    );
  }
}
