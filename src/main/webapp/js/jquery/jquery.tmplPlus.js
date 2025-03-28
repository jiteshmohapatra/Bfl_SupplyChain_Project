/*!
 * tmplPlus.js: for jQuery Templates Plugin 1.0.0pre
 * Additional templating features or support for more advanced/less common scenarios.
 * Requires jquery.tmpl.js
 * http://github.com/jquery/jquery-tmpl
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
(function (jQuery) {
  const oldComplete = jQuery.tmpl.complete; const
    oldManip = jQuery.fn.domManip;

  // Override jQuery.tmpl.complete in order to provide rendered event.
  jQuery.tmpl.complete = function (tmplItems) {
    let tmplItem;
    oldComplete(tmplItems);
    for (tmplItem in tmplItems) {
      tmplItem = tmplItems[tmplItem];
      if (tmplItem.addedTmplItems && jQuery.inArray(tmplItem, tmplItem.addedTmplItems) === -1) {
        tmplItem.addedTmplItems.push(tmplItem);
      }
    }
    for (tmplItem in tmplItems) {
      tmplItem = tmplItems[tmplItem];
      // Raise rendered event
      if (tmplItem.rendered) {
        tmplItem.rendered(tmplItem);
      }
    }
  };

  jQuery.extend({
    tmplCmd(command, data, tmplItems) {
      const retTmplItems = []; let
        before;
      function find(data, tmplItems) {
        const found = []; let tmplItem; let ti; const tl = tmplItems.length; let dataItem; let di = 0; const
          dl = data.length;
        for (; di < dl;) {
          dataItem = data[di++];
          for (ti = 0; ti < tl;) {
            tmplItem = tmplItems[ti++];
            if (tmplItem.data === dataItem) {
              found.push(tmplItem);
            }
          }
        }
        return found;
      }

      data = jQuery.isArray(data) ? data : [data];
      switch (command) {
        case 'find':
          return find(data, tmplItems);
        case 'replace':
          data.reverse();
      }
      jQuery.each(tmplItems ? find(data, tmplItems) : data, (i, tmplItem) => {
        coll = tmplItem.nodes;
        switch (command) {
          case 'update':
            tmplItem.update();
            break;
          case 'remove':
            jQuery(coll).remove();
            if (tmplItems) {
              tmplItems.splice(jQuery.inArray(tmplItem, tmplItems), 1);
            }
            break;
          case 'replace':
            before = before
              ? jQuery(coll).insertBefore(before)[0]
              : jQuery(coll).appendTo(coll[0].parentNode)[0];
            retTmplItems.unshift(tmplItem);
        }
      });
      return retTmplItems;
    },
  });

  jQuery.fn.extend({
    domManip(args, table, callback, options) {
      const data = args[1]; const tmpl = args[0]; let
        dmArgs;
      if (args.length >= 2 && typeof data === 'object' && !data.nodeType && !(data instanceof jQuery)) {
        // args[1] is data, for a template.
        dmArgs = jQuery.makeArray(arguments);

        // Eval template to obtain fragment to clone and insert
        dmArgs[0] = [jQuery.tmpl(jQuery.template(tmpl), data, args[2], args[3])];

        dmArgs[2] = function (fragClone) {
          // Handler called by oldManip when rendered template has been inserted into DOM.
          jQuery.tmpl.afterManip(this, fragClone, callback);
        };
        return oldManip.apply(this, dmArgs);
      }
      return oldManip.apply(this, arguments);
    },
  });
}(jQuery));
