// imports
const express = require("express");
const morgan = require("morgan");
const rabbitMQ = require("./lib/rabbitmq");

// init express app
const app = express();
let channel;

const connectRabbitMQ = async () => {
  try {
    channel = await rabbitMQ.connectToRabbitMQ();
  } catch (error) {
    console.error("Error starting application:", error);
    process.exit(1);
  }
};

// use morgan middleware
app.use(morgan("combined"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Billing service is live");
});

// ! INVENTORY CRUD OPERATIONS
app.get("/billing", (req, res) => {
  res.send("GET BILLING");
});

app.post("/billing", (req, res) => {
  rabbitMQ.sendMessageToQueue(channel, rabbitMQ.BILLING_QUEUE, req.body);
  res.send("POST BILLING");
});

app.put("/billing", (req, res) => {
  res.send("PUT BILLING");
});

app.delete("/billing", (req, res) => {
  res.send("DELETE BILLING");
});

app.listen(5001, () => {
  console.log('server started on port 5001');
});

process.on("SIGINT", async () => {
  try {
    await channel.close();
    console.log("RabbitMQ channel closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error closing RabbitMQ channel:", error);
    process.exit(1);
  }
});
