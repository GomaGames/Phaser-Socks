((Phaser, Game, CFG, document) => {
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

  let formContainer;

  Game.States.Registration = Object.assign( new Phaser.State(), {
    STATE_KEY : 'Registration',
    preload : () => {

    },
    create : () => {

      // create a form using DOM to capture user input
      formContainer = createElement('div', { 'class' : 'registration-form-container'});
      const form = createElement('form', { 'class' : 'registration-form'});
      const field1Container = createElement('div', { 'class' : 'registration-form-username-container'});
      const field1Input = createElement('input', { type : 'text', placeholder : 'username'});
      const field2Container = createElement('div', { 'class' : 'registration-form-avatar-container'});
      const submitBtn = createElement('button', { type : 'submit'}, 'Enter the Game');

      [ '02','03','04','05','06','07','08','09','10','30','34','25','26','34' ].map( value => {
        const avatarRadioLabel = createElement('label', { for : `avatar-${value}` });
        const avatarRadio = createElement('input', { type : 'radio', id : `avatar-${value}`, name : 'avatar', value });
        const avatarRadioThumb = createElement('img', { src : `assets/graphic-${value}.png` });
        avatarRadioLabel.appendChild(avatarRadio);
        avatarRadioLabel.appendChild(avatarRadioThumb);
        return avatarRadioLabel;
      }).forEach( field2Container.appendChild.bind(field2Container) );


      field1Container.appendChild(field1Input);
      form.appendChild(field1Container);
      form.appendChild(field2Container);
      form.appendChild(submitBtn);
      formContainer.appendChild(form);
      document.body.appendChild(formContainer);

      form.addEventListener('submit', event => {
        event.preventDefault();
        field1Input.value()
      });
    },
    update : () => {

    },
    shutdown : () => {
      document.body.removeChild(formContainer);
    },
  });

})(window.Phaser, window.Game, window.Game.Configuration, window.document);
