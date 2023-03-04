var jsen = require('jsen');
var validate = jsen({ type: 'string' });
var valid = validate('some value');
var assert = require("assert")
var schema = { type: 'any' },
validate  = jsen(schema)

validate(null)
validate(undefined)
validate(0)
validate('')
validate(Math.PI)
validate('abc')
validate(77)
validate(false)
validate(true)
validate({})
validate([])


var schema = { type: 'array' },
    validate = jsen(schema);

validate()
validate(null)
validate([])

var schema = { type: ['array', 'null'] },
validate = jsen(schema);
validate('123');
validate(false);
validate({});
validate(Math.PI);

var schema = { type: 'boolean' },
            validate = jsen(schema);

validate();
validate(null);

validate(false);
validate(true);

var schema = { type: ['boolean', 'null'] },
validate = jsen(schema);

validate(undefined);

validate(true);
validate(false);
validate(null);

var schema = { type: 'boolean' },
validate = jsen(schema);

validate('123');
validate([]);
validate({});
validate(Math.PI);

validate(true);
validate(false);

var clone = jsen.clone;
clone('abc')
clone(123)
clone(Math.PI)
clone(false)
var func = function () { };
clone(func)
var regex = /a/gim;
clone(regex)
var today = new Date('05/14/2015');
clone(today)
clone(null)
clone(undefined)
var obj = { a: 1, b: 'a', c: false, d: { e: Math.PI, f: [1, 2, 3] } };
clone(obj)
JSON.stringify(clone(obj))
var arr = [1, 'a', false, { d: [1, 2, 3] }];
JSON.stringify(clone(arr))

var schema = { type: 'date' },
validate = jsen(schema);
validate();
validate(null);

validate(new Date());


validate(undefined);

validate(new Date());
validate(null);


validate('123');
validate([]);
validate({});
validate(Math.PI);

validate(new Date());

var ucs2length = jsen.ucs2length;
var ucs2Data = [
    {
        description: 'Consecutive astral symbols',
        decoded: [127829, 119808, 119558, 119638],
        encoded: '\uD83C\uDF55\uD835\uDC00\uD834\uDF06\uD834\uDF56'
    },
    {
        description: 'U+D800 (high surrogate) followed by non-surrogates',
        decoded: [55296, 97, 98],
        encoded: '\uD800ab'
    },
    {
        description: 'U+DC00 (low surrogate) followed by non-surrogates',
        decoded: [56320, 97, 98],
        encoded: '\uDC00ab'
    },
    {
        description: 'High surrogate followed by another high surrogate',
        decoded: [0xD800, 0xD800],
        encoded: '\uD800\uD800'
    },
    {
        description: 'Unmatched high surrogate, followed by a surrogate pair, followed by an unmatched high surrogate',
        decoded: [0xD800, 0x1D306, 0xD800],
        encoded: '\uD800\uD834\uDF06\uD800'
    },
    {
        description: 'Low surrogate followed by another low surrogate',
        decoded: [0xDC00, 0xDC00],
        encoded: '\uDC00\uDC00'
    },
    {
        description: 'Unmatched low surrogate, followed by a surrogate pair, followed by an unmatched low surrogate',
        decoded: [0xDC00, 0x1D306, 0xDC00],
        encoded: '\uDC00\uD834\uDF06\uDC00'
    }
];
ucs2Data.forEach(function (obj) {
        ucs2length(obj.encoded);
})
var equal = jsen.equal;
equal('a', 'a');
equal('a', 'b');
equal(123, 123);
equal(Math.PI, Math.PI);
equal(Math.PI, Math.E);
equal(true, true);
equal(true, false);
equal(null, null);
equal(null, undefined);
equal(undefined, undefined);
equal(null, undefined);
equal(undefined, undefined);
equal(null, undefined);
var f1 = function () { },
    f2 = function () { },
    f3 = f1;

// two functions are only equal if they
// reference the same function object
equal(f1, f3);
equal(f1, f2);
var f = function () { },
            obj1 = { a: 123, b: 'abc', c: f },
            obj2 = { a: 123, b: 'abc', c: f },
            arr1 = [1, 'a', f, obj1],
            arr2 = [1, 'a', f, obj1],
            arr3 = [1, 'a', f],
            arr4 = [1, 'a', f, obj2];

equal(arr1, arr2);
equal(arr1, arr4);

equal(arr1, arr3);

var a = { a: 123, b: ['abc'], c: { } },
b = { b: ['abc'], c: { }, a: 123 },
c = a,
d = { a: 123, b: ['abc'], c: { d: undefined } };

equal(a, b);
equal(a, c);

equal(a, d);


equal('a', 'a');
equal('a', 'b');

equal(123, 123);
equal(Math.PI, Math.PI);
equal(Math.PI, Math.E);

equal(true, true);
equal(true, false);
equal(null, null);
equal(null, undefined);

equal(undefined, undefined);
equal(null, undefined);

var f1 = function () { },
    f2 = function () { },
    f3 = f1;

// two functions are only equal if they
// reference the same function object
equal(f1, f3);
equal(f1, f2);

var f = function () { },
    obj1 = { a: 123, b: 'abc', c: f },
    obj2 = { a: 123, b: 'abc', c: f },
    arr1 = [1, 'a', f, obj1],
    arr2 = [1, 'a', f, obj1],
    arr3 = [1, 'a', f],
    arr4 = [1, 'a', f, obj2];

