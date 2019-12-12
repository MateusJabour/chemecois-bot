const express = require("express");
const http = require("http");

const { WebClient } = require("@slack/web-api");
const { createEventAdapter } = require("@slack/events-api");
const { createMessageAdapter } = require("@slack/interactive-messages");
const routes = require("./routes");

const app = express();

app.start = async () => {
  console.log("Starting Server...");
  const port = process.env.PORT;
  app.set("port", port);
  const server = http.createServer(app);
  app.use(routes);

  app.use((req, res) => {
    res.status(404).send({
      status: 404,
      message: "The requested resource was not found"
    });
  });

  app.use((err, req, res) => {
    console.error(err.stack);
    const message =
      process.env.NODE_ENV === "production"
        ? "Something went wrong, we're looking into it..."
        : err.stack;
    res.status(500).send({
      status: 500,
      message
    });
  });

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
  console.error(err);
});

module.exports = app;
