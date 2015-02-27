var packagejson = require('./package.json');

exports.version = packagejson.version;

exports.talk = require('./lib/talk.js');
exports.search = require('./lib/search.js');
