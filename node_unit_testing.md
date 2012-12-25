Node.js Unit Testing
=========
### by @朴灵

## Agenda
- 什么是单元测试？
- 测试框架
- 断言库
- 测试用例
- 覆盖率
- Mock
- 私有方法测试
- 持续集成

## 讲什么不讲什么
- 讲单元测试过程中的关键点和关键流程
- 不讲单元测试过程中的过小的细节

## 什么是单元测试
`demo.js` by @代码诗人芋头

```
var dp = require("../lib/index.js");
dp.process(process.cwd().replace(/demo$/,""), {
  blackList:[
  // "*demo.js"
  ]
}, function (error,result) {
  if(error){
    //code=1 是致命错误，code=2 是请求错误，不致命。
  }else{
    console.log(result); 
  }
});
```
## 单元测试的认知误区
- 单元测试是QA妹纸的事情
- 示例代码不是单元测试？
- 自己测试自己的代码意义何在？
- 版本更新迭代维护单元测试的成本很高？
- 我这么牛逼，我就是不写单元测试，你咬我丫

## 今天之任务
编写一个稳定可靠的模块

1. 模块具备limit方法，输入一个数值，小于0的时候返回0，其余正常返回

```
exports.limit = function (num) {
  if (num < 0) {
    return 0;
  }
  return num;
};
```

## 目录分配

- `lib`，存放模块代码的地方
- `test`，存放单元测试代码的地方
- `index.js`，向外导出模块的地方
- `package.json`，包描述文件

## 测试框架
测试框架

- Mocha。`npm install mocha -g`

开发依赖/devDependencies

"devDependencies": {
  "mocha": "*"
}

## 测试接口
- BDD/行为驱动开发
- TDD/测试驱动开发

我们选择BDD，更贴近于思考方式

## BDD
- `describe()`
- `it()`

```
describe('module', function () {
  describe('limit', function () {
    it('limit should success', function () {
      lib.limit(10);
    });
  });
});
```

## BDD结果
在当前目录下执行`mocha`：

```
test_lib jacksontian $ mocha

  ․

  ✔ 1 test complete (2ms)


```

## BDD Hook
- `before()`
- `after()`

```
describe('module', function () {
  before(function () {
    console.log('Pre something');
  });
  describe('limit', function () {
    it('limit should success', function () {
      lib.limit(10);
    });
  });
  after(function () {
    console.log('Post something');
  });
});
```
## BDD Hook（2）
- `beforeEach()`
- `afterEach()`

```
describe('module', function () {
  beforeEach(function () {
    console.log('Pre something');
  });
  describe('limit', function () {
    it('limit should success', function () {
      lib.limit(10);
    });
  });
  afterEach(function () {
    console.log('Post something');
  });
});
```
## TDD
- `suite`
- `test`

```
suite('module', function() {
  suite('limit', function() {
    test('limit should success', function () {
      lib.limit(10);
    });
  });
});
```

## TDD Hook
- `setup`
- `teardown`

```
suite('module', function() {
  setup(function () {
    console.log('Pre something');
  });
  suite('limit', function() {
    test('limit should success', function () {
      lib.limit(10);
    });
  });
  teardown(function () {
    console.log('Post something');
  });
});
```

## 断言库
等等！我们还没检查结果呢，这算什么鸟测试呢，测试你妹啊。

断言库:

- should.js
- expect.js
- chai

## 加上断言

```
test('limit should success', function () {
  lib.limit(10).should.be.equal(10);
});
```


## 结果输出

```
test_lib jacksontian $ mocha --reporters

    dot - dot matrix
    doc - html documentation
    spec - hierarchical spec list
    json - single json object
    progress - progress bar
    list - spec-style listing
    tap - test-anything-protocol
    landing - unicode landing strip
    xunit - xunit reportert
    teamcity - teamcity ci support
    html-cov - HTML test coverage
    json-cov - JSON test coverage
    min - minimal reporter (great with --watch)
    json-stream - newline delimited json events
    markdown - markdown documentation (github flavour)
    nyan - nyan cat!
```

```
mocha -R spec
mocha -R nyan
```
## 测试用例
需求变更啦：
`limit`这个方法还要求返回值大于100时返回100。

正向测试/反向测试

## 重构代码
```
exports.limit = function (num) {
  return num < 0 ? 0 : num;
};
```

## 测试用例的价值
问题？

- 如何确保你的改动对原有成果没有造成破坏？
- 如何验证本次的需求是被满足的？

## 异步怎么测试？
如何测试？

```
exports.async = function (callback) {
  setTimeout(function () {
    callback(10);
  }, 10);
};
```

## 测试异步代码

```
describe('async', function () {
  it('async', function (done) {
    lib.async(function (result) {
      done();
    });
  });
});
```
## 异步方法的超时支持
```
exports.asyncTimeout = function (callback) {
  setTimeout(function () {
    callback(10);
  }, 6000);
};
```

```
mocha -t 10000
```

## 异步方法的异常处理

```
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
```

## 你的Case覆盖完全吗？
单元测试重要指标：

