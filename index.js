// app.js
const express = require('express');
const bodyParser = require('body-parser');
const { sendRPCRequest } = require('./rpc_sender');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/api/double', async (req, res) => {
  try {
    const requestMessage = req.body.message;
    console.log("POST request with body message" + requestMessage );
    console.log("Sending request to queue");
    const response = await sendRPCRequest(requestMessage);
    
    res.json({ response: +response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`HTTP Server listening at http://localhost:${port}`);
});
