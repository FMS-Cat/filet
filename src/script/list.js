module.exports = ( function() {

  'use strict';

  let el = require( './el' );
  let selectIcon = require( './select-icon' );
  let DnD = require( './dnd' );
  let dnd;
  let post = require( './post' );
  let download = require( './download' );
  let unlink = require( './unlink' );
  let upload = require( './upload' );

  let list = function( _data ) {
    while ( container.firstChild ) {
      container.removeChild( container.firstChild );
    }

    // ---

    let list = el( {
      tag: 'div',
      parent: container,
      id: 'list'
    } );

    // ---

    let current = el( {
      tag: 'div',
      parent: list,
      id: 'current',
      innerText: _data.path
    } );

    // ---

    let buttons = el( {
      tag: 'div',
      parent: list,
      id: 'buttons'
    } );

    el( {
      tag: 'img',
      parent: buttons,
      src: location.href.replace( /\/browser.*/, '/static/image/download.svg' ),
      class: [ 'button', 'hover', 'download' ],
      onclick: function() {
        download( _data.path, true );
      }
    } );

    // ---

    let items = el( {
      tag: 'div',
      parent: list,
      id: 'items'
    } );

    _data.items.map( function( _item ) {

      let onclick = function() {
        let path = _item.path + '/' + _item.name;
        path = path.replace( /\/{2,}/, '/' );
        browser( path, !!_item.dir );
      };

      // ---

      let item = el( {
        tag: 'div',
        parent: items,
        class: 'item'
      } );

      el( {
        tag: 'img',
        parent: item,
        class: 'icon',
        src: ( function() {
          let staticIcon = location.href.replace( /\/browser.*/, '/static/icon/' );
          if ( _item.dir ) {
            return staticIcon + 'dir.svg';
          } else {
            return staticIcon + selectIcon( _item.name );
          }
        } )()
      } );

      el( {
        tag: 'span',
        parent: item,
        class: [ 'filename', 'hover' ],
        onclick: onclick,
        innerText: _item.name
      } );

      el( {
        tag: 'span',
        parent: item,
        class: 'date',
        innerText: new Date( _item.stats.birthtime ).toLocaleString()
      } );

      el( {
        tag: 'img',
        parent: item,
        src: location.href.replace( /\/browser.*/, '/static/image/download.svg' ),
        class: [ 'button', 'download', 'hover' ],
        onclick: function() {
          download( _item.path + '/' + _item.name, !!_item.dir );
        }
      } );

      el( {
        tag: 'img',
        parent: item,
        src: location.href.replace( /\/browser.*/, '/static/image/delete.svg' ),
        class: [ 'button', 'delete', 'hover' ],
        onclick: function() {
          if ( confirm( 'delete ' + _item.name + '?' ) ) {
            unlink( _item );
          }
        }
      } );

    } );

    // ---

    el( {
      tag: 'div',
      parent: container,
      class: 'uploadBg'
    } );

    el( {
      tag: 'img',
      parent: container,
      class: 'uploadIcon',
      src: location.href.replace( /\/browser.*/, '/static/image/upload.svg' )
    } );

    if ( typeof dnd === 'function' ) { dnd(); }
    dnd = DnD( {
      element: container,
      enter: function() {
        uploadBg.classList.add( 'on' );
        uploadBg.classList.remove( 'off' );
        uploadIcon.classList.add( 'on' );
        uploadIcon.classList.remove( 'off' );
        uploadIcon.classList.remove( 'drop' );
      },
      leave: function() {
        uploadBg.classList.remove( 'on' );
        uploadBg.classList.add( 'off' );
        uploadIcon.classList.remove( 'on' );
        uploadIcon.classList.add( 'off' );
      },
      drop: function( _event ) {
        uploadBg.classList.remove( 'on' );
        uploadBg.classList.add( 'off' );
        uploadIcon.classList.remove( 'on' );
        uploadIcon.classList.add( 'drop' );
        upload( _data.path, _event.dataTransfer.files );
      },
    } );

  };

  return list;

} )();
