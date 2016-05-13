module.exports = ( function() {

  'use strict';

  let post = require( './post' );

  let rename = function( _path, _name ) {
    post( {
      'url': location.href.replace( /\/browser.*/, '/rename' ),
      'data': { 'path': _path, 'name': _name },
      'callback': function( _status, _data ) {
        if ( _status === 200 ) {
          browser( null, true, true );
        }
      }
    } );
  };

  return rename;

} )();
