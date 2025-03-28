/*  Prototype JavaScript framework, version 1.6.1
 *  (c) 2005-2009 Sam Stephenson
 *
 *  Prototype is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://www.prototypejs.org/
 *
 *--------------------------------------------------------------------------*/

const Prototype = {
  Version: '1.6.1',

  Browser: (function () {
    const ua = navigator.userAgent;
    const isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
    return {
      IE: !!window.attachEvent && !isOpera,
      Opera: isOpera,
      WebKit: ua.indexOf('AppleWebKit/') > -1,
      Gecko: ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1,
      MobileSafari: /Apple.*Mobile.*Safari/.test(ua),
    };
  }()),

  BrowserFeatures: {
    XPath: !!document.evaluate,
    SelectorsAPI: !!document.querySelector,
    ElementExtensions: (function () {
      const constructor = window.Element || window.HTMLElement;
      return !!(constructor && constructor.prototype);
    }()),
    SpecificElementExtensions: (function () {
      if (typeof window.HTMLDivElement !== 'undefined') return true;

      let div = document.createElement('div');
      let form = document.createElement('form');
      let isSupported = false;

      if (div.__proto__ && (div.__proto__ !== form.__proto__)) {
        isSupported = true;
      }

      div = form = null;

      return isSupported;
    }()),
  },

  ScriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script>',
  JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,

  emptyFunction() { },
  K(x) { return x; },
};

if (Prototype.Browser.MobileSafari) Prototype.BrowserFeatures.SpecificElementExtensions = false;

const Abstract = { };

const Try = {
  these() {
    let returnValue;

    for (let i = 0, { length } = arguments; i < length; i++) {
      const lambda = arguments[i];
      try {
        returnValue = lambda();
        break;
      } catch (e) { }
    }

    return returnValue;
  },
};

/* Based on Alex Arnell's inheritance implementation. */

var Class = (function () {
  function subclass() {}
  function create() {
    let parent = null; const
      properties = $A(arguments);
    if (Object.isFunction(properties[0])) parent = properties.shift();

    function klass() {
      this.initialize.apply(this, arguments);
    }

    Object.extend(klass, Class.Methods);
    klass.superclass = parent;
    klass.subclasses = [];

    if (parent) {
      subclass.prototype = parent.prototype;
      klass.prototype = new subclass();
      parent.subclasses.push(klass);
    }

    for (let i = 0; i < properties.length; i++) klass.addMethods(properties[i]);

    if (!klass.prototype.initialize) klass.prototype.initialize = Prototype.emptyFunction;

    klass.prototype.constructor = klass;
    return klass;
  }

  function addMethods(source) {
    const ancestor = this.superclass && this.superclass.prototype;
    const properties = Object.keys(source);

    if (!Object.keys({ toString: true }).length) {
      if (source.toString != Object.prototype.toString) properties.push('toString');
      if (source.valueOf != Object.prototype.valueOf) properties.push('valueOf');
    }

    for (let i = 0, { length } = properties; i < length; i++) {
      const property = properties[i]; let
        value = source[property];
      if (ancestor && Object.isFunction(value)
          && value.argumentNames().first() == '$super') {
        const method = value;
        value = (function (m) {
          return function () { return ancestor[m].apply(this, arguments); };
        }(property)).wrap(method);

        value.valueOf = method.valueOf.bind(method);
        value.toString = method.toString.bind(method);
      }
      this.prototype[property] = value;
    }

    return this;
  }

  return {
    create,
    Methods: {
      addMethods,
    },
  };
}());
(function () {
  const _toString = Object.prototype.toString;

  function extend(destination, source) {
    for (const property in source) destination[property] = source[property];
    return destination;
  }

  function inspect(object) {
    try {
      if (isUndefined(object)) return 'undefined';
      if (object === null) return 'null';
      return object.inspect ? object.inspect() : String(object);
    } catch (e) {
      if (e instanceof RangeError) return '...';
      throw e;
    }
  }

  function toJSON(object) {
    const type = typeof object;
    switch (type) {
      case 'undefined':
      case 'function':
      case 'unknown': return;
      case 'boolean': return object.toString();
    }

    if (object === null) return 'null';
    if (object.toJSON) return object.toJSON();
    if (isElement(object)) return;

    const results = [];
    for (const property in object) {
      const value = toJSON(object[property]);
      if (!isUndefined(value)) results.push(`${property.toJSON()}: ${value}`);
    }

    return `{${results.join(', ')}}`;
  }

  function toQueryString(object) {
    return $H(object).toQueryString();
  }

  function toHTML(object) {
    return object && object.toHTML ? object.toHTML() : String.interpret(object);
  }

  function keys(object) {
    const results = [];
    for (const property in object) results.push(property);
    return results;
  }

  function values(object) {
    const results = [];
    for (const property in object) results.push(object[property]);
    return results;
  }

  function clone(object) {
    return extend({ }, object);
  }

  function isElement(object) {
    return !!(object && object.nodeType == 1);
  }

  function isArray(object) {
    return _toString.call(object) == '[object Array]';
  }

  function isHash(object) {
    return object instanceof Hash;
  }

  function isFunction(object) {
    return typeof object === 'function';
  }

  function isString(object) {
    return _toString.call(object) == '[object String]';
  }

  function isNumber(object) {
    return _toString.call(object) == '[object Number]';
  }

  function isUndefined(object) {
    return typeof object === 'undefined';
  }

  extend(Object, {
    extend,
    inspect,
    toJSON,
    toQueryString,
    toHTML,
    keys,
    values,
    clone,
    isElement,
    isArray,
    isHash,
    isFunction,
    isString,
    isNumber,
    isUndefined,
  });
}());
Object.extend(Function.prototype, (function () {
  const { slice } = Array.prototype;

  function update(array, args) {
    const arrayLength = array.length; let
      { length } = args;
    while (length--) array[arrayLength + length] = args[length];
    return array;
  }

  function merge(array, args) {
    array = slice.call(array, 0);
    return update(array, args);
  }

  function argumentNames() {
    const names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
      .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
      .replace(/\s+/g, '').split(',');
    return names.length == 1 && !names[0] ? [] : names;
  }

  function bind(context) {
    if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
    const __method = this; const
      args = slice.call(arguments, 1);
    return function () {
      const a = merge(args, arguments);
      return __method.apply(context, a);
    };
  }

  function bindAsEventListener(context) {
    const __method = this; const
      args = slice.call(arguments, 1);
    return function (event) {
      const a = update([event || window.event], args);
      return __method.apply(context, a);
    };
  }

  function curry() {
    if (!arguments.length) return this;
    const __method = this; const
      args = slice.call(arguments, 0);
    return function () {
      const a = merge(args, arguments);
      return __method.apply(this, a);
    };
  }

  function delay(timeout) {
    const __method = this; const
      args = slice.call(arguments, 1);
    timeout *= 1000;
    return window.setTimeout(() => __method.apply(__method, args), timeout);
  }

  function defer() {
    const args = update([0.01], arguments);
    return this.delay.apply(this, args);
  }

  function wrap(wrapper) {
    const __method = this;
    return function () {
      const a = update([__method.bind(this)], arguments);
      return wrapper.apply(this, a);
    };
  }

  function methodize() {
    if (this._methodized) return this._methodized;
    const __method = this;
    return this._methodized = function () {
      const a = update([this], arguments);
      return __method.apply(null, a);
    };
  }

  return {
    argumentNames,
    bind,
    bindAsEventListener,
    curry,
    delay,
    defer,
    wrap,
    methodize,
  };
}()));

Date.prototype.toJSON = function () {
  return `"${this.getUTCFullYear()}-${
    (this.getUTCMonth() + 1).toPaddedString(2)}-${
    this.getUTCDate().toPaddedString(2)}T${
    this.getUTCHours().toPaddedString(2)}:${
    this.getUTCMinutes().toPaddedString(2)}:${
    this.getUTCSeconds().toPaddedString(2)}Z"`;
};

RegExp.prototype.match = RegExp.prototype.test;

RegExp.escape = function (str) {
  return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};
const PeriodicalExecuter = Class.create({
  initialize(callback, frequency) {
    this.callback = callback;
    this.frequency = frequency;
    this.currentlyExecuting = false;

    this.registerCallback();
  },

  registerCallback() {
    this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
  },

  execute() {
    this.callback(this);
  },

  stop() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  },

  onTimerEvent() {
    if (!this.currentlyExecuting) {
      try {
        this.currentlyExecuting = true;
        this.execute();
        this.currentlyExecuting = false;
      } catch (e) {
        this.currentlyExecuting = false;
        throw e;
      }
    }
  },
});
Object.extend(String, {
  interpret(value) {
    return value == null ? '' : String(value);
  },
  specialChar: {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '\\': '\\\\',
  },
});

