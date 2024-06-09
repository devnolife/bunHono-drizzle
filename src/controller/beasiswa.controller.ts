import { BeasiswaService } from "../services/beasiswa.service";
import { Context } from "hono";
export class BeasiswaControllers {
  private beasiswaService: BeasiswaService;
  constructor() {
    this.beasiswaService = new BeasiswaService();
  }
  async register(c: Context) {
    try {
      const { userId } = c.get("jwtPayload");
      const { jenisBeasiswaId, detailJenis } = await c.req.json();
      return this.beasiswaService.registerBeasiswa(
        userId,
        Number(jenisBeasiswaId),
        Number(detailJenis)
      );
    } catch (e: any) {
      throw e;
    }
  }
}
