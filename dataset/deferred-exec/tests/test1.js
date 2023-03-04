var dexec = require( 'deferred-exec' );
 
dexec( 'echo "yay"' )
  .done( function( stdout, stderr, command ) {
    console.log( stdout ); // logs "yay"
  })
  .fail( function( error ) {
    console.log( "it didn't work :( got code:", error.code );
  });
