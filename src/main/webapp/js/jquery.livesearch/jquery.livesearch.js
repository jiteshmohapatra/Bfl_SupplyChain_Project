jQuery.fn.liveUpdate = function (list) {
  list = jQuery(list);

  if (list.length) {
    var rows = list.children('li');
    var cache = rows.map(function () {
      return this.innerHTML.toLowerCase();
    });

    this
      .keyup(filter).keyup()
      .parents('form').submit(() => false);
  }

  return this;

  function filter() {
    const term = jQuery.trim(jQuery(this).val().toLowerCase()); const
      scores = [];

    if (!term) {
      rows.show();
    } else {
      rows.hide();

      cache.each(function (i) {
        const score = this.score(term);
        if (score > 0) { scores.push([score, i]); }
      });

      jQuery.each(scores.sort((a, b) => b[0] - a[0]), function () {
        jQuery(rows[this[1]]).show();
      });
    }
  }
};
