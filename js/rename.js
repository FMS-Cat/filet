module.exports = ( function() {

  'use strict';

  let fs = require( 'fs' );
  let pathlib = require( 'path' );
  let recursiveUnlink = require( './recursive-unlink' );

  let unlink = function( _req, _res ) {

    let path = _req.body.path;
    if ( !path ) {
      _res.status( 400 ).send( 'file path is required' );
      return;
    }
    path = pathlib.join( process.cwd(), path );
    if ( /^\.\.\//.test( pathlib.relative( process.cwd(), path ) ) ) {
      _res.status( 400 ).send( 'invalid path' );
      return;
    }

    fs.stat( path, function( _error, _stat ) {
      if ( _error ) {
        if ( _error.code === 'ENOENT' ) {
          _res.status( 400 ).send( 'no such file or directory' );
        } else {
          _res.status( 500 ).send( 'something went wrong' );
          console.error( _error );
        }
        return;
      }

      let name = _req.body.name;
      if ( !name ) {
        _res.status( 400 ).send( 'new name is required' );
        return;
      }

      fs.rename( path, pathlib.join( path, '..', name ), function( _error ) {
        if ( _error ) {
          _res.status( 500 ).send( 'something went wrong' );
          console.error( _error );
          return;
        }
        _res.status( 200 ).send();
      } );

    } );

  };

  return unlink;

} )();
