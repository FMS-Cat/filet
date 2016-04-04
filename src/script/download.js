module.exports = ( function() {

  'use strict';

  let el = require( './el' );
  let post = require( './post' );

  let download = function( _path, _isDir ) {
    post( {
      'url': location.href.replace( /\/browser.*/, '/download' ),
      'data': { 'path': _path },
      'responseType': 'blob',
      'callback': function( _status, _data ) {
        if ( _status === 200 ) {
          let url = window.URL.createObjectURL( _data );
          let path = _path.split( '/' );
          let name = path[ path.length - 1 ] + ( _isDir ? '.zip' : '' )
          let anchor = el( {
            tag: 'a',
            href: url,
            download: name
          } );
          anchor.click();
          window.URL.revokeObjectURL( url );
        }
      }
    } );
  };

  return download;

} )();
