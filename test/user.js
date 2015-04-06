var MongoClient = require('mongodb').MongoClient;
var should = require("should");
var should = require('should');
var util = require('util');

var users = require("../index.js").user;

var config = {
    dburl: process.env.DBURL
};

/**
 * validate an object to check if it is a valid user
 * @param user  object user to check
 */
function isValidUser(user) {
    "use strict";

    user.should.have.properties([
        "id",
        "avatar",
        "username",
        "bio",
        "twitterId",
        "created",
        "updated",
        "email",
    ]);
}

describe('User', function() {
    "use strict";

    before(function(done) {
        if (!config.dburl) {
            console.log("ERROR: DBURL environment variable doesn't exists!");
            process.exit();
        }
        done();
    });

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
            should.notEqual(result, null, "user created object is not null");
            done();
        });

        it('returns a one element list', function(done) {
            should.equal(true, util.isArray(result));
            result.should.have.length(1);
            done();
        });

        it('is valid user object', function(done) {
            var user = result[0];
            isValidUser(user);
            done();
        });

    });

    describe('get user by its username', function() {

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
            should.notEqual(result, null);
            done();
        });

        it('is valid user object', function(done) {
            var user = result;
            isValidUser(user);
            done();
        });

    });

    describe('update user', function() {

        var result;

        before(function(done) {
            this.timeout(0);
            users.getByUsername(config.dburl, "username", function(err, docs) {
                if (err) {
                    throw new Error(err);
                }
                result = docs;
                result.bio = 'updated';
                users.update(config.dburl, result, function(err, docs) {
                    if (err) {
                        throw new Error(err);
                    }
                    result = docs;
                    done();
                });
            });
        });

        it('returns is null', function(done) {
            should.equal(result, null);
            done();
        });

    });

    after(function(done) {
        this.timeout(0);
        MongoClient.connect(config.dburl, function(err, db) {
            if (err) {
                return callback(err, null);
            }
            var users = db.collection('users');
            users.remove({
                "username": "username"
            }, function(err, data) {
                if (err) {
                    return callback(err, null);
                }
                db.close();
                done();
            });
        });
    });

});
