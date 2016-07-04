let balloonContainer = document.createElement( 'div' );
container.appendChild( balloonContainer );
balloonContainer.id = 'balloonContainer';

let Balloon = class {
  constructor( _props ) {
    let it = this;

    it.element = document.createElement( 'div' );
    balloonContainer.appendChild( it.element );
    it.element.classList.add( 'balloon' );

    it.title = document.createElement( 'div' );
    it.element.appendChild( it.title );
    it.title.classList.add( 'title' );

    it.message = document.createElement( 'div' );
    it.element.appendChild( it.message );
    it.message.classList.add( 'message' );

    // ---

    it.id = +new Date();

    it.props = {
      title: '',
      message: '',
      classes: [],
      background: undefined,
      color: undefined,
      timeout: 0,
      hold: false
    };
    it.set( _props );

    // ---

    it.element.addEventListener( 'click', () => {
      if ( !it.props.hold ) {
        it.end();
      }
    } );
  }

  end() {
    let it = this;

    if ( it.element ) {
      it.element.classList.add( 'end' );
      it.element.addEventListener( 'animationend', () => {
        if ( it.element ) { it.remove(); }
      } );
    }
  }

  remove() {
    let it = this;

    balloonContainer.removeChild( it.element );
    it.element = null;
    it = null;
  }

  set( _props ) {
    let it = this;

    for ( let key in _props ) {
      it.props[ key ] = _props[ key ];
    }

    it.title.innerText = it.props.title;
    it.message.innerText = it.props.message;

    it.props.classes.map( ( _class ) => {
      it.element.classList.add( _class );
    } );

    if ( it.props.background ) {
      it.element.style.background = it.props.background;
    }

    if ( it.props.color ) {
      it.element.style.color = it.props.color;
    }

    if ( 0 < it.props.timeout ) {
      setTimeout( () => {
        it.end();
      }, it.props.timeout * 1000.0 );
    }
  }
};

export default Balloon;
