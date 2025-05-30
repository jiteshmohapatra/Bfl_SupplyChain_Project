// script.aculo.us unittest.js v1.8.3, Thu Oct 08 11:23:33 +0200 2009

// Copyright (c) 2005-2009 Thomas Fuchs (http://script.aculo.us, http://mir.aculo.us)
//           (c) 2005-2009 Jon Tirsen (http://www.tirsen.com)
//           (c) 2005-2009 Michael Schuerig (http://www.schuerig.de/michael/)
//
// script.aculo.us is freely distributable under the terms of an MIT-style license.
// For details, see the script.aculo.us web site: http://script.aculo.us/

// experimental, Firefox-only
Event.simulateMouse = function (element, eventName) {
  const options = Object.extend({
    pointerX: 0,
    pointerY: 0,
    buttons: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
  }, arguments[2] || {});
  const oEvent = document.createEvent('MouseEvents');
  oEvent.initMouseEvent(eventName, true, true, document.defaultView,
    options.buttons, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
    options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, 0, $(element));

  if (this.mark) Element.remove(this.mark);
  this.mark = document.createElement('div');
  this.mark.appendChild(document.createTextNode(' '));
  document.body.appendChild(this.mark);
  this.mark.style.position = 'absolute';
  this.mark.style.top = `${options.pointerY}px`;
  this.mark.style.left = `${options.pointerX}px`;
  this.mark.style.width = '5px';
  this.mark.style.height = '5px;';
  this.mark.style.borderTop = '1px solid red;';
  this.mark.style.borderLeft = '1px solid red;';

  if (this.step) alert(`[${new Date().getTime().toString()}] ${eventName}/${Test.Unit.inspect(options)}`);

  $(element).dispatchEvent(oEvent);
};

// Note: Due to a fix in Firefox 1.0.5/6 that probably fixed "too much", this doesn't work in 1.0.6 or DP2.
// You need to downgrade to 1.0.4 for now to get this working
// See https://bugzilla.mozilla.org/show_bug.cgi?id=289940 for the fix that fixed too much
Event.simulateKey = function (element, eventName) {
  const options = Object.extend({
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    keyCode: 0,
    charCode: 0,
  }, arguments[2] || {});

  const oEvent = document.createEvent('KeyEvents');
  oEvent.initKeyEvent(eventName, true, true, window,
    options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
    options.keyCode, options.charCode);
  $(element).dispatchEvent(oEvent);
};

Event.simulateKeys = function (element, command) {
  for (let i = 0; i < command.length; i++) {
    Event.simulateKey(element, 'keypress', { charCode: command.charCodeAt(i) });
  }
};

var Test = {};
Test.Unit = {};

// security exception workaround
Test.Unit.inspect = Object.inspect;

Test.Unit.Logger = Class.create();
Test.Unit.Logger.prototype = {
  initialize(log) {
    this.log = $(log);
    if (this.log) {
      this._createLogTable();
    }
  },
  start(testName) {
    if (!this.log) return;
    this.testName = testName;
    this.lastLogLine = document.createElement('tr');
    this.statusCell = document.createElement('td');
    this.nameCell = document.createElement('td');
    this.nameCell.className = 'nameCell';
    this.nameCell.appendChild(document.createTextNode(testName));
    this.messageCell = document.createElement('td');
    this.lastLogLine.appendChild(this.statusCell);
    this.lastLogLine.appendChild(this.nameCell);
    this.lastLogLine.appendChild(this.messageCell);
    this.loglines.appendChild(this.lastLogLine);
  },
  finish(status, summary) {
    if (!this.log) return;
    this.lastLogLine.className = status;
    this.statusCell.innerHTML = status;
    this.messageCell.innerHTML = this._toHTML(summary);
    this.addLinksToResults();
  },
  message(message) {
    if (!this.log) return;
    this.messageCell.innerHTML = this._toHTML(message);
  },
  summary(summary) {
    if (!this.log) return;
    this.logsummary.innerHTML = this._toHTML(summary);
  },
  _createLogTable() {
    this.log.innerHTML = '<div id="logsummary"></div>'
    + '<table id="logtable">'
    + '<thead><tr><th>Status</th><th>Test</th><th>Message</th></tr></thead>'
    + '<tbody id="loglines"></tbody>'
    + '</table>';
    this.logsummary = $('logsummary');
    this.loglines = $('loglines');
  },
  _toHTML(txt) {
    return txt.escapeHTML().replace(/\n/g, '<br/>');
  },
  addLinksToResults() {
    $$('tr.failed .nameCell').each((td) => { // todo: limit to children of this.log
      td.title = 'Run only this test';
      Event.observe(td, 'click', () => { window.location.search = `?tests=${td.innerHTML}`; });
    });
    $$('tr.passed .nameCell').each((td) => { // todo: limit to children of this.log
      td.title = 'Run all tests';
      Event.observe(td, 'click', () => { window.location.search = ''; });
    });
  },
};

