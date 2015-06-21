var MongoClient = require('mongodb').MongoClient;

/**
 * Generic method for getting Talks.
 *
 * By default pageNumber is set to 1 if its not specified.
 * Also returns 25 elements if quantity is not specified.
 *
 * @param {string}    dburl       Database url string.
 * @param {object}    conds       Search and filter conditions.
 * @param {object}    sort        Sorting conditions.
 * @param {number}    quantity    Number of results to fetch.
 * @param {number}    pageNumber  Page number to fetch.
 * @param {function}  callback    Callback function to execute with results.
 */
function searchTalks(dburl, conds, sort, quantity, pageNumber, callback) {
    'use strict';

    pageNumber = pageNumber || 1;

    quantity = quantity || 25;

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
 * Get a Random Talk.
 *
 * Get a random talk from the collection.
 *
 * @param {string}    dburl     Database url string.
 * @param {function}  callback  Callback function to execute with the results.
 */
exports.getRandom = function(dburl, callback) {
    'use strict';
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.count(function(err, count) {
            var rand = Math.floor(Math.random() * count) + 1;
            talks
                .find()
                .limit(-1)
                .skip(rand)
                .limit(1)
                .toArray(function(err, docs) {
                    if (err) {
                        return callback(err, null);
                    }
                    db.close();
                    return callback(null, docs);
                });
        });
    });
};

/**
 * Search Talks.
 *
 * Performs a query search on talks full-text index on elastic-search.
 *
 * @param {string}    index     Elastic search connection string.
 * @param {string}    q         Query string to search.
 * @param {function}  callback  Callback function to execute with the results.
 */
exports.search = function(index, q, callback) {
    'use strict';

    var si = require('search-index')({
        indexPath: index
    });

    si.search(q, function(err, results) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, results);
    });
};

/**
 * Get all the Talks from the database.
 *
 * @param {string}    dburl     Database url string.
 * @param {function}  callback  Callback function to execute with results.
 */
