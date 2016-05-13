'use strict';

let el = require( './el' );
let get = require( './get' );
let byteformat = require( './byteformat' );
let computeSize = require( './compute-size' );
let download = require( './download' );

let preview = function( _item ) {
  let preview = el( {
    tag: 'div',
    parent: container,
    id: 'preview'
  } );

  el( {
    tag: 'div',
    parent: preview,
    class: 'bg',
    onclick: function() {
      browser( _item.path.replace( /\/[^/]*$/, '/' ), true );
    }
  } );

  // ---

  let body = el( {
    tag: 'div',
    parent: preview,
    class: 'body'
  } );

  if ( /\.(png|gif|jpg|jpeg|bmp|svg)$/.test( _item.name ) ) {
    let img = el( {
      tag: 'img',
      parent: body,
      width: 0,
      class: [ 'content', 'image' ],
      src: location.href.replace( /\/browser/, '/file' )
    } );

    let resize = function() {
      let rect = body.getBoundingClientRect();
      let size = computeSize( img.naturalWidth, img.naturalHeight, rect.right - rect.left, rect.bottom - rect.top, img );
    }
    img.onload = resize;

    window.addEventListener( 'resize', resize );

  } else if ( /\.mp3$/.test( _item.name ) ) {
    let vid = el( {
      tag: 'audio',
      parent: body,
      controls: true,
      class: [ 'content', 'audio' ],
      src: location.href.replace( /\/browser/, '/stream' )
    } );

  } else if ( /\.mp4$/.test( _item.name ) ) {
    let vid = el( {
      tag: 'video',
      parent: body,
      width: 0,
      controls: true,
      class: [ 'content', 'video' ],
      src: location.href.replace( /\/browser/, '/stream' )
    } );

    let resize = function() {
      let rect = body.getBoundingClientRect();
      let size = computeSize( vid.videoWidth, vid.videoHeight, rect.right - rect.left, rect.bottom - rect.top, vid );
    }
    vid.oncanplay = resize;

    window.addEventListener( 'resize', resize );

  } else {
    let vid = el( {
      tag: 'div',
      parent: body,
      id: 'ace',
      class: [ 'content', 'ace' ]
    } );

    let editor = ace.edit( 'ace' );
    editor.setReadOnly( true );
    editor.setTheme( 'ace/theme/monokai' );
    let modelist = ace.require( 'ace/ext/modelist' );
    console.log( modelist );
    let mode = modelist.getModeForPath( _item.name ).mode;
    editor.session.setMode( mode );

    get( {
      'url': location.href.replace( /\/browser/, '/file' ),
      'callback': function( _status, _data ) {
        if ( _status === 200 ) {
          editor.setValue( _data, -1 );
        }
      }
    } );
  }

  // ---

  let props = el( {
    tag: 'div',
    parent: preview,
    class: 'props'
  } );

  let name = el( {
    tag: 'div',
    parent: props,
    class: 'name',
    innerText: _item.name
  } );

  let date = el( {
    tag: 'div',
    parent: props,
    class: 'date',
    innerText: new Date( _item.stats.mtime ).toLocaleString()
  } );

  let size = el( {
    tag: 'div',
    parent: props,
    class: 'size',
    innerText: byteformat( _item.stats.size )
  } );

  let buttons = el( {
    tag: 'div',
    parent: props,
    class: 'buttons'
  } );

  el( {
    tag: 'img',
    parent: buttons,
    src: location.href.replace( /\/browser.*/, '/static/image/download.svg' ),
    class: [ 'button', 'hover', 'download' ],
    onclick: function() {
      download( _item.path, false );
    }
  } );

};

module.exports = preview;