Test.Unit.Runner = Class.create();
Test.Unit.Runner.prototype = {
  initialize(testcases) {
    this.options = Object.extend({
      testLog: 'testlog',
    }, arguments[1] || {});
    this.options.resultsURL = this.parseResultsURLQueryParameter();
    this.options.tests = this.parseTestsQueryParameter();
    if (this.options.testLog) {
      this.options.testLog = $(this.options.testLog) || null;
    }
    if (this.options.tests) {
      this.tests = [];
      for (let i = 0; i < this.options.tests.length; i++) {
        if (/^test/.test(this.options.tests[i])) {
          this.tests.push(new Test.Unit.Testcase(this.options.tests[i], testcases[this.options.tests[i]], testcases.setup, testcases.teardown));
        }
      }
    } else if (this.options.test) {
      this.tests = [new Test.Unit.Testcase(this.options.test, testcases[this.options.test], testcases.setup, testcases.teardown)];
    } else {
      this.tests = [];
      for (const testcase in testcases) {
        if (/^test/.test(testcase)) {
          this.tests.push(
            new Test.Unit.Testcase(
              this.options.context ? ` -> ${this.options.titles[testcase]}` : testcase,
              testcases[testcase], testcases.setup, testcases.teardown,
            ),
          );
        }
      }
    }
    this.currentTest = 0;
    this.logger = new Test.Unit.Logger(this.options.testLog);
    setTimeout(this.runTests.bind(this), 1000);
  },
  parseResultsURLQueryParameter() {
    return window.location.search.parseQuery().resultsURL;
  },
  parseTestsQueryParameter() {
    if (window.location.search.parseQuery().tests) {
      return window.location.search.parseQuery().tests.split(',');
    }
  },
  // Returns:
  //  "ERROR" if there was an error,
  //  "FAILURE" if there was a failure, or
  //  "SUCCESS" if there was neither
  getResult() {
    let hasFailure = false;
    for (let i = 0; i < this.tests.length; i++) {
      if (this.tests[i].errors > 0) {
        return 'ERROR';
      }
      if (this.tests[i].failures > 0) {
        hasFailure = true;
      }
    }
    if (hasFailure) {
      return 'FAILURE';
    }
    return 'SUCCESS';
  },
  postResults() {
    if (this.options.resultsURL) {
      new Ajax.Request(this.options.resultsURL,
        { method: 'get', parameters: `result=${this.getResult()}`, asynchronous: false });
    }
  },
  runTests() {
    const test = this.tests[this.currentTest];
    if (!test) {
      // finished!
      this.postResults();
      this.logger.summary(this.summary());
      return;
    }
    if (!test.isWaiting) {
      this.logger.start(test.name);
    }
    test.run();
    if (test.isWaiting) {
      this.logger.message(`Waiting for ${test.timeToWait}ms`);
      setTimeout(this.runTests.bind(this), test.timeToWait || 1000);
    } else {
      this.logger.finish(test.status(), test.summary());
      this.currentTest++;
      // tail recursive, hopefully the browser will skip the stackframe
      this.runTests();
    }
  },
  summary() {
    let assertions = 0;
    let failures = 0;
    let errors = 0;
    const messages = [];
    for (let i = 0; i < this.tests.length; i++) {
      assertions += this.tests[i].assertions;
      failures += this.tests[i].failures;
      errors += this.tests[i].errors;
    }
    return (
      `${(this.options.context ? `${this.options.context}: ` : '')
      + this.tests.length} tests, ${
        assertions} assertions, ${
        failures} failures, ${
        errors} errors`);
  },
};

