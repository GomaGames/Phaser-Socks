((Phaser, Game, CFG, WS, OP) => {
  // get or create Game module
  if( Game === undefined ){
    Game = window.Game = { States: {} };
  }

  const RED_SIDE_SIZE = 400;
  const BLUE_SIDE_SIZE = 400;

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

      this.players = new Map(); // other players
      this.player = new Game.Player(this.game,
        RED_SIDE_SIZE + (Math.random()*CFG.GAME_WIDTH-RED_SIDE_SIZE-BLUE_SIDE_SIZE),
        Math.random()*CFG.GAME_HEIGHT,
        true);

      this.game.input.onTap.add((e) => {
        this.player.moveTo(this.input.activePointer);
      });

      WS.Client.addEventListener(WS.Event.message, this.onClientMessage);
      WS.Client.addEventListener(WS.Event.open, this.onClientConnect);
      WS.Client.addEventListener(WS.Event.error, this.onClientError);
      WS.Client.addEventListener(WS.Event.close, this.onClientClose);
      WS.Send.EnterWorld();
    },
    enter : function(playerUsernamesAvatars){
      playerUsernamesAvatars
        .filter( player => player.username !== this.player.username )
        .forEach( player => {
          // stick them somewhere in the middle
          this.players.set(player.username,
            new Game.Player(
              this.game,
              RED_SIDE_SIZE + (Math.random()*CFG.GAME_WIDTH-RED_SIDE_SIZE-BLUE_SIDE_SIZE),
              Math.random()*CFG.GAME_HEIGHT,
              false,
              player
            )
          );
        });
    },
    newPlayer : function({ username, avatarId }){
      // stick them somewhere in the middle
      this.players.set(username,
        new Game.Player(
          this.game,
          RED_SIDE_SIZE + (Math.random()*CFG.GAME_WIDTH-RED_SIDE_SIZE-BLUE_SIDE_SIZE),
          Math.random()*CFG.GAME_HEIGHT,
          false,
          { username, avatarId }
        )
      );
    },
    removePlayer : function({ username }){
      this.players.get(username).sprite.destroy();
      this.players.delete(username);
    },
    playerMove : function({ username, position  }) {
      this.players.get(username).moveTo(position);
    },
    onClientMessage : ({ data }) => {
      const msg = OP.parse(data);
      switch( msg.OP ){
        case OP.ENTER_WORLD_ACK:
          Game.States.World.enter(msg.payload);
          break;
        case OP.NEW_PLAYER:
          Game.States.World.newPlayer(msg.payload);
          break;
        case OP.REMOVE_PLAYER:
          Game.States.World.removePlayer(msg.payload);
          break;
        case OP.MOVE_TO:
          Game.States.World.playerMove(msg.payload);
          break;
        case OP.ERROR:
          // # TODO display error to user
          console.error(msg.payload);
          break;
        default:
          console.error(msg.payload);
      }
    },
    onClientConnect : () => {
      Game.States.World.game.state.start( Game.States.World.STATE_KEY );
    },
    onClientError : error => {
      console.error(error);
      Game.States.World.game.state.start( Game.States.Disconnected.STATE_KEY );
    },
    onClientClose : () => {
      Game.States.World.game.state.start( Game.States.Disconnected.STATE_KEY );
    },
    update : function(){

    },
    shutdown : function(){
      WS.Client.removeEventListener(WS.Event.message, this.onClientMessage);
      WS.Client.removeEventListener(WS.Event.open, this.onClientConnect);
      WS.Client.removeEventListener(WS.Event.error, this.onClientError);
      WS.Client.removeEventListener(WS.Event.close, this.onClientClose);
    },
  });

})(window.Phaser, window.Game, window.Game.Configuration, window.Game.WS, window.OP);

