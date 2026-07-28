require("dotenv").config();

if (!process.env.PEERJS_KEY) {
  console.error("FATAL: PEERJS_KEY must be set in .env");
  process.exit(1);
}

if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
  console.error("FATAL: SESSION_SECRET must be set in .env (min 32 chars)");
  process.exit(1);
}

const express = require("express");
const app = express();

require("./controllers/config.js")(app);
app.use(require("./controllers/routes.js"));

app.use((err, _req, res, _next) => {
  if (res.headersSent) return;
  console.error(err.stack);
  const status = err.status || err.statusCode || 500;
  if (status === 403) {
    return res.status(403).json({ error: "Forbidden" });
  }
  res.status(status).send(`${status}: Internal Server Error`);
});

const port = process.env.PORT || 5000;
const host = process.env.IP || "127.0.0.1";
app.listen(port, host);
