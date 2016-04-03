module.exports = ( function() {

  'use strict';

  let fs = require( 'fs' );

  let property = function( _req, _res ) {

    let path = _req.body.path;
    if ( !path ) {
      _res.status( 400 ).send( 'file path is required' );
      return;
    }
    path = path.replace( /\.{2,}/, '.' );

    let ret = {};

    fs.stat( '.' + path, function( _error, _stat ) {
      if ( _error ) {
        if ( _error.code === 'ENOENT' ) {
          _res.status( 404 ).send( 'no such file or directory' );
        } else {
          _res.status( 500 ).send( 'something goes wrong' );
          console.error( _error );
        }
        return;
      }

      _res.send( JSON.stringify( _stat ) );
    } );

  };

  return property;

} )();
