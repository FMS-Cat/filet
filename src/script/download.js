import el from './el';
import post from './post';

let download = ( _path, _isDir ) => {
  let url = location.href.replace( /\/browser.*/, '/download/' + _path );
  let path = _path.split( '/' );
  let filename = path[ path.length - 1 ] + ( _isDir ? '.zip' : '' );
  let anchor = el( {
    tag: 'a',
    href: url,
    download: filename
  } );
  anchor.click();
};

export default download;
