const express = require("express");
const router = express.Router();

router.use("/room", require("./rooms.js"));

router.get("/", (req, res) => {
  res.render("index", {
    layout: false,
    PEERJS_KEY: process.env.PEERJS_KEY,
    csrfToken: res.locals.csrfToken,
  });
});

router.use((req, res) => {
  res.status(404).send("404: Not Found");
});

module.exports = router;
