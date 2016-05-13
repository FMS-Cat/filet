module.exports = ( function() {

  'use strict';

  let el = require( './el' );
  let post = require( './post' );

  let download = function( _path, _isDir ) {
    let url = location.href.replace( /\/browser.*/, '/download/' + _path );
    let path = _path.split( '/' );
    let filename = path[ path.length - 1 ] + ( _isDir ? '.zip' : '' );
    let anchor = el( {
      tag: 'a',
      href: url,
      download: filename
    } );
    anchor.click();
  };

  return download;

} )();
