var assert = require("assert");
var util = require('util');

var tlks = require("../index.js");
var config = {
    dburl: process.env.DBURL
};

describe('Talk', function () {

    describe('get the latest talks', function () {

        var result;

        before( function (done) {
            this.timeout(0);
            tlks.talk.latest(config.dburl, 5, function (err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                done();
            });
        });

        it('returns not null', function (done) {
            assert.notEqual(result, null);
            done();
        });

        it('returns an array', function (done) {
            assert.equal(true, util.isArray(result));
            done();
        });

    });

    describe ('get the most popular talks', function () {

        var result;

        before( function (done) {
            this.timeout(0);
            tlks.talk.popular(config.dburl, 5, function (err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                done();
            });
        });

        it('returns not null', function (done) {
            assert.notEqual(result, null);
            done();
        });

        it('returns an array', function (done) {
            assert.equal(true, util.isArray(result));
            done();
        });

    });

    describe ('create a new talk', function () {

        var result;

        before( function (done) {
            this.timeout(0);
            var talk = {
                id: 'talk_id',
                code: 'talk_code',
                title: 'Talk title',
                slug: 'talk-title',
                description: 'Talk description',
                author: {
                    id: 'author_authorid',
                    username: 'author_username',
                    avatar: 'http://example.com/avatar.jpg'
                },
                viewCount: 0,
                voteCount: 0,
                votes: [],
                favoriteCount: 0,
                favorites: [],
                tags: [
                    'tag1',
                    'tag2',
                    'tag3'
                ],
                created: 1423881000025,
                updated: 1423881000025
            };
            tlks.talk.createTalk(config.dburl, talk, function (err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                done();
            });
        });

        it('returns not null', function (done) {
            assert.notEqual(result, null);
            done();
        });

    });

    describe('get a talk', function () {

        var result;

        before( function (done) {
            this.timeout(0);
            tlks.talk.get(config.dburl, 'talk_id', function (err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                done();
            });
        });

        it('returns not null', function (done) {
            assert.notEqual(result, null);
            done();
        });

    });

    describe('play a talk', function () {

        var result;

        before( function (done) {
            this.timeout(0);
            tlks.talk.play(config.dburl, 'talk_id', function (err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                done();
            });
        });

        it('returns not null', function (done) {
            assert.notEqual(result, null);
            done();
        });

    });

    it('get a talk tagged as', function (done) {
        this.timeout(0);
        tlks.talk.getByTag(config.dburl, 'tag1', function (err, docs) {
            if (err) {
                throw new Error(err);
            }
            assert.notEqual(docs, null);
            done();
        });
    });

    it('get a talk by its slug field', function (done) {
        this.timeout(0);
        tlks.talk.getBySlug(config.dburl, 'talk-title', function (err, docs) {
            if (err) {
                throw new Error(err);
            }
            assert.notEqual(docs, null);
            done();
        });
    });

    it('get related talks', function (done) {
        this.timeout(0);
        tlks.talk.get(config.dburl, 'talk_id', function (err, docs) {
            if (err) {
                throw new Error(err);
            }
            tlks.talk.related(config.dburl, docs, function (err, docs) {
                if (err) {
                    throw new Error(err);
                }
                assert.notEqual(docs, null);
                done();
            });
        });
    });

    it('get a talk by its author id', function (done) {
        this.timeout(0);
        tlks.talk.getByAuthorId(config.dburl, 'talk_id', function (err, docs) {
            if (err) {
                throw new Error(err);
            }
            assert.notEqual(docs, null);
            done();
        });
    });

    it('delete a talk', function (done) {
        this.timeout(0);
        tlks.talk.deleteTalk(config.dburl, 'talk_id', function (err, docs) {
            if (err) {
                throw new Error(err);
            }
            assert.equal(docs, true);
            done();
        });
    });

});