Object.extend(String.prototype, (function () {
  function prepareReplacement(replacement) {
    if (Object.isFunction(replacement)) return replacement;
    const template = new Template(replacement);
    return function (match) { return template.evaluate(match); };
  }

  function gsub(pattern, replacement) {
    let result = ''; let source = this; let
      match;
    replacement = prepareReplacement(replacement);

    if (Object.isString(pattern)) pattern = RegExp.escape(pattern);

    if (!(pattern.length || pattern.source)) {
      replacement = replacement('');
      return replacement + source.split('').join(replacement) + replacement;
    }

    while (source.length > 0) {
      if (match = source.match(pattern)) {
        result += source.slice(0, match.index);
        result += String.interpret(replacement(match));
        source = source.slice(match.index + match[0].length);
      } else {
        result += source, source = '';
      }
    }
    return result;
  }

  function sub(pattern, replacement, count) {
    replacement = prepareReplacement(replacement);
    count = Object.isUndefined(count) ? 1 : count;

    return this.gsub(pattern, (match) => {
      if (--count < 0) return match[0];
      return replacement(match);
    });
  }

  function scan(pattern, iterator) {
    this.gsub(pattern, iterator);
    return String(this);
  }

  function truncate(length, truncation) {
    length = length || 30;
    truncation = Object.isUndefined(truncation) ? '...' : truncation;
    return this.length > length
      ? this.slice(0, length - truncation.length) + truncation : String(this);
  }

  function strip() {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
  }

  function stripTags() {
    return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
  }

  function stripScripts() {
    return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');
  }

  function extractScripts() {
    const matchAll = new RegExp(Prototype.ScriptFragment, 'img');
    const matchOne = new RegExp(Prototype.ScriptFragment, 'im');
    return (this.match(matchAll) || []).map((scriptTag) => (scriptTag.match(matchOne) || ['', ''])[1]);
  }

  function evalScripts() {
    return this.extractScripts().map((script) => eval(script));
  }

  function escapeHTML() {
    return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function unescapeHTML() {
    return this.stripTags().replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  }

  function toQueryParams(separator) {
    const match = this.strip().match(/([^?#]*)(#.*)?$/);
    if (!match) return { };

    return match[1].split(separator || '&').inject({ }, (hash, pair) => {
      if ((pair = pair.split('='))[0]) {
        const key = decodeURIComponent(pair.shift());
        let value = pair.length > 1 ? pair.join('=') : pair[0];
        if (value != undefined) value = decodeURIComponent(value);

        if (key in hash) {
          if (!Object.isArray(hash[key])) hash[key] = [hash[key]];
          hash[key].push(value);
        } else hash[key] = value;
      }
      return hash;
    });
  }

  function toArray() {
    return this.split('');
  }

  function succ() {
    return this.slice(0, this.length - 1)
      + String.fromCharCode(this.charCodeAt(this.length - 1) + 1);
  }

  function times(count) {
    return count < 1 ? '' : new Array(count + 1).join(this);
  }

  function camelize() {
    const parts = this.split('-'); const
      len = parts.length;
    if (len == 1) return parts[0];

    let camelized = this.charAt(0) == '-'
      ? parts[0].charAt(0).toUpperCase() + parts[0].substring(1)
      : parts[0];

    for (let i = 1; i < len; i++) camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);

    return camelized;
  }

  function capitalize() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
  }

  function underscore() {
    return this.replace(/::/g, '/')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
      .replace(/([a-z\d])([A-Z])/g, '$1_$2')
      .replace(/-/g, '_')
      .toLowerCase();
  }

  function dasherize() {
    return this.replace(/_/g, '-');
  }

  function inspect(useDoubleQuotes) {
    const escapedString = this.replace(/[\x00-\x1f\\]/g, (character) => {
      if (character in String.specialChar) {
        return String.specialChar[character];
      }
      return `\\u00${character.charCodeAt().toPaddedString(2, 16)}`;
    });
    if (useDoubleQuotes) return `"${escapedString.replace(/"/g, '\\"')}"`;
    return `'${escapedString.replace(/'/g, '\\\'')}'`;
  }

  function toJSON() {
    return this.inspect(true);
  }

  function unfilterJSON(filter) {
    return this.replace(filter || Prototype.JSONFilter, '$1');
  }

  function isJSON() {
    let str = this;
    if (str.blank()) return false;
    str = this.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
    return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
  }

  function evalJSON(sanitize) {
    const json = this.unfilterJSON();
    try {
      if (!sanitize || json.isJSON()) return eval(`(${json})`);
    } catch (e) { }
    throw new SyntaxError(`Badly formed JSON string: ${this.inspect()}`);
  }

  function include(pattern) {
    return this.indexOf(pattern) > -1;
  }

  function startsWith(pattern) {
    return this.indexOf(pattern) === 0;
  }

  function endsWith(pattern) {
    const d = this.length - pattern.length;
    return d >= 0 && this.lastIndexOf(pattern) === d;
  }

  function empty() {
    return this == '';
  }

  function blank() {
    return /^\s*$/.test(this);
  }

  function interpolate(object, pattern) {
    return new Template(this, pattern).evaluate(object);
  }

  return {
    gsub,
    sub,
    scan,
    truncate,
    strip: String.prototype.trim ? String.prototype.trim : strip,
    stripTags,
    stripScripts,
    extractScripts,
    evalScripts,
    escapeHTML,
    unescapeHTML,
    toQueryParams,
    parseQuery: toQueryParams,
    toArray,
    succ,
    times,
    camelize,
    capitalize,
    underscore,
    dasherize,
    inspect,
    toJSON,
    unfilterJSON,
    isJSON,
    evalJSON,
    include,
    startsWith,
    endsWith,
    empty,
    blank,
    interpolate,
  };
}()));

var Template = Class.create({
  initialize(template, pattern) {
    this.template = template.toString();
    this.pattern = pattern || Template.Pattern;
  },

  evaluate(object) {
    if (object && Object.isFunction(object.toTemplateReplacements)) object = object.toTemplateReplacements();

    return this.template.gsub(this.pattern, (match) => {
      if (object == null) return (`${match[1]}`);

      const before = match[1] || '';
      if (before == '\\') return match[2];

      let ctx = object; let
        expr = match[3];
      const pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
      match = pattern.exec(expr);
      if (match == null) return before;

      while (match != null) {
        const comp = match[1].startsWith('[') ? match[2].replace(/\\\\]/g, ']') : match[1];
        ctx = ctx[comp];
        if (ctx == null || match[3] == '') break;
        expr = expr.substring(match[3] == '[' ? match[1].length : match[0].length);
        match = pattern.exec(expr);
      }

      return before + String.interpret(ctx);
    });
  },
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;

const $break = { };

const Enumerable = (function () {
  function each(iterator, context) {
    let index = 0;
    try {
      this._each((value) => {
        iterator.call(context, value, index++);
      });
    } catch (e) {
      if (e != $break) throw e;
    }
    return this;
  }

  function eachSlice(number, iterator, context) {
    let index = -number; const slices = []; const
      array = this.toArray();
    if (number < 1) return array;
    while ((index += number) < array.length) slices.push(array.slice(index, index + number));
    return slices.collect(iterator, context);
  }

  function all(iterator, context) {
    iterator = iterator || Prototype.K;
    let result = true;
    this.each((value, index) => {
      result = result && !!iterator.call(context, value, index);
      if (!result) throw $break;
    });
    return result;
  }

  function any(iterator, context) {
    iterator = iterator || Prototype.K;
    let result = false;
    this.each((value, index) => {
      if (result = !!iterator.call(context, value, index)) throw $break;
    });
    return result;
  }

  function collect(iterator, context) {
    iterator = iterator || Prototype.K;
    const results = [];
    this.each((value, index) => {
      results.push(iterator.call(context, value, index));
    });
    return results;
  }

  function detect(iterator, context) {
    let result;
    this.each((value, index) => {
      if (iterator.call(context, value, index)) {
        result = value;
        throw $break;
      }
    });
    return result;
  }

  function findAll(iterator, context) {
    const results = [];
    this.each((value, index) => {
      if (iterator.call(context, value, index)) results.push(value);
    });
    return results;
  }

  function grep(filter, iterator, context) {
    iterator = iterator || Prototype.K;
    const results = [];

    if (Object.isString(filter)) filter = new RegExp(RegExp.escape(filter));

    this.each((value, index) => {
      if (filter.match(value)) results.push(iterator.call(context, value, index));
    });
    return results;
  }

  function include(object) {
    if (Object.isFunction(this.indexOf)) if (this.indexOf(object) != -1) return true;

    let found = false;
    this.each((value) => {
      if (value == object) {
        found = true;
        throw $break;
      }
    });
    return found;
  }

  function inGroupsOf(number, fillWith) {
    fillWith = Object.isUndefined(fillWith) ? null : fillWith;
    return this.eachSlice(number, (slice) => {
      while (slice.length < number) slice.push(fillWith);
      return slice;
    });
  }

  function inject(memo, iterator, context) {
    this.each((value, index) => {
      memo = iterator.call(context, memo, value, index);
    });
    return memo;
  }

  function invoke(method) {
    const args = $A(arguments).slice(1);
    return this.map((value) => value[method].apply(value, args));
  }

  function max(iterator, context) {
    iterator = iterator || Prototype.K;
    let result;
    this.each((value, index) => {
      value = iterator.call(context, value, index);
      if (result == null || value >= result) result = value;
    });
    return result;
  }

  function min(iterator, context) {
    iterator = iterator || Prototype.K;
    let result;
    this.each((value, index) => {
      value = iterator.call(context, value, index);
      if (result == null || value < result) result = value;
    });
    return result;
  }

  function partition(iterator, context) {
    iterator = iterator || Prototype.K;
    const trues = []; const
      falses = [];
    this.each((value, index) => {
      (iterator.call(context, value, index)
        ? trues : falses).push(value);
    });
    return [trues, falses];
  }

  function pluck(property) {
    const results = [];
    this.each((value) => {
      results.push(value[property]);
    });
    return results;
  }

  function reject(iterator, context) {
    const results = [];
    this.each((value, index) => {
      if (!iterator.call(context, value, index)) results.push(value);
    });
    return results;
  }

  function sortBy(iterator, context) {
    return this.map((value, index) => ({
      value,
      criteria: iterator.call(context, value, index),
    })).sort((left, right) => {
      const a = left.criteria; const
        b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }).pluck('value');
  }

  function toArray() {
    return this.map();
  }

  function zip() {
    let iterator = Prototype.K; const
      args = $A(arguments);
    if (Object.isFunction(args.last())) iterator = args.pop();

    const collections = [this].concat(args).map($A);
    return this.map((value, index) => iterator(collections.pluck(index)));
  }

  function size() {
    return this.toArray().length;
  }

  function inspect() {
    return `#<Enumerable:${this.toArray().inspect()}>`;
  }

  return {
    each,
    eachSlice,
    all,
    every: all,
    any,
    some: any,
    collect,
    map: collect,
    detect,
    findAll,
    select: findAll,
    filter: findAll,
    grep,
    include,
    member: include,
    inGroupsOf,
    inject,
    invoke,
    max,
    min,
    partition,
    pluck,
    reject,
    sortBy,
    toArray,
    entries: toArray,
    zip,
    size,
    inspect,
    find: detect,
  };
}());
function $A(iterable) {
  if (!iterable) return [];
  if ('toArray' in Object(iterable)) return iterable.toArray();
  let length = iterable.length || 0; const
    results = new Array(length);
  while (length--) results[length] = iterable[length];
  return results;
}

function $w(string) {
  if (!Object.isString(string)) return [];
  string = string.strip();
  return string ? string.split(/\s+/) : [];
}

Array.from = $A;

(function () {
  const arrayProto = Array.prototype;
  const { slice } = arrayProto;
  let _each = arrayProto.forEach; // use native browser JS 1.6 implementation if available

  function each(iterator) {
    for (let i = 0, { length } = this; i < length; i++) iterator(this[i]);
  }
  if (!_each) _each = each;

  function clear() {
    this.length = 0;
    return this;
  }

  function first() {
    return this[0];
  }

  function last() {
    return this[this.length - 1];
  }

  function compact() {
    return this.select((value) => value != null);
  }

  function flatten() {
    return this.inject([], (array, value) => {
      if (Object.isArray(value)) return array.concat(value.flatten());
      array.push(value);
      return array;
    });
  }

  function without() {
    const values = slice.call(arguments, 0);
    return this.select((value) => !values.include(value));
  }

  function reverse(inline) {
    return (inline !== false ? this : this.toArray())._reverse();
  }

  function uniq(sorted) {
    return this.inject([], (array, value, index) => {
      if (index == 0 || (sorted ? array.last() != value : !array.include(value))) array.push(value);
      return array;
    });
  }

  function intersect(array) {
    return this.uniq().findAll((item) => array.detect((value) => item === value));
  }

  function clone() {
    return slice.call(this, 0);
  }

  function size() {
    return this.length;
  }

  function inspect() {
    return `[${this.map(Object.inspect).join(', ')}]`;
  }

  function toJSON() {
    const results = [];
    this.each((object) => {
      const value = Object.toJSON(object);
      if (!Object.isUndefined(value)) results.push(value);
    });
    return `[${results.join(', ')}]`;
  }

  function indexOf(item, i) {
    i || (i = 0);
    const { length } = this;
    if (i < 0) i = length + i;
    for (; i < length; i++) if (this[i] === item) return i;
    return -1;
  }

  function lastIndexOf(item, i) {
    i = isNaN(i) ? this.length : (i < 0 ? this.length + i : i) + 1;
    const n = this.slice(0, i).reverse().indexOf(item);
    return (n < 0) ? n : i - n - 1;
  }

  function concat() {
    const array = slice.call(this, 0); let
      item;
    for (let i = 0, { length } = arguments; i < length; i++) {
      item = arguments[i];
      if (Object.isArray(item) && !('callee' in item)) {
        for (let j = 0, arrayLength = item.length; j < arrayLength; j++) array.push(item[j]);
      } else {
        array.push(item);
      }
    }
    return array;
  }

  Object.extend(arrayProto, Enumerable);

  if (!arrayProto._reverse) arrayProto._reverse = arrayProto.reverse;

  Object.extend(arrayProto, {
    _each,
    clear,
    first,
    last,
    compact,
    flatten,
    without,
    reverse,
    uniq,
    intersect,
    clone,
    toArray: clone,
    size,
    inspect,
    toJSON,
  });

  const CONCAT_ARGUMENTS_BUGGY = (function () {
    return [].concat(arguments)[0][0] !== 1;
  }(1, 2));

  if (CONCAT_ARGUMENTS_BUGGY) arrayProto.concat = concat;

  if (!arrayProto.indexOf) arrayProto.indexOf = indexOf;
  if (!arrayProto.lastIndexOf) arrayProto.lastIndexOf = lastIndexOf;
}());
function $H(object) {
  return new Hash(object);
}

var Hash = Class.create(Enumerable, (function () {
  function initialize(object) {
    this._object = Object.isHash(object) ? object.toObject() : Object.clone(object);
  }

  function _each(iterator) {
    for (const key in this._object) {
      const value = this._object[key]; const
        pair = [key, value];
      pair.key = key;
      pair.value = value;
      iterator(pair);
    }
  }

  function set(key, value) {
    return this._object[key] = value;
  }

  function get(key) {
    if (this._object[key] !== Object.prototype[key]) return this._object[key];
  }

  function unset(key) {
    const value = this._object[key];
    delete this._object[key];
    return value;
  }

  function toObject() {
    return Object.clone(this._object);
  }

  function keys() {
    return this.pluck('key');
  }

  function values() {
    return this.pluck('value');
  }

  function index(value) {
    const match = this.detect((pair) => pair.value === value);
    return match && match.key;
  }

  function merge(object) {
    return this.clone().update(object);
  }

  function update(object) {
    return new Hash(object).inject(this, (result, pair) => {
      result.set(pair.key, pair.value);
      return result;
    });
  }

  function toQueryPair(key, value) {
    if (Object.isUndefined(value)) return key;
    return `${key}=${encodeURIComponent(String.interpret(value))}`;
  }

  function toQueryString() {
    return this.inject([], (results, pair) => {
      const key = encodeURIComponent(pair.key); const
        values = pair.value;

      if (values && typeof values === 'object') {
        if (Object.isArray(values)) return results.concat(values.map(toQueryPair.curry(key)));
      } else results.push(toQueryPair(key, values));
      return results;
    }).join('&');
  }

  function inspect() {
    return `#<Hash:{${this.map((pair) => pair.map(Object.inspect).join(': ')).join(', ')}}>`;
  }

  function toJSON() {
    return Object.toJSON(this.toObject());
  }

  function clone() {
    return new Hash(this);
  }

  return {
    initialize,
    _each,
    set,
    get,
    unset,
    toObject,
    toTemplateReplacements: toObject,
    keys,
    values,
    index,
    merge,
    update,
    toQueryString,
    inspect,
    toJSON,
    clone,
  };
}()));

Hash.from = $H;
Object.extend(Number.prototype, (function () {
  function toColorPart() {
    return this.toPaddedString(2, 16);
  }

  function succ() {
    return this + 1;
  }

  function times(iterator, context) {
    $R(0, this, true).each(iterator, context);
    return this;
  }

  function toPaddedString(length, radix) {
    const string = this.toString(radix || 10);
    return '0'.times(length - string.length) + string;
  }

  function toJSON() {
    return isFinite(this) ? this.toString() : 'null';
  }

  function abs() {
    return Math.abs(this);
  }

  function round() {
    return Math.round(this);
  }

  function ceil() {
    return Math.ceil(this);
  }

  function floor() {
    return Math.floor(this);
  }

  return {
    toColorPart,
    succ,
    times,
    toPaddedString,
    toJSON,
    abs,
    round,
    ceil,
    floor,
  };
}()));

function $R(start, end, exclusive) {
  return new ObjectRange(start, end, exclusive);
}

var ObjectRange = Class.create(Enumerable, (function () {
  function initialize(start, end, exclusive) {
    this.start = start;
    this.end = end;
    this.exclusive = exclusive;
  }

  function _each(iterator) {
    let value = this.start;
    while (this.include(value)) {
      iterator(value);
      value = value.succ();
    }
  }

  function include(value) {
    if (value < this.start) return false;
    if (this.exclusive) return value < this.end;
    return value <= this.end;
  }

  return {
    initialize,
    _each,
    include,
  };
}()));

const Ajax = {
  getTransport() {
    return Try.these(
      () => new XMLHttpRequest(),
      () => new ActiveXObject('Msxml2.XMLHTTP'),
      () => new ActiveXObject('Microsoft.XMLHTTP'),
    ) || false;
  },

  activeRequestCount: 0,
};

Ajax.Responders = {
  responders: [],

  _each(iterator) {
    this.responders._each(iterator);
  },

  register(responder) {
    if (!this.include(responder)) this.responders.push(responder);
  },

  unregister(responder) {
    this.responders = this.responders.without(responder);
  },

  dispatch(callback, request, transport, json) {
    this.each((responder) => {
      if (Object.isFunction(responder[callback])) {
        try {
          responder[callback].apply(responder, [request, transport, json]);
        } catch (e) { }
      }
    });
  },
};

Object.extend(Ajax.Responders, Enumerable);

Ajax.Responders.register({
  onCreate() { Ajax.activeRequestCount++; },
  onComplete() { Ajax.activeRequestCount--; },
});
Ajax.Base = Class.create({
  initialize(options) {
    this.options = {
      method: 'post',
      asynchronous: true,
      contentType: 'application/x-www-form-urlencoded',
      encoding: 'UTF-8',
      parameters: '',
      evalJSON: true,
      evalJS: true,
    };
    Object.extend(this.options, options || { });

    this.options.method = this.options.method.toLowerCase();

    if (Object.isString(this.options.parameters)) this.options.parameters = this.options.parameters.toQueryParams();
    else if (Object.isHash(this.options.parameters)) this.options.parameters = this.options.parameters.toObject();
  },
});
Ajax.Request = Class.create(Ajax.Base, {
  _complete: false,

  initialize($super, url, options) {
    $super(options);
    this.transport = Ajax.getTransport();
    this.request(url);
  },

  request(url) {
    this.url = url;
    this.method = this.options.method;
    let params = Object.clone(this.options.parameters);

    if (!['get', 'post'].include(this.method)) {
      params._method = this.method;
      this.method = 'post';
    }

    this.parameters = params;

    if (params = Object.toQueryString(params)) {
      if (this.method == 'get') this.url += (this.url.include('?') ? '&' : '?') + params;
      else if (/Konqueror|Safari|KHTML/.test(navigator.userAgent)) params += '&_=';
    }

    try {
      const response = new Ajax.Response(this);
      if (this.options.onCreate) this.options.onCreate(response);
      Ajax.Responders.dispatch('onCreate', this, response);

      this.transport.open(this.method.toUpperCase(), this.url,
        this.options.asynchronous);

      if (this.options.asynchronous) this.respondToReadyState.bind(this).defer(1);

      this.transport.onreadystatechange = this.onStateChange.bind(this);
      this.setRequestHeaders();

      this.body = this.method == 'post' ? (this.options.postBody || params) : null;
      this.transport.send(this.body);

      /* Force Firefox to handle ready state 4 for synchronous requests */
      if (!this.options.asynchronous && this.transport.overrideMimeType) this.onStateChange();
    } catch (e) {
      this.dispatchException(e);
    }
  },

  onStateChange() {
    const { readyState } = this.transport;
    if (readyState > 1 && !((readyState == 4) && this._complete)) this.respondToReadyState(this.transport.readyState);
  },

  setRequestHeaders() {
    const headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'X-Prototype-Version': Prototype.Version,
      Accept: 'text/javascript, text/html, application/xml, text/xml, */*',
    };

    if (this.method == 'post') {
      headers['Content-type'] = this.options.contentType
        + (this.options.encoding ? `; charset=${this.options.encoding}` : '');

      /* Force "Connection: close" for older Mozilla browsers to work
       * around a bug where XMLHttpRequest sends an incorrect
       * Content-length header. See Mozilla Bugzilla #246651.
       */
      if (this.transport.overrideMimeType
          && (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0, 2005])[1] < 2005) headers.Connection = 'close';
    }

    if (typeof this.options.requestHeaders === 'object') {
      const extras = this.options.requestHeaders;

      if (Object.isFunction(extras.push)) for (let i = 0, { length } = extras; i < length; i += 2) headers[extras[i]] = extras[i + 1];
      else $H(extras).each((pair) => { headers[pair.key] = pair.value; });
    }

    for (const name in headers) this.transport.setRequestHeader(name, headers[name]);
  },

  success() {
    const status = this.getStatus();
    return !status || (status >= 200 && status < 300);
  },

  getStatus() {
    try {
      return this.transport.status || 0;
    } catch (e) { return 0; }
  },

  respondToReadyState(readyState) {
    const state = Ajax.Request.Events[readyState]; const
      response = new Ajax.Response(this);

    if (state == 'Complete') {
      try {
        this._complete = true;
        (this.options[`on${response.status}`]
         || this.options[`on${this.success() ? 'Success' : 'Failure'}`]
         || Prototype.emptyFunction)(response, response.headerJSON);
      } catch (e) {
        this.dispatchException(e);
      }

      const contentType = response.getHeader('Content-type');
      if (this.options.evalJS == 'force'
          || (this.options.evalJS && this.isSameOrigin() && contentType
          && contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i))) this.evalResponse();
    }

    try {
      (this.options[`on${state}`] || Prototype.emptyFunction)(response, response.headerJSON);
      Ajax.Responders.dispatch(`on${state}`, this, response, response.headerJSON);
    } catch (e) {
      this.dispatchException(e);
    }

    if (state == 'Complete') {
      this.transport.onreadystatechange = Prototype.emptyFunction;
    }
  },

  isSameOrigin() {
    const m = this.url.match(/^\s*https?:\/\/[^\/]*/);
    return !m || (m[0] == '#{protocol}//#{domain}#{port}'.interpolate({
      protocol: location.protocol,
      domain: document.domain,
      port: location.port ? `:${location.port}` : '',
    }));
  },

  getHeader(name) {
    try {
      return this.transport.getResponseHeader(name) || null;
    } catch (e) { return null; }
  },

  evalResponse() {
    try {
      return eval((this.transport.responseText || '').unfilterJSON());
    } catch (e) {
      this.dispatchException(e);
    }
  },

  dispatchException(exception) {
    (this.options.onException || Prototype.emptyFunction)(this, exception);
    Ajax.Responders.dispatch('onException', this, exception);
  },
});

