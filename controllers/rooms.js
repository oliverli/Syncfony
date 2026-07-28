const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const room = require("../models/room.js");

router.get("/", (req, res) => {
  res.render("room", {
    layout: false,
    PEERJS_KEY: process.env.PEERJS_KEY,
    csrfToken: res.locals.csrfToken,
  });
});

router.post("/create", [body("client").notEmpty(), body("nickname").notEmpty()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  try {
    const result = room.create(req.body.client, req.body.nickname);
    res.json({ room: result.id });
  } catch (err) {
    console.error(err.stack);
    res.status(400).json({ error: err.message });
  }
});

router.post("/delete", [body("room").notEmpty(), body("client").notEmpty()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  try {
    room.delete(req.body.room, req.body.client);
    res.end();
  } catch (err) {
    console.error(err.stack);
    res.status(400).json({ error: err.message });
  }
});

router.post(
  "/join",
  [body("room").notEmpty(), body("client").notEmpty(), body("nickname").notEmpty()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    try {
      room.join(req.body.room, req.body.client, req.body.nickname);
      const peerIds = room.get(req.body.room);
      res.json({ clients: JSON.stringify(peerIds) });
    } catch (err) {
      console.error(err.stack);
      res.status(400).json({ error: err.message });
    }
  },
);

module.exports = router;
