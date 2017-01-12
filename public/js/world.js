((Phaser, Game, CFG) => {
  // get or create Game module
  if( Game === undefined ){
    Game = window.Game = { States: {} };
  }

  Game.States.World = class{
    constructor(game, x, y){
      this.game = game;

    }
  };

})(window.Phaser, window.Game, window.Game.Configuration);

