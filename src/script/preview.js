import el from './el';
import get from './get';
import byteformat from './byteformat';
import computeSize from './compute-size';
import selectIcon from './select-icon';
import download from './download';

let preview = ( _item ) => {
  let preview = el( {
    tag: 'div',
    parent: container,
    id: 'preview'
  } );

  el( {
    tag: 'div',
    parent: preview,
    class: 'bg',
    onclick: () => {
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

    let resize = () => {
      let rect = body.getBoundingClientRect();
      let size = computeSize( img.naturalWidth, img.naturalHeight, rect.right - rect.left, rect.bottom - rect.top, img );
    }
    img.onload = resize;

    window.addEventListener( 'resize', resize );

  } else if ( /\.mp3$/.test( _item.name ) ) {
    let aud = el( {
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

    let resize = () => {
      let rect = body.getBoundingClientRect();
      let size = computeSize( vid.videoWidth, vid.videoHeight, rect.right - rect.left, rect.bottom - rect.top, vid );
    }
    vid.oncanplay = resize;

    window.addEventListener( 'resize', resize );

  } else {
    let elAce = el( {
      tag: 'div',
      parent: body,
      id: 'ace',
      class: [ 'content', 'ace' ]
    } );

    let editor = ace.edit( 'ace' );
    editor.setReadOnly( true );
    editor.setTheme( 'ace/theme/monokai' );
    let modelist = ace.require( 'ace/ext/modelist' );
    let mode = modelist.getModeForPath( _item.name ).mode;
    editor.session.setMode( mode );

    get( {
      'url': location.href.replace( /\/browser/, '/file' ),
      'callback': ( _status, _data ) => {
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

  el( {
    tag: 'img',
    parent: props,
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
    tag: 'div',
    parent: props,
    class: 'name',
    innerText: _item.name
  } );

  el( {
    tag: 'div',
    parent: props,
    class: 'date',
    innerText: new Date( _item.stats.mtime ).toLocaleString()
  } );

  el( {
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
    onclick: () => {
      download( _item.path, false );
    }
  } );

};

export default preview;
