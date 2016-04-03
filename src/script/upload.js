module.exports = ( function() {

  'use strict';

  let post = require( './post' );

  let upload = function( _path, _files ) {
    post( {
      url: location.href.replace( /\/browser.*/, '/upload' ),
      data: {
        path: _path,
        files: _files
      },
      callback: function( _status, _data ) {
        if ( _status === 200 ) {
          if ( window.history.state.path === _path ) {
            browser( _path, true, true );
          }
        }
      }
    } );
  };

  return upload;

} )();
