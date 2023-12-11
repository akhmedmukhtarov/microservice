const amqp = require('amqplib');

async function sendRPCRequest(message) {
    console.log('Connecting to amqp');
    const connection = await amqp.connect('amqp://localhost');
    console.log('Creating channel');
    const channel = await connection.createChannel();

    const replyQueue = await channel.assertQueue('', { exclusive: true });
    const correlationId = generateUuid();

    const responsePromise = new Promise((resolve) => {
        channel.consume(
            replyQueue.queue,
            (msg) => {
                if (msg.properties.correlationId === correlationId) {
                    resolve(msg.content.toString());
                    connection.close();
                }
            },
            { noAck: true }
        );
    });
    console.log('Sending request to channel');
    channel.sendToQueue('rpc_queue', Buffer.from(message.toString()), {
        correlationId: correlationId,
        replyTo: replyQueue.queue,
    });

    return responsePromise;
}

function generateUuid() {
    return Math.random().toString() + Math.random().toString() + Math.random().toString();
}

module.exports = { sendRPCRequest };
