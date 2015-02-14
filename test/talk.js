var assert = require("assert");
var tlks = require("../index.js");

describe('Talk', function () {

    it('get the latest talks', function () {
        assert.equal(tlks.talk.latest(), true);
    });

    it('get the most popular talks', function () {
        assert.equal(tlks.talk.popular(), true);
    });

    it('create a new talk', function () {
        assert.equal(tlks.talk.create(), true);
    });

    it('get a talk', function () {
        assert.equal(tlks.talk.get(), true);
    });

    it('play a talk', function () {
        assert.equal(tlks.talk.play(), true);
    });

    it('get a talk tagged as', function () {
        assert.equal(tlks.talk.getByTag(), true);
    });

    it('get a talk by its slug field', function () {
        assert.equal(tlks.talk.getBySlug(), true);
    });

    it('get related talks', function () {
        assert.equal(tlks.talk.related(), true);
    });

    it('get a talk by its author id', function () {
        assert.equal(tlks.talk.getByAuthorId(), true);
    });

});
