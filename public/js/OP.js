(function(){
  /*
   * OP codes
   */
  const ERROR = 'ERROR';
  const REGISTER = 'REGISTER';
  const REGISTERACK = 'REGISTERACK';
  const CHAT = 'CHAT';

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
   * the module
   */
  const OP = {
    create,
    parse,
    ERROR,
    REGISTER,
    REGISTERACK,
    CHAT,
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
