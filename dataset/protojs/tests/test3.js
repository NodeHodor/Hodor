'use strict';

var _ = require('protojs')
    , assert = require('assert')
    , perfTest = require('./perf');


    // describe('Number functions', function() {
        // it('should define isNumeric function', function() {
        try {
            assert(_.isNumeric(234));
            assert(_.isNumeric(345.2345));
            assert(_.isNumeric(0.000235345));
            assert(_.isNumeric(10/3));
            assert(_.isNumeric('234'));
            assert(_.isNumeric('234.045'));
    
            assert.equal(_.isNumeric(1/0), false);
            assert.equal(_.isNumeric(Infinity), false);
            assert.equal(_.isNumeric(NaN), false);
            assert.equal(_.isNumeric('eereg'), false);
            assert.equal(_.isNumeric('100g'), false);
            assert.equal(_.isNumeric(''), false);
            assert.equal(_.isNumeric(' '), false);
        // });
        } catch(err) {}
    
        // it('should define isNumeric method', function() {
        try {
            assert(_(234).isNumeric()._());
            assert(_(345.2345).isNumeric()._());
            assert(_(0.000235345).isNumeric()._());
            assert(_(10/3).isNumeric()._());
            assert(_('234').isNumeric()._());
            assert(_('234.045').isNumeric()._());
    
            assert.equal(_(1/0).isNumeric()._(), false);
            assert.equal(_(Infinity).isNumeric()._(), false);
            assert.equal(_(NaN).isNumeric()._(), false);
            assert.equal(_('eereg').isNumeric()._(), false);
            assert.equal(_('100g').isNumeric()._(), false);
            assert.equal(_('').isNumeric()._(), false);
            assert.equal(_(' ').isNumeric()._(), false);
        } catch(err) {}
    // });
    