const ERROR = 'ERROR';
const REGISTER = 'REGISTER';
const REGISTERACK = 'REGISTERACK';
const CHAT = 'CHAT';

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

module.exports = {
  create,
  parse,
  ERROR,
  REGISTER,
  REGISTERACK,
  CHAT,
};
