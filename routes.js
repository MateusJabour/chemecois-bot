const express = require("express");
const db = require("./db");

const router = new express.Router();

router.get("/slack", async (req, res) => {});
router.post("/slack", async (req, res) => {
  try {
    console.log(req);

    db.get("batch")
      .push({ cups: 1, claimed })
      .write();
    const response = {
      response_type: "in_channel",
      channel: req.body.channel_id,
      text: "Cup claimed by..."
    };
    return res.json(response);
  } catch {}
});

export default router;
