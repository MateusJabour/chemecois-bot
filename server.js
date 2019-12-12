const express = require("express");
const http = require("http");

const { WebClient } = require("@slack/web-api");
const { createEventAdapter } = require("@slack/events-api");
const { createMessageAdapter } = require("@slack/interactive-messages");

const app = express();

app.start = async () => {
  console.log("Starting Server...");
  const port = 8000;
  app.set("port", port);
  const server = http.createServer(app);

  server.on("error", error => {
    if (error.syscall !== "listen") throw error;
    console.error(`Failed to start server: ${error}`);
    process.exit(1);
  });

  server.on("listening", () => {
    const address = server.address();
    console.log(`Server listening ${address.address}:${address.port}`);
  });

  server.listen(port);
};

app.start().catch(err => {
  log.error(err);
});

module.exports = app;
