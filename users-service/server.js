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
  res.send("User service is live");
});

// ! USERS CRUD OPERATIONS
app.get("/users", (req, res) => {
  res.send("GET USERS");
});

app.post("/users", (req, res) => {
  res.send("POST USERS");
  rabbitMQ.sendMessageToQueue(channel, rabbitMQ.USER_QUEUE, req.body);
});

app.put("/users", (req, res) => {
  res.send("PUT USERS");
});

app.delete("/users", (req, res) => {
  res.send("DELETE USERS");
});

app.listen(5000, () => {
  console.log("server started on port 5000");
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
