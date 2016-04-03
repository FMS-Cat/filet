module.exports = ( function() {

  'use strict';

  let post = require( './post' );

  let unlink = function( _item ) {
    post( {
      'url': location.href.replace( /\/browser.*/, '/unlink' ),
      'data': { 'path': _item.path + '/' + _item.name },
      'callback': function( _status ) {
        if ( _status === 200 ) {
          if ( window.history.state.path === _item.path ) {
            browser( _item.path, true, true );
          }
        }
      }
    } );
  };

  return unlink;

} )();
