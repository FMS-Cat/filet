// ref: http://stackoverflow.com/questions/24976123/streaming-a-video-file-to-an-html5-video-player-with-node-js-so-that-the-video-c

module.exports = ( function() {

  'use strict';

  let fs = require( 'fs' );
  let pathlib = require( 'path' );

  let stream = function( _req, _res ) {

    let path = decodeURI( _req.url.replace( /\/stream(.*)/, '$1' ) );
    path = pathlib.join( process.cwd(), path );
    if ( /^\.\.\//.test( pathlib.relative( process.cwd(), path ) ) ) {
      return _res.status( 400 ).send( 'invalid path' );
    }

    let type = '';
    if ( /\.mp4$/.test( path ) ) {
      type = 'video/mp4';
    } else if ( /\.mp3/.test( path ) ) {
      type = 'audio/mpeg';
    } else {
      return _res.status( 400 ).send( 'the file is not streamable' );
    }

    fs.stat( path, function( _error, _stat ) {
      if ( _error ) {
        if ( _error.code === 'ENOENT' ) {
          return _res.status( 404 ).send( 'no such file or directory' );
        } else {
          console.error( _error );
          return _res.status( 500 ).send( 'something went wrong' );
        }
      }

      if ( _stat.isDirectory() ) {
        return _res.status( 400 ).send( 'given path is not file' );
      }

      let range = _req.headers.range;
      if ( !range ) {
        return _res.status( 416 ).send( 'range is not defined' );
      }

      let positions = range.replace( /bytes=/, '' ).split( '-' );
      let start = parseInt( positions[ 0 ] );
      let total = _stat.size;
      let end = positions[ 1 ] ? parseInt( positions[ 1 ] ) : total - 1;
      let size = ( end - start ) + 1;

      _res.status( 206 ).set( {
        'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
        'Accept-Ranges': 'bytes',
        'Content-Length': size,
        'Content-Type': type
      } );

      let stream = fs.createReadStream( path, { start: start, end: end } )
      .on( 'open', function() {
        stream.pipe( _res );
      } )
      .on( 'error', function( _error ) {
        _res.status( 500 ).send( 'something went wrong' );
      } );

    } );

  };

  return stream;

} )();
