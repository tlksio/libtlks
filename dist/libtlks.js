var packagejson = require('./package.json');

exports.version = packagejson.version;

exports.talk = require('./lib/talk.js');
exports.user = require('./lib/user.js');

var MongoClient = require('mongodb').MongoClient;

/**
 * search all talks
 * @param index     full-text index path string
 * @param q         string query to search
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
        talks
            .find({})
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
 * get the latest talks
 * @param dburl         database url string
 * @param quantity      number of results to get
 * @param pageNumber    page number to get results
 * @param callback      function to execute with the resulting data
 */
exports.latest = function(dburl, quantity, pageNumber, callback) {
    "use strict";
    var sort = {
        created: -1
    };
    return searchTalks(dburl, {}, sort, quantity, pageNumber, callback);
};

/**
 * get the most popular talks
 * @param dburl         database url string
 * @param quantity      number of results to get
 * @param pageNumber    page number to get results
 * @param callback      function to execute with the resulting data
 */
exports.popular = function(dburl, quantity, pageNumber, callback) {
    "use strict";
    var conds = {};
    var sort = {
        voteCount: -1,
        viewCount: -1
    };
    return searchTalks(dburl, conds, sort, quantity, pageNumber, callback);
};

/**
 * generic method for getting talks
 * @param dburl         database url string
 * @param conds         search and filter conditions
 * @param sort          sorting conditions
 * @param quantity      number of results to fetch
 * @param pageNumber    page number to get
 * @param callback      function to execute with the resulting data
 */
function searchTalks(dburl, conds, sort, quantity, pageNumber, callback) {
    "use strict";
    pageNumber = pageNumber || 1;
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks
            .find(conds)
            .sort(sort)
            .skip(pageNumber > 0 ? ((pageNumber - 1) * quantity) : 0)
            .limit(quantity)
            .toArray(function(err, docs) {
                if (err) {
                    return callback(err, null);
                }
                db.close();
                return callback(null, docs);
            });
    });
}


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
            db.close();
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
            db.close();
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
            db.close();
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
 * @param dburl         database url string
 * @param tag           talk tag string
 * @param quantity      quantity of talks to fetch
 * @param pageNumber    page number to get
 * @param callback      function to execute with the resulting data
 */
exports.getByTag = function(dburl, tag, quantity, pageNumber, callback) {
    "use strict";
    var conds = {
        tags: tag
    };
    var sort = {
        created: -1
    };
    return searchTalks(dburl, conds, sort, quantity, pageNumber, callback);
};

