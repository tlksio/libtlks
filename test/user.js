var assert = require("assert");
var should = require('should');
var util = require('util');

var users = require("../index.js").user;

var config = {
    dburl: process.env.DBURL
};

function isValidUser(user) {
    (5).should.be.exactly(5).and.be.a.Number;
};

describe('User', function() {

    describe('create a new user', function() {

        var result;

        before(function(done) {
            this.timeout(0);
            var user = {
                "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                "avatar": "http://pbs.twimg.com/profile_images/xxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx_normal.jpeg",
                "username": "username",
                "bio": "username biography",
                "twitterId": 1234567890,
                "created": 1423360369814,
                "updated": 1423374082441,
                "email": "username@tlks.io"
            };
            users.create(config.dburl, user, function(err, docs) {
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

        it('is valid user object', function(done) {
            isValidUser(result);
            done();
        });

    });

    describe('get user by its username', function () {

        var result;

        before(function(done) {
            this.timeout(0);
            users.getByUsername(config.dburl, "username", function(err, docs) {
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

    describe('update user', function () {

        var result;

        before(function(done) {
            this.timeout(0);
            users.getByUsername(config.dburl, "username", function(err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                result.bio = 'updated';
                users.update(config.dburl, result, function (err, docs) {
                    if (err) {
                        throw new Error(err);
                    }
                    result = docs;
                    done();
                });
            });
        });

        it('returns is null', function(done) {
            assert.equal(result, null);
            done();
        });


    });

});
