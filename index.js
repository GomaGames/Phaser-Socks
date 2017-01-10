const express = require('express');
const app = express();

const { Server : WebSocketServer } = require('ws');
const server = require('http').createServer();
const wss = new WebSocketServer({ server });
const PORT = process.env.PORT || 3000;

app.get('/api/hello', (req, res) => {
  const hello = 'world';
  res.json({ hello });
});

wss.on('connection', client => {

  client.on('message', message  => {
    console.log('received: %s', message);
  });

  client.send('connected to ws server');
});

server.on('request', app);
server.listen(PORT, _ => console.log('Server Listening on ' + server.address().port) );
