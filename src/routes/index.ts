import { Auth } from "../auth/auth";
import { Hono } from "hono";
import { decode, verify } from "hono/jwt";
import { bearerAuth } from 'hono/bearer-auth'
const routes = new Hono();
const auth = new Auth();

routes.post("/login", async (c) => {
  const { username, password } = await c.req.json();
  return c.json(await auth.login(username, password));
});

routes.get("/me", async (c) => {
  const token = c.req.header('Authorization : Bearer');
});
// // Decode the JWT token
// const tokenToDecode =
//   'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJzdWIiOiAidXNlcjEyMyIsICJyb2xlIjogImFkbWluIn0.JxUwx6Ua1B0D1B0FtCrj72ok5cm1Pkmr_hL82sd7ELA'

// const { header, payload } = decode(tokenToDecode)

// console.log('Decoded Header:', header)
// console.log('Decoded Payload:', payload)

// routes.get("/me", async (c) => {
//  const playload = await auth.verify(c.req.headers.authorization);
// });

routes.onError(async (c: any) => {
  return c.json({ status: 400, message: c.error.message });
});

routes.get("/test-api", async (c) => {
  return c.text("Hello, World!");
});
export default routes;
