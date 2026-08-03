const express = require("express");
const session = require("express-session");
const compression = require("compression");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { csrfSync } = require("csrf-sync");
const { generateToken, csrfSynchronisedProtection } = csrfSync();
const db = require("../models/db.js");
const BetterSqlite3SessionStore = require("better-sqlite3-session-store")(session);

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

morgan.token("time", () => dateFormat.format(new Date()));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

module.exports = function (app) {
  console.info(`[${dateFormat.format(new Date())}] Listening on port ${process.env.PORT || 5000}.`);

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(compression());
  app.use(express.static("public"));
  app.use(
    morgan("[:time] :method :url :status :res[content-length] - :remote-addr - :response-time ms"),
  );
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use(
    session({
      store: new BetterSqlite3SessionStore({ client: db }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" },
    }),
  );

  app.use(csrfSynchronisedProtection);

  const hbs = exphbs.create({});

  app.enable("case sensitive routing");
  app.enable("strict routing");
  app.disable("x-powered-by");
  app.engine("handlebars", hbs.engine);
  app.set("view engine", "handlebars");

  app.use((req, res, next) => {
    res.locals.csrfToken = generateToken(req);
    next();
  });

  app.use("/room/create", authLimiter);
  app.use("/room/delete", authLimiter);
  app.use("/room/join", authLimiter);
};
