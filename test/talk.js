var should = require("should");
var util = require('util');

var talks = require("../index.js").talk;

var config = {
    dburl: process.env.DBURL
};

function isValidTalk(talk) {
    "use strict";

    talk.should.have.properties([
        "id",
        "code",
        "title",
        "slug",
        "description",
        "author",
        "viewCount",
        "voteCount",
        "votes",
        "favoriteCount",
        "favorites",
        "tags",
        "created",
        "updated"
    ]);
}

describe('Talk', function() {
    "use strict";

    before(function(done) {
        if (!config.dburl) {
            console.log("ERROR: DBURL environment variable doesn't exists!");
            process.exit();
        }
        done();
    });

    describe('get the latest talks', function() {

        var result;

        before(function(done) {
            this.timeout(0);
            talks.latest(config.dburl, 5, 1, function(err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                done();
            });
        });

        it('returns not null', function(done) {
            should.notEqual(result, null);
            done();
        });

        it('returns an array', function(done) {
            should.equal(true, util.isArray(result));
            done();
        });

        it('is valid talk object', function(done) {
            result.forEach(function(el) {
                isValidTalk(el);
            });
            done();
        });

    });



    describe('get the most popular talks', function() {

        var result;

        before(function(done) {
            this.timeout(0);
            talks.popular(config.dburl, 5, 1, function(err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                done();
            });
        });

        it('returns not null', function(done) {
            should.notEqual(result, null);
            done();
        });

        it('returns an array', function(done) {
            should.equal(true, util.isArray(result));
            done();
        });

        it('is valid talk object', function(done) {
            result.forEach(function(el) {
                isValidTalk(el);
            });
            done();
        });

    });


   describe('get the most popular talks without passing pageNumber', function() {

        var result;

        before(function(done) {
            this.timeout(0);
            talks.popular(config.dburl, 10, null, function(err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                done();
            });
        });

        it('returns not null', function(done) {
            should.notEqual(result, null);
            done();
        });

        it('returns an array', function(done) {
            should.equal(true, util.isArray(result));
            done();
        });

        it('is valid talk object', function(done) {
            result.forEach(function(el) {
                isValidTalk(el);
            });
            done();
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
            should.notEqual(result, null);
            done();
        });

        it('is valid talk object', function(done) {
            result.forEach(function(el) {
                isValidTalk(el);
            });
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
            should.notEqual(result, null);
            done();
        });

        it('is valid talk object', function(done) {
            isValidTalk(result);
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
            should.notEqual(result, null);
            done();
        });

        it('is valid talk object', function(done) {
            isValidTalk(result);
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
            should.notEqual(result, null);
            done();
        });

        it('sucsessful vote is equal to 1', function(done) {
            should.equal(result, 1);
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
            should.notEqual(result, null);
            done();
        });

        it('successful favorite is equal to 1', function(done) {
            should.equal(result, 1);
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
            should.notEqual(result, null);
            done();
        });

        it('successful unfavorite is equal to 1', function(done) {
            should.equal(result, 1);
            done();
        });

    });


    describe('get a talk tagged as', function() {

        var result;

        before(function(done) {
            this.timeout(0);
            talks.getByTag(config.dburl, 'tag1', 25, 1, function(err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                done();
            });
        });

        it('returns not null', function(done) {
            should.notEqual(result, null);
            done();
        });

        it('is valid talk object', function(done) {
            result.forEach(function(el) {
                isValidTalk(el);
            });
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
            should.notEqual(result, null);
            done();
        });

        it('is valid talk object', function(done) {
            result.forEach(function(el) {
                isValidTalk(el);
            });
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
                talks.related(config.dburl, docs.id, docs.tags, 5, function(err, docs) {
                    if (err) {
                        throw new Error(err);
                    }
                    result = docs;
                    done();
                });
            });
        });

        it('returns not null', function(done) {
            should.notEqual(result, null);
            done();
        });

        it('is valid talk object', function(done) {
            result.forEach(function(el) {
                isValidTalk(el);
            });
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
            should.notEqual(result, null);
            done();
        });

        it('is valid talk object', function(done) {
            result.forEach(function(el) {
                isValidTalk(el);
            });
            done();
        });

    });

    describe('get talks upvoted by an user', function() {

        var result;

        before(function(done) {
            this.timeout(0);
            talks.getUpvotedByAuthorId(config.dburl, 'author_authorid', function(err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                done();
            });
        });

        it('returns not null', function(done) {
            should.notEqual(result, null);
            done();
        });

        it('is valid talk object', function(done) {
            result.forEach(function(el) {
                isValidTalk(el);
            });
            done();
        });

    });

    describe('get upvoted talks by an user', function() {

        var result;

        before(function(done) {
            this.timeout(0);
            talks.getFavoritedByAuthorId(config.dburl, 'author_authorid', function(err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                done();
            });
        });

        it('returns not null', function(done) {
            should.notEqual(result, null);
            done();
        });

        it('is valid talk object', function(done) {
            result.forEach(function(el) {
                isValidTalk(el);
            });
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
                result = docs;
                done();
            });
        });

        it('returns not null', function(done) {
            should.notEqual(result, null);
            done();
        });

        it('successful delete is equal to 1', function(done) {
            should.equal(1, result);
            done();
        });

    });

});
