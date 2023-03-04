let mpv = require('node-mpv');
let mpvPlayer = new mpv();
mpvPlayer.load("/path/to/your/favorite/song.mp3");
mpvPlayer.volume(70);

mpvPlayer.on('statuschange', function(status){
  console.log(status);
});
 
mpvPlayer.on('stopped', function() {
  console.log("Gimme more music");
});
