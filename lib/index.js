var fs = require('fs');

exports.limit = function (num) {
  if (num < 0) {
    return 0;
  }
  return num;
};


var limit = function (num) {
  return num < 0 ? 0 : num;
};

exports.limit2 = function (num) {
  return limit(num);
};

exports.async = function (callback) {
  setTimeout(function () {
    callback(10);
  }, 10);
};

exports.asyncTimeout = function (callback) {
  setTimeout(function () {
    callback(10);
  }, 6000);
};

exports.parseAsync = function (input, callback) {
  setTimeout(function () {
    var result;
    try {
      result = JSON.parse(input);
    } catch (e) {
      return callback(e);
    }
    callback(null, result);
  }, 10);
};

exports.getContent = function (filename, callback) {
  fs.readFile(filename, 'utf-8', callback);
};
