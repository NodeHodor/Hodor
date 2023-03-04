'use strict';

var policy = require('access-policy');
var fs = require('fs');
var path = require('path');
var assert = require('assert');

function loadPolicy(name) {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, 'policies/', name + '.json'), 'utf8')).statements;
}

function encodePolicy(name, data) {
  if (!data) {
    data = {
      user: {
        id: 12345
      }
    };
  }

  return policy.encode(loadPolicy(name), data);
}

function assertPolicy(statement, context) {
  context = context || {};

  return policy.resource(statement, {
    Action: context.a || 'get',
    Resource: context.r || '/user/12345'
  });
}

function assertRestriction(statement, data) {
  context = context || {};

  return policy.restriction(statement, data);
}


      assert.throws(policy.encode, SyntaxError);
      assert.throws(policy.encode, /SyntaxError: Must include statements to encode/);

    var loadedPolicy = loadPolicy('single-statement');
    var encodedPolicy = policy.encode(loadedPolicy, {
      user: {
        id: 12345
      }
    });

      var noData = policy.encode(loadedPolicy);
      assert.equal(JSON.stringify(noData), JSON.stringify(loadedPolicy));

      assert.equal(typeof encodedPolicy, 'object');

      assert.equal(encodedPolicy[0].resource, "/user/12345");



      var loaded = loadPolicy('single-statement');
      var context = {
        Action: 'get',
        Resource: '/user/12345',
        user: {
          id: 12345
        }
      };

      assert.equal(policy.resource(loaded, context).length, 1);


    var missingParamsErrorMessage = /missing parameters/;
    var statementErrorMessage = /provided statements must be an Array/;
    var contextErrorMessage = /provided resource must be an Object/;


      assert.throws(policy.resource.bind(null, []), SyntaxError);
      assert.throws(policy.resource.bind(null, []), missingParamsErrorMessage);
      assert.doesNotThrow(policy.resource.bind(null, [], {}), SyntaxError);

        var stringTest = policy.resource.bind(null, 'string', {});

        assert.throws(stringTest, TypeError);
        assert.throws(stringTest, statementErrorMessage);

        var numberResource = policy.resource.bind(null, [], 'string');

        assert.throws(numberResource, TypeError);
        assert.throws(numberResource, contextErrorMessage);


      var encoded = encodePolicy('single-statement');

      assert.equal(assertPolicy([]), false);

      var missingPropertyErrorMessage = /statement is missing required properties/;


        var noAction = policy.resource.bind(null, [{
          resource: '/user/'
        }], {});


        var noResource = policy.resource.bind(null, [{
          action: '*'
        }], {});

        assert.throws(noResource, missingPropertyErrorMessage);


      var encoded = encodePolicy('single-statement');

        var p = assertPolicy(encoded);
        assert.equal(p.length, 1);

      var encoded = encodePolicy('single-statement-multi-resource');

        var p = assertPolicy(encoded);

        assert.equal(p.length, 1);

        var p = assertPolicy(encoded, {
          r: '/user/12345/bill'
        });

        assert.equal(p.length, 1);


        var encoded = encodePolicy('single-statement');

        assert.equal(assertPolicy(encoded).length, 1);

        assert.equal(assertPolicy(encoded, {
          a: 'post'
        }).length, 1);

        assert.equal(assertPolicy(encoded, {
          a: 'put'
        }).length, 1);

        assert.equal(assertPolicy(encoded, {
          a: 'patch'
        }).length, 1);

        assert.equal(assertPolicy(encoded, {
          a: 'delete'
        }).length, 1);

        var encoded = encodePolicy('single-statement-action-get');

        assert.equal(assertPolicy(encoded).length, 1);

        assert.equal(assertPolicy(encoded, {
          a: 'post'
        }), false);

        assert.equal(assertPolicy(encoded, {
          a: 'put'
        }), false);

        assert.equal(assertPolicy(encoded, {
          a: 'patch'
        }), false);

        assert.equal(assertPolicy(encoded, {
          a: 'delete'
        }), false);

        var encoded = encodePolicy('single-statement-action-get-post');

        assert.equal(assertPolicy(encoded).length, 1);

        assert.equal(assertPolicy(encoded, {
          a: 'post'
        }).length, 1);

        assert.equal(assertPolicy(encoded, {
          a: 'put'
        }), false);

        assert.equal(assertPolicy(encoded, {
          a: 'patch'
        }), false);

        assert.equal(assertPolicy(encoded, {
          a: 'delete'
        }), false);

      var encoded = encodePolicy('multi-statement');

        assert.equal(assertPolicy(encoded, {
          a: 'get'
        }).length, 1);

        assert.equal(assertPolicy(encoded, {
          r: '/user/12345/bill'
        }).length, 1);

      var encoded = encodePolicy('multi-statement-deny');


        assert.equal(assertPolicy(encoded, {
          r: '/user/12345/goal'
        }).length, 1);

        assert.equal(assertPolicy(encoded, {
          r: '/user/12345/transaction'
        }).length, 1);

        assert.equal(assertPolicy(encoded, {
          r: '/user/12345/account'
        }).length, 1);

        assert.equal(assertPolicy(encoded, {
          r: '/user/12345/bill'
        }), false);

      var encoded = encodePolicy('single-statement-restriction');

        var p = assertPolicy(encoded);

        var c = assertRestriction(p, {
          user_id: '12345'
        });

        assert.equal(p.length, 1);
        assert.ok(c);

        var p = assertPolicy(encoded);

        var c = assertRestriction(p, {
          user_id: '123456'
        });

        assert.equal(p.length, 1);
        assert.equal(c, false);

      var encoded = encodePolicy('single-statement-restriction-multi-term');

        var p = assertPolicy(encoded);

        assert.equal(p.length, 1);


    var loaded = loadPolicy('user');
    var context = {
      Action: 'get',
      Resource: '/user/12345/payments',
      user: {
        id: 12345
      }
    };

    assert.equal(policy.resource(loaded, context).length, 1);

