/*!
 * jQuery JavaScript Library v1.4.4
 * http://jquery.com/
 *
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2010, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Thu Nov 11 19:04:53 2010 -0500
 */
(function (window, undefined) {
// Use the correct document accordingly with window argument (sandbox)
  const { document } = window;
  const jQuery = (function () {
    // Define a local copy of jQuery
    var jQuery = function (selector, context) {
      // The jQuery object is actually just the init constructor 'enhanced'
      return new jQuery.fn.init(selector, context);
    };

    // Map over jQuery in case of overwrite
    const _jQuery = window.jQuery;

    // Map over the $ in case of overwrite
    const _$ = window.$;

    // A central reference to the root jQuery(document)
    let rootjQuery;

    // A simple way to check for HTML strings or ID strings
    // (both of which we optimize for)
    const quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/;

    // Is it a simple selector
    const isSimple = /^.[^:#\[\.,]*$/;

    // Check if a string has a non-whitespace character in it
    const rnotwhite = /\S/;
    const rwhite = /\s/;

    // Used for trimming whitespace
    let trimLeft = /^\s+/;
    let trimRight = /\s+$/;

    // Check for non-word characters
    const rnonword = /\W/;

    // Check for digits
    const rdigit = /\d/;

    // Match a standalone tag
    const rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;

    // JSON RegExp
    const rvalidchars = /^[\],:{}\s]*$/;
    const rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    const rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    const rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;

    // Useragent RegExp
    const rwebkit = /(webkit)[ \/]([\w.]+)/;
    const ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/;
    const rmsie = /(msie) ([\w.]+)/;
    const rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;

    // Keep a UserAgent string for use with jQuery.browser
    const { userAgent } = navigator;

    // For matching the engine and version of the browser
    let browserMatch;

    // Has the ready events already been bound?
    let readyBound = false;

    // The functions to execute on DOM ready
    let readyList = [];

    // The ready event handler
    let DOMContentLoaded;

    // Save a reference to some core methods
    const { toString } = Object.prototype;
    const hasOwn = Object.prototype.hasOwnProperty;
    const { push } = Array.prototype;
    const { slice } = Array.prototype;
    const { trim } = String.prototype;
    const { indexOf } = Array.prototype;

    // [[Class]] -> type pairs
    const class2type = {};

    jQuery.fn = jQuery.prototype = {
      init(selector, context) {
        let match; let elem; let ret; let
          doc;

        // Handle $(""), $(null), or $(undefined)
        if (!selector) {
          return this;
        }

        // Handle $(DOMElement)
        if (selector.nodeType) {
          this.context = this[0] = selector;
          this.length = 1;
          return this;
        }

        // The body element only exists once, optimize finding it
        if (selector === 'body' && !context && document.body) {
          this.context = document;
          this[0] = document.body;
          this.selector = 'body';
          this.length = 1;
          return this;
        }

        // Handle HTML strings
        if (typeof selector === 'string') {
          // Are we dealing with HTML string or an ID?
          match = quickExpr.exec(selector);

          // Verify a match, and that no context was specified for #id
          if (match && (match[1] || !context)) {
            // HANDLE: $(html) -> $(array)
            if (match[1]) {
              doc = (context ? context.ownerDocument || context : document);

              // If a single string is passed in and it's a single tag
              // just do a createElement and skip the rest
              ret = rsingleTag.exec(selector);

              if (ret) {
                if (jQuery.isPlainObject(context)) {
                  selector = [document.createElement(ret[1])];
                  jQuery.fn.attr.call(selector, context, true);
                } else {
                  selector = [doc.createElement(ret[1])];
                }
              } else {
                ret = jQuery.buildFragment([match[1]], [doc]);
                selector = (ret.cacheable ? ret.fragment.cloneNode(true) : ret.fragment).childNodes;
              }

              return jQuery.merge(this, selector);

              // HANDLE: $("#id")
            }
            elem = document.getElementById(match[2]);

            // Check parentNode to catch when Blackberry 4.6 returns
            // nodes that are no longer in the document #6963
            if (elem && elem.parentNode) {
              // Handle the case where IE and Opera return items
              // by name instead of ID
              if (elem.id !== match[2]) {
                return rootjQuery.find(selector);
              }

              // Otherwise, we inject the element directly into the jQuery object
              this.length = 1;
              this[0] = elem;
            }

            this.context = document;
            this.selector = selector;
            return this;

            // HANDLE: $("TAG")
          } if (!context && !rnonword.test(selector)) {
            this.selector = selector;
            this.context = document;
            selector = document.getElementsByTagName(selector);
            return jQuery.merge(this, selector);

            // HANDLE: $(expr, $(...))
          } if (!context || context.jquery) {
            return (context || rootjQuery).find(selector);

            // HANDLE: $(expr, context)
            // (which is just equivalent to: $(context).find(expr)
          }
          return jQuery(context).find(selector);

          // HANDLE: $(function)
          // Shortcut for document ready
        } if (jQuery.isFunction(selector)) {
          return rootjQuery.ready(selector);
        }

        if (selector.selector !== undefined) {
          this.selector = selector.selector;
          this.context = selector.context;
        }

        return jQuery.makeArray(selector, this);
      },

      // Start with an empty selector
      selector: '',

      // The current version of jQuery being used
      jquery: '1.4.4',

      // The default length of a jQuery object is 0
      length: 0,

      // The number of elements contained in the matched element set
      size() {
        return this.length;
      },

      toArray() {
        return slice.call(this, 0);
      },

      // Get the Nth element in the matched element set OR
      // Get the whole matched element set as a clean array
      get(num) {
        return num == null

        // Return a 'clean' array
          ? this.toArray()

        // Return just the object
          : (num < 0 ? this.slice(num)[0] : this[num]);
      },

      // Take an array of elements and push it onto the stack
      // (returning the new matched element set)
      pushStack(elems, name, selector) {
        // Build a new jQuery matched element set
        const ret = jQuery();

        if (jQuery.isArray(elems)) {
          push.apply(ret, elems);
        } else {
          jQuery.merge(ret, elems);
        }

        // Add the old object onto the stack (as a reference)
        ret.prevObject = this;

        ret.context = this.context;

        if (name === 'find') {
          ret.selector = this.selector + (this.selector ? ' ' : '') + selector;
        } else if (name) {
          ret.selector = `${this.selector}.${name}(${selector})`;
        }

        // Return the newly-formed element set
        return ret;
      },

      // Execute a callback for every element in the matched set.
      // (You can seed the arguments with an array of args, but this is
      // only used internally.)
      each(callback, args) {
        return jQuery.each(this, callback, args);
      },

      ready(fn) {
        // Attach the listeners
        jQuery.bindReady();

        // If the DOM is already ready
        if (jQuery.isReady) {
          // Execute the function immediately
          fn.call(document, jQuery);

          // Otherwise, remember the function for later
        } else if (readyList) {
          // Add the function to the wait list
          readyList.push(fn);
        }

        return this;
      },

      eq(i) {
        return i === -1
          ? this.slice(i)
          : this.slice(i, +i + 1);
      },

      first() {
        return this.eq(0);
      },

      last() {
        return this.eq(-1);
      },

      slice() {
        return this.pushStack(slice.apply(this, arguments),
          'slice', slice.call(arguments).join(','));
      },

      map(callback) {
        return this.pushStack(jQuery.map(this, (elem, i) => callback.call(elem, i, elem)));
      },

      end() {
        return this.prevObject || jQuery(null);
      },

      // For internal use only.
      // Behaves like an Array's method, not like a jQuery method.
      push,
      sort: [].sort,
      splice: [].splice,
    };

    // Give the init function the jQuery prototype for later instantiation
    jQuery.fn.init.prototype = jQuery.fn;

    jQuery.extend = jQuery.fn.extend = function () {
	 let options; let name; let src; let copy; let copyIsArray; let clone;
      let target = arguments[0] || {};
      let i = 1;
      const { length } = arguments;
      let deep = false;

      // Handle a deep copy situation
      if (typeof target === 'boolean') {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2;
      }

      // Handle case when target is a string or something (possible in deep copy)
      if (typeof target !== 'object' && !jQuery.isFunction(target)) {
        target = {};
      }

      // extend jQuery itself if only one argument is passed
      if (length === i) {
        target = this;
        --i;
      }

      for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {
          // Extend the base object
          for (name in options) {
            src = target[name];
            copy = options[name];

            // Prevent never-ending loop
            if (target === copy) {
              continue;
            }

            // Recurse if we're merging plain objects or arrays
            if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
              if (copyIsArray) {
                copyIsArray = false;
                clone = src && jQuery.isArray(src) ? src : [];
              } else {
                clone = src && jQuery.isPlainObject(src) ? src : {};
              }

              // Never move original objects, clone them
              target[name] = jQuery.extend(deep, clone, copy);

              // Don't bring in undefined values
            } else if (copy !== undefined) {
              target[name] = copy;
            }
          }
        }
      }

      // Return the modified object
      return target;
    };

    jQuery.extend({
      noConflict(deep) {
        window.$ = _$;

        if (deep) {
          window.jQuery = _jQuery;
        }

        return jQuery;
      },

      // Is the DOM ready to be used? Set to true once it occurs.
      isReady: false,

      // A counter to track how many items to wait for before
      // the ready event fires. See #6781
      readyWait: 1,

      // Handle when the DOM is ready
      ready(wait) {
        // A third-party is pushing the ready event forwards
        if (wait === true) {
          jQuery.readyWait--;
        }

        // Make sure that the DOM is not already loaded
        if (!jQuery.readyWait || (wait !== true && !jQuery.isReady)) {
          // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
          if (!document.body) {
            return setTimeout(jQuery.ready, 1);
          }

          // Remember that the DOM is ready
          jQuery.isReady = true;

          // If a normal DOM Ready event fired, decrement, and wait if need be
          if (wait !== true && --jQuery.readyWait > 0) {
            return;
          }

          // If there are functions bound, to execute
          if (readyList) {
            // Execute all of them
            let fn;
            let i = 0;
            const ready = readyList;

            // Reset the list of functions
            readyList = null;

            while ((fn = ready[i++])) {
              fn.call(document, jQuery);
            }

            // Trigger any bound ready events
            if (jQuery.fn.trigger) {
              jQuery(document).trigger('ready').unbind('ready');
            }
          }
        }
      },

      bindReady() {
        if (readyBound) {
          return;
        }

        readyBound = true;

        // Catch cases where $(document).ready() is called after the
        // browser event has already occurred.
        if (document.readyState === 'complete') {
          // Handle it asynchronously to allow scripts the opportunity to delay ready
          return setTimeout(jQuery.ready, 1);
        }

        // Mozilla, Opera and webkit nightlies currently support this event
        if (document.addEventListener) {
          // Use the handy event callback
          document.addEventListener('DOMContentLoaded', DOMContentLoaded, false);

          // A fallback to window.onload, that will always work
          window.addEventListener('load', jQuery.ready, false);

          // If IE event model is used
        } else if (document.attachEvent) {
          // ensure firing before onload,
          // maybe late but safe also for iframes
          document.attachEvent('onreadystatechange', DOMContentLoaded);

          // A fallback to window.onload, that will always work
          window.attachEvent('onload', jQuery.ready);

          // If IE and not a frame
          // continually check to see if the document is ready
          let toplevel = false;

          try {
            toplevel = window.frameElement == null;
          } catch (e) {}

          if (document.documentElement.doScroll && toplevel) {
            doScrollCheck();
          }
        }
      },

      // See test/unit/core.js for details concerning isFunction.
      // Since version 1.3, DOM methods and functions like alert
      // aren't supported. They return false on IE (#2968).
      isFunction(obj) {
        return jQuery.type(obj) === 'function';
      },

      isArray: Array.isArray || function (obj) {
        return jQuery.type(obj) === 'array';
      },

      // A crude way of determining if an object is a window
      isWindow(obj) {
        return obj && typeof obj === 'object' && 'setInterval' in obj;
      },

      isNaN(obj) {
        return obj == null || !rdigit.test(obj) || isNaN(obj);
      },

      type(obj) {
        return obj == null
          ? String(obj)
          : class2type[toString.call(obj)] || 'object';
      },

      isPlainObject(obj) {
        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor property.
        // Make sure that DOM nodes and window objects don't pass through, as well
        if (!obj || jQuery.type(obj) !== 'object' || obj.nodeType || jQuery.isWindow(obj)) {
          return false;
        }

        // Not own constructor property must be Object
        if (obj.constructor
			&& !hasOwn.call(obj, 'constructor')
			&& !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
          return false;
        }

        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.

        let key;
        for (key in obj) {}

        return key === undefined || hasOwn.call(obj, key);
      },

      isEmptyObject(obj) {
        for (const name in obj) {
          return false;
        }
        return true;
      },

      error(msg) {
        throw msg;
      },

      parseJSON(data) {
        if (typeof data !== 'string' || !data) {
          return null;
        }

        // Make sure leading/trailing whitespace is removed (IE can't handle it)
        data = jQuery.trim(data);

        // Make sure the incoming data is actual JSON
        // Logic borrowed from http://json.org/json2.js
        if (rvalidchars.test(data.replace(rvalidescape, '@')
          .replace(rvalidtokens, ']')
          .replace(rvalidbraces, ''))) {
          // Try to use the native JSON parser first
          return window.JSON && window.JSON.parse
            ? window.JSON.parse(data)
            : (new Function(`return ${data}`))();
        }
        jQuery.error(`Invalid JSON: ${data}`);
      },

      noop() {},

      // Evalulates a script in a global context
      globalEval(data) {
        if (data && rnotwhite.test(data)) {
          // Inspired by code by Andrea Giammarchi
          // http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
          const head = document.getElementsByTagName('head')[0] || document.documentElement;
          const script = document.createElement('script');

          script.type = 'text/javascript';

          if (jQuery.support.scriptEval) {
            script.appendChild(document.createTextNode(data));
          } else {
            script.text = data;
          }

          // Use insertBefore instead of appendChild to circumvent an IE6 bug.
          // This arises when a base node is used (#2709).
          head.insertBefore(script, head.firstChild);
          head.removeChild(script);
        }
      },

      nodeName(elem, name) {
        return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
      },

      // args is for internal usage only
      each(object, callback, args) {
        let name; let i = 0;
        const { length } = object;
        const isObj = length === undefined || jQuery.isFunction(object);

        if (args) {
          if (isObj) {
            for (name in object) {
              if (callback.apply(object[name], args) === false) {
                break;
              }
            }
          } else {
            for (; i < length;) {
              if (callback.apply(object[i++], args) === false) {
                break;
              }
            }
          }

          // A special, fast, case for the most common use of each
        } else if (isObj) {
          for (name in object) {
            if (callback.call(object[name], name, object[name]) === false) {
              break;
            }
          }
        } else {
          for (let value = object[0];
            i < length && callback.call(value, i, value) !== false; value = object[++i]) {}
        }

        return object;
      },

      // Use native String.trim function wherever possible
      trim: trim
        ? function (text) {
          return text == null
            ? ''
            : trim.call(text);
        }

      // Otherwise use our own trimming functionality
        : function (text) {
          return text == null
            ? ''
            : text.toString().replace(trimLeft, '').replace(trimRight, '');
        },

      // results is for internal usage only
      makeArray(array, results) {
        const ret = results || [];

        if (array != null) {
          // The window, strings (and functions) also have 'length'
          // The extra typeof function check is to prevent crashes
          // in Safari 2 (See: #3039)
          // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
          const type = jQuery.type(array);

          if (array.length == null || type === 'string' || type === 'function' || type === 'regexp' || jQuery.isWindow(array)) {
            push.call(ret, array);
          } else {
            jQuery.merge(ret, array);
          }
        }

        return ret;
      },

      inArray(elem, array) {
        if (array.indexOf) {
          return array.indexOf(elem);
        }

        for (let i = 0, { length } = array; i < length; i++) {
          if (array[i] === elem) {
            return i;
          }
        }

        return -1;
      },

      merge(first, second) {
        let i = first.length;
        let j = 0;

        if (typeof second.length === 'number') {
          for (let l = second.length; j < l; j++) {
            first[i++] = second[j];
          }
        } else {
          while (second[j] !== undefined) {
            first[i++] = second[j++];
          }
        }

        first.length = i;

        return first;
      },

      grep(elems, callback, inv) {
        const ret = []; let
          retVal;
        inv = !!inv;

        // Go through the array, only saving the items
        // that pass the validator function
        for (let i = 0, { length } = elems; i < length; i++) {
          retVal = !!callback(elems[i], i);
          if (inv !== retVal) {
            ret.push(elems[i]);
          }
        }

        return ret;
      },

      // arg is for internal usage only
      map(elems, callback, arg) {
        const ret = []; let
          value;

        // Go through the array, translating each of the items to their
        // new value (or values).
        for (let i = 0, { length } = elems; i < length; i++) {
          value = callback(elems[i], i, arg);

          if (value != null) {
            ret[ret.length] = value;
          }
        }

        return ret.concat.apply([], ret);
      },

      // A global GUID counter for objects
      guid: 1,

      proxy(fn, proxy, thisObject) {
        if (arguments.length === 2) {
          if (typeof proxy === 'string') {
            thisObject = fn;
            fn = thisObject[proxy];
            proxy = undefined;
          } else if (proxy && !jQuery.isFunction(proxy)) {
            thisObject = proxy;
            proxy = undefined;
          }
        }

        if (!proxy && fn) {
          proxy = function () {
            return fn.apply(thisObject || this, arguments);
          };
        }

        // Set the guid of unique handler to the same of original handler, so it can be removed
        if (fn) {
          proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
        }

        // So proxy can be declared as an argument
        return proxy;
      },

      // Mutifunctional method to get and set values to a collection
      // The value/s can be optionally by executed if its a function
      access(elems, key, value, exec, fn, pass) {
        const { length } = elems;

        // Setting many attributes
        if (typeof key === 'object') {
          for (const k in key) {
            jQuery.access(elems, k, key[k], exec, fn, value);
          }
          return elems;
        }

        // Setting one attribute
        if (value !== undefined) {
          // Optionally, function values get executed if exec is true
          exec = !pass && exec && jQuery.isFunction(value);

          for (let i = 0; i < length; i++) {
            fn(elems[i], key, exec ? value.call(elems[i], i, fn(elems[i], key)) : value, pass);
          }

          return elems;
        }

        // Getting an attribute
        return length ? fn(elems[0], key) : undefined;
      },

      now() {
        return (new Date()).getTime();
      },

      // Use of jQuery.browser is frowned upon.
      // More details: http://docs.jquery.com/Utilities/jQuery.browser
      uaMatch(ua) {
        ua = ua.toLowerCase();

        const match = rwebkit.exec(ua)
			|| ropera.exec(ua)
			|| rmsie.exec(ua)
			|| ua.indexOf('compatible') < 0 && rmozilla.exec(ua)
			|| [];

        return { browser: match[1] || '', version: match[2] || '0' };
      },

      browser: {},
    });

    // Populate the class2type map
    jQuery.each('Boolean Number String Function Array Date RegExp Object'.split(' '), (i, name) => {
      class2type[`[object ${name}]`] = name.toLowerCase();
    });

    browserMatch = jQuery.uaMatch(userAgent);
    if (browserMatch.browser) {
      jQuery.browser[browserMatch.browser] = true;
      jQuery.browser.version = browserMatch.version;
    }

    // Deprecated, use jQuery.browser.webkit instead
    if (jQuery.browser.webkit) {
      jQuery.browser.safari = true;
    }

    if (indexOf) {
      jQuery.inArray = function (elem, array) {
        return indexOf.call(array, elem);
      };
    }

    // Verify that \s matches non-breaking spaces
    // (IE fails on this test)
    if (!rwhite.test('\xA0')) {
      trimLeft = /^[\s\xA0]+/;
      trimRight = /[\s\xA0]+$/;
    }

    // All jQuery objects should point back to these
    rootjQuery = jQuery(document);

    // Cleanup functions for the document ready method
    if (document.addEventListener) {
      DOMContentLoaded = function () {
        document.removeEventListener('DOMContentLoaded', DOMContentLoaded, false);
        jQuery.ready();
      };
    } else if (document.attachEvent) {
      DOMContentLoaded = function () {
        // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
        if (document.readyState === 'complete') {
          document.detachEvent('onreadystatechange', DOMContentLoaded);
          jQuery.ready();
        }
      };
    }

    // The DOM ready check for Internet Explorer
    function doScrollCheck() {
      if (jQuery.isReady) {
        return;
      }

      try {
        // If IE is used, use the trick by Diego Perini
        // http://javascript.nwbox.com/IEContentLoaded/
        document.documentElement.doScroll('left');
      } catch (e) {
        setTimeout(doScrollCheck, 1);
        return;
      }

      // and execute any waiting functions
      jQuery.ready();
    }

    // Expose jQuery to the global object
    return (window.jQuery = window.$ = jQuery);
  }());

  (function () {
    jQuery.support = {};

    let root = document.documentElement;
    let script = document.createElement('script');
    let div = document.createElement('div');
    const id = `script${jQuery.now()}`;

    div.style.display = 'none';
    div.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

    let all = div.getElementsByTagName('*');
    let a = div.getElementsByTagName('a')[0];
    const select = document.createElement('select');
    const opt = select.appendChild(document.createElement('option'));

    // Can't get basic test support
    if (!all || !all.length || !a) {
      return;
    }

    jQuery.support = {
      // IE strips leading whitespace when .innerHTML is used
      leadingWhitespace: div.firstChild.nodeType === 3,

      // Make sure that tbody elements aren't automatically inserted
      // IE will insert them into empty tables
      tbody: !div.getElementsByTagName('tbody').length,

      // Make sure that link elements get serialized correctly by innerHTML
      // This requires a wrapper element in IE
      htmlSerialize: !!div.getElementsByTagName('link').length,

      // Get the style information from getAttribute
      // (IE uses .cssText insted)
      style: /red/.test(a.getAttribute('style')),

      // Make sure that URLs aren't manipulated
      // (IE normalizes it by default)
      hrefNormalized: a.getAttribute('href') === '/a',

      // Make sure that element opacity exists
      // (IE uses filter instead)
      // Use a regex to work around a WebKit issue. See #5145
      opacity: /^0.55$/.test(a.style.opacity),

      // Verify style float existence
      // (IE uses styleFloat instead of cssFloat)
      cssFloat: !!a.style.cssFloat,

      // Make sure that if no value is specified for a checkbox
      // that it defaults to "on".
      // (WebKit defaults to "" instead)
      checkOn: div.getElementsByTagName('input')[0].value === 'on',

      // Make sure that a selected-by-default option has a working selected property.
      // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
      optSelected: opt.selected,

      // Will be defined later
      deleteExpando: true,
      optDisabled: false,
      checkClone: false,
      scriptEval: false,
      noCloneEvent: true,
      boxModel: null,
      inlineBlockNeedsLayout: false,
      shrinkWrapBlocks: false,
      reliableHiddenOffsets: true,
    };

    // Make sure that the options inside disabled selects aren't marked as disabled
    // (WebKit marks them as diabled)
    select.disabled = true;
    jQuery.support.optDisabled = !opt.disabled;

    script.type = 'text/javascript';
    try {
      script.appendChild(document.createTextNode(`window.${id}=1;`));
    } catch (e) {}

    root.insertBefore(script, root.firstChild);

    // Make sure that the execution of code works by injecting a script
    // tag with appendChild/createTextNode
    // (IE doesn't support this, fails, and uses .text instead)
    if (window[id]) {
      jQuery.support.scriptEval = true;
      delete window[id];
    }

    // Test to see if it's possible to delete an expando from an element
    // Fails in Internet Explorer
    try {
      delete script.test;
    } catch (e) {
      jQuery.support.deleteExpando = false;
    }

    root.removeChild(script);

    if (div.attachEvent && div.fireEvent) {
      div.attachEvent('onclick', function click() {
        // Cloning a node shouldn't copy over any
        // bound event handlers (IE does this)
        jQuery.support.noCloneEvent = false;
        div.detachEvent('onclick', click);
      });
      div.cloneNode(true).fireEvent('onclick');
    }

    div = document.createElement('div');
    div.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";

    const fragment = document.createDocumentFragment();
    fragment.appendChild(div.firstChild);

    // WebKit doesn't clone checked state correctly in fragments
    jQuery.support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

    // Figure out if the W3C box model works as expected
    // document.body must exist before we can do this
    jQuery(() => {
      let div = document.createElement('div');
      div.style.width = div.style.paddingLeft = '1px';

      document.body.appendChild(div);
      jQuery.boxModel = jQuery.support.boxModel = div.offsetWidth === 2;

      if ('zoom' in div.style) {
        // Check if natively block-level elements act like inline-block
        // elements when setting their display to 'inline' and giving
        // them layout
        // (IE < 8 does this)
        div.style.display = 'inline';
        div.style.zoom = 1;
        jQuery.support.inlineBlockNeedsLayout = div.offsetWidth === 2;

        // Check if elements with layout shrink-wrap their children
        // (IE 6 does this)
        div.style.display = '';
        div.innerHTML = "<div style='width:4px;'></div>";
        jQuery.support.shrinkWrapBlocks = div.offsetWidth !== 2;
      }

      div.innerHTML = "<table><tr><td style='padding:0;display:none'></td><td>t</td></tr></table>";
      let tds = div.getElementsByTagName('td');

      // Check if table cells still have offsetWidth/Height when they are set
      // to display:none and there are still other visible table cells in a
      // table row; if so, offsetWidth/Height are not reliable for use when
      // determining if an element has been hidden directly using
      // display:none (it is still safe to use offsets if a parent element is
      // hidden; don safety goggles and see bug #4512 for more information).
      // (only IE 8 fails this test)
      jQuery.support.reliableHiddenOffsets = tds[0].offsetHeight === 0;

      tds[0].style.display = '';
      tds[1].style.display = 'none';

      // Check if empty table cells still have offsetWidth/Height
      // (IE < 8 fail this test)
      jQuery.support.reliableHiddenOffsets = jQuery.support.reliableHiddenOffsets && tds[0].offsetHeight === 0;
      div.innerHTML = '';

      document.body.removeChild(div).style.display = 'none';
      div = tds = null;
    });

    // Technique from Juriy Zaytsev
    // http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
    const eventSupported = function (eventName) {
      let el = document.createElement('div');
      eventName = `on${eventName}`;

      let isSupported = (eventName in el);
      if (!isSupported) {
        el.setAttribute(eventName, 'return;');
        isSupported = typeof el[eventName] === 'function';
      }
      el = null;

      return isSupported;
    };

    jQuery.support.submitBubbles = eventSupported('submit');
    jQuery.support.changeBubbles = eventSupported('change');

    // release memory in IE
    root = script = div = all = a = null;
  }());

  const windowData = {};
  const rbrace = /^(?:\{.*\}|\[.*\])$/;

  jQuery.extend({
    cache: {},

    // Please use with caution
    uuid: 0,

    // Unique for each copy of jQuery on the page
    expando: `jQuery${jQuery.now()}`,

    // The following elements throw uncatchable exceptions if you
    // attempt to add expando properties to them.
    noData: {
      embed: true,
      // Ban all objects except for Flash (which handle expandos)
      object: 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000',
      applet: true,
    },

    data(elem, name, data) {
      if (!jQuery.acceptData(elem)) {
        return;
      }

      elem = elem == window
        ? windowData
        : elem;

      const isNode = elem.nodeType;
      let id = isNode ? elem[jQuery.expando] : null;
      let { cache } = jQuery; let
        thisCache;

      if (isNode && !id && typeof name === 'string' && data === undefined) {
        return;
      }

      // Get the data from the object directly
      if (!isNode) {
        cache = elem;

        // Compute a unique ID for the element
      } else if (!id) {
        elem[jQuery.expando] = id = ++jQuery.uuid;
      }

      // Avoid generating a new cache unless none exists and we
      // want to manipulate it.
      if (typeof name === 'object') {
        if (isNode) {
          cache[id] = jQuery.extend(cache[id], name);
        } else {
          jQuery.extend(cache, name);
        }
      } else if (isNode && !cache[id]) {
        cache[id] = {};
      }

      thisCache = isNode ? cache[id] : cache;

      // Prevent overriding the named cache with undefined values
      if (data !== undefined) {
        thisCache[name] = data;
      }

      return typeof name === 'string' ? thisCache[name] : thisCache;
    },

    removeData(elem, name) {
      if (!jQuery.acceptData(elem)) {
        return;
      }

      elem = elem == window
        ? windowData
        : elem;

      const isNode = elem.nodeType;
      const id = isNode ? elem[jQuery.expando] : elem;
      const { cache } = jQuery;
      const thisCache = isNode ? cache[id] : id;

      // If we want to remove a specific section of the element's data
      if (name) {
        if (thisCache) {
          // Remove the section of cache data
          delete thisCache[name];

          // If we've removed all the data, remove the element's cache
          if (isNode && jQuery.isEmptyObject(thisCache)) {
            jQuery.removeData(elem);
          }
        }

        // Otherwise, we want to remove all of the element's data
      } else if (isNode && jQuery.support.deleteExpando) {
        delete elem[jQuery.expando];
      } else if (elem.removeAttribute) {
        elem.removeAttribute(jQuery.expando);

        // Completely remove the data cache
      } else if (isNode) {
        delete cache[id];

        // Remove all fields from the object
      } else {
        for (const n in elem) {
          delete elem[n];
        }
      }
    },

    // A method for determining if a DOM node can handle the data expando
    acceptData(elem) {
      if (elem.nodeName) {
        const match = jQuery.noData[elem.nodeName.toLowerCase()];

        if (match) {
          return !(match === true || elem.getAttribute('classid') !== match);
        }
      }

      return true;
    },
  });

  jQuery.fn.extend({
    data(key, value) {
      let data = null;

      if (typeof key === 'undefined') {
        if (this.length) {
          const attr = this[0].attributes; let
            name;
          data = jQuery.data(this[0]);

          for (let i = 0, l = attr.length; i < l; i++) {
            name = attr[i].name;

            if (name.indexOf('data-') === 0) {
              name = name.substr(5);
              dataAttr(this[0], name, data[name]);
            }
          }
        }

        return data;
      } if (typeof key === 'object') {
        return this.each(function () {
          jQuery.data(this, key);
        });
      }

      const parts = key.split('.');
      parts[1] = parts[1] ? `.${parts[1]}` : '';

      if (value === undefined) {
        data = this.triggerHandler(`getData${parts[1]}!`, [parts[0]]);

        // Try to fetch any internally stored data first
        if (data === undefined && this.length) {
          data = jQuery.data(this[0], key);
          data = dataAttr(this[0], key, data);
        }

        return data === undefined && parts[1]
          ? this.data(parts[0])
          : data;
      }
      return this.each(function () {
        const $this = jQuery(this);
        const args = [parts[0], value];

        $this.triggerHandler(`setData${parts[1]}!`, args);
        jQuery.data(this, key, value);
        $this.triggerHandler(`changeData${parts[1]}!`, args);
      });
    },

    removeData(key) {
      return this.each(function () {
        jQuery.removeData(this, key);
      });
    },
  });

  function dataAttr(elem, key, data) {
    // If nothing was found internally, try to fetch any
    // data from the HTML5 data-* attribute
    if (data === undefined && elem.nodeType === 1) {
      data = elem.getAttribute(`data-${key}`);

      if (typeof data === 'string') {
        try {
          data = data === 'true' ? true
            : data === 'false' ? false
              : data === 'null' ? null
                : !jQuery.isNaN(data) ? parseFloat(data)
                  : rbrace.test(data) ? jQuery.parseJSON(data)
                    : data;
        } catch (e) {}

        // Make sure we set the data so it isn't changed later
        jQuery.data(elem, key, data);
      } else {
        data = undefined;
      }
    }

    return data;
  }

  jQuery.extend({
    queue(elem, type, data) {
      if (!elem) {
        return;
      }

      type = `${type || 'fx'}queue`;
      let q = jQuery.data(elem, type);

      // Speed up dequeue by getting out quickly if this is just a lookup
      if (!data) {
        return q || [];
      }

      if (!q || jQuery.isArray(data)) {
        q = jQuery.data(elem, type, jQuery.makeArray(data));
      } else {
        q.push(data);
      }

      return q;
    },

    dequeue(elem, type) {
      type = type || 'fx';

      const queue = jQuery.queue(elem, type);
      let fn = queue.shift();

      // If the fx queue is dequeued, always remove the progress sentinel
      if (fn === 'inprogress') {
        fn = queue.shift();
      }

      if (fn) {
        // Add a progress sentinel to prevent the fx queue from being
        // automatically dequeued
        if (type === 'fx') {
          queue.unshift('inprogress');
        }

        fn.call(elem, () => {
          jQuery.dequeue(elem, type);
        });
      }
    },
  });

  jQuery.fn.extend({
    queue(type, data) {
      if (typeof type !== 'string') {
        data = type;
        type = 'fx';
      }

      if (data === undefined) {
        return jQuery.queue(this[0], type);
      }
      return this.each(function (i) {
        const queue = jQuery.queue(this, type, data);

        if (type === 'fx' && queue[0] !== 'inprogress') {
          jQuery.dequeue(this, type);
        }
      });
    },
    dequeue(type) {
      return this.each(function () {
        jQuery.dequeue(this, type);
      });
    },

    // Based off of the plugin by Clint Helfers, with permission.
    // http://blindsignals.com/index.php/2009/07/jquery-delay/
    delay(time, type) {
      time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
      type = type || 'fx';

      return this.queue(type, function () {
        const elem = this;
        setTimeout(() => {
          jQuery.dequeue(elem, type);
        }, time);
      });
    },

    clearQueue(type) {
      return this.queue(type || 'fx', []);
    },
  });

  const rclass = /[\n\t]/g;
  const rspaces = /\s+/;
  const rreturn = /\r/g;
  const rspecialurl = /^(?:href|src|style)$/;
  const rtype = /^(?:button|input)$/i;
  const rfocusable = /^(?:button|input|object|select|textarea)$/i;
  const rclickable = /^a(?:rea)?$/i;
  const rradiocheck = /^(?:radio|checkbox)$/i;

  jQuery.props = {
    for: 'htmlFor',
    class: 'className',
    readonly: 'readOnly',
    maxlength: 'maxLength',
    cellspacing: 'cellSpacing',
    rowspan: 'rowSpan',
    colspan: 'colSpan',
    tabindex: 'tabIndex',
    usemap: 'useMap',
    frameborder: 'frameBorder',
  };

  jQuery.fn.extend({
    attr(name, value) {
      return jQuery.access(this, name, value, true, jQuery.attr);
    },

    removeAttr(name, fn) {
      return this.each(function () {
        jQuery.attr(this, name, '');
        if (this.nodeType === 1) {
          this.removeAttribute(name);
        }
      });
    },

    addClass(value) {
      if (jQuery.isFunction(value)) {
        return this.each(function (i) {
          const self = jQuery(this);
          self.addClass(value.call(this, i, self.attr('class')));
        });
      }

      if (value && typeof value === 'string') {
        const classNames = (value || '').split(rspaces);

        for (let i = 0, l = this.length; i < l; i++) {
          const elem = this[i];

          if (elem.nodeType === 1) {
            if (!elem.className) {
              elem.className = value;
            } else {
              const className = ` ${elem.className} `;
              let setClass = elem.className;

              for (let c = 0, cl = classNames.length; c < cl; c++) {
                if (className.indexOf(` ${classNames[c]} `) < 0) {
                  setClass += ` ${classNames[c]}`;
                }
              }
              elem.className = jQuery.trim(setClass);
            }
          }
        }
      }

      return this;
    },

    removeClass(value) {
      if (jQuery.isFunction(value)) {
        return this.each(function (i) {
          const self = jQuery(this);
          self.removeClass(value.call(this, i, self.attr('class')));
        });
      }

      if ((value && typeof value === 'string') || value === undefined) {
        const classNames = (value || '').split(rspaces);

        for (let i = 0, l = this.length; i < l; i++) {
          const elem = this[i];

          if (elem.nodeType === 1 && elem.className) {
            if (value) {
              let className = (` ${elem.className} `).replace(rclass, ' ');
              for (let c = 0, cl = classNames.length; c < cl; c++) {
                className = className.replace(` ${classNames[c]} `, ' ');
              }
              elem.className = jQuery.trim(className);
            } else {
              elem.className = '';
            }
          }
        }
      }

      return this;
    },

    toggleClass(value, stateVal) {
      const type = typeof value;
      const isBool = typeof stateVal === 'boolean';

      if (jQuery.isFunction(value)) {
        return this.each(function (i) {
          const self = jQuery(this);
          self.toggleClass(value.call(this, i, self.attr('class'), stateVal), stateVal);
        });
      }

      return this.each(function () {
        if (type === 'string') {
          // toggle individual class names
          let className;
          let i = 0;
          const self = jQuery(this);
          let state = stateVal;
          const classNames = value.split(rspaces);

          while ((className = classNames[i++])) {
            // check each className given, space seperated list
            state = isBool ? state : !self.hasClass(className);
            self[state ? 'addClass' : 'removeClass'](className);
          }
        } else if (type === 'undefined' || type === 'boolean') {
          if (this.className) {
            // store className if set
            jQuery.data(this, '__className__', this.className);
          }

          // toggle whole className
          this.className = this.className || value === false ? '' : jQuery.data(this, '__className__') || '';
        }
      });
    },

    hasClass(selector) {
      const className = ` ${selector} `;
      for (let i = 0, l = this.length; i < l; i++) {
        if ((` ${this[i].className} `).replace(rclass, ' ').indexOf(className) > -1) {
          return true;
        }
      }

      return false;
    },

    val(value) {
      if (!arguments.length) {
        const elem = this[0];

        if (elem) {
          if (jQuery.nodeName(elem, 'option')) {
            // attributes.value is undefined in Blackberry 4.7 but
            // uses .value. See #6932
            const val = elem.attributes.value;
            return !val || val.specified ? elem.value : elem.text;
          }

          // We need to handle select boxes special
          if (jQuery.nodeName(elem, 'select')) {
            const index = elem.selectedIndex;
            const values = [];
            const { options } = elem;
            const one = elem.type === 'select-one';

            // Nothing was selected
            if (index < 0) {
              return null;
            }

            // Loop through all the selected options
            for (let i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++) {
              const option = options[i];

              // Don't return options that are disabled or in a disabled optgroup
              if (option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute('disabled') === null)
								&& (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, 'optgroup'))) {
                // Get the specific value for the option
                value = jQuery(option).val();

                // We don't need an array for one selects
                if (one) {
                  return value;
                }

                // Multi-Selects return an array
                values.push(value);
              }
            }

            return values;
          }

          // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
          if (rradiocheck.test(elem.type) && !jQuery.support.checkOn) {
            return elem.getAttribute('value') === null ? 'on' : elem.value;
          }

          // Everything else, we just grab the value
          return (elem.value || '').replace(rreturn, '');
        }

        return undefined;
      }

      const isFunction = jQuery.isFunction(value);

      return this.each(function (i) {
        const self = jQuery(this); let
          val = value;

        if (this.nodeType !== 1) {
          return;
        }

        if (isFunction) {
          val = value.call(this, i, self.val());
        }

        // Treat null/undefined as ""; convert numbers to string
        if (val == null) {
          val = '';
        } else if (typeof val === 'number') {
          val += '';
        } else if (jQuery.isArray(val)) {
          val = jQuery.map(val, (value) => (value == null ? '' : `${value}`));
        }

        if (jQuery.isArray(val) && rradiocheck.test(this.type)) {
          this.checked = jQuery.inArray(self.val(), val) >= 0;
        } else if (jQuery.nodeName(this, 'select')) {
          const values = jQuery.makeArray(val);

          jQuery('option', this).each(function () {
            this.selected = jQuery.inArray(jQuery(this).val(), values) >= 0;
          });

          if (!values.length) {
            this.selectedIndex = -1;
          }
        } else {
          this.value = val;
        }
      });
    },
  });

  jQuery.extend({
    attrFn: {
      val: true,
      css: true,
      html: true,
      text: true,
      data: true,
      width: true,
      height: true,
      offset: true,
    },

    attr(elem, name, value, pass) {
      // don't set attributes on text and comment nodes
      if (!elem || elem.nodeType === 3 || elem.nodeType === 8) {
        return undefined;
      }

      if (pass && name in jQuery.attrFn) {
        return jQuery(elem)[name](value);
      }

      const notxml = elem.nodeType !== 1 || !jQuery.isXMLDoc(elem);
      // Whether we are setting (or getting)
      const set = value !== undefined;

      // Try to normalize/fix the name
      name = notxml && jQuery.props[name] || name;

      // These attributes require special treatment
      const special = rspecialurl.test(name);

      // Safari mis-reports the default selected property of an option
      // Accessing the parent's selectedIndex property fixes it
      if (name === 'selected' && !jQuery.support.optSelected) {
        const parent = elem.parentNode;
        if (parent) {
          parent.selectedIndex;

          // Make sure that it also works with optgroups, see #5701
          if (parent.parentNode) {
            parent.parentNode.selectedIndex;
          }
        }
      }

      // If applicable, access the attribute via the DOM 0 way
      // 'in' checks fail in Blackberry 4.7 #6931
      if ((name in elem || elem[name] !== undefined) && notxml && !special) {
        if (set) {
          // We can't allow the type property to be changed (since it causes problems in IE)
          if (name === 'type' && rtype.test(elem.nodeName) && elem.parentNode) {
            jQuery.error("type property can't be changed");
          }

          if (value === null) {
            if (elem.nodeType === 1) {
              elem.removeAttribute(name);
            }
          } else {
            elem[name] = value;
          }
        }

        // browsers index elements by id/name on forms, give priority to attributes.
        if (jQuery.nodeName(elem, 'form') && elem.getAttributeNode(name)) {
          return elem.getAttributeNode(name).nodeValue;
        }

        // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
        // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
        if (name === 'tabIndex') {
          const attributeNode = elem.getAttributeNode('tabIndex');

          return attributeNode && attributeNode.specified
            ? attributeNode.value
            : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href
              ? 0
              : undefined;
        }

        return elem[name];
      }

      if (!jQuery.support.style && notxml && name === 'style') {
        if (set) {
          elem.style.cssText = `${value}`;
        }

        return elem.style.cssText;
      }

      if (set) {
        // convert the value to a string (all browsers do this but IE) see #1070
        elem.setAttribute(name, `${value}`);
      }

      // Ensure that missing attributes return undefined
      // Blackberry 4.7 returns "" from getAttribute #6938
      if (!elem.attributes[name] && (elem.hasAttribute && !elem.hasAttribute(name))) {
        return undefined;
      }

      const attr = !jQuery.support.hrefNormalized && notxml && special
      // Some attributes require a special call on IE
        ? elem.getAttribute(name, 2)
        : elem.getAttribute(name);

      // Non-existent attributes return null, we normalize to undefined
      return attr === null ? undefined : attr;
    },
  });

  const rnamespaces = /\.(.*)$/;
  const rformElems = /^(?:textarea|input|select)$/i;
  const rperiod = /\./g;
  const rspace = / /g;
  const rescape = /[^\w\s.|`]/g;
  const fcleanup = function (nm) {
    return nm.replace(rescape, '\\$&');
  };
  const focusCounts = { focusin: 0, focusout: 0 };

  /*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
  jQuery.event = {

    // Bind an event to an element
    // Original by Dean Edwards
    add(elem, types, handler, data) {
      if (elem.nodeType === 3 || elem.nodeType === 8) {
        return;
      }

      // For whatever reason, IE has trouble passing the window object
      // around, causing it to be cloned in the process
      if (jQuery.isWindow(elem) && (elem !== window && !elem.frameElement)) {
        elem = window;
      }

      if (handler === false) {
        handler = returnFalse;
      } else if (!handler) {
        // Fixes bug #7229. Fix recommended by jdalton
		  return;
      }

      let handleObjIn; let
        handleObj;

      if (handler.handler) {
        handleObjIn = handler;
        handler = handleObjIn.handler;
      }

      // Make sure that the function being executed has a unique ID
      if (!handler.guid) {
        handler.guid = jQuery.guid++;
      }

      // Init the element's event structure
      let elemData = jQuery.data(elem);

      // If no elemData is found then we must be trying to bind to one of the
      // banned noData elements
      if (!elemData) {
        return;
      }

      // Use a key less likely to result in collisions for plain JS objects.
      // Fixes bug #7150.
      const eventKey = elem.nodeType ? 'events' : '__events__';
      let events = elemData[eventKey];
      let eventHandle = elemData.handle;

      if (typeof events === 'function') {
        // On plain objects events is a fn that holds the the data
        // which prevents this data from being JSON serialized
        // the function does not need to be called, it just contains the data
        eventHandle = events.handle;
        events = events.events;
      } else if (!events) {
        if (!elem.nodeType) {
          // On plain objects, create a fn that acts as the holder
          // of the values to avoid JSON serialization of event data
          elemData[eventKey] = elemData = function () {};
        }

        elemData.events = events = {};
      }

      if (!eventHandle) {
        elemData.handle = eventHandle = function () {
          // Handle the second event of a trigger and when
          // an event is called after a page has unloaded
          return typeof jQuery !== 'undefined' && !jQuery.event.triggered
            ? jQuery.event.handle.apply(eventHandle.elem, arguments)
            : undefined;
        };
      }

      // Add elem as a property of the handle function
      // This is to prevent a memory leak with non-native events in IE.
      eventHandle.elem = elem;

      // Handle multiple events separated by a space
      // jQuery(...).bind("mouseover mouseout", fn);
      types = types.split(' ');

      let type; let i = 0; let
        namespaces;

      while ((type = types[i++])) {
        handleObj = handleObjIn
          ? jQuery.extend({}, handleObjIn)
          : { handler, data };

        // Namespaced event handlers
        if (type.indexOf('.') > -1) {
          namespaces = type.split('.');
          type = namespaces.shift();
          handleObj.namespace = namespaces.slice(0).sort().join('.');
        } else {
          namespaces = [];
          handleObj.namespace = '';
        }

        handleObj.type = type;
        if (!handleObj.guid) {
          handleObj.guid = handler.guid;
        }

        // Get the current list of functions bound to this event
        let handlers = events[type];
        const special = jQuery.event.special[type] || {};

        // Init the event handler queue
        if (!handlers) {
          handlers = events[type] = [];

          // Check for a special event handler
          // Only use addEventListener/attachEvent if the special
          // events handler returns false
          if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
            // Bind the global event handler to the element
            if (elem.addEventListener) {
              elem.addEventListener(type, eventHandle, false);
            } else if (elem.attachEvent) {
              elem.attachEvent(`on${type}`, eventHandle);
            }
          }
        }

        if (special.add) {
          special.add.call(elem, handleObj);

          if (!handleObj.handler.guid) {
            handleObj.handler.guid = handler.guid;
          }
        }

        // Add the function to the element's handler list
        handlers.push(handleObj);

        // Keep track of which events have been used, for global triggering
        jQuery.event.global[type] = true;
      }

      // Nullify elem to prevent memory leaks in IE
      elem = null;
    },

    global: {},

    // Detach an event or set of events from an element
    remove(elem, types, handler, pos) {
      // don't do events on text and comment nodes
      if (elem.nodeType === 3 || elem.nodeType === 8) {
        return;
      }

      if (handler === false) {
        handler = returnFalse;
      }

      let ret; let type; let fn; let j; let i = 0; let all; let namespaces; let namespace; let special; let eventType; let handleObj; let origType;
      const eventKey = elem.nodeType ? 'events' : '__events__';
      let elemData = jQuery.data(elem);
      let events = elemData && elemData[eventKey];

      if (!elemData || !events) {
        return;
      }

      if (typeof events === 'function') {
        elemData = events;
        events = events.events;
      }

      // types is actually an event object here
      if (types && types.type) {
        handler = types.handler;
        types = types.type;
      }

      // Unbind all events for the element
      if (!types || typeof types === 'string' && types.charAt(0) === '.') {
        types = types || '';

        for (type in events) {
          jQuery.event.remove(elem, type + types);
        }

        return;
      }

      // Handle multiple events separated by a space
      // jQuery(...).unbind("mouseover mouseout", fn);
      types = types.split(' ');

      while ((type = types[i++])) {
        origType = type;
        handleObj = null;
        all = type.indexOf('.') < 0;
        namespaces = [];

        if (!all) {
          // Namespaced event handlers
          namespaces = type.split('.');
          type = namespaces.shift();

          namespace = new RegExp(`(^|\\.)${
            jQuery.map(namespaces.slice(0).sort(), fcleanup).join('\\.(?:.*\\.)?')}(\\.|$)`);
        }

        eventType = events[type];

        if (!eventType) {
          continue;
        }

        if (!handler) {
          for (j = 0; j < eventType.length; j++) {
            handleObj = eventType[j];

            if (all || namespace.test(handleObj.namespace)) {
              jQuery.event.remove(elem, origType, handleObj.handler, j);
              eventType.splice(j--, 1);
            }
          }

          continue;
        }

        special = jQuery.event.special[type] || {};

        for (j = pos || 0; j < eventType.length; j++) {
          handleObj = eventType[j];

          if (handler.guid === handleObj.guid) {
            // remove the given handler for the given type
            if (all || namespace.test(handleObj.namespace)) {
              if (pos == null) {
                eventType.splice(j--, 1);
              }

              if (special.remove) {
                special.remove.call(elem, handleObj);
              }
            }

            if (pos != null) {
              break;
            }
          }
        }

        // remove generic event handler if no more handlers exist
        if (eventType.length === 0 || pos != null && eventType.length === 1) {
          if (!special.teardown || special.teardown.call(elem, namespaces) === false) {
            jQuery.removeEvent(elem, type, elemData.handle);
          }

          ret = null;
          delete events[type];
        }
      }

      // Remove the expando if it's no longer used
      if (jQuery.isEmptyObject(events)) {
        const { handle } = elemData;
        if (handle) {
          handle.elem = null;
        }

        delete elemData.events;
        delete elemData.handle;

        if (typeof elemData === 'function') {
          jQuery.removeData(elem, eventKey);
        } else if (jQuery.isEmptyObject(elemData)) {
          jQuery.removeData(elem);
        }
      }
    },

    // bubbling is internal
    trigger(event, data, elem /* , bubbling */) {
      // Event object or event type
      let type = event.type || event;
      const bubbling = arguments[3];

      if (!bubbling) {
        event = typeof event === 'object'
        // jQuery.Event object
          ? event[jQuery.expando] ? event
          // Object literal
            : jQuery.extend(jQuery.Event(type), event)
        // Just the event type (string)
          : jQuery.Event(type);

        if (type.indexOf('!') >= 0) {
          event.type = type = type.slice(0, -1);
          event.exclusive = true;
        }

        // Handle a global trigger
        if (!elem) {
          // Don't bubble custom events when global (to avoid too much overhead)
          event.stopPropagation();

          // Only trigger if we've ever bound an event for it
          if (jQuery.event.global[type]) {
            jQuery.each(jQuery.cache, function () {
              if (this.events && this.events[type]) {
                jQuery.event.trigger(event, data, this.handle.elem);
              }
            });
          }
        }

        // Handle triggering a single element

        // don't do events on text and comment nodes
        if (!elem || elem.nodeType === 3 || elem.nodeType === 8) {
          return undefined;
        }

        // Clean up in case it is reused
        event.result = undefined;
        event.target = elem;

        // Clone the incoming data, if any
        data = jQuery.makeArray(data);
        data.unshift(event);
      }

      event.currentTarget = elem;

      // Trigger the event, it is assumed that "handle" is a function
      const handle = elem.nodeType
        ? jQuery.data(elem, 'handle')
        : (jQuery.data(elem, '__events__') || {}).handle;

      if (handle) {
        handle.apply(elem, data);
      }

      const parent = elem.parentNode || elem.ownerDocument;

      // Trigger an inline bound script
      try {
        if (!(elem && elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()])) {
          if (elem[`on${type}`] && elem[`on${type}`].apply(elem, data) === false) {
            event.result = false;
            event.preventDefault();
          }
        }

        // prevent IE from throwing an error for some elements with some event types, see #3533
      } catch (inlineError) {}

      if (!event.isPropagationStopped() && parent) {
        jQuery.event.trigger(event, data, parent, true);
      } else if (!event.isDefaultPrevented()) {
        let old;
        const { target } = event;
        const targetType = type.replace(rnamespaces, '');
        const isClick = jQuery.nodeName(target, 'a') && targetType === 'click';
        const special = jQuery.event.special[targetType] || {};

        if ((!special._default || special._default.call(elem, event) === false)
				&& !isClick && !(target && target.nodeName && jQuery.noData[target.nodeName.toLowerCase()])) {
          try {
            if (target[targetType]) {
              // Make sure that we don't accidentally re-trigger the onFOO events
              old = target[`on${targetType}`];

              if (old) {
                target[`on${targetType}`] = null;
              }

              jQuery.event.triggered = true;
              target[targetType]();
            }

            // prevent IE from throwing an error for some elements with some event types, see #3533
          } catch (triggerError) {}

          if (old) {
            target[`on${targetType}`] = old;
          }

          jQuery.event.triggered = false;
        }
      }
    },

    handle(event) {
      let all; let handlers; let namespaces; let namespace_re; let events;
      let namespace_sort = [];
      const args = jQuery.makeArray(arguments);

      event = args[0] = jQuery.event.fix(event || window.event);
      event.currentTarget = this;

      // Namespaced event handlers
      all = event.type.indexOf('.') < 0 && !event.exclusive;

      if (!all) {
        namespaces = event.type.split('.');
        event.type = namespaces.shift();
        namespace_sort = namespaces.slice(0).sort();
        namespace_re = new RegExp(`(^|\\.)${namespace_sort.join('\\.(?:.*\\.)?')}(\\.|$)`);
      }

      event.namespace = event.namespace || namespace_sort.join('.');

      events = jQuery.data(this, this.nodeType ? 'events' : '__events__');

      if (typeof events === 'function') {
        events = events.events;
      }

      handlers = (events || {})[event.type];

      if (events && handlers) {
        // Clone the handlers to prevent manipulation
        handlers = handlers.slice(0);

        for (let j = 0, l = handlers.length; j < l; j++) {
          const handleObj = handlers[j];

          // Filter the functions by class
          if (all || namespace_re.test(handleObj.namespace)) {
            // Pass in a reference to the handler function itself
            // So that we can later remove it
            event.handler = handleObj.handler;
            event.data = handleObj.data;
            event.handleObj = handleObj;

            const ret = handleObj.handler.apply(this, args);

            if (ret !== undefined) {
              event.result = ret;
              if (ret === false) {
                event.preventDefault();
                event.stopPropagation();
              }
            }

            if (event.isImmediatePropagationStopped()) {
              break;
            }
          }
        }
      }

      return event.result;
    },

    props: 'altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which'.split(' '),

    fix(event) {
      if (event[jQuery.expando]) {
        return event;
      }

      // store a copy of the original event object
      // and "clone" to set read-only properties
      const originalEvent = event;
      event = jQuery.Event(originalEvent);

      for (var i = this.props.length, prop; i;) {
        prop = this.props[--i];
        event[prop] = originalEvent[prop];
      }

      // Fix target property, if necessary
      if (!event.target) {
        // Fixes #1925 where srcElement might not be defined either
        event.target = event.srcElement || document;
      }

      // check if target is a textnode (safari)
      if (event.target.nodeType === 3) {
        event.target = event.target.parentNode;
      }

      // Add relatedTarget, if necessary
      if (!event.relatedTarget && event.fromElement) {
        event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
      }

      // Calculate pageX/Y if missing and clientX/Y available
      if (event.pageX == null && event.clientX != null) {
        const doc = document.documentElement;
        const { body } = document;

        event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
      }

      // Add which for key events
      if (event.which == null && (event.charCode != null || event.keyCode != null)) {
        event.which = event.charCode != null ? event.charCode : event.keyCode;
      }

      // Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
      if (!event.metaKey && event.ctrlKey) {
        event.metaKey = event.ctrlKey;
      }

      // Add which for click: 1 === left; 2 === middle; 3 === right
      // Note: button is not normalized, so don't use it
      if (!event.which && event.button !== undefined) {
        event.which = (event.button & 1 ? 1 : (event.button & 2 ? 3 : (event.button & 4 ? 2 : 0)));
      }

      return event;
    },

    // Deprecated, use jQuery.guid instead
    guid: 1E8,

    // Deprecated, use jQuery.proxy instead
    proxy: jQuery.proxy,

    special: {
      ready: {
        // Make sure the ready event is setup
        setup: jQuery.bindReady,
        teardown: jQuery.noop,
      },

      live: {
        add(handleObj) {
          jQuery.event.add(this,
            liveConvert(handleObj.origType, handleObj.selector),
            jQuery.extend({}, handleObj, { handler: liveHandler, guid: handleObj.handler.guid }));
        },

        remove(handleObj) {
          jQuery.event.remove(this, liveConvert(handleObj.origType, handleObj.selector), handleObj);
        },
      },

      beforeunload: {
        setup(data, namespaces, eventHandle) {
          // We only want to do this special case on windows
          if (jQuery.isWindow(this)) {
            this.onbeforeunload = eventHandle;
          }
        },

        teardown(namespaces, eventHandle) {
          if (this.onbeforeunload === eventHandle) {
            this.onbeforeunload = null;
          }
        },
      },
    },
  };

  jQuery.removeEvent = document.removeEventListener
    ? function (elem, type, handle) {
      if (elem.removeEventListener) {
        elem.removeEventListener(type, handle, false);
      }
    }
    : function (elem, type, handle) {
      if (elem.detachEvent) {
        elem.detachEvent(`on${type}`, handle);
      }
    };

  jQuery.Event = function (src) {
    // Allow instantiation without the 'new' keyword
    if (!this.preventDefault) {
      return new jQuery.Event(src);
    }

    // Event object
    if (src && src.type) {
      this.originalEvent = src;
      this.type = src.type;
      // Event type
    } else {
      this.type = src;
    }

    // timeStamp is buggy for some events on Firefox(#3843)
    // So we won't rely on the native value
    this.timeStamp = jQuery.now();

    // Mark it as fixed
    this[jQuery.expando] = true;
  };

  function returnFalse() {
    return false;
  }
  function returnTrue() {
    return true;
  }

  // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
  // http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
  jQuery.Event.prototype = {
    preventDefault() {
      this.isDefaultPrevented = returnTrue;

      const e = this.originalEvent;
      if (!e) {
        return;
      }

      // if preventDefault exists run it on the original event
      if (e.preventDefault) {
        e.preventDefault();

        // otherwise set the returnValue property of the original event to false (IE)
      } else {
        e.returnValue = false;
      }
    },
    stopPropagation() {
      this.isPropagationStopped = returnTrue;

      const e = this.originalEvent;
      if (!e) {
        return;
      }
      // if stopPropagation exists run it on the original event
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      // otherwise set the cancelBubble property of the original event to true (IE)
      e.cancelBubble = true;
    },
    stopImmediatePropagation() {
      this.isImmediatePropagationStopped = returnTrue;
      this.stopPropagation();
    },
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse,
  };

  // Checks if an event happened on an element within another element
  // Used in jQuery.event.special.mouseenter and mouseleave handlers
  const withinElement = function (event) {
    // Check if mouse(over|out) are still within the same parent element
    let parent = event.relatedTarget;

    // Firefox sometimes assigns relatedTarget a XUL element
    // which we cannot access the parentNode property of
    try {
      // Traverse up the tree
      while (parent && parent !== this) {
        parent = parent.parentNode;
      }

      if (parent !== this) {
        // set the correct event type
        event.type = event.data;

        // handle event if we actually just moused on to a non sub-element
        jQuery.event.handle.apply(this, arguments);
      }

      // assuming we've left the element since we most likely mousedover a xul element
    } catch (e) { }
  };

  // In case of event delegation, we only need to rename the event.type,
  // liveHandler will take care of the rest.
  const delegate = function (event) {
    event.type = event.data;
    jQuery.event.handle.apply(this, arguments);
  };

  // Create mouseenter and mouseleave events
  jQuery.each({
    mouseenter: 'mouseover',
    mouseleave: 'mouseout',
  }, (orig, fix) => {
    jQuery.event.special[orig] = {
      setup(data) {
        jQuery.event.add(this, fix, data && data.selector ? delegate : withinElement, orig);
      },
      teardown(data) {
        jQuery.event.remove(this, fix, data && data.selector ? delegate : withinElement);
      },
    };
  });

  // submit delegation
  if (!jQuery.support.submitBubbles) {
    jQuery.event.special.submit = {
      setup(data, namespaces) {
        if (this.nodeName.toLowerCase() !== 'form') {
          jQuery.event.add(this, 'click.specialSubmit', function (e) {
            const elem = e.target;
            const { type } = elem;

            if ((type === 'submit' || type === 'image') && jQuery(elem).closest('form').length) {
              e.liveFired = undefined;
              return trigger('submit', this, arguments);
            }
          });

          jQuery.event.add(this, 'keypress.specialSubmit', function (e) {
            const elem = e.target;
            const { type } = elem;

            if ((type === 'text' || type === 'password') && jQuery(elem).closest('form').length && e.keyCode === 13) {
              e.liveFired = undefined;
              return trigger('submit', this, arguments);
            }
          });
        } else {
          return false;
        }
      },

      teardown(namespaces) {
        jQuery.event.remove(this, '.specialSubmit');
      },
    };
  }

  // change delegation, happens here so we have bind.
  if (!jQuery.support.changeBubbles) {
    let changeFilters;

    const getVal = function (elem) {
      const { type } = elem;
      let val = elem.value;

      if (type === 'radio' || type === 'checkbox') {
        val = elem.checked;
      } else if (type === 'select-multiple') {
        val = elem.selectedIndex > -1
          ? jQuery.map(elem.options, (elem) => elem.selected).join('-')
          : '';
      } else if (elem.nodeName.toLowerCase() === 'select') {
        val = elem.selectedIndex;
      }

      return val;
    };

    const testChange = function testChange(e) {
      const elem = e.target; let data; let
        val;

      if (!rformElems.test(elem.nodeName) || elem.readOnly) {
        return;
      }

      data = jQuery.data(elem, '_change_data');
      val = getVal(elem);

      // the current data will be also retrieved by beforeactivate
      if (e.type !== 'focusout' || elem.type !== 'radio') {
        jQuery.data(elem, '_change_data', val);
      }

      if (data === undefined || val === data) {
        return;
      }

      if (data != null || val) {
        e.type = 'change';
        e.liveFired = undefined;
        return jQuery.event.trigger(e, arguments[1], elem);
      }
    };

    jQuery.event.special.change = {
      filters: {
        focusout: testChange,

        beforedeactivate: testChange,

        click(e) {
          const elem = e.target; const
            { type } = elem;

          if (type === 'radio' || type === 'checkbox' || elem.nodeName.toLowerCase() === 'select') {
            return testChange.call(this, e);
          }
        },

        // Change has to be called before submit
        // Keydown will be called before keypress, which is used in submit-event delegation
        keydown(e) {
          const elem = e.target; const
            { type } = elem;

          if ((e.keyCode === 13 && elem.nodeName.toLowerCase() !== 'textarea')
					|| (e.keyCode === 32 && (type === 'checkbox' || type === 'radio'))
					|| type === 'select-multiple') {
            return testChange.call(this, e);
          }
        },

        // Beforeactivate happens also before the previous element is blurred
        // with this event you can't trigger a change event, but you can store
        // information
        beforeactivate(e) {
          const elem = e.target;
          jQuery.data(elem, '_change_data', getVal(elem));
        },
      },

      setup(data, namespaces) {
        if (this.type === 'file') {
          return false;
        }

        for (const type in changeFilters) {
          jQuery.event.add(this, `${type}.specialChange`, changeFilters[type]);
        }

        return rformElems.test(this.nodeName);
      },

      teardown(namespaces) {
        jQuery.event.remove(this, '.specialChange');

        return rformElems.test(this.nodeName);
      },
    };

    changeFilters = jQuery.event.special.change.filters;

    // Handle when the input is .focus()'d
    changeFilters.focus = changeFilters.beforeactivate;
  }

  function trigger(type, elem, args) {
    args[0].type = type;
    return jQuery.event.handle.apply(elem, args);
  }

  // Create "bubbling" focus and blur events
  if (document.addEventListener) {
    jQuery.each({ focus: 'focusin', blur: 'focusout' }, (orig, fix) => {
      jQuery.event.special[fix] = {
        setup() {
          if (focusCounts[fix]++ === 0) {
            document.addEventListener(orig, handler, true);
          }
        },
        teardown() {
          if (--focusCounts[fix] === 0) {
            document.removeEventListener(orig, handler, true);
          }
        },
      };

      function handler(e) {
        e = jQuery.event.fix(e);
        e.type = fix;
        return jQuery.event.trigger(e, null, e.target);
      }
    });
  }

  jQuery.each(['bind', 'one'], (i, name) => {
    jQuery.fn[name] = function (type, data, fn) {
      // Handle object literals
      if (typeof type === 'object') {
        for (const key in type) {
          this[name](key, data, type[key], fn);
        }
        return this;
      }

      if (jQuery.isFunction(data) || data === false) {
        fn = data;
        data = undefined;
      }

      var handler = name === 'one' ? jQuery.proxy(fn, function (event) {
        jQuery(this).unbind(event, handler);
        return fn.apply(this, arguments);
      }) : fn;

      if (type === 'unload' && name !== 'one') {
        this.one(type, data, fn);
      } else {
        for (let i = 0, l = this.length; i < l; i++) {
          jQuery.event.add(this[i], type, handler, data);
        }
      }

      return this;
    };
  });

  jQuery.fn.extend({
    unbind(type, fn) {
      // Handle object literals
      if (typeof type === 'object' && !type.preventDefault) {
        for (const key in type) {
          this.unbind(key, type[key]);
        }
      } else {
        for (let i = 0, l = this.length; i < l; i++) {
          jQuery.event.remove(this[i], type, fn);
        }
      }

      return this;
    },

    delegate(selector, types, data, fn) {
      return this.live(types, data, fn, selector);
    },

    undelegate(selector, types, fn) {
      if (arguments.length === 0) {
        return this.unbind('live');
      }
      return this.die(types, null, fn, selector);
    },

    trigger(type, data) {
      return this.each(function () {
        jQuery.event.trigger(type, data, this);
      });
    },

    triggerHandler(type, data) {
      if (this[0]) {
        const event = jQuery.Event(type);
        event.preventDefault();
        event.stopPropagation();
        jQuery.event.trigger(event, data, this[0]);
        return event.result;
      }
    },

    toggle(fn) {
      // Save reference to arguments for access in closure
      const args = arguments;
      let i = 1;

      // link all the functions, so any of them can unbind this click handler
      while (i < args.length) {
        jQuery.proxy(fn, args[i++]);
      }

      return this.click(jQuery.proxy(fn, function (event) {
        // Figure out which function to execute
        const lastToggle = (jQuery.data(this, `lastToggle${fn.guid}`) || 0) % i;
        jQuery.data(this, `lastToggle${fn.guid}`, lastToggle + 1);

        // Make sure that clicks stop
        event.preventDefault();

        // and execute the function
        return args[lastToggle].apply(this, arguments) || false;
      }));
    },

    hover(fnOver, fnOut) {
      return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
    },
  });

  const liveMap = {
    focus: 'focusin',
    blur: 'focusout',
    mouseenter: 'mouseover',
    mouseleave: 'mouseout',
  };

  jQuery.each(['live', 'die'], (i, name) => {
    jQuery.fn[name] = function (types, data, fn, origSelector /* Internal Use Only */) {
      let type; let i = 0; let match; let namespaces; let preType;
      const selector = origSelector || this.selector;
      const context = origSelector ? this : jQuery(this.context);

      if (typeof types === 'object' && !types.preventDefault) {
        for (const key in types) {
          context[name](key, data, types[key], selector);
        }

        return this;
      }

      if (jQuery.isFunction(data)) {
        fn = data;
        data = undefined;
      }

      types = (types || '').split(' ');

      while ((type = types[i++]) != null) {
        match = rnamespaces.exec(type);
        namespaces = '';

        if (match) {
          namespaces = match[0];
          type = type.replace(rnamespaces, '');
        }

        if (type === 'hover') {
          types.push(`mouseenter${namespaces}`, `mouseleave${namespaces}`);
          continue;
        }

        preType = type;

        if (type === 'focus' || type === 'blur') {
          types.push(liveMap[type] + namespaces);
          type += namespaces;
        } else {
          type = (liveMap[type] || type) + namespaces;
        }

        if (name === 'live') {
          // bind live handler
          for (let j = 0, l = context.length; j < l; j++) {
            jQuery.event.add(context[j], `live.${liveConvert(type, selector)}`,
              {
                data, selector, handler: fn, origType: type, origHandler: fn, preType,
              });
          }
        } else {
          // unbind live handler
          context.unbind(`live.${liveConvert(type, selector)}`, fn);
        }
      }

      return this;
    };
  });

  function liveHandler(event) {
    let stop; let maxLevel; let related; let match; let handleObj; let elem; let j; let i; let l; let data; let close; let namespace; let ret;
    const elems = [];
    const selectors = [];
    let events = jQuery.data(this, this.nodeType ? 'events' : '__events__');

    if (typeof events === 'function') {
      events = events.events;
    }

    // Make sure we avoid non-left-click bubbling in Firefox (#3861)
    if (event.liveFired === this || !events || !events.live || event.button && event.type === 'click') {
      return;
    }

    if (event.namespace) {
      namespace = new RegExp(`(^|\\.)${event.namespace.split('.').join('\\.(?:.*\\.)?')}(\\.|$)`);
    }

    event.liveFired = this;

    const live = events.live.slice(0);

    for (j = 0; j < live.length; j++) {
      handleObj = live[j];

      if (handleObj.origType.replace(rnamespaces, '') === event.type) {
        selectors.push(handleObj.selector);
      } else {
        live.splice(j--, 1);
      }
    }

    match = jQuery(event.target).closest(selectors, event.currentTarget);

    for (i = 0, l = match.length; i < l; i++) {
      close = match[i];

      for (j = 0; j < live.length; j++) {
        handleObj = live[j];

        if (close.selector === handleObj.selector && (!namespace || namespace.test(handleObj.namespace))) {
          elem = close.elem;
          related = null;

          // Those two events require additional checking
          if (handleObj.preType === 'mouseenter' || handleObj.preType === 'mouseleave') {
            event.type = handleObj.preType;
            related = jQuery(event.relatedTarget).closest(handleObj.selector)[0];
          }

          if (!related || related !== elem) {
            elems.push({ elem, handleObj, level: close.level });
          }
        }
      }
    }

    for (i = 0, l = elems.length; i < l; i++) {
      match = elems[i];

      if (maxLevel && match.level > maxLevel) {
        break;
      }

      event.currentTarget = match.elem;
      event.data = match.handleObj.data;
      event.handleObj = match.handleObj;

      ret = match.handleObj.origHandler.apply(match.elem, arguments);

      if (ret === false || event.isPropagationStopped()) {
        maxLevel = match.level;

        if (ret === false) {
          stop = false;
        }
        if (event.isImmediatePropagationStopped()) {
          break;
        }
      }
    }

    return stop;
  }

  function liveConvert(type, selector) {
    return (type && type !== '*' ? `${type}.` : '') + selector.replace(rperiod, '`').replace(rspace, '&');
  }

  jQuery.each(('blur focus focusin focusout load resize scroll unload click dblclick '
	+ 'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '
	+ 'change select submit keydown keypress keyup error').split(' '), (i, name) => {
    // Handle event binding
    jQuery.fn[name] = function (data, fn) {
      if (fn == null) {
        fn = data;
        data = null;
      }

      return arguments.length > 0
        ? this.bind(name, data, fn)
        : this.trigger(name);
    };

    if (jQuery.attrFn) {
      jQuery.attrFn[name] = true;
    }
  });

  // Prevent memory leaks in IE
  // Window isn't included so as not to unbind existing unload events
  // More info:
  //  - http://isaacschlueter.com/2006/10/msie-memory-leaks/
  if (window.attachEvent && !window.addEventListener) {
    jQuery(window).bind('unload', () => {
      for (const id in jQuery.cache) {
        if (jQuery.cache[id].handle) {
          // Try/Catch is to handle iframes being unloaded, see #4280
          try {
            jQuery.event.remove(jQuery.cache[id].handle.elem);
          } catch (e) {}
        }
      }
    });
  }

  /*!
 * Sizzle CSS Selector Engine - v1.0
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
  (function () {
    const chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g;
    let done = 0;
    const { toString } = Object.prototype;
    let hasDuplicate = false;
    let baseHasDuplicate = true;

    // Here we check if the JavaScript engine is using some sort of
    // optimization where it does not always call our comparision
    // function. If that is the case, discard the hasDuplicate value.
    //   Thus far that includes Google Chrome.
    [0, 0].sort(() => {
      baseHasDuplicate = false;
      return 0;
    });

    var Sizzle = function (selector, context, results, seed) {
      results = results || [];
      context = context || document;

      const origContext = context;

      if (context.nodeType !== 1 && context.nodeType !== 9) {
        return [];
      }

      if (!selector || typeof selector !== 'string') {
        return results;
      }

      let m; let set; let checkSet; let extra; let ret; let cur; let pop; let i;
      let prune = true;
      const contextXML = Sizzle.isXML(context);
      let parts = [];
      let soFar = selector;

      // Reset the position of the chunker regexp (start from head)
      do {
        chunker.exec('');
        m = chunker.exec(soFar);

        if (m) {
          soFar = m[3];

          parts.push(m[1]);

          if (m[2]) {
            extra = m[3];
            break;
          }
        }
      } while (m);

      if (parts.length > 1 && origPOS.exec(selector)) {
        if (parts.length === 2 && Expr.relative[parts[0]]) {
          set = posProcess(parts[0] + parts[1], context);
        } else {
          set = Expr.relative[parts[0]]
            ? [context]
            : Sizzle(parts.shift(), context);

          while (parts.length) {
            selector = parts.shift();

            if (Expr.relative[selector]) {
              selector += parts.shift();
            }

            set = posProcess(selector, set);
          }
        }
      } else {
        // Take a shortcut and set the context if the root selector is an ID
        // (but not if it'll be faster if the inner selector is an ID)
        if (!seed && parts.length > 1 && context.nodeType === 9 && !contextXML
				&& Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1])) {
          ret = Sizzle.find(parts.shift(), context, contextXML);
          context = ret.expr
            ? Sizzle.filter(ret.expr, ret.set)[0]
            : ret.set[0];
        }

        if (context) {
          ret = seed
            ? { expr: parts.pop(), set: makeArray(seed) }
            : Sizzle.find(parts.pop(), parts.length === 1 && (parts[0] === '~' || parts[0] === '+') && context.parentNode ? context.parentNode : context, contextXML);

          set = ret.expr
            ? Sizzle.filter(ret.expr, ret.set)
            : ret.set;

          if (parts.length > 0) {
            checkSet = makeArray(set);
          } else {
            prune = false;
          }

          while (parts.length) {
            cur = parts.pop();
            pop = cur;

            if (!Expr.relative[cur]) {
              cur = '';
            } else {
              pop = parts.pop();
            }

            if (pop == null) {
              pop = context;
            }

            Expr.relative[cur](checkSet, pop, contextXML);
          }
        } else {
          checkSet = parts = [];
        }
      }

      if (!checkSet) {
        checkSet = set;
      }

      if (!checkSet) {
        Sizzle.error(cur || selector);
      }

      if (toString.call(checkSet) === '[object Array]') {
        if (!prune) {
          results.push.apply(results, checkSet);
        } else if (context && context.nodeType === 1) {
          for (i = 0; checkSet[i] != null; i++) {
            if (checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i]))) {
              results.push(set[i]);
            }
          }
        } else {
          for (i = 0; checkSet[i] != null; i++) {
            if (checkSet[i] && checkSet[i].nodeType === 1) {
              results.push(set[i]);
            }
          }
        }
      } else {
        makeArray(checkSet, results);
      }

      if (extra) {
        Sizzle(extra, origContext, results, seed);
        Sizzle.uniqueSort(results);
      }

      return results;
    };

    Sizzle.uniqueSort = function (results) {
      if (sortOrder) {
        hasDuplicate = baseHasDuplicate;
        results.sort(sortOrder);

        if (hasDuplicate) {
          for (let i = 1; i < results.length; i++) {
            if (results[i] === results[i - 1]) {
              results.splice(i--, 1);
            }
          }
        }
      }

      return results;
    };

    Sizzle.matches = function (expr, set) {
      return Sizzle(expr, null, null, set);
    };

    Sizzle.matchesSelector = function (node, expr) {
      return Sizzle(expr, null, null, [node]).length > 0;
    };

    Sizzle.find = function (expr, context, isXML) {
      let set;

      if (!expr) {
        return [];
      }

      for (let i = 0, l = Expr.order.length; i < l; i++) {
        var match;
        const type = Expr.order[i];

        if ((match = Expr.leftMatch[type].exec(expr))) {
          const left = match[1];
          match.splice(1, 1);

          if (left.substr(left.length - 1) !== '\\') {
            match[1] = (match[1] || '').replace(/\\/g, '');
            set = Expr.find[type](match, context, isXML);

            if (set != null) {
              expr = expr.replace(Expr.match[type], '');
              break;
            }
          }
        }
      }

      if (!set) {
        set = context.getElementsByTagName('*');
      }

      return { set, expr };
    };

    Sizzle.filter = function (expr, set, inplace, not) {
      let match; let anyFound;
      let old = expr;
      let result = [];
      let curLoop = set;
      const isXMLFilter = set && set[0] && Sizzle.isXML(set[0]);

      while (expr && set.length) {
        for (const type in Expr.filter) {
          if ((match = Expr.leftMatch[type].exec(expr)) != null && match[2]) {
            var found; var item;
            const filter = Expr.filter[type];
            const left = match[1];

            anyFound = false;

            match.splice(1, 1);

            if (left.substr(left.length - 1) === '\\') {
              continue;
            }

            if (curLoop === result) {
              result = [];
            }

            if (Expr.preFilter[type]) {
              match = Expr.preFilter[type](match, curLoop, inplace, result, not, isXMLFilter);

              if (!match) {
                anyFound = found = true;
              } else if (match === true) {
                continue;
              }
            }

            if (match) {
              for (let i = 0; (item = curLoop[i]) != null; i++) {
                if (item) {
                  found = filter(item, match, i, curLoop);
                  const pass = not ^ !!found;

                  if (inplace && found != null) {
                    if (pass) {
                      anyFound = true;
                    } else {
                      curLoop[i] = false;
                    }
                  } else if (pass) {
                    result.push(item);
                    anyFound = true;
                  }
                }
              }
            }

            if (found !== undefined) {
              if (!inplace) {
                curLoop = result;
              }

              expr = expr.replace(Expr.match[type], '');

              if (!anyFound) {
                return [];
              }

              break;
            }
          }
        }

        // Improper expression
        if (expr === old) {
          if (anyFound == null) {
            Sizzle.error(expr);
          } else {
            break;
          }
        }

        old = expr;
      }

      return curLoop;
    };

    Sizzle.error = function (msg) {
      throw `Syntax error, unrecognized expression: ${msg}`;
    };

    var Expr = Sizzle.selectors = {
      order: ['ID', 'NAME', 'TAG'],

      match: {
        ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
        CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
        NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
        ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
        TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
        CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+\-]*)\))?/,
        POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
        PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/,
      },

      leftMatch: {},

      attrMap: {
        class: 'className',
        for: 'htmlFor',
      },

      attrHandle: {
        href(elem) {
          return elem.getAttribute('href');
        },
      },

      relative: {
        '+': function (checkSet, part) {
          const isPartStr = typeof part === 'string';
          const isTag = isPartStr && !/\W/.test(part);
          const isPartStrNotTag = isPartStr && !isTag;

          if (isTag) {
            part = part.toLowerCase();
          }

          for (var i = 0, l = checkSet.length, elem; i < l; i++) {
            if ((elem = checkSet[i])) {
              while ((elem = elem.previousSibling) && elem.nodeType !== 1) {}

              checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part
                ? elem || false
                : elem === part;
            }
          }

          if (isPartStrNotTag) {
            Sizzle.filter(part, checkSet, true);
          }
        },

        '>': function (checkSet, part) {
          let elem;
          const isPartStr = typeof part === 'string';
          let i = 0;
          const l = checkSet.length;

          if (isPartStr && !/\W/.test(part)) {
            part = part.toLowerCase();

            for (; i < l; i++) {
              elem = checkSet[i];

              if (elem) {
                const parent = elem.parentNode;
                checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
              }
            }
          } else {
            for (; i < l; i++) {
              elem = checkSet[i];

              if (elem) {
                checkSet[i] = isPartStr
                  ? elem.parentNode
                  : elem.parentNode === part;
              }
            }

            if (isPartStr) {
              Sizzle.filter(part, checkSet, true);
            }
          }
        },

        '': function (checkSet, part, isXML) {
          let nodeCheck;
          const doneName = done++;
          let checkFn = dirCheck;

          if (typeof part === 'string' && !/\W/.test(part)) {
            part = part.toLowerCase();
            nodeCheck = part;
            checkFn = dirNodeCheck;
          }

          checkFn('parentNode', part, doneName, checkSet, nodeCheck, isXML);
        },

        '~': function (checkSet, part, isXML) {
          let nodeCheck;
          const doneName = done++;
          let checkFn = dirCheck;

          if (typeof part === 'string' && !/\W/.test(part)) {
            part = part.toLowerCase();
            nodeCheck = part;
            checkFn = dirNodeCheck;
          }

          checkFn('previousSibling', part, doneName, checkSet, nodeCheck, isXML);
        },
      },

      find: {
        ID(match, context, isXML) {
          if (typeof context.getElementById !== 'undefined' && !isXML) {
            const m = context.getElementById(match[1]);
            // Check parentNode to catch when Blackberry 4.6 returns
            // nodes that are no longer in the document #6963
            return m && m.parentNode ? [m] : [];
          }
        },

        NAME(match, context) {
          if (typeof context.getElementsByName !== 'undefined') {
            const ret = [];
            const results = context.getElementsByName(match[1]);

            for (let i = 0, l = results.length; i < l; i++) {
              if (results[i].getAttribute('name') === match[1]) {
                ret.push(results[i]);
              }
            }

            return ret.length === 0 ? null : ret;
          }
        },

        TAG(match, context) {
          return context.getElementsByTagName(match[1]);
        },
      },
      preFilter: {
        CLASS(match, curLoop, inplace, result, not, isXML) {
          match = ` ${match[1].replace(/\\/g, '')} `;

          if (isXML) {
            return match;
          }

          for (var i = 0, elem; (elem = curLoop[i]) != null; i++) {
            if (elem) {
              if (not ^ (elem.className && (` ${elem.className} `).replace(/[\t\n]/g, ' ').indexOf(match) >= 0)) {
                if (!inplace) {
                  result.push(elem);
                }
              } else if (inplace) {
                curLoop[i] = false;
              }
            }
          }

          return false;
        },

        ID(match) {
          return match[1].replace(/\\/g, '');
        },

        TAG(match, curLoop) {
          return match[1].toLowerCase();
        },

        CHILD(match) {
          if (match[1] === 'nth') {
            // parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
            const test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
              match[2] === 'even' && '2n' || match[2] === 'odd' && '2n+1'
					|| !/\D/.test(match[2]) && `0n+${match[2]}` || match[2],
            );

            // calculate the numbers (first)n+(last) including if they are negative
            match[2] = (test[1] + (test[2] || 1)) - 0;
            match[3] = test[3] - 0;
          }

          // TODO: Move to normal caching system
          match[0] = done++;

          return match;
        },

        ATTR(match, curLoop, inplace, result, not, isXML) {
          const name = match[1].replace(/\\/g, '');

          if (!isXML && Expr.attrMap[name]) {
            match[1] = Expr.attrMap[name];
          }

          if (match[2] === '~=') {
            match[4] = ` ${match[4]} `;
          }

          return match;
        },

        PSEUDO(match, curLoop, inplace, result, not) {
          if (match[1] === 'not') {
            // If we're dealing with a complex expression, or a simple one
            if ((chunker.exec(match[3]) || '').length > 1 || /^\w/.test(match[3])) {
              match[3] = Sizzle(match[3], null, null, curLoop);
            } else {
              const ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

              if (!inplace) {
                result.push.apply(result, ret);
              }

              return false;
            }
          } else if (Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0])) {
            return true;
          }

          return match;
        },

        POS(match) {
          match.unshift(true);

          return match;
        },
      },

      filters: {
        enabled(elem) {
          return elem.disabled === false && elem.type !== 'hidden';
        },

        disabled(elem) {
          return elem.disabled === true;
        },

        checked(elem) {
          return elem.checked === true;
        },

        selected(elem) {
          // Accessing this property makes selected-by-default
          // options in Safari work properly
          elem.parentNode.selectedIndex;

          return elem.selected === true;
        },

        parent(elem) {
          return !!elem.firstChild;
        },

        empty(elem) {
          return !elem.firstChild;
        },

        has(elem, i, match) {
          return !!Sizzle(match[3], elem).length;
        },

        header(elem) {
          return (/h\d/i).test(elem.nodeName);
        },

        text(elem) {
          return elem.type === 'text';
        },
        radio(elem) {
          return elem.type === 'radio';
        },

        checkbox(elem) {
          return elem.type === 'checkbox';
        },

        file(elem) {
          return elem.type === 'file';
        },
        password(elem) {
          return elem.type === 'password';
        },

        submit(elem) {
          return elem.type === 'submit';
        },

        image(elem) {
          return elem.type === 'image';
        },

        reset(elem) {
          return elem.type === 'reset';
        },

        button(elem) {
          return elem.type === 'button' || elem.nodeName.toLowerCase() === 'button';
        },

        input(elem) {
          return (/input|select|textarea|button/i).test(elem.nodeName);
        },
      },
      setFilters: {
        first(elem, i) {
          return i === 0;
        },

        last(elem, i, match, array) {
          return i === array.length - 1;
        },

        even(elem, i) {
          return i % 2 === 0;
        },

        odd(elem, i) {
          return i % 2 === 1;
        },

        lt(elem, i, match) {
          return i < match[3] - 0;
        },

        gt(elem, i, match) {
          return i > match[3] - 0;
        },

        nth(elem, i, match) {
          return match[3] - 0 === i;
        },

        eq(elem, i, match) {
          return match[3] - 0 === i;
        },
      },
      filter: {
        PSEUDO(elem, match, i, array) {
          const name = match[1];
          const filter = Expr.filters[name];

          if (filter) {
            return filter(elem, i, match, array);
          } if (name === 'contains') {
            return (elem.textContent || elem.innerText || Sizzle.getText([elem]) || '').indexOf(match[3]) >= 0;
          } if (name === 'not') {
            const not = match[3];

            for (let j = 0, l = not.length; j < l; j++) {
              if (not[j] === elem) {
                return false;
              }
            }

            return true;
          }
          Sizzle.error(`Syntax error, unrecognized expression: ${name}`);
        },

        CHILD(elem, match) {
          const type = match[1];
          let node = elem;

          switch (type) {
            case 'only':
            case 'first':
              while ((node = node.previousSibling))	 {
                if (node.nodeType === 1) {
                  return false;
                }
              }

              if (type === 'first') {
                return true;
              }

              node = elem;

            case 'last':
              while ((node = node.nextSibling))	 {
                if (node.nodeType === 1) {
                  return false;
                }
              }

              return true;

            case 'nth':
              var first = match[2];
              var last = match[3];

              if (first === 1 && last === 0) {
                return true;
              }

              var doneName = match[0];
              var parent = elem.parentNode;

              if (parent && (parent.sizcache !== doneName || !elem.nodeIndex)) {
                let count = 0;

                for (node = parent.firstChild; node; node = node.nextSibling) {
                  if (node.nodeType === 1) {
                    node.nodeIndex = ++count;
                  }
                }

                parent.sizcache = doneName;
              }

              var diff = elem.nodeIndex - last;

              if (first === 0) {
                return diff === 0;
              }
              return (diff % first === 0 && diff / first >= 0);
          }
        },

        ID(elem, match) {
          return elem.nodeType === 1 && elem.getAttribute('id') === match;
        },

        TAG(elem, match) {
          return (match === '*' && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
        },

        CLASS(elem, match) {
          return (` ${elem.className || elem.getAttribute('class')} `)
            .indexOf(match) > -1;
        },

        ATTR(elem, match) {
          const name = match[1];
          const result = Expr.attrHandle[name]
            ? Expr.attrHandle[name](elem)
            : elem[name] != null
              ? elem[name]
              : elem.getAttribute(name);
          const value = `${result}`;
          const type = match[2];
          const check = match[4];

          return result == null
            ? type === '!='
            : type === '='
              ? value === check
              : type === '*='
                ? value.indexOf(check) >= 0
                : type === '~='
                  ? (` ${value} `).indexOf(check) >= 0
                  : !check
                    ? value && result !== false
                    : type === '!='
                      ? value !== check
                      : type === '^='
                        ? value.indexOf(check) === 0
                        : type === '$='
                          ? value.substr(value.length - check.length) === check
                          : type === '|='
                            ? value === check || value.substr(0, check.length + 1) === `${check}-`
                            : false;
        },

        POS(elem, match, i, array) {
          const name = match[2];
          const filter = Expr.setFilters[name];

          if (filter) {
            return filter(elem, i, match, array);
          }
        },
      },
    };

    var origPOS = Expr.match.POS;
    const fescape = function (all, num) {
      return `\\${num - 0 + 1}`;
    };

    for (const type in Expr.match) {
      Expr.match[type] = new RegExp(Expr.match[type].source + (/(?![^\[]*\])(?![^\(]*\))/.source));
      Expr.leftMatch[type] = new RegExp(/(^(?:.|\r|\n)*?)/.source + Expr.match[type].source.replace(/\\(\d+)/g, fescape));
    }

    var makeArray = function (array, results) {
      array = Array.prototype.slice.call(array, 0);

      if (results) {
        results.push.apply(results, array);
        return results;
      }

      return array;
    };

    // Perform a simple check to determine if the browser is capable of
    // converting a NodeList to an array using builtin methods.
    // Also verifies that the returned array holds DOM nodes
    // (which is not the case in the Blackberry browser)
    try {
      Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType;

      // Provide a fallback method if it does not work
    } catch (e) {
      makeArray = function (array, results) {
        let i = 0;
        const ret = results || [];

        if (toString.call(array) === '[object Array]') {
          Array.prototype.push.apply(ret, array);
        } else if (typeof array.length === 'number') {
          for (let l = array.length; i < l; i++) {
            ret.push(array[i]);
          }
        } else {
          for (; array[i]; i++) {
            ret.push(array[i]);
          }
        }

        return ret;
      };
    }

    let sortOrder; let
      siblingCheck;

    if (document.documentElement.compareDocumentPosition) {
      sortOrder = function (a, b) {
        if (a === b) {
          hasDuplicate = true;
          return 0;
        }

        if (!a.compareDocumentPosition || !b.compareDocumentPosition) {
          return a.compareDocumentPosition ? -1 : 1;
        }

        return a.compareDocumentPosition(b) & 4 ? -1 : 1;
      };
    } else {
      sortOrder = function (a, b) {
        let al; let bl;
        const ap = [];
        const bp = [];
        const aup = a.parentNode;
        const bup = b.parentNode;
        let cur = aup;

        // The nodes are identical, we can exit early
        if (a === b) {
          hasDuplicate = true;
          return 0;

          // If the nodes are siblings (or identical) we can do a quick check
        } if (aup === bup) {
          return siblingCheck(a, b);

          // If no parents were found then the nodes are disconnected
        } if (!aup) {
          return -1;
        } if (!bup) {
          return 1;
        }

        // Otherwise they're somewhere else in the tree so we need
        // to build up a full list of the parentNodes for comparison
        while (cur) {
          ap.unshift(cur);
          cur = cur.parentNode;
        }

        cur = bup;

        while (cur) {
          bp.unshift(cur);
          cur = cur.parentNode;
        }

        al = ap.length;
        bl = bp.length;

        // Start walking down the tree looking for a discrepancy
        for (var i = 0; i < al && i < bl; i++) {
          if (ap[i] !== bp[i]) {
            return siblingCheck(ap[i], bp[i]);
          }
        }

        // We ended someplace up the tree so do a sibling check
        return i === al
          ? siblingCheck(a, bp[i], -1)
          : siblingCheck(ap[i], b, 1);
      };

      siblingCheck = function (a, b, ret) {
        if (a === b) {
          return ret;
        }

        let cur = a.nextSibling;

        while (cur) {
          if (cur === b) {
            return -1;
          }

          cur = cur.nextSibling;
        }

        return 1;
      };
    }

    // Utility function for retreiving the text value of an array of DOM nodes
    Sizzle.getText = function (elems) {
      let ret = '';
      let elem;

      for (let i = 0; elems[i]; i++) {
        elem = elems[i];

        // Get the text from text nodes and CDATA nodes
        if (elem.nodeType === 3 || elem.nodeType === 4) {
          ret += elem.nodeValue;

          // Traverse everything else, except comment nodes
        } else if (elem.nodeType !== 8) {
          ret += Sizzle.getText(elem.childNodes);
        }
      }

      return ret;
    };

    // Check to see if the browser returns elements by name when
    // querying by getElementById (and provide a workaround)
    (function () {
      // We're going to inject a fake input element with a specified name
      let form = document.createElement('div');
      const id = `script${(new Date()).getTime()}`;
      let root = document.documentElement;

      form.innerHTML = `<a name='${id}'/>`;

      // Inject it into the root element, check its status, and remove it quickly
      root.insertBefore(form, root.firstChild);

      // The workaround has to do additional checks after a getElementById
      // Which slows things down for other browsers (hence the branching)
      if (document.getElementById(id)) {
        Expr.find.ID = function (match, context, isXML) {
          if (typeof context.getElementById !== 'undefined' && !isXML) {
            const m = context.getElementById(match[1]);

            return m
              ? m.id === match[1] || typeof m.getAttributeNode !== 'undefined' && m.getAttributeNode('id').nodeValue === match[1]
                ? [m]
                : undefined
              : [];
          }
        };

        Expr.filter.ID = function (elem, match) {
          const node = typeof elem.getAttributeNode !== 'undefined' && elem.getAttributeNode('id');

          return elem.nodeType === 1 && node && node.nodeValue === match;
        };
      }

      root.removeChild(form);

      // release memory in IE
      root = form = null;
    }());

    (function () {
      // Check to see if the browser returns only elements
      // when doing getElementsByTagName("*")

      // Create a fake element
      let div = document.createElement('div');
      div.appendChild(document.createComment(''));

      // Make sure no comments are found
      if (div.getElementsByTagName('*').length > 0) {
        Expr.find.TAG = function (match, context) {
          let results = context.getElementsByTagName(match[1]);

          // Filter out possible comments
          if (match[1] === '*') {
            const tmp = [];

            for (let i = 0; results[i]; i++) {
              if (results[i].nodeType === 1) {
                tmp.push(results[i]);
              }
            }

            results = tmp;
          }

          return results;
        };
      }

      // Check to see if an attribute returns normalized href attributes
      div.innerHTML = "<a href='#'></a>";

      if (div.firstChild && typeof div.firstChild.getAttribute !== 'undefined'
			&& div.firstChild.getAttribute('href') !== '#') {
        Expr.attrHandle.href = function (elem) {
          return elem.getAttribute('href', 2);
        };
      }

      // release memory in IE
      div = null;
    }());

    if (document.querySelectorAll) {
      (function () {
        const oldSizzle = Sizzle;
        let div = document.createElement('div');
        const id = '__sizzle__';

        div.innerHTML = "<p class='TEST'></p>";

        // Safari can't handle uppercase or unicode characters when
        // in quirks mode.
        if (div.querySelectorAll && div.querySelectorAll('.TEST').length === 0) {
          return;
        }

        Sizzle = function (query, context, extra, seed) {
          context = context || document;

          // Make sure that attribute selectors are quoted
          query = query.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

          // Only use querySelectorAll on non-XML documents
          // (ID selectors don't work in non-HTML documents)
          if (!seed && !Sizzle.isXML(context)) {
            if (context.nodeType === 9) {
              try {
                return makeArray(context.querySelectorAll(query), extra);
              } catch (qsaError) {}

              // qSA works strangely on Element-rooted queries
              // We can work around this by specifying an extra ID on the root
              // and working up from there (Thanks to Andrew Dupont for the technique)
              // IE 8 doesn't work on object elements
            } else if (context.nodeType === 1 && context.nodeName.toLowerCase() !== 'object') {
              const old = context.getAttribute('id');
              const nid = old || id;

              if (!old) {
                context.setAttribute('id', nid);
              }

              try {
                return makeArray(context.querySelectorAll(`#${nid} ${query}`), extra);
              } catch (pseudoError) {
              } finally {
                if (!old) {
                  context.removeAttribute('id');
                }
              }
            }
          }

          return oldSizzle(query, context, extra, seed);
        };

        for (const prop in oldSizzle) {
          Sizzle[prop] = oldSizzle[prop];
        }

        // release memory in IE
        div = null;
      }());
    }

    (function () {
      const html = document.documentElement;
      const matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;
      let pseudoWorks = false;

      try {
        // This should fail with an exception
        // Gecko does not error, returns false instead
        matches.call(document.documentElement, "[test!='']:sizzle");
      } catch (pseudoError) {
        pseudoWorks = true;
      }

      if (matches) {
        Sizzle.matchesSelector = function (node, expr) {
          // Make sure that attribute selectors are quoted
          expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

          if (!Sizzle.isXML(node)) {
            try {
              if (pseudoWorks || !Expr.match.PSEUDO.test(expr) && !/!=/.test(expr)) {
                return matches.call(node, expr);
              }
            } catch (e) {}
          }

          return Sizzle(expr, null, null, [node]).length > 0;
        };
      }
    }());

    (function () {
      let div = document.createElement('div');

      div.innerHTML = "<div class='test e'></div><div class='test'></div>";

      // Opera can't find a second classname (in 9.6)
      // Also, make sure that getElementsByClassName actually exists
      if (!div.getElementsByClassName || div.getElementsByClassName('e').length === 0) {
        return;
      }

      // Safari caches class attributes, doesn't catch changes (in 3.2)
      div.lastChild.className = 'e';

      if (div.getElementsByClassName('e').length === 1) {
        return;
      }

      Expr.order.splice(1, 0, 'CLASS');
      Expr.find.CLASS = function (match, context, isXML) {
        if (typeof context.getElementsByClassName !== 'undefined' && !isXML) {
          return context.getElementsByClassName(match[1]);
        }
      };

      // release memory in IE
      div = null;
    }());

    function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
      for (let i = 0, l = checkSet.length; i < l; i++) {
        let elem = checkSet[i];

        if (elem) {
          let match = false;

          elem = elem[dir];

          while (elem) {
            if (elem.sizcache === doneName) {
              match = checkSet[elem.sizset];
              break;
            }

            if (elem.nodeType === 1 && !isXML) {
              elem.sizcache = doneName;
              elem.sizset = i;
            }

            if (elem.nodeName.toLowerCase() === cur) {
              match = elem;
              break;
            }

            elem = elem[dir];
          }

          checkSet[i] = match;
        }
      }
    }

    function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
      for (let i = 0, l = checkSet.length; i < l; i++) {
        let elem = checkSet[i];

        if (elem) {
          let match = false;

          elem = elem[dir];

          while (elem) {
            if (elem.sizcache === doneName) {
              match = checkSet[elem.sizset];
              break;
            }

            if (elem.nodeType === 1) {
              if (!isXML) {
                elem.sizcache = doneName;
                elem.sizset = i;
              }

              if (typeof cur !== 'string') {
                if (elem === cur) {
                  match = true;
                  break;
                }
              } else if (Sizzle.filter(cur, [elem]).length > 0) {
                match = elem;
                break;
              }
            }

            elem = elem[dir];
          }

          checkSet[i] = match;
        }
      }
    }

    if (document.documentElement.contains) {
      Sizzle.contains = function (a, b) {
        return a !== b && (a.contains ? a.contains(b) : true);
      };
    } else if (document.documentElement.compareDocumentPosition) {
      Sizzle.contains = function (a, b) {
        return !!(a.compareDocumentPosition(b) & 16);
      };
    } else {
      Sizzle.contains = function () {
        return false;
      };
    }

    Sizzle.isXML = function (elem) {
      // documentElement is verified for cases where it doesn't yet exist
      // (such as loading iframes in IE - #4833)
      const { documentElement } = elem ? elem.ownerDocument || elem : 0;

      return documentElement ? documentElement.nodeName !== 'HTML' : false;
    };

    var posProcess = function (selector, context) {
      let match;
      const tmpSet = [];
      let later = '';
      const root = context.nodeType ? [context] : context;

      // Position selectors must be done after the filter
      // And so must :not(positional) so we move all PSEUDOs to the end
      while ((match = Expr.match.PSEUDO.exec(selector))) {
        later += match[0];
        selector = selector.replace(Expr.match.PSEUDO, '');
      }

      selector = Expr.relative[selector] ? `${selector}*` : selector;

      for (let i = 0, l = root.length; i < l; i++) {
        Sizzle(selector, root[i], tmpSet);
      }

      return Sizzle.filter(later, tmpSet);
    };

    // EXPOSE
    jQuery.find = Sizzle;
    jQuery.expr = Sizzle.selectors;
    jQuery.expr[':'] = jQuery.expr.filters;
    jQuery.unique = Sizzle.uniqueSort;
    jQuery.text = Sizzle.getText;
    jQuery.isXMLDoc = Sizzle.isXML;
    jQuery.contains = Sizzle.contains;
  }());

  const runtil = /Until$/;
  const rparentsprev = /^(?:parents|prevUntil|prevAll)/;
  // Note: This RegExp should be improved, or likely pulled from Sizzle
  const rmultiselector = /,/;
  const isSimple = /^.[^:#\[\.,]*$/;
  const { slice } = Array.prototype;
  const { POS } = jQuery.expr.match;

  jQuery.fn.extend({
    find(selector) {
      const ret = this.pushStack('', 'find', selector);
      let length = 0;

      for (let i = 0, l = this.length; i < l; i++) {
        length = ret.length;
        jQuery.find(selector, this[i], ret);

        if (i > 0) {
          // Make sure that the results are unique
          for (let n = length; n < ret.length; n++) {
            for (let r = 0; r < length; r++) {
              if (ret[r] === ret[n]) {
                ret.splice(n--, 1);
                break;
              }
            }
          }
        }
      }

      return ret;
    },

    has(target) {
      const targets = jQuery(target);
      return this.filter(function () {
        for (let i = 0, l = targets.length; i < l; i++) {
          if (jQuery.contains(this, targets[i])) {
            return true;
          }
        }
      });
    },

    not(selector) {
      return this.pushStack(winnow(this, selector, false), 'not', selector);
    },

    filter(selector) {
      return this.pushStack(winnow(this, selector, true), 'filter', selector);
    },

    is(selector) {
      return !!selector && jQuery.filter(selector, this).length > 0;
    },

    closest(selectors, context) {
      let ret = []; let i; let l; let
        cur = this[0];

      if (jQuery.isArray(selectors)) {
        let match; let selector;
        const matches = {};
        let level = 1;

        if (cur && selectors.length) {
          for (i = 0, l = selectors.length; i < l; i++) {
            selector = selectors[i];

            if (!matches[selector]) {
              matches[selector] = jQuery.expr.match.POS.test(selector)
                ? jQuery(selector, context || this.context)
                : selector;
            }
          }

          while (cur && cur.ownerDocument && cur !== context) {
            for (selector in matches) {
              match = matches[selector];

              if (match.jquery ? match.index(cur) > -1 : jQuery(cur).is(match)) {
                ret.push({ selector, elem: cur, level });
              }
            }

            cur = cur.parentNode;
            level++;
          }
        }

        return ret;
      }

      const pos = POS.test(selectors)
        ? jQuery(selectors, context || this.context) : null;

      for (i = 0, l = this.length; i < l; i++) {
        cur = this[i];

        while (cur) {
          if (pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors)) {
            ret.push(cur);
            break;
          } else {
            cur = cur.parentNode;
            if (!cur || !cur.ownerDocument || cur === context) {
              break;
            }
          }
        }
      }

      ret = ret.length > 1 ? jQuery.unique(ret) : ret;

      return this.pushStack(ret, 'closest', selectors);
    },

    // Determine the position of an element within
    // the matched set of elements
    index(elem) {
      if (!elem || typeof elem === 'string') {
        return jQuery.inArray(this[0],
          // If it receives a string, the selector is used
          // If it receives nothing, the siblings are used
          elem ? jQuery(elem) : this.parent().children());
      }
      // Locate the position of the desired element
      return jQuery.inArray(
        // If it receives a jQuery object, the first element is used
        elem.jquery ? elem[0] : elem, this,
      );
    },

    add(selector, context) {
      const set = typeof selector === 'string'
        ? jQuery(selector, context || this.context)
        : jQuery.makeArray(selector);
      const all = jQuery.merge(this.get(), set);

      return this.pushStack(isDisconnected(set[0]) || isDisconnected(all[0])
        ? all
        : jQuery.unique(all));
    },

    andSelf() {
      return this.add(this.prevObject);
    },
  });

  // A painfully simple check to see if an element is disconnected
  // from a document (should be improved, where feasible).
  function isDisconnected(node) {
    return !node || !node.parentNode || node.parentNode.nodeType === 11;
  }

  jQuery.each({
    parent(elem) {
      const parent = elem.parentNode;
      return parent && parent.nodeType !== 11 ? parent : null;
    },
    parents(elem) {
      return jQuery.dir(elem, 'parentNode');
    },
    parentsUntil(elem, i, until) {
      return jQuery.dir(elem, 'parentNode', until);
    },
    next(elem) {
      return jQuery.nth(elem, 2, 'nextSibling');
    },
    prev(elem) {
      return jQuery.nth(elem, 2, 'previousSibling');
    },
    nextAll(elem) {
      return jQuery.dir(elem, 'nextSibling');
    },
    prevAll(elem) {
      return jQuery.dir(elem, 'previousSibling');
    },
    nextUntil(elem, i, until) {
      return jQuery.dir(elem, 'nextSibling', until);
    },
    prevUntil(elem, i, until) {
      return jQuery.dir(elem, 'previousSibling', until);
    },
    siblings(elem) {
      return jQuery.sibling(elem.parentNode.firstChild, elem);
    },
    children(elem) {
      return jQuery.sibling(elem.firstChild);
    },
    contents(elem) {
      return jQuery.nodeName(elem, 'iframe')
        ? elem.contentDocument || elem.contentWindow.document
        : jQuery.makeArray(elem.childNodes);
    },
  }, (name, fn) => {
    jQuery.fn[name] = function (until, selector) {
      let ret = jQuery.map(this, fn, until);

      if (!runtil.test(name)) {
        selector = until;
      }

      if (selector && typeof selector === 'string') {
        ret = jQuery.filter(selector, ret);
      }

      ret = this.length > 1 ? jQuery.unique(ret) : ret;

      if ((this.length > 1 || rmultiselector.test(selector)) && rparentsprev.test(name)) {
        ret = ret.reverse();
      }

      return this.pushStack(ret, name, slice.call(arguments).join(','));
    };
  });

  jQuery.extend({
    filter(expr, elems, not) {
      if (not) {
        expr = `:not(${expr})`;
      }

      return elems.length === 1
        ? jQuery.find.matchesSelector(elems[0], expr) ? [elems[0]] : []
        : jQuery.find.matches(expr, elems);
    },

    dir(elem, dir, until) {
      const matched = [];
      let cur = elem[dir];

      while (cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery(cur).is(until))) {
        if (cur.nodeType === 1) {
          matched.push(cur);
        }
        cur = cur[dir];
      }
      return matched;
    },

    nth(cur, result, dir, elem) {
      result = result || 1;
      let num = 0;

      for (; cur; cur = cur[dir]) {
        if (cur.nodeType === 1 && ++num === result) {
          break;
        }
      }

      return cur;
    },

    sibling(n, elem) {
      const r = [];

      for (; n; n = n.nextSibling) {
        if (n.nodeType === 1 && n !== elem) {
          r.push(n);
        }
      }

      return r;
    },
  });

  // Implement the identical functionality for filter and not
  function winnow(elements, qualifier, keep) {
    if (jQuery.isFunction(qualifier)) {
      return jQuery.grep(elements, (elem, i) => {
        const retVal = !!qualifier.call(elem, i, elem);
        return retVal === keep;
      });
    } if (qualifier.nodeType) {
      return jQuery.grep(elements, (elem, i) => (elem === qualifier) === keep);
    } if (typeof qualifier === 'string') {
      const filtered = jQuery.grep(elements, (elem) => elem.nodeType === 1);

      if (isSimple.test(qualifier)) {
        return jQuery.filter(qualifier, filtered, !keep);
      }
      qualifier = jQuery.filter(qualifier, filtered);
    }

    return jQuery.grep(elements, (elem, i) => (jQuery.inArray(elem, qualifier) >= 0) === keep);
  }

  const rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g;
  const rleadingWhitespace = /^\s+/;
  const rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig;
  const rtagName = /<([\w:]+)/;
  const rtbody = /<tbody/i;
  const rhtml = /<|&#?\w+;/;
  const rnocache = /<(?:script|object|embed|option|style)/i;
  // checked="checked" or checked (html5)
  const rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i;
  const raction = /\=([^="'>\s]+\/)>/g;
  const wrapMap = {
    option: [1, "<select multiple='multiple'>", '</select>'],
    legend: [1, '<fieldset>', '</fieldset>'],
    thead: [1, '<table>', '</table>'],
    tr: [2, '<table><tbody>', '</tbody></table>'],
    td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
    col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
    area: [1, '<map>', '</map>'],
    _default: [0, '', ''],
  };

  wrapMap.optgroup = wrapMap.option;
  wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
  wrapMap.th = wrapMap.td;

  // IE can't serialize <link> and <script> tags normally
  if (!jQuery.support.htmlSerialize) {
    wrapMap._default = [1, 'div<div>', '</div>'];
  }

  jQuery.fn.extend({
    text(text) {
      if (jQuery.isFunction(text)) {
        return this.each(function (i) {
          const self = jQuery(this);

          self.text(text.call(this, i, self.text()));
        });
      }

      if (typeof text !== 'object' && text !== undefined) {
        return this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(text));
      }

      return jQuery.text(this);
    },

    wrapAll(html) {
      if (jQuery.isFunction(html)) {
        return this.each(function (i) {
          jQuery(this).wrapAll(html.call(this, i));
        });
      }

      if (this[0]) {
        // The elements to wrap the target around
        const wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

        if (this[0].parentNode) {
          wrap.insertBefore(this[0]);
        }

        wrap.map(function () {
          let elem = this;

          while (elem.firstChild && elem.firstChild.nodeType === 1) {
            elem = elem.firstChild;
          }

          return elem;
        }).append(this);
      }

      return this;
    },

    wrapInner(html) {
      if (jQuery.isFunction(html)) {
        return this.each(function (i) {
          jQuery(this).wrapInner(html.call(this, i));
        });
      }

      return this.each(function () {
        const self = jQuery(this);
        const contents = self.contents();

        if (contents.length) {
          contents.wrapAll(html);
        } else {
          self.append(html);
        }
      });
    },

    wrap(html) {
      return this.each(function () {
        jQuery(this).wrapAll(html);
      });
    },

    unwrap() {
      return this.parent().each(function () {
        if (!jQuery.nodeName(this, 'body')) {
          jQuery(this).replaceWith(this.childNodes);
        }
      }).end();
    },

    append() {
      return this.domManip(arguments, true, function (elem) {
        if (this.nodeType === 1) {
          this.appendChild(elem);
        }
      });
    },

    prepend() {
      return this.domManip(arguments, true, function (elem) {
        if (this.nodeType === 1) {
          this.insertBefore(elem, this.firstChild);
        }
      });
    },

    before() {
      if (this[0] && this[0].parentNode) {
        return this.domManip(arguments, false, function (elem) {
          this.parentNode.insertBefore(elem, this);
        });
      } if (arguments.length) {
        const set = jQuery(arguments[0]);
        set.push.apply(set, this.toArray());
        return this.pushStack(set, 'before', arguments);
      }
    },

    after() {
      if (this[0] && this[0].parentNode) {
        return this.domManip(arguments, false, function (elem) {
          this.parentNode.insertBefore(elem, this.nextSibling);
        });
      } if (arguments.length) {
        const set = this.pushStack(this, 'after', arguments);
        set.push.apply(set, jQuery(arguments[0]).toArray());
        return set;
      }
    },

    // keepData is for internal use only--do not document
    remove(selector, keepData) {
      for (var i = 0, elem; (elem = this[i]) != null; i++) {
        if (!selector || jQuery.filter(selector, [elem]).length) {
          if (!keepData && elem.nodeType === 1) {
            jQuery.cleanData(elem.getElementsByTagName('*'));
            jQuery.cleanData([elem]);
          }

          if (elem.parentNode) {
					 elem.parentNode.removeChild(elem);
          }
        }
      }

      return this;
    },

    empty() {
      for (var i = 0, elem; (elem = this[i]) != null; i++) {
        // Remove element nodes and prevent memory leaks
        if (elem.nodeType === 1) {
          jQuery.cleanData(elem.getElementsByTagName('*'));
        }

        // Remove any remaining nodes
        while (elem.firstChild) {
          elem.removeChild(elem.firstChild);
        }
      }

      return this;
    },

    clone(events) {
      // Do the clone
      const ret = this.map(function () {
        if (!jQuery.support.noCloneEvent && !jQuery.isXMLDoc(this)) {
          // IE copies events bound via attachEvent when
          // using cloneNode. Calling detachEvent on the
          // clone will also remove the events from the orignal
          // In order to get around this, we use innerHTML.
          // Unfortunately, this means some modifications to
          // attributes in IE that are actually only stored
          // as properties will not be copied (such as the
          // the name attribute on an input).
          let html = this.outerHTML;
          const { ownerDocument } = this;

          if (!html) {
            const div = ownerDocument.createElement('div');
            div.appendChild(this.cloneNode(true));
            html = div.innerHTML;
          }

          return jQuery.clean([html.replace(rinlinejQuery, '')
          // Handle the case in IE 8 where action=/test/> self-closes a tag
            .replace(raction, '="$1">')
            .replace(rleadingWhitespace, '')], ownerDocument)[0];
        }
        return this.cloneNode(true);
      });

      // Copy the events from the original to the clone
      if (events === true) {
        cloneCopyEvent(this, ret);
        cloneCopyEvent(this.find('*'), ret.find('*'));
      }

      // Return the cloned set
      return ret;
    },

    html(value) {
      if (value === undefined) {
        return this[0] && this[0].nodeType === 1
          ? this[0].innerHTML.replace(rinlinejQuery, '')
          : null;

        // See if we can take a shortcut and just use innerHTML
      } if (typeof value === 'string' && !rnocache.test(value)
			&& (jQuery.support.leadingWhitespace || !rleadingWhitespace.test(value))
			&& !wrapMap[(rtagName.exec(value) || ['', ''])[1].toLowerCase()]) {
        value = value.replace(rxhtmlTag, '<$1></$2>');

        try {
          for (let i = 0, l = this.length; i < l; i++) {
            // Remove element nodes and prevent memory leaks
            if (this[i].nodeType === 1) {
              jQuery.cleanData(this[i].getElementsByTagName('*'));
              this[i].innerHTML = value;
            }
          }

          // If using innerHTML throws an exception, use the fallback method
        } catch (e) {
          this.empty().append(value);
        }
      } else if (jQuery.isFunction(value)) {
        this.each(function (i) {
          const self = jQuery(this);

          self.html(value.call(this, i, self.html()));
        });
      } else {
        this.empty().append(value);
      }

      return this;
    },

    replaceWith(value) {
      if (this[0] && this[0].parentNode) {
        // Make sure that the elements are removed from the DOM before they are inserted
        // this can help fix replacing a parent with child elements
        if (jQuery.isFunction(value)) {
          return this.each(function (i) {
            const self = jQuery(this); const
              old = self.html();
            self.replaceWith(value.call(this, i, old));
          });
        }

        if (typeof value !== 'string') {
          value = jQuery(value).detach();
        }

        return this.each(function () {
          const next = this.nextSibling;
          const parent = this.parentNode;

          jQuery(this).remove();

          if (next) {
            jQuery(next).before(value);
          } else {
            jQuery(parent).append(value);
          }
        });
      }
      return this.pushStack(jQuery(jQuery.isFunction(value) ? value() : value), 'replaceWith', value);
    },

    detach(selector) {
      return this.remove(selector, true);
    },

    domManip(args, table, callback) {
      let results; let first; let fragment; let parent;
      const value = args[0];
      const scripts = [];

      // We can't cloneNode fragments that contain checked, in WebKit
      if (!jQuery.support.checkClone && arguments.length === 3 && typeof value === 'string' && rchecked.test(value)) {
        return this.each(function () {
          jQuery(this).domManip(args, table, callback, true);
        });
      }

      if (jQuery.isFunction(value)) {
        return this.each(function (i) {
          const self = jQuery(this);
          args[0] = value.call(this, i, table ? self.html() : undefined);
          self.domManip(args, table, callback);
        });
      }

      if (this[0]) {
        parent = value && value.parentNode;

        // If we're in a fragment, just use that instead of building a new one
        if (jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length) {
          results = { fragment: parent };
        } else {
          results = jQuery.buildFragment(args, this, scripts);
        }

        fragment = results.fragment;

        if (fragment.childNodes.length === 1) {
          first = fragment = fragment.firstChild;
        } else {
          first = fragment.firstChild;
        }

        if (first) {
          table = table && jQuery.nodeName(first, 'tr');

          for (let i = 0, l = this.length; i < l; i++) {
            callback.call(
              table
                ? root(this[i], first)
                : this[i],
              i > 0 || results.cacheable || this.length > 1
                ? fragment.cloneNode(true)
                : fragment,
            );
          }
        }

        if (scripts.length) {
          jQuery.each(scripts, evalScript);
        }
      }

      return this;
    },
  });

  function root(elem, cur) {
    return jQuery.nodeName(elem, 'table')
      ? (elem.getElementsByTagName('tbody')[0]
		|| elem.appendChild(elem.ownerDocument.createElement('tbody')))
      : elem;
  }

  function cloneCopyEvent(orig, ret) {
    let i = 0;

    ret.each(function () {
      if (this.nodeName !== (orig[i] && orig[i].nodeName)) {
        return;
      }

      const oldData = jQuery.data(orig[i++]);
      const curData = jQuery.data(this, oldData);
      const events = oldData && oldData.events;

      if (events) {
        delete curData.handle;
        curData.events = {};

        for (const type in events) {
          for (const handler in events[type]) {
            jQuery.event.add(this, type, events[type][handler], events[type][handler].data);
          }
        }
      }
    });
  }

  jQuery.buildFragment = function (args, nodes, scripts) {
    let fragment; let cacheable; let cacheresults;
    const doc = (nodes && nodes[0] ? nodes[0].ownerDocument || nodes[0] : document);

    // Only cache "small" (1/2 KB) strings that are associated with the main document
    // Cloning options loses the selected state, so don't cache them
    // IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
    // Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
    if (args.length === 1 && typeof args[0] === 'string' && args[0].length < 512 && doc === document
		&& !rnocache.test(args[0]) && (jQuery.support.checkClone || !rchecked.test(args[0]))) {
      cacheable = true;
      cacheresults = jQuery.fragments[args[0]];
      if (cacheresults) {
        if (cacheresults !== 1) {
          fragment = cacheresults;
        }
      }
    }

    if (!fragment) {
      fragment = doc.createDocumentFragment();
      jQuery.clean(args, doc, fragment, scripts);
    }

    if (cacheable) {
      jQuery.fragments[args[0]] = cacheresults ? fragment : 1;
    }

    return { fragment, cacheable };
  };

  jQuery.fragments = {};

  jQuery.each({
    appendTo: 'append',
    prependTo: 'prepend',
    insertBefore: 'before',
    insertAfter: 'after',
    replaceAll: 'replaceWith',
  }, (name, original) => {
    jQuery.fn[name] = function (selector) {
      let ret = [];
      const insert = jQuery(selector);
      const parent = this.length === 1 && this[0].parentNode;

      if (parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1) {
        insert[original](this[0]);
        return this;
      }
      for (let i = 0, l = insert.length; i < l; i++) {
        const elems = (i > 0 ? this.clone(true) : this).get();
        jQuery(insert[i])[original](elems);
        ret = ret.concat(elems);
      }

      return this.pushStack(ret, name, insert.selector);
    };
  });

  jQuery.extend({
    clean(elems, context, fragment, scripts) {
      context = context || document;

      // !context.createElement fails in IE with an error but returns typeof 'object'
      if (typeof context.createElement === 'undefined') {
        context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
      }

      let ret = [];

      for (var i = 0, elem; (elem = elems[i]) != null; i++) {
        if (typeof elem === 'number') {
          elem += '';
        }

        if (!elem) {
          continue;
        }

        // Convert html string into DOM nodes
        if (typeof elem === 'string' && !rhtml.test(elem)) {
          elem = context.createTextNode(elem);
        } else if (typeof elem === 'string') {
          // Fix "XHTML"-style tags in all browsers
          elem = elem.replace(rxhtmlTag, '<$1></$2>');

          // Trim whitespace, otherwise indexOf won't work as expected
          const tag = (rtagName.exec(elem) || ['', ''])[1].toLowerCase();
          const wrap = wrapMap[tag] || wrapMap._default;
          let depth = wrap[0];
          let div = context.createElement('div');

          // Go to html and back, then peel off extra wrappers
          div.innerHTML = wrap[1] + elem + wrap[2];

          // Move to the right depth
          while (depth--) {
            div = div.lastChild;
          }

          // Remove IE's autoinserted <tbody> from table fragments
          if (!jQuery.support.tbody) {
            // String was a <table>, *may* have spurious <tbody>
            const hasBody = rtbody.test(elem);
            const tbody = tag === 'table' && !hasBody
              ? div.firstChild && div.firstChild.childNodes

            // String was a bare <thead> or <tfoot>
              : wrap[1] === '<table>' && !hasBody
                ? div.childNodes
                : [];

            for (let j = tbody.length - 1; j >= 0; --j) {
              if (jQuery.nodeName(tbody[j], 'tbody') && !tbody[j].childNodes.length) {
                tbody[j].parentNode.removeChild(tbody[j]);
              }
            }
          }

          // IE completely kills leading whitespace when innerHTML is used
          if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(elem)) {
            div.insertBefore(context.createTextNode(rleadingWhitespace.exec(elem)[0]), div.firstChild);
          }

          elem = div.childNodes;
        }

        if (elem.nodeType) {
          ret.push(elem);
        } else {
          ret = jQuery.merge(ret, elem);
        }
      }

      if (fragment) {
        for (i = 0; ret[i]; i++) {
          if (scripts && jQuery.nodeName(ret[i], 'script') && (!ret[i].type || ret[i].type.toLowerCase() === 'text/javascript')) {
            scripts.push(ret[i].parentNode ? ret[i].parentNode.removeChild(ret[i]) : ret[i]);
          } else {
            if (ret[i].nodeType === 1) {
              ret.splice.apply(ret, [i + 1, 0].concat(jQuery.makeArray(ret[i].getElementsByTagName('script'))));
            }
            fragment.appendChild(ret[i]);
          }
        }
      }

      return ret;
    },

    cleanData(elems) {
      let data; let id; const { cache } = jQuery;
      const { special } = jQuery.event;
      const { deleteExpando } = jQuery.support;

      for (var i = 0, elem; (elem = elems[i]) != null; i++) {
        if (elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) {
          continue;
        }

        id = elem[jQuery.expando];

        if (id) {
          data = cache[id];

          if (data && data.events) {
            for (const type in data.events) {
              if (special[type]) {
                jQuery.event.remove(elem, type);
              } else {
                jQuery.removeEvent(elem, type, data.handle);
              }
            }
          }

          if (deleteExpando) {
            delete elem[jQuery.expando];
          } else if (elem.removeAttribute) {
            elem.removeAttribute(jQuery.expando);
          }

          delete cache[id];
        }
      }
    },
  });

  function evalScript(i, elem) {
    if (elem.src) {
      jQuery.ajax({
        url: elem.src,
        async: false,
        dataType: 'script',
      });
    } else {
      jQuery.globalEval(elem.text || elem.textContent || elem.innerHTML || '');
    }

    if (elem.parentNode) {
      elem.parentNode.removeChild(elem);
    }
  }

  const ralpha = /alpha\([^)]*\)/i;
  const ropacity = /opacity=([^)]*)/;
  const rdashAlpha = /-([a-z])/ig;
  const rupper = /([A-Z])/g;
  const rnumpx = /^-?\d+(?:px)?$/i;
  const rnum = /^-?\d/;

  const cssShow = { position: 'absolute', visibility: 'hidden', display: 'block' };
  const cssWidth = ['Left', 'Right'];
  const cssHeight = ['Top', 'Bottom'];
  let curCSS;

  let getComputedStyle;
  let currentStyle;

  const fcamelCase = function (all, letter) {
    return letter.toUpperCase();
  };

  jQuery.fn.css = function (name, value) {
    // Setting 'undefined' is a no-op
    if (arguments.length === 2 && value === undefined) {
      return this;
    }

    return jQuery.access(this, name, value, true, (elem, name, value) => (value !== undefined
      ? jQuery.style(elem, name, value)
      : jQuery.css(elem, name)));
  };

  jQuery.extend({
    // Add in style property hooks for overriding the default
    // behavior of getting and setting a style property
    cssHooks: {
      opacity: {
        get(elem, computed) {
          if (computed) {
            // We should always get a number back from opacity
            const ret = curCSS(elem, 'opacity', 'opacity');
            return ret === '' ? '1' : ret;
          }
          return elem.style.opacity;
        },
      },
    },

    // Exclude the following css properties to add px
    cssNumber: {
      zIndex: true,
      fontWeight: true,
      opacity: true,
      zoom: true,
      lineHeight: true,
    },

    // Add in properties whose names you wish to fix before
    // setting or getting the value
    cssProps: {
      // normalize float css property
      float: jQuery.support.cssFloat ? 'cssFloat' : 'styleFloat',
    },

    // Get and set the style property on a DOM Node
    style(elem, name, value, extra) {
      // Don't set styles on text and comment nodes
      if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
        return;
      }

      // Make sure that we're working with the right name
      let ret; const origName = jQuery.camelCase(name);
      const { style } = elem; const
        hooks = jQuery.cssHooks[origName];

      name = jQuery.cssProps[origName] || origName;

      // Check if we're setting a value
      if (value !== undefined) {
        // Make sure that NaN and null values aren't set. See: #7116
        if (typeof value === 'number' && isNaN(value) || value == null) {
          return;
        }

        // If a number was passed in, add 'px' to the (except for certain CSS properties)
        if (typeof value === 'number' && !jQuery.cssNumber[origName]) {
          value += 'px';
        }

        // If a hook was provided, use that value, otherwise just set the specified value
        if (!hooks || !('set' in hooks) || (value = hooks.set(elem, value)) !== undefined) {
          // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
          // Fixes bug #5509
          try {
            style[name] = value;
          } catch (e) {}
        }
      } else {
        // If a hook was provided get the non-computed value from there
        if (hooks && 'get' in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
          return ret;
        }

        // Otherwise just get the value from the style object
        return style[name];
      }
    },

    css(elem, name, extra) {
      // Make sure that we're working with the right name
      let ret; const origName = jQuery.camelCase(name);
      const hooks = jQuery.cssHooks[origName];

      name = jQuery.cssProps[origName] || origName;

      // If a hook was provided get the computed value from there
      if (hooks && 'get' in hooks && (ret = hooks.get(elem, true, extra)) !== undefined) {
        return ret;

        // Otherwise, if a way to get the computed value exists, use that
      } if (curCSS) {
        return curCSS(elem, name, origName);
      }
    },

    // A method for quickly swapping in/out CSS properties to get correct calculations
    swap(elem, options, callback) {
      const old = {};

      // Remember the old values, and insert the new ones
      for (var name in options) {
        old[name] = elem.style[name];
        elem.style[name] = options[name];
      }

      callback.call(elem);

      // Revert the old values
      for (name in options) {
        elem.style[name] = old[name];
      }
    },

    camelCase(string) {
      return string.replace(rdashAlpha, fcamelCase);
    },
  });

  // DEPRECATED, Use jQuery.css() instead
  jQuery.curCSS = jQuery.css;

  jQuery.each(['height', 'width'], (i, name) => {
    jQuery.cssHooks[name] = {
      get(elem, computed, extra) {
        let val;

        if (computed) {
          if (elem.offsetWidth !== 0) {
            val = getWH(elem, name, extra);
          } else {
            jQuery.swap(elem, cssShow, () => {
              val = getWH(elem, name, extra);
            });
          }

          if (val <= 0) {
            val = curCSS(elem, name, name);

            if (val === '0px' && currentStyle) {
              val = currentStyle(elem, name, name);
            }

            if (val != null) {
              // Should return "auto" instead of 0, use 0 for
              // temporary backwards-compat
              return val === '' || val === 'auto' ? '0px' : val;
            }
          }

          if (val < 0 || val == null) {
            val = elem.style[name];

            // Should return "auto" instead of 0, use 0 for
            // temporary backwards-compat
            return val === '' || val === 'auto' ? '0px' : val;
          }

          return typeof val === 'string' ? val : `${val}px`;
        }
      },

      set(elem, value) {
        if (rnumpx.test(value)) {
          // ignore negative width and height values #1599
          value = parseFloat(value);

          if (value >= 0) {
            return `${value}px`;
          }
        } else {
          return value;
        }
      },
    };
  });

  if (!jQuery.support.opacity) {
    jQuery.cssHooks.opacity = {
      get(elem, computed) {
        // IE uses filters for opacity
        return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || '')
          ? `${parseFloat(RegExp.$1) / 100}`
          : computed ? '1' : '';
      },

      set(elem, value) {
        const { style } = elem;

        // IE has trouble with opacity if it does not have layout
        // Force it by setting the zoom level
        style.zoom = 1;

        // Set the alpha filter to set the opacity
        const opacity = jQuery.isNaN(value)
          ? ''
          : `alpha(opacity=${value * 100})`;
        const filter = style.filter || '';

        style.filter = ralpha.test(filter)
          ? filter.replace(ralpha, opacity)
          : `${style.filter} ${opacity}`;
      },
    };
  }

  if (document.defaultView && document.defaultView.getComputedStyle) {
    getComputedStyle = function (elem, newName, name) {
      let ret; let defaultView; let
        computedStyle;

      name = name.replace(rupper, '-$1').toLowerCase();

      if (!(defaultView = elem.ownerDocument.defaultView)) {
        return undefined;
      }

      if ((computedStyle = defaultView.getComputedStyle(elem, null))) {
        ret = computedStyle.getPropertyValue(name);
        if (ret === '' && !jQuery.contains(elem.ownerDocument.documentElement, elem)) {
          ret = jQuery.style(elem, name);
        }
      }

      return ret;
    };
  }

  if (document.documentElement.currentStyle) {
    currentStyle = function (elem, name) {
      let left; let rsLeft;
      let ret = elem.currentStyle && elem.currentStyle[name];
      const { style } = elem;

      // From the awesome hack by Dean Edwards
      // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

      // If we're not dealing with a regular pixel number
      // but a number that has a weird ending, we need to convert it to pixels
      if (!rnumpx.test(ret) && rnum.test(ret)) {
        // Remember the original values
        left = style.left;
        rsLeft = elem.runtimeStyle.left;

        // Put in the new values to get a computed value out
        elem.runtimeStyle.left = elem.currentStyle.left;
        style.left = name === 'fontSize' ? '1em' : (ret || 0);
        ret = `${style.pixelLeft}px`;

        // Revert the changed values
        style.left = left;
        elem.runtimeStyle.left = rsLeft;
      }

      return ret === '' ? 'auto' : ret;
    };
  }

  curCSS = getComputedStyle || currentStyle;

  function getWH(elem, name, extra) {
    const which = name === 'width' ? cssWidth : cssHeight;
    let val = name === 'width' ? elem.offsetWidth : elem.offsetHeight;

    if (extra === 'border') {
      return val;
    }

    jQuery.each(which, function () {
      if (!extra) {
        val -= parseFloat(jQuery.css(elem, `padding${this}`)) || 0;
      }

      if (extra === 'margin') {
        val += parseFloat(jQuery.css(elem, `margin${this}`)) || 0;
      } else {
        val -= parseFloat(jQuery.css(elem, `border${this}Width`)) || 0;
      }
    });

    return val;
  }

  if (jQuery.expr && jQuery.expr.filters) {
    jQuery.expr.filters.hidden = function (elem) {
      const width = elem.offsetWidth;
      const height = elem.offsetHeight;

      return (width === 0 && height === 0) || (!jQuery.support.reliableHiddenOffsets && (elem.style.display || jQuery.css(elem, 'display')) === 'none');
    };

    jQuery.expr.filters.visible = function (elem) {
      return !jQuery.expr.filters.hidden(elem);
    };
  }

  let jsc = jQuery.now();
  const rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  const rselectTextarea = /^(?:select|textarea)/i;
  const rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i;
  const rnoContent = /^(?:GET|HEAD)$/;
  const rbracket = /\[\]$/;
  const jsre = /\=\?(&|$)/;
  const rquery = /\?/;
  const rts = /([?&])_=[^&]*/;
  const rurl = /^(\w+:)?\/\/([^\/?#]+)/;
  const r20 = /%20/g;
  const rhash = /#.*$/;

  // Keep a copy of the old load method
  const _load = jQuery.fn.load;

  jQuery.fn.extend({
    load(url, params, callback) {
      if (typeof url !== 'string' && _load) {
        return _load.apply(this, arguments);

        // Don't do a request if no elements are being requested
      } if (!this.length) {
        return this;
      }

      const off = url.indexOf(' ');
      if (off >= 0) {
        var selector = url.slice(off, url.length);
        url = url.slice(0, off);
      }

      // Default to a GET request
      let type = 'GET';

      // If the second parameter was provided
      if (params) {
        // If it's a function
        if (jQuery.isFunction(params)) {
          // We assume that it's the callback
          callback = params;
          params = null;

          // Otherwise, build a param string
        } else if (typeof params === 'object') {
          params = jQuery.param(params, jQuery.ajaxSettings.traditional);
          type = 'POST';
        }
      }

      const self = this;

      // Request the remote document
      jQuery.ajax({
        url,
        type,
        dataType: 'html',
        data: params,
        complete(res, status) {
          // If successful, inject the HTML into all the matched elements
          if (status === 'success' || status === 'notmodified') {
            // See if a selector was specified
            self.html(selector
            // Create a dummy div to hold the results
              ? jQuery('<div>')
              // inject the contents of the document in, removing the scripts
              // to avoid any 'Permission Denied' errors in IE
                .append(res.responseText.replace(rscript, ''))

              // Locate the specified elements
                .find(selector)

            // If not, just inject the full result
              : res.responseText);
          }

          if (callback) {
            self.each(callback, [res.responseText, status, res]);
          }
        },
      });

      return this;
    },

    serialize() {
      return jQuery.param(this.serializeArray());
    },

    serializeArray() {
      return this.map(function () {
        return this.elements ? jQuery.makeArray(this.elements) : this;
      })
        .filter(function () {
          return this.name && !this.disabled
				&& (this.checked || rselectTextarea.test(this.nodeName)
					|| rinput.test(this.type));
        })
        .map(function (i, elem) {
          const val = jQuery(this).val();

          return val == null
            ? null
            : jQuery.isArray(val)
              ? jQuery.map(val, (val, i) => ({ name: elem.name, value: val }))
              : { name: elem.name, value: val };
        }).get();
    },
  });

  // Attach a bunch of functions for handling common AJAX events
  jQuery.each('ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend'.split(' '), (i, o) => {
    jQuery.fn[o] = function (f) {
      return this.bind(o, f);
    };
  });

  jQuery.extend({
    get(url, data, callback, type) {
      // shift arguments if data argument was omited
      if (jQuery.isFunction(data)) {
        type = type || callback;
        callback = data;
        data = null;
      }

      return jQuery.ajax({
        type: 'GET',
        url,
        data,
        success: callback,
        dataType: type,
      });
    },

    getScript(url, callback) {
      return jQuery.get(url, null, callback, 'script');
    },

    getJSON(url, data, callback) {
      return jQuery.get(url, data, callback, 'json');
    },

    post(url, data, callback, type) {
      // shift arguments if data argument was omited
      if (jQuery.isFunction(data)) {
        type = type || callback;
        callback = data;
        data = {};
      }

      return jQuery.ajax({
        type: 'POST',
        url,
        data,
        success: callback,
        dataType: type,
      });
    },

    ajaxSetup(settings) {
      jQuery.extend(jQuery.ajaxSettings, settings);
    },

    ajaxSettings: {
      url: location.href,
      global: true,
      type: 'GET',
      contentType: 'application/x-www-form-urlencoded',
      processData: true,
      async: true,
      /*
		timeout: 0,
		data: null,
		username: null,
		password: null,
		traditional: false,
		*/
      // This function can be overriden by calling jQuery.ajaxSetup
      xhr() {
        return new window.XMLHttpRequest();
      },
      accepts: {
        xml: 'application/xml, text/xml',
        html: 'text/html',
        script: 'text/javascript, application/javascript',
        json: 'application/json, text/javascript',
        text: 'text/plain',
        _default: '*/*',
      },
    },

    ajax(origSettings) {
      const s = jQuery.extend(true, {}, jQuery.ajaxSettings, origSettings);
      let jsonp; let status; let data; const type = s.type.toUpperCase(); const
        noContent = rnoContent.test(type);

      s.url = s.url.replace(rhash, '');

      // Use original (not extended) context object if it was provided
      s.context = origSettings && origSettings.context != null ? origSettings.context : s;

      // convert data if not already a string
      if (s.data && s.processData && typeof s.data !== 'string') {
        s.data = jQuery.param(s.data, s.traditional);
      }

      // Handle JSONP Parameter Callbacks
      if (s.dataType === 'jsonp') {
        if (type === 'GET') {
          if (!jsre.test(s.url)) {
            s.url += `${(rquery.test(s.url) ? '&' : '?') + (s.jsonp || 'callback')}=?`;
          }
        } else if (!s.data || !jsre.test(s.data)) {
          s.data = `${(s.data ? `${s.data}&` : '') + (s.jsonp || 'callback')}=?`;
        }
        s.dataType = 'json';
      }

      // Build temporary JSONP function
      if (s.dataType === 'json' && (s.data && jsre.test(s.data) || jsre.test(s.url))) {
        jsonp = s.jsonpCallback || (`jsonp${jsc++}`);

        // Replace the =? sequence both in the query string and the data
        if (s.data) {
          s.data = (`${s.data}`).replace(jsre, `=${jsonp}$1`);
        }

        s.url = s.url.replace(jsre, `=${jsonp}$1`);

        // We need to make sure
        // that a JSONP style response is executed properly
        s.dataType = 'script';

        // Handle JSONP-style loading
        const customJsonp = window[jsonp];

        window[jsonp] = function (tmp) {
          if (jQuery.isFunction(customJsonp)) {
            customJsonp(tmp);
          } else {
            // Garbage collect
            window[jsonp] = undefined;

            try {
              delete window[jsonp];
            } catch (jsonpError) {}
          }

          data = tmp;
          jQuery.handleSuccess(s, xhr, status, data);
          jQuery.handleComplete(s, xhr, status, data);

          if (head) {
            head.removeChild(script);
          }
        };
      }

      if (s.dataType === 'script' && s.cache === null) {
        s.cache = false;
      }

      if (s.cache === false && noContent) {
        const ts = jQuery.now();

        // try replacing _= if it is there
        const ret = s.url.replace(rts, `$1_=${ts}`);

        // if nothing was replaced, add timestamp to the end
        s.url = ret + ((ret === s.url) ? `${rquery.test(s.url) ? '&' : '?'}_=${ts}` : '');
      }

      // If data is available, append data to url for GET/HEAD requests
      if (s.data && noContent) {
        s.url += (rquery.test(s.url) ? '&' : '?') + s.data;
      }

      // Watch for a new set of requests
      if (s.global && jQuery.active++ === 0) {
        jQuery.event.trigger('ajaxStart');
      }

      // Matches an absolute URL, and saves the domain
      const parts = rurl.exec(s.url);
      const remote = parts && (parts[1] && parts[1].toLowerCase() !== location.protocol || parts[2].toLowerCase() !== location.host);

      // If we're requesting a remote document
      // and trying to load JSON or Script with a GET
      if (s.dataType === 'script' && type === 'GET' && remote) {
        var head = document.getElementsByTagName('head')[0] || document.documentElement;
        var script = document.createElement('script');
        if (s.scriptCharset) {
          script.charset = s.scriptCharset;
        }
        script.src = s.url;

        // Handle Script loading
        if (!jsonp) {
          let done = false;

          // Attach handlers for all browsers
          script.onload = script.onreadystatechange = function () {
            if (!done && (!this.readyState
							|| this.readyState === 'loaded' || this.readyState === 'complete')) {
              done = true;
              jQuery.handleSuccess(s, xhr, status, data);
              jQuery.handleComplete(s, xhr, status, data);

              // Handle memory leak in IE
              script.onload = script.onreadystatechange = null;
              if (head && script.parentNode) {
                head.removeChild(script);
              }
            }
          };
        }

        // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
        // This arises when a base node is used (#2709 and #4378).
        head.insertBefore(script, head.firstChild);

        // We handle everything using the script element injection
        return undefined;
      }

      let requestDone = false;

      // Create the request object
      var xhr = s.xhr();

      if (!xhr) {
        return;
      }

      // Open the socket
      // Passing null username, generates a login popup on Opera (#2865)
      if (s.username) {
        xhr.open(type, s.url, s.async, s.username, s.password);
      } else {
        xhr.open(type, s.url, s.async);
      }

      // Need an extra try/catch for cross domain requests in Firefox 3
      try {
        // Set content-type if data specified and content-body is valid for this type
        if ((s.data != null && !noContent) || (origSettings && origSettings.contentType)) {
          xhr.setRequestHeader('Content-Type', s.contentType);
        }

        // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
        if (s.ifModified) {
          if (jQuery.lastModified[s.url]) {
            xhr.setRequestHeader('If-Modified-Since', jQuery.lastModified[s.url]);
          }

          if (jQuery.etag[s.url]) {
            xhr.setRequestHeader('If-None-Match', jQuery.etag[s.url]);
          }
        }

        // Set header so the called script knows that it's an XMLHttpRequest
        // Only send the header if it's not a remote XHR
        if (!remote) {
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }

        // Set the Accepts header for the server, depending on the dataType
        xhr.setRequestHeader('Accept', s.dataType && s.accepts[s.dataType]
          ? `${s.accepts[s.dataType]}, */*; q=0.01`
          : s.accepts._default);
      } catch (headerError) {}

      // Allow custom headers/mimetypes and early abort
      if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
        // Handle the global AJAX counter
        if (s.global && jQuery.active-- === 1) {
          jQuery.event.trigger('ajaxStop');
        }

        // close opended socket
        xhr.abort();
        return false;
      }

      if (s.global) {
        jQuery.triggerGlobal(s, 'ajaxSend', [xhr, s]);
      }

      // Wait for a response to come back
      const onreadystatechange = xhr.onreadystatechange = function (isTimeout) {
        // The request was aborted
        if (!xhr || xhr.readyState === 0 || isTimeout === 'abort') {
          // Opera doesn't call onreadystatechange before this point
          // so we simulate the call
          if (!requestDone) {
            jQuery.handleComplete(s, xhr, status, data);
          }

          requestDone = true;
          if (xhr) {
            xhr.onreadystatechange = jQuery.noop;
          }

          // The transfer is complete and the data is available, or the request timed out
        } else if (!requestDone && xhr && (xhr.readyState === 4 || isTimeout === 'timeout')) {
          requestDone = true;
          xhr.onreadystatechange = jQuery.noop;

          status = isTimeout === 'timeout'
            ? 'timeout'
            : !jQuery.httpSuccess(xhr)
              ? 'error'
              : s.ifModified && jQuery.httpNotModified(xhr, s.url)
                ? 'notmodified'
                : 'success';

          let errMsg;

          if (status === 'success') {
            // Watch for, and catch, XML document parse errors
            try {
              // process the data (runs the xml through httpData regardless of callback)
              data = jQuery.httpData(xhr, s.dataType, s);
            } catch (parserError) {
              status = 'parsererror';
              errMsg = parserError;
            }
          }

          // Make sure that the request was successful or notmodified
          if (status === 'success' || status === 'notmodified') {
            // JSONP handles its own success callback
            if (!jsonp) {
              jQuery.handleSuccess(s, xhr, status, data);
            }
          } else {
            jQuery.handleError(s, xhr, status, errMsg);
          }

          // Fire the complete handlers
          if (!jsonp) {
            jQuery.handleComplete(s, xhr, status, data);
          }

          if (isTimeout === 'timeout') {
            xhr.abort();
          }

          // Stop memory leaks
          if (s.async) {
            xhr = null;
          }
        }
      };

      // Override the abort handler, if we can (IE 6 doesn't allow it, but that's OK)
      // Opera doesn't fire onreadystatechange at all on abort
      try {
        const oldAbort = xhr.abort;
        xhr.abort = function () {
          if (xhr) {
            // oldAbort has no call property in IE7 so
            // just do it this way, which works in all
            // browsers
            Function.prototype.call.call(oldAbort, xhr);
          }

          onreadystatechange('abort');
        };
      } catch (abortError) {}

      // Timeout checker
      if (s.async && s.timeout > 0) {
        setTimeout(() => {
          // Check to see if the request is still happening
          if (xhr && !requestDone) {
            onreadystatechange('timeout');
          }
        }, s.timeout);
      }

      // Send the data
      try {
        xhr.send(noContent || s.data == null ? null : s.data);
      } catch (sendError) {
        jQuery.handleError(s, xhr, null, sendError);

        // Fire the complete handlers
        jQuery.handleComplete(s, xhr, status, data);
      }

      // firefox 1.5 doesn't fire statechange for sync requests
      if (!s.async) {
        onreadystatechange();
      }

      // return XMLHttpRequest to allow aborting the request etc.
      return xhr;
    },

    // Serialize an array of form elements or a set of
    // key/values into a query string
    param(a, traditional) {
      const s = [];
      const add = function (key, value) {
        // If value is a function, invoke it and return its value
        value = jQuery.isFunction(value) ? value() : value;
        s[s.length] = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      };

      // Set traditional to true for jQuery <= 1.3.2 behavior.
      if (traditional === undefined) {
        traditional = jQuery.ajaxSettings.traditional;
      }

      // If an array was passed in, assume that it is an array of form elements.
      if (jQuery.isArray(a) || a.jquery) {
        // Serialize the form elements
        jQuery.each(a, function () {
          add(this.name, this.value);
        });
      } else {
        // If traditional, encode the "old" way (the way 1.3.2 or older
        // did it), otherwise encode params recursively.
        for (const prefix in a) {
          buildParams(prefix, a[prefix], traditional, add);
        }
      }

      // Return the resulting serialization
      return s.join('&').replace(r20, '+');
    },
  });

  function buildParams(prefix, obj, traditional, add) {
    if (jQuery.isArray(obj) && obj.length) {
      // Serialize array item.
      jQuery.each(obj, (i, v) => {
        if (traditional || rbracket.test(prefix)) {
          // Treat each array item as a scalar.
          add(prefix, v);
        } else {
          // If array item is non-scalar (array or object), encode its
          // numeric index to resolve deserialization ambiguity issues.
          // Note that rack (as of 1.0.0) can't currently deserialize
          // nested arrays properly, and attempting to do so may cause
          // a server error. Possible fixes are to modify rack's
          // deserialization algorithm or to provide an option or flag
          // to force array serialization to be shallow.
          buildParams(`${prefix}[${typeof v === 'object' || jQuery.isArray(v) ? i : ''}]`, v, traditional, add);
        }
      });
    } else if (!traditional && obj != null && typeof obj === 'object') {
      if (jQuery.isEmptyObject(obj)) {
        add(prefix, '');

        // Serialize object item.
      } else {
        jQuery.each(obj, (k, v) => {
          buildParams(`${prefix}[${k}]`, v, traditional, add);
        });
      }
    } else {
      // Serialize scalar item.
      add(prefix, obj);
    }
  }

  // This is still on the jQuery object... for now
  // Want to move this to jQuery.ajax some day
  jQuery.extend({

    // Counter for holding the number of active queries
    active: 0,

    // Last-Modified header cache for next request
    lastModified: {},
    etag: {},

    handleError(s, xhr, status, e) {
      // If a local callback was specified, fire it
      if (s.error) {
        s.error.call(s.context, xhr, status, e);
      }

      // Fire the global callback
      if (s.global) {
        jQuery.triggerGlobal(s, 'ajaxError', [xhr, s, e]);
      }
    },

    handleSuccess(s, xhr, status, data) {
      // If a local callback was specified, fire it and pass it the data
      if (s.success) {
        s.success.call(s.context, data, status, xhr);
      }

      // Fire the global callback
      if (s.global) {
        jQuery.triggerGlobal(s, 'ajaxSuccess', [xhr, s]);
      }
    },

    handleComplete(s, xhr, status) {
      // Process result
      if (s.complete) {
        s.complete.call(s.context, xhr, status);
      }

      // The request was completed
      if (s.global) {
        jQuery.triggerGlobal(s, 'ajaxComplete', [xhr, s]);
      }

      // Handle the global AJAX counter
      if (s.global && jQuery.active-- === 1) {
        jQuery.event.trigger('ajaxStop');
      }
    },

    triggerGlobal(s, type, args) {
      (s.context && s.context.url == null ? jQuery(s.context) : jQuery.event).trigger(type, args);
    },

    // Determines if an XMLHttpRequest was successful or not
    httpSuccess(xhr) {
      try {
        // IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
        return !xhr.status && location.protocol === 'file:'
				|| xhr.status >= 200 && xhr.status < 300
				|| xhr.status === 304 || xhr.status === 1223;
      } catch (e) {}

      return false;
    },

    // Determines if an XMLHttpRequest returns NotModified
    httpNotModified(xhr, url) {
      const lastModified = xhr.getResponseHeader('Last-Modified');
      const etag = xhr.getResponseHeader('Etag');

      if (lastModified) {
        jQuery.lastModified[url] = lastModified;
      }

      if (etag) {
        jQuery.etag[url] = etag;
      }

      return xhr.status === 304;
    },

    httpData(xhr, type, s) {
      const ct = xhr.getResponseHeader('content-type') || '';
      const xml = type === 'xml' || !type && ct.indexOf('xml') >= 0;
      let data = xml ? xhr.responseXML : xhr.responseText;

      if (xml && data.documentElement.nodeName === 'parsererror') {
        jQuery.error('parsererror');
      }

      // Allow a pre-filtering function to sanitize the response
      // s is checked to keep backwards compatibility
      if (s && s.dataFilter) {
        data = s.dataFilter(data, type);
      }

      // The filter can actually parse the response
      if (typeof data === 'string') {
        // Get the JavaScript object, if JSON is used.
        if (type === 'json' || !type && ct.indexOf('json') >= 0) {
          data = jQuery.parseJSON(data);

          // If the type is "script", eval it in global context
        } else if (type === 'script' || !type && ct.indexOf('javascript') >= 0) {
          jQuery.globalEval(data);
        }
      }

      return data;
    },

  });

  /*
 * Create the request object; Microsoft failed to properly
 * implement the XMLHttpRequest in IE7 (can't request local files),
 * so we use the ActiveXObject when it is available
 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
 * we need a fallback.
 */
  if (window.ActiveXObject) {
    jQuery.ajaxSettings.xhr = function () {
      if (window.location.protocol !== 'file:') {
        try {
          return new window.XMLHttpRequest();
        } catch (xhrError) {}
      }

      try {
        return new window.ActiveXObject('Microsoft.XMLHTTP');
      } catch (activeError) {}
    };
  }

  // Does this browser support XHR requests?
  jQuery.support.ajax = !!jQuery.ajaxSettings.xhr();

  const elemdisplay = {};
  const rfxtypes = /^(?:toggle|show|hide)$/;
  const rfxnum = /^([+\-]=)?([\d+.\-]+)(.*)$/;
  let timerId;
  const fxAttrs = [
    // height animations
    ['height', 'marginTop', 'marginBottom', 'paddingTop', 'paddingBottom'],
    // width animations
    ['width', 'marginLeft', 'marginRight', 'paddingLeft', 'paddingRight'],
    // opacity animations
    ['opacity'],
  ];

  jQuery.fn.extend({
    show(speed, easing, callback) {
      let elem; let
        display;

      if (speed || speed === 0) {
        return this.animate(genFx('show', 3), speed, easing, callback);
      }
      for (var i = 0, j = this.length; i < j; i++) {
        elem = this[i];
        display = elem.style.display;

        // Reset the inline display of this element to learn if it is
        // being hidden by cascaded rules or not
        if (!jQuery.data(elem, 'olddisplay') && display === 'none') {
          display = elem.style.display = '';
        }

        // Set elements which have been overridden with display: none
        // in a stylesheet to whatever the default browser style is
        // for such an element
        if (display === '' && jQuery.css(elem, 'display') === 'none') {
          jQuery.data(elem, 'olddisplay', defaultDisplay(elem.nodeName));
        }
      }

      // Set the display of most of the elements in a second loop
      // to avoid the constant reflow
      for (i = 0; i < j; i++) {
        elem = this[i];
        display = elem.style.display;

        if (display === '' || display === 'none') {
          elem.style.display = jQuery.data(elem, 'olddisplay') || '';
        }
      }

      return this;
    },

    hide(speed, easing, callback) {
      if (speed || speed === 0) {
        return this.animate(genFx('hide', 3), speed, easing, callback);
      }
      for (var i = 0, j = this.length; i < j; i++) {
        const display = jQuery.css(this[i], 'display');

        if (display !== 'none') {
          jQuery.data(this[i], 'olddisplay', display);
        }
      }

      // Set the display of the elements in a second loop
      // to avoid the constant reflow
      for (i = 0; i < j; i++) {
        this[i].style.display = 'none';
      }

      return this;
    },

    // Save the old toggle function
    _toggle: jQuery.fn.toggle,

    toggle(fn, fn2, callback) {
      const bool = typeof fn === 'boolean';

      if (jQuery.isFunction(fn) && jQuery.isFunction(fn2)) {
        this._toggle.apply(this, arguments);
      } else if (fn == null || bool) {
        this.each(function () {
          const state = bool ? fn : jQuery(this).is(':hidden');
          jQuery(this)[state ? 'show' : 'hide']();
        });
      } else {
        this.animate(genFx('toggle', 3), fn, fn2, callback);
      }

      return this;
    },

    fadeTo(speed, to, easing, callback) {
      return this.filter(':hidden').css('opacity', 0).show().end()
        .animate({ opacity: to }, speed, easing, callback);
    },

    animate(prop, speed, easing, callback) {
      const optall = jQuery.speed(speed, easing, callback);

      if (jQuery.isEmptyObject(prop)) {
        return this.each(optall.complete);
      }

      return this[optall.queue === false ? 'each' : 'queue'](function () {
        // XXX 'this' does not always have a nodeName when running the
        // test suite

        const opt = jQuery.extend({}, optall); let p;
        const isElement = this.nodeType === 1;
        const hidden = isElement && jQuery(this).is(':hidden');
        const self = this;

        for (p in prop) {
          const name = jQuery.camelCase(p);

          if (p !== name) {
            prop[name] = prop[p];
            delete prop[p];
            p = name;
          }

          if (prop[p] === 'hide' && hidden || prop[p] === 'show' && !hidden) {
            return opt.complete.call(this);
          }

          if (isElement && (p === 'height' || p === 'width')) {
            // Make sure that nothing sneaks out
            // Record all 3 overflow attributes because IE does not
            // change the overflow attribute when overflowX and
            // overflowY are set to the same value
            opt.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY];

            // Set display property to inline-block for height/width
            // animations on inline elements that are having width/height
            // animated
            if (jQuery.css(this, 'display') === 'inline'
							&& jQuery.css(this, 'float') === 'none') {
              if (!jQuery.support.inlineBlockNeedsLayout) {
                this.style.display = 'inline-block';
              } else {
                const display = defaultDisplay(this.nodeName);

                // inline-level elements accept inline-block;
                // block-level elements need to be inline with layout
                if (display === 'inline') {
                  this.style.display = 'inline-block';
                } else {
                  this.style.display = 'inline';
                  this.style.zoom = 1;
                }
              }
            }
          }

          if (jQuery.isArray(prop[p])) {
            // Create (if needed) and add to specialEasing
            (opt.specialEasing = opt.specialEasing || {})[p] = prop[p][1];
            prop[p] = prop[p][0];
          }
        }

        if (opt.overflow != null) {
          this.style.overflow = 'hidden';
        }

        opt.curAnim = jQuery.extend({}, prop);

        jQuery.each(prop, (name, val) => {
          const e = new jQuery.fx(self, opt, name);

          if (rfxtypes.test(val)) {
            e[val === 'toggle' ? hidden ? 'show' : 'hide' : val](prop);
          } else {
            const parts = rfxnum.exec(val);
            let start = e.cur() || 0;

            if (parts) {
              let end = parseFloat(parts[2]);
              const unit = parts[3] || 'px';

              // We need to compute starting value
              if (unit !== 'px') {
                jQuery.style(self, name, (end || 1) + unit);
                start = ((end || 1) / e.cur()) * start;
                jQuery.style(self, name, start + unit);
              }

              // If a +=/-= token was provided, we're doing a relative animation
              if (parts[1]) {
                end = ((parts[1] === '-=' ? -1 : 1) * end) + start;
              }

              e.custom(start, end, unit);
            } else {
              e.custom(start, val, '');
            }
          }
        });

        // For JS strict compliance
        return true;
      });
    },

    stop(clearQueue, gotoEnd) {
      const { timers } = jQuery;

      if (clearQueue) {
        this.queue([]);
      }

      this.each(function () {
        // go in reverse order so anything added to the queue during the loop is ignored
        for (let i = timers.length - 1; i >= 0; i--) {
          if (timers[i].elem === this) {
            if (gotoEnd) {
              // force the next step to be the last
              timers[i](true);
            }

            timers.splice(i, 1);
          }
        }
      });

      // start the next in the queue if the last step wasn't forced
      if (!gotoEnd) {
        this.dequeue();
      }

      return this;
    },

  });

  function genFx(type, num) {
    const obj = {};

    jQuery.each(fxAttrs.concat.apply([], fxAttrs.slice(0, num)), function () {
      obj[this] = type;
    });

    return obj;
  }

  // Generate shortcuts for custom animations
  jQuery.each({
    slideDown: genFx('show', 1),
    slideUp: genFx('hide', 1),
    slideToggle: genFx('toggle', 1),
    fadeIn: { opacity: 'show' },
    fadeOut: { opacity: 'hide' },
    fadeToggle: { opacity: 'toggle' },
  }, (name, props) => {
    jQuery.fn[name] = function (speed, easing, callback) {
      return this.animate(props, speed, easing, callback);
    };
  });

  jQuery.extend({
    speed(speed, easing, fn) {
      const opt = speed && typeof speed === 'object' ? jQuery.extend({}, speed) : {
        complete: fn || !fn && easing
				|| jQuery.isFunction(speed) && speed,
        duration: speed,
        easing: fn && easing || easing && !jQuery.isFunction(easing) && easing,
      };

      opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === 'number' ? opt.duration
        : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

      // Queueing
      opt.old = opt.complete;
      opt.complete = function () {
        if (opt.queue !== false) {
          jQuery(this).dequeue();
        }
        if (jQuery.isFunction(opt.old)) {
          opt.old.call(this);
        }
      };

      return opt;
    },

    easing: {
      linear(p, n, firstNum, diff) {
        return firstNum + diff * p;
      },
      swing(p, n, firstNum, diff) {
        return ((-Math.cos(p * Math.PI) / 2) + 0.5) * diff + firstNum;
      },
    },

    timers: [],

    fx(elem, options, prop) {
      this.options = options;
      this.elem = elem;
      this.prop = prop;

      if (!options.orig) {
        options.orig = {};
      }
    },

  });

  jQuery.fx.prototype = {
    // Simple function for setting a style value
    update() {
      if (this.options.step) {
        this.options.step.call(this.elem, this.now, this);
      }

      (jQuery.fx.step[this.prop] || jQuery.fx.step._default)(this);
    },

    // Get the current size
    cur() {
      if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null)) {
        return this.elem[this.prop];
      }

      const r = parseFloat(jQuery.css(this.elem, this.prop));
      return r && r > -10000 ? r : 0;
    },

    // Start an animation from one number to another
    custom(from, to, unit) {
      const self = this;
      const { fx } = jQuery;

      this.startTime = jQuery.now();
      this.start = from;
      this.end = to;
      this.unit = unit || this.unit || 'px';
      this.now = this.start;
      this.pos = this.state = 0;

      function t(gotoEnd) {
        return self.step(gotoEnd);
      }

      t.elem = this.elem;

      if (t() && jQuery.timers.push(t) && !timerId) {
        timerId = setInterval(fx.tick, fx.interval);
      }
    },

    // Simple 'show' function
    show() {
      // Remember where we started, so that we can go back to it later
      this.options.orig[this.prop] = jQuery.style(this.elem, this.prop);
      this.options.show = true;

      // Begin the animation
      // Make sure that we start at a small width/height to avoid any
      // flash of content
      this.custom(this.prop === 'width' || this.prop === 'height' ? 1 : 0, this.cur());

      // Start by showing the element
      jQuery(this.elem).show();
    },

    // Simple 'hide' function
    hide() {
      // Remember where we started, so that we can go back to it later
      this.options.orig[this.prop] = jQuery.style(this.elem, this.prop);
      this.options.hide = true;

      // Begin the animation
      this.custom(this.cur(), 0);
    },

    // Each step of an animation
    step(gotoEnd) {
      const t = jQuery.now(); let
        done = true;

      if (gotoEnd || t >= this.options.duration + this.startTime) {
        this.now = this.end;
        this.pos = this.state = 1;
        this.update();

        this.options.curAnim[this.prop] = true;

        for (const i in this.options.curAnim) {
          if (this.options.curAnim[i] !== true) {
            done = false;
          }
        }

        if (done) {
          // Reset the overflow
          if (this.options.overflow != null && !jQuery.support.shrinkWrapBlocks) {
            const { elem } = this;
            const { options } = this;

            jQuery.each(['', 'X', 'Y'], (index, value) => {
              elem.style[`overflow${value}`] = options.overflow[index];
            });
          }

          // Hide the element if the "hide" operation was done
          if (this.options.hide) {
            jQuery(this.elem).hide();
          }

          // Reset the properties, if the item has been hidden or shown
          if (this.options.hide || this.options.show) {
            for (const p in this.options.curAnim) {
              jQuery.style(this.elem, p, this.options.orig[p]);
            }
          }

          // Execute the complete function
          this.options.complete.call(this.elem);
        }

        return false;
      }
      const n = t - this.startTime;
      this.state = n / this.options.duration;

      // Perform the easing function, defaults to swing
      const specialEasing = this.options.specialEasing && this.options.specialEasing[this.prop];
      const defaultEasing = this.options.easing || (jQuery.easing.swing ? 'swing' : 'linear');
      this.pos = jQuery.easing[specialEasing || defaultEasing](this.state, n, 0, 1, this.options.duration);
      this.now = this.start + ((this.end - this.start) * this.pos);

      // Perform the next step of the animation
      this.update();

      return true;
    },
  };

  jQuery.extend(jQuery.fx, {
    tick() {
      const { timers } = jQuery;

      for (let i = 0; i < timers.length; i++) {
        if (!timers[i]()) {
          timers.splice(i--, 1);
        }
      }

      if (!timers.length) {
        jQuery.fx.stop();
      }
    },

    interval: 13,

    stop() {
      clearInterval(timerId);
      timerId = null;
    },

    speeds: {
      slow: 600,
      fast: 200,
      // Default speed
      _default: 400,
    },

    step: {
      opacity(fx) {
        jQuery.style(fx.elem, 'opacity', fx.now);
      },

      _default(fx) {
        if (fx.elem.style && fx.elem.style[fx.prop] != null) {
          fx.elem.style[fx.prop] = (fx.prop === 'width' || fx.prop === 'height' ? Math.max(0, fx.now) : fx.now) + fx.unit;
        } else {
          fx.elem[fx.prop] = fx.now;
        }
      },
    },
  });

  if (jQuery.expr && jQuery.expr.filters) {
    jQuery.expr.filters.animated = function (elem) {
      return jQuery.grep(jQuery.timers, (fn) => elem === fn.elem).length;
    };
  }

  function defaultDisplay(nodeName) {
    if (!elemdisplay[nodeName]) {
      const elem = jQuery(`<${nodeName}>`).appendTo('body');
      let display = elem.css('display');

      elem.remove();

      if (display === 'none' || display === '') {
        display = 'block';
      }

      elemdisplay[nodeName] = display;
    }

    return elemdisplay[nodeName];
  }

  const rtable = /^t(?:able|d|h)$/i;
  const rroot = /^(?:body|html)$/i;

  if ('getBoundingClientRect' in document.documentElement) {
    jQuery.fn.offset = function (options) {
      const elem = this[0]; let
        box;

      if (options) {
        return this.each(function (i) {
          jQuery.offset.setOffset(this, options, i);
        });
      }

      if (!elem || !elem.ownerDocument) {
        return null;
      }

      if (elem === elem.ownerDocument.body) {
        return jQuery.offset.bodyOffset(elem);
      }

      try {
        box = elem.getBoundingClientRect();
      } catch (e) {}

      const doc = elem.ownerDocument;
      const docElem = doc.documentElement;

      // Make sure we're not dealing with a disconnected DOM node
      if (!box || !jQuery.contains(docElem, elem)) {
        return box || { top: 0, left: 0 };
      }

      const { body } = doc;
      const win = getWindow(doc);
      const clientTop = docElem.clientTop || body.clientTop || 0;
      const clientLeft = docElem.clientLeft || body.clientLeft || 0;
      const scrollTop = (win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop || body.scrollTop);
      const scrollLeft = (win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft);
      const top = box.top + scrollTop - clientTop;
      const left = box.left + scrollLeft - clientLeft;

      return { top, left };
    };
  } else {
    jQuery.fn.offset = function (options) {
      let elem = this[0];

      if (options) {
        return this.each(function (i) {
          jQuery.offset.setOffset(this, options, i);
        });
      }

      if (!elem || !elem.ownerDocument) {
        return null;
      }

      if (elem === elem.ownerDocument.body) {
        return jQuery.offset.bodyOffset(elem);
      }

      jQuery.offset.initialize();

      let computedStyle;
      let { offsetParent } = elem;
      let prevOffsetParent = elem;
      const doc = elem.ownerDocument;
      const docElem = doc.documentElement;
      const { body } = doc;
      const { defaultView } = doc;
      let prevComputedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
      let top = elem.offsetTop;
      let left = elem.offsetLeft;

      while ((elem = elem.parentNode) && elem !== body && elem !== docElem) {
        if (jQuery.offset.supportsFixedPosition && prevComputedStyle.position === 'fixed') {
          break;
        }

        computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
        top -= elem.scrollTop;
        left -= elem.scrollLeft;

        if (elem === offsetParent) {
          top += elem.offsetTop;
          left += elem.offsetLeft;

          if (jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && rtable.test(elem.nodeName))) {
            top += parseFloat(computedStyle.borderTopWidth) || 0;
            left += parseFloat(computedStyle.borderLeftWidth) || 0;
          }

          prevOffsetParent = offsetParent;
          offsetParent = elem.offsetParent;
        }

        if (jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== 'visible') {
          top += parseFloat(computedStyle.borderTopWidth) || 0;
          left += parseFloat(computedStyle.borderLeftWidth) || 0;
        }

        prevComputedStyle = computedStyle;
      }

      if (prevComputedStyle.position === 'relative' || prevComputedStyle.position === 'static') {
        top += body.offsetTop;
        left += body.offsetLeft;
      }

      if (jQuery.offset.supportsFixedPosition && prevComputedStyle.position === 'fixed') {
        top += Math.max(docElem.scrollTop, body.scrollTop);
        left += Math.max(docElem.scrollLeft, body.scrollLeft);
      }

      return { top, left };
    };
  }

  jQuery.offset = {
    initialize() {
      let { body } = document;
      let container = document.createElement('div');
      let innerDiv;
      let checkDiv;
      let table;
      let td;
      const bodyMarginTop = parseFloat(jQuery.css(body, 'marginTop')) || 0;
      const html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

      jQuery.extend(container.style, {
        position: 'absolute', top: 0, left: 0, margin: 0, border: 0, width: '1px', height: '1px', visibility: 'hidden',
      });

      container.innerHTML = html;
      body.insertBefore(container, body.firstChild);
      innerDiv = container.firstChild;
      checkDiv = innerDiv.firstChild;
      td = innerDiv.nextSibling.firstChild.firstChild;

      this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
      this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

      checkDiv.style.position = 'fixed';
      checkDiv.style.top = '20px';

      // safari subtracts parent border width here which is 5px
      this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
      checkDiv.style.position = checkDiv.style.top = '';

      innerDiv.style.overflow = 'hidden';
      innerDiv.style.position = 'relative';

      this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

      this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

      body.removeChild(container);
      body = container = innerDiv = checkDiv = table = td = null;
      jQuery.offset.initialize = jQuery.noop;
    },

    bodyOffset(body) {
      let top = body.offsetTop;
      let left = body.offsetLeft;

      jQuery.offset.initialize();

      if (jQuery.offset.doesNotIncludeMarginInBodyOffset) {
        top += parseFloat(jQuery.css(body, 'marginTop')) || 0;
        left += parseFloat(jQuery.css(body, 'marginLeft')) || 0;
      }

      return { top, left };
    },

    setOffset(elem, options, i) {
      const position = jQuery.css(elem, 'position');

      // set position first, in-case top/left are set even on static elem
      if (position === 'static') {
        elem.style.position = 'relative';
      }

      const curElem = jQuery(elem);
      const curOffset = curElem.offset();
      const curCSSTop = jQuery.css(elem, 'top');
      const curCSSLeft = jQuery.css(elem, 'left');
      const calculatePosition = (position === 'absolute' && jQuery.inArray('auto', [curCSSTop, curCSSLeft]) > -1);
      const props = {}; let curPosition = {}; let curTop; let
        curLeft;

      // need to be able to calculate position if either top or left is auto and position is absolute
      if (calculatePosition) {
        curPosition = curElem.position();
      }

      curTop = calculatePosition ? curPosition.top : parseInt(curCSSTop, 10) || 0;
      curLeft = calculatePosition ? curPosition.left : parseInt(curCSSLeft, 10) || 0;

      if (jQuery.isFunction(options)) {
        options = options.call(elem, i, curOffset);
      }

      if (options.top != null) {
        props.top = (options.top - curOffset.top) + curTop;
      }
      if (options.left != null) {
        props.left = (options.left - curOffset.left) + curLeft;
      }

      if ('using' in options) {
        options.using.call(elem, props);
      } else {
        curElem.css(props);
      }
    },
  };

  jQuery.fn.extend({
    position() {
      if (!this[0]) {
        return null;
      }

      const elem = this[0];

      // Get *real* offsetParent
      const offsetParent = this.offsetParent();

      // Get correct offsets
      const offset = this.offset();
      const parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

      // Subtract element margins
      // note: when an element has margin: auto the offsetLeft and marginLeft
      // are the same in Safari causing offset.left to incorrectly be 0
      offset.top -= parseFloat(jQuery.css(elem, 'marginTop')) || 0;
      offset.left -= parseFloat(jQuery.css(elem, 'marginLeft')) || 0;

      // Add offsetParent borders
      parentOffset.top += parseFloat(jQuery.css(offsetParent[0], 'borderTopWidth')) || 0;
      parentOffset.left += parseFloat(jQuery.css(offsetParent[0], 'borderLeftWidth')) || 0;

      // Subtract the two offsets
      return {
        top: offset.top - parentOffset.top,
        left: offset.left - parentOffset.left,
      };
    },

    offsetParent() {
      return this.map(function () {
        let offsetParent = this.offsetParent || document.body;
        while (offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, 'position') === 'static')) {
          offsetParent = offsetParent.offsetParent;
        }
        return offsetParent;
      });
    },
  });

  // Create scrollLeft and scrollTop methods
  jQuery.each(['Left', 'Top'], (i, name) => {
    const method = `scroll${name}`;

    jQuery.fn[method] = function (val) {
      const elem = this[0]; let
        win;

      if (!elem) {
        return null;
      }

      if (val !== undefined) {
        // Set the scroll offset
        return this.each(function () {
          win = getWindow(this);

          if (win) {
            win.scrollTo(
              !i ? val : jQuery(win).scrollLeft(),
						 i ? val : jQuery(win).scrollTop(),
            );
          } else {
            this[method] = val;
          }
        });
      }
      win = getWindow(elem);

      // Return the scroll offset
      return win ? ('pageXOffset' in win) ? win[i ? 'pageYOffset' : 'pageXOffset']
        : jQuery.support.boxModel && win.document.documentElement[method]
					|| win.document.body[method]
        : elem[method];
    };
  });

  function getWindow(elem) {
    return jQuery.isWindow(elem)
      ? elem
      : elem.nodeType === 9
        ? elem.defaultView || elem.parentWindow
        : false;
  }

  // Create innerHeight, innerWidth, outerHeight and outerWidth methods
  jQuery.each(['Height', 'Width'], (i, name) => {
    const type = name.toLowerCase();

    // innerHeight and innerWidth
    jQuery.fn[`inner${name}`] = function () {
      return this[0]
        ? parseFloat(jQuery.css(this[0], type, 'padding'))
        : null;
    };

    // outerHeight and outerWidth
    jQuery.fn[`outer${name}`] = function (margin) {
      return this[0]
        ? parseFloat(jQuery.css(this[0], type, margin ? 'margin' : 'border'))
        : null;
    };

    jQuery.fn[type] = function (size) {
      // Get window width or height
      const elem = this[0];
      if (!elem) {
        return size == null ? null : this;
      }

      if (jQuery.isFunction(size)) {
        return this.each(function (i) {
          const self = jQuery(this);
          self[type](size.call(this, i, self[type]()));
        });
      }

      if (jQuery.isWindow(elem)) {
        // Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
        return elem.document.compatMode === 'CSS1Compat' && elem.document.documentElement[`client${name}`]
				|| elem.document.body[`client${name}`];

        // Get document width or height
      } if (elem.nodeType === 9) {
        // Either scroll[Width/Height] or offset[Width/Height], whichever is greater
        return Math.max(
          elem.documentElement[`client${name}`],
          elem.body[`scroll${name}`], elem.documentElement[`scroll${name}`],
          elem.body[`offset${name}`], elem.documentElement[`offset${name}`],
        );

        // Get or set width or height on the element
      } if (size === undefined) {
        const orig = jQuery.css(elem, type);
        const ret = parseFloat(orig);

        return jQuery.isNaN(ret) ? orig : ret;

        // Set the width or height on the element (default to pixels if value is unitless)
      }
      return this.css(type, typeof size === 'string' ? size : `${size}px`);
    };
  });
}(window));
