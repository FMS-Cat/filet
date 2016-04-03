module.exports = ( function() {

  'use strict';

  let fs = require( 'fs' );
  let path = require( 'path' );
  let archiver = require( 'archiver' );

  let download = function( _req, _res ) {

    let dirPath = _req.body.path;
    if ( !dirPath ) {
      _res.status( 400 ).send( 'file path is required' );
      return;
    }
    dirPath = dirPath.replace( /\.{2,}/, '.' );

    fs.stat( '.' + dirPath, function( _error, _stat ) {
      if ( _error ) {
        if ( _error.code === 'ENOENT' ) {
          _res.status( 404 ).send( 'no such file or directory' );
        } else {
          _res.status( 500 ).send( 'something goes wrong' );
          console.error( _error );
        }
        return;
      }

      if ( _stat.isDirectory() ) {
        let name = __dirname + '/../temp/' + ( +new Date() ) + '.zip';
        let out = fs.createWriteStream( name );
        let zip = archiver( 'zip' );

        out.on( 'close', function() {
          fs.readFile( name, 'binary', function( _error, _file ) {
            if ( _error ) {
              _res.status( 500 ).send( 'something goes wrong' );
              console.error( _error );
              return;
            }

            _res.send( new Buffer( _file, 'binary' ) );
            fs.unlink( name );
          } );
        } );

        zip.on( 'error', function( _error ) {
          _res.status( 500 ).send( 'something goes wrong' );
          console.error( _error );
        } );

        zip.pipe( out );
        zip.bulk( {
          'expand': true,
          'cwd': '.' + dirPath,
          'src': [ '**' ]
        } );
        zip.finalize();

      } else {
        fs.readFile( '.' + dirPath, 'binary', function( _error, _file ) {
          if ( _error ) {
            _res.status( 500 ).send( 'something goes wrong' );
            console.error( _error );
            return;
          }

          _res.send( new Buffer( _file, 'binary' ) );
        } );
      }

    } );

  };

  return download;

} )();
