
const rabbitMQ = require("./lib/rabbitmq");

let channel;

const webHookSubscriber = async(res) => {
  console.log('==============Web Hook Queue============');
  console.log(res);
  console.log('====================================');
}


const connectRabbitMQ = async () => {
  try {
    channel = await rabbitMQ.connectToRabbitMQ();
    rabbitMQ.consumeFromQueue(channel, rabbitMQ.WEB_HOOK_QUEUE, webHookSubscriber)
  } catch (error) {
    console.error("Error starting application:", error);
    process.exit(1);
  }
};

connectRabbitMQ();

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