Ajax.Request.Events = ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

Ajax.Response = Class.create({
  initialize(request) {
    this.request = request;
    const transport = this.transport = request.transport;
    const readyState = this.readyState = transport.readyState;

    if ((readyState > 2 && !Prototype.Browser.IE) || readyState == 4) {
      this.status = this.getStatus();
      this.statusText = this.getStatusText();
      this.responseText = String.interpret(transport.responseText);
      this.headerJSON = this._getHeaderJSON();
    }

    if (readyState == 4) {
      const xml = transport.responseXML;
      this.responseXML = Object.isUndefined(xml) ? null : xml;
      this.responseJSON = this._getResponseJSON();
    }
  },

  status: 0,

  statusText: '',

  getStatus: Ajax.Request.prototype.getStatus,

  getStatusText() {
    try {
      return this.transport.statusText || '';
    } catch (e) { return ''; }
  },

  getHeader: Ajax.Request.prototype.getHeader,

  getAllHeaders() {
    try {
      return this.getAllResponseHeaders();
    } catch (e) { return null; }
  },

  getResponseHeader(name) {
    return this.transport.getResponseHeader(name);
  },

  getAllResponseHeaders() {
    return this.transport.getAllResponseHeaders();
  },

  _getHeaderJSON() {
    let json = this.getHeader('X-JSON');
    if (!json) return null;
    json = decodeURIComponent(escape(json));
    try {
      return json.evalJSON(this.request.options.sanitizeJSON
        || !this.request.isSameOrigin());
    } catch (e) {
      this.request.dispatchException(e);
    }
  },

  _getResponseJSON() {
    const { options } = this.request;
    if (!options.evalJSON || (options.evalJSON != 'force'
      && !(this.getHeader('Content-type') || '').include('application/json'))
        || this.responseText.blank()) return null;
    try {
      return this.responseText.evalJSON(options.sanitizeJSON
        || !this.request.isSameOrigin());
    } catch (e) {
      this.request.dispatchException(e);
    }
  },
});

Ajax.Updater = Class.create(Ajax.Request, {
  initialize($super, container, url, options) {
    this.container = {
      success: (container.success || container),
      failure: (container.failure || (container.success ? null : container)),
    };

    options = Object.clone(options);
    const { onComplete } = options;
    options.onComplete = (function (response, json) {
      this.updateContent(response.responseText);
      if (Object.isFunction(onComplete)) onComplete(response, json);
    }).bind(this);

    $super(url, options);
  },

  updateContent(responseText) {
    let receiver = this.container[this.success() ? 'success' : 'failure'];
    const { options } = this;

    if (!options.evalScripts) responseText = responseText.stripScripts();

    if (receiver = $(receiver)) {
      if (options.insertion) {
        if (Object.isString(options.insertion)) {
          const insertion = { }; insertion[options.insertion] = responseText;
          receiver.insert(insertion);
        } else options.insertion(receiver, responseText);
      } else receiver.update(responseText);
    }
  },
});

Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
  initialize($super, container, url, options) {
    $super(options);
    this.onComplete = this.options.onComplete;

    this.frequency = (this.options.frequency || 2);
    this.decay = (this.options.decay || 1);

    this.updater = { };
    this.container = container;
    this.url = url;

    this.start();
  },

  start() {
    this.options.onComplete = this.updateComplete.bind(this);
    this.onTimerEvent();
  },

  stop() {
    this.updater.options.onComplete = undefined;
    clearTimeout(this.timer);
    (this.onComplete || Prototype.emptyFunction).apply(this, arguments);
  },

  updateComplete(response) {
    if (this.options.decay) {
      this.decay = (response.responseText == this.lastText
        ? this.decay * this.options.decay : 1);

      this.lastText = response.responseText;
    }
    this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency);
  },

  onTimerEvent() {
    this.updater = new Ajax.Updater(this.container, this.url, this.options);
  },
});

function $(element) {
  if (arguments.length > 1) {
    for (var i = 0, elements = [], { length } = arguments; i < length; i++) elements.push($(arguments[i]));
    return elements;
  }
  if (Object.isString(element)) element = document.getElementById(element);
  return Element.extend(element);
}

if (Prototype.BrowserFeatures.XPath) {
  document._getElementsByXPath = function (expression, parentElement) {
    const results = [];
    const query = document.evaluate(expression, $(parentElement) || document,
      null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0, length = query.snapshotLength; i < length; i++) results.push(Element.extend(query.snapshotItem(i)));
    return results;
  };
}

/*--------------------------------------------------------------------------*/

if (!window.Node) var Node = { };

if (!Node.ELEMENT_NODE) {
  Object.extend(Node, {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12,
  });
}

(function (global) {
  const SETATTRIBUTE_IGNORES_NAME = (function () {
    let elForm = document.createElement('form');
    let elInput = document.createElement('input');
    const root = document.documentElement;
    elInput.setAttribute('name', 'test');
    elForm.appendChild(elInput);
    root.appendChild(elForm);
    const isBuggy = elForm.elements
      ? (typeof elForm.elements.test === 'undefined')
      : null;
    root.removeChild(elForm);
    elForm = elInput = null;
    return isBuggy;
  }());

  const element = global.Element;
  global.Element = function (tagName, attributes) {
    attributes = attributes || { };
    tagName = tagName.toLowerCase();
    const { cache } = Element;
    if (SETATTRIBUTE_IGNORES_NAME && attributes.name) {
      tagName = `<${tagName} name="${attributes.name}">`;
      delete attributes.name;
      return Element.writeAttribute(document.createElement(tagName), attributes);
    }
    if (!cache[tagName]) cache[tagName] = Element.extend(document.createElement(tagName));
    return Element.writeAttribute(cache[tagName].cloneNode(false), attributes);
  };
  Object.extend(global.Element, element || { });
  if (element) global.Element.prototype = element.prototype;
}(this));

Element.cache = { };
Element.idCounter = 1;

