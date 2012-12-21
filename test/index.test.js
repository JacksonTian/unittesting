var lib = require('../');
var should = require('should');
var fs = require('fs');
var muk = require('muk');
var rewire = require('rewire');

describe('module', function () {
  describe('limit', function () {
    it('limit should success', function () {
      lib.limit(10).should.be.equal(10);
    });

    it('limit should ok when less than 0', function () {
      lib.limit(-1).should.be.equal(0);
    });
  });

  describe('async', function () {
    it('async', function (done) {
      lib.async(function (result) {
        done();
      });
    });
  });
 
  describe('asyncTimeout', function () {
    it('async should ok', function (done) {
      lib.asyncTimeout(function (result) {
        done();
      });
    });
  });

  describe('parseAsync', function () {
    it('parseAsync should ok', function (done) {
      lib.parseAsync('{"name": "JacksonTian"}', function (err, data) {
        should.not.exist(err);
        data.name.should.be.equal('JacksonTian');
        done();
      });
    });

    it('parseAsync should throw err', function (done) {
      lib.parseAsync('{"name": "JacksonTian"}}', function (err, data) {
        should.exist(err);
        done();
      });
    });
  });

  describe("getContent", function () {
    it('getContent should ok', function (done) {
      lib.getContent(__filename, function (err, content) {
        should.not.exist(err);
        content.length.should.be.above(100);
        done();
      });
    });

    describe("mock getCotent", function () {
      var _readFile;
      before(function () {
        _readFile = fs.readFile;
        fs.readFile = function (filename, encoding, callback) {
          process.nextTick(function () {
            callback(new Error("mock readFile error"));
          });
        };
      });
      
      it("should get mock error", function (done) {
        lib.getContent(__filename, function (err, content) {
          should.exist(err);
          err.message.should.be.equal("mock readFile error");
          done();
        });
      });
    
      after(function () {
        // 用完之后记得还原。否则影响其他case
        fs.readFile = _readFile;
      });
    });

    describe("mock getCotent with muk", function () {
      before(function () {
        muk(fs, 'readFile', function(filename, encoding, callback) {
          process.nextTick(function () {
            callback(new Error("mock readFile error with muk"));
          });
        });
      });

      it("should get mock error", function (done) {
        lib.getContent(__filename, function (err, content) {
          should.exist(err);
          err.message.should.be.equal("mock readFile error with muk");
          done();
        });
      });
    
      after(function () {
        muk.restore();
      });
    });
  });

  describe('_limit', function () {
    var _limit = rewire('../lib/index.js').__get__('limit');
    it('_limit should success', function () {
      _limit(10).should.be.equal(10);
    });

    it('_limit should ok when less than 0', function () {
      _limit(-1).should.be.equal(0);
    });
  });

  describe('limit2', function () {
    it('limit2 should success', function () {
      lib.limit2(10).should.be.equal(10);
    });

    it('limit2 should ok when less than 0', function () {
      lib.limit(-1).should.be.equal(0);
    });
  });
});
