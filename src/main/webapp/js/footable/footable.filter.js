(function ($, w, undefined) {
  if (w.footable === undefined || w.footable === null) throw new Error('Please check and make sure footable.js is included in the page and is loaded prior to this script.');

  const defaults = {
    filter: {
      enabled: true,
      input: '.footable-filter',
      timeout: 300,
      minimum: 2,
      disableEnter: false,
      filterFunction(index) {
        const $t = $(this);
        const $table = $t.parents('table:first');
        const filter = $table.data('current-filter').toUpperCase();
        let text = $t.find('td').text();
        if (!$table.data('filter-text-only')) {
          $t.find('td[data-value]').each(function () {
            text += $(this).data('value');
          });
        }
        return text.toUpperCase().indexOf(filter) >= 0;
      },
    },
  };

  function Filter() {
    const p = this;
    p.name = 'Footable Filter';
    p.init = function (ft) {
      p.footable = ft;
      if (ft.options.filter.enabled === true) {
        if ($(ft.table).data('filter') === false) return;
        ft.timers.register('filter');
        $(ft.table).bind({
          footable_initialized(e) {
            const $table = $(ft.table);
            const data = {
              input: $table.data('filter') || ft.options.filter.input,
              timeout: $table.data('filter-timeout') || ft.options.filter.timeout,
              minimum: $table.data('filter-minimum') || ft.options.filter.minimum,
              disableEnter: $table.data('filter-disable-enter') || ft.options.filter.disableEnter,
            };
            if (data.disableEnter) {
              $(data.input).keypress((event) => {
                if (window.event) return (window.event.keyCode !== 13);
                return (event.which !== 13);
              });
            }
            $table.bind('footable_clear_filter', () => {
              $(data.input).val('');
              p.clearFilter();
            });
            $table.bind('footable_filter', (event, args) => {
              p.filter(args.filter);
            });
            $(data.input).keyup((eve) => {
              ft.timers.filter.stop();
              if (eve.which === 27) {
                $(data.input).val('');
              }
              ft.timers.filter.start(() => {
                const val = $(data.input).val() || '';
                p.filter(val);
              }, data.timeout);
            });
          },
          footable_redrawn(e) {
            const $table = $(ft.table);
            const filter = $table.data('filter-string');
            if (filter) {
              p.filter(filter);
            }
          },
        })
        // save the filter object onto the table so we can access it later
          .data('footable-filter', p);
      }
    };

    p.filter = function (filterString) {
      const ft = p.footable;
      const $table = $(ft.table);
      const minimum = $table.data('filter-minimum') || ft.options.filter.minimum;
      const clear = !filterString;

      // raise a pre-filter event so that we can cancel the filtering if needed
      const event = ft.raise('footable_filtering', { filter: filterString, clear });
      if (event && event.result === false) return;
      if (event.filter && event.filter.length < minimum) {
        return; // if we do not have the minimum chars then do nothing
      }

      if (event.clear) {
        p.clearFilter();
      } else {
        const filters = event.filter.split(' ');

        $table.find('> tbody > tr').hide().addClass('footable-filtered');
        let rows = $table.find('> tbody > tr:not(.footable-row-detail)');
        $.each(filters, (i, f) => {
          if (f && f.length > 0) {
            $table.data('current-filter', f);
            rows = rows.filter(ft.options.filter.filterFunction);
          }
        });
        rows.each(function () {
          p.showRow(this, ft);
          $(this).removeClass('footable-filtered');
        });
        $table.data('filter-string', event.filter);
        ft.raise('footable_filtered', { filter: event.filter, clear: false });
      }
    };

    p.clearFilter = function () {
      const ft = p.footable;
      const $table = $(ft.table);

      $table.find('> tbody > tr:not(.footable-row-detail)').removeClass('footable-filtered').each(function () {
        p.showRow(this, ft);
      });
      $table.removeData('filter-string');
      ft.raise('footable_filtered', { clear: true });
    };

    p.showRow = function (row, ft) {
      const $row = $(row); const $next = $row.next(); const
        $table = $(ft.table);
      if ($row.is(':visible')) return; // already visible - do nothing
      if ($table.hasClass('breakpoint') && $row.hasClass('footable-detail-show') && $next.hasClass('footable-row-detail')) {
        $row.add($next).show();
        ft.createOrUpdateDetailRow(row);
      } else $row.show();
    };
  }

  w.footable.plugins.register(Filter, defaults);
}(jQuery, window));
