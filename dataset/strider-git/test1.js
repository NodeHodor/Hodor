var sg =  require('strider-git');
var config = {
    url: 'https://githost.com/one/two.git',
    auth: {
      type: 'https',
      username: 'foo@bar.com',
      password: 'foopassword'
    }
  };
sg.init("./dest", config, ()=>{}, ()=>{})
sg.fetch("./dest", config, {"status": (a,b)=>{}}, ()=>{})


var lib = require('strider-git/lib');

var sshUrl = require('strider-git');

var url = 'git@git.git:git/git.git';
lib.sshUrl({ url: url })[0]

var url = 'git://one.com/two.git';
      var ssh = 'git@one.com:two.git';
      lib.sshUrl({url: url})[0]


      var url = 'ssh://user@host.com:20/one/two.git';
      lib.sshUrl({url: url})[0]

      var url = 'ssh://user@host.com/one/two.git';
      lib.sshUrl({url: url})[0]


    //   describe('.httpUrl', function () {
    //     it('should preserve an http(s):// url', function () {
          var url = 'https://foo%40bar.com:foopassword@githost.com/one/two.git'
          var config = {
            url: 'https://githost.com/one/two.git',
            auth: {
              type: 'https',
              username: 'foo@bar.com',
              password: 'foopassword'
            }
          };
          lib.httpUrl(config)[0]
        //   expect(lib.httpUrl(config)[0]).to.equal(url);
        // });
    
        // it('should encode username to URI format', function () {
          var config = {
            url: 'https://githost.com/one/two.git',
            auth: {
              type: 'https',
              username: 'foo@bar.com',
              password: 'foopassword'
            }
          };
          lib.httpUrl(config)[0]

          lib.getBranches(config, "aa", ()=>{})
    //       expect(lib.httpUrl(config)[0]).to.contain(encodeURIComponent('foo@bar.com'));
    //     });
    //   });
    // });
    
    lib.gitaneCmd("ls ./", "./dest", "aaa", {"status": (a,b)=>{}}, ()=>{})