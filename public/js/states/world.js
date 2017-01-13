((Phaser, Game, CFG, WS, OP, document) => {
  // get or create Game module
  if( Game === undefined ){
    Game = window.Game = { States: {} };
  }

  const { createElement } = Game.Utils;

  const RED_SIDE_SIZE = 400;
  const BLUE_SIDE_SIZE = 400;

  let formContainer;
  let chatMessageInput;

  Game.playersGroup = null;

  Game.States.World = Object.assign( new Phaser.State(), {
    STATE_KEY : 'World',
    preload : function() {
      const assets = [
        'bg',
        'game_wall',
        'person-01',
        'person-02',
        'person-03',
        'person-04',
        'person-05',
        'person-06',
        'person-07',
        'person-08',
        'person-09',
        'person-10',
        'person-11',
        'person-12',
        'person-13',
        'person-14',
        'person-15',
        'person-16',
        'person-17',
        'person-18',
        'person-19',
        'person-20',
        'person-21',
        'person-22'
      ];
      this.game.load.path = 'assets/';
      this.game.load.images(assets);
    },
    create : function() {
      this.game.add.image(0,0, 'bg');

      Game.playersGroup = this.game.add.group();

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

      /*
       * Setup DOM controls for user input
       */
      formContainer = createElement('div', { 'class' : 'chat-form-container'});
      const form = createElement('form', { 'class' : 'chat-form'});
      const field1Container = createElement('div', { 'class' : 'chat-form-message-container'});
      chatMessageInput = createElement('input', { type : 'text', placeholder : 'Say something to room...'});
      const submitBtn = createElement('button', { type : 'submit'}, 'Send');

      field1Container.appendChild(chatMessageInput);
      form.appendChild(field1Container);
      form.appendChild(submitBtn);
      formContainer.appendChild(form);
      document.body.insertBefore(formContainer, document.getElementById(CFG.GAME_CONTAINER_ID));
      form.addEventListener('submit', this.chatFormSubmit.bind(this));
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
          Game.playersGroup.add(this.players.get(player.username).sprite);
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
      Game.playersGroup.add(this.players.get(username).sprite);
    },
    removePlayer : function({ username }){
      this.players.get(username).sprite.destroy();
      this.players.delete(username);
    },
    playerMove : function({ username, position  }) {
      this.players.get(username).moveTo(position);
    },
    playerChat : function({ username, message }) {
      if(username === this.player.username){
        this.player.chat(message);
      }else{
        this.players.get(username).chat(message);
      }
    },
    chatFormSubmit : function(event){
      event.preventDefault();

      WS.Send.Chat(chatMessageInput.value);

      chatMessageInput.value = '';
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
        case OP.CHAT:
          Game.States.World.playerChat(msg.payload);
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
      Game.playersGroup.destroy();
      WS.Client.removeEventListener(WS.Event.message, this.onClientMessage);
      WS.Client.removeEventListener(WS.Event.open, this.onClientConnect);
      WS.Client.removeEventListener(WS.Event.error, this.onClientError);
      WS.Client.removeEventListener(WS.Event.close, this.onClientClose);
      document.body.removeChild(formContainer);
    },
  });

})(window.Phaser, window.Game, window.Game.Configuration, window.Game.WS, window.OP, window.document);

