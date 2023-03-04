const aaptjs = require('aaptjs');

aaptjs.list('{your_dataset_path}/aaptjs/tests/com.afwsamples.testdpc_7.0.1.apk', (err, data) => {
  if (err) {
    // something went wrong 
  } else {
    console.log(data);
  }
});

console.log(aaptjs.version);

aaptjs.add('{your_dataset_path}/aaptjs/tests/com.afwsamples.testdpc_7.0.1.apk', '{your_dataset_path}/aaptjs/tests/tmp', (err, data) => {
  if (err) {
    // something went wrong 
  } else {
    console.log(data);
  }
})

// 函数实现，参数 delay 单位 毫秒 ；
function sleep(delay) {
  for (var t = Date.now(); Date.now() - t <= delay;);
}

// 调用方法，同步执行，阻塞后续程序的执行；
sleep(1000);

aaptjs.remove('{your_dataset_path}/aaptjs/tests/com.afwsamples.testdpc_7.0.1.apk', '{your_dataset_path}/aaptjs/tests/tmp', (err, data) => {
  if (err) {
    // something went wrong 
  } else {
    console.log(data);
  }
})

aaptjs.packageCmd('', (err, data) => {
  if (err) {
    // something went wrong 
  } else {
    console.log(data);
  }
})

// aaptjs.dump('WHAT', '{your_dataset_path}/aaptjs/tests/com.afwsamples.testdpc_7.0.1.apk', (err, data) => {
//   if (err) {
//     // something went wrong 
//   } else {
//     console.log(data);
//   }
// })