Element.Methods = {
  visible(element) {
    return $(element).style.display != 'none';
  },

  toggle(element) {
    element = $(element);
    Element[Element.visible(element) ? 'hide' : 'show'](element);
    return element;
  },

  hide(element) {
    element = $(element);
    element.style.display = 'none';
    return element;
  },

  show(element) {
    element = $(element);
    element.style.display = '';
    return element;
  },

  remove(element) {
    element = $(element);
    element.parentNode.removeChild(element);
    return element;
  },

  update: (function () {
    const SELECT_ELEMENT_INNERHTML_BUGGY = (function () {
      let el = document.createElement('select');
      let isBuggy = true;
      el.innerHTML = '<option value="test">test</option>';
      if (el.options && el.options[0]) {
        isBuggy = el.options[0].nodeName.toUpperCase() !== 'OPTION';
      }
      el = null;
      return isBuggy;
    }());

    const TABLE_ELEMENT_INNERHTML_BUGGY = (function () {
      try {
        let el = document.createElement('table');
        if (el && el.tBodies) {
          el.innerHTML = '<tbody><tr><td>test</td></tr></tbody>';
          const isBuggy = typeof el.tBodies[0] === 'undefined';
          el = null;
          return isBuggy;
        }
      } catch (e) {
        return true;
      }
    }());

    const SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING = (function () {
      let s = document.createElement('script');
      let isBuggy = false;
      try {
        s.appendChild(document.createTextNode(''));
        isBuggy = !s.firstChild
          || s.firstChild && s.firstChild.nodeType !== 3;
      } catch (e) {
        isBuggy = true;
      }
      s = null;
      return isBuggy;
    }());

    function update(element, content) {
      element = $(element);

      if (content && content.toElement) content = content.toElement();

      if (Object.isElement(content)) return element.update().insert(content);

      content = Object.toHTML(content);

      const tagName = element.tagName.toUpperCase();

      if (tagName === 'SCRIPT' && SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING) {
        element.text = content;
        return element;
      }

      if (SELECT_ELEMENT_INNERHTML_BUGGY || TABLE_ELEMENT_INNERHTML_BUGGY) {
        if (tagName in Element._insertionTranslations.tags) {
          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }
          Element._getContentFromAnonymousElement(tagName, content.stripScripts())
            .each((node) => {
              element.appendChild(node);
            });
        } else {
          element.innerHTML = content.stripScripts();
        }
      } else {
        element.innerHTML = content.stripScripts();
      }

      content.evalScripts.bind(content).defer();
      return element;
    }

    return update;
  }()),

  replace(element, content) {
    element = $(element);
    if (content && content.toElement) content = content.toElement();
    else if (!Object.isElement(content)) {
      content = Object.toHTML(content);
      const range = element.ownerDocument.createRange();
      range.selectNode(element);
      content.evalScripts.bind(content).defer();
      content = range.createContextualFragment(content.stripScripts());
    }
    element.parentNode.replaceChild(content, element);
    return element;
  },

  insert(element, insertions) {
    element = $(element);

    if (Object.isString(insertions) || Object.isNumber(insertions)
        || Object.isElement(insertions) || (insertions && (insertions.toElement || insertions.toHTML))) insertions = { bottom: insertions };

    let content; let insert; let tagName; let
      childNodes;

    for (let position in insertions) {
      content = insertions[position];
      position = position.toLowerCase();
      insert = Element._insertionTranslations[position];

      if (content && content.toElement) content = content.toElement();
      if (Object.isElement(content)) {
        insert(element, content);
        continue;
      }

      content = Object.toHTML(content);

      tagName = ((position == 'before' || position == 'after')
        ? element.parentNode : element).tagName.toUpperCase();

      childNodes = Element._getContentFromAnonymousElement(tagName, content.stripScripts());

      if (position == 'top' || position == 'after') childNodes.reverse();
      childNodes.each(insert.curry(element));

      content.evalScripts.bind(content).defer();
    }

    return element;
  },

  wrap(element, wrapper, attributes) {
    element = $(element);
    if (Object.isElement(wrapper)) $(wrapper).writeAttribute(attributes || { });
    else if (Object.isString(wrapper)) wrapper = new Element(wrapper, attributes);
    else wrapper = new Element('div', wrapper);
    if (element.parentNode) element.parentNode.replaceChild(wrapper, element);
    wrapper.appendChild(element);
    return wrapper;
  },

  inspect(element) {
    element = $(element);
    let result = `<${element.tagName.toLowerCase()}`;
    $H({ id: 'id', className: 'class' }).each((pair) => {
      const property = pair.first(); const
        attribute = pair.last();
      const value = (element[property] || '').toString();
      if (value) result += ` ${attribute}=${value.inspect(true)}`;
    });
    return `${result}>`;
  },

  recursivelyCollect(element, property) {
    element = $(element);
    const elements = [];
    while (element = element[property]) if (element.nodeType == 1) elements.push(Element.extend(element));
    return elements;
  },

  ancestors(element) {
    return Element.recursivelyCollect(element, 'parentNode');
  },

  descendants(element) {
    return Element.select(element, '*');
  },

  firstDescendant(element) {
    element = $(element).firstChild;
    while (element && element.nodeType != 1) element = element.nextSibling;
    return $(element);
  },

  immediateDescendants(element) {
    if (!(element = $(element).firstChild)) return [];
    while (element && element.nodeType != 1) element = element.nextSibling;
    if (element) return [element].concat($(element).nextSiblings());
    return [];
  },

  previousSiblings(element) {
    return Element.recursivelyCollect(element, 'previousSibling');
  },

  nextSiblings(element) {
    return Element.recursivelyCollect(element, 'nextSibling');
  },

  siblings(element) {
    element = $(element);
    return Element.previousSiblings(element).reverse()
      .concat(Element.nextSiblings(element));
  },

  match(element, selector) {
    if (Object.isString(selector)) selector = new Selector(selector);
    return selector.match($(element));
  },

  up(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return $(element.parentNode);
    const ancestors = Element.ancestors(element);
    return Object.isNumber(expression) ? ancestors[expression]
      : Selector.findElement(ancestors, expression, index);
  },

  down(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return Element.firstDescendant(element);
    return Object.isNumber(expression) ? Element.descendants(element)[expression]
      : Element.select(element, expression)[index || 0];
  },

  previous(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return $(Selector.handlers.previousElementSibling(element));
    const previousSiblings = Element.previousSiblings(element);
    return Object.isNumber(expression) ? previousSiblings[expression]
      : Selector.findElement(previousSiblings, expression, index);
  },

  next(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return $(Selector.handlers.nextElementSibling(element));
    const nextSiblings = Element.nextSiblings(element);
    return Object.isNumber(expression) ? nextSiblings[expression]
      : Selector.findElement(nextSiblings, expression, index);
  },

  select(element) {
    const args = Array.prototype.slice.call(arguments, 1);
    return Selector.findChildElements(element, args);
  },

  adjacent(element) {
    const args = Array.prototype.slice.call(arguments, 1);
    return Selector.findChildElements(element.parentNode, args).without(element);
  },

  identify(element) {
    element = $(element);
    let id = Element.readAttribute(element, 'id');
    if (id) return id;
    do { id = `anonymous_element_${Element.idCounter++}`; } while ($(id));
    Element.writeAttribute(element, 'id', id);
    return id;
  },

  readAttribute(element, name) {
    element = $(element);
    if (Prototype.Browser.IE) {
      const t = Element._attributeTranslations.read;
      if (t.values[name]) return t.values[name](element, name);
      if (t.names[name]) name = t.names[name];
      if (name.include(':')) {
        return (!element.attributes || !element.attributes[name]) ? null
          : element.attributes[name].value;
      }
    }
    return element.getAttribute(name);
  },

  writeAttribute(element, name, value) {
    element = $(element);
    let attributes = { }; const
      t = Element._attributeTranslations.write;

    if (typeof name === 'object') attributes = name;
    else attributes[name] = Object.isUndefined(value) ? true : value;

    for (const attr in attributes) {
      name = t.names[attr] || attr;
      value = attributes[attr];
      if (t.values[attr]) name = t.values[attr](element, value);
      if (value === false || value === null) element.removeAttribute(name);
      else if (value === true) element.setAttribute(name, name);
      else element.setAttribute(name, value);
    }
    return element;
  },

  getHeight(element) {
    return Element.getDimensions(element).height;
  },

  getWidth(element) {
    return Element.getDimensions(element).width;
  },

  classNames(element) {
    return new Element.ClassNames(element);
  },

  hasClassName(element, className) {
    if (!(element = $(element))) return;
    const elementClassName = element.className;
    return (elementClassName.length > 0 && (elementClassName == className
      || new RegExp(`(^|\\s)${className}(\\s|$)`).test(elementClassName)));
  },

  addClassName(element, className) {
    if (!(element = $(element))) return;
    if (!Element.hasClassName(element, className)) element.className += (element.className ? ' ' : '') + className;
    return element;
  },

  removeClassName(element, className) {
    if (!(element = $(element))) return;
    element.className = element.className.replace(
      new RegExp(`(^|\\s+)${className}(\\s+|$)`), ' ',
    ).strip();
    return element;
  },

  toggleClassName(element, className) {
    if (!(element = $(element))) return;
    return Element[Element.hasClassName(element, className)
      ? 'removeClassName' : 'addClassName'](element, className);
  },

  cleanWhitespace(element) {
    element = $(element);
    let node = element.firstChild;
    while (node) {
      const nextNode = node.nextSibling;
      if (node.nodeType == 3 && !/\S/.test(node.nodeValue)) element.removeChild(node);
      node = nextNode;
    }
    return element;
  },

  empty(element) {
    return $(element).innerHTML.blank();
  },

  descendantOf(element, ancestor) {
    element = $(element), ancestor = $(ancestor);

    if (element.compareDocumentPosition) return (element.compareDocumentPosition(ancestor) & 8) === 8;

    if (ancestor.contains) return ancestor.contains(element) && ancestor !== element;

    while (element = element.parentNode) if (element == ancestor) return true;

    return false;
  },

  scrollTo(element) {
    element = $(element);
    const pos = Element.cumulativeOffset(element);
    window.scrollTo(pos[0], pos[1]);
    return element;
  },

  getStyle(element, style) {
    element = $(element);
    style = style == 'float' ? 'cssFloat' : style.camelize();
    let value = element.style[style];
    if (!value || value == 'auto') {
      const css = document.defaultView.getComputedStyle(element, null);
      value = css ? css[style] : null;
    }
    if (style == 'opacity') return value ? parseFloat(value) : 1.0;
    return value == 'auto' ? null : value;
  },

  getOpacity(element) {
    return $(element).getStyle('opacity');
  },

  setStyle(element, styles) {
    element = $(element);
    const elementStyle = element.style; let
      match;
    if (Object.isString(styles)) {
      element.style.cssText += `;${styles}`;
      return styles.include('opacity')
        ? element.setOpacity(styles.match(/opacity:\s*(\d?\.?\d*)/)[1]) : element;
    }
    for (const property in styles) {
      if (property == 'opacity') element.setOpacity(styles[property]);
      else {
        elementStyle[(property == 'float' || property == 'cssFloat')
          ? (Object.isUndefined(elementStyle.styleFloat) ? 'cssFloat' : 'styleFloat')
          : property] = styles[property];
      }
    }

    return element;
  },

  setOpacity(element, value) {
    element = $(element);
    element.style.opacity = (value == 1 || value === '') ? ''
      : (value < 0.00001) ? 0 : value;
    return element;
  },

  getDimensions(element) {
    element = $(element);
    const display = Element.getStyle(element, 'display');
    if (display != 'none' && display != null) // Safari bug
    { return { width: element.offsetWidth, height: element.offsetHeight }; }

    const els = element.style;
    const originalVisibility = els.visibility;
    const originalPosition = els.position;
    const originalDisplay = els.display;
    els.visibility = 'hidden';
    if (originalPosition != 'fixed') // Switching fixed to absolute causes issues in Safari
    { els.position = 'absolute'; }
    els.display = 'block';
    const originalWidth = element.clientWidth;
    const originalHeight = element.clientHeight;
    els.display = originalDisplay;
    els.position = originalPosition;
    els.visibility = originalVisibility;
    return { width: originalWidth, height: originalHeight };
  },

  makePositioned(element) {
    element = $(element);
    const pos = Element.getStyle(element, 'position');
    if (pos == 'static' || !pos) {
      element._madePositioned = true;
      element.style.position = 'relative';
      if (Prototype.Browser.Opera) {
        element.style.top = 0;
        element.style.left = 0;
      }
    }
    return element;
  },

  undoPositioned(element) {
    element = $(element);
    if (element._madePositioned) {
      element._madePositioned = undefined;
      element.style.position = element.style.top = element.style.left = element.style.bottom = element.style.right = '';
    }
    return element;
  },

  makeClipping(element) {
    element = $(element);
    if (element._overflow) return element;
    element._overflow = Element.getStyle(element, 'overflow') || 'auto';
    if (element._overflow !== 'hidden') element.style.overflow = 'hidden';
    return element;
  },

  undoClipping(element) {
    element = $(element);
    if (!element._overflow) return element;
    element.style.overflow = element._overflow == 'auto' ? '' : element._overflow;
    element._overflow = null;
    return element;
  },

  cumulativeOffset(element) {
    let valueT = 0; let
      valueL = 0;
    do {
      valueT += element.offsetTop || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);
    return Element._returnOffset(valueL, valueT);
  },

  positionedOffset(element) {
    let valueT = 0; let
      valueL = 0;
    do {
      valueT += element.offsetTop || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
      if (element) {
        if (element.tagName.toUpperCase() == 'BODY') break;
        const p = Element.getStyle(element, 'position');
        if (p !== 'static') break;
      }
    } while (element);
    return Element._returnOffset(valueL, valueT);
  },

  absolutize(element) {
    element = $(element);
    if (Element.getStyle(element, 'position') == 'absolute') return element;

    const offsets = Element.positionedOffset(element);
    const top = offsets[1];
    const left = offsets[0];
    const width = element.clientWidth;
    const height = element.clientHeight;

    element._originalLeft = left - parseFloat(element.style.left || 0);
    element._originalTop = top - parseFloat(element.style.top || 0);
    element._originalWidth = element.style.width;
    element._originalHeight = element.style.height;

    element.style.position = 'absolute';
    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    return element;
  },

  relativize(element) {
    element = $(element);
    if (Element.getStyle(element, 'position') == 'relative') return element;

    element.style.position = 'relative';
    const top = parseFloat(element.style.top || 0) - (element._originalTop || 0);
    const left = parseFloat(element.style.left || 0) - (element._originalLeft || 0);

    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
    element.style.height = element._originalHeight;
    element.style.width = element._originalWidth;
    return element;
  },

  cumulativeScrollOffset(element) {
    let valueT = 0; let
      valueL = 0;
    do {
      valueT += element.scrollTop || 0;
      valueL += element.scrollLeft || 0;
      element = element.parentNode;
    } while (element);
    return Element._returnOffset(valueL, valueT);
  },

  getOffsetParent(element) {
    if (element.offsetParent) return $(element.offsetParent);
    if (element == document.body) return $(element);

    while ((element = element.parentNode) && element != document.body) if (Element.getStyle(element, 'position') != 'static') return $(element);

    return $(document.body);
  },

  viewportOffset(forElement) {
    let valueT = 0; let
      valueL = 0;

    let element = forElement;
    do {
      valueT += element.offsetTop || 0;
      valueL += element.offsetLeft || 0;

      if (element.offsetParent == document.body
        && Element.getStyle(element, 'position') == 'absolute') break;
    } while (element = element.offsetParent);

    element = forElement;
    do {
      if (!Prototype.Browser.Opera || (element.tagName && (element.tagName.toUpperCase() == 'BODY'))) {
        valueT -= element.scrollTop || 0;
        valueL -= element.scrollLeft || 0;
      }
    } while (element = element.parentNode);

    return Element._returnOffset(valueL, valueT);
  },

  clonePosition(element, source) {
    const options = Object.extend({
      setLeft: true,
      setTop: true,
      setWidth: true,
      setHeight: true,
      offsetTop: 0,
      offsetLeft: 0,
    }, arguments[2] || { });

    source = $(source);
    const p = Element.viewportOffset(source);

    element = $(element);
    let delta = [0, 0];
    let parent = null;
    if (Element.getStyle(element, 'position') == 'absolute') {
      parent = Element.getOffsetParent(element);
      delta = Element.viewportOffset(parent);
    }

    if (parent == document.body) {
      delta[0] -= document.body.offsetLeft;
      delta[1] -= document.body.offsetTop;
    }

    if (options.setLeft) element.style.left = `${p[0] - delta[0] + options.offsetLeft}px`;
    if (options.setTop) element.style.top = `${p[1] - delta[1] + options.offsetTop}px`;
    if (options.setWidth) element.style.width = `${source.offsetWidth}px`;
    if (options.setHeight) element.style.height = `${source.offsetHeight}px`;
    return element;
  },
};

Object.extend(Element.Methods, {
  getElementsBySelector: Element.Methods.select,

  childElements: Element.Methods.immediateDescendants,
});

Element._attributeTranslations = {
  write: {
    names: {
      className: 'class',
      htmlFor: 'for',
    },
    values: { },
  },
};

if (Prototype.Browser.Opera) {
  Element.Methods.getStyle = Element.Methods.getStyle.wrap(
    (proceed, element, style) => {
      switch (style) {
        case 'left': case 'top': case 'right': case 'bottom':
          if (proceed(element, 'position') === 'static') return null;
        case 'height': case 'width':
          if (!Element.visible(element)) return null;

          var dim = parseInt(proceed(element, style), 10);

          if (dim !== element[`offset${style.capitalize()}`]) return `${dim}px`;

          var properties;
          if (style === 'height') {
            properties = ['border-top-width', 'padding-top',
              'padding-bottom', 'border-bottom-width'];
          } else {
            properties = ['border-left-width', 'padding-left',
              'padding-right', 'border-right-width'];
          }
          return `${properties.inject(dim, (memo, property) => {
            const val = proceed(element, property);
            return val === null ? memo : memo - parseInt(val, 10);
          })}px`;
        default: return proceed(element, style);
      }
    },
  );

  Element.Methods.readAttribute = Element.Methods.readAttribute.wrap(
    (proceed, element, attribute) => {
      if (attribute === 'title') return element.title;
      return proceed(element, attribute);
    },
  );
} else if (Prototype.Browser.IE) {
  Element.Methods.getOffsetParent = Element.Methods.getOffsetParent.wrap(
    (proceed, element) => {
      element = $(element);
      try { element.offsetParent; } catch (e) { return $(document.body); }
      const position = element.getStyle('position');
      if (position !== 'static') return proceed(element);
      element.setStyle({ position: 'relative' });
      const value = proceed(element);
      element.setStyle({ position });
      return value;
    },
  );

  $w('positionedOffset viewportOffset').each((method) => {
    Element.Methods[method] = Element.Methods[method].wrap(
      (proceed, element) => {
        element = $(element);
        try { element.offsetParent; } catch (e) { return Element._returnOffset(0, 0); }
        const position = element.getStyle('position');
        if (position !== 'static') return proceed(element);
        const offsetParent = element.getOffsetParent();
        if (offsetParent && offsetParent.getStyle('position') === 'fixed') offsetParent.setStyle({ zoom: 1 });
        element.setStyle({ position: 'relative' });
        const value = proceed(element);
        element.setStyle({ position });
        return value;
      },
    );
  });

  Element.Methods.cumulativeOffset = Element.Methods.cumulativeOffset.wrap(
    (proceed, element) => {
      try { element.offsetParent; } catch (e) { return Element._returnOffset(0, 0); }
      return proceed(element);
    },
  );

  Element.Methods.getStyle = function (element, style) {
    element = $(element);
    style = (style == 'float' || style == 'cssFloat') ? 'styleFloat' : style.camelize();
    let value = element.style[style];
    if (!value && element.currentStyle) value = element.currentStyle[style];

    if (style == 'opacity') {
      if (value = (element.getStyle('filter') || '').match(/alpha\(opacity=(.*)\)/)) if (value[1]) return parseFloat(value[1]) / 100;
      return 1.0;
    }

    if (value == 'auto') {
      if ((style == 'width' || style == 'height') && (element.getStyle('display') != 'none')) return `${element[`offset${style.capitalize()}`]}px`;
      return null;
    }
    return value;
  };

  Element.Methods.setOpacity = function (element, value) {
    function stripAlpha(filter) {
      return filter.replace(/alpha\([^\)]*\)/gi, '');
    }
    element = $(element);
    const { currentStyle } = element;
    if ((currentStyle && !currentStyle.hasLayout)
      || (!currentStyle && element.style.zoom == 'normal')) element.style.zoom = 1;

    let filter = element.getStyle('filter'); const
      { style } = element;
    if (value == 1 || value === '') {
      (filter = stripAlpha(filter))
        ? style.filter = filter : style.removeAttribute('filter');
      return element;
    } if (value < 0.00001) value = 0;
    style.filter = `${stripAlpha(filter)
    }alpha(opacity=${value * 100})`;
    return element;
  };

  Element._attributeTranslations = (function () {
    let classProp = 'className';
    let forProp = 'for';

    let el = document.createElement('div');

    el.setAttribute(classProp, 'x');

    if (el.className !== 'x') {
      el.setAttribute('class', 'x');
      if (el.className === 'x') {
        classProp = 'class';
      }
    }
    el = null;

    el = document.createElement('label');
    el.setAttribute(forProp, 'x');
    if (el.htmlFor !== 'x') {
      el.setAttribute('htmlFor', 'x');
      if (el.htmlFor === 'x') {
        forProp = 'htmlFor';
      }
    }
    el = null;

    return {
      read: {
        names: {
          class: classProp,
          className: classProp,
          for: forProp,
          htmlFor: forProp,
        },
        values: {
          _getAttr(element, attribute) {
            return element.getAttribute(attribute);
          },
          _getAttr2(element, attribute) {
            return element.getAttribute(attribute, 2);
          },
          _getAttrNode(element, attribute) {
            const node = element.getAttributeNode(attribute);
            return node ? node.value : '';
          },
          _getEv: (function () {
            let el = document.createElement('div');
            el.onclick = Prototype.emptyFunction;
            const value = el.getAttribute('onclick');
            let f;

            if (String(value).indexOf('{') > -1) {
              f = function (element, attribute) {
                attribute = element.getAttribute(attribute);
                if (!attribute) return null;
                attribute = attribute.toString();
                attribute = attribute.split('{')[1];
                attribute = attribute.split('}')[0];
                return attribute.strip();
              };
            } else if (value === '') {
              f = function (element, attribute) {
                attribute = element.getAttribute(attribute);
                if (!attribute) return null;
                return attribute.strip();
              };
            }
            el = null;
            return f;
          }()),
          _flag(element, attribute) {
            return $(element).hasAttribute(attribute) ? attribute : null;
          },
          style(element) {
            return element.style.cssText.toLowerCase();
          },
          title(element) {
            return element.title;
          },
        },
      },
    };
  }());

  Element._attributeTranslations.write = {
    names: Object.extend({
      cellpadding: 'cellPadding',
      cellspacing: 'cellSpacing',
    }, Element._attributeTranslations.read.names),
    values: {
      checked(element, value) {
        element.checked = !!value;
      },

      style(element, value) {
        element.style.cssText = value || '';
      },
    },
  };

  Element._attributeTranslations.has = {};

  $w('colSpan rowSpan vAlign dateTime accessKey tabIndex '
      + 'encType maxLength readOnly longDesc frameBorder').each((attr) => {
    Element._attributeTranslations.write.names[attr.toLowerCase()] = attr;
    Element._attributeTranslations.has[attr.toLowerCase()] = attr;
  });

  (function (v) {
    Object.extend(v, {
      href: v._getAttr2,
      src: v._getAttr2,
      type: v._getAttr,
      action: v._getAttrNode,
      disabled: v._flag,
      checked: v._flag,
      readonly: v._flag,
      multiple: v._flag,
      onload: v._getEv,
      onunload: v._getEv,
      onclick: v._getEv,
      ondblclick: v._getEv,
      onmousedown: v._getEv,
      onmouseup: v._getEv,
      onmouseover: v._getEv,
      onmousemove: v._getEv,
      onmouseout: v._getEv,
      onfocus: v._getEv,
      onblur: v._getEv,
      onkeypress: v._getEv,
      onkeydown: v._getEv,
      onkeyup: v._getEv,
      onsubmit: v._getEv,
      onreset: v._getEv,
      onselect: v._getEv,
      onchange: v._getEv,
    });
  }(Element._attributeTranslations.read.values));

  if (Prototype.BrowserFeatures.ElementExtensions) {
    (function () {
      function _descendants(element) {
        const nodes = element.getElementsByTagName('*'); const
          results = [];
        for (var i = 0, node; node = nodes[i]; i++) {
          if (node.tagName !== '!') // Filter out comment nodes.
          { results.push(node); }
        }
        return results;
      }

      Element.Methods.down = function (element, expression, index) {
        element = $(element);
        if (arguments.length == 1) return element.firstDescendant();
        return Object.isNumber(expression) ? _descendants(element)[expression]
          : Element.select(element, expression)[index || 0];
      };
    }());
  }
} else if (Prototype.Browser.Gecko && /rv:1\.8\.0/.test(navigator.userAgent)) {
  Element.Methods.setOpacity = function (element, value) {
    element = $(element);
    element.style.opacity = (value == 1) ? 0.999999
      : (value === '') ? '' : (value < 0.00001) ? 0 : value;
    return element;
  };
} else if (Prototype.Browser.WebKit) {
  Element.Methods.setOpacity = function (element, value) {
    element = $(element);
    element.style.opacity = (value == 1 || value === '') ? ''
      : (value < 0.00001) ? 0 : value;

    if (value == 1) {
      if (element.tagName.toUpperCase() == 'IMG' && element.width) {
        element.width++; element.width--;
      } else {
        try {
          const n = document.createTextNode(' ');
          element.appendChild(n);
          element.removeChild(n);
        } catch (e) { }
      }
    }

    return element;
  };

  Element.Methods.cumulativeOffset = function (element) {
    let valueT = 0; let
      valueL = 0;
    do {
      valueT += element.offsetTop || 0;
      valueL += element.offsetLeft || 0;
      if (element.offsetParent == document.body) if (Element.getStyle(element, 'position') == 'absolute') break;

      element = element.offsetParent;
    } while (element);

    return Element._returnOffset(valueL, valueT);
  };
}

