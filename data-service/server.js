
const rabbitMQ = require("./lib/rabbitmq");

let channel;

const subscribeUserQueue = async(res) => {
  console.log('==============User QUEUE============');
  console.log(res);
  console.log('====================================');
  rabbitMQ.sendMessageToQueue(channel, rabbitMQ.WEB_HOOK_QUEUE, res)
}

const subscribeShippingQueue = async(res) => {
  console.log('============Shipping QUEUE==========');
  console.log(res);
  console.log('====================================');
  rabbitMQ.sendMessageToQueue(channel, rabbitMQ.WEB_HOOK_QUEUE, res)

}

const subscribeBillingQueue = async(res) => {
  console.log('=============Billing QUEUE==========');
  console.log(res);
  console.log('====================================');
  rabbitMQ.sendMessageToQueue(channel, rabbitMQ.WEB_HOOK_QUEUE, res)
}

const connectRabbitMQ = async () => {
  try {
    channel = await rabbitMQ.connectToRabbitMQ();
    rabbitMQ.consumeFromQueue(channel, rabbitMQ.USER_QUEUE, subscribeUserQueue)
    rabbitMQ.consumeFromQueue(channel, rabbitMQ.SHIPPING_QUEUE, subscribeShippingQueue)
    rabbitMQ.consumeFromQueue(channel, rabbitMQ.BILLING_QUEUE, subscribeBillingQueue)
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
