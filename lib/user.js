var MongoClient = require('mongodb').MongoClient;

/**
 * get user by username
 *
 * @param dburl     string      Database url
 * @param username  string      User username string
 * @param callback  function    Callback to execute, receives user json object
 */
exports.getByUsername = function(dburl, username, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var users = db.collection('users');
        users.findOne({"username": username}, function (err, profile) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            callback(null, profile);
        });
    });
};

/**
 * get user by identifier
 *
 * @param dburl       string      Database url
 * @param identifier  string      User identifier string
 * @param callback    function    Callback to execute, receives user json object
 */
exports.getById = function(dburl, identifier, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var users = db.collection('users');
        users.findOne({"id": identifier}, function (err, profile) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            callback(null, profile);
        });
    });
};

/**
 * get users by an array of identifiers
 *
 * @param dburl        string   Database url
 * @param identifiers  array    Array of users identifiers
 * @param callback     function Callback to execute, receives user json object
 */
exports.getByIdentifiers = function(dburl, identifiers, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var users = db.collection('users');
        users
	    .find({
	        'id': {
		    '$in': identifiers
	        }
            })
            .toArray(function(err, docs) {
                if (err) {
                    return callback(err, null);
                }

                db.close();
                return callback(null, docs);
            });
    });
};

/**
 * create a new user
 *
 * @param dburl     string      Database url
 * @param user      object      User json obj
 * @param callback  function    Callback to execute, receives user json object
 */
exports.create = function(dburl, user, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var users = db.collection('users');
        users.insert(user, function (err, user) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            callback(null, user);
        });
    });
};

/**
 * update existing user
 *
 * @param dburl     string      Database url
 * @param user      object      User json obj
 * @param callback  function    Callback to execute, receives user json object
 */
exports.update = function(dburl, user, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var users = db.collection('users');
        users.update({"id": user.id}, {
            $set: {
                bio: user.bio,
                email: user.email,
                updated: Date.now()
            }
        }, function (err) {
            if (err) {
                return callback(err);
            }
            db.close();
            callback(null);
        });
    });
};
