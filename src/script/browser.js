import get from './get';

import list from './list';
import preview from './preview';

let path;
let isDir;

let loadList = ( _path, _elList ) => {
  get( {
    'url': location.href.replace( /\/browser.*/, '/list' + _path ),
    'responseType': 'text',
    'callback': ( _status, _data ) => {
      if ( _status === 200 ) {
        if ( _elList ) {
          container.removeChild( _elList );
        }
        list( JSON.parse( _data ) );
      }
    }
  } );
};

let loadPreview = ( _path ) => {
  get( {
    'url': location.href.replace( /\/browser.*/, '/property' + _path ),
    'responseType': 'text',
    'callback': ( _status, _data ) => {
      if ( _status === 200 ) {
        preview( JSON.parse( _data ) );
      }
    }
  } );
};

let browser = ( _path, _isDir, _dontPush ) => {
  let pDir = path ? ( isDir ? path : path.replace( /\/[^/]*$/, '/' ) ) : '';
  let nDir = _path ? ( _isDir ? _path : _path.replace( /\/[^/]*$/, '/' ) ) : pDir;

  path = _path || path;
  isDir = _isDir;

  if ( !_dontPush ) {
    if ( !window.history.state ) {
      window.history.replaceState(
        { path: path, isDir: _isDir },
        null,
        location.href.replace( /\/browser.*/, '/browser' ) + path
      );
    } else if ( window.history.state.path !== path ) {
      window.history.pushState(
        { path: path, isDir: _isDir },
        null,
        location.href.replace( /\/browser.*/, '/browser' ) + path
      );
    }
  }

  let elList = document.getElementById( 'list' );
  if ( elList ) {
    if ( nDir !== pDir || !_path ) {
      loadList( nDir, elList );
    }
  } else {
    loadList( nDir );
  }

  let elPreview = document.getElementById( 'preview' );
  if ( elPreview ) {
    container.removeChild( elPreview );
  }
  if ( !_isDir ) {
    loadPreview( path );
  }
};

window.addEventListener( 'popstate', ( _event ) => {
  browser( _event.state.path, _event.state.isDir, true );
} );

export default browser;
