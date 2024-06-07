// controller/users.controller.ts
import { uploadFile } from "utils";
import { UserService } from "../services/user.service";

export class UserControllers {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }
  async profile(c: any) {
    const { userId } = c.get("jwtPayload");
    return this.userService.getUserProfile(userId);
  }
  async nilaiRaport(c: any) {
    const { userId } = c.get("jwtPayload");
    return this.userService.getNilaiRaport(userId);
  }
  async editRaport(c: any) {
    const { idRaport, ...data } = await c.req.json();
    return this.userService.updateNilaiRaport(idRaport, data);
  }
  async uploadFile(c: any) {
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