equal(arr1, arr2);
equal(arr1, arr4);

equal(arr1, arr3);

var a = { a: 123, b: ['abc'], c: { } },
    b = { b: ['abc'], c: { }, a: 123 },
    c = a,
    d = { a: 123, b: ['abc'], c: { d: undefined } };

equal(a, b);
equal(a, c);

equal(a, d);

var a = /a+/gim,
    b = new RegExp('a+', 'gim'),
    c = /a/gim,
    d = a;

equal(a, b);
equal(a, d);

equal(a, c);

var unique = jsen.unique;

var inputs = [
        [1, 'a', 3, false, null, undefined],
        ['abc', 123, true, 123, false, Math.PI, 'abc', true, null, null]
    ],
    expected = [
        [1, 'a', 3, false, null, undefined],
        ['abc', 123, true, false, Math.PI, null]
    ],
    i;

for (i = 0; i < inputs.length; i++) {
    unique(inputs[i]);
}

var input = [
        { },
        { a: 1 },
        { b: { c: { d: 123, f: null }, e: 'abc' } },
        [1, 2, 3],
        [{ a: 213 }],
        { b: 1 },
        { a: 1, b: undefined },
        { b: { e: 'abc', c: { f: null, d: 123 } } },
        [1, 2, 3],
        [{ a: 213 }]
    ],
    expected = [
        { },
        { a: 1 },
        { b: { c: { d: 123, f: null }, e: 'abc' } },
        [1, 2, 3],
        [{ a: 213 }],
        { b: 1 },
        { a: 1, b: undefined }
    ];
unique(input);

var arr = [{ }, { a: 1 }, { a: 1, b: 2 }],
    expected = 2,
    comparator = function (obj1, obj2) {
        return obj1.a === obj2.a && obj1.b === obj2.b;
    };

unique.findIndex(arr, { a: 1, b: 2}, comparator);

var arr = [{ }, { a: 1 }, { a: 1, b: 2 }],
    expected = -1,
    comparator = function (obj1, obj2) {
        return obj1.a === obj2.a && obj1.b === obj2.b;
    };

unique.findIndex(arr, { a: 1, b: null }, comparator);


var schema = {
        type: 'object',
        properties: {
            test1: { $ref: '#external1'},
            test2: {
                type: 'number'
            },
            test3: { $ref: '#external3'}    //missing
        },
        additionalProperties: false
    },
    external1 = {
        type: 'object',
        properties: {
            test11: { $ref: '#external11'}, //missing
            test12: {
                type: 'number'
            },
            test13: { $ref: '#external11'}  //duplicate
        }
    },
    validate = jsen(schema, {
        schemas: {
            external1: external1
        },
        missing$Ref: true
    }),
    missingTest = {
        test1: {
            test11: 'missing',
            test12: 5,
            test13: 'missing too'
        },
        test2: 2,
        test3: 3
    },
    invalidTest = {
        test1: {
            test11: 'missing',
            test12: 5,
            test13: 'missing too'
        },
        test2: 'fail',
        test3: 3
    },
    ret;

ret = validate(missingTest);

ret = validate(invalidTest);


var schema = {
        allOf: [
            { type: 'number' },
            { type: 'integer' }
        ]
    },
    validate = jsen(schema);

validate(null);
validate(Math.PI);

validate(0);
validate(777);
validate(-9);

var schema = {
        anyOf: [
            { type: 'string' },
            { type: 'number' }
        ]
    },
    validate = jsen(schema);

validate(null);
validate(true);
validate({});
validate([]);

validate('abc');
validate(123);
validate('');
validate(0);

var schema = {
        oneOf: [
            { type: 'number', maximum: 5 },
            { type: 'number', minimum: 3 }
        ]
    },
    validate = jsen(schema);

validate(null);
validate(true);
validate({});
validate([]);
// matches both validators
validate(3);

validate(0);
validate(1);
validate(2);
validate(6);
validate(17);

var schema = {
        not: {
            type: 'array'
        }
    },
    validate = jsen(schema);

validate([]);

validate(0);
validate(false);
validate('abc');
validate({});
validate(null);
validate();


var schema = { type: 'object' },
    validate = jsen(schema);

validate();
validate(null);

validate({});

var schema = { type: ['object', 'null'] },
    validate = jsen(schema);

validate(undefined);

validate(null);
validate({});

var schema = { type: 'object' },
    validate = jsen(schema);

validate('123');
validate(false);
validate([]);
validate(Math.PI);

validate({});
jsen({ type: 'object', properties: {} }, {});

var schema = { type: 'object', maxProperties: 3 },
    validate = jsen(schema);

validate({ a: 1, b: 2, c: 3, d: 4});

validate({});
validate({ a: 1 });
validate({ a: 1, b: 2 });
validate({ a: 1, b: 2, c: 3 });

var schema = { type: 'object', minProperties: 2 },
    validate = jsen(schema);

validate({});
validate({ a: 1 });

validate({ a: 1, b: 2 });
validate({ a: 1, b: 2, c: 3 });

var schema = {
        type: 'object',
        properties: {
            a: { type: 'string' },
            b: { type: 'number' },
            c: { type: 'boolean'}
        },
        required: ['a', 'b']
    },
    validate = jsen(schema);

validate({});
validate({ c: true });
validate({ a: 'abc', c: true });
validate({ b: 123, c: true });
validate({ a: 'abc', b: undefined });