Test.Unit.Assertions = Class.create();
Test.Unit.Assertions.prototype = {
  initialize() {
    this.assertions = 0;
    this.failures = 0;
    this.errors = 0;
    this.messages = [];
  },
  summary() {
    return (
      `${this.assertions} assertions, ${
        this.failures} failures, ${
        this.errors} errors` + `\n${
        this.messages.join('\n')}`);
  },
  pass() {
    this.assertions++;
  },
  fail(message) {
    this.failures++;
    this.messages.push(`Failure: ${message}`);
  },
  info(message) {
    this.messages.push(`Info: ${message}`);
  },
  error(error) {
    this.errors++;
    this.messages.push(`${error.name}: ${error.message}(${Test.Unit.inspect(error)})`);
  },
  status() {
    if (this.failures > 0) return 'failed';
    if (this.errors > 0) return 'error';
    return 'passed';
  },
  assert(expression) {
    const message = arguments[1] || `assert: got "${Test.Unit.inspect(expression)}"`;
    try {
      expression ? this.pass()
        : this.fail(message);
    } catch (e) { this.error(e); }
  },
  assertEqual(expected, actual) {
    const message = arguments[2] || 'assertEqual';
    try {
      (expected == actual) ? this.pass()
        : this.fail(`${message}: expected "${Test.Unit.inspect(expected)
        }", actual "${Test.Unit.inspect(actual)}"`);
    } catch (e) { this.error(e); }
  },
  assertInspect(expected, actual) {
    const message = arguments[2] || 'assertInspect';
    try {
      (expected == actual.inspect()) ? this.pass()
        : this.fail(`${message}: expected "${Test.Unit.inspect(expected)
        }", actual "${Test.Unit.inspect(actual)}"`);
    } catch (e) { this.error(e); }
  },
  assertEnumEqual(expected, actual) {
    const message = arguments[2] || 'assertEnumEqual';
    try {
      $A(expected).length == $A(actual).length
      && expected.zip(actual).all((pair) => pair[0] == pair[1])
        ? this.pass() : this.fail(`${message}: expected ${Test.Unit.inspect(expected)
        }, actual ${Test.Unit.inspect(actual)}`);
    } catch (e) { this.error(e); }
  },
  assertNotEqual(expected, actual) {
    const message = arguments[2] || 'assertNotEqual';
    try {
      (expected != actual) ? this.pass()
        : this.fail(`${message}: got "${Test.Unit.inspect(actual)}"`);
    } catch (e) { this.error(e); }
  },
  assertIdentical(expected, actual) {
    const message = arguments[2] || 'assertIdentical';
    try {
      (expected === actual) ? this.pass()
        : this.fail(`${message}: expected "${Test.Unit.inspect(expected)
        }", actual "${Test.Unit.inspect(actual)}"`);
    } catch (e) { this.error(e); }
  },
  assertNotIdentical(expected, actual) {
    const message = arguments[2] || 'assertNotIdentical';
    try {
      !(expected === actual) ? this.pass()
        : this.fail(`${message}: expected "${Test.Unit.inspect(expected)
        }", actual "${Test.Unit.inspect(actual)}"`);
    } catch (e) { this.error(e); }
  },
  assertNull(obj) {
    const message = arguments[1] || 'assertNull';
    try {
      (obj == null) ? this.pass()
        : this.fail(`${message}: got "${Test.Unit.inspect(obj)}"`);
    } catch (e) { this.error(e); }
  },
  assertMatch(expected, actual) {
    const message = arguments[2] || 'assertMatch';
    const regex = new RegExp(expected);
    try {
      (regex.exec(actual)) ? this.pass()
        : this.fail(`${message} : regex: "${Test.Unit.inspect(expected)} did not match: ${Test.Unit.inspect(actual)}"`);
    } catch (e) { this.error(e); }
  },
  assertHidden(element) {
    const message = arguments[1] || 'assertHidden';
    this.assertEqual('none', element.style.display, message);
  },
  assertNotNull(object) {
    const message = arguments[1] || 'assertNotNull';
    this.assert(object != null, message);
  },
  assertType(expected, actual) {
    const message = arguments[2] || 'assertType';
    try {
      (actual.constructor == expected) ? this.pass()
        : this.fail(`${message}: expected "${Test.Unit.inspect(expected)
        }", actual "${actual.constructor}"`);
    } catch (e) { this.error(e); }
  },
  assertNotOfType(expected, actual) {
    const message = arguments[2] || 'assertNotOfType';
    try {
      (actual.constructor != expected) ? this.pass()
        : this.fail(`${message}: expected "${Test.Unit.inspect(expected)
        }", actual "${actual.constructor}"`);
    } catch (e) { this.error(e); }
  },
  assertInstanceOf(expected, actual) {
    const message = arguments[2] || 'assertInstanceOf';
    try {
      (actual instanceof expected) ? this.pass()
        : this.fail(`${message}: object was not an instance of the expected type`);
    } catch (e) { this.error(e); }
  },
  assertNotInstanceOf(expected, actual) {
    const message = arguments[2] || 'assertNotInstanceOf';
    try {
      !(actual instanceof expected) ? this.pass()
        : this.fail(`${message}: object was an instance of the not expected type`);
    } catch (e) { this.error(e); }
  },
  assertRespondsTo(method, obj) {
    const message = arguments[2] || 'assertRespondsTo';
    try {
      (obj[method] && typeof obj[method] === 'function') ? this.pass()
        : this.fail(`${message}: object doesn't respond to [${method}]`);
    } catch (e) { this.error(e); }
  },
  assertReturnsTrue(method, obj) {
    const message = arguments[2] || 'assertReturnsTrue';
    try {
      let m = obj[method];
      if (!m) m = obj[`is${method.charAt(0).toUpperCase()}${method.slice(1)}`];
      m() ? this.pass()
        : this.fail(`${message}: method returned false`);
    } catch (e) { this.error(e); }
  },
  assertReturnsFalse(method, obj) {
    const message = arguments[2] || 'assertReturnsFalse';
    try {
      let m = obj[method];
      if (!m) m = obj[`is${method.charAt(0).toUpperCase()}${method.slice(1)}`];
      !m() ? this.pass()
        : this.fail(`${message}: method returned true`);
    } catch (e) { this.error(e); }
  },
  assertRaise(exceptionName, method) {
    const message = arguments[2] || 'assertRaise';
    try {
      method();
      this.fail(`${message}: exception expected but none was raised`);
    } catch (e) {
      ((exceptionName == null) || (e.name == exceptionName)) ? this.pass() : this.error(e);
    }
  },
  assertElementsMatch() {
    const expressions = $A(arguments); const
      elements = $A(expressions.shift());
    if (elements.length != expressions.length) {
      this.fail(`assertElementsMatch: size mismatch: ${elements.length} elements, ${expressions.length} expressions`);
      return false;
    }
    elements.zip(expressions).all((pair, index) => {
      const element = $(pair.first()); const
        expression = pair.last();
      if (element.match(expression)) return true;
      this.fail(`assertElementsMatch: (in index ${index}) expected ${expression.inspect()} but got ${element.inspect()}`);
    }) && this.pass();
  },
  assertElementMatches(element, expression) {
    this.assertElementsMatch([element], expression);
  },
  benchmark(operation, iterations) {
    const startAt = new Date();
    (iterations || 1).times(operation);
    const timeTaken = ((new Date()) - startAt);
    this.info(`${arguments[2] || 'Operation'} finished ${
      iterations} iterations in ${timeTaken / 1000}s`);
    return timeTaken;
  },
  _isVisible(element) {
    element = $(element);
    if (!element.parentNode) return true;
    this.assertNotNull(element);
    if (element.style && Element.getStyle(element, 'display') == 'none') return false;

    return this._isVisible(element.parentNode);
  },
  assertNotVisible(element) {
    this.assert(!this._isVisible(element), `${Test.Unit.inspect(element)} was not hidden and didn't have a hidden parent either. ${'' || arguments[1]}`);
  },
  assertVisible(element) {
    this.assert(this._isVisible(element), `${Test.Unit.inspect(element)} was not visible. ${'' || arguments[1]}`);
  },
  benchmark(operation, iterations) {
    const startAt = new Date();
    (iterations || 1).times(operation);
    const timeTaken = ((new Date()) - startAt);
    this.info(`${arguments[2] || 'Operation'} finished ${
      iterations} iterations in ${timeTaken / 1000}s`);
    return timeTaken;
  },
};

