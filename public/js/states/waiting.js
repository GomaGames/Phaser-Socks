((Phaser, Game, CFG, WS) => {
  // get or create Game module
  if( Game === undefined ){
    Game = window.Game = { States: {} };
  }

  Game.States.Waiting = Object.assign( new Phaser.State(), {
    STATE_KEY : 'Waiting',
    preload : () => {

    },
    create : function(){

      this.game.add.text(240, 400, 'Connecting to server', { fill: '#232323' });

      WS.Connect();
      WS.Client.addEventListener(WS.Event.open, this.onClientConnect);
      WS.Client.addEventListener(WS.Event.error, this.onClientError);
      WS.Client.addEventListener(WS.Event.close, this.onClientClose);

    },
    onClientConnect : () => {
      Game.States.Waiting.game.state.start( Game.States.Registration.STATE_KEY );
    },
    onClientError : error => {
      console.error(error);
      Game.States.Waiting.game.state.start( Game.States.Disconnected.STATE_KEY );
    },
    onClientClose : () => {
      Game.States.Waiting.game.state.start( Game.States.Disconnected.STATE_KEY );
    },
    update : () => {

    },
    shutdown : () => {

      Game.WS.Client.removeEventListener(WS.Event.open, this.onClientConnect);
      Game.WS.Client.removeEventListener(WS.Event.error, this.onClientError);
      Game.WS.Client.removeEventListener(WS.Event.close, this.onClientClose);

    },
  });

})(window.Phaser, window.Game, window.Game.Configuration, window.Game.WS);

