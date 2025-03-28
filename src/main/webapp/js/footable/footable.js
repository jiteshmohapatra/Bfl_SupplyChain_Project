/*!
 * FooTable - Awesome Responsive Tables
 * Version : 2.0.1
 * http://fooplugins.com/plugins/footable-jquery/
 *
 * Requires jQuery - http://jquery.com/
 *
 * Copyright 2013 Steven Usher & Brad Vincent
 * Released under the MIT license
 * You are free to use FooTable in commercial projects as long as this copyright header is left intact.
 *
 * Date: 31 Aug 2013
 */
(function ($, w, undefined) {
  w.footable = {
    options: {
      delay: 100, // The number of millseconds to wait before triggering the react event
      breakpoints: { // The different screen resolution breakpoints
        phone: 480,
        tablet: 1024,
      },
      parsers: { // The default parser to parse the value out of a cell (values are used in building up row detail)
        alpha(cell) {
          return $(cell).data('value') || $.trim($(cell).text());
        },
        numeric(cell) {
          let val = $(cell).data('value') || $(cell).text().replace(/[^0-9.\-]/g, '');
          val = parseFloat(val);
          if (isNaN(val)) val = 0;
          return val;
        },
      },
      addRowToggle: true,
      calculateWidthOverride: null,
      toggleSelector: ' > tbody > tr:not(.footable-row-detail)', // the selector to show/hide the detail row
      columnDataSelector: '> thead > tr:last-child > th, > thead > tr:last-child > td', // the selector used to find the column data in the thead
      detailSeparator: ':', // the seperator character used when building up the detail row
      createGroupedDetail(data) {
        const groups = { _none: { name: null, data: [] } };
        for (let i = 0; i < data.length; i++) {
          const groupid = data[i].group;
          if (groupid !== null) {
            if (!(groupid in groups)) groups[groupid] = { name: data[i].groupName || data[i].group, data: [] };

            groups[groupid].data.push(data[i]);
          } else {
            groups._none.data.push(data[i]);
          }
        }
        return groups;
      },
      createDetail(element, data, createGroupedDetail, separatorChar, classes) {
        /// <summary>This function is used by FooTable to generate the detail view seen when expanding a collapsed row.</summary>
        /// <param name="element">This is the div that contains all the detail row information, anything could be added to it.</param>
        /// <param name="data">
        ///  This is an array of objects containing the cell information for the current row.
        ///  These objects look like the below:
        ///    obj = {
        ///      'name': String, // The name of the column
        ///      'value': Object, // The value parsed from the cell using the parsers. This could be a string, a number or whatever the parser outputs.
        ///      'display': String, // This is the actual HTML from the cell, so if you have images etc you want moved this is the one to use and is the default value used.
        ///      'group': String, // This is the identifier used in the data-group attribute of the column.
        ///      'groupName': String // This is the actual name of the group the column belongs to.
        ///    }
        /// </param>
        /// <param name="createGroupedDetail">The grouping function to group the data</param>
        /// <param name="separatorChar">The separator charactor used</param>
        /// <param name="classes">The array of class names used to build up the detail row</param>

        const groups = createGroupedDetail(data);
        for (const group in groups) {
          if (groups[group].data.length === 0) continue;
          if (group !== '_none') element.append(`<div class="${classes.detailInnerGroup}">${groups[group].name}</div>`);

          for (let j = 0; j < groups[group].data.length; j++) {
            const separator = (groups[group].data[j].name) ? separatorChar : '';
            element.append(`<div class="${classes.detailInnerRow}"><div class="${classes.detailInnerName}">${groups[group].data[j].name}${separator}</div><div class="${classes.detailInnerValue}">${groups[group].data[j].display}</div></div>`);
          }
        }
      },
      classes: {
        main: 'footable',
        loading: 'footable-loading',
        loaded: 'footable-loaded',
        toggle: 'footable-toggle',
        disabled: 'footable-disabled',
        detail: 'footable-row-detail',
        detailCell: 'footable-row-detail-cell',
        detailInner: 'footable-row-detail-inner',
        detailInnerRow: 'footable-row-detail-row',
        detailInnerGroup: 'footable-row-detail-group',
        detailInnerName: 'footable-row-detail-name',
        detailInnerValue: 'footable-row-detail-value',
        detailShow: 'footable-detail-show',
      },
      triggers: {
        initialize: 'footable_initialize', // trigger this event to force FooTable to reinitialize
        resize: 'footable_resize', // trigger this event to force FooTable to resize
        redraw: 'footable_redraw',								// trigger this event to force FooTable to redraw
        toggleRow: 'footable_toggle_row', // trigger this event to force FooTable to toggle a row
        expandFirstRow: 'footable_expand_first_row', // trigger this event to force FooTable to expand the first row
      },
      events: {
        alreadyInitialized: 'footable_already_initialized', // fires when the FooTable has already been initialized
        initializing: 'footable_initializing', // fires before FooTable starts initializing
        initialized: 'footable_initialized', // fires after FooTable has finished initializing
        resizing: 'footable_resizing', // fires before FooTable resizes
        resized: 'footable_resized', // fires after FooTable has resized
        redrawn: 'footable_redrawn', // fires after FooTable has redrawn
        breakpoint: 'footable_breakpoint', // fires inside the resize function, when a breakpoint is hit
        columnData: 'footable_column_data', // fires when setting up column data. Plugins should use this event to capture their own info about a column
        rowDetailUpdating: 'footable_row_detail_updating', // fires before a detail row is updated
        rowDetailUpdated: 'footable_row_detail_updated', // fires when a detail row is being updated
        rowCollapsed: 'footable_row_collapsed', // fires when a row is collapsed
        rowExpanded: 'footable_row_expanded', // fires when a row is expanded
        rowRemoved: 'footable_row_removed', // fires when a row is removed
      },
      debug: false, // Whether or not to log information to the console.
      log: null,
    },

    version: {
      major: 0,
      minor: 5,
      toString() {
        return `${w.footable.version.major}.${w.footable.version.minor}`;
      },
      parse(str) {
        version = /(\d+)\.?(\d+)?\.?(\d+)?/.exec(str);
        return {
          major: parseInt(version[1], 10) || 0,
          minor: parseInt(version[2], 10) || 0,
          patch: parseInt(version[3], 10) || 0,
        };
      },
    },

    plugins: {
      _validate(plugin) {
        /// <summary>Simple validation of the <paramref name="plugin"/> to make sure any members called by FooTable actually exist.</summary>
        /// <param name="plugin">The object defining the plugin, this should implement a string property called "name" and a function called "init".</param>

        if (!$.isFunction(plugin)) {
          if (w.footable.options.debug === true) console.error('Validation failed, expected type "function", received type "{0}".', typeof plugin);
          return false;
        }
        const p = new plugin();
        if (typeof p.name !== 'string') {
          if (w.footable.options.debug === true) console.error('Validation failed, plugin does not implement a string property called "name".', p);
          return false;
        }
        if (!$.isFunction(p.init)) {
          if (w.footable.options.debug === true) console.error(`Validation failed, plugin "${p.name}" does not implement a function called "init".`, p);
          return false;
        }
        if (w.footable.options.debug === true) console.log(`Validation succeeded for plugin "${p.name}".`, p);
        return true;
      },
      registered: [], // An array containing all registered plugins.
      register(plugin, options) {
        /// <summary>Registers a <paramref name="plugin"/> and its default <paramref name="options"/> with FooTable.</summary>
        /// <param name="plugin">The plugin that should implement a string property called "name" and a function called "init".</param>
        /// <param name="options">The default options to merge with the FooTable's base options.</param>

        if (w.footable.plugins._validate(plugin)) {
          w.footable.plugins.registered.push(plugin);
          if (typeof options === 'object') $.extend(true, w.footable.options, options);
        }
      },
      load(instance) {
        const loaded = []; let registered; let
          i;
        for (i = 0; i < w.footable.plugins.registered.length; i++) {
          try {
            registered = w.footable.plugins.registered[i];
            loaded.push(new registered(instance));
          } catch (err) {
            if (w.footable.options.debug === true) console.error(err);
          }
        }
        return loaded;
      },
      init(instance) {
        /// <summary>Loops through all registered plugins and calls the "init" method supplying the current <paramref name="instance"/> of the FooTable as the first parameter.</summary>
        /// <param name="instance">The current instance of the FooTable that the plugin is being initialized for.</param>

        for (let i = 0; i < instance.plugins.length; i++) {
          try {
            instance.plugins[i].init(instance);
          } catch (err) {
            if (w.footable.options.debug === true) console.error(err);
          }
        }
      },
    },
  };

  let instanceCount = 0;

  $.fn.footable = function (options) {
    /// <summary>The main constructor call to initialize the plugin using the supplied <paramref name="options"/>.</summary>
    /// <param name="options">
    /// <para>A JSON object containing user defined options for the plugin to use. Any options not supplied will have a default value assigned.</para>
    /// <para>Check the documentation or the default options object above for more information on available options.</para>
    /// </param>

    options = options || {};
    const o = $.extend(true, {}, w.footable.options, options); // merge user and default options
    return this.each(function () {
      instanceCount++;
      const footable = new Footable(this, o, instanceCount);
      $(this).data('footable', footable);
    });
  };

  // helper for using timeouts
  function Timer() {
    /// <summary>Simple timer object created around a timeout.</summary>
    const t = this;
    t.id = null;
    t.busy = false;
    t.start = function (code, milliseconds) {
      /// <summary>Starts the timer and waits the specified amount of <paramref name="milliseconds"/> before executing the supplied <paramref name="code"/>.</summary>
      /// <param name="code">The code to execute once the timer runs out.</param>
      /// <param name="milliseconds">The time in milliseconds to wait before executing the supplied <paramref name="code"/>.</param>

      if (t.busy) {
        return;
      }
      t.stop();
      t.id = setTimeout(() => {
        code();
        t.id = null;
        t.busy = false;
      }, milliseconds);
      t.busy = true;
    };
    t.stop = function () {
      /// <summary>Stops the timer if its runnning and resets it back to its starting state.</summary>

      if (t.id !== null) {
        clearTimeout(t.id);
        t.id = null;
        t.busy = false;
      }
    };
  }

  function Footable(t, o, id) {
    /// <summary>Inits a new instance of the plugin.</summary>
    /// <param name="t">The main table element to apply this plugin to.</param>
    /// <param name="o">The options supplied to the plugin. Check the defaults object to see all available options.</param>
    /// <param name="id">The id to assign to this instance of the plugin.</param>

    const ft = this;
    ft.id = id;
    ft.table = t;
    ft.options = o;
    ft.breakpoints = [];
    ft.breakpointNames = '';
    ft.columns = {};
    ft.plugins = w.footable.plugins.load(ft);

    const opt = ft.options;
    const cls = opt.classes;
    const evt = opt.events;
    const trg = opt.triggers;
    let indexOffset = 0;

    // This object simply houses all the timers used in the FooTable.
    ft.timers = {
      resize: new Timer(),
      register(name) {
        ft.timers[name] = new Timer();
        return ft.timers[name];
      },
    };

    ft.init = function () {
      const $window = $(w); const
        $table = $(ft.table);

      w.footable.plugins.init(ft);

      if ($table.hasClass(cls.loaded)) {
        // already loaded FooTable for the table, so don't init again
        ft.raise(evt.alreadyInitialized);
        return;
      }

      // raise the initializing event
      ft.raise(evt.initializing);

      $table.addClass(cls.loading);

      // Get the column data once for the life time of the plugin
      $table.find(opt.columnDataSelector).each(function () {
        const data = ft.getColumnData(this);
        ft.columns[data.index] = data;
      });

      // Create a nice friendly array to work with out of the breakpoints object.
      for (const name in opt.breakpoints) {
        ft.breakpoints.push({ name, width: opt.breakpoints[name] });
        ft.breakpointNames += (`${name} `);
      }

      // Sort the breakpoints so the smallest is checked first
      ft.breakpoints.sort((a, b) => a.width - b.width);

      $table
      // bind to FooTable initialize trigger
        .bind(trg.initialize, () => {
          // remove previous "state" (to "force" a resize)
          $table.removeData('footable_info');
          $table.data('breakpoint', '');

          // trigger the FooTable resize
          $table.trigger(trg.resize);

          // remove the loading class
          $table.removeClass(cls.loading);

          // add the FooTable and loaded class
          $table.addClass(cls.loaded).addClass(cls.main);

          // raise the initialized event
          ft.raise(evt.initialized);
        })
      // bind to FooTable redraw trigger
        .bind(trg.redraw, () => {
          ft.redraw();
        })

      // bind to FooTable resize trigger
        .bind(trg.resize, () => {
          ft.resize();
        })
      // bind to FooTable expandFirstRow trigger
        .bind(trg.expandFirstRow, () => {
          $table.find(opt.toggleSelector).first().not(`.${cls.detailShow}`).trigger(trg.toggleRow);
        });

      // trigger a FooTable initialize
      $table.trigger(trg.initialize);

      // bind to window resize
      $window
        .bind('resize.footable', () => {
          ft.timers.resize.stop();
          ft.timers.resize.start(() => {
            ft.raise(trg.resize);
          }, opt.delay);
        });
    };

    ft.addRowToggle = function () {
      if (!opt.addRowToggle) return;

      const $table = $(ft.table);
      let hasToggleColumn = false;

      // first remove all toggle spans
      $table.find(`span.${cls.toggle}`).remove();

      for (const c in ft.columns) {
        const col = ft.columns[c];
        if (col.toggle) {
          hasToggleColumn = true;
          const selector = `> tbody > tr:not(.${cls.detail},.${cls.disabled}) > td:nth-child(${parseInt(col.index, 10) + 1})`;
          $table.find(selector).not(`.${cls.detailCell}`).prepend($('<span />').addClass(cls.toggle));
          return;
        }
      }
      // check if we have an toggle column. If not then add it to the first column just to be safe
      if (!hasToggleColumn) {
        $table
          .find(`> tbody > tr:not(.${cls.detail},.${cls.disabled}) > td:first-child`)
          .not(`.${cls.detailCell}`)
          .prepend($('<span />').addClass(cls.toggle));
      }
    };

    ft.setColumnClasses = function () {
      $table = $(ft.table);
      for (const c in ft.columns) {
        const col = ft.columns[c];
        if (col.className !== null) {
          var selector = ''; var
            first = true;
          $.each(col.matches, (m, match) => { // support for colspans
            if (!first) selector += ', ';
            selector += `> tbody > tr:not(.${cls.detail}) > td:nth-child(${parseInt(match, 10) + 1})`;
            first = false;
          });
          // add the className to the cells specified by data-class="blah"
          $table.find(selector).not(`.${cls.detailCell}`).addClass(col.className);
        }
      }
    };

    // moved this out into it's own function so that it can be called from other add-ons
    ft.bindToggleSelectors = function () {
      const $table = $(ft.table);

      if (!ft.hasAnyBreakpointColumn()) return;

      $table.find(opt.toggleSelector).unbind(trg.toggleRow).bind(trg.toggleRow, function (e) {
        const $row = $(this).is('tr') ? $(this) : $(this).parents('tr:first');
        ft.toggleDetail($row.get(0));
      });

      $table.find(opt.toggleSelector).unbind('click.footable').bind('click.footable', function (e) {
        if ($table.is('.breakpoint') && $(e.target).is(`td,.${cls.toggle}`)) {
          $(this).trigger(trg.toggleRow);
        }
      });
    };

    ft.parse = function (cell, column) {
      const parser = opt.parsers[column.type] || opt.parsers.alpha;
      return parser(cell);
    };

    ft.getColumnData = function (th) {
      const $th = $(th); let hide = $th.data('hide'); const
        index = $th.index();
      hide = hide || '';
      hide = jQuery.map(hide.split(','), (a) => jQuery.trim(a));
      const data = {
        index,
        hide: { },
        type: $th.data('type') || 'alpha',
        name: $th.data('name') || $.trim($th.text()),
        ignore: $th.data('ignore') || false,
        toggle: $th.data('toggle') || false,
        className: $th.data('class') || null,
        matches: [],
        names: { },
        group: $th.data('group') || null,
        groupName: null,
      };

      if (data.group !== null) {
        const $group = $(ft.table).find(`> thead > tr.footable-group-row > th[data-group="${data.group}"], > thead > tr.footable-group-row > td[data-group="${data.group}"]`).first();
        data.groupName = ft.parse($group, { type: 'alpha' });
      }

      const pcolspan = parseInt($th.prev().attr('colspan') || 0, 10);
      indexOffset += pcolspan > 1 ? pcolspan - 1 : 0;
      const colspan = parseInt($th.attr('colspan') || 0, 10); const
        curindex = data.index + indexOffset;
      if (colspan > 1) {
        let names = $th.data('names');
        names = names || '';
        names = names.split(',');
        for (let i = 0; i < colspan; i++) {
          data.matches.push(i + curindex);
          if (i < names.length) data.names[i + curindex] = names[i];
        }
      } else {
        data.matches.push(curindex);
      }

      data.hide.default = ($th.data('hide') === 'all') || ($.inArray('default', hide) >= 0);

      let hasBreakpoint = false;
      for (const name in opt.breakpoints) {
        data.hide[name] = ($th.data('hide') === 'all') || ($.inArray(name, hide) >= 0);
        hasBreakpoint = hasBreakpoint || data.hide[name];
      }
      data.hasBreakpoint = hasBreakpoint;
      const e = ft.raise(evt.columnData, { column: { data, th } });
      return e.column.data;
    };

    ft.getViewportWidth = function () {
      return window.innerWidth || (document.body ? document.body.offsetWidth : 0);
    };

    ft.calculateWidth = function ($table, info) {
      if (jQuery.isFunction(opt.calculateWidthOverride)) {
        return opt.calculateWidthOverride($table, info);
      }
      if (info.viewportWidth < info.width) info.width = info.viewportWidth;
      if (info.parentWidth < info.width) info.width = info.parentWidth;
      return info;
    };

    ft.hasBreakpointColumn = function (breakpoint) {
      for (const c in ft.columns) {
        if (ft.columns[c].hide[breakpoint]) {
          if (ft.columns[c].ignore) {
            continue;
          }
          return true;
        }
      }
      return false;
    };

    ft.hasAnyBreakpointColumn = function () {
      for (const c in ft.columns) {
        if (ft.columns[c].hasBreakpoint) {
          return true;
        }
      }
      return false;
    };

    ft.resize = function () {
      const $table = $(ft.table);

      if (!$table.is(':visible')) {
        return;
      } // we only care about FooTables that are visible

      if (!ft.hasAnyBreakpointColumn()) {
        return;
      } // we only care about FooTables that have breakpoints

      let info = {
        width: $table.width(), // the table width
        viewportWidth: ft.getViewportWidth(), // the width of the viewport
        parentWidth: $table.parent().width(), // the width of the parent
      };

      info = ft.calculateWidth($table, info);

      const pinfo = $table.data('footable_info');
      $table.data('footable_info', info);
      ft.raise(evt.resizing, { old: pinfo, info });

      // This (if) statement is here purely to make sure events aren't raised twice as mobile safari seems to do
      if (!pinfo || (pinfo && pinfo.width && pinfo.width !== info.width)) {
        let current = null; let
          breakpoint;
        for (let i = 0; i < ft.breakpoints.length; i++) {
          breakpoint = ft.breakpoints[i];
          if (breakpoint && breakpoint.width && info.width <= breakpoint.width) {
            current = breakpoint;
            break;
          }
        }

        const breakpointName = (current === null ? 'default' : current.name);
        const hasBreakpointFired = ft.hasBreakpointColumn(breakpointName);
        const previousBreakpoint = $table.data('breakpoint');

        $table
          .data('breakpoint', breakpointName)
          .removeClass('default breakpoint').removeClass(ft.breakpointNames)
          .addClass(breakpointName + (hasBreakpointFired ? ' breakpoint' : ''));

        // only do something if the breakpoint has changed
        if (breakpointName !== previousBreakpoint) {
          // trigger a redraw
          $table.trigger(trg.redraw);
          // raise a breakpoint event
          ft.raise(evt.breakpoint, { breakpoint: breakpointName, info });
        }
      }

      ft.raise(evt.resized, { old: pinfo, info });
    };

    ft.redraw = function () {
      // add the toggler to each row
      ft.addRowToggle();

      // bind the toggle selector click events
      ft.bindToggleSelectors();

      // set any cell classes defined for the columns
      ft.setColumnClasses();

      const $table = $(ft.table);
      const breakpointName = $table.data('breakpoint');
      const hasBreakpointFired = ft.hasBreakpointColumn(breakpointName);

      $table
        .find(`> tbody > tr:not(.${cls.detail})`).data('detail_created', false).end()
        .find('> thead > tr:last-child > th')
        .each(function () {
          const data = ft.columns[$(this).index()]; let selector = ''; let
            first = true;
          $.each(data.matches, (m, match) => {
            if (!first) {
              selector += ', ';
            }
            const count = match + 1;
            selector += `> tbody > tr:not(.${cls.detail}) > td:nth-child(${count})`;
            selector += `, > tfoot > tr:not(.${cls.detail}) > td:nth-child(${count})`;
            selector += `, > colgroup > col:nth-child(${count})`;
            first = false;
          });

          selector += `, > thead > tr[data-group-row="true"] > th[data-group="${data.group}"]`;
          const $column = $table.find(selector).add(this);
          if (data.hide[breakpointName] === false) $column.show();
          else $column.hide();

          if ($table.find('> thead > tr.footable-group-row').length === 1) {
            const $groupcols = $table.find(`> thead > tr:last-child > th[data-group="${data.group}"]:visible, > thead > tr:last-child > th[data-group="${data.group}"]:visible`);
            const $group = $table.find(`> thead > tr.footable-group-row > th[data-group="${data.group}"], > thead > tr.footable-group-row > td[data-group="${data.group}"]`);
            let groupspan = 0;

            $.each($groupcols, function () {
              groupspan += parseInt($(this).attr('colspan') || 1, 10);
            });

            if (groupspan > 0) $group.attr('colspan', groupspan).show();
            else $group.hide();
          }
        })
        .end()
        .find(`> tbody > tr.${cls.detailShow}`)
        .each(function () {
          ft.createOrUpdateDetailRow(this);
        });

      $table.find(`> tbody > tr.${cls.detailShow}:visible`).each(function () {
        const $next = $(this).next();
        if ($next.hasClass(cls.detail)) {
          if (!hasBreakpointFired) $next.hide();
          else $next.show();
        }
      });

      // adding .footable-first-column and .footable-last-column to the first and last th and td of each row in order to allow
      // for styling if the first or last column is hidden (which won't work using :first-child or :last-child)
      $table.find('> thead > tr > th.footable-last-column, > tbody > tr > td.footable-last-column').removeClass('footable-last-column');
      $table.find('> thead > tr > th.footable-first-column, > tbody > tr > td.footable-first-column').removeClass('footable-first-column');
      $table.find('> thead > tr, > tbody > tr')
        .find('> th:visible:last, > td:visible:last')
        .addClass('footable-last-column')
        .end()
        .find('> th:visible:first, > td:visible:first')
        .addClass('footable-first-column');

      ft.raise(evt.redrawn);
    };

    ft.toggleDetail = function (row) {
      const $row = (row.jquery) ? row : $(row);
      const $next = $row.next();

      // check if the row is already expanded
      if ($row.hasClass(cls.detailShow)) {
        $row.removeClass(cls.detailShow);

        // only hide the next row if it's a detail row
        if ($next.hasClass(cls.detail)) $next.hide();

        ft.raise(evt.rowCollapsed, { row: $row[0] });
      } else {
        ft.createOrUpdateDetailRow($row[0]);
        $row.addClass(cls.detailShow);
        $row.next().show();

        ft.raise(evt.rowExpanded, { row: $row[0] });
      }
    };

    ft.removeRow = function (row) {
      let $row = (row.jquery) ? row : $(row);
      if ($row.hasClass(cls.detail)) {
        $row = $row.prev();
      }
      const $next = $row.next();
      if ($row.data('detail_created') === true) {
        // remove the detail row
        $next.remove();
      }
      $row.remove();

      // raise event
      ft.raise(evt.rowRemoved);
    };

    ft.appendRow = function (row) {
      const $row = (row.jquery) ? row : $(row);
      $(ft.table).find('tbody').append($row);

      // redraw the table
      ft.redraw();
    };

    ft.getColumnFromTdIndex = function (index) {
      /// <summary>Returns the correct column data for the supplied index taking into account colspans.</summary>
      /// <param name="index">The index to retrieve the column data for.</param>
      /// <returns type="json">A JSON object containing the column data for the supplied index.</returns>
      let result = null;
      for (const column in ft.columns) {
        if ($.inArray(index, ft.columns[column].matches) >= 0) {
          result = ft.columns[column];
          break;
        }
      }
      return result;
    };

    ft.createOrUpdateDetailRow = function (actualRow) {
      const $row = $(actualRow); let $next = $row.next(); let $detail; const
        values = [];
      if ($row.data('detail_created') === true) return true;

      if ($row.is(':hidden')) return false; // if the row is hidden for some reason (perhaps filtered) then get out of here
      ft.raise(evt.rowDetailUpdating, { row: $row, detail: $next });
      $row.find('> td:hidden').each(function () {
        const index = $(this).index(); const column = ft.getColumnFromTdIndex(index); let
          { name } = column;
        if (column.ignore === true) return true;

        if (index in column.names) name = column.names[index];
        values.push({
          name, value: ft.parse(this, column), display: $.trim($(this).html()), group: column.group, groupName: column.groupName,
        });
        return true;
      });
      if (values.length === 0) return false; // return if we don't have any data to show
      const colspan = $row.find('> td:visible').length;
      const exists = $next.hasClass(cls.detail);
      if (!exists) { // Create
        $next = $(`<tr class="${cls.detail}"><td class="${cls.detailCell}"><div class="${cls.detailInner}"></div></td></tr>`);
        $row.after($next);
      }
      $next.find('> td:first').attr('colspan', colspan);
      $detail = $next.find(`.${cls.detailInner}`).empty();
      opt.createDetail($detail, values, opt.createGroupedDetail, opt.detailSeparator, cls);
      $row.data('detail_created', true);
      ft.raise(evt.rowDetailUpdated, { row: $row, detail: $next });
      return !exists;
    };

    ft.raise = function (eventName, args) {
      if (ft.options.debug === true && $.isFunction(ft.options.log)) ft.options.log(eventName, 'event');

      args = args || { };
      const def = { ft };
      $.extend(true, def, args);
      const e = $.Event(eventName, def);
      if (!e.ft) {
        $.extend(true, e, def);
      } // pre jQuery 1.6 which did not allow data to be passed to event object constructor
      $(ft.table).trigger(e);
      return e;
    };

    ft.init();
    return ft;
  }
}(jQuery, window));