if ('outerHTML' in document.documentElement) {
  Element.Methods.replace = function (element, content) {
    element = $(element);

    if (content && content.toElement) content = content.toElement();
    if (Object.isElement(content)) {
      element.parentNode.replaceChild(content, element);
      return element;
    }

    content = Object.toHTML(content);
    const parent = element.parentNode; const
      tagName = parent.tagName.toUpperCase();

    if (Element._insertionTranslations.tags[tagName]) {
      const nextSibling = element.next();
      const fragments = Element._getContentFromAnonymousElement(tagName, content.stripScripts());
      parent.removeChild(element);
      if (nextSibling) fragments.each((node) => { parent.insertBefore(node, nextSibling); });
      else fragments.each((node) => { parent.appendChild(node); });
    } else element.outerHTML = content.stripScripts();

    content.evalScripts.bind(content).defer();
    return element;
  };
}

Element._returnOffset = function (l, t) {
  const result = [l, t];
  result.left = l;
  result.top = t;
  return result;
};

Element._getContentFromAnonymousElement = function (tagName, html) {
  let div = new Element('div'); const
    t = Element._insertionTranslations.tags[tagName];
  if (t) {
    div.innerHTML = t[0] + html + t[1];
    t[2].times(() => { div = div.firstChild; });
  } else div.innerHTML = html;
  return $A(div.childNodes);
};

Element._insertionTranslations = {
  before(element, node) {
    element.parentNode.insertBefore(node, element);
  },
  top(element, node) {
    element.insertBefore(node, element.firstChild);
  },
  bottom(element, node) {
    element.appendChild(node);
  },
  after(element, node) {
    element.parentNode.insertBefore(node, element.nextSibling);
  },
  tags: {
    TABLE: ['<table>', '</table>', 1],
    TBODY: ['<table><tbody>', '</tbody></table>', 2],
    TR: ['<table><tbody><tr>', '</tr></tbody></table>', 3],
    TD: ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
    SELECT: ['<select>', '</select>', 1],
  },
};

(function () {
  const { tags } = Element._insertionTranslations;
  Object.extend(tags, {
    THEAD: tags.TBODY,
    TFOOT: tags.TBODY,
    TH: tags.TD,
  });
}());

Element.Methods.Simulated = {
  hasAttribute(element, attribute) {
    attribute = Element._attributeTranslations.has[attribute] || attribute;
    const node = $(element).getAttributeNode(attribute);
    return !!(node && node.specified);
  },
};

Element.Methods.ByTag = { };

Object.extend(Element, Element.Methods);

(function (div) {
  if (!Prototype.BrowserFeatures.ElementExtensions && div.__proto__) {
    window.HTMLElement = { };
    window.HTMLElement.prototype = div.__proto__;
    Prototype.BrowserFeatures.ElementExtensions = true;
  }

  div = null;
}(document.createElement('div')));

Element.extend = (function () {
  function checkDeficiency(tagName) {
    if (typeof window.Element !== 'undefined') {
      const proto = window.Element.prototype;
      if (proto) {
        const id = `_${(`${Math.random()}`).slice(2)}`;
        let el = document.createElement(tagName);
        proto[id] = 'x';
        const isBuggy = (el[id] !== 'x');
        delete proto[id];
        el = null;
        return isBuggy;
      }
    }
    return false;
  }

  function extendElementWith(element, methods) {
    for (const property in methods) {
      const value = methods[property];
      if (Object.isFunction(value) && !(property in element)) element[property] = value.methodize();
    }
  }

  const HTMLOBJECTELEMENT_PROTOTYPE_BUGGY = checkDeficiency('object');

  if (Prototype.BrowserFeatures.SpecificElementExtensions) {
    if (HTMLOBJECTELEMENT_PROTOTYPE_BUGGY) {
      return function (element) {
        if (element && typeof element._extendedByPrototype === 'undefined') {
          const t = element.tagName;
          if (t && (/^(?:object|applet|embed)$/i.test(t))) {
            extendElementWith(element, Element.Methods);
            extendElementWith(element, Element.Methods.Simulated);
            extendElementWith(element, Element.Methods.ByTag[t.toUpperCase()]);
          }
        }
        return element;
      };
    }
    return Prototype.K;
  }

  const Methods = { }; const
    { ByTag } = Element.Methods;

  const extend = Object.extend((element) => {
    if (!element || typeof element._extendedByPrototype !== 'undefined'
        || element.nodeType != 1 || element == window) return element;

    const methods = Object.clone(Methods);
    const tagName = element.tagName.toUpperCase();

    if (ByTag[tagName]) Object.extend(methods, ByTag[tagName]);

    extendElementWith(element, methods);

    element._extendedByPrototype = Prototype.emptyFunction;
    return element;
  }, {
    refresh() {
      if (!Prototype.BrowserFeatures.ElementExtensions) {
        Object.extend(Methods, Element.Methods);
        Object.extend(Methods, Element.Methods.Simulated);
      }
    },
  });

  extend.refresh();
  return extend;
}());

Element.hasAttribute = function (element, attribute) {
  if (element.hasAttribute) return element.hasAttribute(attribute);
  return Element.Methods.Simulated.hasAttribute(element, attribute);
};

Element.addMethods = function (methods) {
  const F = Prototype.BrowserFeatures; const
    T = Element.Methods.ByTag;

  if (!methods) {
    Object.extend(Form, Form.Methods);
    Object.extend(Form.Element, Form.Element.Methods);
    Object.extend(Element.Methods.ByTag, {
      FORM: Object.clone(Form.Methods),
      INPUT: Object.clone(Form.Element.Methods),
      SELECT: Object.clone(Form.Element.Methods),
      TEXTAREA: Object.clone(Form.Element.Methods),
    });
  }

  if (arguments.length == 2) {
    var tagName = methods;
    methods = arguments[1];
  }

  if (!tagName) Object.extend(Element.Methods, methods || { });
  else if (Object.isArray(tagName)) tagName.each(extend);
  else extend(tagName);

  function extend(tagName) {
    tagName = tagName.toUpperCase();
    if (!Element.Methods.ByTag[tagName]) Element.Methods.ByTag[tagName] = { };
    Object.extend(Element.Methods.ByTag[tagName], methods);
  }

  function copy(methods, destination, onlyIfAbsent) {
    onlyIfAbsent = onlyIfAbsent || false;
    for (const property in methods) {
      const value = methods[property];
      if (!Object.isFunction(value)) continue;
      if (!onlyIfAbsent || !(property in destination)) destination[property] = value.methodize();
    }
  }

  function findDOMClass(tagName) {
    let klass;
    const trans = {
      OPTGROUP: 'OptGroup',
      TEXTAREA: 'TextArea',
      P: 'Paragraph',
      FIELDSET: 'FieldSet',
      UL: 'UList',
      OL: 'OList',
      DL: 'DList',
      DIR: 'Directory',
      H1: 'Heading',
      H2: 'Heading',
      H3: 'Heading',
      H4: 'Heading',
      H5: 'Heading',
      H6: 'Heading',
      Q: 'Quote',
      INS: 'Mod',
      DEL: 'Mod',
      A: 'Anchor',
      IMG: 'Image',
      CAPTION:
      'TableCaption',
      COL: 'TableCol',
      COLGROUP: 'TableCol',
      THEAD:
      'TableSection',
      TFOOT: 'TableSection',
      TBODY: 'TableSection',
      TR:
      'TableRow',
      TH: 'TableCell',
      TD: 'TableCell',
      FRAMESET:
      'FrameSet',
      IFRAME: 'IFrame',
    };
    if (trans[tagName]) klass = `HTML${trans[tagName]}Element`;
    if (window[klass]) return window[klass];
    klass = `HTML${tagName}Element`;
    if (window[klass]) return window[klass];
    klass = `HTML${tagName.capitalize()}Element`;
    if (window[klass]) return window[klass];

    let element = document.createElement(tagName);
    const proto = element.__proto__ || element.constructor.prototype;
    element = null;
    return proto;
  }

  const elementPrototype = window.HTMLElement ? HTMLElement.prototype
    : Element.prototype;

  if (F.ElementExtensions) {
    copy(Element.Methods, elementPrototype);
    copy(Element.Methods.Simulated, elementPrototype, true);
  }

  if (F.SpecificElementExtensions) {
    for (const tag in Element.Methods.ByTag) {
      const klass = findDOMClass(tag);
      if (Object.isUndefined(klass)) continue;
      copy(T[tag], klass.prototype);
    }
  }

  Object.extend(Element, Element.Methods);
  delete Element.ByTag;

  if (Element.extend.refresh) Element.extend.refresh();
  Element.cache = { };
};

document.viewport = {

  getDimensions() {
    return { width: this.getWidth(), height: this.getHeight() };
  },

  getScrollOffsets() {
    return Element._returnOffset(
      window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
    );
  },
};

(function (viewport) {
  const B = Prototype.Browser; const doc = document; let element; const
    property = {};

  function getRootElement() {
    if (B.WebKit && !doc.evaluate) return document;

    if (B.Opera && window.parseFloat(window.opera.version()) < 9.5) return document.body;

    return document.documentElement;
  }

  function define(D) {
    if (!element) element = getRootElement();

    property[D] = `client${D}`;

    viewport[`get${D}`] = function () { return element[property[D]]; };
    return viewport[`get${D}`]();
  }

  viewport.getWidth = define.curry('Width');

  viewport.getHeight = define.curry('Height');
}(document.viewport));

Element.Storage = {
  UID: 1,
};

Element.addMethods({
  getStorage(element) {
    if (!(element = $(element))) return;

    let uid;
    if (element === window) {
      uid = 0;
    } else {
      if (typeof element._prototypeUID === 'undefined') element._prototypeUID = [Element.Storage.UID++];
      uid = element._prototypeUID[0];
    }

    if (!Element.Storage[uid]) Element.Storage[uid] = $H();

    return Element.Storage[uid];
  },

  store(element, key, value) {
    if (!(element = $(element))) return;

    if (arguments.length === 2) {
      Element.getStorage(element).update(key);
    } else {
      Element.getStorage(element).set(key, value);
    }

    return element;
  },

  retrieve(element, key, defaultValue) {
    if (!(element = $(element))) return;
    const hash = Element.getStorage(element); let
      value = hash.get(key);

    if (Object.isUndefined(value)) {
      hash.set(key, defaultValue);
      value = defaultValue;
    }

    return value;
  },

  clone(element, deep) {
    if (!(element = $(element))) return;
    const clone = element.cloneNode(deep);
    clone._prototypeUID = void 0;
    if (deep) {
      const descendants = Element.select(clone, '*');
      let i = descendants.length;
      while (i--) {
        descendants[i]._prototypeUID = void 0;
      }
    }
    return Element.extend(clone);
  },
});
/* Portions of the Selector class are derived from Jack Slocum's DomQuery,
 * part of YUI-Ext version 0.40, distributed under the terms of an MIT-style
 * license.  Please see http://www.yui-ext.com/ for more information. */

