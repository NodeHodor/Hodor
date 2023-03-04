const ffmpeg = require('ffmpeg-sdk');
 
// Clips video from input.mp4 from startTime to endTime  

ffmpeg.clip('input.mp4', 'output.mp4', '1000.00', '56770.00')
// .then(fileClipped => {
//   console.log('File clip success.');
// })
// .catch(error => {
//   console.log('File clip error.');
// });

 
// Splits input.mp4 into 3 clips.
ffmpeg.split('input.mp4', 'output.mp4', [1000, 56770, 67880, 89909])
// .then(fileClipped => {
//   console.log('File split success.');
// })
// .catch(error => {
//   console.log('File split error.');
// });
 
// Parse audio from input.mp4 and saves in output.mp3  
ffmpeg.clip('input.mp4', 'output.mp3')
// .then(audioParsed => {
//   console.log('Audui parse success.');
// })
// .catch(error => {
//   console.log('Audio parse error.');
// });
