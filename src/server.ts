import figlet from "figlet";
import { client } from "db";
import { app } from "./app";
const port = 8080;
(async () => {
  try {
    client.connect();
    Bun.serve({
      fetch: app.fetch,
      port: port,
    });
    console.log(figlet.textSync("devnolife", { font: "Standard", width: 80 }));
    console.log(`Server running on http://localhost:${port}`);
  } catch (error: any) {
    throw error;
  }
})();
