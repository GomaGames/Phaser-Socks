const express = require('express');
const app = express();

const { Server : WebSocketServer } = require('ws');
const server = require('http').createServer();
const wss = new WebSocketServer({ server });
const PORT = process.env.PORT || 3000;
const OP = require('./public/js/OP');

// "username" => client
const players = new Map();

app.use(express.static('./public'));

app.get('/api/hello', (req, res) => {
  const hello = 'world';
  res.json({ hello });
});

function clientHandleOp( msg ){
  let { username } = this;
  let error;

  switch( msg.OP ){
    case OP.REGISTER:
      error = `You are already registered as: '${this.username}'`;
      this.sendOp(OP.ERROR, { error });
      break;
    case OP.CHAT:
      let { message } = msg.payload;
      players.forEach( (player, playerUsername, map) => {
        player.sendOp(OP.CHAT, { username, message });
      });
      break;
    case OP.ENTER_WORLD:
      // give current player initial state of the game, no coords
      let playerUsernamesAvatars = [];
      for (let { username, avatarId } of players.values()) {
        playerUsernamesAvatars.push({username, avatarId});
      }
      this.sendOp(OP.ENTER_WORLD_ACK, playerUsernamesAvatars);

      // broadcast new player
      players.forEach( (player, playerUsername, map) => {
        if(player !== this){
          player.sendOp(OP.NEW_PLAYER, { username : this.username, avatarId : this.avatarId });
        }
      });
      break;
    case OP.MOVE_TO:
      let position = msg.payload;
      players.forEach( (player, playerUsername, map) => {
        if(player !== this){
          player.sendOp(OP.MOVE_TO, { username, position });
        }
      });
      break;
    case OP.STOP_MOVING:
      players.forEach( (player) => {
        if(player !== this){
          player.sendOp(OP.STOP_MOVING, msg.payload);
        }
      });
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
        this.avatarId = msg.payload.avatarId;
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
  const { username } = this;
  if( username !== null ){
    if( players.has(username) ){
      players.delete(username);
    }
  }
  console.info(`Client username:'${this.username}' has disconnected.`);

  // broadcast OP:REMOVE_PLAYER
  players.forEach( player => {
    player.sendOp(OP.REMOVE_PLAYER, { username });
  });
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
