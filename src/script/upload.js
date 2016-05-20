'use strict';

let el = require( './el' );
let Balloon = require( './balloon' );

let post = require( './post' );

module.exports = function upload( _path, _files ) {
  let balloon = new Balloon( {
    title: 'Uploading',
    message: 'Progress: calculating'
  } );

  post( {
    url: location.href.replace( /\/browser.*/, '/upload' ),
    data: {
      path: _path,
      files: _files
    },
    uploadProgress: function( _event ) {
      if ( _event.lengthComputable ) {
        let prog = ( _event.loaded / _event.total * 100.0 ).toFixed( 1 );
        balloon.set( {
          message: 'Progress: ' + prog + ' %',
          background: '#08d'
        } );
      }
    },
    callback: function( _status, _data ) {
      if ( _status === 200 ) {
        if ( window.history.state.path === _path ) {
          balloon.set( {
            title: 'Done!',
            message: 'Progress: 100.0 %',
            background: '#1c7',
            timeout: 1
          } );
          browser( null, true, true );
        }
      }
    }
  } );
};