validate({ a: 'abc', b: 123 });
validate({ a: 'abc', b: 123, c: true });

var schema = {
        type: 'object',
        properties: {
            a: { type: 'string' },
            b: { type: 'number' }
        },
        additionalProperties: true
    },
    validate = jsen(schema);

validate({ a: 'abc' });
validate({ b: 123 });
validate({ a: 'abc', b: 123 });
validate({ a: 'abc', b: 123, c: true });

schema.additionalProperties = false;
validate = jsen(schema);

validate({ c: true });
validate({ a: 'abc', b: 123, c: true });

validate({ a: 'abc', b: 123 });
jsen({ type: 'object', additionalProperties: false })({});

var schema = {
        type: 'object',
        properties: {
            a: { type: 'string' },
            b: { type: 'number' }
        },
        additionalProperties: {
            type: 'boolean'
        }
    },
    validate = jsen(schema);

validate({ a: 'abc', b: 123, c: 123 });

validate({ a: 'abc', b: 123, c: false });

var schema = {
        type: 'object',
        properties: {
            a: { type: 'string' }
        },
        patternProperties: {
            '^b': { type: 'number' }
        },
        additionalProperties: true
    },
    validate = jsen(schema);

validate({ a: 'abc' });
validate({ b: 123 });
validate({ a: 'abc', b: 123, bar: Math.E, baz: Math.PI });
validate({ a: 'abc', baz: 123, c: true });

schema.additionalProperties = false;
validate = jsen(schema);

validate({ c: true });
validate({ a: 'abc', bar: 123, c: true });

validate({ a: 'abc', baz: 123 });
jsen({ type: 'object', additionalProperties: false })({});

var schema = {
        type: 'object',
        patternProperties: {
            '^a': { type: 'string' },
            '^b': { type: 'number' }
        }
    },
    validate = jsen(schema);

validate({ a: 123 });
validate({ b: 'abc' });

validate({});
validate({ a: 'abc' });
validate({ b: 123 });
validate({ a: 'abc', b: 123 });

var schema = {
        type: 'object',
        properties: {
            a: { type: 'string' },
            b: { type: 'number' }
        },
        dependencies: {
            a: {
                type: 'object',
                required: ['c'],
                properties: {
                    c: { type: 'boolean' }
                }
            },
            b: {
                type: 'object',
                required: ['f'],
                properties: {
                    f: { type: 'null' }
                }
            },
            g: {
                type: 'object',
                required: ['b'],
                properties: {
                    b: {
                        type: 'integer'
                    }
                }
            }
        }
    },
    validate = jsen(schema);

validate({ a: 'abc' });
validate({ a: 'abc', c: 123 });
validate({ b: Math.PI, f: false });
validate({ b: Math.PI, g: null });

validate({});
validate({ a: 'abc', c: false });
validate({ b: Math.PI, f: null });
validate({ b: 123, g: 'any value', f: null });

var schema = {
        type: 'object',
        properties: {
            a: { type: 'string' },
            b: { type: 'number' },
            c: { type: 'boolean' }
        },
        dependencies: {
            a: ['b', 'c']
        }
    },
    validate = jsen(schema);

validate({ a: 'abc' });
validate({ a: 'abc', b: 123 });

validate({});
validate({ a: 'abc', b: 123, c: false });



