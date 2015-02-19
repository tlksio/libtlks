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
 * @param dburl     database url string
 * @param obj       number of results to get
 * @param callback  function to execute with the resulting data
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
 * delete a talk by its id
 * @param dburl     database url string
 * @param id        talk id string
 * @param callback  function to execute with the resulting data
 */
exports.delete = function (dburl, id, callback) {
    "use strict";
    MongoClient.connect(dburl, function (err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.remove({id: id}, function (err, docs) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            return callback(null, true);
        });
    });
};

/**
 * get a talk by its id
 * @param dburl     database url string
 * @param id        talk id string
 * @param callback  function to execute with the resulting data
 */
exports.get = function (dburl, id, callback) {
    "use strict";
    MongoClient.connect(dburl, function (err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.findOne({id: id}, function (err, doc) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            return callback(null, doc);
        });
    });
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
 * get a talk by its id
 * @param dburl     database url string
 * @param slug      talk slug string
 * @param callback  function to execute with the resulting data
 */
exports.getBySlug = function (dburl, slug, callback) {
    "use strict";
    MongoClient.connect(dburl, function (err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.find({"slug": slug}).toArray(function (err, docs) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            return callback(null, docs);
        });
    });
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
 * get a talk by its id
 * @param dburl     database url string
 * @param id        author id string
 * @param callback  function to execute with the resulting data
 */
exports.getByAuthorId = function (dburl, id, callback) {
    "use strict";
    MongoClient.connect(dburl, function (err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.find({"author.id": id}).toArray(function (err, docs) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            return callback(null, docs);
        });
    });
};
