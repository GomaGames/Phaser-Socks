const express = require('express');
const app = express();

const { Server : WebSocketServer } = require('ws');
const server = require('http').createServer();
const wss = new WebSocketServer({ server });
const PORT = process.env.PORT || 3000;
const OP = require('./OP');

// "username" => client
const players = new Map();

app.get('/api/hello', (req, res) => {
  const hello = 'world';
  res.json({ hello });
});

function clientHandleOp( msg ){
  let error;

  switch( msg.OP ){
    case OP.REGISTER:
      error = `You are already registered as: '${this.username}'`;
      this.sendOp(OP.ERROR, { error });
      break;
    case OP.CHAT:

      break;
    default:
      error = `Unknown OP received. Server does not understand: '${msg.OP}'`;
      console.warn(error);
      this.sendOp(OP.ERROR, { error });
      return;
  }
}

function clientReceiveMessage( message ){
  let msg;
  try{
    msg = OP.parse(message);
  }catch(error){
    console.error(error);
    return this.sendOp(OP.ERROR, { error });
  }

  // trap unregistered users
  if( this.username === null ){
    // wait for OP:REGISTER
    if( msg.OP === OP.REGISTER ){
      // add the player to players
      if( players.has(msg.payload.username) ){
        // player name is taken
        const error = `username: '${msg.payload.username}' is not available.`;
        this.sendOp(OP.ERROR, { error });
      } else {
        // username is available, register the player
        this.username = msg.payload.username;
        players.set(this.username, this);
        this.sendOp(OP.REGISTERACK);
      }
    } else {
      const error = `You are not registered yet. Register with OP:REGISTER first.`;
      this.sendOp(OP.ERROR, { error });
    }
    return; // trap
  }

  this.clientHandleOp(msg);
}

function clientDisconnect(){
  if( this.username !== null ){
    if( players.has(this.username) ){
      players.delete(this.username);
    }
  }
  console.info(`Client username:'${this.username}' has disconnected.`);
}

// handles errors
function sendOp(op, payload){
  this.send(OP.create(op, payload), error => {
    if( error !== undefined ){
      console.error(`Error writing to client socket`, error);
      clientDisconnect.call(this);
    }
  });
}

wss.on('connection', client => {
  client.username = null;
  client.sendOp = sendOp;
  client.clientHandleOp = clientHandleOp;

  client.on('message', clientReceiveMessage.bind(client));

  client.on('close', clientDisconnect.bind(client));

});

server.on('request', app);
server.listen(PORT, _ => console.log('Server Listening on ' + server.address().port) );
