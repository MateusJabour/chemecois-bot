const express = require("express");
const db = require("./db");

const routes = new express.Router();

// const message = {
//   blocks: [
//     {
//       type: "section",
//       text: {
//         type: "plain_text",
//         text: "There are 2 cups available, claim your cup"
//       }
//     },
//     {
//       type: "actions",
//       elements: [
//         {
//           type: "button",
//           text: {
//             type: "plain_text",
//             text: "Claim cup"
//           },
//           value: "click_me_123"
//         }
//       ]
//     }
//   ]
// };

routes.get("/", () => {
  console.log("root biatch");
});

// routes.get("/slack", async (req, res) => {});
// routes.post("/slack", async (req, res) => {
//   try {
//     console.log(req);
//     let response;
//     const currentQuantity = db.get("quantity");

//     if (currentQuantity > 0) {
//       db.update("quantity", currentQuantity - 1).write();

//       response = {
//         response_type: "in_channel",
//         channel: req.body.channel_id,
//         text: "Cup claimed by..."
//       };
//     } else {
//       response = {
//         response_type: "in_channel",
//         channel: req.body.channel_id,
//         text: "No more cups for you"
//       };
//     }

//     return res.json(response);
//   } catch {}
// });

module.exports = routes;

{
2019-12-13T01:38:44.417093+00:00 app[web.1]: payload: `{"type":"block_actions","team":{"id":"T2SHSRH42","domain":"shopifysandbox"},"user":{"id":"URHNDPQ2H","username":"mateus.jabour","name":"mateus.jabour","team_id":"T2SHSRH42"},"api_app_id":"ARH9VFVJQ","token":"t7WmhXsmFR2IWRDY4fPMsrzS","container":{"type":"message","message_ts":"1576201120.023200","channel_id":"CRHPD1FCG","is_ephemeral":false},"trigger_id":"871544505220.94604867138.ad9afce253058d97a6cc57d0a9fd96a8","channel":{"id":"CRHPD1FCG","name":"chemex"},"message":{"type":"message","subtype":"bot_message","text":"This content can't be displayed.","ts":"1576201120.023200","bot_id":"BRMF3SH5J","blocks":[{"type":"section","block_id":"rpPDi","text":{"type":"plain_text","text":"@here 1 cup available. Claim your cup!","emoji":true}},{"type":"section","block_id":"A2y","fields":[{"type":"mrkdwn","text":"*Location:*\\nMontreal, 4th floor","verbatim":false},{"type":"mrkdwn","text":"*Number of cups:*\\n1","verbatim":false}]},{"type":"actions","block_id":"4tsy","elements":[{"type":"button","action_id":"take_chemex","text":{"type":"plain_text","text":"Claim cup","emoji":true},"style":"primary","value":"take_chemex"}]}]},"response_url":"https:\\/\\/hooks.slack.com\\/actions\\/T2SHSRH42\\/860532730947\\/e192tUulM42h6qBJnSvw6Czd","actions":[{"action_id":"take_chemex","block_id":"4tsy","text":{"type":"plain_text","text":"Claim cup","emoji":true},"value":"take_chemex","style":"primary","type":"button","action_ts":"1576201124.343429"}]}