(function(){

  /*
   * Helper methods
   */
  const parse = message => {
    let parsedMessage = JSON.parse(message);
    if( !parsedMessage.hasOwnProperty('OP') ){
      throw new Error('Improperly formatted OP message.');
    }
    return parsedMessage;
  };

  const create = (OP, payload) => JSON.stringify({
    OP,
    payload,
  });

  /*
   * OP codes
   */
  const ERROR = 'ERROR';
  const REGISTER = 'REGISTER';
  const REGISTERACK = 'REGISTERACK';
  const ENTER_WORLD = 'ENTER_WORLD';
  const ENTER_WORLD_ACK = 'ENTER_WORLD_ACK';
  const NEW_PLAYER = 'NEW_PLAYER';
  const REMOVE_PLAYER = 'REMOVE_PLAYER';
  const CHAT = 'CHAT';
  const MOVE_TO = 'MOVE_TO';

  /*
   * the module
   */
  const OP = {
    create,
    parse,
    ERROR,
    REGISTER,
    REGISTERACK,
    ENTER_WORLD,
    ENTER_WORLD_ACK,
    NEW_PLAYER,
    REMOVE_PLAYER,
    CHAT,
    MOVE_TO,
  };

  /* Make this module available to Node and Browser */
  const root = this;
  if( typeof exports !== 'undefined' ) {
    if( typeof module !== 'undefined' && module.exports ) {
      exports = module.exports = OP;
    }
    exports.OP = OP;
  }
  else {
    root.OP = OP;
  }

}).call(this);
