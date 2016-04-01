module.exports = ( function() {

  let post = require( './post' );

  let list = function( _data ) {
    console.log( _data );
    while ( container.firstChild ) {
      container.removeChild( container.firstChild );
    }

    // ---

    let list = document.createElement( 'div' );
    container.appendChild( list );
    list.id = 'list';

    // ---

    let current = document.createElement( 'div' );
    list.appendChild( current );
    current.id = 'current';
    current.innerText = _data.current;

    // ---

    let items = document.createElement( 'div' );
    list.appendChild( items );
    items.id = 'items';

    _data.items.map( function( _item ) {
      let onclick = function() {
        let path = _item.path.substring( 1 ) + '/' + _item.name;
        browser( path, !!_item.dir );
      };

      // ---

      let item = document.createElement( 'div' );
      items.appendChild( item );
      item.classList.add( 'item' );

      let icon = document.createElement( 'img' );
      item.appendChild( icon );
      icon.classList.add( 'icon' );
      let staticIcon = location.href.replace( /\/browser.*/, '/static/icon/' );
      if ( _item.dir ) {
        icon.src = staticIcon + 'dir.svg';
      } else {
        let ext = _item.name.replace( /.*\.([^.]*)$/, '$1' );
        let url = staticIcon + ext + '.svg';

        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
          if ( xhr.status === 200 ) {
            icon.src = url;
          } else {
            icon.src = staticIcon + 'default.svg';
          }
        }
        xhr.open( 'GET', url, true );
        xhr.send();
      }

      let name = document.createElement( 'a' );
      item.appendChild( name );
      name.classList.add( 'filename' );
      name.onclick = onclick;
      name.innerText = _item.name;

      let date = new Date( _item.stats.birthtime );
      let dateSpan = document.createElement( 'span' );
      item.appendChild( dateSpan );
      dateSpan.classList.add( 'date' );
      dateSpan.innerText = date.toLocaleString();
    } );
  };

  let property = function( _item ) {
    while ( container.firstChild ) {
      container.removeChild( container.firstChild );
    }

    let div = document.createElement( 'div' );
    container.appendChild( div );
    div.innerText = JSON.stringify( _item );

    let down = document.createElement( 'a' );
    container.appendChild( down );
    down.href = location.href.replace( /\/browser/, '/file' );
    down.innerText = 'download';
  };

  let browser = function( _path, _isDir ) {
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

  return browser;

} )();