var Selector = Class.create({
  initialize(expression) {
    this.expression = expression.strip();

    if (this.shouldUseSelectorsAPI()) {
      this.mode = 'selectorsAPI';
    } else if (this.shouldUseXPath()) {
      this.mode = 'xpath';
      this.compileXPathMatcher();
    } else {
      this.mode = 'normal';
      this.compileMatcher();
    }
  },

  shouldUseXPath: (function () {
    const IS_DESCENDANT_SELECTOR_BUGGY = (function () {
      let isBuggy = false;
      if (document.evaluate && window.XPathResult) {
        let el = document.createElement('div');
        el.innerHTML = '<ul><li></li></ul><div><ul><li></li></ul></div>';

        const xpath = ".//*[local-name()='ul' or local-name()='UL']"
          + "//*[local-name()='li' or local-name()='LI']";

        const result = document.evaluate(xpath, el, null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        isBuggy = (result.snapshotLength !== 2);
        el = null;
      }
      return isBuggy;
    }());

    return function () {
      if (!Prototype.BrowserFeatures.XPath) return false;

      const e = this.expression;

      if (Prototype.Browser.WebKit
       && (e.include('-of-type') || e.include(':empty'))) return false;

      if ((/(\[[\w-]*?:|:checked)/).test(e)) return false;

      if (IS_DESCENDANT_SELECTOR_BUGGY) return false;

      return true;
    };
  }()),

  shouldUseSelectorsAPI() {
    if (!Prototype.BrowserFeatures.SelectorsAPI) return false;

    if (Selector.CASE_INSENSITIVE_CLASS_NAMES) return false;

    if (!Selector._div) Selector._div = new Element('div');

    try {
      Selector._div.querySelector(this.expression);
    } catch (e) {
      return false;
    }

    return true;
  },

  compileMatcher() {
    let e = this.expression; const ps = Selector.patterns; const h = Selector.handlers;
    const c = Selector.criteria; let le; let p; let m; const len = ps.length; let
      name;

    if (Selector._cache[e]) {
      this.matcher = Selector._cache[e];
      return;
    }

    this.matcher = ['this.matcher = function(root) {',
      'var r = root, h = Selector.handlers, c = false, n;'];

    while (e && le != e && (/\S/).test(e)) {
      le = e;
      for (let i = 0; i < len; i++) {
        p = ps[i].re;
        name = ps[i].name;
        if (m = e.match(p)) {
          this.matcher.push(Object.isFunction(c[name]) ? c[name](m)
            : new Template(c[name]).evaluate(m));
          e = e.replace(m[0], '');
          break;
        }
      }
    }

    this.matcher.push('return h.unique(n);\n}');
    eval(this.matcher.join('\n'));
    Selector._cache[this.expression] = this.matcher;
  },

  compileXPathMatcher() {
    let e = this.expression; const ps = Selector.patterns;
    const x = Selector.xpath; let le; let m; const len = ps.length; let
      name;

    if (Selector._cache[e]) {
      this.xpath = Selector._cache[e]; return;
    }

    this.matcher = ['.//*'];
    while (e && le != e && (/\S/).test(e)) {
      le = e;
      for (let i = 0; i < len; i++) {
        name = ps[i].name;
        if (m = e.match(ps[i].re)) {
          this.matcher.push(Object.isFunction(x[name]) ? x[name](m)
            : new Template(x[name]).evaluate(m));
          e = e.replace(m[0], '');
          break;
        }
      }
    }

    this.xpath = this.matcher.join('');
    Selector._cache[this.expression] = this.xpath;
  },

  findElements(root) {
    root = root || document;
    let e = this.expression; let
      results;

    switch (this.mode) {
      case 'selectorsAPI':
        if (root !== document) {
          var oldId = root.id; let
            id = $(root).identify();
          id = id.replace(/([\.:])/g, '\\$1');
          e = `#${id} ${e}`;
        }

        results = $A(root.querySelectorAll(e)).map(Element.extend);
        root.id = oldId;

        return results;
      case 'xpath':
        return document._getElementsByXPath(this.xpath, root);
      default:
        return this.matcher(root);
    }
  },

  match(element) {
    this.tokens = [];

    let e = this.expression; const ps = Selector.patterns; const
      as = Selector.assertions;
    let le; let p; let m; const len = ps.length; var
      name;

    while (e && le !== e && (/\S/).test(e)) {
      le = e;
      for (var i = 0; i < len; i++) {
        p = ps[i].re;
        name = ps[i].name;
        if (m = e.match(p)) {
          if (as[name]) {
            this.tokens.push([name, Object.clone(m)]);
            e = e.replace(m[0], '');
          } else {
            return this.findElements(document).include(element);
          }
        }
      }
    }

    let match = true; var name; let
      matches;
    for (var i = 0, token; token = this.tokens[i]; i++) {
      name = token[0], matches = token[1];
      if (!Selector.assertions[name](element, matches)) {
        match = false; break;
      }
    }

    return match;
  },

  toString() {
    return this.expression;
  },

  inspect() {
    return `#<Selector:${this.expression.inspect()}>`;
  },
});

if (Prototype.BrowserFeatures.SelectorsAPI
 && document.compatMode === 'BackCompat') {
  Selector.CASE_INSENSITIVE_CLASS_NAMES = (function () {
    let div = document.createElement('div');
    let span = document.createElement('span');

    div.id = 'prototype_test_id';
    span.className = 'Test';
    div.appendChild(span);
    const isIgnored = (div.querySelector('#prototype_test_id .test') !== null);
    div = span = null;
    return isIgnored;
  }());
}

Object.extend(Selector, {
  _cache: { },

  xpath: {
    descendant: '//*',
    child: '/*',
    adjacent: '/following-sibling::*[1]',
    laterSibling: '/following-sibling::*',
    tagName(m) {
      if (m[1] == '*') return '';
      return `[local-name()='${m[1].toLowerCase()
      }' or local-name()='${m[1].toUpperCase()}']`;
    },
    className: "[contains(concat(' ', @class, ' '), ' #{1} ')]",
    id: "[@id='#{1}']",
    attrPresence(m) {
      m[1] = m[1].toLowerCase();
      return new Template('[@#{1}]').evaluate(m);
    },
    attr(m) {
      m[1] = m[1].toLowerCase();
      m[3] = m[5] || m[6];
      return new Template(Selector.xpath.operators[m[2]]).evaluate(m);
    },
    pseudo(m) {
      const h = Selector.xpath.pseudos[m[1]];
      if (!h) return '';
      if (Object.isFunction(h)) return h(m);
      return new Template(Selector.xpath.pseudos[m[1]]).evaluate(m);
    },
    operators: {
      '=': "[@#{1}='#{3}']",
      '!=': "[@#{1}!='#{3}']",
      '^=': "[starts-with(@#{1}, '#{3}')]",
      '$=': "[substring(@#{1}, (string-length(@#{1}) - string-length('#{3}') + 1))='#{3}']",
      '*=': "[contains(@#{1}, '#{3}')]",
      '~=': "[contains(concat(' ', @#{1}, ' '), ' #{3} ')]",
      '|=': "[contains(concat('-', @#{1}, '-'), '-#{3}-')]",
    },
    pseudos: {
      'first-child': '[not(preceding-sibling::*)]',
      'last-child': '[not(following-sibling::*)]',
      'only-child': '[not(preceding-sibling::* or following-sibling::*)]',
      empty: '[count(*) = 0 and (count(text()) = 0)]',
      checked: '[@checked]',
      disabled: "[(@disabled) and (@type!='hidden')]",
      enabled: "[not(@disabled) and (@type!='hidden')]",
      not(m) {
        let e = m[6]; const p = Selector.patterns;
        const x = Selector.xpath; let le; let v; const len = p.length; let
          name;

        const exclusion = [];
        while (e && le != e && (/\S/).test(e)) {
          le = e;
          for (let i = 0; i < len; i++) {
            name = p[i].name;
            if (m = e.match(p[i].re)) {
              v = Object.isFunction(x[name]) ? x[name](m) : new Template(x[name]).evaluate(m);
              exclusion.push(`(${v.substring(1, v.length - 1)})`);
              e = e.replace(m[0], '');
              break;
            }
          }
        }
        return `[not(${exclusion.join(' and ')})]`;
      },
      'nth-child': function (m) {
        return Selector.xpath.pseudos.nth('(count(./preceding-sibling::*) + 1) ', m);
      },
      'nth-last-child': function (m) {
        return Selector.xpath.pseudos.nth('(count(./following-sibling::*) + 1) ', m);
      },
      'nth-of-type': function (m) {
        return Selector.xpath.pseudos.nth('position() ', m);
      },
      'nth-last-of-type': function (m) {
        return Selector.xpath.pseudos.nth('(last() + 1 - position()) ', m);
      },
      'first-of-type': function (m) {
        m[6] = '1'; return Selector.xpath.pseudos['nth-of-type'](m);
      },
      'last-of-type': function (m) {
        m[6] = '1'; return Selector.xpath.pseudos['nth-last-of-type'](m);
      },
      'only-of-type': function (m) {
        const p = Selector.xpath.pseudos; return p['first-of-type'](m) + p['last-of-type'](m);
      },
      nth(fragment, m) {
        let mm; let formula = m[6]; let
          predicate;
        if (formula == 'even') formula = '2n+0';
        if (formula == 'odd') formula = '2n+1';
        if (mm = formula.match(/^(\d+)$/)) // digit only
        { return `[${fragment}= ${mm[1]}]`; }
        if (mm = formula.match(/^(-?\d*)?n(([+-])(\d+))?/)) { // an+b
          if (mm[1] == '-') mm[1] = -1;
          const a = mm[1] ? Number(mm[1]) : 1;
          const b = mm[2] ? Number(mm[2]) : 0;
          predicate = '[((#{fragment} - #{b}) mod #{a} = 0) and '
          + '((#{fragment} - #{b}) div #{a} >= 0)]';
          return new Template(predicate).evaluate({ fragment, a, b });
        }
      },
    },
  },

  criteria: {
    tagName: 'n = h.tagName(n, r, "#{1}", c);      c = false;',
    className: 'n = h.className(n, r, "#{1}", c);    c = false;',
    id: 'n = h.id(n, r, "#{1}", c);           c = false;',
    attrPresence: 'n = h.attrPresence(n, r, "#{1}", c); c = false;',
    attr(m) {
      m[3] = (m[5] || m[6]);
      return new Template('n = h.attr(n, r, "#{1}", "#{3}", "#{2}", c); c = false;').evaluate(m);
    },
    pseudo(m) {
      if (m[6]) m[6] = m[6].replace(/"/g, '\\"');
      return new Template('n = h.pseudo(n, "#{1}", "#{6}", r, c); c = false;').evaluate(m);
    },
    descendant: 'c = "descendant";',
    child: 'c = "child";',
    adjacent: 'c = "adjacent";',
    laterSibling: 'c = "laterSibling";',
  },

  patterns: [
    { name: 'laterSibling', re: /^\s*~\s*/ },
    { name: 'child', re: /^\s*>\s*/ },
    { name: 'adjacent', re: /^\s*\+\s*/ },
    { name: 'descendant', re: /^\s/ },

    { name: 'tagName', re: /^\s*(\*|[\w\-]+)(\b|$)?/ },
    { name: 'id', re: /^#([\w\-\*]+)(\b|$)/ },
    { name: 'className', re: /^\.([\w\-\*]+)(\b|$)/ },
    { name: 'pseudo', re: /^:((first|last|nth|nth-last|only)(-child|-of-type)|empty|checked|(en|dis)abled|not)(\((.*?)\))?(\b|$|(?=\s|[:+~>]))/ },
    { name: 'attrPresence', re: /^\[((?:[\w-]+:)?[\w-]+)\]/ },
    { name: 'attr', re: /\[((?:[\w-]*:)?[\w-]+)\s*(?:([!^$*~|]?=)\s*((['"])([^\4]*?)\4|([^'"][^\]]*?)))?\]/ },
  ],

  assertions: {
    tagName(element, matches) {
      return matches[1].toUpperCase() == element.tagName.toUpperCase();
    },

    className(element, matches) {
      return Element.hasClassName(element, matches[1]);
    },

    id(element, matches) {
      return element.id === matches[1];
    },

    attrPresence(element, matches) {
      return Element.hasAttribute(element, matches[1]);
    },

    attr(element, matches) {
      const nodeValue = Element.readAttribute(element, matches[1]);
      return nodeValue && Selector.operators[matches[2]](nodeValue, matches[5] || matches[6]);
    },
  },

  handlers: {
    concat(a, b) {
      for (var i = 0, node; node = b[i]; i++) a.push(node);
      return a;
    },

    mark(nodes) {
      const _true = Prototype.emptyFunction;
      for (var i = 0, node; node = nodes[i]; i++) node._countedByPrototype = _true;
      return nodes;
    },

    unmark: (function () {
      const PROPERTIES_ATTRIBUTES_MAP = (function () {
        let el = document.createElement('div');
        let isBuggy = false;
        const propName = '_countedByPrototype';
        const value = 'x';
        el[propName] = value;
        isBuggy = (el.getAttribute(propName) === value);
        el = null;
        return isBuggy;
      }());

      return PROPERTIES_ATTRIBUTES_MAP
        ? function (nodes) {
          for (var i = 0, node; node = nodes[i]; i++) node.removeAttribute('_countedByPrototype');
          return nodes;
        }
        : function (nodes) {
          for (var i = 0, node; node = nodes[i]; i++) node._countedByPrototype = void 0;
          return nodes;
        };
    }()),

    index(parentNode, reverse, ofType) {
      parentNode._countedByPrototype = Prototype.emptyFunction;
      if (reverse) {
        for (var nodes = parentNode.childNodes, i = nodes.length - 1, j = 1; i >= 0; i--) {
          var node = nodes[i];
          if (node.nodeType == 1 && (!ofType || node._countedByPrototype)) node.nodeIndex = j++;
        }
      } else {
        for (var i = 0, j = 1, nodes = parentNode.childNodes; node = nodes[i]; i++) if (node.nodeType == 1 && (!ofType || node._countedByPrototype)) node.nodeIndex = j++;
      }
    },

    unique(nodes) {
      if (nodes.length == 0) return nodes;
      const results = []; let
        n;
      for (let i = 0, l = nodes.length; i < l; i++) {
        if (typeof (n = nodes[i])._countedByPrototype === 'undefined') {
          n._countedByPrototype = Prototype.emptyFunction;
          results.push(Element.extend(n));
        }
      }
      return Selector.handlers.unmark(results);
    },

    descendant(nodes) {
      const h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++) h.concat(results, node.getElementsByTagName('*'));
      return results;
    },

    child(nodes) {
      const h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        for (var j = 0, child; child = node.childNodes[j]; j++) if (child.nodeType == 1 && child.tagName != '!') results.push(child);
      }
      return results;
    },

    adjacent(nodes) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        const next = this.nextElementSibling(node);
        if (next) results.push(next);
      }
      return results;
    },

    laterSibling(nodes) {
      const h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++) h.concat(results, Element.nextSiblings(node));
      return results;
    },

    nextElementSibling(node) {
      while (node = node.nextSibling) if (node.nodeType == 1) return node;
      return null;
    },

    previousElementSibling(node) {
      while (node = node.previousSibling) if (node.nodeType == 1) return node;
      return null;
    },

    tagName(nodes, root, tagName, combinator) {
      const uTagName = tagName.toUpperCase();
      const results = []; const
        h = Selector.handlers;
      if (nodes) {
        if (combinator) {
          if (combinator == 'descendant') {
            for (var i = 0, node; node = nodes[i]; i++) h.concat(results, node.getElementsByTagName(tagName));
            return results;
          } nodes = this[combinator](nodes);
          if (tagName == '*') return nodes;
        }
        for (var i = 0, node; node = nodes[i]; i++) if (node.tagName.toUpperCase() === uTagName) results.push(node);
        return results;
      } return root.getElementsByTagName(tagName);
    },

    id(nodes, root, id, combinator) {
      const targetNode = $(id); const
        h = Selector.handlers;

      if (root == document) {
        if (!targetNode) return [];
        if (!nodes) return [targetNode];
      } else if (!root.sourceIndex || root.sourceIndex < 1) {
        var nodes = root.getElementsByTagName('*');
        for (var j = 0, node; node = nodes[j]; j++) {
          if (node.id === id) return [node];
        }
      }

      if (nodes) {
        if (combinator) {
          if (combinator == 'child') {
            for (var i = 0, node; node = nodes[i]; i++) if (targetNode.parentNode == node) return [targetNode];
          } else if (combinator == 'descendant') {
            for (var i = 0, node; node = nodes[i]; i++) if (Element.descendantOf(targetNode, node)) return [targetNode];
          } else if (combinator == 'adjacent') {
            for (var i = 0, node; node = nodes[i]; i++) if (Selector.handlers.previousElementSibling(targetNode) == node) return [targetNode];
          } else nodes = h[combinator](nodes);
        }
        for (var i = 0, node; node = nodes[i]; i++) if (node == targetNode) return [targetNode];
        return [];
      }
      return (targetNode && Element.descendantOf(targetNode, root)) ? [targetNode] : [];
    },

    className(nodes, root, className, combinator) {
      if (nodes && combinator) nodes = this[combinator](nodes);
      return Selector.handlers.byClassName(nodes, root, className);
    },

    byClassName(nodes, root, className) {
      if (!nodes) nodes = Selector.handlers.descendant([root]);
      const needle = ` ${className} `;
      for (var i = 0, results = [], node, nodeClassName; node = nodes[i]; i++) {
        nodeClassName = node.className;
        if (nodeClassName.length == 0) continue;
        if (nodeClassName == className || (` ${nodeClassName} `).include(needle)) results.push(node);
      }
      return results;
    },

    attrPresence(nodes, root, attr, combinator) {
      if (!nodes) nodes = root.getElementsByTagName('*');
      if (nodes && combinator) nodes = this[combinator](nodes);
      const results = [];
      for (var i = 0, node; node = nodes[i]; i++) if (Element.hasAttribute(node, attr)) results.push(node);
      return results;
    },

    attr(nodes, root, attr, value, operator, combinator) {
      if (!nodes) nodes = root.getElementsByTagName('*');
      if (nodes && combinator) nodes = this[combinator](nodes);
      const handler = Selector.operators[operator]; const
        results = [];
      for (var i = 0, node; node = nodes[i]; i++) {
        const nodeValue = Element.readAttribute(node, attr);
        if (nodeValue === null) continue;
        if (handler(nodeValue, value)) results.push(node);
      }
      return results;
    },

    pseudo(nodes, name, value, root, combinator) {
      if (nodes && combinator) nodes = this[combinator](nodes);
      if (!nodes) nodes = root.getElementsByTagName('*');
      return Selector.pseudos[name](nodes, value, root);
    },
  },

  pseudos: {
    'first-child': function (nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        if (Selector.handlers.previousElementSibling(node)) continue;
        results.push(node);
      }
      return results;
    },
    'last-child': function (nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        if (Selector.handlers.nextElementSibling(node)) continue;
        results.push(node);
      }
      return results;
    },
    'only-child': function (nodes, value, root) {
      const h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++) if (!h.previousElementSibling(node) && !h.nextElementSibling(node)) results.push(node);
      return results;
    },
    'nth-child': function (nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root);
    },
    'nth-last-child': function (nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root, true);
    },
    'nth-of-type': function (nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root, false, true);
    },
    'nth-last-of-type': function (nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root, true, true);
    },
    'first-of-type': function (nodes, formula, root) {
      return Selector.pseudos.nth(nodes, '1', root, false, true);
    },
    'last-of-type': function (nodes, formula, root) {
      return Selector.pseudos.nth(nodes, '1', root, true, true);
    },
    'only-of-type': function (nodes, formula, root) {
      const p = Selector.pseudos;
      return p['last-of-type'](p['first-of-type'](nodes, formula, root), formula, root);
    },

    getIndices(a, b, total) {
      if (a == 0) return b > 0 ? [b] : [];
      return $R(1, total).inject([], (memo, i) => {
        if ((i - b) % a == 0 && (i - b) / a >= 0) memo.push(i);
        return memo;
      });
    },

    nth(nodes, formula, root, reverse, ofType) {
      if (nodes.length == 0) return [];
      if (formula == 'even') formula = '2n+0';
      if (formula == 'odd') formula = '2n+1';
      const h = Selector.handlers; const results = []; const indexed = []; let
        m;
      h.mark(nodes);
      for (var i = 0, node; node = nodes[i]; i++) {
        if (!node.parentNode._countedByPrototype) {
          h.index(node.parentNode, reverse, ofType);
          indexed.push(node.parentNode);
        }
      }
      if (formula.match(/^\d+$/)) { // just a number
        formula = Number(formula);
        for (var i = 0, node; node = nodes[i]; i++) if (node.nodeIndex == formula) results.push(node);
      } else if (m = formula.match(/^(-?\d*)?n(([+-])(\d+))?/)) { // an+b
        if (m[1] == '-') m[1] = -1;
        const a = m[1] ? Number(m[1]) : 1;
        const b = m[2] ? Number(m[2]) : 0;
        const indices = Selector.pseudos.getIndices(a, b, nodes.length);
        for (var i = 0, node, l = indices.length; node = nodes[i]; i++) {
          for (let j = 0; j < l; j++) if (node.nodeIndex == indices[j]) results.push(node);
        }
      }
      h.unmark(nodes);
      h.unmark(indexed);
      return results;
    },

    empty(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        if (node.tagName == '!' || node.firstChild) continue;
        results.push(node);
      }
      return results;
    },

    not(nodes, selector, root) {
      const h = Selector.handlers; let selectorType; let
        m;
      const exclusions = new Selector(selector).findElements(root);
      h.mark(exclusions);
      for (var i = 0, results = [], node; node = nodes[i]; i++) if (!node._countedByPrototype) results.push(node);
      h.unmark(exclusions);
      return results;
    },

    enabled(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) if (!node.disabled && (!node.type || node.type !== 'hidden')) results.push(node);
      return results;
    },

    disabled(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) if (node.disabled) results.push(node);
      return results;
    },

    checked(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) if (node.checked) results.push(node);
      return results;
    },
  },

  operators: {
    '=': function (nv, v) { return nv == v; },
    '!=': function (nv, v) { return nv != v; },
    '^=': function (nv, v) { return nv == v || nv && nv.startsWith(v); },
    '$=': function (nv, v) { return nv == v || nv && nv.endsWith(v); },
    '*=': function (nv, v) { return nv == v || nv && nv.include(v); },
    '~=': function (nv, v) { return (` ${nv} `).include(` ${v} `); },
    '|=': function (nv, v) {
      return (`-${(nv || '').toUpperCase()
      }-`).include(`-${(v || '').toUpperCase()}-`);
    },
  },

  split(expression) {
    const expressions = [];
    expression.scan(/(([\w#:.~>+()\s-]+|\*|\[.*?\])+)\s*(,|$)/, (m) => {
      expressions.push(m[1].strip());
    });
    return expressions;
  },

  matchElements(elements, expression) {
    const matches = $$(expression); const
      h = Selector.handlers;
    h.mark(matches);
    for (var i = 0, results = [], element; element = elements[i]; i++) if (element._countedByPrototype) results.push(element);
    h.unmark(matches);
    return results;
  },

  findElement(elements, expression, index) {
    if (Object.isNumber(expression)) {
      index = expression; expression = false;
    }
    return Selector.matchElements(elements, expression || '*')[index || 0];
  },

  findChildElements(element, expressions) {
    expressions = Selector.split(expressions.join(','));
    const results = []; const
      h = Selector.handlers;
    for (var i = 0, l = expressions.length, selector; i < l; i++) {
      selector = new Selector(expressions[i].strip());
      h.concat(results, selector.findElements(element));
    }
    return (l > 1) ? h.unique(results) : results;
  },
});

