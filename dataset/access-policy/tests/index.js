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

describe('Encoding', function () {
  describe('an empty statement', function () {
    it('should throw a SyntaxError', function () {
      assert.throws(policy.encode, SyntaxError);
      assert.throws(policy.encode, /SyntaxError: Must include statements to encode/);
    });
  });

  describe('a single statement policy', function () {
    var loadedPolicy = loadPolicy('single-statement');
    var encodedPolicy = policy.encode(loadedPolicy, {
      user: {
        id: 12345
      }
    });

    it('should return the exact policy when no data is provided', function () {
      var noData = policy.encode(loadedPolicy);
      assert.equal(JSON.stringify(noData), JSON.stringify(loadedPolicy));
    });

    it('should return an object', function () {
      assert.equal(typeof encodedPolicy, 'object');
    });

    it('should replace all instances of ${user.id} with \'12345\'', function () {
      assert.equal(encodedPolicy[0].resource, "/user/12345");
    });
  })
});

describe('Testing', function () {
  describe('an uencoded statement', function () {
    it('should allow access', function () {
      var loaded = loadPolicy('single-statement');
      var context = {
        Action: 'get',
        Resource: '/user/12345',
        user: {
          id: 12345
        }
      };

      assert.equal(policy.resource(loaded, context).length, 1);
    });
  });

  describe('parameters', function () {
    var missingParamsErrorMessage = /missing parameters/;
    var statementErrorMessage = /provided statements must be an Array/;
    var contextErrorMessage = /provided resource must be an Object/;

    it('should throw a syntax error with less than 2 parameters', function () {
      assert.throws(policy.resource.bind(null, []), SyntaxError);
      assert.throws(policy.resource.bind(null, []), missingParamsErrorMessage);
      assert.doesNotThrow(policy.resource.bind(null, [], {}), SyntaxError);
    });


    describe('with an incorrect policy type', function () {
      it('should throw a type error', function () {
        var stringTest = policy.resource.bind(null, 'string', {});

        assert.throws(stringTest, TypeError);
        assert.throws(stringTest, statementErrorMessage);
      });
    })

    describe('with an incorrect context type', function () {
      it('should throw a type error', function () {
        var numberResource = policy.resource.bind(null, [], 'string');

        assert.throws(numberResource, TypeError);
        assert.throws(numberResource, contextErrorMessage);
      });
    });
  });

  describe('statements', function () {
    it('should always be false when length 0', function () {
      var encoded = encodePolicy('single-statement');

      assert.equal(assertPolicy([]), false);
    });

    describe('when missing properties', function () {
      var missingPropertyErrorMessage = /statement is missing required properties/;

      it('should thorw a syntax error when missing \`action\`', function () {
        var noAction = policy.resource.bind(null, [{
          resource: '/user/'
        }], {});

        assert.throws(noAction, missingPropertyErrorMessage);
      });

      it('should thorw a syntax error when missing \`resource\`', function () {
        var noResource = policy.resource.bind(null, [{
          action: '*'
        }], {});

        assert.throws(noResource, missingPropertyErrorMessage);
      });
    });
  });


  describe('a single statement', function () {
    describe('without conditions', function () {
      var encoded = encodePolicy('single-statement');

      it('should allow path \'/user/12345\'', function () {
        var p = assertPolicy(encoded);
        assert.equal(p.length, 1);
      });

      it('should not allow path \'/user/123456\'', function () {
        assert.equal(assertPolicy(encoded, {
          r: '/user/123456'
        }), false);
      });
    });

    describe('with multiple resources', function () {
      var encoded = encodePolicy('single-statement-multi-resource');

      it('should allow path \'/user/12345\'', function () {
        var p = assertPolicy(encoded);

        assert.equal(p.length, 1);
      });

      it('should allow path \'/user/12345/bills\'', function () {
        var p = assertPolicy(encoded, {
          r: '/user/12345/bill'
        });

        assert.equal(p.length, 1);
      });
    });

    describe('with action', function () {
      it('should allow all requests', function () {
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
      });

      it('should only allow \'get\' requests', function () {
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
      });

      it('should only allow \'get\' and \'post\' requests', function () {
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
      });
    });
  });

  describe('multiple statements', function () {
    describe('without deny statement', function () {
      var encoded = encodePolicy('multi-statement');

      it('should allow path \'/user/12345\'', function () {
        assert.equal(assertPolicy(encoded, {
          a: 'get'
        }).length, 1);
      });

      it('should allow path \'/user/12345/bills\'', function () {
        assert.equal(assertPolicy(encoded, {
          r: '/user/12345/bill'
        }).length, 1);
      });
    });

    describe('with deny statement', function () {
      var encoded = encodePolicy('multi-statement-deny');

      it('should allow path \'/user/12345/*\'', function () {
        assert.equal(assertPolicy(encoded, {
          r: '/user/12345/goal'
        }).length, 1);

        assert.equal(assertPolicy(encoded, {
          r: '/user/12345/transaction'
        }).length, 1);

        assert.equal(assertPolicy(encoded, {
          r: '/user/12345/account'
        }).length, 1);
      });

      it('should not allow path \'/user/12345/bill\'', function () {
        assert.equal(assertPolicy(encoded, {
          r: '/user/12345/bill'
        }), false);
      });
    });
  });

  describe('restriction', function () {
    describe('with single term', function () {
      var encoded = encodePolicy('single-statement-restriction');

      it('should allow a condition with \`user_id\`', function () {
        var p = assertPolicy(encoded);

        var c = assertRestriction(p, {
          user_id: '12345'
        });

        assert.equal(p.length, 1);
        assert.ok(c);
      });

      it('should not allow a condition with \`user_id\`', function () {
        var p = assertPolicy(encoded);

        var c = assertRestriction(p, {
          user_id: '123456'
        });

        assert.equal(p.length, 1);
        assert.equal(c, false);
      });
    });

    describe('with multiple terms', function () {
      var encoded = encodePolicy('single-statement-restriction-multi-term');

      it('should return a query property', function () {
        var p = assertPolicy(encoded);

        assert.equal(p.length, 1);
      });
    });
  });
});

describe('User policy', function () {
  it('should allow access', function () {
    var loaded = loadPolicy('user');
    var context = {
      Action: 'get',
      Resource: '/user/12345/payments',
      user: {
        id: 12345
      }
    };

    assert.equal(policy.resource(loaded, context).length, 1);
  });
});
