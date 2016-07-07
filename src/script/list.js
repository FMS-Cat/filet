import el from './el';
import selectIcon from './select-icon';
import DnD from './dnd';
let dnd;
import byteformat from './byteformat';

import post from './post';
import download from './download';
import rename from './rename';
import mkdir from './mkdir';
import unlink from './unlink';
import upload from './upload';

let list = ( _data ) => {
  let list = el( {
    tag: 'div',
    parent: container,
    id: 'list'
  } );

  _data.items.sort( ( _a, _b ) => {
    if ( _a.dir !== _b.dir ) {
      return _b.dir - _a.dir;
    } else {
      return ( _a.name < _b.name ) ? -1 : 1;
    }
  } );

  _data.items.map( ( _item ) => {

    let onclick = () => {
      let path = _item.path + '/' + _item.name;
      path = path.replace( /\/{2,}/, '/' );
      browser( path, !!_item.dir );
    };

    // ---

    let item = el( {
      tag: 'div',
      parent: list,
      class: 'item'
    } );

    el( {
      tag: 'img',
      parent: item,
      class: 'icon',
      src: ( () => {
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
      innerText: new Date( _item.stats.mtime ).toLocaleString()
    } );

    if ( !_item.dir ) {
      el( {
        tag: 'span',
        parent: item,
        class: 'size',
        innerText: byteformat( _item.stats.size )
      } );
    }

    let itemButtons = el( {
      tag: 'div',
      parent: item,
      class: 'buttons'
    } );

    if ( _item.config.m ) {
      el( {
        tag: 'img',
        parent: itemButtons,
        src: location.href.replace( /\/browser.*/, '/static/image/rename.svg' ),
        class: [ 'button', 'rename', 'hover' ],
        onclick: () => {
          let name = prompt( 'new name', _item.name );
          if ( name ) {
            rename( _item.path + '/' + _item.name, name );
          }
        }
      } );

      el( {
        tag: 'img',
        parent: itemButtons,
        src: location.href.replace( /\/browser.*/, '/static/image/delete.svg' ),
        class: [ 'button', 'delete', 'hover' ],
        onclick: () => {
          if ( confirm( 'delete ' + _item.name + '?' ) ) {
            unlink( _item.path + '/' + _item.name );
          }
        }
      } );
    }

    el( {
      tag: 'img',
      parent: itemButtons,
      src: location.href.replace( /\/browser.*/, '/static/image/download.svg' ),
      class: [ 'button', 'download', 'hover' ],
      onclick: () => {
        download( _item.path + '/' + _item.name, !!_item.dir );
      }
    } );

  } );

  // ---

  let head = el( {
    tag: 'div',
    parent: list,
    id: 'head'
  } );

  let current = el( {
    tag: 'div',
    parent: head,
    id: 'current',
    innerText: _data.path
  } );

  let headButtons = el( {
    tag: 'div',
    parent: head,
    class: 'buttons'
  } );

  if ( _data.config.a ) {
    el( {
      tag: 'img',
      parent: headButtons,
      src: location.href.replace( /\/browser.*/, '/static/image/mkdir.svg' ),
      class: [ 'button', 'hover', 'mkdir' ],
      onclick: () => {
        let name = prompt( 'folder name', 'New Folder' );
        if ( name ) {
          mkdir( _data.path, name );
        }
      }
    } );
  }

  el( {
    tag: 'img',
    parent: headButtons,
    src: location.href.replace( /\/browser.*/, '/static/image/download.svg' ),
    class: [ 'button', 'hover', 'download' ],
    onclick: () => {
      download( _data.path, true );
    }
  } );

  // ---

  let uploadBg = el( {
    tag: 'div',
    parent: list,
    id: 'uploadBg'
  } );

  let uploadIcon = el( {
    tag: 'img',
    parent: list,
    id: 'uploadIcon',
    src: location.href.replace( /\/browser.*/, '/static/image/upload.svg' )
  } );

  if ( typeof dnd === 'function' ) { dnd(); }
  dnd = DnD( {
    element: list,
    enter: () => {
      uploadBg.classList.add( 'on' );
      uploadBg.classList.remove( 'off' );
      uploadIcon.classList.add( 'on' );
      uploadIcon.classList.remove( 'off' );
      uploadIcon.classList.remove( 'drop' );
    },
    leave: () => {
      uploadBg.classList.remove( 'on' );
      uploadBg.classList.add( 'off' );
      uploadIcon.classList.remove( 'on' );
      uploadIcon.classList.add( 'off' );
    },
    drop: ( _event ) => {
      uploadBg.classList.remove( 'on' );
      uploadBg.classList.add( 'off' );
      uploadIcon.classList.remove( 'on' );
      uploadIcon.classList.add( 'drop' );

      let files = _event.dataTransfer.files;
      for ( let iFile = 0; iFile < files.length; iFile ++ ) {
        upload( _data.path, files[ iFile ] );
      }
    },
  } );

};

module.exports = list;
