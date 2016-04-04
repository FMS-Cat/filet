module.exports = ( function() {

  'use strict';

  let fs = require( 'fs' );
  let pathlib = require( 'path' );

  let list = function( _req, _res ) {

    let dirPath = _req.body.path;
    if ( !dirPath ) {
      _res.status( 400 ).send( 'file path is required' );
      return;
    }
    dirPath = dirPath.replace( /\.{2,}/, '.' );

    let ret = {};
    ret.items = [];

    ret.path = dirPath;

    fs.readdir( pathlib.join( process.cwd(), dirPath ), function( _error, _files ) {
      if ( _error ) {
        _res.status( 500 ).send( 'something goes wrong' );
        console.error( _error );
        return;
      }

      _files.map( function( _file ) {
        let filePath = pathlib.join( dirPath, _file );
        let fileStat = fs.statSync( pathlib.join( process.cwd(), filePath ) );

        let dir = 0;
        if ( fileStat.isDirectory() ) {
          dir = 1;
        }

        ret.items.push( {
          name: pathlib.basename( filePath ),
          path: dirPath,
          dir: dir,
          stats: fileStat
        } );
      } );

      _res.send( JSON.stringify( ret ) );
    } );

  };

  return list;

} )();
