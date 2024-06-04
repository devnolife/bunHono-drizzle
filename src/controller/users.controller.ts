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
}
