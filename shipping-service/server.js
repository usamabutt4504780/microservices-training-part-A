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
  res.send("Shipping service is live");
});

// ! SHIPPING OPERATIONS
app.get("/shipping", (req, res) => {
  res.send("GET SHIPPING");
});

app.post("/shipping", async(req, res) => {
  rabbitMQ.sendMessageToQueue(channel, rabbitMQ.SHIPPING_QUEUE, req.body);
  res.send("POST SHIPPING");
});

app.put("/shipping", (req, res) => {
  res.send("PUT SHIPPING");
});

app.delete("/shipping", (req, res) => {
  res.send("DELETE SHIPPING");
});

app.listen(5009, () => {
  console.log('server started on port 5009');
  connectRabbitMQ();
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
