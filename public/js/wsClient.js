((Phaser, Game, CFG, WebSocket, OP) => {
  // get or create Game module
  if( Game === undefined ){
    Game = window.Game = { States: {} };
  }

  const host = window.document.location.host;

  /*
   * Call Game.WS.Connect before using the client
   * listen to events that Client emits
   *   open
   *   close
   *   error
   *   message
   */
  Game.WS = {
    Client : null,
    Connect : _ => {
      Game.WS.Client = new WebSocket('ws://' + host);
    },
    Event : {
      open : 'open',
      close : 'close',
      error : 'error',
      message : 'message'
    },
    Send : {
      Register : (username, avatarId) => {
        Game.WS.Client.send( OP.create( OP.REGISTER, { username, avatarId } ) );
      },
      MoveTo : position => {
        Game.WS.Client.send( OP.create( OP.MOVE_TO, position ) );
      },
      EnterWorld : _ => {
        Game.WS.Client.send( OP.create( OP.ENTER_WORLD ) );
      },
      Chat : message => {
        Game.WS.Client.send( OP.create( OP.CHAT, { message } ) );
      },
    }
  };

})(window.Phaser, window.Game, window.Game.Configuration, window.WebSocket, window.OP);

