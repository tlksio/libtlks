var MongoClient = require('mongodb').MongoClient;

/**
 * get the latest talks
 * @param dburl     database url string
 * @param quantity  number of results to get
 * @param callback  function to execute with the resulting data
 */
exports.latest = function (dburl, quantity, callback) {
    "use strict";
    MongoClient.connect(dburl, function (err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.
            find({}).
            sort({created: -1}).
            limit(quantity).
            toArray(function (err, docs) {
                if (err) {
                    return callback(err, null);
                }
                db.close();
                return callback(null, docs);
            }
        );
    });
};

/**
 * get the most popular talks
 * @param dburl     database url string
 * @param quantity  number of results to get
 * @param callback  function to execute with the resulting data
 */
exports.popular = function (dburl, quantity, callback) {
    "use strict";
    MongoClient.connect(dburl, function (err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.
            find({}).
            sort({viewCount: -1}).
            limit(quantity).
            toArray(function (err, docs) {
                if (err) {
                    return callback(err, null);
                }
                db.close();
                return callback(null, docs);
            }
        );
    });
};

/**
 * create a new talk
 * @returns {boolean}
 */
exports.createTalk = function (dburl, obj, callback) {
    "use strict";
    MongoClient.connect(dburl, function (err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.insert(obj, function (err, docs) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            return callback(null, docs);
        });
    });
};

/**
 * get a talk
 * @returns {boolean}
 */
exports.get = function () {
    "use strict";
    return true;
};

/**
 * play a talk
 * @returns {boolean}
 */
exports.play = function () {
    "use strict";
    return true;
};

/**
 * get a talk tagged as
 * @returns {boolean}
 */
exports.getByTag = function () {
    "use strict";
    return true;
};

/**
 * get a talk by its slug field
 * @returns {boolean}
 */
exports.getBySlug = function () {
    "use strict";
    return true;
};

/**
 * get related talks
 * @returns {boolean}
 */
exports.related = function () {
    "use strict";
    return true;
};

/**
 * get a talk by its author id
 * @returns {boolean}
 */
exports.getByAuthorId = function () {
    "use strict";
    return true;
};