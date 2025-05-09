/*
 * INFORMATION
 * ---------------------------
 * Owner:     jquery.webspirited.com
 * Developer: Matthew Hailwood
 * ---------------------------
 *
 * CHANGELOG:
 * ---------------------------
 * 1.1
 * Fixed bug 01
 * Fixed bug 02
 *
 * ---------------------------
 * Bug Fix Credits:
 * --
 * * Number: 01
 * * Bug:  Initial color should be option "selected" from select
 * * Name: Nico <unknown>
 * --
 * * Number: 02
 * * Bug: Selects Change event should be called on color pick
 * * Name: Bob Farrell <unknown>
 */
(function ($) {
  $.fn.extend({
    colorpicker(options) {
      // Settings list and the default values
      const defaults = {
        label: '',
        size: 20,
        count: 6,
        hide: true,
      };

      var options = $.extend(defaults, options);
      let obj;
      const colors = {};

      const wrap = $('<div class="colorpicker-wrap"></div>');
      const label = $('<div class="colorpicker-label"></div>');
      const trigger = $('<div class="colorpicker-trigger"></div>');
      const picker = $(`<div style="width: ${(options.size + 4) * options.count}px" class="colorpicker-picker"></div>`);
      const info = $('<div class="colorpicker-picker-info"></div>');
      const clear = $('<div style="clear:both;"></div>');

      return this.each(function () {
        obj = this;

        // build an array of colors
        $(obj).children('option').each((i, elm) => {
          colors[i] = {};
          colors[i].color = $(elm).text();
          colors[i].value = $(elm).val();
        });
        create_wrap();
        if (options.label != '') create_label();
        create_trigger();
        create_picker();
        wrap.append(label);
        wrap.append(trigger);
        wrap.append(picker);
        wrap.append(clear);
        $(obj).after(wrap);
        if (options.hide) {
          $(obj).css({
            position: 'absolute',
            left: -10000,
          });
        }
      });

      function create_wrap() {
        wrap.mouseleave(() => {
          picker.fadeOut('slow');
        });
      }

      function create_label() {
        label.text(options.label);
        label.click(() => {
          trigger.click();
        });
      }

      function create_trigger() {
        trigger.click(function () {
          const offset = $(this).position();
          const { top } = offset;
          const left = offset.left + $(this).width() + 5;
          $(picker).css({
            top,
            left,
          }).fadeIn('slow');
        });
      }

      function create_picker() {
        picker.append(info);
        for (const i in colors) {
          picker.append(`<span class="colorpicker-picker-span ${colors[i].color == $(obj).children(':selected').text() ? ' active' : ''}" rel="${colors[i].value}" style="background-color: #${colors[i].color}; width: ${options.size}px; height: ${options.size}px;"></span>`);
        }
        trigger.css('background-color', `#${$(obj).children(':selected').text()}`);
        info.text(`#${$(obj).children(':selected').text()}`);
        picker.children('.colorpicker-picker-span').hover(function () {
          info.text(`#${$(this).attr('rel')}`);
        }, () => {
          info.text(`#${picker.children('.colorpicker-picker-span.active').attr('rel')}`);
        });
        picker.delegate('.colorpicker-picker-span', 'click', function () {
          info.text(`#${$(this).attr('rel')}`);
          $(obj).val($(this).attr('rel'));
          $(obj).change();
          picker.children('.colorpicker-picker-span.active').removeClass('active');
          $(this).addClass('active');
          trigger.css('background-color', $(this).css('background-color'));
        });
        $(obj).after(picker);
      }
    },
  });
}(jQuery));
