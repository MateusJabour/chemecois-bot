const express = require("express");
const db = require("./db");
const fetch = require("node-fetch");

const app = express();

const port = process.env.PORT || 3000;
const webHookUrl = process.env.WEBHOOK_URL;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", async (req, res) => {
  try {
    db.set("quantity", req.body.quantity).write();

    await fetch(webHookUrl, {
      method: "POST",
      body: JSON.stringify(generateMessage(req.body.quantity)),
      headers: {
        "Content-Type": "application/json"
      }
    });

    res.json({ success: db.get("quantity") });
  } catch (error) {
    console.error({ error });
  }
});

app.post("/slack", async (req, res) => {
  try {
    const payload = JSON.parse(req.body.payload);
    console.log({ payload });

    const currentQuantity = db.get("quantity").value();

    const newQuantity = currentQuantity - 1;
    db.set("quantity", newQuantity).write();

    const responsePayload = {
      replace_original: false,
      text: `Cup claimed by <@${payload.user.username}>`,
      response_type: "in_channel"
    };

    console.log(
      await fetch(payload.response_url, {
        method: "POST",
        body: JSON.stringify(responsePayload),
        headers: {
          "Content-Type": "application/json"
        }
      })
    );

    const originalMessagePayload = {
      replace_original: true,
      blocks: JSON.stringify(generateMessage(newQuantity).blocks),
      response_type: "in_channel"
    };

    console.log(
      await fetch(payload.response_url, {
        method: "POST",
        body: JSON.stringify(originalMessagePayload),
        headers: {
          "Content-Type": "application/json"
        }
      })
    );

    res.sendStatus(200);
  } catch (error) {
    console.error({ error });
  }
});

app.listen(port);

function generateMessage(quantity) {
  return {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            quantity > 0
              ? `<!here> ${quantity} ${
                  quantity > 1 ? "cups" : "cup"
                } available. Claim your cup!`
              : "No more cups available"
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*Location:*\nMontreal, 4th floor"
          },
          {
            type: "mrkdwn",
            text: `*Number of cups:*\n${quantity}`
          }
        ]
      },
      quantity > 0
        ? {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Claim cup"
                },
                style: "primary",
                value: "take_chemex",
                action_id: "take_chemex"
              }
            ]
          }
        : {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*No more cups available*"
            }
          }
    ]
  };
}
