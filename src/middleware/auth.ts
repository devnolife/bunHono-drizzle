import { verify } from "hono/jwt";
import { Next, Context } from "hono";
import { HTTPException } from "hono/http-exception";

export class Middleware {
  async isAuth(c: Context, next: Next) {
    try {
      const token = c.req.header("Authorization");
      if (!token) {
        throw new HTTPException(401, {
          message: "Unauthorized!",
        });
      }
      const jwt = token.split(" ")[1];
      const payload = await verify(jwt, "secret");
      if (!payload) {
        throw new HTTPException(401, {
          message: "Unauthorized!",
        });
      }

      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        throw new HTTPException(401, {
          message: "Token has expired !",
        });
      }
      c.set("jwtPayload", payload);
      await next();
    } catch (error: any) {
      throw new HTTPException(401, {
        message: "Unauthorized !",
      });
    }
  }
}
