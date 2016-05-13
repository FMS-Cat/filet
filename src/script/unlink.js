module.exports = ( function() {

  'use strict';

  let post = require( './post' );

  let unlink = function( _path ) {
    post( {
      'url': location.href.replace( /\/browser.*/, '/unlink' ),
      'data': { 'path': _path },
      'callback': function( _status ) {
        if ( _status === 200 ) {
          browser( null, true, true );
        }
      }
    } );
  };

  return unlink;

} )();
