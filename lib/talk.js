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
exports.deleteTalk = function (dburl, id, callback) {
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
            return callback(null, docs);
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
 * Updates views field by 1.
 * @param dburl     database url string
 * @param id        Talk id
 * @param callback  function to execute with the resulting data
 */
exports.play = function (dburl, id, callback) {
    "use strict";
    MongoClient.connect(dburl, function (err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.findOne({"id": id}, function (err, talk) {
            if (err) {
                return callback(err, null);
            }
            talk.ViewCount = talk.viewCount + 1;
            talks.update({"id": id}, {
                $set: {
                    viewCount: talk.viewCount,
                    updated: Date.now()
                }
            }, function (err) {
                if (err) {
                    return callback(err, null);
                }
                db.close();
                return callback(null, talk);
            });
        });
    });
};

/**
 * get a talk by tag
 * @param dburl     database url string
 * @param tag       talk tag string
 * @param callback  function to execute with the resulting data
 */
exports.getByTag = function (dburl, tag, callback) {
    "use strict";
    MongoClient.connect(dburl, function (err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.find({tags: tag}).sort({viewCount: -1}).toArray(function (err, docs) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            return callback(null, docs);
        });
    });
    return true;
};

/**
 * get a talk by its slug field
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
 * get reltated talks from a talk
 * @param dburl     database url string
 * @param talk      talk object
 * @param callback  function to execute with the resulting data
 */
exports.related = function (dburl, talk, callback) {
    "use strict";
    MongoClient.connect(dburl, function (err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.find({"tags": {$in: talk.tags}}).toArray(function (err, docs) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            return callback(null, docs);
        });
    });
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
