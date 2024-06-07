// controller/users.controller.ts
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
    const body = await c.req.parseBody();
    console.log("🚀 ~ UserControllers ~ uploadFile ~ body:", body);
    console.log(body["file"]);
    return {
      message: "File uploaded successfully",
    };
  }
}