if (Prototype.Browser.IE) {
  Object.extend(Selector.handlers, {
    concat(a, b) {
      for (var i = 0, node; node = b[i]; i++) if (node.tagName !== '!') a.push(node);
      return a;
    },
  });
}

function $$() {
  return Selector.findChildElements(document, $A(arguments));
}

var Form = {
  reset(form) {
    form = $(form);
    form.reset();
    return form;
  },

  serializeElements(elements, options) {
    if (typeof options !== 'object') options = { hash: !!options };
    else if (Object.isUndefined(options.hash)) options.hash = true;
    let key; let value; let submitted = false; const
      { submit } = options;

    const data = elements.inject({ }, (result, element) => {
      if (!element.disabled && element.name) {
        key = element.name; value = $(element).getValue();
        if (value != null && element.type != 'file' && (element.type != 'submit' || (!submitted
            && submit !== false && (!submit || key == submit) && (submitted = true)))) {
          if (key in result) {
            if (!Object.isArray(result[key])) result[key] = [result[key]];
            result[key].push(value);
          } else result[key] = value;
        }
      }
      return result;
    });

    return options.hash ? data : Object.toQueryString(data);
  },
};

Form.Methods = {
  serialize(form, options) {
    return Form.serializeElements(Form.getElements(form), options);
  },

  getElements(form) {
    const elements = $(form).getElementsByTagName('*');
    let element;
    const arr = [];
    const serializers = Form.Element.Serializers;
    for (let i = 0; element = elements[i]; i++) {
      arr.push(element);
    }
    return arr.inject([], (elements, child) => {
      if (serializers[child.tagName.toLowerCase()]) elements.push(Element.extend(child));
      return elements;
    });
  },

  getInputs(form, typeName, name) {
    form = $(form);
    const inputs = form.getElementsByTagName('input');

    if (!typeName && !name) return $A(inputs).map(Element.extend);

    for (var i = 0, matchingInputs = [], { length } = inputs; i < length; i++) {
      const input = inputs[i];
      if ((typeName && input.type != typeName) || (name && input.name != name)) continue;
      matchingInputs.push(Element.extend(input));
    }

    return matchingInputs;
  },

  disable(form) {
    form = $(form);
    Form.getElements(form).invoke('disable');
    return form;
  },

  enable(form) {
    form = $(form);
    Form.getElements(form).invoke('enable');
    return form;
  },

  findFirstElement(form) {
    const elements = $(form).getElements().findAll((element) => element.type != 'hidden' && !element.disabled);
    const firstByIndex = elements.findAll((element) => element.hasAttribute('tabIndex') && element.tabIndex >= 0).sortBy((element) => element.tabIndex).first();

    return firstByIndex || elements.find((element) => /^(?:input|select|textarea)$/i.test(element.tagName));
  },

  focusFirstElement(form) {
    form = $(form);
    form.findFirstElement().activate();
    return form;
  },

  request(form, options) {
    form = $(form), options = Object.clone(options || { });

    let params = options.parameters; let
      action = form.readAttribute('action') || '';
    if (action.blank()) action = window.location.href;
    options.parameters = form.serialize(true);

    if (params) {
      if (Object.isString(params)) params = params.toQueryParams();
      Object.extend(options.parameters, params);
    }

    if (form.hasAttribute('method') && !options.method) options.method = form.method;

    return new Ajax.Request(action, options);
  },
};

/*--------------------------------------------------------------------------*/

Form.Element = {
  focus(element) {
    $(element).focus();
    return element;
  },

  select(element) {
    $(element).select();
    return element;
  },
};

Form.Element.Methods = {

  serialize(element) {
    element = $(element);
    if (!element.disabled && element.name) {
      const value = element.getValue();
      if (value != undefined) {
        const pair = { };
        pair[element.name] = value;
        return Object.toQueryString(pair);
      }
    }
    return '';
  },

  getValue(element) {
    element = $(element);
    const method = element.tagName.toLowerCase();
    return Form.Element.Serializers[method](element);
  },

  setValue(element, value) {
    element = $(element);
    const method = element.tagName.toLowerCase();
    Form.Element.Serializers[method](element, value);
    return element;
  },

  clear(element) {
    $(element).value = '';
    return element;
  },

  present(element) {
    return $(element).value != '';
  },

  activate(element) {
    element = $(element);
    try {
      element.focus();
      if (element.select && (element.tagName.toLowerCase() != 'input'
          || !(/^(?:button|reset|submit)$/i.test(element.type)))) element.select();
    } catch (e) { }
    return element;
  },

  disable(element) {
    element = $(element);
    element.disabled = true;
    return element;
  },

  enable(element) {
    element = $(element);
    element.disabled = false;
    return element;
  },
};

/*--------------------------------------------------------------------------*/

const Field = Form.Element;

const $F = Form.Element.Methods.getValue;

/*--------------------------------------------------------------------------*/

Form.Element.Serializers = {
  input(element, value) {
    switch (element.type.toLowerCase()) {
      case 'checkbox':
      case 'radio':
        return Form.Element.Serializers.inputSelector(element, value);
      default:
        return Form.Element.Serializers.textarea(element, value);
    }
  },

  inputSelector(element, value) {
    if (Object.isUndefined(value)) return element.checked ? element.value : null;
    element.checked = !!value;
  },

  textarea(element, value) {
    if (Object.isUndefined(value)) return element.value;
    element.value = value;
  },

  select(element, value) {
    if (Object.isUndefined(value)) {
      return this[element.type == 'select-one'
        ? 'selectOne' : 'selectMany'](element);
    }

    let opt; let currentValue; const
      single = !Object.isArray(value);
    for (let i = 0, { length } = element; i < length; i++) {
      opt = element.options[i];
      currentValue = this.optionValue(opt);
      if (single) {
        if (currentValue == value) {
          opt.selected = true;
          return;
        }
      } else opt.selected = value.include(currentValue);
    }
  },

  selectOne(element) {
    const index = element.selectedIndex;
    return index >= 0 ? this.optionValue(element.options[index]) : null;
  },

  selectMany(element) {
    var values; const
      { length } = element;
    if (!length) return null;

    for (var i = 0, values = []; i < length; i++) {
      const opt = element.options[i];
      if (opt.selected) values.push(this.optionValue(opt));
    }
    return values;
  },

  optionValue(opt) {
    return Element.extend(opt).hasAttribute('value') ? opt.value : opt.text;
  },
};

/*--------------------------------------------------------------------------*/

Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
  initialize($super, element, frequency, callback) {
    $super(callback, frequency);
    this.element = $(element);
    this.lastValue = this.getValue();
  },

  execute() {
    const value = this.getValue();
    if (Object.isString(this.lastValue) && Object.isString(value)
      ? this.lastValue != value : String(this.lastValue) != String(value)) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  },
});

Form.Element.Observer = Class.create(Abstract.TimedObserver, {
  getValue() {
    return Form.Element.getValue(this.element);
  },
});

Form.Observer = Class.create(Abstract.TimedObserver, {
  getValue() {
    return Form.serialize(this.element);
  },
});

/*--------------------------------------------------------------------------*/

Abstract.EventObserver = Class.create({
  initialize(element, callback) {
    this.element = $(element);
    this.callback = callback;

    this.lastValue = this.getValue();
    if (this.element.tagName.toLowerCase() == 'form') this.registerFormCallbacks();
    else this.registerCallback(this.element);
  },

  onElementEvent() {
    const value = this.getValue();
    if (this.lastValue != value) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  },

  registerFormCallbacks() {
    Form.getElements(this.element).each(this.registerCallback, this);
  },

  registerCallback(element) {
    if (element.type) {
      switch (element.type.toLowerCase()) {
        case 'checkbox':
        case 'radio':
          Event.observe(element, 'click', this.onElementEvent.bind(this));
          break;
        default:
          Event.observe(element, 'change', this.onElementEvent.bind(this));
          break;
      }
    }
  },
});

Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
  getValue() {
    return Form.Element.getValue(this.element);
  },
});

