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

    let message;
    const currentQuantity = db.get("quantity");

    if (currentQuantity > 0) {
      db.set("quantity", currentQuantity - 1).write();

      message = `Cup claimed by <@${payload.user.username}>`;
    } else {
      message = `No more cups for <@${payload.user.username}>`;
    }

    const responsePayload = {
      replace_original: false,
      text: message,
      response_type: "in_channel"
    };

    console.log({ responseurl: payload.response_url });

    console.log(
      await fetch(payload.response_url, {
        method: "POST",
        body: JSON.stringify(responsePayload),
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
          type: "plain_text",
          text: `<@here> ${quantity} ${
            quantity > 1 ? "cups" : "cup"
          } available. Claim your cup!`
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
      {
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
    ]
  };
}
