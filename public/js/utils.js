((Phaser, Game, document) => {
  // get or create Game module
  if( Game === undefined ){
    Game = window.Game = { States: {} };
  }

  const createElement = (name, attrs, innerText = null) => {
    let newElement = document.createElement(name);
    Object.keys(attrs).forEach( attr => {
      newElement.setAttribute(attr, attrs[attr]);
    });
    if(innerText !== null){
      newElement.appendChild(document.createTextNode(innerText));
    }
    return newElement;
  };

  Game.Utils = {
    createElement
  };

})(window.Phaser, window.Game, window.document);