var schemas = [
        {
            type: 'number'
        },

        {
            type: 'object',
            properties: {
                a: {
                    type: 'string'
                }
            }
        },

        {
            type: 'array',
            uniqueItems: true
        },

        {
            type: 'array',
            items: {
                maximum: 10
            }
        },

        {
            type: 'object',
            properties: {
                a: {
                    type: 'array',
                    items: [{
                        type: 'object',
                        properties: {
                            b: {
                                multipleOf: 7
                            }
                        }
                    }]
                }
            }
        },

        {
            allOf: [
                { minimum: 5 },
                { maximum: 10 }
            ]
        },

        {
            type: 'object',
            properties: {
                a: {
                    anyOf: [
                        { type: 'string' },
                        { type: 'number' }
                    ]
                }
            }
        },

        {
            type: 'array',
            items: [{
                type: 'object',
                properties: {
                    a: {
                        oneOf: [
                            { type: 'boolean' },
                            { type: 'null' }
                        ]
                    }
                }
            }]
        },

        {
            type: 'object',
            properties: {
                a: {
                    not: {
                        type: 'string'
                    }
                }
            }
        },

        {
            definitions: {
                positiveInteger: {
                    type: 'integer',
                    minimum: 0,
                    exclusiveMinimum: true
                }
            },
            type: 'object',
            properties: {
                a: {
                    type: 'object',
                    properties: {
                        b: {
                            type: 'object',
                            properties: {
                                c: {
                                    $ref: '#/definitions/positiveInteger'
                                }
                            }
                        }
                    }
                }
            }
        },

        {
            type: 'object',
            required: ['a', 'b']
        },

        {
            type: 'object',
            dependencies: {
                a: {
                    required: ['b']
                }
            }
        },

        {
            type: 'object',
            dependencies: {
                a: ['b']
            }
        }
    ],
    data = [
        '123',
        { a: 123 },
        [7, 11, 7],
        [10, 11, 9],
        { a: [{ b: 8 }] },
        12,
        { a: false },
        [{ a: 123 }],
        { a: 'abc' },
        { a: { b: { c: 0 }}},
        {},
        { a: 123 },
        { a: 123 }
    ];


    var expectedPaths = [
            [''],
            ['a'],
            [''],
            ['1'],
            ['a.0.b'],
            [''],
            ['a', 'a'],
            ['0.a', '0.a', '0.a'],
            ['a'],
            ['a.b.c'],
            ['a'],
            ['b'],
            ['b']
        ],
        validate, valid;

    schemas.forEach(function (schema, index) {
        validate = jsen(schema);
        valid = validate(data[index]);

        valid

        expectedPaths[index].forEach(function (path, pindex) {
            try {
                validate.errors[pindex].path, path;
            }
            catch (e) {
                // console.log(index);
                // console.log(validate.errors);
                throw e;
            }
        });


    });


    var expectedKeywords = [
            ['type'],
            ['type'],
            ['uniqueItems'],
            ['maximum'],
            ['multipleOf'],
            ['maximum'],
            ['type', 'type', 'anyOf'],
            ['type', 'type', 'oneOf'],
            ['not'],
            ['exclusiveMinimum'],
            ['required'],
            ['required'],
            ['dependencies']
        ],
        validate, valid;

    schemas.forEach(function (schema, index) {
        validate = jsen(schema);
        valid = validate(data[index]);

        valid

        expectedKeywords[index].forEach(function (keyword, kindex) {
            try {
                validate.errors[kindex].keyword, keyword
            }
            catch (e) {
                // console.log(index);
                // console.log(validate.errors);
                throw e;
            }
        });
});


    var schema = { type: 'object', required: ['a'] },
        validate = jsen(schema),
        valid = validate({});

    valid
    validate.errors.length
    validate.errors[0].path
    validate.errors[0].keyword

    schema = {
        type: 'object',
        properties: {
            a: {
                type: 'array',
                items: {
                    type: 'object',
                    required: ['b']
                }
            }
        }
    };

    validate = jsen(schema);
    valid = validate({ a: [{}] });

    valid
    validate.errors.length
    validate.errors[0].path
    validate.errors[0].keyword


    var schema = {
            type: 'object',
            dependencies: {
                a: ['b']
            }
        },
        validate = jsen(schema),
        valid = validate({ a: 123 });

    valid
    validate.errors.length
    validate.errors[0].path
    validate.errors[0].keyword

    schema = {
        type: 'object',
        properties: {
            a: {
                type: 'array',
                items: {
                    type: 'object',
                    dependencies: {
                        a: ['b']
                    }
                }
            }
        }
    };

    validate = jsen(schema);
    valid = validate({ a: [{ a: 123 }] });

    valid
    validate.errors.length
    validate.errors[0].path
    validate.errors[0].keyword

    var schema = {
            type: 'object',
            properties: {
                a: {
                    type: 'object',
                    properties: {
                        foo: {}
                    },
                    additionalProperties: false
                }
            }
        },
        data = {
            a: {
                foo: 'foo',
                bar: 'bar',
                baz: 'baz'
            }
        },
        validate = jsen(schema),
        valid = validate(data);

    valid
    validate.errors.length
    validate.errors[0].path
    validate.errors[0].keyword
    validate.errors[0].additionalProperties

    validate = jsen(schema, { greedy: true });
    valid = validate(data);

    valid
    validate.errors.length
    validate.errors[0].path
    validate.errors[0].keyword
    validate.errors[0].additionalProperties
    validate.errors[1].path
    validate.errors[1].keyword
    validate.errors[1].additionalProperties

    validate.errors[0]



    var schema = {
            definitions: {
                array: {
                    maxItems: 1
                }
            },
            type: 'object',
            properties: {
                a: {
                    anyOf: [
                        { items: { type: 'integer' } },
                        { $ref: '#/definitions/array' },
                        { items: [{ maximum: 3 }] }
                    ]
                }
            }
        },
        data = { a: [Math.PI, Math.E] },
        validate = jsen(schema),
        valid = validate(data);

    valid
    validate.errors.length


    var schemas = [
        {
            type: 'string',
            invalidMessage: 'string is invalid',
            requiredMessage: 'string is required'
        },
        {
            type: 'object',
            required: ['a'],
            properties: {
                a: {
                    invalidMessage: 'a is invalid',
                    requiredMessage: 'a is required'
                }
            }
        },
        {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    a: {
                        type: 'object',
                        properties: {
                            b: {
                                invalidMessage: 'b is invalid',
                                requiredMessage: 'b is required'
                            }
                        },
                        required: ['b']
                    }
                }
            }
        },
        {
            type: 'object',
            properties: {
                a: {
                    type: 'object',
                    properties: {
                        c: {
                            type: 'string',
                            invalidMessage: 'c is invalid',
                            requiredMessage: 'c is required'
                        }
                    }
                }
            }
        }
    ],
    data = [
        undefined,
        {},
        [{ a: {} }],
        { a: { c: 123 }}
    ],
    expectedMessages = [
        'string is invalid',
        'a is required',
        'b is required',
        'c is invalid'
    ],
    validate,
    valid;

