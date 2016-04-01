module.exports = ( function() {

  'use strict';

  let list = function( _data ) {
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
        icon.src = staticIcon + ( require( './select-icon' ) )( _item.name );
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

  return list;

} )();
