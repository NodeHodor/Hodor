const root = require("codecov");
let args = {
  options: {
    "gcov-root": " ",
    "gcov-exec": " ",
    "gcov-args": " ",
  },
};
root.handleInput.upload(
  args,
  function () {
    console.log("success");
  },
  function () {
    console.log("Fail!");
  }
);
