((Phaser, Game, CFG, WS, OP, document) => {
  // get or create Game module
  if( Game === undefined ){
    Game = window.Game = { States: {} };
  }

  const { createElement } = Game.Utils;

  let formContainer;

  Game.States.Registration = Object.assign( new Phaser.State(), {
    STATE_KEY : 'Registration',
    preload : () => {

    },
    create : function(){

      WS.Client.addEventListener(WS.Event.message, this.onClientMessage);
      WS.Client.addEventListener(WS.Event.open, this.onClientConnect);
      WS.Client.addEventListener(WS.Event.error, this.onClientError);
      WS.Client.addEventListener(WS.Event.close, this.onClientClose);

      // create a form using DOM to capture user input
      formContainer = createElement('div', { 'class' : 'registration-form-container'});
      const form = createElement('form', { 'class' : 'registration-form'});
      const field1Container = createElement('div', { 'class' : 'registration-form-username-container'});
      const field1Input = createElement('input', { type : 'text', placeholder : 'username'});
      const field2Container = createElement('div', { 'class' : 'registration-form-avatar-container'});
      const submitBtn = createElement('button', { type : 'submit'}, 'Enter the Game');

      [ '01','02','03','04','05','06','07','08','09','10',
        '11','12','13','14','15','16','17','18','19','20','21','22' ].map( value => {
        const avatarRadioLabel = createElement('label', { for : `avatar-${value}` });
        const avatarRadio = createElement('input', { type : 'radio', id : `avatar-${value}`, name : 'avatar', value });
        const avatarRadioThumb = createElement('img', { src : `assets/person-${value}.png` });
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

        // validate username
        if(field1Input.value.length === 0){
          window.alert('You must enter a username');
          return;
        }

        const chosenAvatar = Array.from(document.getElementsByName("avatar")).find(r => r.checked);
        if(chosenAvatar === undefined){
          window.alert('You must choose an avatar');
          return;
        }

        this.register(field1Input.value, chosenAvatar.value);
      });
    },
    register : (username, avatarId) => {

      WS.Send.Register(username, avatarId);
      Game.RegisterPlayer(username, avatarId);

    },
    registerSuccess : _ => {
      Game.States.Registration.game.state.start( Game.States.World.STATE_KEY );
    },
    onClientMessage : ({ data }) => {
      const msg = OP.parse(data);
      if( msg.OP === OP.REGISTERACK ){
        Game.States.Registration.registerSuccess();
      } else if(msg.OP === OP.ERROR){
        // # TODO display error to user
        console.error(msg.payload);
      } else {
        console.error(msg.payload);
      }
    },
    onClientConnect : () => {
      Game.States.Registration.game.state.start( Game.States.Registration.STATE_KEY );
    },
    onClientError : error => {
      console.error(error);
      Game.States.Registration.game.state.start( Game.States.Disconnected.STATE_KEY );
    },
    onClientClose : () => {
      Game.States.Registration.game.state.start( Game.States.Disconnected.STATE_KEY );
    },
    shutdown : function(){
      document.body.removeChild(formContainer);
      WS.Client.removeEventListener(WS.Event.message, this.onClientMessage);
      WS.Client.removeEventListener(WS.Event.open, this.onClientConnect);
      WS.Client.removeEventListener(WS.Event.error, this.onClientError);
      WS.Client.removeEventListener(WS.Event.close, this.onClientClose);
    },
  });

})(window.Phaser, window.Game, window.Game.Configuration, window.Game.WS, window.OP,  window.document);
