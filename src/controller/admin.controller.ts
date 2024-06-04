// controller/admin.controller.ts
import { AdminService } from "../services/admin.service";

export class AdminControllers {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  async getAllMahasiswa() {
    return this.adminService.getAllMahasiswa();
  }

  async updateBeasiswaNilai(c: any) {
    const { beasiswaId, newNilai } = await c.req.json();
    return this.adminService.updateBeasiswaNilai(beasiswaId, newNilai);
  }
}