exports.all = function(dburl, callback) {
    'use strict';

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
 * Get the latest Talks.
 *
 * Latest talks are sorted by its creation date in descendant order.
 *
 * @param {string}    dburl         Database url string.
 * @param {number}    quantity      Number of results to get.
 * @param {number}    pageNumber    Page number to get results.
 * @param {function}  callback      Callback function to execute with results.
 */
exports.latest = function(dburl, quantity, pageNumber, callback) {
    'use strict';

    var conds = {};
    var sort = {
        created: -1
    };
    quantity = quantity || 25;
    pageNumber = pageNumber || 1;
    return searchTalks(dburl, conds, sort, quantity, pageNumber, callback);
};

/**
 * Get the most popular Talks.
 *
 * Popular talks are sorted in descendant order first by its number of
 * votes and then by its number of views.
 *
 * @param {string}    dburl         Database url string.
 * @param {number}    quantity      Number of results to get.
 * @param {number}    pageNumber    Page number to get results.
 * @param {function}  callback      Callback function to execute with results.
 */
exports.popular = function(dburl, quantity, pageNumber, callback) {
    'use strict';

    var conds = {};
    var sort = {
        voteCount: -1,
        viewCount: -1
    };
    quantity = quantity || 25;
    pageNumber = pageNumber || 1;
    return searchTalks(dburl, conds, sort, quantity, pageNumber, callback);
};



/**
 * Create a new talk.
 *
 * Creates a new talk storing it into the database.
 *
 * @param {string}    dburl     Database url string.
 * @param {number}    obj       Number of results to get.
 * @param {function}  callback  Callback function to execute with results.
 */
exports.createTalk = function(dburl, obj, callback) {
    'use strict';

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
 * Delete a talk by its id.
 *
 * Remove a database from the database.
 *
 * @param {string}   dburl     Database url string.
 * @param {number}   id        Talk unique id.
 * @param {function} callback  Callback function to execute with results.
 */
exports.deleteTalk = function(dburl, id, callback) {
    'use strict';

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
 * Get a talk by id.
 *
 * Get a Talk from the database by its unique id.
 *
 * @param {string}    dburl     Database url string.
 * @param {number}    id        Talk unique id.
 * @param {function}  callback  Callbacak function to execute with results.
 */
exports.get = function(dburl, id, callback) {
    'use strict';

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
 * Upvote a Talk.
 *
 * Updates a talk increasing its vote count by 1.
 * It checks if the user did not upvoted the talk already and also adds user
 * id on a list of upvoters for this talk in case its not present.
 *
 * @param {string}    dburl     Database url string.
 * @param {number}    id        Talk unique id.
 * @param {number}    userid    User's unique id.
 * @param {function}  callback  Callback function to execute with the results.
 */
exports.upvote = function(dburl, id, userid, callback) {
    'use strict';

    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }

        var talks = db.collection('talks');
        talks.update({
            'id': id,
            'votes': {
                '$ne': userid
            }
        }, {
            '$inc': {
                'voteCount': 1
            },
            '$push': {
                'votes': userid
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
 * Favorite a Talk.
 *
 * Updates a talk with increasing its favorites count by 1.
 * It checks if the user did not favorited the talk already and also adds user
 * id on a list of favoriters for this talk in case its not present.
 *
 * @param {string}    dburl     Database url string.
 * @param {number}    id        Talk unique id.
 * @param {number}    userid    User's unique id.
 * @param {function}  callback  Callback function to execute with the results.
 */
exports.favorite = function(dburl, id, userid, callback) {
    'use strict';

    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }

        var talks = db.collection('talks');
        talks.update({
            'id': id,
            'favorites': {
                '$ne': userid
            }
        }, {
            '$inc': {
                'favoriteCount': 1
            },
            '$push': {
                'favorites': userid
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
 * Unfavorite a Talk.
 *
 * Updates a talk with decreasing its favorites count by 1.
 * It checks if the user did favorited the talk already and also removes user
 * id on a list of favoriters for this talk.
 *
 * @param {string}    dburl     Database url string.
 * @param {number}    id        Talk unique id.
 * @param {number}    userid    User's unique id.
 * @param {function}  callback  Callback function to execute with the results.
 */

exports.unfavorite = function(dburl, id, userid, callback) {
    'use strict';
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.update({
            'id': id,
            'favorites': {
                '$in': [userid]
            }
        }, {
            '$inc': {
                'favoriteCount': -1
            },
            '$pull': {
                'favorites': userid
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
 * Rank a Talk.
 *
 * Updates a talk with its raking score field.
 *
 * @param {string}    dburl     Database url string.
 * @param {number}    id        Talk unique id.
 * @param {float}     score     Ranking score.
 * @param {function}  callback  Callback function to execute with the results.
 */
exports.rank = function(dburl, id, score, callback) {
    'use strict';

    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }

        var talks = db.collection('talks');
        talks.update({
            'id': id
        }, {
            '$set': {
                'ranking': score
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
 * Play a Talk.
 *
 * Get a Talk by its slug name and updates views counter field by 1.
 *
 * @param {string}    dburl     Database url string
 * @param {string}    slug      Talk slug field.
 * @param {function}  callback  Callback function to execute with results.
 */
exports.play = function(dburl, slug, callback) {
    'use strict';

    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }

        var talks = db.collection('talks');
        talks.findOne({
            'slug': slug
        }, function(err, talk) {
            if (err) {
                return callback(err, null);
            }

            talks.update({
                'slug': slug
            }, {
                '$inc': {
                    'viewCount': 1
                },
                '$set': {
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
 * Get a list of talks tagged as.
 *
 * Results are sorted by creation date in descending order.
 * By default 25 results are returned.
 *
 * @param {string}    dburl       Database url string.
 * @param {string}    tag         Tag string.
 * @param {number}    quantity    Number of results to fetch.
 * @param {number}    pageNumber  Number of the page to fetch.
 * @param {function}  callback    Callback function to execute with results.
 */
exports.getByTag = function(dburl, tag, quantity, pageNumber, callback) {
    'use strict';

    var conds = {
        tags: tag
    };

    var sort = {
        created: -1
    };

    quantity = quantity || 25;

    return searchTalks(dburl, conds, sort, quantity, pageNumber, callback);
};

/**
 * Get a Talk by slug.
 *
 * Get a Talk by its generated slug field.
 * http://en.wikipedia.org/wiki/Semantic_URL#Slug
 *
 * @param {string}    dburl     Database url string.
 * @param {string}    slug      Slug string.
 * @param {function}  callback  Callback function to execute with results.
 */
exports.getBySlug = function(dburl, slug, callback) {
    'use strict';

    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }

        var talks = db.collection('talks');
        talks.find({
            'slug': slug
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
 * Get a Talk by code.
 *
 * Get a Talk by its field code .
 *
 * @param {string}    dburl     Database url string.
 * @param {string}    code      Code string.
 * @param {function}  callback  Callback function to execute with results.
 */
exports.getByCode = function(dburl, code, callback) {
    'use strict';

    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }

        var talks = db.collection('talks');
        talks.find({
            'code': code
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
 * Get related Talks to another Talk.
 *
 * Related Talks are tagged with at least one of the tags of the
 * original one.
 * Results are sorted by creation date in descendant order.
 * Also the original Talk is descarted so a Talk can't be related to
 * itself.
 *
 * @param {string}    dburl     Database url string.
 * @param {number}    id        Original Talk id.
 * @param {Array}     tags      List of tag strings.
 * @param {number}    quantity  Number of results to fetch.
 * @param {function}  callback  Callback function to execute with results.
 */
exports.related = function(dburl, id, tags, quantity, callback) {
    'use strict';

    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }

        var talks = db.collection('talks');
        talks
            .find({
                'tags': {
                    '$in': tags
                },
                'id': {
                    '$ne': id
                }
            })
            .sort({
                'created': -1
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
 * Get a list of Talks published by an User.
 *
 * Given an userid, get a list of talks published by him.
 * Returns the list sorted by creation date, being first element the
 * most recent one.
 *
 * @param {string}    dburl       Database url string.
 * @param {number}    userid      User unique id.
 * @param {number}    quantity    Number of results to fetch.
 * @param {number}    pageNumber  Number of the page to fetch.
 * @param {function}  callback    Callback function to execute with results.
 */
exports.getByAuthorId = function(dburl, id, quantity, pageNumber, callback) {
    'use strict';

    var conds = {
        'author.id': id
    };
    var sort = {
        created: -1
    };
    quantity = quantity || 25;
    pageNumber = pageNumber || 1;
    return searchTalks(dburl, conds, sort, quantity, pageNumber, callback);
};

/**
 * Get a list of Talks upvoted by an User.
 *
 * Given an userid, get a list fo the Tlks that the User has upvoted.
 * Returns the list sorted by creation date, being first element the
 * most recent one.
 *
 * @param {string}    dburl     Database url string.
 * @param {number}    userid    User unique id.
 * @param {function}  callback  Callback function to execute with results.
 */
exports.getUpvotedByAuthorId = function(
    dburl,
    userid,
    quantity,
    pageNumber,
    callback) {
    'use strict';

    var conds = {
        'votes': {
            '$in': [userid]
        }
    };
    var sort = {
        created: -1
    };
    quantity = quantity || 25;
    pageNumber = pageNumber || 1;
    return searchTalks(dburl, conds, sort, quantity, pageNumber, callback);
};

/**
 * Get a list of Talks favorited by an User.
 *
 * Given an userid, get a list of the Talks that the User has favorited.
 * Returns the list sorted by creation date, being first element the
 * most recent one.
 *
 * @param {string}    dburl     Database url connection string.
 * @param {number}    userid    User unique id.
 * @param {function}  callback  Callback function to execute with results.
 */
exports.getFavoritedByAuthorId = function(
    dburl,
    userid,
    quantity,
    pageNumber,
    callback) {
    'use strict';

    var conds = {
        'favorites': {
            '$in': [userid]
        }
    };
    var sort = {
        created: -1
    };
    quantity = quantity || 25;
    pageNumber = pageNumber || 1;
    return searchTalks(dburl, conds, sort, quantity, pageNumber, callback);
};
