((Phaser, Game, CFG, WebSocket, OP) => {
  // get or create Game module
  if( Game === undefined ){
    Game = window.Game = { States: {} };
  }

  const DEFAULT_SPEED = 400;
  const DEAD_SPEED = 150;

  const registeredPlayer = {
    username : null,
    avatarId : null,
  };

  Game.RegisterPlayer = (username, avatarId) => {
    registeredPlayer.username = username;
    registeredPlayer.avatarId = avatarId;
  };

  Game.Player = class{
    constructor(game, x, y){
      this.game = game;
      this.username = registeredPlayer.username;
      this.speed = DEFAULT_SPEED;
      this.destination = null;
      this.sprite = this.game.add.sprite(x, y, `graphic-${registeredPlayer.avatarId}`);
      this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

      this.sprite.update = this.update.bind(this);
    }
    moveTo({x, y}){
      // adjust coordinates to center player on point
      ( {x, y} = {x:x-this.sprite.width/2, y:y-this.sprite.width/2} );
      this.destination = {x, y};
      this.game.physics.arcade.moveToXY(this.sprite, x, y, this.speed);
    }
    update(){

      if( this.destination !== null ){
        var dist = this.game.physics.arcade.distanceToXY(this.sprite, this.destination.x, this.destination.y);

        if( dist > -10 && dist < 10 ) {
          this.sprite.body.velocity.x=0;
          this.sprite.body.velocity.y=0;
          this.destination = null;
        }

      }
    }
  };

})(window.Phaser, window.Game, window.Game.Configuration, window.WebSocket, window.OP);
