module.exports = ( function() {

  'use strict';

  let post = require( './post' );

  let list = require( './list' );
  let property = require( './property' );

  let browser = function( _path, _isDir, _dontPush ) {
    if ( !_dontPush ) {
      if ( !window.history.state ) {
        window.history.replaceState(
          { path: _path, isDir: _isDir },
          null,
          location.href.replace( /\/browser.*/, '/browser' ) + _path
        );
      } else if ( window.history.state.path !== _path ) {
        window.history.pushState(
          { path: _path, isDir: _isDir },
          null,
          location.href.replace( /\/browser.*/, '/browser' ) + _path
        );
      }
    }

    if ( _isDir ) {
      post( {
        'url': location.href.replace( /\/browser.*/, '/list' ),
        'data': { 'path': _path },
        'responseType': 'text',
        'callback': function( _status, _data ) {
          if ( _status === 200 ) {
            list( JSON.parse( _data ) );
          }
        }
      } );
    } else {
      post( {
        'url': location.href.replace( /\/browser.*/, '/property' ),
        'data': { 'path': _path },
        'responseType': 'text',
        'callback': function( _status, _data ) {
          if ( _status === 200 ) {
            property( JSON.parse( _data ) );
          }
        }
      } );
    }
  };

  window.addEventListener( 'popstate', function( _event ) {
    browser( _event.state.path, _event.state.isDir, true );
  } );

  return browser;

} )();
