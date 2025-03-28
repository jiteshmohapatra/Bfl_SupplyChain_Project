// ###############################################
//
// AUTHOR: Nick LaPrell (http://nick.laprell.org)
//
// Project Home: http://code.google.com/p/ezcookie/
//
// ###############################################

(function ($) {
  // Default options
  dOptions = {
    expires: 365,
    domain: '',
    secure: false,
    path: '/',
  };

  // Returns the cookie or null if it does not exist.
  $.cookie = function (cookieName) {
    let value = null;
    if (document.cookie && document.cookie != '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = jQuery.trim(cookies[i]);
        if (cookie.substring(0, cookieName.length + 1) == (`${cookieName}=`)) {
          value = decodeURIComponent(cookie.substring(cookieName.length + 1));
          break;
        }
      }
    }
    try {
      // Test for a JSON string and return the object
      return JSON.parse(value);
    } catch (e) {
      // or return the string
    	return value;
    }
  };

  $.subCookie = function (cookie, key) {
  	var cookie = $.cookie(cookie);
    if (!cookie || typeof cookie !== 'object') { return null; }
    return cookie[key];
  };

  // Write the defined value to the given cookie
  $.setCookie = function (cookieName, cookieValue, options) {
    // Combine defaults and passed options, if any
    var options = typeof options !== 'undefined' ? $.extend(dOptions, options) : dOptions;
    // Set cookie attributes based on options
    const path = `; path=${options.path}`;
    const domain = `; domain=${options.domain}`;
    const secure = options.secure ? '; secure' : '';
    if (cookieValue && (typeof cookieValue === 'function' || typeof cookieValue === 'object')) {
      cookieValue = JSON.stringify(cookieValue);
    }
    cookieValue = encodeURIComponent(cookieValue);
    let date;
    // Set expiration
    if (typeof options.expires === 'number') {
      date = new Date();
      date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
    } else {
      date = options.expires;
    }
    const expires = `; expires=${date.toUTCString()}`;
    // Write the cookie
    document.cookie = [cookieName, '=', cookieValue, expires, path, domain, secure].join('');
  };

  $.setSubCookie = function (cookie, key, value, options) {
  	var options = typeof options !== 'undefined' ? $.extend(dOptions, options) : dOptions;
    const existingCookie = $.cookie(cookie);
    const cookieObject = existingCookie && typeof existingCookie === 'object' ? existingCookie : {};
    cookieObject[key] = value;
    $.setCookie(cookie, cookieObject, options);
  };

  $.removeSubCookie = function (cookie, key) {
  	const cookieObject = $.cookie(cookie);
    if (cookieObject && typeof cookieObject === 'object' && typeof cookieObject[key] !== 'undefined') {
      delete cookieObject[key];
      $.setCookie(cookie, cookieObject);
    }
  };

  $.removeCookie = function (cookie) {
    $.setCookie(cookie, '', { expires: -1 });
  };

  $.clearCookie = function (cookie) {
    $.setCookie(cookie, '');
  };
}(jQuery));

// Begin minified json2.js library from json.org
// http://www.json.org/js.html
if (!this.JSON) { this.JSON = {}; }
(function () {
  function f(n) { return n < 10 ? `0${n}` : n; }
  if (typeof Date.prototype.toJSON !== 'function') {
    Date.prototype.toJSON = function (key) {
      return isFinite(this.valueOf()) ? `${this.getUTCFullYear()}-${
        f(this.getUTCMonth() + 1)}-${
        f(this.getUTCDate())}T${
        f(this.getUTCHours())}:${
        f(this.getUTCMinutes())}:${
        f(this.getUTCSeconds())}Z` : null;
    }; String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) { return this.valueOf(); };
  }
  const cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g; const escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g; let gap; let indent; const meta = {
    '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\',
  }; let rep; function quote(string) { escapable.lastIndex = 0; return escapable.test(string) ? `"${string.replace(escapable, (a) => { const c = meta[a]; return typeof c === 'string' ? c : `\\u${(`0000${a.charCodeAt(0).toString(16)}`).slice(-4)}`; })}"` : `"${string}"`; }
  function str(key, holder) {
    let i; let k; let v; let length; const mind = gap; let partial; let value = holder[key]; if (value && typeof value === 'object' && typeof value.toJSON === 'function') { value = value.toJSON(key); }
    if (typeof rep === 'function') { value = rep.call(holder, key, value); }
    switch (typeof value) {
      case 'string': return quote(value); case 'number': return isFinite(value) ? String(value) : 'null'; case 'boolean': case 'null': return String(value); case 'object': if (!value) { return 'null'; }
        gap += indent; partial = []; if (Object.prototype.toString.apply(value) === '[object Array]') {
          length = value.length; for (i = 0; i < length; i += 1) { partial[i] = str(i, value) || 'null'; }
          v = partial.length === 0 ? '[]' : gap ? `[\n${gap
          }${partial.join(`,\n${gap}`)}\n${
            mind}]` : `[${partial.join(',')}]`; gap = mind; return v;
        }
        if (rep && typeof rep === 'object') { length = rep.length; for (i = 0; i < length; i += 1) { k = rep[i]; if (typeof k === 'string') { v = str(k, value); if (v) { partial.push(quote(k) + (gap ? ': ' : ':') + v); } } } } else { for (k in value) { if (Object.hasOwnProperty.call(value, k)) { v = str(k, value); if (v) { partial.push(quote(k) + (gap ? ': ' : ':') + v); } } } }
        v = partial.length === 0 ? '{}' : gap ? `{\n${gap}${partial.join(`,\n${gap}`)}\n${
          mind}}` : `{${partial.join(',')}}`; gap = mind; return v;
    }
  }
  if (typeof JSON.stringify !== 'function') {
    JSON.stringify = function (value, replacer, space) {
      let i; gap = ''; indent = ''; if (typeof space === 'number') { for (i = 0; i < space; i += 1) { indent += ' '; } } else if (typeof space === 'string') { indent = space; }
      rep = replacer; if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) { throw new Error('JSON.stringify'); }
      return str('', { '': value });
    };
  }
  if (typeof JSON.parse !== 'function') {
    JSON.parse = function (text, reviver) {
      let j; function walk(holder, key) {
        let k; let v; const value = holder[key]; if (value && typeof value === 'object') { for (k in value) { if (Object.hasOwnProperty.call(value, k)) { v = walk(value, k); if (v !== undefined) { value[k] = v; } else { delete value[k]; } } } }
        return reviver.call(holder, key, value);
      }
      text = String(text); cx.lastIndex = 0; if (cx.test(text)) {
        text = text.replace(cx, (a) => `\\u${
          (`0000${a.charCodeAt(0).toString(16)}`).slice(-4)}`);
      }
      if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) { j = eval(`(${text})`); return typeof reviver === 'function' ? walk({ '': j }, '') : j; }
      throw new SyntaxError('JSON.parse');
    };
  }
}());
