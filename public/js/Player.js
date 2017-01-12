((Phaser, Game, CFG, WebSocket, OP) => {
  // get or create Game module
  if( Game === undefined ){
    Game = window.Game = { States: {} };
  }

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
      this.sprite = this.game.add.sprite(x, y, `graphic-${registeredPlayer.avatarId}`);
    }
  };

})(window.Phaser, window.Game, window.Game.Configuration, window.WebSocket, window.OP);


