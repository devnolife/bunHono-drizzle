// controller/users.controller.ts
import { uploadFile } from "utils";
import { UserService } from "../services/user.service";
import { Context } from "hono";

export class UserControllers {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }
  async profile(c: Context) {
    const { userId } = c.get("jwtPayload");
    return this.userService.getUserProfile(userId);
  }
  async nilaiRaport(c: Context) {
    const { userId } = c.get("jwtPayload");
    return this.userService.getNilaiRaport(userId);
  }

  async addRaport(c: Context) {
    const { userId } = c.get("jwtPayload");
    const { ...data } = await c.req.json();
    return this.userService.addNewMapel(userId, data);
  }
  async editRaport(c: Context) {
    const { idRaport, ...data } = await c.req.json();
    return this.userService.updateNilaiRaport(idRaport, data);
  }
  async deleteRaport(c: Context) {
    const idRaport = c.req.param("idRaport");
    return this.userService.deteleNilaiRaport(idRaport);
  }
  async uploadFile(c: Context) {
    const { userId } = c.get("jwtPayload");
    const fileName = `raport-${userId}-${Date.now()}`;
    const data = await uploadFile(c, fileName, userId);
    return c.json({
      message: "File uploaded successfully",
      status: 200,
      data: data,
    });
  }
}
