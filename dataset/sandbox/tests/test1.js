var Sandbox = require("sandbox");
// var s = new Sandbox();

// describe("Sandbox", function () {
  // describe("#eval()", function () {
    try {
      const s = new Sandbox();

      s.eval("'hello world'", function (_, res) {
        assert.equal(res, "hello world");
        done();
      });
} catch(err) {}

    try {
      const s = new Sandbox();

      s.eval("3 + 2", function (_, res) {
        assert.equal(res, 5);
        assert.equal(typeof res, "number");
        done();
      });
} catch(err) {}

    try {
      const s = new Sandbox();

      s.eval("const a = 4.2; a", function () {
        s.eval("a * 10", function (_, res) {
          assert.equal(res, 42);
          done();
        });
      });
} catch(err) {}

    try {
      const s1 = new Sandbox();
      const s2 = new Sandbox();

      s1.eval("const a = 4.2; a", function () {
        s2.eval("a * 10", function (err, res) {
          assert.deepStrictEqual(err, {
            message: "a is not defined",
          });
          assert.equal(res, undefined);
          done();
        });
      });
} catch(err) {}

    try {
      const s = new Sandbox();

      s.eval("#}", function (err, res) {
        assert.deepStrictEqual(err, {
          message:
            "Syntax Error: unexpected '#' at line 1, column 1 at position: 1:1",
        });
        assert.equal(res, undefined);
        done();
      });
} catch(err) {}

    try {
      const s = new Sandbox();

      s.eval("process.platform", function (err, res) {
        assert.deepStrictEqual(err, {
          message: "process is not defined",
        });
        assert.equal(res, undefined);
        done();
      });
} catch(err) {}

    try {
      const s = new Sandbox();

      s.eval(
        "var sys=require('sys'); sys.puts('Up in your fridge')",
        function (err, res) {
          assert.deepStrictEqual(err, {
            message: "require is not defined",
          });
          assert.equal(res, undefined);
          done();
        },
      );
} catch(err) {}

    try {
      const s = new Sandbox();

      s.eval("const a = 1;", function (err, res) {
        assert.equal(err, undefined);
        assert.equal(res, undefined);
        done();
      });
} catch(err) {}

    // try {
  // });
// });