- 覆盖率

模块：

- `npm install jscover`

## 生成可被追踪的代码

```
./node_modules/.bin/jscover lib lib-cov
```

```
_$jscoverage['index.js'].source = ["exports.limit = function (input) {","  return input &lt; 0 ? 0 : input;","};"];
_$jscoverage['index.js'][1]++;
exports.limit = function(input) {
  _$jscoverage['index.js'][2]++;
  return input < 0 ? 0 : input;
};
```

## 测试时引入追踪代码
```
module.exports = process.env.LIB_COV ? require('./lib-cov/index') : require('./lib/index');
```
备注，每个模块应该用自己的环境变量，以防止冲突

## 生成HTML覆盖率结果页

```
// 设置当前命令行有效的变量
export LIB_COV=1
mocha -R html-cov > coverage.html
```

## Mock
异常该怎么测试？

```
exports.getContent = function (filename, callback) {
  fs.readFile(filename, 'utf-8', callback);
};
```

## 简单mock
hook派上用场了

```
describe("getContent", function () {
  var _readFile;
  before(function () {
    _readFile = fs.readFile;
    fs.readFile = function (filename, encoding, callback) {
      callback(new Error("mock readFile error"));
    };
  });
  // it();
  after(function () {
    // 用完之后记得还原。否则影响其他case
    fs.readFile = _readFile;
  })
});
```

## 谨慎mock
异步接口依旧需要保持异步

```
fs.readFile = function (filename, encoding, callback) {
  process.nextTick(function () {
    callback(new Error("mock readFile error"));
  });
};
```

## Mock库
Mock小模块：`muk`

```
var fs = require('fs');
var muk = require('muk');

muk(fs, 'readFile', function(path, callback) {
  process.nextTick(function () {
    callback(new Error("mock readFile error"));
  });
});
```

## 略微优美

```
before(function () {
  muk(fs, 'readFile', function(path, encoding, callback) {
    process.nextTick(function () {
      callback(new Error("mock readFile error"));
    });
  });
});
// it();
after(function () {
  muk.restore();
});
```

## 测试私有方法
模块：[`rewire`](http://jhnns.github.com/rewire/)

今天老板说，limit方法不能再对外暴露了。如何测试它？

## 通过rewire导出方法
```
it('limit should return success', function () {
  var lib = rewire('../lib/index.js');
  var litmit = lib.__get__('limit');
  litmit(10);
});
```

## rewire原理
【闭包原理】加载文件时注入`__set__`和`__get__`方法。该方法可以访问内部变量。

```
(function (exports, require, module, __filename, __dirname) {
  var method = function () {};
  exports.__set__ = function (name, value) {
    eval(name " = " value.toString());
  };
  exports.__get__ = function (name) {
    return eval(name);
  };
});
```

## 用Makefile串起项目
```
TESTS = test/*.test.js
REPORTER = spec
TIMEOUT = 10000
JSCOVERAGE = ./node_modules/jscover/bin/jscover

test:
	@NODE_ENV=test ./node_modules/mocha/bin/mocha -R $(REPORTER) -t $(TIMEOUT) $(TESTS)

test-cov: lib-cov
	@LIB_COV=1 $(MAKE) test REPORTER=dot
	@LIB_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@rm -rf ./lib-cov
	@$(JSCOVERAGE) lib lib-cov

.PHONY: test test-cov lib-cov
```

```
make test
make test-cov
```

用项目自身的jscover和mocha，避免版本冲突和混乱

## 不持续集成不舒服
- [Travis-ci](https://travis-ci.org/)
  - 绑定Github帐号
  - 在Github仓库的Admin打开Services hook
  - 打开Travis
  - 每次push将会hook触发执行`npm test`命令
  
## 不持续集成不舒服2
注意：Travis会将未描述的项目当作Ruby项目。所以需要在根目录下加入`.travis.yml`文件。内容如下：

```
language: node_js
node_js:
  - 0.6
  - 0.8
```

![](https://secure.travis-ci.org/JacksonTian/bagpipe.png)
or ![](https://secure.travis-ci.org/TBEDP/datavjs.png)

## 总结
- 使代码可以放心修改和重构
- 食自己的狗食
- 只有质量保证的代码才能有质量保证的产品
- 写好代码和测试，把查找bug的时间用来干更有意义的事情
- 单元测试Passing和覆盖率100%是一种荣耀
- 有单元测试的代码，再差也不会差到哪里去
    - 没单元测试，吹牛逼也要小心
- 集成的，好喝的

## TODO
- 前后端共用单元测试
- 断言的细节和技巧
- Mocha的更多技巧
- connect/express web应用的测试
    - `supertest`
- 性能测试/功能测试

## QA && Thanks

## More
- [单元测试示例项目](https://github.com/JacksonTian/unittesting)
- [单元测试实战](fengmk2.github.com/ppt/unittest-and-bdd-in-nodejs-with-mocha.html) 内容与本PPT有互补
- Mocha/Should/Chai/Except/Assert
- rewire/pedding/supertest/muk