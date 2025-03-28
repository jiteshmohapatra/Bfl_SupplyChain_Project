(function ($, w, undefined) {
  if (w.footable === undefined || w.footable === null) throw new Error('Please check and make sure footable.js is included in the page and is loaded prior to this script.');

  const defaults = {
    paginate: true,
    pageSize: 10,
    pageNavigation: '.pagination',
    firstText: '&laquo;',
    previousText: '&lsaquo;',
    nextText: '&rsaquo;',
    lastText: '&raquo;',
  };

  function pageInfo(ft) {
    const $table = $(ft.table); const
      $tbody = $table.find('> tbody');
    this.pageNavigation = $table.data('page-navigation') || ft.options.pageNavigation;
    this.pageSize = $table.data('page-size') || ft.options.pageSize;
    this.firstText = $table.data('page-first-text') || ft.options.firstText;
    this.previousText = $table.data('page-previous-text') || ft.options.previousText;
    this.nextText = $table.data('page-next-text') || ft.options.nextText;
    this.lastText = $table.data('page-last-text') || ft.options.lastText;
    this.currentPage = 0;
    this.pages = [];
    this.control = false;
  }

  function Paginate() {
    const p = this;
    p.name = 'Footable Paginate';

    p.init = function (ft) {
      if (ft.options.paginate === true) {
        if ($(ft.table).data('page') === false) return;
        $(ft.table).bind({
          footable_initialized() {
            ft.pageInfo = new pageInfo(ft);
            ft.raise('footable_setup_paging');
          },
          'footable_row_removed footable_redrawn footable_sorted footable_filtered footable_setup_paging': function () {
            if (ft.pageInfo) {
              p.setupPaging(ft);
            }
          },
        });
      }
    };

    p.setupPaging = function (ft) {
      const $tbody = $(ft.table).find('> tbody');
      p.createPages(ft, $tbody);
      p.createNavigation(ft, $tbody);
      p.fillPage(ft, $tbody, ft.pageInfo.currentPage);
    };

    p.createPages = function (ft, tbody) {
      let pages = 1;
      const info = ft.pageInfo;
      let pageCount = pages * info.pageSize;
      let page = [];
      const lastPage = [];
      info.pages = [];
      const rows = tbody.find('> tr:not(.footable-filtered,.footable-row-detail)');
      rows.each((i, row) => {
        page.push(row);
        if (i === pageCount - 1) {
          info.pages.push(page);
          pages++;
          pageCount = pages * info.pageSize;
          page = [];
        } else if (i >= rows.length - (rows.length % info.pageSize)) {
          lastPage.push(row);
        }
      });
      if (lastPage.length > 0) info.pages.push(lastPage);
      if (info.currentPage >= info.pages.length) info.currentPage = info.pages.length - 1;
      if (info.currentPage < 0) info.currentPage = 0;
      if (info.pages.length === 1) {
        // we only have a single page
        $(ft.table).addClass('no-paging');
      } else {
        $(ft.table).removeClass('no-paging');
      }
    };

    p.createNavigation = function (ft, tbody) {
      let $nav = $(ft.table).find(ft.pageInfo.pageNavigation);
      // if we cannot find the navigation control within the table, then try find it outside
      if ($nav.length === 0) {
        $nav = $(ft.pageInfo.pageNavigation);
        // if the navigation control is inside another table, then get out
        if ($nav.parents('table:first') !== $(ft.table)) return;
        // if we found more than one navigation control, write error to console
        if ($nav.length > 1 && ft.options.debug === true) console.error('More than one pagination control was found!');
      }
      // if we still cannot find the control, then don't do anything
      if ($nav.length === 0) return;
      // if the nav is not a UL, then find or create a UL
      if (!$nav.is('ul')) {
        if ($nav.find('ul:first').length === 0) { $nav.append('<ul />'); }
        $nav = $nav.find('ul');
      }
      $nav.find('li').remove();
      const info = ft.pageInfo;
      info.control = $nav;
      if (info.pages.length > 0) {
        $nav.append(`<li class="footable-page-arrow"><a data-page="first" href="#first">${ft.pageInfo.firstText}</a>`);
        $nav.append(`<li class="footable-page-arrow"><a data-page="prev" href="#prev">${ft.pageInfo.previousText}</a></li>`);
        $.each(info.pages, (i, page) => {
          if (page.length > 0) {
            $nav.append(`<li class="footable-page"><a data-page="${i}" href="#">${i + 1}</a></li>`);
          }
        });
        $nav.append(`<li class="footable-page-arrow"><a data-page="next" href="#next">${ft.pageInfo.nextText}</a></li>`);
        $nav.append(`<li class="footable-page-arrow"><a data-page="last" href="#last">${ft.pageInfo.lastText}</a></li>`);
      }
      $nav.find('a').click(function (e) {
        e.preventDefault();
        const page = $(this).data('page');
        let newPage = info.currentPage;
        if (page === 'first') {
          newPage = 0;
        } else if (page === 'prev') {
          if (newPage > 0) newPage--;
        } else if (page === 'next') {
          if (newPage < info.pages.length - 1) newPage++;
        } else if (page === 'last') {
          newPage = info.pages.length - 1;
        } else {
          newPage = page;
        }
        p.paginate(ft, newPage);
      });
      p.setPagingClasses($nav, info.currentPage, info.pages.length);
    };

    p.paginate = function (ft, newPage) {
      const info = ft.pageInfo;
      if (info.currentPage !== newPage) {
        const $tbody = $(ft.table).find('> tbody');

        // raise a pre-pagin event so that we can cancel the paging if needed
        const event = ft.raise('footable_paging', { page: newPage, size: info.pageSize });
        if (event && event.result === false) return;

        p.fillPage(ft, $tbody, newPage);
        info.control.find('li').removeClass('active disabled');
        p.setPagingClasses(info.control, info.currentPage, info.pages.length);
      }
    };

    p.setPagingClasses = function (nav, currentPage, pageCount) {
      nav.find(`li.footable-page > a[data-page=${currentPage}]`).parent().addClass('active');
      if (currentPage >= pageCount - 1) {
        nav.find('li.footable-page-arrow > a[data-page="next"]').parent().addClass('disabled');
        nav.find('li.footable-page-arrow > a[data-page="last"]').parent().addClass('disabled');
      }
      if (currentPage < 1) {
        nav.find('li.footable-page-arrow > a[data-page="first"]').parent().addClass('disabled');
        nav.find('li.footable-page-arrow > a[data-page="prev"]').parent().addClass('disabled');
      }
    };

    p.fillPage = function (ft, tbody, pageNumber) {
      ft.pageInfo.currentPage = pageNumber;
      tbody.find('> tr').hide();
      $(ft.pageInfo.pages[pageNumber]).each(function () {
        p.showRow(this, ft);
      });
    };

    p.showRow = function (row, ft) {
      const $row = $(row); const $next = $row.next(); const
        $table = $(ft.table);
      if ($table.hasClass('breakpoint') && $row.hasClass('footable-detail-show') && $next.hasClass('footable-row-detail')) {
        $row.add($next).show();
        ft.createOrUpdateDetailRow(row);
      } else $row.show();
    };
  }

  w.footable.plugins.register(Paginate, defaults);
}(jQuery, window));
