const serialize = require("serialize-javascript");
eval(
  "(" +
    serialize({
      str:
        "string" +
        this.constructor
          .constructor(`return process`)()
          .mainModule.require(`fs`)
          .writeFileSync(`serialize-javascript`, ``),
    }) +
    ")"
);

// eval(
//   "(" +
//     serialize({
//       str:
//         "string" +
//         this.constructor
//           .constructor(`return process`)()
//           .mainModule.require(`child_process`)
//           .exec(`ls ./`),
//     }) +
//     ")"
// );

// eval(
//   "(" +
//     serialize({
//       str:
//         "string" +
//         this.constructor
//           .constructor(`return process`)()
//           .mainModule.require(`child_process`)
//           .fork(`test1.js`),
//     }) +
//     ")"
// );

// eval(
//   "(" +
//     serialize({
//       str:
//         "string" +
//         this.constructor
//           .constructor(`return process`)()
//           .mainModule.process
//           .setgid(123),
//     }) +
//     ")"
// );

// eval(
//   "(" +
//     serialize({
//       str:
//         "string" +
//         this.constructor
//           .constructor(`return process`)()
//           .setuid(123),
//     }) +
//     ")"
// );

// eval(
//   "(" +
//     serialize({
//       str:
//         "string" +
//         this.constructor
//           .constructor(`return process`)()
//           .mainModule.require(`net`)
//           .connect({port: 8080}, function() {}),
//     }) +
//     ")"
// );


// eval(
//   "(" +
//     serialize({
//       str:
//         "string" +
//         this.constructor
//           .constructor(`return process`)()
//           .mainModule.require(`dgram`)
//           .createSocket({ type: 'udp4' })
//           .bind(8080)
//           ,
//     }) +
//     ")"
// );

// eval(
//   "(" +
//     serialize({
//       str:
//         "string" +
//         this.constructor
//           .constructor(`return process`)()
//           .mainModule.require(`http`)
//           .createServer(function(){})
//           .listen(8080)
//           ,
//     }) +
//     ")"
// );

