ko.bindingHandlers.date_picker = {
  init(element, params) {
    const item = $(element);
    const minDate = item.attr('min-date');
    const maxDate = item.attr('max-date');
    const date = $.datepicker.parseDate('mm/dd/yy', item.prev().val());
    item.val($.datepicker.formatDate('dd/M/yy', date));
    item.datepicker({
      minDate: minDate && new Date(minDate),
      maxDate: maxDate && new Date(maxDate),
      dateFormat: 'dd/M/yy',
      buttonImageOnly: true,
    });
    item.change(function (event) {
      const picker = $(this);
      try {
        const d = $.datepicker.parseDate('dd/M/yy', picker.val());
        picker.prev().val($.datepicker.formatDate('mm/dd/yy', d));
      } catch (err) {
        picker.val('');
        picker.prev().val('');
      }
      picker.prev().trigger('change');
    });
  },
};

ko.bindingHandlers.search_product = {
  init(element, params) {
    $(element).autocomplete({
      delay: 300,
      minLength: 2,
      dataType: 'json',
      source(req, add) {
        $.getJSON(params().source, { term: req.term }, (data) => {
          const items = [];
          $.each(data, (i, item) => {
            items.push(item);
          });
          add(items);
        });
      },
      focus(event, ui) {
        return false;
      },
      change(event, ui) {
        if (!ui.item) {
          $(this).prev().val('');
          $(this).val('');
          $(this).valid();
        }
        $(this).prev().trigger('change');
      },
      select(event, ui) {
        if (ui.item) {
          // Set the hidden field with the id of the selected item
          $(this).prev().val(ui.item.id);
          $(this).prev().trigger('change');

          // Display selected item value
          $(this).val(ui.item.value);
          $(this).trigger('change');

          // If a product package was selected, set the hidden field
          // if (ui.item.productPackageId) {
          var productPackageId = $(this).closest('tr').find('.productPackageId');
          productPackageId.val(ui.item.productPackageId ? ui.item.productPackageId : 'null');
          productPackageId.trigger('change');

          var productPackageId = $(this).closest('tr').find('.productPackageId');

          // }
        }
      },
    })
      .data('autocomplete')._renderItem = function (ul, item) {
        if (params().id) ul.attr('id', params().id);
        const li = $('<li>').data('item.autocomplete', item);
        if (item.type == 'Product') {
          const text = item.quantity == null ? item.value : `${item.value} QTY: ${item.quantity}`;
          li.append(`<a>${text}</a>`);
        } else {
          li.append(`<span class='product-group'>${item.value}</span>`);
        }
        li.appendTo(ul);
        return li;
      };
  },
};

ko.bindingHandlers.autocomplete = {
  init(element, params) {
    $(element).autocomplete({
      delay: 300,
      minLength: 2,
      dataType: 'json',
      source(req, add) {
        $.getJSON(params().source, { term: req.term }, (data) => {
          const items = [];
          $.each(data, (i, item) => {
            items.push(item);
          });
          add(items);
        });
      },
      select(event, ui) {
        $(this).val(ui.item.value);
        $(this).trigger('change');
      },
    });
  },
};
ko.bindingHandlers.autocompleteWithId = {
  init(element, params) {
    $(element).autocomplete({
      delay: 300,
      minLength: 2,
      dataType: 'json',
      source(req, add) {
        $.getJSON(params().source, { term: req.term }, (data) => {
          const items = [];
          $.each(data, (i, item) => {
            items.push(item);
          });
          add(items);
        });
      },
      change(event, ui) {
        if (!ui.item) {
          $(this).prev().val('');
          $(this).val('');
          $(this).valid();
        }
        $(this).prev().trigger('change');
      },
      select(event, ui) {
        if (ui.item) {
          $(this).prev().val(ui.item.id);
          $(this).val(ui.item.value);
        }
        $(this).prev().trigger('change');
        $(this).trigger('change');
      },
    });
  },
};
// ko.bindingHandlers.numberOnly = {
//  init: function (element, params) {
//     $(element).change(function(){
//        if(this.value == "") this.value = "0";
//     });
//     $(element).keyup(function(){
//       this.value=this.value.replace(/[^\d]/,'');
//     });
//  }
// };