/**
 * get a talk by its slug field
 * @param dburl         database url string
 * @param slug          talk slug string
 * @param callback      function to execute with the resulting data
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
        talks
            .find({
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
 * @param userid    author id string
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

var MongoClient = require('mongodb').MongoClient;

/**
 * get user by username
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
 * create a new user
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIiwidGFsay5qcyIsInVzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOWdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImxpYnRsa3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgcGFja2FnZWpzb24gPSByZXF1aXJlKCcuL3BhY2thZ2UuanNvbicpO1xuXG5leHBvcnRzLnZlcnNpb24gPSBwYWNrYWdlanNvbi52ZXJzaW9uO1xuXG5leHBvcnRzLnRhbGsgPSByZXF1aXJlKCcuL2xpYi90YWxrLmpzJyk7XG5leHBvcnRzLnVzZXIgPSByZXF1aXJlKCcuL2xpYi91c2VyLmpzJyk7XG4iLCJ2YXIgTW9uZ29DbGllbnQgPSByZXF1aXJlKCdtb25nb2RiJykuTW9uZ29DbGllbnQ7XG5cbi8qKlxuICogc2VhcmNoIGFsbCB0YWxrc1xuICogQHBhcmFtIGluZGV4ICAgICBmdWxsLXRleHQgaW5kZXggcGF0aCBzdHJpbmdcbiAqIEBwYXJhbSBxICAgICAgICAgc3RyaW5nIHF1ZXJ5IHRvIHNlYXJjaFxuICogQHBhcmFtIGNhbGxiYWNrICBmdW5jdGlvbiB0byBleGVjdXRlIHdpdGggdGhlIHJlc3VsdGluZyBkYXRhXG4gKi9cbmV4cG9ydHMuc2VhcmNoID0gZnVuY3Rpb24oaW5kZXgsIHEsIGNhbGxiYWNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIHNpID0gcmVxdWlyZSgnc2VhcmNoLWluZGV4Jykoe1xuICAgICAgICBpbmRleFBhdGg6IGluZGV4XG4gICAgfSk7XG4gICAgc2kuc2VhcmNoKHEsIGZ1bmN0aW9uKGVyciwgcmVzdWx0cykge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIGdldCBhbGwgdGhlIHRhbGtzXG4gKiBAcGFyYW0gZGJ1cmwgICAgIGRhdGFiYXNlIHVybCBzdHJpbmdcbiAqIEBwYXJhbSBjYWxsYmFjayAgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aXRoIHRoZSByZXN1bHRpbmcgZGF0YVxuICovXG5leHBvcnRzLmFsbCA9IGZ1bmN0aW9uKGRidXJsLCBjYWxsYmFjaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIE1vbmdvQ2xpZW50LmNvbm5lY3QoZGJ1cmwsIGZ1bmN0aW9uKGVyciwgZGIpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRhbGtzID0gZGIuY29sbGVjdGlvbigndGFsa3MnKTtcbiAgICAgICAgdGFsa3NcbiAgICAgICAgICAgIC5maW5kKHt9KVxuICAgICAgICAgICAgLnRvQXJyYXkoZnVuY3Rpb24oZXJyLCBkb2NzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGIuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgZG9jcyk7XG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogZ2V0IHRoZSBsYXRlc3QgdGFsa3NcbiAqIEBwYXJhbSBkYnVybCAgICAgICAgIGRhdGFiYXNlIHVybCBzdHJpbmdcbiAqIEBwYXJhbSBxdWFudGl0eSAgICAgIG51bWJlciBvZiByZXN1bHRzIHRvIGdldFxuICogQHBhcmFtIHBhZ2VOdW1iZXIgICAgcGFnZSBudW1iZXIgdG8gZ2V0IHJlc3VsdHNcbiAqIEBwYXJhbSBjYWxsYmFjayAgICAgIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2l0aCB0aGUgcmVzdWx0aW5nIGRhdGFcbiAqL1xuZXhwb3J0cy5sYXRlc3QgPSBmdW5jdGlvbihkYnVybCwgcXVhbnRpdHksIHBhZ2VOdW1iZXIsIGNhbGxiYWNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIHNvcnQgPSB7XG4gICAgICAgIGNyZWF0ZWQ6IC0xXG4gICAgfTtcbiAgICByZXR1cm4gc2VhcmNoVGFsa3MoZGJ1cmwsIHt9LCBzb3J0LCBxdWFudGl0eSwgcGFnZU51bWJlciwgY2FsbGJhY2spO1xufTtcblxuLyoqXG4gKiBnZXQgdGhlIG1vc3QgcG9wdWxhciB0YWxrc1xuICogQHBhcmFtIGRidXJsICAgICAgICAgZGF0YWJhc2UgdXJsIHN0cmluZ1xuICogQHBhcmFtIHF1YW50aXR5ICAgICAgbnVtYmVyIG9mIHJlc3VsdHMgdG8gZ2V0XG4gKiBAcGFyYW0gcGFnZU51bWJlciAgICBwYWdlIG51bWJlciB0byBnZXQgcmVzdWx0c1xuICogQHBhcmFtIGNhbGxiYWNrICAgICAgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aXRoIHRoZSByZXN1bHRpbmcgZGF0YVxuICovXG5leHBvcnRzLnBvcHVsYXIgPSBmdW5jdGlvbihkYnVybCwgcXVhbnRpdHksIHBhZ2VOdW1iZXIsIGNhbGxiYWNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIGNvbmRzID0ge307XG4gICAgdmFyIHNvcnQgPSB7XG4gICAgICAgIHZvdGVDb3VudDogLTEsXG4gICAgICAgIHZpZXdDb3VudDogLTFcbiAgICB9O1xuICAgIHJldHVybiBzZWFyY2hUYWxrcyhkYnVybCwgY29uZHMsIHNvcnQsIHF1YW50aXR5LCBwYWdlTnVtYmVyLCBjYWxsYmFjayk7XG59O1xuXG4vKipcbiAqIGdlbmVyaWMgbWV0aG9kIGZvciBnZXR0aW5nIHRhbGtzXG4gKiBAcGFyYW0gZGJ1cmwgICAgICAgICBkYXRhYmFzZSB1cmwgc3RyaW5nXG4gKiBAcGFyYW0gY29uZHMgICAgICAgICBzZWFyY2ggYW5kIGZpbHRlciBjb25kaXRpb25zXG4gKiBAcGFyYW0gc29ydCAgICAgICAgICBzb3J0aW5nIGNvbmRpdGlvbnNcbiAqIEBwYXJhbSBxdWFudGl0eSAgICAgIG51bWJlciBvZiByZXN1bHRzIHRvIGZldGNoXG4gKiBAcGFyYW0gcGFnZU51bWJlciAgICBwYWdlIG51bWJlciB0byBnZXRcbiAqIEBwYXJhbSBjYWxsYmFjayAgICAgIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2l0aCB0aGUgcmVzdWx0aW5nIGRhdGFcbiAqL1xuZnVuY3Rpb24gc2VhcmNoVGFsa3MoZGJ1cmwsIGNvbmRzLCBzb3J0LCBxdWFudGl0eSwgcGFnZU51bWJlciwgY2FsbGJhY2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBwYWdlTnVtYmVyID0gcGFnZU51bWJlciB8fCAxO1xuICAgIE1vbmdvQ2xpZW50LmNvbm5lY3QoZGJ1cmwsIGZ1bmN0aW9uKGVyciwgZGIpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRhbGtzID0gZGIuY29sbGVjdGlvbigndGFsa3MnKTtcbiAgICAgICAgdGFsa3NcbiAgICAgICAgICAgIC5maW5kKGNvbmRzKVxuICAgICAgICAgICAgLnNvcnQoc29ydClcbiAgICAgICAgICAgIC5za2lwKHBhZ2VOdW1iZXIgPiAwID8gKChwYWdlTnVtYmVyIC0gMSkgKiBxdWFudGl0eSkgOiAwKVxuICAgICAgICAgICAgLmxpbWl0KHF1YW50aXR5KVxuICAgICAgICAgICAgLnRvQXJyYXkoZnVuY3Rpb24oZXJyLCBkb2NzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGIuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgZG9jcyk7XG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuXG4vKipcbiAqIGNyZWF0ZSBhIG5ldyB0YWxrXG4gKiBAcGFyYW0gZGJ1cmwgICAgIGRhdGFiYXNlIHVybCBzdHJpbmdcbiAqIEBwYXJhbSBvYmogICAgICAgbnVtYmVyIG9mIHJlc3VsdHMgdG8gZ2V0XG4gKiBAcGFyYW0gY2FsbGJhY2sgIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2l0aCB0aGUgcmVzdWx0aW5nIGRhdGFcbiAqL1xuZXhwb3J0cy5jcmVhdGVUYWxrID0gZnVuY3Rpb24oZGJ1cmwsIG9iaiwgY2FsbGJhY2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBNb25nb0NsaWVudC5jb25uZWN0KGRidXJsLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0YWxrcyA9IGRiLmNvbGxlY3Rpb24oJ3RhbGtzJyk7XG4gICAgICAgIHRhbGtzLmluc2VydChvYmosIGZ1bmN0aW9uKGVyciwgZG9jcykge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGIuY2xvc2UoKTtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBkb2NzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIGRlbGV0ZSBhIHRhbGsgYnkgaXRzIGlkXG4gKiBAcGFyYW0gZGJ1cmwgICAgIGRhdGFiYXNlIHVybCBzdHJpbmdcbiAqIEBwYXJhbSBpZCAgICAgICAgdGFsayBpZCBzdHJpbmdcbiAqIEBwYXJhbSBjYWxsYmFjayAgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aXRoIHRoZSByZXN1bHRpbmcgZGF0YVxuICovXG5leHBvcnRzLmRlbGV0ZVRhbGsgPSBmdW5jdGlvbihkYnVybCwgaWQsIGNhbGxiYWNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgTW9uZ29DbGllbnQuY29ubmVjdChkYnVybCwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGFsa3MgPSBkYi5jb2xsZWN0aW9uKCd0YWxrcycpO1xuICAgICAgICB0YWxrcy5yZW1vdmUoe1xuICAgICAgICAgICAgaWQ6IGlkXG4gICAgICAgIH0sIGZ1bmN0aW9uKGVyciwgZG9jcykge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGIuY2xvc2UoKTtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBkb2NzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIGdldCBhIHRhbGsgYnkgaXRzIGlkXG4gKiBAcGFyYW0gZGJ1cmwgICAgIGRhdGFiYXNlIHVybCBzdHJpbmdcbiAqIEBwYXJhbSBpZCAgICAgICAgdGFsayBpZCBzdHJpbmdcbiAqIEBwYXJhbSBjYWxsYmFjayAgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aXRoIHRoZSByZXN1bHRpbmcgZGF0YVxuICovXG5leHBvcnRzLmdldCA9IGZ1bmN0aW9uKGRidXJsLCBpZCwgY2FsbGJhY2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBNb25nb0NsaWVudC5jb25uZWN0KGRidXJsLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0YWxrcyA9IGRiLmNvbGxlY3Rpb24oJ3RhbGtzJyk7XG4gICAgICAgIHRhbGtzLmZpbmRPbmUoe1xuICAgICAgICAgICAgaWQ6IGlkXG4gICAgICAgIH0sIGZ1bmN0aW9uKGVyciwgZG9jKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkYi5jbG9zZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIGRvYyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiB1cHZvdGUgYSB0YWxrXG4gKiBAcGFyYW0gZGJ1cmwgICAgIGRhdGFiYXNlIHVybCBzdHJpbmdcbiAqIEBwYXJhbSBpZCAgICAgICAgVGFsayBpZFxuICogQHBhcmFtIHVzZXJpZCAgICBVc2VyIHRoYXQgdXB2b3RlcyB0aGUgdGFsa1xuICogQHBhcmFtIGNhbGxiYWNrICBmdW5jdGlvbiB0byBleGVjdXRlIHdpdGggdGhlIHJlc3VsdGluZyBkYXRhXG4gKi9cbmV4cG9ydHMudXB2b3RlID0gZnVuY3Rpb24oZGJ1cmwsIGlkLCB1c2VyaWQsIGNhbGxiYWNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgTW9uZ29DbGllbnQuY29ubmVjdChkYnVybCwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGFsa3MgPSBkYi5jb2xsZWN0aW9uKCd0YWxrcycpO1xuICAgICAgICB0YWxrcy51cGRhdGUoe1xuICAgICAgICAgICAgXCJpZFwiOiBpZCxcbiAgICAgICAgICAgIFwidm90ZXNcIjoge1xuICAgICAgICAgICAgICAgIFwiJG5lXCI6IHVzZXJpZFxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBcIiRpbmNcIjoge1xuICAgICAgICAgICAgICAgIFwidm90ZUNvdW50XCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIiRwdXNoXCI6IHtcbiAgICAgICAgICAgICAgICBcInZvdGVzXCI6IHVzZXJpZFxuICAgICAgICAgICAgfVxuICAgICAgICB9LCBmdW5jdGlvbihlcnIsIHRhbGspIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRiLmNsb3NlKCk7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgdGFsayk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuXG4vKipcbiAqIGZhdm9yaXRlIGEgdGFsa1xuICogQHBhcmFtIGRidXJsICAgICBkYXRhYmFzZSB1cmwgc3RyaW5nXG4gKiBAcGFyYW0gaWQgICAgICAgIFRhbGsgaWRcbiAqIEBwYXJhbSB1c2VyaWQgICAgVXNlciB0aGF0IGZhdm9yaXRlcyB0aGUgdGFsa1xuICogQHBhcmFtIGNhbGxiYWNrICBmdW5jdGlvbiB0byBleGVjdXRlIHdpdGggdGhlIHJlc3VsdGluZyBkYXRhXG4gKi9cbmV4cG9ydHMuZmF2b3JpdGUgPSBmdW5jdGlvbihkYnVybCwgaWQsIHVzZXJpZCwgY2FsbGJhY2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBNb25nb0NsaWVudC5jb25uZWN0KGRidXJsLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0YWxrcyA9IGRiLmNvbGxlY3Rpb24oJ3RhbGtzJyk7XG4gICAgICAgIHRhbGtzLnVwZGF0ZSh7XG4gICAgICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICAgICAgXCJmYXZvcml0ZXNcIjoge1xuICAgICAgICAgICAgICAgIFwiJG5lXCI6IHVzZXJpZFxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBcIiRpbmNcIjoge1xuICAgICAgICAgICAgICAgIFwiZmF2b3JpdGVDb3VudFwiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCIkcHVzaFwiOiB7XG4gICAgICAgICAgICAgICAgXCJmYXZvcml0ZXNcIjogdXNlcmlkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVyciwgdGFsaykge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGIuY2xvc2UoKTtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCB0YWxrKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIHVuZmF2b3JpdGUgYSB0YWxrXG4gKiBAcGFyYW0gZGJ1cmwgICAgIGRhdGFiYXNlIHVybCBzdHJpbmdcbiAqIEBwYXJhbSBpZCAgICAgICAgVGFsayBpZFxuICogQHBhcmFtIHVzZXJpZCAgICBVc2VyIHRoYXQgZmF2b3JpdGVzIHRoZSB0YWxrXG4gKiBAcGFyYW0gY2FsbGJhY2sgIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2l0aCB0aGUgcmVzdWx0aW5nIGRhdGFcbiAqL1xuZXhwb3J0cy51bmZhdm9yaXRlID0gZnVuY3Rpb24oZGJ1cmwsIGlkLCB1c2VyaWQsIGNhbGxiYWNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgTW9uZ29DbGllbnQuY29ubmVjdChkYnVybCwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGFsa3MgPSBkYi5jb2xsZWN0aW9uKCd0YWxrcycpO1xuICAgICAgICB0YWxrcy51cGRhdGUoe1xuICAgICAgICAgICAgXCJpZFwiOiBpZCxcbiAgICAgICAgICAgIFwiZmF2b3JpdGVzXCI6IHtcbiAgICAgICAgICAgICAgICBcIiRpblwiOiBbdXNlcmlkXVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBcIiRpbmNcIjoge1xuICAgICAgICAgICAgICAgIFwiZmF2b3JpdGVDb3VudFwiOiAtMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiJHB1bGxcIjoge1xuICAgICAgICAgICAgICAgIFwiZmF2b3JpdGVzXCI6IHVzZXJpZFxuICAgICAgICAgICAgfVxuICAgICAgICB9LCBmdW5jdGlvbihlcnIsIHRhbGspIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRiLmNsb3NlKCk7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgdGFsayk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiByYW5rIGEgYSB0YWxrXG4gKiBVcGRhdGUgcmFraW5nIHNjb3JlIGZpZWxkXG4gKiBAcGFyYW0gZGJ1cmwgICAgIGRhdGFiYXNlIHVybCBzdHJpbmdcbiAqIEBwYXJhbSBpZCAgICAgICAgVGFsayBVbmlxdWUgSURcbiAqIEBwYXJhbSBzY29yZSAgICAgUmFraW5nIHNjb3JlXG4gKiBAcGFyYW0gY2FsbGJhY2sgIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2l0aCB0aGUgcmVzdWx0aW5nIGRhdGFcbiAqL1xuZXhwb3J0cy5yYW5rID0gZnVuY3Rpb24oZGJ1cmwsIGlkLCBzY29yZSwgY2FsbGJhY2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBNb25nb0NsaWVudC5jb25uZWN0KGRidXJsLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0YWxrcyA9IGRiLmNvbGxlY3Rpb24oJ3RhbGtzJyk7XG4gICAgICAgIHRhbGtzLnVwZGF0ZSh7XG4gICAgICAgICAgICBcImlkXCI6IGlkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBcInJhbmtpbmdcIjogc2NvcmVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkYi5jbG9zZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogcGxheSBhIHRhbGtcbiAqIFVwZGF0ZXMgdmlld3MgZmllbGQgYnkgMS5cbiAqIEBwYXJhbSBkYnVybCAgICAgZGF0YWJhc2UgdXJsIHN0cmluZ1xuICogQHBhcmFtIHNsdWcgICAgICBUYWxrIHNsdWdcbiAqIEBwYXJhbSBjYWxsYmFjayAgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aXRoIHRoZSByZXN1bHRpbmcgZGF0YVxuICovXG5leHBvcnRzLnBsYXkgPSBmdW5jdGlvbihkYnVybCwgc2x1ZywgY2FsbGJhY2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBNb25nb0NsaWVudC5jb25uZWN0KGRidXJsLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0YWxrcyA9IGRiLmNvbGxlY3Rpb24oJ3RhbGtzJyk7XG4gICAgICAgIHRhbGtzLmZpbmRPbmUoe1xuICAgICAgICAgICAgXCJzbHVnXCI6IHNsdWdcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyLCB0YWxrKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YWxrLnZpZXdDb3VudCA9IHRhbGsudmlld0NvdW50ICsgMTtcbiAgICAgICAgICAgIHRhbGtzLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgXCJzbHVnXCI6IHNsdWdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAkaW5jOiB7XG4gICAgICAgICAgICAgICAgICAgIFwidmlld0NvdW50XCI6IDFcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZDogRGF0ZS5ub3coKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRiLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHRhbGspO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiBnZXQgYSB0YWxrIGJ5IHRhZ1xuICogQHBhcmFtIGRidXJsICAgICAgICAgZGF0YWJhc2UgdXJsIHN0cmluZ1xuICogQHBhcmFtIHRhZyAgICAgICAgICAgdGFsayB0YWcgc3RyaW5nXG4gKiBAcGFyYW0gcXVhbnRpdHkgICAgICBxdWFudGl0eSBvZiB0YWxrcyB0byBmZXRjaFxuICogQHBhcmFtIHBhZ2VOdW1iZXIgICAgcGFnZSBudW1iZXIgdG8gZ2V0XG4gKiBAcGFyYW0gY2FsbGJhY2sgICAgICBmdW5jdGlvbiB0byBleGVjdXRlIHdpdGggdGhlIHJlc3VsdGluZyBkYXRhXG4gKi9cbmV4cG9ydHMuZ2V0QnlUYWcgPSBmdW5jdGlvbihkYnVybCwgdGFnLCBxdWFudGl0eSwgcGFnZU51bWJlciwgY2FsbGJhY2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgY29uZHMgPSB7XG4gICAgICAgIHRhZ3M6IHRhZ1xuICAgIH07XG4gICAgdmFyIHNvcnQgPSB7XG4gICAgICAgIGNyZWF0ZWQ6IC0xXG4gICAgfTtcbiAgICByZXR1cm4gc2VhcmNoVGFsa3MoZGJ1cmwsIGNvbmRzLCBzb3J0LCBxdWFudGl0eSwgcGFnZU51bWJlciwgY2FsbGJhY2spO1xufTtcblxuLyoqXG4gKiBnZXQgYSB0YWxrIGJ5IGl0cyBzbHVnIGZpZWxkXG4gKiBAcGFyYW0gZGJ1cmwgICAgICAgICBkYXRhYmFzZSB1cmwgc3RyaW5nXG4gKiBAcGFyYW0gc2x1ZyAgICAgICAgICB0YWxrIHNsdWcgc3RyaW5nXG4gKiBAcGFyYW0gY2FsbGJhY2sgICAgICBmdW5jdGlvbiB0byBleGVjdXRlIHdpdGggdGhlIHJlc3VsdGluZyBkYXRhXG4gKi9cbmV4cG9ydHMuZ2V0QnlTbHVnID0gZnVuY3Rpb24oZGJ1cmwsIHNsdWcsIGNhbGxiYWNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgTW9uZ29DbGllbnQuY29ubmVjdChkYnVybCwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGFsa3MgPSBkYi5jb2xsZWN0aW9uKCd0YWxrcycpO1xuICAgICAgICB0YWxrcy5maW5kKHtcbiAgICAgICAgICAgIFwic2x1Z1wiOiBzbHVnXG4gICAgICAgIH0pLnRvQXJyYXkoZnVuY3Rpb24oZXJyLCBkb2NzKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkYi5jbG9zZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIGRvY3MpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogZ2V0IHJlbHRhdGVkIHRhbGtzIGZyb20gYSBsaXN0IG9mIHRhZ3NcbiAqIEBwYXJhbSBkYnVybCAgICAgc3RyaW5nICAgICAgZGF0YWJhc2UgdXJsIHN0cmluZ1xuICogQHBhcmFtIGlkICAgICAgICBpbnQgICAgICAgICByZWZlcmVuY2VkIHRhbGtcbiAqIEBwYXJhbSB0YWdzICAgICAgQXJyYXkgICAgICAgbGlzdCBvZiB0YWcgc3RyaW5nc1xuICogQHBhcmFtIGNhbGxiYWNrICBmdW5jdGlvbiAgICB0byBleGVjdXRlIHdpdGggdGhlIHJlc3VsdGluZyBkYXRhXG4gKi9cbmV4cG9ydHMucmVsYXRlZCA9IGZ1bmN0aW9uKGRidXJsLCBpZCwgdGFncywgcXVhbnRpdHksIGNhbGxiYWNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgTW9uZ29DbGllbnQuY29ubmVjdChkYnVybCwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGFsa3MgPSBkYi5jb2xsZWN0aW9uKCd0YWxrcycpO1xuICAgICAgICB0YWxrc1xuICAgICAgICAgICAgLmZpbmQoe1xuICAgICAgICAgICAgICAgIFwidGFnc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICRpbjogdGFnc1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiJG5lXCI6IGlkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5saW1pdChxdWFudGl0eSlcbiAgICAgICAgICAgIC50b0FycmF5KGZ1bmN0aW9uKGVyciwgZG9jcykge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRiLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIGRvY3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIGdldCBhIHRhbGsgYnkgaXRzIGlkXG4gKiBAcGFyYW0gZGJ1cmwgICAgIGRhdGFiYXNlIHVybCBzdHJpbmdcbiAqIEBwYXJhbSBpZCAgICAgICAgYXV0aG9yIGlkIHN0cmluZ1xuICogQHBhcmFtIGNhbGxiYWNrICBmdW5jdGlvbiB0byBleGVjdXRlIHdpdGggdGhlIHJlc3VsdGluZyBkYXRhXG4gKi9cbmV4cG9ydHMuZ2V0QnlBdXRob3JJZCA9IGZ1bmN0aW9uKGRidXJsLCBpZCwgY2FsbGJhY2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBNb25nb0NsaWVudC5jb25uZWN0KGRidXJsLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0YWxrcyA9IGRiLmNvbGxlY3Rpb24oJ3RhbGtzJyk7XG4gICAgICAgIHRhbGtzLmZpbmQoe1xuICAgICAgICAgICAgXCJhdXRob3IuaWRcIjogaWRcbiAgICAgICAgfSkuc29ydCh7XG4gICAgICAgICAgICBcImNyZWF0ZWRcIjogLTFcbiAgICAgICAgfSkudG9BcnJheShmdW5jdGlvbihlcnIsIGRvY3MpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRiLmNsb3NlKCk7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgZG9jcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiBnZXQgbGlzdCBvZiB0YWxrcyB1cHZvdGVkIGJ5IGFuIHVzZXJcbiAqIEBwYXJhbSBkYnVybCAgICAgZGF0YWJhc2UgdXJsIHN0cmluZ1xuICogQHBhcmFtIHVzZXJpZCAgICBhdXRob3IgaWQgc3RyaW5nXG4gKiBAcGFyYW0gY2FsbGJhY2sgIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2l0aCB0aGUgcmVzdWx0aW5nIGRhdGFcbiAqL1xuZXhwb3J0cy5nZXRVcHZvdGVkQnlBdXRob3JJZCA9IGZ1bmN0aW9uKGRidXJsLCB1c2VyaWQsIGNhbGxiYWNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgTW9uZ29DbGllbnQuY29ubmVjdChkYnVybCwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGFsa3MgPSBkYi5jb2xsZWN0aW9uKCd0YWxrcycpO1xuICAgICAgICB0YWxrcy5maW5kKHtcbiAgICAgICAgICAgIFwidm90ZXNcIjoge1xuICAgICAgICAgICAgICAgIFwiJGluXCI6IFt1c2VyaWRdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnNvcnQoe1xuICAgICAgICAgICAgXCJjcmVhdGVkXCI6IC0xXG4gICAgICAgIH0pLnRvQXJyYXkoZnVuY3Rpb24oZXJyLCBkb2NzKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkYi5jbG9zZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIGRvY3MpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogZ2V0IGxpc3Qgb2YgdGFsa3MgZmF2b3JpdGVkIGJ5IGFuIHVzZXJcbiAqIEBwYXJhbSBkYnVybCAgICAgZGF0YWJhc2UgdXJsIHN0cmluZ1xuICogQHBhcmFtIHVzZXJpZCAgICBhdXRob3IgaWQgc3RyaW5nXG4gKiBAcGFyYW0gY2FsbGJhY2sgIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2l0aCB0aGUgcmVzdWx0aW5nIGRhdGFcbiAqL1xuZXhwb3J0cy5nZXRGYXZvcml0ZWRCeUF1dGhvcklkID0gZnVuY3Rpb24oZGJ1cmwsIHVzZXJpZCwgY2FsbGJhY2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBNb25nb0NsaWVudC5jb25uZWN0KGRidXJsLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0YWxrcyA9IGRiLmNvbGxlY3Rpb24oJ3RhbGtzJyk7XG4gICAgICAgIHRhbGtzLmZpbmQoe1xuICAgICAgICAgICAgXCJmYXZvcml0ZXNcIjoge1xuICAgICAgICAgICAgICAgIFwiJGluXCI6IFt1c2VyaWRdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnNvcnQoe1xuICAgICAgICAgICAgXCJjcmVhdGVkXCI6IC0xXG4gICAgICAgIH0pLnRvQXJyYXkoZnVuY3Rpb24oZXJyLCBkb2NzKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkYi5jbG9zZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIGRvY3MpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG4iLCJ2YXIgTW9uZ29DbGllbnQgPSByZXF1aXJlKCdtb25nb2RiJykuTW9uZ29DbGllbnQ7XG5cbi8qKlxuICogZ2V0IHVzZXIgYnkgdXNlcm5hbWVcbiAqIEBwYXJhbSBkYnVybCAgICAgc3RyaW5nICAgICAgRGF0YWJhc2UgdXJsXG4gKiBAcGFyYW0gdXNlcm5hbWUgIHN0cmluZyAgICAgIFVzZXIgdXNlcm5hbWUgc3RyaW5nXG4gKiBAcGFyYW0gY2FsbGJhY2sgIGZ1bmN0aW9uICAgIENhbGxiYWNrIHRvIGV4ZWN1dGUsIHJlY2VpdmVzIHVzZXIganNvbiBvYmplY3RcbiAqL1xuZXhwb3J0cy5nZXRCeVVzZXJuYW1lID0gZnVuY3Rpb24oZGJ1cmwsIHVzZXJuYW1lLCBjYWxsYmFjaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIE1vbmdvQ2xpZW50LmNvbm5lY3QoZGJ1cmwsIGZ1bmN0aW9uKGVyciwgZGIpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHVzZXJzID0gZGIuY29sbGVjdGlvbigndXNlcnMnKTtcbiAgICAgICAgdXNlcnMuZmluZE9uZSh7XCJ1c2VybmFtZVwiOiB1c2VybmFtZX0sIGZ1bmN0aW9uIChlcnIsIHByb2ZpbGUpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRiLmNsb3NlKCk7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBwcm9maWxlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIGNyZWF0ZSBhIG5ldyB1c2VyXG4gKiBAcGFyYW0gZGJ1cmwgICAgIHN0cmluZyAgICAgIERhdGFiYXNlIHVybFxuICogQHBhcmFtIHVzZXIgICAgICBvYmplY3QgICAgICBVc2VyIGpzb24gb2JqXG4gKiBAcGFyYW0gY2FsbGJhY2sgIGZ1bmN0aW9uICAgIENhbGxiYWNrIHRvIGV4ZWN1dGUsIHJlY2VpdmVzIHVzZXIganNvbiBvYmplY3RcbiAqL1xuZXhwb3J0cy5jcmVhdGUgPSBmdW5jdGlvbihkYnVybCwgdXNlciwgY2FsbGJhY2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBNb25nb0NsaWVudC5jb25uZWN0KGRidXJsLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB1c2VycyA9IGRiLmNvbGxlY3Rpb24oJ3VzZXJzJyk7XG4gICAgICAgIHVzZXJzLmluc2VydCh1c2VyLCBmdW5jdGlvbiAoZXJyLCB1c2VyKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkYi5jbG9zZSgpO1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiB1cGRhdGUgZXhpc3RpbmcgdXNlclxuICogQHBhcmFtIGRidXJsICAgICBzdHJpbmcgICAgICBEYXRhYmFzZSB1cmxcbiAqIEBwYXJhbSB1c2VyICAgICAgb2JqZWN0ICAgICAgVXNlciBqc29uIG9ialxuICogQHBhcmFtIGNhbGxiYWNrICBmdW5jdGlvbiAgICBDYWxsYmFjayB0byBleGVjdXRlLCByZWNlaXZlcyB1c2VyIGpzb24gb2JqZWN0XG4gKi9cbmV4cG9ydHMudXBkYXRlID0gZnVuY3Rpb24oZGJ1cmwsIHVzZXIsIGNhbGxiYWNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgTW9uZ29DbGllbnQuY29ubmVjdChkYnVybCwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdXNlcnMgPSBkYi5jb2xsZWN0aW9uKCd1c2VycycpO1xuICAgICAgICB1c2Vycy51cGRhdGUoe1wiaWRcIjogdXNlci5pZH0sIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBiaW86IHVzZXIuYmlvLFxuICAgICAgICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICAgICAgICAgIHVwZGF0ZWQ6IERhdGUubm93KClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGIuY2xvc2UoKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=