var assert = require("assert");
var tlks = require("../index.js");

var dburl = "mongodb://dbuser:dbpass@ds043180.mongolab.com:43180/techtalks";

describe('Talk', function () {

    it('get the latest talks', function (done) {
        tlks.talk.latest(dburl, 5, function (err, docs) {
            if (err) {
                throw new Error(err);
            }
            assert.notEqual(docs, null);
            done();
        });
    });

    it('get the most popular talks', function (done) {
        tlks.talk.popular(dburl, 5, function (err, docs) {
            if (err) {
                throw new Error(err);
            }
            assert.notEqual(docs, null);
            done();
        });
    });

    it('create a new talk', function (done) {
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
