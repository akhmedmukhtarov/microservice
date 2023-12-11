const amqp = require('amqplib');

async function startRPCResponder() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
  
    console.log("Declaring rpc queue");
    await channel.assertQueue('rpc_queue');
  
  
    channel.consume('rpc_queue', (msg) => {
      const message = msg.content.toString();
      console.log('RPC Request Received:', message);
  
  
      console.log("Processing request...");
      const now = Date.now();
      while(Date.now() - now < 5000){}
      const response = 2 * (+message)
  
      console.log("RPC Response:", response);
      console.log("Sending respone");
      channel.sendToQueue(msg.properties.replyTo, Buffer.from(String(response)), {
        correlationId: msg.properties.correlationId,
      });
  
      channel.ack(msg);
    });
  
    console.log('RPC Responder Service is listening for messages from RabbitMQ.');
  }

  module.exports = {startRPCResponder}