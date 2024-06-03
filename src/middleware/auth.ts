import { verify } from "hono/jwt";
import { Next, Context } from "hono";

export class Auth {
  async isAuth(c: Context, next: Next) {
    try {
      const token = c.req.header("Authorization");
      if (!token) {
        return c.json({ status: 401, message: "Unauthorized" });
      }
      const jwt = token.split(" ")[1];
      const payload = await verify(jwt, "secret");
      if (!payload) {
        return c.json({ status: 401, message: "Unauthorized" });
      }
      c.set("playload", payload.sub);
      await next();
    } catch (error: any) {
      return c.json({ status: 401, message: "Unauthorized" });
    }
  }
}