Form.EventObserver = Class.create(Abstract.EventObserver, {
  getValue() {
    return Form.serialize(this.element);
  },
});
(function () {
  const Event = {
    KEY_BACKSPACE: 8,
    KEY_TAB: 9,
    KEY_RETURN: 13,
    KEY_ESC: 27,
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,
    KEY_DELETE: 46,
    KEY_HOME: 36,
    KEY_END: 35,
    KEY_PAGEUP: 33,
    KEY_PAGEDOWN: 34,
    KEY_INSERT: 45,

    cache: {},
  };

  const docEl = document.documentElement;
  const MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED = 'onmouseenter' in docEl
    && 'onmouseleave' in docEl;

  let _isButton;
  if (Prototype.Browser.IE) {
    const buttonMap = { 0: 1, 1: 4, 2: 2 };
    _isButton = function (event, code) {
      return event.button === buttonMap[code];
    };
  } else if (Prototype.Browser.WebKit) {
    _isButton = function (event, code) {
      switch (code) {
        case 0: return event.which == 1 && !event.metaKey;
        case 1: return event.which == 1 && event.metaKey;
        default: return false;
      }
    };
  } else {
    _isButton = function (event, code) {
      return event.which ? (event.which === code + 1) : (event.button === code);
    };
  }

  function isLeftClick(event) { return _isButton(event, 0); }

  function isMiddleClick(event) { return _isButton(event, 1); }

  function isRightClick(event) { return _isButton(event, 2); }

  function element(event) {
    event = Event.extend(event);

    let node = event.target; const { type } = event;
    const { currentTarget } = event;

    if (currentTarget && currentTarget.tagName) {
      if (type === 'load' || type === 'error'
        || (type === 'click' && currentTarget.tagName.toLowerCase() === 'input'
          && currentTarget.type === 'radio')) node = currentTarget;
    }

    if (node.nodeType == Node.TEXT_NODE) node = node.parentNode;

    return Element.extend(node);
  }

  function findElement(event, expression) {
    const element = Event.element(event);
    if (!expression) return element;
    const elements = [element].concat(element.ancestors());
    return Selector.findElement(elements, expression, 0);
  }

  function pointer(event) {
    return { x: pointerX(event), y: pointerY(event) };
  }

  function pointerX(event) {
    const docElement = document.documentElement;
    const body = document.body || { scrollLeft: 0 };

    return event.pageX || (event.clientX
      + (docElement.scrollLeft || body.scrollLeft)
      - (docElement.clientLeft || 0));
  }

  function pointerY(event) {
    const docElement = document.documentElement;
    const body = document.body || { scrollTop: 0 };

    return event.pageY || (event.clientY
       + (docElement.scrollTop || body.scrollTop)
       - (docElement.clientTop || 0));
  }

  function stop(event) {
    Event.extend(event);
    event.preventDefault();
    event.stopPropagation();

    event.stopped = true;
  }

  Event.Methods = {
    isLeftClick,
    isMiddleClick,
    isRightClick,

    element,
    findElement,

    pointer,
    pointerX,
    pointerY,

    stop,
  };

  const methods = Object.keys(Event.Methods).inject({ }, (m, name) => {
    m[name] = Event.Methods[name].methodize();
    return m;
  });

  if (Prototype.Browser.IE) {
    function _relatedTarget(event) {
      let element;
      switch (event.type) {
        case 'mouseover': element = event.fromElement; break;
        case 'mouseout': element = event.toElement; break;
        default: return null;
      }
      return Element.extend(element);
    }

    Object.extend(methods, {
      stopPropagation() { this.cancelBubble = true; },
      preventDefault() { this.returnValue = false; },
      inspect() { return '[object Event]'; },
    });

    Event.extend = function (event, element) {
      if (!event) return false;
      if (event._extendedByPrototype) return event;

      event._extendedByPrototype = Prototype.emptyFunction;
      const pointer = Event.pointer(event);

      Object.extend(event, {
        target: event.srcElement || element,
        relatedTarget: _relatedTarget(event),
        pageX: pointer.x,
        pageY: pointer.y,
      });

      return Object.extend(event, methods);
    };
  } else {
    Event.prototype = window.Event.prototype || document.createEvent('HTMLEvents').__proto__;
    Object.extend(Event.prototype, methods);
    Event.extend = Prototype.K;
  }

  function _createResponder(element, eventName, handler) {
    let registry = Element.retrieve(element, 'prototype_event_registry');

    if (Object.isUndefined(registry)) {
      CACHE.push(element);
      registry = Element.retrieve(element, 'prototype_event_registry', $H());
    }

    let respondersForEvent = registry.get(eventName);
    if (Object.isUndefined(respondersForEvent)) {
      respondersForEvent = [];
      registry.set(eventName, respondersForEvent);
    }

    if (respondersForEvent.pluck('handler').include(handler)) return false;

    let responder;
    if (eventName.include(':')) {
      responder = function (event) {
        if (Object.isUndefined(event.eventName)) return false;

        if (event.eventName !== eventName) return false;

        Event.extend(event, element);
        handler.call(element, event);
      };
    } else if (!MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED
       && (eventName === 'mouseenter' || eventName === 'mouseleave')) {
      if (eventName === 'mouseenter' || eventName === 'mouseleave') {
        responder = function (event) {
          Event.extend(event, element);

          let parent = event.relatedTarget;
          while (parent && parent !== element) {
            try { parent = parent.parentNode; } catch (e) { parent = element; }
          }

          if (parent === element) return;

          handler.call(element, event);
        };
      }
    } else {
      responder = function (event) {
        Event.extend(event, element);
        handler.call(element, event);
      };
    }

    responder.handler = handler;
    respondersForEvent.push(responder);
    return responder;
  }

  function _destroyCache() {
    for (let i = 0, { length } = CACHE; i < length; i++) {
      Event.stopObserving(CACHE[i]);
      CACHE[i] = null;
    }
  }

  var CACHE = [];

  if (Prototype.Browser.IE) window.attachEvent('onunload', _destroyCache);

  if (Prototype.Browser.WebKit) window.addEventListener('unload', Prototype.emptyFunction, false);

  let _getDOMEventName = Prototype.K;

  if (!MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED) {
    _getDOMEventName = function (eventName) {
      const translations = { mouseenter: 'mouseover', mouseleave: 'mouseout' };
      return eventName in translations ? translations[eventName] : eventName;
    };
  }

  function observe(element, eventName, handler) {
    element = $(element);

    const responder = _createResponder(element, eventName, handler);

    if (!responder) return element;

    if (eventName.include(':')) {
      if (element.addEventListener) element.addEventListener('dataavailable', responder, false);
      else {
        element.attachEvent('ondataavailable', responder);
        element.attachEvent('onfilterchange', responder);
      }
    } else {
      const actualEventName = _getDOMEventName(eventName);

      if (element.addEventListener) element.addEventListener(actualEventName, responder, false);
      else element.attachEvent(`on${actualEventName}`, responder);
    }

    return element;
  }

  function stopObserving(element, eventName, handler) {
    element = $(element);

    const registry = Element.retrieve(element, 'prototype_event_registry');

    if (Object.isUndefined(registry)) return element;

    if (eventName && !handler) {
      var responders = registry.get(eventName);

      if (Object.isUndefined(responders)) return element;

      responders.each((r) => {
        Element.stopObserving(element, eventName, r.handler);
      });
      return element;
    } if (!eventName) {
      registry.each((pair) => {
        const eventName = pair.key; const
          responders = pair.value;

        responders.each((r) => {
          Element.stopObserving(element, eventName, r.handler);
        });
      });
      return element;
    }

    var responders = registry.get(eventName);

    if (!responders) return;

    const responder = responders.find((r) => r.handler === handler);
    if (!responder) return element;

    const actualEventName = _getDOMEventName(eventName);

    if (eventName.include(':')) {
      if (element.removeEventListener) element.removeEventListener('dataavailable', responder, false);
      else {
        element.detachEvent('ondataavailable', responder);
        element.detachEvent('onfilterchange', responder);
      }
    } else if (element.removeEventListener) element.removeEventListener(actualEventName, responder, false);
    else element.detachEvent(`on${actualEventName}`, responder);

    registry.set(eventName, responders.without(responder));

    return element;
  }

  function fire(element, eventName, memo, bubble) {
    element = $(element);

    if (Object.isUndefined(bubble)) bubble = true;

    if (element == document && document.createEvent && !element.dispatchEvent) element = document.documentElement;

    let event;
    if (document.createEvent) {
      event = document.createEvent('HTMLEvents');
      event.initEvent('dataavailable', true, true);
    } else {
      event = document.createEventObject();
      event.eventType = bubble ? 'ondataavailable' : 'onfilterchange';
    }

    event.eventName = eventName;
    event.memo = memo || { };

    if (document.createEvent) element.dispatchEvent(event);
    else element.fireEvent(event.eventType, event);

    return Event.extend(event);
  }

  Object.extend(Event, Event.Methods);

  Object.extend(Event, {
    fire,
    observe,
    stopObserving,
  });

  Element.addMethods({
    fire,

    observe,

    stopObserving,
  });

  Object.extend(document, {
    fire: fire.methodize(),

    observe: observe.methodize(),

    stopObserving: stopObserving.methodize(),

    loaded: false,
  });

  if (window.Event) Object.extend(window.Event, Event);
  else window.Event = Event;
}());

(function () {
  /* Support for the DOMContentLoaded event is based on work by Dan Webb,
     Matthias Miller, Dean Edwards, John Resig, and Diego Perini. */

  let timer;

  function fireContentLoadedEvent() {
    if (document.loaded) return;
    if (timer) window.clearTimeout(timer);
    document.loaded = true;
    document.fire('dom:loaded');
  }

  function checkReadyState() {
    if (document.readyState === 'complete') {
      document.stopObserving('readystatechange', checkReadyState);
      fireContentLoadedEvent();
    }
  }

  function pollDoScroll() {
    try { document.documentElement.doScroll('left'); } catch (e) {
      timer = pollDoScroll.defer();
      return;
    }
    fireContentLoadedEvent();
  }

  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
  } else {
    document.observe('readystatechange', checkReadyState);
    if (window == top) timer = pollDoScroll.defer();
  }

  Event.observe(window, 'load', fireContentLoadedEvent);
}());

Element.addMethods();

/* ------------------------------- DEPRECATED -------------------------------*/

Hash.toQueryString = Object.toQueryString;

const Toggle = { display: Element.toggle };

Element.Methods.childOf = Element.Methods.descendantOf;

const Insertion = {
  Before(element, content) {
    return Element.insert(element, { before: content });
  },

  Top(element, content) {
    return Element.insert(element, { top: content });
  },

  Bottom(element, content) {
    return Element.insert(element, { bottom: content });
  },

  After(element, content) {
    return Element.insert(element, { after: content });
  },
};

const $continue = new Error('"throw $continue" is deprecated, use "return" instead');

var Position = {
  includeScrollOffsets: false,

  prepare() {
    this.deltaX = window.pageXOffset
                || document.documentElement.scrollLeft
                || document.body.scrollLeft
                || 0;
    this.deltaY = window.pageYOffset
                || document.documentElement.scrollTop
                || document.body.scrollTop
                || 0;
  },

  within(element, x, y) {
    if (this.includeScrollOffsets) return this.withinIncludingScrolloffsets(element, x, y);
    this.xcomp = x;
    this.ycomp = y;
    this.offset = Element.cumulativeOffset(element);

    return (y >= this.offset[1]
            && y < this.offset[1] + element.offsetHeight
            && x >= this.offset[0]
            && x < this.offset[0] + element.offsetWidth);
  },

  withinIncludingScrolloffsets(element, x, y) {
    const offsetcache = Element.cumulativeScrollOffset(element);

    this.xcomp = x + offsetcache[0] - this.deltaX;
    this.ycomp = y + offsetcache[1] - this.deltaY;
    this.offset = Element.cumulativeOffset(element);

    return (this.ycomp >= this.offset[1]
            && this.ycomp < this.offset[1] + element.offsetHeight
            && this.xcomp >= this.offset[0]
            && this.xcomp < this.offset[0] + element.offsetWidth);
  },

  overlap(mode, element) {
    if (!mode) return 0;
    if (mode == 'vertical') {
      return ((this.offset[1] + element.offsetHeight) - this.ycomp)
        / element.offsetHeight;
    }
    if (mode == 'horizontal') {
      return ((this.offset[0] + element.offsetWidth) - this.xcomp)
        / element.offsetWidth;
    }
  },

  cumulativeOffset: Element.Methods.cumulativeOffset,

  positionedOffset: Element.Methods.positionedOffset,

  absolutize(element) {
    Position.prepare();
    return Element.absolutize(element);
  },

  relativize(element) {
    Position.prepare();
    return Element.relativize(element);
  },

  realOffset: Element.Methods.cumulativeScrollOffset,

  offsetParent: Element.Methods.getOffsetParent,

  page: Element.Methods.viewportOffset,

  clone(source, target, options) {
    options = options || { };
    return Element.clonePosition(target, source, options);
  },
};

/*--------------------------------------------------------------------------*/

if (!document.getElementsByClassName) {
  document.getElementsByClassName = (function (instanceMethods) {
    function iter(name) {
      return name.blank() ? null : `[contains(concat(' ', @class, ' '), ' ${name} ')]`;
    }

    instanceMethods.getElementsByClassName = Prototype.BrowserFeatures.XPath
      ? function (element, className) {
        className = className.toString().strip();
        const cond = /\s/.test(className) ? $w(className).map(iter).join('') : iter(className);
        return cond ? document._getElementsByXPath(`.//*${cond}`, element) : [];
      } : function (element, className) {
        className = className.toString().strip();
        const elements = []; const
          classNames = (/\s/.test(className) ? $w(className) : null);
        if (!classNames && !className) return elements;

        const nodes = $(element).getElementsByTagName('*');
        className = ` ${className} `;

        for (var i = 0, child, cn; child = nodes[i]; i++) {
          if (child.className && (cn = ` ${child.className} `) && (cn.include(className)
          || (classNames && classNames.all((name) => !name.toString().blank() && cn.include(` ${name} `))))) elements.push(Element.extend(child));
        }
        return elements;
      };

    return function (className, parentElement) {
      return $(parentElement || document.body).getElementsByClassName(className);
    };
  }(Element.Methods));
}

/*--------------------------------------------------------------------------*/

Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
  initialize(element) {
    this.element = $(element);
  },

  _each(iterator) {
    this.element.className.split(/\s+/).select((name) => name.length > 0)._each(iterator);
  },

  set(className) {
    this.element.className = className;
  },

  add(classNameToAdd) {
    if (this.include(classNameToAdd)) return;
    this.set($A(this).concat(classNameToAdd).join(' '));
  },

  remove(classNameToRemove) {
    if (!this.include(classNameToRemove)) return;
    this.set($A(this).without(classNameToRemove).join(' '));
  },

  toString() {
    return $A(this).join(' ');
  },
};

Object.extend(Element.ClassNames.prototype, Enumerable);

/*--------------------------------------------------------------------------*/
