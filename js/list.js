module.exports = ( function() {

  'use strict';

  let fs = require( 'fs' );
  let pathlib = require( 'path' );

  let list = function( _req, _res ) {

    let pathO = decodeURI( _req.url.replace( /\/list(.*)/, '$1' ) );
    let path = pathlib.join( process.cwd(), pathO );
    if ( /^\.\.\//.test( pathlib.relative( process.cwd(), path ) ) ) {
      _res.status( 400 ).send( 'invalid path' );
      return;
    }

    let ret = {};
    ret.items = [];

    ret.path = pathO;

    fs.readdir( path, function( _error, _files ) {
      if ( _error ) {
        _res.status( 500 ).send( 'something went wrong' );
        console.error( _error );
        return;
      }

      _files.map( function( _file ) {
        let filePath = pathlib.join( pathO, _file );
        let fileStat = fs.statSync( pathlib.join( process.cwd(), filePath ) );

        let dir = 0;
        if ( fileStat.isDirectory() ) {
          dir = 1;
        }

        ret.items.push( {
          name: pathlib.basename( filePath ),
          path: pathO,
          dir: dir,
          stats: fileStat
        } );
      } );

      _res.send( JSON.stringify( ret ) );
    } );

  };

  return list;

} )();
