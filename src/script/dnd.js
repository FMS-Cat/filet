module.exports = ( function() {

  let dnd = function( _props ) {

    // _props: { element, enter, leave, drop }

    // Ref: http://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element
    var editorDragCounter = 0;

    _props.element.addEventListener( 'dragenter', function( _event ) {
      _event.preventDefault();
      _event.stopPropagation();

      if ( editorDragCounter === 0 ) {
        if ( typeof _props.enter === 'function' ) {
          _props.enter( _event );
        }
      }

      editorDragCounter ++;
    } );

    _props.element.addEventListener( 'dragover', function( _event ) {
      _event.preventDefault();
      _event.stopPropagation();
    } );

    _props.element.addEventListener( 'dragleave', function( _event ) {
      _event.preventDefault();
      _event.stopPropagation();

      editorDragCounter --;

      if ( editorDragCounter === 0 ) {
        if ( typeof _props.leave === 'function' ) {
          _props.leave( _event );
        }
      }
    } );

    _props.element.addEventListener( 'drop', function( _event ) {
      _event.preventDefault();
      _event.stopPropagation();

      editorDragCounter = 0;
      if ( typeof _props.drop === 'function' ) {
        _props.drop( _event );
      }
    } );

  };

  return dnd;

} )();
