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
  };

})(window.Phaser, window.Game, window.Game.Configuration, window.WebSocket, window.OP);


