( function() {

  'use strict';

  let express = require( 'express' );
  let pathlib = require( 'path' );
  let app = express();
  let multer = require( 'multer' );
  let upload = multer( {
    dest: pathlib.join( process.cwd(), '.filet/temp' )
  } );

  app.get( '/list/**', require( './list' ) );
  app.get( '/property/**', require( './property' ) );
  app.get( '/download/**', require( './download' ) );
  app.get( '/stream/**', require( './stream' ) );
  app.post( '/unlink', upload.array(), require( './unlink' ) );
  app.post( '/rename', upload.array(), require( './rename' ) );
  app.post( '/mkdir', upload.array(), require( './mkdir' ) );
  app.post( '/upload', upload.array( 'files' ), require( './upload' ) );
  app.use( '/browser', require( './browser' ) );
  app.use( '/file', express.static( process.cwd() ) );
  app.use( '/static', express.static( pathlib.join( __dirname, '../dist' ) ) );

  require( './tempdir' );

  let port = process.env.PORT || 3030;
  app.listen( port );
  console.log( '🐟 < Hi, I am filet' );
  console.log( '🐟 < listening @ port ' + port );

} )();
