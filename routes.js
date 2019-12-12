const express = require("express");
const db = require("./db");

const routes = new express.Router();

const message = {
  blocks: [
    {
      type: "section",
      text: {
        type: "plain_text",
        text: "There are 2 cups available, claim your cup"
      }
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Claim cup"
          },
          value: "click_me_123"
        }
      ]
    }
  ]
};

routes.post("/", async (req, res) => {
  try {
    console.log({ body: req });
    const parsedBody = JSON.parse(req.body);
    console.log({ parsedBody });

    db.update("quantity", parsedBody.quantity).write();

    const response = await fetch(process.env.WEBHOOK_URL, {
      method: "POST",
      body: JSON.stringify(message),
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log({ response });
    res.json({ success: "ihu" });
  } catch (error) {
    console.error({ error });
  }
});

routes.get("/slack", async (req, res) => {});
routes.post("/slack", async (req, res) => {
  try {
    console.log(req);
    let response;
    const currentQuantity = db.get("quantity");

    if (currentQuantity > 0) {
      db.update("quantity", currentQuantity - 1).write();

      response = {
        response_type: "in_channel",
        channel: req.body.channel_id,
        text: "Cup claimed by..."
      };
    } else {
      response = {
        response_type: "in_channel",
        channel: req.body.channel_id,
        text: "No more cups for you"
      };
    }

    return res.json(response);
  } catch {}
});

module.exports = routes;
