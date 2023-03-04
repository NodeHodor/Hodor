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


function sleep(delay) {
  for (var t = Date.now(); Date.now() - t <= delay;);
}


sleep(1000);

aaptjs.remove('{your_dataset_path}/aaptjs/tests/com.afwsamples.testdpc_7.0.1.apk', '{your_dataset_path}/aaptjs/tests/tmp', (err, data) => {
  if (err) {
    // something went wrong 
  } else {
    console.log(data);
  }
})

aaptjs.packageCmd('--help', (err, data) => {
  if (err) {
    // something went wrong 
  } else {
    console.log(data);
  }
})

aaptjs.dump('permissions', '{your_dataset_path}/aaptjs/tests/com.afwsamples.testdpc_7.0.1.apk', (err, data) => {
  if (err) {
    // something went wrong 
  } else {
    console.log(data);
  }
})

aaptjs.crunch('{your_dataset_path}/aaptjs/tests/com.afwsamples.testdpc_7.0.1.apk', './', (err, data) => {
  if (err) {
    // something went wrong 
  } else {
    console.log(data);
  }
})

aaptjs.singleCrunch('{your_dataset_path}/aaptjs/tests/tmp.png', './', (err, data) => {
  if (err) {
    // something went wrong 
  } else {
    console.log(data);
  }
})