Test.Unit.Testcase = Class.create();
Object.extend(Object.extend(Test.Unit.Testcase.prototype, Test.Unit.Assertions.prototype), {
  initialize(name, test, setup, teardown) {
    Test.Unit.Assertions.prototype.initialize.bind(this)();
    this.name = name;

    if (typeof test === 'string') {
      test = test.gsub(/(\.should[^\(]+\()/, '#{0}this,');
      test = test.gsub(/(\.should[^\(]+)\(this,\)/, '#{1}(this)');
      this.test = function () {
        eval(`with(this){${test}}`);
      };
    } else {
      this.test = test || function () {};
    }

    this.setup = setup || function () {};
    this.teardown = teardown || function () {};
    this.isWaiting = false;
    this.timeToWait = 1000;
  },
  wait(time, nextPart) {
    this.isWaiting = true;
    this.test = nextPart;
    this.timeToWait = time;
  },
  run() {
    try {
      try {
        if (!this.isWaiting) this.setup.bind(this)();
        this.isWaiting = false;
        this.test.bind(this)();
      } finally {
        if (!this.isWaiting) {
          this.teardown.bind(this)();
        }
      }
    } catch (e) { this.error(e); }
  },
});

// *EXPERIMENTAL* BDD-style testing to please non-technical folk
// This draws many ideas from RSpec http://rspec.rubyforge.org/

Test.setupBDDExtensionMethods = function () {
  const METHODMAP = {
    shouldEqual: 'assertEqual',
    shouldNotEqual: 'assertNotEqual',
    shouldEqualEnum: 'assertEnumEqual',
    shouldBeA: 'assertType',
    shouldNotBeA: 'assertNotOfType',
    shouldBeAn: 'assertType',
    shouldNotBeAn: 'assertNotOfType',
    shouldBeNull: 'assertNull',
    shouldNotBeNull: 'assertNotNull',

    shouldBe: 'assertReturnsTrue',
    shouldNotBe: 'assertReturnsFalse',
    shouldRespondTo: 'assertRespondsTo',
  };
  const makeAssertion = function (assertion, args, object) {
   	this[assertion].apply(this, (args || []).concat([object]));
  };

  Test.BDDMethods = {};
  $H(METHODMAP).each((pair) => {
    Test.BDDMethods[pair.key] = function () {
      const args = $A(arguments);
      const scope = args.shift();
      makeAssertion.apply(scope, [pair.value, args, this]);
    };
  });

  [Array.prototype, String.prototype, Number.prototype, Boolean.prototype].each(
    (p) => { Object.extend(p, Test.BDDMethods); },
  );
};

Test.context = function (name, spec, log) {
  Test.setupBDDExtensionMethods();

  const compiledSpec = {};
  const titles = {};
  for (specName in spec) {
    switch (specName) {
      case 'setup':
      case 'teardown':
        compiledSpec[specName] = spec[specName];
        break;
      default:
        var testName = `test${specName.gsub(/\s+/, '-').camelize()}`;
        var body = spec[specName].toString().split('\n').slice(1);
        if (/^\{/.test(body[0])) body = body.slice(1);
        body.pop();
        body = body.map((statement) => statement.strip());
        compiledSpec[testName] = body.join('\n');
        titles[testName] = specName;
    }
  }
  new Test.Unit.Runner(compiledSpec, { titles, testLog: log || 'testlog', context: name });
};
