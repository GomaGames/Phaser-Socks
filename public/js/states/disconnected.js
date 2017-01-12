((Phaser, Game, CFG, WS) => {
  // get or create Game module
  if( Game === undefined ){
    Game = window.Game = { States: {} };
  }

  Game.States.Disconnected = Object.assign( new Phaser.State(), {
    STATE_KEY : 'Disconnected',
    preload : () => {

    },
    create : function(){

      this.game.add.text(240, 400, 'You have been disconnected.', { fill: '#232323' });

    },
    update : () => {

    },
    shutdown : () => {

    },
  });

})(window.Phaser, window.Game, window.Game.Configuration, window.Game.WS);
