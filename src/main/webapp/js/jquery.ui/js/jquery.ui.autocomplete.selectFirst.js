/*
 * jQuery UI Autocomplete Select First Extension
 *
 * Copyright 2010, Scott González (http://scottgonzalez.com)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * http://github.com/scottgonzalez/jquery-ui-extensions
 */
(function ($) {
  $('.ui-autocomplete-input').live('autocompleteopen', function () {
    const autocomplete = $(this).data('autocomplete');
    const { menu } = autocomplete;

    if (!autocomplete.options.selectFirst) {
      return;
    }

    menu.activate($.Event({ type: 'mouseenter' }), menu.element.children().first());
  });
}(jQuery));