schemas.forEach(function (schema, index) {
        validate = jsen(schema);

        valid = validate(data[index]);

        valid
        validate.errors.length
        validate.errors[0].message, expectedMessages[index]
});



    var schemas = [
            {
                type: 'string',
                messages: { type: 'custom message for keyword "type"' }
            },
            {
                enum: [1, 2, 3],
                messages: { enum: 'custom message for keyword "enum"' }
            },
            {
                minimum: 3,
                messages: { minimum: 'custom message for keyword "minimum"' }
            },
            {
                minimum: 3,
                exclusiveMinimum: true,
                messages: { exclusiveMinimum: 'custom message for keyword "exclusiveMinimum"' }
            },
            {
                maximum: 10,
                messages: { maximum: 'custom message for keyword "maximum"' }
            },
            {
                maximum: 10,
                exclusiveMaximum: true,
                messages: { exclusiveMaximum: 'custom message for keyword "exclusiveMaximum"' }
            },
            {
                multipleOf: 5,
                messages: { multipleOf: 'custom message for keyword "multipleOf"' }
            },
            {
                minLength: 3,
                messages: { minLength: 'custom message for keyword "minLength"' }
            },
            {
                maxLength: 5,
                messages: { maxLength: 'custom message for keyword "maxLength"' }
            },
            {
                pattern: '\\d+',
                messages: { pattern: 'custom message for keyword "pattern"' }
            },
            {
                format: 'email',
                messages: { format: 'custom message for keyword "format"' }
            },
            {
                minItems: 1,
                messages: { minItems: 'custom message for keyword "minItems"' }
            },
            {
                maxItems: 1,
                messages: { maxItems: 'custom message for keyword "maxItems"' }
            },
            {
                additionalItems: false,
                items: [{ type: 'string' }],
                messages: { additionalItems: 'custom message for keyword "additionalItems"' }
            },
            {
                uniqueItems: true,
                messages: { uniqueItems: 'custom message for keyword "uniqueItems"' }
            },
            {
                minProperties: 1,
                messages: { minProperties: 'custom message for keyword "minProperties"' }
            },
            {
                maxProperties: 1,
                messages: { maxProperties: 'custom message for keyword "maxProperties"' }
            },
            {
                required: ['foo'],
                messages: { required: 'custom message for keyword "required"' }
            },
            {
                required: ['foo'],
                properties: {
                    foo: {
                        messages: {
                            required: 'custom message for keyword "required"'
                        }
                    }
                }
            },
            {
                required: ['foo'],
                properties: {
                    foo: {
                        messages: {
                            required: 'this custom message for keyword "required" is assigned'
                        }
                    }
                },
                messages: { required: 'this custom message for keyword "required" is NOT assigned' }
            },
            {
                additionalProperties: false,
                messages: { additionalProperties: 'custom message for keyword "additionalProperties"' }
            },
            {
                dependencies: {
                    foo: ['bar']
                },
                messages: { dependencies: 'custom message for keyword "dependencies"' }
            },
            {
                anyOf: [
                    { type: 'string' },
                    { type: 'integer' }
                ],
                messages: { anyOf: 'custom message for keyword "anyOf"' }
            },
            {
                oneOf: [
                    { type: 'string' },
                    { type: 'integer' }
                ],
                messages: { oneOf: 'custom message for keyword "oneOf"' }
            },
            {
                not: {
                    type: 'string'
                },
                messages: { not: 'custom message for keyword "not"' }
            }
        ],
        data = [
            123,
            5,
            1,
            3,
            11,
            10,
            12,
            'ab',
            'abcdef',
            'abc',
            'invalid email',
            [],
            [1, 2, 3],
            ['abc', 'def'],
            [1, 2, 2],
            {},
            { foo: 1, bar: 2 },
            {},
            {},
            {},
            { foo: 'bar' },
            { foo: 'abc' },
            null,
            null,
            'abc'
        ],
        expectedMessages = [
            schemas[0].messages.type,
            schemas[1].messages.enum,
            schemas[2].messages.minimum,
            schemas[3].messages.exclusiveMinimum,
            schemas[4].messages.maximum,
            schemas[5].messages.exclusiveMaximum,
            schemas[6].messages.multipleOf,
            schemas[7].messages.minLength,
            schemas[8].messages.maxLength,
            schemas[9].messages.pattern,
            schemas[10].messages.format,
            schemas[11].messages.minItems,
            schemas[12].messages.maxItems,
            schemas[13].messages.additionalItems,
            schemas[14].messages.uniqueItems,
            schemas[15].messages.minProperties,
            schemas[16].messages.maxProperties,
            schemas[17].messages.required,
            schemas[18].properties.foo.messages.required,
            schemas[19].properties.foo.messages.required,
            schemas[20].messages.additionalProperties,
            schemas[21].messages.dependencies,
            schemas[22].messages.anyOf,
            schemas[23].messages.oneOf,
            schemas[24].messages.not
        ],
        validate,
        valid;

    schemas.forEach(function (schema, index) {
        validate = jsen(schema);

        valid = validate(data[index]);

        valid
        validate.errors[validate.errors.length - 1].message, expectedMessages[index];
    });


    var schema = {
            items: {
                type: 'string',
                messages: {
                    type: 'will be assigned'
                }
            },
            messages: {
                items: 'will not be assigned'
            }
        },
        validate = jsen(schema),
        valid = validate([123]);

    valid
    validate.errors.length
    validate.errors[0].message


    var schema = {
            items: [{
                type: 'string',
                messages: {
                    type: 'will be assigned'
                }
            }],
            messages: {
                items: 'will not be assigned'
            }
        },
        validate = jsen(schema),
        valid = validate([123, 123]);

    valid
    validate.errors.length
    validate.errors[0].message

    var schema = {
            properties: {
                foo: {
                    type: 'number',
                    messages: {
                        type: 'will be assigned'
                    }
                }
            },
            messages: {
                properties: 'will not be assigned'
            }
        },
        validate = jsen(schema),
        valid = validate({ foo: 'bar' });

    valid
    validate.errors.length
    validate.errors[0].message



    var schema = {
            patternProperties: {
                '^foo$': {
                    type: 'number',
                    messages: {
                        type: 'will be assigned'
                    }
                }
            },
            messages: {
                patternProperties: 'will not be assigned'
            }
        },
        validate = jsen(schema),
        valid = validate({ foo: 'bar' });

    valid
    validate.errors.length
    validate.errors[0].message


    var schema = {
            dependencies: {
                foo: {
                    minProperties: 2,
                    messages: {
                        minProperties: 'will be assigned'
                    }
                }
            },
            messages: {
                dependencies: 'will not be assigned'
            }
        },
        validate = jsen(schema),
        valid = validate({ foo: 'bar' });

    valid;
    validate.errors.length
    validate.errors[0].message, 'will be assigned'


    var schema = {
            dependencies: {
                foo: {
                    minProperties: 2,
                    messages: {
                        minProperties: 'will be assigned'
                    }
                }
            },
            allOf: [
                {
                    minimum: 2,
                    messages: {
                        minimum: 'will not be assigned'
                    }
                },
                {
                    maximum: 5,
                    messages: {
                        maximum: 'will be assigned'
                    }
                }
            ],
            messages: {
                allOf: 'will not be assigned'
            }
        },
        validate = jsen(schema),
        valid = validate(6);

    valid;
    validate.errors.length
    validate.errors[0].message
