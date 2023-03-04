const ffmpejdotjs = require("ffmpegdotjs");

try{
  let data = ffmpejdotjs.compressvideo(
      "TensorFlow-for-Beginners.mp4",
      "test"
    );
} catch(err){

}

try{
ffmpejdotjs.generateimage(
    "TensorFlow-for-Beginners.mp4",
    "test"
  );
} catch(err){

}

try{
ffmpejdotjs.convertvideo(
    "TensorFlow-for-Beginners.mp4",
    "test"
  );
} catch(err){

}

try{
ffmpejdotjs.extractaudio(
    "TensorFlow-for-Beginners.mp4",
    "test"
  );
} catch(err){

}
try{
ffmpejdotjs.compressvideo(
    "TensorFlow-for-Beginners.mp4",
    "test"
  );
} catch(err){

}
try{
ffmpejdotjs.generategif(
    "TensorFlow-for-Beginners.mp4",
    "test"
  );
} catch(err){

}
try{
ffmpejdotjs.trimvideo("Test.mp4",0,30,"test").then((file)=>{
        console.log(file);
});
} catch(err){

}

try{
ffmpejdotjs.addoverlaytext(
        "TensorFlow-for-Beginners.mp4",
        "TEST",
        20,
        20,
        "test"
      )
    } catch(err){

    }

try{
ffmpejdotjs.addoverlayimage(
        "TensorFlow-for-Beginners.mp4",
        "logo.png",
        20,
        20,
        "test"
      );
    } catch(err){

    }

try{
ffmpejdotjs.addaudiotoimage(
      "ubuntu.mp3",
      "logo.png",
      "testaudio"
    );
  } catch(err){

  }
    
try{
ffmpejdotjs.trimvideo(
      "TensorFlow-for-Beginners.mp4",
      0,
      30,
      "test"
    );
  } catch(err){

  }

// ffmpejdotjs.concatvideos(
//       ["testaudio.mp4", "test.mp4"],
//       "test123"
//     );

// ffmpejdotjs.mergevideos(
//       "testaudio.mp4",
//       "test.mp4",
//       "test123"
//     );
