module.exports = ( function() {

  'use strict';

  let fs = require( 'fs' );

  let upload = function( _req, _res ) {

    let path = _req.body.path;
    if ( !path ) {
      _res.status( 400 ).send( 'file path is required' );
      return;
    }
    path = path.replace( /\.{2,}/, '.' );

    fs.stat( '.' + path, function( _error, _stat ) {
      if ( _error ) {
        if ( _error.code === 'ENOENT' ) {
          _res.status( 404 ).send( 'no such directory' );
        } else {
          _res.status( 500 ).send( 'something goes wrong' );
          console.error( _error );
        }
        return;
      }

      if ( !_stat.isDirectory() ) {
        _res.status( 400 ).send( 'you can only upload files to directory' );
        return;
      }

      let go = function() {
        if ( _req.files.length === 0 ) {
          _res.status( 200 ).send( 'done' );
          return;
        }

        let file = _req.files.shift();
        let name = file.originalname;
        let buffer = file.buffer;

        fs.writeFile( '.' + path + '/' + name, buffer, function( _error ) {
          if ( _error ) {
            _res.status( 500 ).send( 'something goes wrong' );
            console.error( _error );
            return;
          }

          go();
        } );
      };

      go();

    } );

  };

  return upload;

} )();
