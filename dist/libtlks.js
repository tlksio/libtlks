var packagejson = require('./package.json');

exports.version = packagejson.version;

exports.talk = require('./lib/talk.js');

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
 * play a talk
 * Updates views field by 1.
 * @param dburl     database url string
 * @param id        Talk id
 * @param callback  function to execute with the resulting data
 */
exports.play = function(dburl, id, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.findOne({
            "id": id
        }, function(err, talk) {
            if (err) {
                return callback(err, null);
            }
            talk.ViewCount = talk.viewCount + 1;
            talks.update({
                "id": id
            }, {
                $set: {
                    viewCount: talk.viewCount,
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
 * get reltated talks from a talk
 * @param dburl     database url string
 * @param talk      talk object
 * @param callback  function to execute with the resulting data
 */
exports.related = function(dburl, talk, callback) {
    "use strict";
    MongoClient.connect(dburl, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.find({
            "tags": {
                $in: talk.tags
            }
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
        }).toArray(function(err, docs) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            return callback(null, docs);
        });
    });
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIiwidGFsay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJsaWJ0bGtzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHBhY2thZ2Vqc29uID0gcmVxdWlyZSgnLi9wYWNrYWdlLmpzb24nKTtcblxuZXhwb3J0cy52ZXJzaW9uID0gcGFja2FnZWpzb24udmVyc2lvbjtcblxuZXhwb3J0cy50YWxrID0gcmVxdWlyZSgnLi9saWIvdGFsay5qcycpO1xuIiwidmFyIE1vbmdvQ2xpZW50ID0gcmVxdWlyZSgnbW9uZ29kYicpLk1vbmdvQ2xpZW50O1xuXG4vKipcbiAqIHNlYXJjaCBhbGwgdGFsa3NcbiAqIEBwYXJhbSBpbmRleHBhdGggZnVsbC10ZXh0IGluZGV4IHBhdGggc3RyaW5nXG4gKiBAcGFyYW0gY2FsbGJhY2sgIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2l0aCB0aGUgcmVzdWx0aW5nIGRhdGFcbiAqL1xuZXhwb3J0cy5zZWFyY2ggPSBmdW5jdGlvbihpbmRleCwgcSwgY2FsbGJhY2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgc2kgPSByZXF1aXJlKCdzZWFyY2gtaW5kZXgnKSh7XG4gICAgICAgIGluZGV4UGF0aDogaW5kZXhcbiAgICB9KTtcbiAgICBzaS5zZWFyY2gocSwgZnVuY3Rpb24oZXJyLCByZXN1bHRzKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogZ2V0IGFsbCB0aGUgdGFsa3NcbiAqIEBwYXJhbSBkYnVybCAgICAgZGF0YWJhc2UgdXJsIHN0cmluZ1xuICogQHBhcmFtIGNhbGxiYWNrICBmdW5jdGlvbiB0byBleGVjdXRlIHdpdGggdGhlIHJlc3VsdGluZyBkYXRhXG4gKi9cbmV4cG9ydHMuYWxsID0gZnVuY3Rpb24oZGJ1cmwsIGNhbGxiYWNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgTW9uZ29DbGllbnQuY29ubmVjdChkYnVybCwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGFsa3MgPSBkYi5jb2xsZWN0aW9uKCd0YWxrcycpO1xuICAgICAgICB0YWxrcy5cbiAgICAgICAgZmluZCh7fSkuXG4gICAgICAgIHRvQXJyYXkoZnVuY3Rpb24oZXJyLCBkb2NzKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkYi5jbG9zZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIGRvY3MpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogZ2V0IHRoZSBsYXRlc3QgdGFsa3NcbiAqIEBwYXJhbSBkYnVybCAgICAgZGF0YWJhc2UgdXJsIHN0cmluZ1xuICogQHBhcmFtIHF1YW50aXR5ICBudW1iZXIgb2YgcmVzdWx0cyB0byBnZXRcbiAqIEBwYXJhbSBjYWxsYmFjayAgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aXRoIHRoZSByZXN1bHRpbmcgZGF0YVxuICovXG5leHBvcnRzLmxhdGVzdCA9IGZ1bmN0aW9uKGRidXJsLCBxdWFudGl0eSwgY2FsbGJhY2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBNb25nb0NsaWVudC5jb25uZWN0KGRidXJsLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0YWxrcyA9IGRiLmNvbGxlY3Rpb24oJ3RhbGtzJyk7XG4gICAgICAgIHRhbGtzLlxuICAgICAgICBmaW5kKHt9KS5cbiAgICAgICAgc29ydCh7XG4gICAgICAgICAgICBjcmVhdGVkOiAtMVxuICAgICAgICB9KS5cbiAgICAgICAgbGltaXQocXVhbnRpdHkpLlxuICAgICAgICB0b0FycmF5KGZ1bmN0aW9uKGVyciwgZG9jcykge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGIuY2xvc2UoKTtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBkb2NzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIGdldCB0aGUgbW9zdCBwb3B1bGFyIHRhbGtzXG4gKiBAcGFyYW0gZGJ1cmwgICAgIGRhdGFiYXNlIHVybCBzdHJpbmdcbiAqIEBwYXJhbSBxdWFudGl0eSAgbnVtYmVyIG9mIHJlc3VsdHMgdG8gZ2V0XG4gKiBAcGFyYW0gY2FsbGJhY2sgIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2l0aCB0aGUgcmVzdWx0aW5nIGRhdGFcbiAqL1xuZXhwb3J0cy5wb3B1bGFyID0gZnVuY3Rpb24oZGJ1cmwsIHF1YW50aXR5LCBjYWxsYmFjaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIE1vbmdvQ2xpZW50LmNvbm5lY3QoZGJ1cmwsIGZ1bmN0aW9uKGVyciwgZGIpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRhbGtzID0gZGIuY29sbGVjdGlvbigndGFsa3MnKTtcbiAgICAgICAgdGFsa3MuXG4gICAgICAgIGZpbmQoe30pLlxuICAgICAgICBzb3J0KHtcbiAgICAgICAgICAgIHZpZXdDb3VudDogLTFcbiAgICAgICAgfSkuXG4gICAgICAgIGxpbWl0KHF1YW50aXR5KS5cbiAgICAgICAgdG9BcnJheShmdW5jdGlvbihlcnIsIGRvY3MpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRiLmNsb3NlKCk7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgZG9jcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiBjcmVhdGUgYSBuZXcgdGFsa1xuICogQHBhcmFtIGRidXJsICAgICBkYXRhYmFzZSB1cmwgc3RyaW5nXG4gKiBAcGFyYW0gb2JqICAgICAgIG51bWJlciBvZiByZXN1bHRzIHRvIGdldFxuICogQHBhcmFtIGNhbGxiYWNrICBmdW5jdGlvbiB0byBleGVjdXRlIHdpdGggdGhlIHJlc3VsdGluZyBkYXRhXG4gKi9cbmV4cG9ydHMuY3JlYXRlVGFsayA9IGZ1bmN0aW9uKGRidXJsLCBvYmosIGNhbGxiYWNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgTW9uZ29DbGllbnQuY29ubmVjdChkYnVybCwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGFsa3MgPSBkYi5jb2xsZWN0aW9uKCd0YWxrcycpO1xuICAgICAgICB0YWxrcy5pbnNlcnQob2JqLCBmdW5jdGlvbihlcnIsIGRvY3MpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRiLmNsb3NlKCk7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgZG9jcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiBkZWxldGUgYSB0YWxrIGJ5IGl0cyBpZFxuICogQHBhcmFtIGRidXJsICAgICBkYXRhYmFzZSB1cmwgc3RyaW5nXG4gKiBAcGFyYW0gaWQgICAgICAgIHRhbGsgaWQgc3RyaW5nXG4gKiBAcGFyYW0gY2FsbGJhY2sgIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2l0aCB0aGUgcmVzdWx0aW5nIGRhdGFcbiAqL1xuZXhwb3J0cy5kZWxldGVUYWxrID0gZnVuY3Rpb24oZGJ1cmwsIGlkLCBjYWxsYmFjaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIE1vbmdvQ2xpZW50LmNvbm5lY3QoZGJ1cmwsIGZ1bmN0aW9uKGVyciwgZGIpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRhbGtzID0gZGIuY29sbGVjdGlvbigndGFsa3MnKTtcbiAgICAgICAgdGFsa3MucmVtb3ZlKHtcbiAgICAgICAgICAgIGlkOiBpZFxuICAgICAgICB9LCBmdW5jdGlvbihlcnIsIGRvY3MpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRiLmNsb3NlKCk7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgZG9jcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiBnZXQgYSB0YWxrIGJ5IGl0cyBpZFxuICogQHBhcmFtIGRidXJsICAgICBkYXRhYmFzZSB1cmwgc3RyaW5nXG4gKiBAcGFyYW0gaWQgICAgICAgIHRhbGsgaWQgc3RyaW5nXG4gKiBAcGFyYW0gY2FsbGJhY2sgIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2l0aCB0aGUgcmVzdWx0aW5nIGRhdGFcbiAqL1xuZXhwb3J0cy5nZXQgPSBmdW5jdGlvbihkYnVybCwgaWQsIGNhbGxiYWNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgTW9uZ29DbGllbnQuY29ubmVjdChkYnVybCwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGFsa3MgPSBkYi5jb2xsZWN0aW9uKCd0YWxrcycpO1xuICAgICAgICB0YWxrcy5maW5kT25lKHtcbiAgICAgICAgICAgIGlkOiBpZFxuICAgICAgICB9LCBmdW5jdGlvbihlcnIsIGRvYykge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGIuY2xvc2UoKTtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBkb2MpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogcGxheSBhIHRhbGtcbiAqIFVwZGF0ZXMgdmlld3MgZmllbGQgYnkgMS5cbiAqIEBwYXJhbSBkYnVybCAgICAgZGF0YWJhc2UgdXJsIHN0cmluZ1xuICogQHBhcmFtIGlkICAgICAgICBUYWxrIGlkXG4gKiBAcGFyYW0gY2FsbGJhY2sgIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2l0aCB0aGUgcmVzdWx0aW5nIGRhdGFcbiAqL1xuZXhwb3J0cy5wbGF5ID0gZnVuY3Rpb24oZGJ1cmwsIGlkLCBjYWxsYmFjaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIE1vbmdvQ2xpZW50LmNvbm5lY3QoZGJ1cmwsIGZ1bmN0aW9uKGVyciwgZGIpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRhbGtzID0gZGIuY29sbGVjdGlvbigndGFsa3MnKTtcbiAgICAgICAgdGFsa3MuZmluZE9uZSh7XG4gICAgICAgICAgICBcImlkXCI6IGlkXG4gICAgICAgIH0sIGZ1bmN0aW9uKGVyciwgdGFsaykge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGFsay5WaWV3Q291bnQgPSB0YWxrLnZpZXdDb3VudCArIDE7XG4gICAgICAgICAgICB0YWxrcy51cGRhdGUoe1xuICAgICAgICAgICAgICAgIFwiaWRcIjogaWRcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIHZpZXdDb3VudDogdGFsay52aWV3Q291bnQsXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWQ6IERhdGUubm93KClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkYi5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCB0YWxrKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogZ2V0IGEgdGFsayBieSB0YWdcbiAqIEBwYXJhbSBkYnVybCAgICAgZGF0YWJhc2UgdXJsIHN0cmluZ1xuICogQHBhcmFtIHRhZyAgICAgICB0YWxrIHRhZyBzdHJpbmdcbiAqIEBwYXJhbSBjYWxsYmFjayAgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aXRoIHRoZSByZXN1bHRpbmcgZGF0YVxuICovXG5leHBvcnRzLmdldEJ5VGFnID0gZnVuY3Rpb24oZGJ1cmwsIHRhZywgY2FsbGJhY2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBNb25nb0NsaWVudC5jb25uZWN0KGRidXJsLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0YWxrcyA9IGRiLmNvbGxlY3Rpb24oJ3RhbGtzJyk7XG4gICAgICAgIHRhbGtzLmZpbmQoe1xuICAgICAgICAgICAgdGFnczogdGFnXG4gICAgICAgIH0pLnNvcnQoe1xuICAgICAgICAgICAgdmlld0NvdW50OiAtMVxuICAgICAgICB9KS50b0FycmF5KGZ1bmN0aW9uKGVyciwgZG9jcykge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGIuY2xvc2UoKTtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBkb2NzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG4vKipcbiAqIGdldCBhIHRhbGsgYnkgaXRzIHNsdWcgZmllbGRcbiAqIEBwYXJhbSBkYnVybCAgICAgZGF0YWJhc2UgdXJsIHN0cmluZ1xuICogQHBhcmFtIHNsdWcgICAgICB0YWxrIHNsdWcgc3RyaW5nXG4gKiBAcGFyYW0gY2FsbGJhY2sgIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2l0aCB0aGUgcmVzdWx0aW5nIGRhdGFcbiAqL1xuZXhwb3J0cy5nZXRCeVNsdWcgPSBmdW5jdGlvbihkYnVybCwgc2x1ZywgY2FsbGJhY2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBNb25nb0NsaWVudC5jb25uZWN0KGRidXJsLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0YWxrcyA9IGRiLmNvbGxlY3Rpb24oJ3RhbGtzJyk7XG4gICAgICAgIHRhbGtzLmZpbmQoe1xuICAgICAgICAgICAgXCJzbHVnXCI6IHNsdWdcbiAgICAgICAgfSkudG9BcnJheShmdW5jdGlvbihlcnIsIGRvY3MpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRiLmNsb3NlKCk7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgZG9jcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiBnZXQgcmVsdGF0ZWQgdGFsa3MgZnJvbSBhIHRhbGtcbiAqIEBwYXJhbSBkYnVybCAgICAgZGF0YWJhc2UgdXJsIHN0cmluZ1xuICogQHBhcmFtIHRhbGsgICAgICB0YWxrIG9iamVjdFxuICogQHBhcmFtIGNhbGxiYWNrICBmdW5jdGlvbiB0byBleGVjdXRlIHdpdGggdGhlIHJlc3VsdGluZyBkYXRhXG4gKi9cbmV4cG9ydHMucmVsYXRlZCA9IGZ1bmN0aW9uKGRidXJsLCB0YWxrLCBjYWxsYmFjaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIE1vbmdvQ2xpZW50LmNvbm5lY3QoZGJ1cmwsIGZ1bmN0aW9uKGVyciwgZGIpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRhbGtzID0gZGIuY29sbGVjdGlvbigndGFsa3MnKTtcbiAgICAgICAgdGFsa3MuZmluZCh7XG4gICAgICAgICAgICBcInRhZ3NcIjoge1xuICAgICAgICAgICAgICAgICRpbjogdGFsay50YWdzXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRvQXJyYXkoZnVuY3Rpb24oZXJyLCBkb2NzKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkYi5jbG9zZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIGRvY3MpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogZ2V0IGEgdGFsayBieSBpdHMgaWRcbiAqIEBwYXJhbSBkYnVybCAgICAgZGF0YWJhc2UgdXJsIHN0cmluZ1xuICogQHBhcmFtIGlkICAgICAgICBhdXRob3IgaWQgc3RyaW5nXG4gKiBAcGFyYW0gY2FsbGJhY2sgIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2l0aCB0aGUgcmVzdWx0aW5nIGRhdGFcbiAqL1xuZXhwb3J0cy5nZXRCeUF1dGhvcklkID0gZnVuY3Rpb24oZGJ1cmwsIGlkLCBjYWxsYmFjaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIE1vbmdvQ2xpZW50LmNvbm5lY3QoZGJ1cmwsIGZ1bmN0aW9uKGVyciwgZGIpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRhbGtzID0gZGIuY29sbGVjdGlvbigndGFsa3MnKTtcbiAgICAgICAgdGFsa3MuZmluZCh7XG4gICAgICAgICAgICBcImF1dGhvci5pZFwiOiBpZFxuICAgICAgICB9KS50b0FycmF5KGZ1bmN0aW9uKGVyciwgZG9jcykge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGIuY2xvc2UoKTtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBkb2NzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9