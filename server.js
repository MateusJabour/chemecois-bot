const express = require("express");
const db = require("./db");
const fetch = require("node-fetch");

const app = express();
const dotenv = require("dotenv");

dotenv.config();

if (process.env.NODE_ENV === "development") {
  console.log("Development mode is on");
}

const port = process.env.PORT || 3000;
const webHookUrl = process.env.WEBHOOK_URL;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let claimersList = [];

app.post("/quantity", async (req, res) => {
  res.json({ quantity: db.get("quantity") });
});

app.post("/", async (req, res) => {
  try {
    db.set("quantity", req.body.quantity).write();

    claimersList.length = 0;

    const response = await fetch(webHookUrl, {
      method: "POST",
      body: JSON.stringify(generateMessage(req.body.quantity)),
      headers: {
        "Content-Type": "application/json"
      }
    });

    res.json({ success: db.get("quantity"), response });
  } catch (error) {
    console.error({ error });
  }
});

app.post("/slack", async (req, res) => {
  try {
    const payload = JSON.parse(req.body.payload);
    const hasClaimed = claimersList.includes(payload.user.username);

    if (!hasClaimed) {
      const currentQuantity = db.get("quantity").value();
      const newQuantity = currentQuantity - 1;
      db.set("quantity", newQuantity).write();

      claimersList.push(payload.user.username);
    }

    const responsePayload = {
      replace_original: false,
      text: hasClaimed
        ? `Don't be greedy! You already got one.`
        : `1 cup was claimed by <@${payload.user.username}>`,
      response_type: !hasClaimed ? "in_channel" : "ephemeral"
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
                  text: "Claim cup!"
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
