module.exports = ( function() {

  'use strict';

  let el = require( './el' );
  let post = require( './post' );

  let download = function( _item ) {
    post( {
      'url': location.href.replace( /\/browser.*/, '/download' ),
      'data': { 'path': _item.path + '/' + _item.name },
      'responseType': 'blob',
      'callback': function( _status, _data ) {
        if ( _status === 200 ) {
          let url = window.URL.createObjectURL( _data );
          let anchor = el( {
            tag: 'a',
            href: url,
            download: _item.name + ( _item.dir ? '.zip' : '' )
          } );
          anchor.click();
          window.URL.revokeObjectURL( url );
        }
      }
    } );
  };

  return download;

} )();
