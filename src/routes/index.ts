import { Auth } from "../controller/auth.controller";
import { Hono } from "hono";

const routes = new Hono();
const auth = new Auth();

routes.post("/login", async (c) => {
  const { username, password } = await c.req.json();
  return c.json(await auth.login(username, password));
});

routes.onError(async (c: any) => {
  return c.json({ status: 400, message: c.error.message });
});

routes.get("/test-api", async (c) => {
  return c.text("Hello, World!");
});
export default routes;
