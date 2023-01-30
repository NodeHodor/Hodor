'@namespace michael';

/* This variable should exported */
var age = 17;

/* Should exported */
var profile = function () {
    /* Shouldn't exported */
    var person = '';

    console.log('Name: Michael John', 'Age: ' + age);

    /* Shouldn't exported */
    var cint = '', tas = '';

    /* Shouldn't exported */
    var yop = function() {
        /* Shouldn't exported */
        var og = function() {

        }
    }
}

/* Should exported */
var tuti = 1, santi = 0;
var tuta = 2;

/* Should exported */
var xx = function() {
    function simple() {
        /* shouldn't exported */
        var john = 'None';
    }
}

/* Should exported */
var bar = 'Bar from Michael';
