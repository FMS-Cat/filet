module.exports = ( function() {

  'use strict';

  let property = function( _item ) {
    while ( container.firstChild ) {
      container.removeChild( container.firstChild );
    }

    let div = document.createElement( 'div' );
    container.appendChild( div );
    div.innerText = JSON.stringify( _item );

    let down = document.createElement( 'a' );
    container.appendChild( down );
    down.href = location.href.replace( /\/browser/, '/file' );
    down.innerText = 'download';
  };

  return property;

} )();
