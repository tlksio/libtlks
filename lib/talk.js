var MongoClient = require('mongodb').MongoClient;

/**
 * search all talks
 * @param indexpath full-text index path string
 * @param callback  function to execute with the resulting data
 */
exports.search = function(index, q, callback) {
    "use strict";
    var si = require('search-index')({
        indexPath: index
    });
    si.search(q, function(err, results) {
        if (err) {
            throw new Error(err);
        }
        return callback(null, results);
    });
};

/**
 * get all the talks
 * @param dburl     database url string
 * @param callback  function to execute with the resulting data
 */
exports.all = function(dburl, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.
        find({}).
        toArray(function(err, docs) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            return callback(null, docs);
        });
    });
};

/**
 * get the latest talks
 * @param dburl     database url string
 * @param quantity  number of results to get
 * @param callback  function to execute with the resulting data
 */
exports.latest = function(dburl, quantity, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.
        find({}).
        sort({
            created: -1
        }).
        limit(quantity).
        toArray(function(err, docs) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            return callback(null, docs);
        });
    });
};

/**
 * get the most popular talks
 * @param dburl     database url string
 * @param quantity  number of results to get
 * @param callback  function to execute with the resulting data
 */
exports.popular = function(dburl, quantity, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.
        find({}).
        sort({
            votesCount: -1,
            viewCount: -1
        }).
        limit(quantity).
        toArray(function(err, docs) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            return callback(null, docs);
        });
    });
};

/**
 * create a new talk
 * @param dburl     database url string
 * @param obj       number of results to get
 * @param callback  function to execute with the resulting data
 */
exports.createTalk = function(dburl, obj, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.insert(obj, function(err, docs) {
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
exports.deleteTalk = function(dburl, id, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.remove({
            id: id
        }, function(err, docs) {
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
exports.get = function(dburl, id, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.findOne({
            id: id
        }, function(err, doc) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            return callback(null, doc);
        });
    });
};

/**
 * upvote a talk
 * @param dburl     database url string
 * @param id        Talk id
 * @param userid    User that upvotes the talk
 * @param callback  function to execute with the resulting data
 */
exports.upvote = function(dburl, id, userid, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.update({
            "id": id,
            "votes": {
                "$ne": userid
            }
        }, {
            "$inc": {
                "voteCount": 1
            },
            "$push": {
                "votes": userid
            }
        }, function(err, talk) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, talk);
        });
    });
};


/**
 * favorite a talk
 * @param dburl     database url string
 * @param id        Talk id
 * @param userid    User that favorites the talk
 * @param callback  function to execute with the resulting data
 */
exports.favorite = function(dburl, id, userid, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.update({
            "id": id,
            "favorites": {
                "$ne": userid
            }
        }, {
            "$inc": {
                "favoriteCount": 1
            },
            "$push": {
                "favorites": userid
            }
        }, function(err, talk) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, talk);
        });
    });
};

/**
 * unfavorite a talk
 * @param dburl     database url string
 * @param id        Talk id
 * @param userid    User that favorites the talk
 * @param callback  function to execute with the resulting data
 */
exports.unfavorite = function(dburl, id, userid, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.update({
            "id": id,
            "favorites": {
                "$in": [userid]
            }
        }, {
            "$inc": {
                "favoriteCount": -1
            },
            "$pull": {
                "favorites": userid
            }
        }, function(err, talk) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, talk);
        });
    });
};

/**
 * rank a a talk
 * Update raking score field
 * @param dburl     database url string
 * @param id        Talk Unique ID
 * @param score     Raking score
 * @param callback  function to execute with the resulting data
 */
exports.rank = function(dburl, id, score, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.update({
            "id": id
        }, {
            $set: {
                "ranking": score
            }
        }, function(err) {
            if (err) {
                return callback(err);
            }
            db.close();
            return callback(null);
        });
    });

};

/**
 * play a talk
 * Updates views field by 1.
 * @param dburl     database url string
 * @param slug      Talk slug
 * @param callback  function to execute with the resulting data
 */
exports.play = function(dburl, slug, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.findOne({
            "slug": slug
        }, function(err, talk) {
            if (err) {
                return callback(err, null);
            }
            talk.viewCount = talk.viewCount + 1;
            talks.update({
                "slug": slug
            }, {
                $inc: {
                    "viewCount": 1
                },
                $set: {
                    updated: Date.now()
                }
            }, function(err) {
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
exports.getByTag = function(dburl, tag, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.find({
            tags: tag
        }).sort({
            viewCount: -1
        }).toArray(function(err, docs) {
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
exports.getBySlug = function(dburl, slug, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.find({
            "slug": slug
        }).toArray(function(err, docs) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            return callback(null, docs);
        });
    });
};

/**
 * get reltated talks from a list of tags
 * @param dburl     string      database url string
 * @param id        int         referenced talk
 * @param tags      Array       list of tag strings
 * @param callback  function    to execute with the resulting data
 */
exports.related = function(dburl, id, tags, quantity, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.find({
                "tags": {
                    $in: tags
                },
                "id": {
                    "$ne": id
                }
            })
            .limit(quantity)
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
 * get a talk by its id
 * @param dburl     database url string
 * @param id        author id string
 * @param callback  function to execute with the resulting data
 */
exports.getByAuthorId = function(dburl, id, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.find({
            "author.id": id
        }).sort({
            "created": -1
        }).toArray(function(err, docs) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            return callback(null, docs);
        });
    });
};

/**
 * get list of talks upvoted by an user
 * @param dburl     database url string
 * @param userid        author id string
 * @param callback  function to execute with the resulting data
 */
exports.getUpvotedByAuthorId = function(dburl, userid, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.find({
            "votes": {
                "$in": [userid]
            }
        }).sort({
            "created": -1
        }).toArray(function(err, docs) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            return callback(null, docs);
        });
    });
};

/**
 * get list of talks favorited by an user
 * @param dburl     database url string
 * @param userid    author id string
 * @param callback  function to execute with the resulting data
 */
exports.getFavoritedByAuthorId = function(dburl, userid, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.find({
            "favorites": {
                "$in": [userid]
            }
        }).sort({
            "created": -1
        }).toArray(function(err, docs) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            return callback(null, docs);
        });
    });
};
