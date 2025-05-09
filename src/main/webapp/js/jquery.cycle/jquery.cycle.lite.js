/*!
 * jQuery Cycle Lite Plugin
 * http://malsup.com/jquery/cycle/lite/
 * Copyright (c) 2008-2012 M. Alsup
 * Version: 1.7 (16-JAN-2013)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires: jQuery v1.3.2 or later
 */
(function ($) {
  const ver = 'Lite-1.6';
  const msie = /MSIE/.test(navigator.userAgent);

  $.fn.cycle = function (options) {
    return this.each(function () {
      options = options || {};

      if (this.cycleTimeout) clearTimeout(this.cycleTimeout);

      this.cycleTimeout = 0;
      this.cyclePause = 0;

      const $cont = $(this);
      const $slides = options.slideExpr ? $(options.slideExpr, this) : $cont.children();
      const els = $slides.get();
      if (els.length < 2) {
        if (window.console) console.log(`terminating; too few slides: ${els.length}`);
        return; // don't bother
      }

      // support metadata plugin (v1.0 and v2.0)
      let opts = $.extend({}, $.fn.cycle.defaults, options || {}, $.metadata ? $cont.metadata() : $.meta ? $cont.data() : {});
      const meta = $.isFunction($cont.data) ? $cont.data(opts.metaAttr) : null;
      if (meta) opts = $.extend(opts, meta);

      opts.before = opts.before ? [opts.before] : [];
      opts.after = opts.after ? [opts.after] : [];
      opts.after.unshift(() => { opts.busy = 0; });

      // allow shorthand overrides of width, height and timeout
      const cls = this.className;
      opts.width = parseInt((cls.match(/w:(\d+)/) || [])[1], 10) || opts.width;
      opts.height = parseInt((cls.match(/h:(\d+)/) || [])[1], 10) || opts.height;
      opts.timeout = parseInt((cls.match(/t:(\d+)/) || [])[1], 10) || opts.timeout;

      if ($cont.css('position') == 'static') $cont.css('position', 'relative');
      if (opts.width) $cont.width(opts.width);
      if (opts.height && opts.height != 'auto') $cont.height(opts.height);

      const first = 0;
      $slides.css({ position: 'absolute', top: 0 }).each(function (i) {
        $(this).css('z-index', els.length - i);
      });

      $(els[first]).css('opacity', 1).show(); // opacity bit needed to handle reinit case
      if (msie) els[first].style.removeAttribute('filter');

      if (opts.fit && opts.width) $slides.width(opts.width);
      if (opts.fit && opts.height && opts.height != 'auto') $slides.height(opts.height);
      if (opts.pause) $cont.hover(function () { this.cyclePause = 1; }, function () { this.cyclePause = 0; });

      const txFn = $.fn.cycle.transitions[opts.fx];
      if (txFn) txFn($cont, $slides, opts);

      $slides.each(function () {
        const $el = $(this);
        this.cycleH = (opts.fit && opts.height) ? opts.height : $el.height();
        this.cycleW = (opts.fit && opts.width) ? opts.width : $el.width();
      });

      if (opts.cssFirst) $($slides[first]).css(opts.cssFirst);

      if (opts.timeout) {
        // ensure that timeout and speed settings are sane
        if (opts.speed.constructor == String) opts.speed = { slow: 600, fast: 200 }[opts.speed] || 400;
        if (!opts.sync) opts.speed /= 2;
        while ((opts.timeout - opts.speed) < 250) opts.timeout += opts.speed;
      }
      opts.speedIn = opts.speed;
      opts.speedOut = opts.speed;

      opts.slideCount = els.length;
      opts.currSlide = first;
      opts.nextSlide = 1;

      // fire artificial events
      const e0 = $slides[first];
      if (opts.before.length) opts.before[0].apply(e0, [e0, e0, opts, true]);
      if (opts.after.length > 1) opts.after[1].apply(e0, [e0, e0, opts, true]);

      if (opts.click && !opts.next) opts.next = opts.click;
      if (opts.next) $(opts.next).unbind('click.cycle').bind('click.cycle', () => advance(els, opts, opts.rev ? -1 : 1));
      if (opts.prev) $(opts.prev).unbind('click.cycle').bind('click.cycle', () => advance(els, opts, opts.rev ? 1 : -1));

      if (opts.timeout) {
        this.cycleTimeout = setTimeout(() => {
          go(els, opts, 0, !opts.rev);
        }, opts.timeout + (opts.delay || 0));
      }
    });
  };

  function go(els, opts, manual, fwd) {
    if (opts.busy) return;
    const p = els[0].parentNode; const curr = els[opts.currSlide]; const
      next = els[opts.nextSlide];
    if (p.cycleTimeout === 0 && !manual) return;

    if (manual || !p.cyclePause) {
      if (opts.before.length) $.each(opts.before, (i, o) => { o.apply(next, [curr, next, opts, fwd]); });
      const after = function () {
        if (msie) this.style.removeAttribute('filter');
        $.each(opts.after, (i, o) => { o.apply(next, [curr, next, opts, fwd]); });
        queueNext(opts);
      };

      if (opts.nextSlide != opts.currSlide) {
        opts.busy = 1;
        $.fn.cycle.custom(curr, next, opts, after);
      }
      const roll = (opts.nextSlide + 1) == els.length;
      opts.nextSlide = roll ? 0 : opts.nextSlide + 1;
      opts.currSlide = roll ? els.length - 1 : opts.nextSlide - 1;
    } else {
      queueNext(opts);
    }

    function queueNext(opts) {
      if (opts.timeout) p.cycleTimeout = setTimeout(() => { go(els, opts, 0, !opts.rev); }, opts.timeout);
    }
  }

  // advance slide forward or back
  function advance(els, opts, val) {
    const p = els[0].parentNode; const
      timeout = p.cycleTimeout;
    if (timeout) {
      clearTimeout(timeout);
      p.cycleTimeout = 0;
    }
    opts.nextSlide = opts.currSlide + val;
    if (opts.nextSlide < 0) {
      opts.nextSlide = els.length - 1;
    } else if (opts.nextSlide >= els.length) {
      opts.nextSlide = 0;
    }
    go(els, opts, 1, val >= 0);
    return false;
  }

  $.fn.cycle.custom = function (curr, next, opts, cb) {
    const $l = $(curr); const
      $n = $(next);
    $n.css(opts.cssBefore);
    const fn = function () { $n.animate(opts.animIn, opts.speedIn, opts.easeIn, cb); };
    $l.animate(opts.animOut, opts.speedOut, opts.easeOut, () => {
      $l.css(opts.cssAfter);
      if (!opts.sync) fn();
    });
    if (opts.sync) fn();
  };

  $.fn.cycle.transitions = {
    fade($cont, $slides, opts) {
      $slides.not(':eq(0)').hide();
      opts.cssBefore = { opacity: 0, display: 'block' };
      opts.cssAfter = { display: 'none' };
      opts.animOut = { opacity: 0 };
      opts.animIn = { opacity: 1 };
    },
    fadeout($cont, $slides, opts) {
      opts.before.push((curr, next, opts, fwd) => {
        $(curr).css('zIndex', opts.slideCount + (fwd === true ? 1 : 0));
        $(next).css('zIndex', opts.slideCount + (fwd === true ? 0 : 1));
      });
      $slides.not(':eq(0)').hide();
      opts.cssBefore = { opacity: 1, display: 'block', zIndex: 1 };
      opts.cssAfter = { display: 'none', zIndex: 0 };
      opts.animOut = { opacity: 0 };
      opts.animIn = { opacity: 1 };
    },
  };

  $.fn.cycle.ver = function () { return ver; };

  // @see: http://malsup.com/jquery/cycle/lite/
  $.fn.cycle.defaults = {
    animIn: {},
    animOut: {},
    fx: 'fade',
    after: null,
    before: null,
    cssBefore: {},
    cssAfter: {},
    delay: 0,
    fit: 0,
    height: 'auto',
    metaAttr: 'cycle',
    next: null,
    pause: false,
    prev: null,
    speed: 1000,
    slideExpr: null,
    sync: true,
    timeout: 4000,
  };
}(jQuery));
