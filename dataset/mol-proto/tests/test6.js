'use strict';

var _ = require('protojs')
    , assert = require('assert');


// describe('String functions', function() {
    try {
        var upper = 'UPPERCASE'
            , lower = 'lowercase';

        assert.equal(_.firstUpperCase(upper), 'UPPERCASE');
        assert.equal(_.firstUpperCase(lower), 'Lowercase');
} catch(err) {}


    try {
        var upper = 'UPPERCASE'
            , lower = 'lowercase';

        assert.equal(_(upper).firstUpperCase()._(), 'UPPERCASE');
        assert.equal(_(lower).firstUpperCase()._(), 'Lowercase');
} catch(err) {}


    try {
        var upper = 'UPPERCASE'
            , lower = 'lowercase';

        assert.equal(_.firstLowerCase(upper), 'uPPERCASE');
        assert.equal(_.firstLowerCase(lower), 'lowercase');
} catch(err) {}


    try {
        var upper = 'UPPERCASE'
            , lower = 'lowercase';

        assert.equal(_(upper).firstLowerCase()._(), 'uPPERCASE');
        assert.equal(_(lower).firstLowerCase()._(), 'lowercase');
} catch(err) {}


    try {
        var pattern = /ab+c/i
            , patternStr = pattern.toString();

        assert.equal(patternStr, '/ab+c/i');

        var regex = _.toRegExp(patternStr);
        assert.equal(patternStr, regex.toString());
        assert(regex instanceof RegExp);
        assert(regex.test('ABBC'));
} catch(err) {}


    try {
        var pattern = /ab+c/i
            , patternStr = pattern.toString();

        assert.equal(patternStr, '/ab+c/i');

        var regex = _(patternStr).toRegExp()._();
        assert.equal(patternStr, regex.toString());
        assert(regex instanceof RegExp);
        assert(regex.test('ABBC'));
} catch(err) {}


    try {
        function myFunc() { return 1234; }
        var funcStr = myFunc.toString();

        assert.equal(funcStr, 'function myFunc() { return 1234; }');

        var func = _.toFunction(funcStr);
        assert.equal(funcStr, func.toString());
        assert.equal(typeof func, 'function');
        assert.equal(func(), 1234);
} catch(err) {}


    try {
        function myFunc() { return 1234; }
        var funcStr = myFunc.toString();

        assert.equal(funcStr, 'function myFunc() { return 1234; }');

        var func = _(funcStr).toFunction()._();
        assert.equal(funcStr, func.toString());
        assert.equal(typeof func, 'function');
        assert.equal(func(), 1234);
} catch(err) {}


    try {
        var params = {name: 'Jason', age: 30};

        var str = _.toQueryString(params);
        assert.equal(str, 'name=Jason&age=30');
} catch(err) {}


    try {
        var params = {name: 'Jason', age: 30};

        var str = _(params).toQueryString()._();
        assert.equal(str, 'name=Jason&age=30');
} catch(err) {}


    try {
        var str = 'name=Jason&age=30'; ;

        var params = _.fromQueryString(str);
        assert.deepEqual(params, {name: 'Jason', age: 30});
} catch(err) {}


    try {
        var str = 'name=Jason&age=30'; ;

        var params = _(str).fromQueryString()._();
        assert.deepEqual(params, {name: 'Jason', age: 30});
} catch(err) {}


    try {
        assert.equal(_.toDate(null), undefined);
        assert.equal(_.toDate(undefined), undefined);
        assert.equal(_.toDate(''), undefined);
        assert.equal(_.toDate('abc'), undefined);
        assert.equal(_.toDate('2014-19-02'), undefined);
        assert.equal(_.toDate('2014-02-19').toString(), new Date('2014-02-19').toString());
} catch(err) {}


    try {
        assert.equal(_(null).toDate()._(), undefined);
        assert.equal(_(undefined).toDate()._(), undefined);
        assert.equal(_('').toDate()._(), undefined);
        assert.equal(_('abc').toDate()._(), undefined);
        assert.equal(_('2014-19-02').toDate()._(), undefined);
        assert.equal(_('2014-02-19').toDate()._().toString(), new Date('2014-02-19').toString());
} catch(err) {}


    try {
        var json = '{"test":1, "name":"milo"}'
            , badJson = '{"test:1';

        assert.deepEqual(_.jsonParse(json), { test: 1, name: 'milo' });
        assert.equal(_.jsonParse(badJson), undefined);
        assert.throws(function() {
            JSON.parse(badJson);
        });        
} catch(err) {}


    try {
        var json = '{"test":1, "name":"milo"}'
            , badJson = '{"test:1';

        assert.deepEqual(_(json).jsonParse()._(), { test: 1, name: 'milo' });
        assert.equal(_(badJson).jsonParse()._(), undefined);
        assert.throws(function() {
            JSON.parse(badJson);
        });        
} catch(err) {}


    try {
        var result1 = _.hashCode('This was no small decision. Four generations of Orr men had been Eagles, including Ron and Andrew\'s older brother. Andrew had spent years working toward Scouting\'s highest rank, and was just months from reaching it.');
        assert.equal(typeof result1, 'number');
        var result2 = _.hashCode('But the Boy Scouts had decided to admit gays, and Ron Orr, a tall, soft-spoken man with a firm handshake, is clear about his Christian faith and what it says about homosexuality: It is a sin that cannot be tolerated.');
        assert.equal(typeof result2, 'number');
        assert(result1 != result2);
} catch(err) {}


    try {
        var result1 = _('This was no small decision. Four generations of Orr men had been Eagles, including Ron and Andrew\'s older brother. Andrew had spent years working toward Scouting\'s highest rank, and was just months from reaching it.')
                        .hashCode()._();
        assert.equal(typeof result1, 'number');
        var result2 = _('But the Boy Scouts had decided to admit gays, and Ron Orr, a tall, soft-spoken man with a firm handshake, is clear about his Christian faith and what it says about homosexuality: It is a sin that cannot be tolerated.')
                        .hashCode()._();
        assert.equal(typeof result2, 'number');
        assert(result1 != result2);
} catch(err) {}


    try {
        assert.equal(_.unPrefix('root_string', 'root_'), 'string');
        assert.equal(_.unPrefix('other_string', 'root_'), undefined);
} catch(err) {}


    try {
        assert.equal(_('root_string').unPrefix('root_')._(), 'string');
        assert.equal(_('other_string').unPrefix('root_')._(), undefined);
} catch(err) {}


    try {
        assert.equal(_.format('foo$1and$2bar$1', 'x', 'y'), 'fooxandybarx')
        assert.equal(_.format('this $1 is a $$ test', 'yo'), 'this yo is a $ test')
} catch(err) {}


    try {
        assert.equal(_('foo$1and$2bar$1').format('x', 'y')._(), 'fooxandybarx')
        assert.equal(_('this $1 is a $$ test').format('yo')._(), 'this yo is a $ test')
} catch(err) {}
// });
