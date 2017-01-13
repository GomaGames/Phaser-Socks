((Phaser, Game, CFG) => {
  // get or create Game module
  if( Game === undefined ){
    Game = window.Game = { States: {} };
  }

  Game.States.World = Object.assign( new Phaser.State(), {
    STATE_KEY : 'World',
    preload : function() {
      const assets = [
        'game_wall',
        'graphic-02',
        'graphic-03',
        'graphic-04',
        'graphic-05',
        'graphic-06',
        'graphic-07',
        'graphic-08',
        'graphic-09',
        'graphic-10',
        'graphic-25',
        'graphic-26',
        'graphic-30',
        'graphic-33',
        'graphic-34',
        'graphic-38',
        'graphic-39'
      ];
      this.game.load.path = 'assets/';
      this.game.load.images(assets);
    },
    create : function() {

      this.player = new Game.Player(this.game, Math.random()*CFG.GAME_WIDTH, Math.random()*CFG.GAME_HEIGHT);

      this.game.input.onTap.add((e) => {
        this.player.moveTo(this.input.activePointer);
      });

    },
    update : () => {

    },
    shutdown : () => {

    },
  });

})(window.Phaser, window.Game, window.Game.Configuration);

