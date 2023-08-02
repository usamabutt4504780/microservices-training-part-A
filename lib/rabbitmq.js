const amqplib = require('amqplib');

const USER_QUEUE = 'user-queue'
const SHIPPING_QUEUE = 'shipping-queue'
const BILLING_QUEUE = 'billing-queue'
const WEB_HOOK_QUEUE = 'web-hook-queue'

const connectToRabbitMQ = async () => {
  try {
    const username = 'admin';
    const password = 'admin';
    const connectionUrl = `amqp://${username}:${password}@rabbitmq-service`;
    const connection = await amqplib.connect(connectionUrl);
    const channel = await connection.createChannel();
    console.log('Connected to RabbitMQ successfully.');
    return channel;
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    throw error;
  }
};

const sendMessageToQueue = async (channel, queueName, message) => {
  try {
    await channel.assertQueue(queueName, { durable: false });
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    console.log('Message sent to RabbitMQ:', message);
  } catch (error) {
    console.error('Error sending message to RabbitMQ:', error);
    throw error;
  }
};

const consumeFromQueue = async (channel, queueName, callback) => {
  try {
    await channel.assertQueue(queueName, { durable: false });
    channel.consume(queueName, (message) => {
      if (message) {
        const data = JSON.parse(message.content);
        console.log('Received:', data);
        channel.ack(message);
        if (callback) {
          callback(data);
        }
      } else {
        console.log('Consumer cancelled by server');
      }
    });
  } catch (error) {
    console.error('Error consuming messages from RabbitMQ:', error);
    throw error;
  }
};

module.exports = {
  connectToRabbitMQ,
  sendMessageToQueue,
  consumeFromQueue,
  USER_QUEUE,
  SHIPPING_QUEUE,
  BILLING_QUEUE,
  WEB_HOOK_QUEUE,
};
