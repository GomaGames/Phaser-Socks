(( Phaser, Game, CFG ) => {
  Game.cursors = null;

  const preload = _ => {

  };

  const create = _ => {
    game.stage.backgroundColor = CFG.BG_COLOR;

    Game.cursors = game.input.keyboard.createCursorKeys();

    game.state.add( Game.States.Registration.STATE_KEY, Game.States.Registration );
    game.state.add( Game.States.World.STATE_KEY, Game.States.World );
    game.state.add( Game.States.Waiting.STATE_KEY, Game.States.Waiting );
    game.state.add( Game.States.Disconnected.STATE_KEY, Game.States.Disconnected );

    game.state.start( Game.States.Waiting.STATE_KEY );

  };

  const update = _ => {
  };

  const game = new Phaser.Game(CFG.STAGE_WIDTH, CFG.STAGE_HEIGHT, Phaser.AUTO, CFG.GAME_CONTAINER_ID, { preload, create, update }, false, false);

})(window.Phaser, window.Game, window.Game.Configuration);
