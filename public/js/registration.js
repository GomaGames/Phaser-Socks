((Phaser, Game, CFG) => {
  // get or create Game module
  if( Game === undefined ){
    Game = window.Game = { States: {} };
  }

  Game.States.Registration = class{
    constructor(game, x, y){
      this.game = game;

    }
  };

})(window.Phaser, window.Game, window.Game.Configuration);
