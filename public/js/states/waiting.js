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
      WS.Client.addEventListener(WS.Event.open, this.onConnect.bind(this));
      WS.Client.addEventListener(WS.Event.error, error => {
        console.error(error);
        this.game.state.start( Game.States.Disconnected.STATE_KEY );
      });
      WS.Client.addEventListener(WS.Event.close, _ => {
        this.game.state.start( Game.States.Disconnected.STATE_KEY );
      });

    },
    onConnect : function(){
      this.game.state.start( Game.States.Registration.STATE_KEY );
    },
    update : () => {

    },
    shutdown : () => {

      Game.WS.Client.removeEventListener('open', this.onConnect);

    },
  });

})(window.Phaser, window.Game, window.Game.Configuration, window.Game.WS);

