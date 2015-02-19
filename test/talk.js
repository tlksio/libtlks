var assert = require("assert");
var tlks = require("../index.js");

var dburl = "mongodb://dbuser:dbpass@ds043180.mongolab.com:43180/techtalks";

describe('Talk', function () {

    it('get the latest talks', function (done) {
        this.timeout(0);
        tlks.talk.latest(dburl, 5, function (err, docs) {
            if (err) {
                throw new Error(err);
            }
            assert.notEqual(docs, null);
            done();
        });
    });

    it('get the most popular talks', function (done) {
        this.timeout(0);
        tlks.talk.popular(dburl, 5, function (err, docs) {
            if (err) {
                throw new Error(err);
            }
            assert.notEqual(docs, null);
            done();
        });
    });

    it('create a new talk', function (done) {
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
        tlks.talk.createTalk(dburl, talk, function (err, docs) {
            if (err) {
                throw new Error(err);
            }
            assert.notEqual(docs, null);
            done();
        });
    });

    it('get a talk', function (done) {
        this.timeout(0);
        tlks.talk.get(dburl, 'talk_id', function (err, docs) {
            if (err) {
                throw new Error(err);
            }
            assert.notEqual(docs, null);
            done();
        });
    });

    it('play a talk', function (done) {
        assert.equal(tlks.talk.play(), true);
        done();
    });

    it('get a talk tagged as', function (done) {
        assert.equal(tlks.talk.getByTag(), true);
        done();
    });

    it('get a talk by its slug field', function (done) {
        this.timeout(0);
        tlks.talk.getBySlug(dburl, 'talk-title', function (err, docs) {
            if (err) {
                throw new Error(err);
            }
            assert.notEqual(docs, null);
            done();
        });
    });

    it('get related talks', function (done) {
        assert.equal(tlks.talk.related(), true);
        done();
    });

    it('get a talk by its author id', function (done) {
        this.timeout(0);
        tlks.talk.getByAuthorId(dburl, 'talk_id', function (err, docs) {
            if (err) {
                throw new Error(err);
            }
            assert.notEqual(docs, null);
            done();
        });
    });

    it('delete a talk', function (done) {
        this.timeout(0);
        tlks.talk.deleteTalk(dburl, 'talk_id', function (err, docs) {
            if (err) {
                throw new Error(err);
            }
            assert.equal(docs, true);
            done();
        });
    });

});
