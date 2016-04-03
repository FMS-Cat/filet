module.exports = ( function() {

  'use strict';

  let fs = require( 'fs' );
  let archiver = require( 'archiver' );

  let sendFileOptions = {
    dotfiles: 'allow',
    root: './'
  };

  let download = function( _req, _res ) {

    let path = _req.body.path;
    if ( !path ) {
      _res.status( 400 ).send( 'file path is required' );
      return;
    }
    path = path.replace( /\.{2,}/, '.' );

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

      if ( _stat.isDirectory() ) {
        let name = __dirname + '/../temp/' + ( +new Date() ) + '.zip';
        let out = fs.createWriteStream( name );
        let zip = archiver( 'zip' );

        out.on( 'close', function() {
          _res.sendFile( name, sendFileOptions, function( _error ) {
            if ( _error ) {
              _res.status( 500 ).send( 'something goes wrong' );
              console.error( _error );
              return;
            }
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
          'cwd': '.' + path,
          'src': [ '**' ]
        } );
        zip.finalize();

      } else {
        _res.sendFile( '.' + path, sendFileOptions, function( _error ) {
          if ( _error ) {
            _res.status( 500 ).send( 'something goes wrong' );
            console.error( _error );
            return;
          }
        } );
      }

    } );

  };

  return download;

} )();
