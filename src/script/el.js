module.exports = ( function() {

  'use strict';

  let el = function( _props ) {

    let element = document.createElement( _props.tag );
    delete _props.tag;

    if ( _props.parent ) {
      _props.parent.appendChild( element );
    }
    delete _props.parent;

    if ( _props.class ) {
      if ( Array.isArray( _props.class ) ) {
        _props.class.map( function( _cl ) {
          element.classList.add( _cl );
        } );
      } else {
        element.classList.add( _props.class );
      }
    }
    delete _props.class;

    if ( _props.style ) {
      for ( let attr in _props.style ) {
        element.style[ attr ] = _props.style[ attr ];
      }
    }
    delete _props.style;

    for ( let key in _props ) {
      element[ key ] = _props[ key ];
    }

    return element;

  };

  return el;

} )();
