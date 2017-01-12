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
    STAGE_WIDTH : 1024,
    STAGE_HEIGHT : 768,
    GAME_WIDTH : 2048,
    GAME_HEIGHT : 2048,
    CAMERA_LERP : 0.25,
    ASSETS : {
      GFX : 'GFX',
    }
  };

})(window.Game);
