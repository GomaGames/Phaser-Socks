(Game => {
  // get or create our Game module
  if( Game === undefined ){
    Game = window.Game = { States : {} };
  }

  const STAGE_WIDTH = 1024;
  const STAGE_HEIGHT = 768;

  Game.Configuration = {
    GAME_CONTAINER_ID : 'game-container',
    BG_COLOR : '#129F56',
    STAGE_WIDTH,
    STAGE_HEIGHT,
    GAME_WIDTH : STAGE_WIDTH,
    GAME_HEIGHT : STAGE_HEIGHT,
    CAMERA_LERP : 0.25,
    CHAT_DURATION : 3000
  };

})(window.Game);
