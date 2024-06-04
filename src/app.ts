import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import routes from "./routes/index";
const app = new Hono();

app.use(cors());
app.use(logger());

app.notFound((c) => {
  return c.text("Not Found", 404);
});
app.onError((err, c) => {
  return c.json({ status: 500, message: err.message });
});
app.get("/", async (c) => {
  return c.text("This backend from devnolife");
});

app.route("/api", routes);

export { app };
