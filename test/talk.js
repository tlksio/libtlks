var assert = require("assert");
var util = require('util');

var talks = require("../index.js").talk;

var config = {
    dburl: process.env.DBURL
};

describe('Talk', function() {

    describe('get the latest talks', function() {

        var result;

        before(function(done) {
            this.timeout(0);
            talks.latest(config.dburl, 5, function(err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                done();
            });
        });

        it('returns not null', function(done) {
            assert.notEqual(result, null);
            done();
        });

        it('returns an array', function(done) {
            assert.equal(true, util.isArray(result));
            done();
        });

        it('array elements have _id field not null', function() {
            result.every(function(el) {
                var hasid = el ? hasOwnProperty.call(el, "_id") : false;
                assert.equal(true, hasid);
                assert.notEqual(null, el._id);
                assert.notEqual('', el._id);
                return hasid;
            });
        });

    });

    describe('get the most popular talks', function() {

        var result;

        before(function(done) {
            this.timeout(0);
            talks.popular(config.dburl, 5, function(err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                done();
            });
        });

        it('returns not null', function(done) {
            assert.notEqual(result, null);
            done();
        });

        it('returns an array', function(done) {
            assert.equal(true, util.isArray(result));
            done();
        });

        it('array elements have _id field not null', function() {
            result.every(function(el) {
                var hasid = el ? hasOwnProperty.call(el, "_id") : false;
                assert.equal(true, hasid);
                assert.notEqual(null, el._id);
                assert.notEqual('', el._id);
                return hasid;
            });
        });

    });

    describe('create a new talk', function() {

        var result;

        before(function(done) {
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
            talks.createTalk(config.dburl, talk, function(err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                done();
            });
        });

        it('returns not null', function(done) {
            assert.notEqual(result, null);
            done();
        });

    });

    describe('get a talk', function() {

        var result;

        before(function(done) {
            this.timeout(0);
            talks.get(config.dburl, 'talk_id', function(err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                done();
            });
        });

        it('returns not null', function(done) {
            assert.notEqual(result, null);
            done();
        });

    });

    describe('play a talk', function() {

        var result;

        before(function(done) {
            this.timeout(0);
            talks.play(config.dburl, 'talk-title', function(err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                done();
            });
        });

        it('returns not null', function(done) {
            assert.notEqual(result, null);
            done();
        });

    });

    describe('vote a talk', function() {

        var result;

        before(function(done) {
            this.timeout(0);
            talks.upvote(config.dburl, "talk_id", "userid", function(err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                done();
            });
        });

        it('returns not null', function(done) {
            assert.notEqual(result, null);
            done();
        });

    });

    describe('favorite a talk', function() {

        var result;

        before(function(done) {
            this.timeout(0);
            talks.favorite(config.dburl, "talk_id", "userid", function(err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                done();
            });
        });

        it('returns not null', function(done) {
            assert.notEqual(result, null);
            done();
        });

    });

    describe('unfavorite a talk', function() {

        var result;

        before(function(done) {
            this.timeout(0);
            talks.unfavorite(config.dburl, "talk_id", "userid", function(err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                done();
            });
        });

        it('returns not null', function(done) {
            assert.notEqual(result, null);
            done();
        });

    });


    describe('get a talk tagged as', function() {

        var result;

        before(function(done) {
            this.timeout(0);
            talks.getByTag(config.dburl, 'tag1', function(err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                done();
            });
        });

        it('returns not null', function(done) {
            assert.notEqual(result, null);
            done();
        });

    });

    describe('get a talk by its slug field', function() {

        var result;

        before(function(done) {
            this.timeout(0);
            talks.getBySlug(config.dburl, 'talk-title', function(err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                done();
            });
        });

        it('returns not null', function(done) {
            assert.notEqual(result, null);
            done();
        });

    });

    describe('get related talks', function() {

        var result;

        before(function(done) {
            this.timeout(0);
            talks.get(config.dburl, 'talk_id', function(err, docs) {
                if (err) {
                    throw new Error(err);
                }
                talks.related(config.dburl, docs, function(err, docs) {
                    if (err) {
                        throw new Error(err);
                    }
                    result = docs;
                    done();
                });
            });
        });

        it('returns not null', function(done) {
            assert.notEqual(result, null);
            done();
        });

    });

    describe('get a talk by its author id', function() {

        var result;

        before(function(done) {
            this.timeout(0);
            talks.getByAuthorId(config.dburl, 'talk_id', function(err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                done();
            });
        });

        it('returns not null', function(done) {
            assert.notEqual(result, null);
            done();
        });

    });

    describe('delete a talk', function() {

        var result;

        before(function(done) {
            this.timeout(0);
            talks.deleteTalk(config.dburl, 'talk_id', function(err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs
                done();
            });
        });

        it('returns not null', function(done) {
            assert.notEqual(result, null);
            done();
        });

    });

});
