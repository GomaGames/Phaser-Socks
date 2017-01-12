(( Phaser, Game, CFG ) => {
  Game.cursors = null;

  const preload = _ => {

  };

  const create = _ => {
    game.stage.backgroundColor = CFG.BG_COLOR;

    Game.cursors = game.input.keyboard.createCursorKeys();
  };

  const update = _ => {
  };

  const game = new Phaser.Game(CFG.STAGE_WIDTH, CFG.STAGE_HEIGHT, Phaser.AUTO, CFG.GAME_CONTAINER_ID, { preload, create, update });

})(window.Phaser, window.Game, window.Game.Configuration);
