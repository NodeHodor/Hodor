// import install from './index.js';
var install = require("install-package");

// test.afterEach.always(async () => {
//  await uninstall(['noop2', 'noop3'], ['--no-save']);
// });

try {
  try {
    const {stdout} = install('noop2', ['--no-save']);

    t.not(stdout, null);
  } catch (error) {
    t.fail(`error happened unexpectedly: ${error.message}`);
  }
// });
} catch(err) {}

try {
  try {
    const {stdout} = install(['noop2', 'noop3'], ['--no-save']);

    t.not(stdout, null);
  } catch (error) {
    t.fail(`error happened unexpectedly: ${error.message}`);
  }
// });
} catch(err) {}

try {
  try {
    install('not-exist-package', ['--no-save']);
    } catch (error) {
    t.not(error, null);
    t.pass();
    }
    // });
} catch(err) {}

    try {
    try {
    install(null);
    } catch (error) {
    t.not(error, null);
    t.pass();
    }
} catch(err) {}



try {
    try {
        const {stdout} = install('noop2', '--no-save');
    
        t.not(stdout, null);
    } catch (error) {
        t.fail(`error happened unexpectedly: ${error.message}`);
    }
} catch(err) {}
    
    try {
    try {
        const {stdout} = install('noop2', ['--no-save']);
    
        t.not(stdout, null);
    } catch (error) {
        t.fail(`error happened unexpectedly: ${error.message}`);
    }
} catch(err) {}

    try {
        try {
          const {stdout} =install('noop2', {'--no-save': true});
      
          t.not(stdout, null);
        } catch (error) {
          t.fail(`error happened unexpectedly: ${error.message}`);
        }
    } catch(err) {}


