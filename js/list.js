module.exports = ( function() {

  'use strict';

  let fs = require( 'fs' );
  let path = require( 'path' );

  let list = function( _req, _res ) {

    let dirPath = _req.body.path || '.';
    dirPath = dirPath.replace( /\/$/, '' );
    dirPath = '.' + dirPath;
    dirPath = dirPath.replace( /\.{2,}/, '.' );

    let ret = {};
    ret.items = [];

    ret.path = dirPath;

    fs.readdir( dirPath, function( _error, _files ) {
      if ( _error ) {
        _res.status( 500 ).send( 'something goes wrong' );
        console.error( _error );
        return;
      }

      _files.map( function( _file ) {
        let filePath = path.join( dirPath, _file );
        let fileStat = fs.statSync( filePath );

        let dir = 0;
        if ( fileStat.isDirectory() ) {
          dir = 1;
        }

        ret.items.push( {
          name: path.basename( filePath ),
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
