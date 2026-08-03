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

router.post(
  "/create",
  [
    body("client").notEmpty().withMessage("Missing required fields."),
    body("nickname")
      .trim()
      .stripLow()
      .isLength({ min: 1, max: 24 })
      .withMessage("Nickname must be 1-24 characters."),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    try {
      const result = room.create(req.body.client, req.body.nickname);
      res.json({ room: result.id });
    } catch (err) {
      console.error(err.stack);
      res.status(400).json({ error: err.message });
    }
  },
);

router.post(
  "/delete",
  [
    body("room").trim().stripLow().isLength({ min: 1, max: 24 }).withMessage("Invalid room ID."),
    body("client").notEmpty().withMessage("Missing required fields."),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    try {
      room.delete(req.body.room, req.body.client);
      res.end();
    } catch (err) {
      console.error(err.stack);
      res.status(400).json({ error: err.message });
    }
  },
);

router.post(
  "/join",
  [
    body("room").trim().stripLow().isLength({ min: 1, max: 24 }).withMessage("Invalid room ID."),
    body("client").notEmpty().withMessage("Missing required fields."),
    body("nickname")
      .trim()
      .stripLow()
      .isLength({ min: 1, max: 24 })
      .withMessage("Nickname must be 1-24 characters."),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    try {
      room.join(req.body.room, req.body.client, req.body.nickname);
      const peerIds = room.get(req.body.room);
      res.json({ clients: peerIds });
    } catch (err) {
      console.error(err.stack);
      res.status(400).json({ error: err.message });
    }
  },
);

module.exports = router;
