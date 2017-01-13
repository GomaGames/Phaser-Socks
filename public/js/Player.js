((Phaser, Game, CFG, WS, OP) => {
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
    constructor(game, x, y, currentPlayer, { username, avatarId } = {}){
      this.game = game;
      this.username = currentPlayer ? registeredPlayer.username : username;
      this.avatarId = currentPlayer ? registeredPlayer.avatarId : avatarId;
      this.currentPlayer = currentPlayer;
      this.speed = DEFAULT_SPEED;
      this.destination = null;
      this.sprite = this.game.add.sprite(x, y, `person-${this.avatarId}`);
      this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
      this.usernameText = new Phaser.Text(this.game, -10, -16, this.username, { fontSize:'14px', fill: '#F0F3F0', boundsAlignH : 'center', boundsAlignV : 'center' });
      this.chatText = new Phaser.Text(this.game, -50, 36, '', { fontSize:'16px', fill: '#F0F0F9', fontWeight: 'normal', boundsAlignH : 'center', boundsAlignV : 'center' });
      this.usernameText.setTextBounds(-20, -12, 130, 12);
      this.chatText.setTextBounds(-80, 40, 330, 36);
      this.sprite.addChild(this.usernameText);
      this.sprite.addChild(this.chatText);

      this.sprite.update = this.update.bind(this);
    }
    moveTo({x, y}){
      if(this.currentPlayer){
        WS.Send.MoveTo({x, y});
      }

      // adjust coordinates to center player on point
      ( {x, y} = {x:x-this.sprite.width/2, y:y-this.sprite.width/2} );
      this.destination = {x, y};
      this.game.physics.arcade.moveToXY(this.sprite, x, y, this.speed);

    }
    chat(message){
      this.chatText.text = message;
      const timer = this.game.time.create();
      timer.add(CFG.CHAT_DURATION, function(){
        this.chatText.text = '';
      }, this);
      timer.start();
    }
    stopMoving(){
      this.sprite.body.velocity.x=0;
      this.sprite.body.velocity.y=0;
      this.destination = null;
    }
    update(){

      if( this.destination !== null ){
        var dist = this.game.physics.arcade.distanceToXY(this.sprite, this.destination.x, this.destination.y);

        if( dist > -10 && dist < 10 ) {
          this.stopMoving();
        }

      }
    }
  };

})(window.Phaser, window.Game, window.Game.Configuration, window.Game.WS, window.OP);
