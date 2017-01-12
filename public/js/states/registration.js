((Phaser, Game, CFG) => {
  // get or create Game module
  if( Game === undefined ){
    Game = window.Game = { States: {} };
  }

  Game.States.Registration = Object.assign( new Phaser.State(), {
    STATE_KEY : 'Registration',
    preload : () => {

    },
    create : () => {

    },
    update : () => {

    },
    shutdown : () => {

    },
  });

})(window.Phaser, window.Game, window.Game.Configuration);
