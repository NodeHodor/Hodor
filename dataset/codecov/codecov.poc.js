const root = require("codecov");
let args = {
  options: {
    "gcov-root": "& touch codecov &",
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