;




    
        var schema = {
            type: 'string',
            pattern: '^/dev/[^/]+(/[^/]+)*$'
        };
        jsen(schema);

    
        var schema = {
            type: 'string',
            pattern: '^(/[^/ ]*)+/?$'
        };
        jsen(schema);
    
        var schema = {
                type: 'object',
                properties: {
                    123: {
                        type: 'boolean'
                    }
                }
            },
            validate;

        validate = jsen(schema);
        validate({ 123: true });

    
        var schema = {
                $ref: '#child',
                definitions: {
                    child: {
                        id: '#child',
                        type: 'string'
                    }
                }
            },
            validate;

        validate = jsen(schema);

        validate('abc');
        validate(123);

        schema = {
            $ref: '#child/definitions/subchild',
            definitions: {
                child: {
                    id: '#child',
                    definitions: {
                        subchild: {
                            type: 'number'
                        }
                    }
                }
            }
        };
    
        var schema = {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        foo: { $ref: '#' }
                    },
                    required: ['foo']
                }
            },
            validate = jsen(schema);

        validate([{ foo: [] }]);
        validate([{ foo: [{ foo: [] }] }]);
        validate([{ bar: [] }]);
        validate([{ foo: [{ foo: [] }, { bar: [] }] }]);   // Bug! False positive


    
    
            jsen({
                a: {
                    properties: {
                        b: {
                            $ref: '#/c'
                        }
                    }
                },
                c: {
                    type: 'any'
                },
                $ref: '#/a'
            });

    
        var schemaA = {
            $schema: 'http://json-schema.org/draft-04/schema#',
            id: 'http://jsen.bis/schemaA',
            type: 'object',
            properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string'}
            },
            required: ['firstName', 'lastName']
        },
        schemaB = {
            $schema: 'http://json-schema.org/draft-04/schema#',
            id: 'http://jsen.bis/schemaB',
            type: 'object',
            properties: {
                email: { type: 'string' },
                contactType: { type: 'string', default: 'personal' }
            },
            required: ['email']
        },
        mySchema = {
            $schema: 'http://json-schema.org/draft-04/schema#',
            id: 'http://jsen.biz/mySchema',
            type: 'object',
            allOf: [
                { $ref: 'http://jsen.bis/schemaA' },
                { $ref: 'http://jsen.bis/schemaB' }
            ]
        },
        baseSchemas = {
            'http://jsen.bis/schemaA': schemaA,
            'http://jsen.bis/schemaB': schemaB
        },
        data = {
            firstName: 'bunk',
            lastName: 'junk',
            email: 'asdf@biz',
            funky: true
        },
        validator = jsen(mySchema, { schemas: baseSchemas, greedy: true });

    validator(data);

    validator.build(data, { additionalProperties: false, copy: false });



    var personSchema = {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                name: {
                    $ref: '#/name'
                }
            },
            required: ['name']
        },
        definitions = {
            $schema: 'http://json-schema.org/draft-04/schema#',
            name: {
                type: 'string',
                maxLength: 100,
                pattern: '^[a-zA-Z]+$',
                invalidMessage: 'Error: Name is invalid - must be <= 100 in length and contain alphabetic characters only',
                requiredMessage: 'Error: Missing name'
            }
        },
        validate = jsen(personSchema, { schemas: definitions }),
        valid = validate({});

    valid
    validate.errors[0].message

    valid = validate({ name: '123' });
    valid
    validate.errors[0].message



    var schema = {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            additionalProperties: {
                type: 'object',
                properties: {
                    label: {
                        type: 'string'
                    }
                },
                additionalProperties: false
            }
        },
        data = {
            one: { label: '1' },
            two: { number: '2' }
        },
        validate = jsen(schema);

    validate(data);

    data = {
        one: { number: '1' },
        two: { label: '2' }
    };

    validate(data);



    var schema = {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            definitions: {
                array_of_elements: {
                    properties: {
                        the_array: {
                            type: 'array',
                            items: {
                                oneOf: [
                                    { $ref: '#/definitions/element_of_type_one' },
                                    { $ref: '#/definitions/element_of_type_two' }
                                ]
                            }
                        }
                    }
                },
                element_of_type_one: {
                    type: 'object',
                    properties: {
                        type: {
                            enum: ['one']
                        }
                    }
                },
                element_of_type_two: {
                    type: 'object',
                    properties: {
                        type: {
                            enum: ['two']
                        }
                    }
                }
            },
            $ref: '#/definitions/array_of_elements'
        },
        data = {
            the_array: [
                { type: 'two' },
                { type: 'one' }
            ]
        },
        validate = jsen(schema);

    validate(data);



    var schema = {
            definitions: {
                myObjectDef: {
                    type: 'number'
                }
            },
            type: 'array',
            items: {
                oneOf: [
                    { $ref: '#/definitions/myObjectDef' },
                    { type: 'string' }
                ]
            }
        },
        data = [
            123,
            'abc'
        ],
        validate = jsen(schema);

    validate(data);



    var schema = {
            properties:{
                foo: { type: 'bar' }
            }
        },
        validateSchema = jsen({ $ref: 'http://json-schema.org/draft-04/schema#' });

    validateSchema(schema);



    var schema = {
            properties: {
                first_name: { type: 'string' }
            }
        },
        data = { first_name: null },
        validate = jsen(schema);

    validate(data);
    validate.errors[0].path



    var schema = {
            required: ['b'],
            properties: { }
        },
        validate = jsen(schema),
        valid = validate({ a: '123' });
    valid



    
        var schema = { format: 'date-time' },
            validate = jsen(schema);

        assert(validate(new Date().toJSON()));

        assert(!validate(''));
        assert(!validate(new Date().toUTCString()));
        assert(!validate(new Date().toLocaleDateString()));
        assert(!validate(new Date().toTimeString()));


    
        var schema = { format: 'uri' },
            validate = jsen(schema);

        assert(validate('http://google.com'));
        assert(validate('ftp://my-site'));
        assert(validate('custom://my-site/long/$cr@mbl3d/u_r-l?with=query%20string'));
        assert(validate('//no-scheme-here'));

        assert(!validate(''));
        assert(!validate('google'));
        assert(!validate('/google'));
        assert(!validate('://google'));
        assert(!validate('http://google.com/no space allowed'));

    
        var schema = { format: 'email' },
            validate = jsen(schema),
            maxLongHostname1 = new Array(5).join('.' + new Array(64).join('a')).substr(1),  // 255 chars (4 groups x 63 chars)
            maxLongHostname2 = new Array(9).join('.' + new Array(32).join('a')).substr(1);  // 255 chars (8 groups x 31 chars)

        assert(validate('me@domain'));
        assert(validate('first.last+plus-dash#hash!bang$dollar%percent&amp\'quote*star/dash=equal?question^pow_under`backtick{brace}|bar~tilde@domain'));
        assert(validate('me@domain.with.multiple.subdomains'));
        assert(validate('me@domain-parts.may.contain-dashes'));
        assert(validate('me@a-single-domain-part-can-be-up-to-sixty-three-characters-long63'));
        assert(validate('me@' + maxLongHostname1));
        assert(validate('me@' + maxLongHostname2));

        assert(!validate(''));
        assert(!validate('qu"ote\'s@domain'));
        assert(!validate('me@no_underscores+or?special$chars'));
        assert(!validate('me@ends-with-dash-'));
        assert(!validate('me@-starts-with-dash'));
        assert(!validate('me@asingle-domain-part-cannot-be-longer-than-sixty-three-characters'));

        // These verify that a hostname cannot be longer than 255 chars in total. However,
        // maximum string length verification cannot be performed in the same regex, so
        // these test cases fail. Users must additionall use the `maxlength` keyword in this case.
        // assert(!validate('me@' + maxLongHostname1 + '.a'));
        // assert(!validate('me@' + maxLongHostname2 + '.a'));


    
        var schema = { format: 'ipv4' },
            validate = jsen(schema);

        assert(validate('0.0.0.0'));
        assert(validate('255.255.255.255'));
        assert(validate('127.0.0.1'));

        assert(!validate(''));
        assert(!validate('...'));
        assert(!validate('0.0.0.-1'));
        assert(!validate('0.0.-1.0'));
        assert(!validate('0.-1.0.0'));
        assert(!validate('-1.0.0.0'));
        assert(!validate('256.0.0.0'));
        assert(!validate('0.256.0.0'));
        assert(!validate('0.0.256.0'));
        assert(!validate('0.0.0.256'));


    // reference:
    // https://gist.github.com/syzdek/6086792
    // http://stackoverflow.com/questions/53497/regular-expression-that-matches-valid-ipv6-addresses
    
        var schema = { format: 'ipv6' },
            validate = jsen(schema);

        assert(validate('1:2:3:4:5:6:7:8'));
        assert(validate('1::'));
        assert(validate('1:2:3:4:5:6:7::'));
        assert(validate('1::8'));
        assert(validate('1:2:3:4:5:6::8'));
        assert(validate('1::7:8'));
        assert(validate('1:2:3:4:5::7:8'));
        assert(validate('1:2:3:4:5::8'));
        assert(validate('1::6:7:8'));
        assert(validate('1:2:3:4::6:7:8'));
        assert(validate('1:2:3:4::8'));
        assert(validate('1::5:6:7:8'));
        assert(validate('1:2:3::5:6:7:8'));
        assert(validate('1:2:3::8'));
        assert(validate('1::4:5:6:7:8'));
        assert(validate('1:2::4:5:6:7:8'));
        assert(validate('1:2::8'));
        assert(validate('1::3:4:5:6:7:8'));
        assert(validate('1::8'));
        assert(validate('::2:3:4:5:6:7:8'));
        assert(validate('::8'));
        assert(validate('::'));

        // link-local IPv6 addresses with zone index
        assert(validate('fe80::7:8%eth0'));
        assert(validate('fe80::7:8%1'));

        // IPv4-mapped IPv6 addresses and IPv4-translated addresses
        assert(validate('::255.255.255.255'));
        assert(validate('::ffff:255.255.255.255'));
        assert(validate('::ffff:0:255.255.255.255'));

        // IPv4-Embedded IPv6 Address
        assert(validate('2001:db8:3:4::192.0.2.33'));
        assert(validate('64:ff9b::192.0.2.33'));

        assert(!validate(''));
        assert(!validate('::_'));

        // TODO: we may need more invalid cases here

    
        var schema = { format: 'hostname' },
            validate = jsen(schema),
            maxLong1 = new Array(5).join('.' + new Array(64).join('a')).substr(1),  // 255 chars (4 groups x 63 chars)
            maxLong2 = new Array(9).join('.' + new Array(32).join('a')).substr(1);  // 255 chars (8 groups x 31 chars)

        assert(validate('my.host'));
        assert(validate('host'));
        assert(validate('domain.with.multiple.subdomains'));
        assert(validate('domain-parts.may.contain-dashes'));
        assert(validate('a-single-domain-part-can-be-up-to-sixty-three-characters-long63'));
        assert(validate(maxLong1));
        assert(validate(maxLong2));

        assert(!validate(''));
        assert(!validate('me@domain'));
        assert(!validate('qu"ote\'s'));
        assert(!validate('no_underscores+or?special$chars'));
        assert(!validate('ends-with-dash-'));
        assert(!validate('-starts-with-dash'));
        assert(!validate('asingle-domain-part-cannot-be-longer-than-sixty-three-characters'));

        // These verify that a hostname cannot be longer than 255 chars in total. However,
        // maximum string length verification cannot be performed in the same regex, so
        // these test cases fail. Users must additionall use the `maxlength` keyword in this case.
        // assert(!validate(maxLong1 + '.a'));
        // assert(!validate(maxLong2 + '.a'));


    
        
            var schema = { format: 'custom' },
                custom = '^\\d+$',
                validate = jsen(schema, {
                    formats: {
                        custom: custom
                    }
                });

            assert(validate('123'));
            assert(!validate('a123'));


        
            var schema = { format: 'custom' },
                custom = /^\d+$/,
                validate = jsen(schema, {
                    formats: {
                        custom: custom
                    }
                });

            assert(validate('123'));
            assert(!validate('a123'));


        
            var schema = { format: 'custom' },
                callCount = 0,
                custom = function (value, childSchema) {
                    assert(value.indexOf('123') > -1);
                    assert.strictEqual(childSchema, schema);

                    callCount++;

                    return /^\d+$/.test(value);
                },
                validate = jsen(schema, {
                    formats: {
                        custom: custom
                    }
                });

            assert(validate('123'));
            assert(!validate('a123'));
            assert.strictEqual(callCount, 2);


        
            var schema = { format: 'custom' },
                callCount = 0,
                options = {
                    formats: {
                        custom: function () {
                            callCount++;
                            return true;
                        }
                    }
                },
                validate = jsen(schema, options),
                data = [
                    undefined,
                    null,
                    'abc',
                    123,
                    Math.PI,
                    true,
                    false,
                    {},
                    [],
                    new Date()
                ];

            data.forEach(function (dataItem) {
                validate(dataItem);
                assert.strictEqual(callCount, 1);
                callCount = 0;
            });


        
            var schema = {
                    format: 'custom',
                    type: 'number',
                    maximum: 10
                },
                callCount = 0,
                options = {
                    formats: {
                        custom: function () {
                            callCount++;
                            return true;
                        }
                    }
                },
                validate = jsen(schema, options);

            assert(!validate(123));
            assert.strictEqual(callCount, 0);

            assert(validate(7));
            assert.strictEqual(callCount, 1);


    
        
            var schema = {
                    description: 'User account creation form',
                    type: 'object',
                    properties: {
                        password: {
                            type: 'string',
                            minLength: 8
                        },
                        password_confirm: {
                            type: 'string',
                            minLength: 8
                        }
                    },
                    format: 'passwordsMatch'
                },
                options = {
                    formats: {
                        passwordsMatch: function (obj) {
                            callCount++;
                            return obj.password === obj.password_confirm;
                        }
                    }
                },
                data = {
                    password: '1234567',
                    password_confirm: '1234567'
                },
                validate = jsen(schema, options),
                callCount = 0;

            assert(!validate(data));                // minLength validator failed
            assert.strictEqual(callCount, 0);

            data.password += '8';
            data.password_confirm += '9';

            assert(!validate(data));                // custom validator failed
            assert.strictEqual(callCount, 1);

            data.password_confirm = data.password;

            assert(validate(data));                 // OK
            assert.strictEqual(callCount, 2);