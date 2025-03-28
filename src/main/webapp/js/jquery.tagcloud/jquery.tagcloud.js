/*!
 * jquery.tagcloud.js
 * A Simple Tag Cloud Plugin for JQuery
 *
 * https://github.com/addywaddy/jquery.tagcloud.js
 * created by Adam Groves
 */
(function ($) {
  /* global jQuery */

  const compareWeights = function (a, b) {
    return a - b;
  };

  // Converts hex to an RGB array
  const toRGB = function (code) {
    if (code.length === 4) {
      code = code.replace(/(\w)(\w)(\w)/gi, '\$1\$1\$2\$2\$3\$3');
    }
    const hex = /(\w{2})(\w{2})(\w{2})/.exec(code);
    return [parseInt(hex[1], 16), parseInt(hex[2], 16), parseInt(hex[3], 16)];
  };

  // Converts an RGB array to hex
  const toHex = function (ary) {
    return `#${jQuery.map(ary, (i) => {
      let hex = i.toString(16);
      hex = (hex.length === 1) ? `0${hex}` : hex;
      return hex;
    }).join('')}`;
  };

  const colorIncrement = function (color, range) {
    return jQuery.map(toRGB(color.end), (n, i) => (n - toRGB(color.start)[i]) / range);
  };

  const tagColor = function (color, increment, weighting) {
    const rgb = jQuery.map(toRGB(color.start), (n, i) => {
      let ref = Math.round(n + (increment[i] * weighting));
      if (ref > 255) {
        ref = 255;
      } else if (ref < 0) {
        ref = 0;
      }
      return ref;
    });
    return toHex(rgb);
  };

  $.fn.tagcloud = function (options) {
    const opts = $.extend({}, $.fn.tagcloud.defaults, options);
    let tagWeights = this.map(function () {
      return $(this).attr('rel');
    });
    tagWeights = jQuery.makeArray(tagWeights).sort(compareWeights);
    const lowest = tagWeights[0];
    const highest = tagWeights.pop();
    let range = highest - lowest;
    if (range === 0) { range = 1; }
    // Sizes
    let fontIncr; let
      colorIncr;
    if (opts.size) {
      fontIncr = (opts.size.end - opts.size.start) / range;
    }
    // Colors
    if (opts.color) {
      colorIncr = colorIncrement(opts.color, range);
    }
    return this.each(function () {
      const weighting = $(this).attr('rel') - lowest;
      if (opts.size) {
        $(this).css({ 'font-size': opts.size.start + (weighting * fontIncr) + opts.size.unit });
      }
      if (opts.color) {
        $(this).css({ color: tagColor(opts.color, colorIncr, weighting) });
      }
    });
  };

  $.fn.tagcloud.defaults = {
    size: { start: 14, end: 18, unit: 'pt' },
  };
}(jQuery));
