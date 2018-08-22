/*
* MultiSelect v0.9.11
* Copyright (c) 2012 Louis Cuny
*
* This program is free software. It comes without any warranty, to
* the extent permitted by applicable law. You can redistribute it
* and/or modify it under the terms of the Do What The Fuck You Want
* To Public License, Version 2, as published by Sam Hocevar. See
* http://sam.zoy.org/wtfpl/COPYING for more details.
*/

!function ($) {

  "use strict";


 /* MULTISELECT CLASS DEFINITION
  * ====================== */

  var MultiSelect = function (element, options) {
    this.options = options;
    this.$element = $(element);
    this.$container = $('<div/>', { 'class': " ms-container glyphicon glyphicon-resize-horizontal" });
    this.$selectableContainer = $('<div/>', { 'class': 'ms-selectable' });
    this.$selectionContainer = $('<div/>', { 'class': 'ms-selection' });
    this.$selectableUl = $('<ul/>', { 'class': "ms-list", 'tabindex' : '-1' });
    this.$selectionUl = $('<ul/>', { 'class': "ms-list", 'tabindex' : '-1' });
    this.scrollTo = 0;
    this.elemsSelector = 'li:visible:not(.ms-optgroup-label,.ms-optgroup-container,.'+options.disabledClass+')';
  };

  MultiSelect.prototype = {
    constructor: MultiSelect,

    init: function(){
      var that = this,
          ms = this.$element;

      if (ms.next('.ms-container').length === 0){
        ms.css({ position: 'absolute', left: '-9999px' });
        ms.attr('id', ms.attr('id') ? ms.attr('id') : Math.ceil(Math.random()*1000)+'multiselect');
        this.$container.attr('id', 'ms-'+ms.attr('id'));
        this.$container.addClass(that.options.cssClass);
        ms.find('option').each(function(){
          that.generateLisFromOption(this);
        });

        this.$selectionUl.find('.ms-optgroup-label').hide();

        if (that.options.selectableHeader){
          that.$selectableContainer.append(that.options.selectableHeader);
        }
        that.$selectableContainer.append(that.$selectableUl);
        if (that.options.selectableFooter){
          that.$selectableContainer.append(that.options.selectableFooter);
        }

        if (that.options.selectionHeader){
          that.$selectionContainer.append(that.options.selectionHeader);
        }
        that.$selectionContainer.append(that.$selectionUl);
        if (that.options.selectionFooter){
          that.$selectionContainer.append(that.options.selectionFooter);
        }

        that.$container.append(that.$selectableContainer);
        that.$container.append(that.$selectionContainer);
        ms.after(that.$container);

        that.activeMouse(that.$selectableUl);
        that.activeKeyboard(that.$selectableUl);

        var action = that.options.dblClick ? 'dblclick' : 'click';

        that.$selectableUl.on(action, '.ms-elem-selectable', function(){
          that.select($(this).data('ms-value'));
        });
        that.$selectionUl.on(action, '.ms-elem-selection', function(){
          that.deselect($(this).data('ms-value'));
        });

        that.activeMouse(that.$selectionUl);
        that.activeKeyboard(that.$selectionUl);

        ms.on('focus', function(){
          that.$selectableUl.focus();
        })
      }

      var selectedValues = ms.find('option:selected').map(function(){ return $(this).val(); }).get();
      that.select(selectedValues, 'init');

      if (typeof that.options.afterInit === 'function') {
        that.options.afterInit.call(this, this.$container);
      }
    },

    'generateLisFromOption' : function(option, index, $container){
      var that = this,
          ms = that.$element,
          attributes = "",
          $option = $(option);

      for (var cpt = 0; cpt < option.attributes.length; cpt++){
        var attr = option.attributes[cpt];

        if(attr.name !== 'value' && attr.name !== 'disabled'){
          attributes += attr.name+'="'+attr.value+'" ';
        }
      }
      var selectableLi = $('<li '+attributes+'><span>'+that.escapeHTML($option.text())+'</span></li>'),
          selectedLi = selectableLi.clone(),
          value = $option.val(),
          elementId = that.sanitize(value);

      selectableLi
        .data('ms-value', value)
        .addClass('ms-elem-selectable')
        .attr('id', elementId+'-selectable');

      selectedLi
        .data('ms-value', value)
        .addClass('ms-elem-selection')
        .attr('id', elementId+'-selection')
        .hide();

      if ($option.prop('disabled') || ms.prop('disabled')){
        selectedLi.addClass(that.options.disabledClass);
        selectableLi.addClass(that.options.disabledClass);
      }

      var $optgroup = $option.parent('optgroup');

      if ($optgroup.length > 0){
        var optgroupLabel = $optgroup.attr('label'),
            optgroupId = that.sanitize(optgroupLabel),
            $selectableOptgroup = that.$selectableUl.find('#optgroup-selectable-'+optgroupId),
            $selectionOptgroup = that.$selectionUl.find('#optgroup-selection-'+optgroupId);

        if ($selectableOptgroup.length === 0){
          var optgroupContainerTpl = '<li class="ms-optgroup-container"></li>',
              optgroupTpl = '<ul class="ms-optgroup"><li class="ms-optgroup-label"><span>'+optgroupLabel+'</span></li></ul>';

          $selectableOptgroup = $(optgroupContainerTpl);
          $selectionOptgroup = $(optgroupContainerTpl);
          $selectableOptgroup.attr('id', 'optgroup-selectable-'+optgroupId);
          $selectionOptgroup.attr('id', 'optgroup-selection-'+optgroupId);
          $selectableOptgroup.append($(optgroupTpl));
          $selectionOptgroup.append($(optgroupTpl));
          if (that.options.selectableOptgroup){
            $selectableOptgroup.find('.ms-optgroup-label').on('click', function(){
              var values = $optgroup.children(':not(:selected, :disabled)').map(function(){ return $(this).val() }).get();
              that.select(values);
            });
            $selectionOptgroup.find('.ms-optgroup-label').on('click', function(){
              var values = $optgroup.children(':selected:not(:disabled)').map(function(){ return $(this).val() }).get();
              that.deselect(values);
            });
          }
          that.$selectableUl.append($selectableOptgroup);
          that.$selectionUl.append($selectionOptgroup);
        }
        index = index == undefined ? $selectableOptgroup.find('ul').children().length : index + 1;
        selectableLi.insertAt(index, $selectableOptgroup.children());
        selectedLi.insertAt(index, $selectionOptgroup.children());
      } else {
        index = index == undefined ? that.$selectableUl.children().length : index;

        selectableLi.insertAt(index, that.$selectableUl);
        selectedLi.insertAt(index, that.$selectionUl);
      }
    },

    'addOption' : function(options){
      var that = this;

      if (options.value) options = [options];
      $.each(options, function(index, option){
        if (option.value && that.$element.find("option[value='"+option.value+"']").length === 0){
          var $option = $('<option value="'+option.value+'">'+option.text+'</option>'),
              index = parseInt((typeof option.index === 'undefined' ? that.$element.children().length : option.index)),
              $container = option.nested == undefined ? that.$element : $("optgroup[label='"+option.nested+"']")

          $option.insertAt(index, $container);
          that.generateLisFromOption($option.get(0), index, option.nested);
        }
      })
    },

    'escapeHTML' : function(text){
      return $("<div>").text(text).html();
    },

    'activeKeyboard' : function($list){
      var that = this;

      $list.on('focus', function(){
        $(this).addClass('ms-focus');
      })
      .on('blur', function(){
        $(this).removeClass('ms-focus');
      })
      .on('keydown', function(e){
        switch (e.which) {
          case 40:
          case 38:
            e.preventDefault();
            e.stopPropagation();
            that.moveHighlight($(this), (e.which === 38) ? -1 : 1);
            return;
          case 37:
          case 39:
            e.preventDefault();
            e.stopPropagation();
            that.switchList($list);
            return;
          case 9:
            if(that.$element.is('[tabindex]')){
              e.preventDefault();
              var tabindex = parseInt(that.$element.attr('tabindex'), 10);
              tabindex = (e.shiftKey) ? tabindex-1 : tabindex+1;
              $('[tabindex="'+(tabindex)+'"]').focus();
              return;
            }else{
              if(e.shiftKey){
                that.$element.trigger('focus');
              }
            }
        }
        if($.inArray(e.which, that.options.keySelect) > -1){
          e.preventDefault();
          e.stopPropagation();
          that.selectHighlighted($list);
          return;
        }
      });
    },

    'moveHighlight': function($list, direction){
      var $elems = $list.find(this.elemsSelector),
          $currElem = $elems.filter('.ms-hover'),
          $nextElem = null,
          elemHeight = $elems.first().outerHeight(),
          containerHeight = $list.height(),
          containerSelector = '#'+this.$container.prop('id');

      $elems.removeClass('ms-hover');
      if (direction === 1){ // DOWN

        $nextElem = $currElem.nextAll(this.elemsSelector).first();
        if ($nextElem.length === 0){
          var $optgroupUl = $currElem.parent();

          if ($optgroupUl.hasClass('ms-optgroup')){
            var $optgroupLi = $optgroupUl.parent(),
                $nextOptgroupLi = $optgroupLi.next(':visible');

            if ($nextOptgroupLi.length > 0){
              $nextElem = $nextOptgroupLi.find(this.elemsSelector).first();
            } else {
              $nextElem = $elems.first();
            }
          } else {
            $nextElem = $elems.first();
          }
        }
      } else if (direction === -1){ // UP

        $nextElem = $currElem.prevAll(this.elemsSelector).first();
        if ($nextElem.length === 0){
          var $optgroupUl = $currElem.parent();

          if ($optgroupUl.hasClass('ms-optgroup')){
            var $optgroupLi = $optgroupUl.parent(),
                $prevOptgroupLi = $optgroupLi.prev(':visible');

            if ($prevOptgroupLi.length > 0){
              $nextElem = $prevOptgroupLi.find(this.elemsSelector).last();
            } else {
              $nextElem = $elems.last();
            }
          } else {
            $nextElem = $elems.last();
          }
        }
      }
      if ($nextElem.length > 0){
        $nextElem.addClass('ms-hover');
        var scrollTo = $list.scrollTop() + $nextElem.position().top - 
                       containerHeight / 2 + elemHeight / 2;

        $list.scrollTop(scrollTo);
      }
    },

    'selectHighlighted' : function($list){
      var $elems = $list.find(this.elemsSelector),
          $highlightedElem = $elems.filter('.ms-hover').first();

      if ($highlightedElem.length > 0){
        if ($list.parent().hasClass('ms-selectable')){
          this.select($highlightedElem.data('ms-value'));
        } else {
          this.deselect($highlightedElem.data('ms-value'));
        }
        $elems.removeClass('ms-hover');
      }
    },

    'switchList' : function($list){
      $list.blur();
      this.$container.find(this.elemsSelector).removeClass('ms-hover');
      if ($list.parent().hasClass('ms-selectable')){
        this.$selectionUl.focus();
      } else {
        this.$selectableUl.focus();
      }
    },

    'activeMouse' : function($list){
      var that = this;

      $('body').on('mouseenter', that.elemsSelector, function(){
        $(this).parents('.ms-container').find(that.elemsSelector).removeClass('ms-hover');
        $(this).addClass('ms-hover');
      });

      $('body').on('mouseleave', that.elemsSelector, function () {
          $(this).parents('.ms-container').find(that.elemsSelector).removeClass('ms-hover');;
      });
    },

    'refresh' : function() {
      this.destroy();
      this.$element.multiSelect(this.options);
    },

    'destroy' : function(){
      $("#ms-"+this.$element.attr("id")).remove();
      this.$element.css('position', '').css('left', '')
      this.$element.removeData('multiselect');
    },

    'select' : function(value, method){
      if (typeof value === 'string'){ value = [value]; }

      var that = this,
          ms = this.$element,
          msIds = $.map(value, function(val){ return(that.sanitize(val)); }),
          selectables = this.$selectableUl.find('#' + msIds.join('-selectable, #')+'-selectable').filter(':not(.'+that.options.disabledClass+')'),
          selections = this.$selectionUl.find('#' + msIds.join('-selection, #') + '-selection').filter(':not(.'+that.options.disabledClass+')'),
          options = ms.find('option:not(:disabled)').filter(function(){ return($.inArray(this.value, value) > -1); });

      if (method === 'init'){
        selectables = this.$selectableUl.find('#' + msIds.join('-selectable, #')+'-selectable'),
        selections = this.$selectionUl.find('#' + msIds.join('-selection, #') + '-selection');
      }

      if (selectables.length > 0){
        selectables.addClass('ms-selected').hide();
        selections.addClass('ms-selected').show();

        options.prop('selected', true);

        that.$container.find(that.elemsSelector).removeClass('ms-hover');

        var selectableOptgroups = that.$selectableUl.children('.ms-optgroup-container');
        if (selectableOptgroups.length > 0){
          selectableOptgroups.each(function(){
            var selectablesLi = $(this).find('.ms-elem-selectable');
            if (selectablesLi.length === selectablesLi.filter('.ms-selected').length){
              $(this).find('.ms-optgroup-label').hide();
            }
          });

          var selectionOptgroups = that.$selectionUl.children('.ms-optgroup-container');
          selectionOptgroups.each(function(){
            var selectionsLi = $(this).find('.ms-elem-selection');
            if (selectionsLi.filter('.ms-selected').length > 0){
              $(this).find('.ms-optgroup-label').show();
            }
          });
        } else {
          if (that.options.keepOrder && method !== 'init'){
            var selectionLiLast = that.$selectionUl.find('.ms-selected');
            if((selectionLiLast.length > 1) && (selectionLiLast.last().get(0) != selections.get(0))) {
              selections.insertAfter(selectionLiLast.last());
            }
          }
        }
        if (method !== 'init'){
          ms.trigger('change');
          if (typeof that.options.afterSelect === 'function') {
            that.options.afterSelect.call(this, value);
          }
        }
      }
    },

    'deselect' : function(value){
      if (typeof value === 'string'){ value = [value]; }

      var that = this,
          ms = this.$element,
          msIds = $.map(value, function(val){ return(that.sanitize(val)); }),
          selectables = this.$selectableUl.find('#' + msIds.join('-selectable, #')+'-selectable'),
          selections = this.$selectionUl.find('#' + msIds.join('-selection, #')+'-selection').filter('.ms-selected').filter(':not(.'+that.options.disabledClass+')'),
          options = ms.find('option').filter(function(){ return($.inArray(this.value, value) > -1); });

      if (selections.length > 0){
        selectables.removeClass('ms-selected').show();
        selections.removeClass('ms-selected').hide();
        options.prop('selected', false);

        that.$container.find(that.elemsSelector).removeClass('ms-hover');

        var selectableOptgroups = that.$selectableUl.children('.ms-optgroup-container');
        if (selectableOptgroups.length > 0){
          selectableOptgroups.each(function(){
            var selectablesLi = $(this).find('.ms-elem-selectable');
            if (selectablesLi.filter(':not(.ms-selected)').length > 0){
              $(this).find('.ms-optgroup-label').show();
            }
          });

          var selectionOptgroups = that.$selectionUl.children('.ms-optgroup-container');
          selectionOptgroups.each(function(){
            var selectionsLi = $(this).find('.ms-elem-selection');
            if (selectionsLi.filter('.ms-selected').length === 0){
              $(this).find('.ms-optgroup-label').hide();
            }
          });
        }
        ms.trigger('change');
        if (typeof that.options.afterDeselect === 'function') {
          that.options.afterDeselect.call(this, value);
        }
      }
    },

    'select_all' : function(){
      var ms = this.$element,
          values = ms.val();

      ms.find('option:not(":disabled")').prop('selected', true);
      this.$selectableUl.find('.ms-elem-selectable').filter(':not(.'+this.options.disabledClass+')').addClass('ms-selected').hide();
      this.$selectionUl.find('.ms-optgroup-label').show();
      this.$selectableUl.find('.ms-optgroup-label').hide();
      this.$selectionUl.find('.ms-elem-selection').filter(':not(.'+this.options.disabledClass+')').addClass('ms-selected').show();
      this.$selectionUl.focus();
      ms.trigger('change');
      if (typeof this.options.afterSelect === 'function') {
        var selectedValues = $.grep(ms.val(), function(item){
          return $.inArray(item, values) < 0;
        });
        this.options.afterSelect.call(this, selectedValues);
      }
    },

    'deselect_all' : function(){
      var ms = this.$element,
          values = ms.val();

      ms.find('option').prop('selected', false);
      this.$selectableUl.find('.ms-elem-selectable').removeClass('ms-selected').show();
      this.$selectionUl.find('.ms-optgroup-label').hide();
      this.$selectableUl.find('.ms-optgroup-label').show();
      this.$selectionUl.find('.ms-elem-selection').removeClass('ms-selected').hide();
      this.$selectableUl.focus();
      ms.trigger('change');
      if (typeof this.options.afterDeselect === 'function') {
        this.options.afterDeselect.call(this, values);
      }
    },

    sanitize: function(value){
      var hash = 0, i, character;
      if (value.length == 0) return hash;
      var ls = 0;
      for (i = 0, ls = value.length; i < ls; i++) {
        character  = value.charCodeAt(i);
        hash  = ((hash<<5)-hash)+character;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    }
  };

  /* MULTISELECT PLUGIN DEFINITION
   * ======================= */

  $.fn.multiSelect = function () {
    var option = arguments[0],
        args = arguments;

    return this.each(function () {
      var $this = $(this),
          data = $this.data('multiselect'),
          options = $.extend({}, $.fn.multiSelect.defaults, $this.data(), typeof option === 'object' && option);

      if (!data){ $this.data('multiselect', (data = new MultiSelect(this, options))); }

      if (typeof option === 'string'){
        data[option](args[1]);
      } else {
        data.init();
      }
    });
  };

  $.fn.multiSelect.defaults = {
    keySelect: [32],
    selectableOptgroup: false,
    disabledClass : 'disabled',
    dblClick : false,
    keepOrder: false,
    cssClass: ''
  };

  $.fn.multiSelect.Constructor = MultiSelect;

  $.fn.insertAt = function(index, $parent) {
    return this.each(function() {
      if (index === 0) {
        $parent.prepend(this);
      } else {
        $parent.children().eq(index - 1).after(this);
      }
    });
}

}(window.jQuery);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkYWlseXN0YXRlbWVudC9tdWx0aS1zZWxlY3QuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbiogTXVsdGlTZWxlY3QgdjAuOS4xMVxuKiBDb3B5cmlnaHQgKGMpIDIwMTIgTG91aXMgQ3VueVxuKlxuKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZS4gSXQgY29tZXMgd2l0aG91dCBhbnkgd2FycmFudHksIHRvXG4qIHRoZSBleHRlbnQgcGVybWl0dGVkIGJ5IGFwcGxpY2FibGUgbGF3LiBZb3UgY2FuIHJlZGlzdHJpYnV0ZSBpdFxuKiBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgRG8gV2hhdCBUaGUgRnVjayBZb3UgV2FudFxuKiBUbyBQdWJsaWMgTGljZW5zZSwgVmVyc2lvbiAyLCBhcyBwdWJsaXNoZWQgYnkgU2FtIEhvY2V2YXIuIFNlZVxuKiBodHRwOi8vc2FtLnpveS5vcmcvd3RmcGwvQ09QWUlORyBmb3IgbW9yZSBkZXRhaWxzLlxuKi9cblxuIWZ1bmN0aW9uICgkKSB7XG5cbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cblxuIC8qIE1VTFRJU0VMRUNUIENMQVNTIERFRklOSVRJT05cbiAgKiA9PT09PT09PT09PT09PT09PT09PT09ICovXG5cbiAgdmFyIE11bHRpU2VsZWN0ID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuJGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuICAgIHRoaXMuJGNvbnRhaW5lciA9ICQoJzxkaXYvPicsIHsgJ2NsYXNzJzogXCIgbXMtY29udGFpbmVyIGdseXBoaWNvbiBnbHlwaGljb24tcmVzaXplLWhvcml6b250YWxcIiB9KTtcbiAgICB0aGlzLiRzZWxlY3RhYmxlQ29udGFpbmVyID0gJCgnPGRpdi8+JywgeyAnY2xhc3MnOiAnbXMtc2VsZWN0YWJsZScgfSk7XG4gICAgdGhpcy4kc2VsZWN0aW9uQ29udGFpbmVyID0gJCgnPGRpdi8+JywgeyAnY2xhc3MnOiAnbXMtc2VsZWN0aW9uJyB9KTtcbiAgICB0aGlzLiRzZWxlY3RhYmxlVWwgPSAkKCc8dWwvPicsIHsgJ2NsYXNzJzogXCJtcy1saXN0XCIsICd0YWJpbmRleCcgOiAnLTEnIH0pO1xuICAgIHRoaXMuJHNlbGVjdGlvblVsID0gJCgnPHVsLz4nLCB7ICdjbGFzcyc6IFwibXMtbGlzdFwiLCAndGFiaW5kZXgnIDogJy0xJyB9KTtcbiAgICB0aGlzLnNjcm9sbFRvID0gMDtcbiAgICB0aGlzLmVsZW1zU2VsZWN0b3IgPSAnbGk6dmlzaWJsZTpub3QoLm1zLW9wdGdyb3VwLWxhYmVsLC5tcy1vcHRncm91cC1jb250YWluZXIsLicrb3B0aW9ucy5kaXNhYmxlZENsYXNzKycpJztcbiAgfTtcblxuICBNdWx0aVNlbGVjdC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IE11bHRpU2VsZWN0LFxuXG4gICAgaW5pdDogZnVuY3Rpb24oKXtcbiAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICBtcyA9IHRoaXMuJGVsZW1lbnQ7XG5cbiAgICAgIGlmIChtcy5uZXh0KCcubXMtY29udGFpbmVyJykubGVuZ3RoID09PSAwKXtcbiAgICAgICAgbXMuY3NzKHsgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6ICctOTk5OXB4JyB9KTtcbiAgICAgICAgbXMuYXR0cignaWQnLCBtcy5hdHRyKCdpZCcpID8gbXMuYXR0cignaWQnKSA6IE1hdGguY2VpbChNYXRoLnJhbmRvbSgpKjEwMDApKydtdWx0aXNlbGVjdCcpO1xuICAgICAgICB0aGlzLiRjb250YWluZXIuYXR0cignaWQnLCAnbXMtJyttcy5hdHRyKCdpZCcpKTtcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLmFkZENsYXNzKHRoYXQub3B0aW9ucy5jc3NDbGFzcyk7XG4gICAgICAgIG1zLmZpbmQoJ29wdGlvbicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGF0LmdlbmVyYXRlTGlzRnJvbU9wdGlvbih0aGlzKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kc2VsZWN0aW9uVWwuZmluZCgnLm1zLW9wdGdyb3VwLWxhYmVsJykuaGlkZSgpO1xuXG4gICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuc2VsZWN0YWJsZUhlYWRlcil7XG4gICAgICAgICAgdGhhdC4kc2VsZWN0YWJsZUNvbnRhaW5lci5hcHBlbmQodGhhdC5vcHRpb25zLnNlbGVjdGFibGVIZWFkZXIpO1xuICAgICAgICB9XG4gICAgICAgIHRoYXQuJHNlbGVjdGFibGVDb250YWluZXIuYXBwZW5kKHRoYXQuJHNlbGVjdGFibGVVbCk7XG4gICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuc2VsZWN0YWJsZUZvb3Rlcil7XG4gICAgICAgICAgdGhhdC4kc2VsZWN0YWJsZUNvbnRhaW5lci5hcHBlbmQodGhhdC5vcHRpb25zLnNlbGVjdGFibGVGb290ZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5zZWxlY3Rpb25IZWFkZXIpe1xuICAgICAgICAgIHRoYXQuJHNlbGVjdGlvbkNvbnRhaW5lci5hcHBlbmQodGhhdC5vcHRpb25zLnNlbGVjdGlvbkhlYWRlcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhhdC4kc2VsZWN0aW9uQ29udGFpbmVyLmFwcGVuZCh0aGF0LiRzZWxlY3Rpb25VbCk7XG4gICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuc2VsZWN0aW9uRm9vdGVyKXtcbiAgICAgICAgICB0aGF0LiRzZWxlY3Rpb25Db250YWluZXIuYXBwZW5kKHRoYXQub3B0aW9ucy5zZWxlY3Rpb25Gb290ZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhhdC4kY29udGFpbmVyLmFwcGVuZCh0aGF0LiRzZWxlY3RhYmxlQ29udGFpbmVyKTtcbiAgICAgICAgdGhhdC4kY29udGFpbmVyLmFwcGVuZCh0aGF0LiRzZWxlY3Rpb25Db250YWluZXIpO1xuICAgICAgICBtcy5hZnRlcih0aGF0LiRjb250YWluZXIpO1xuXG4gICAgICAgIHRoYXQuYWN0aXZlTW91c2UodGhhdC4kc2VsZWN0YWJsZVVsKTtcbiAgICAgICAgdGhhdC5hY3RpdmVLZXlib2FyZCh0aGF0LiRzZWxlY3RhYmxlVWwpO1xuXG4gICAgICAgIHZhciBhY3Rpb24gPSB0aGF0Lm9wdGlvbnMuZGJsQ2xpY2sgPyAnZGJsY2xpY2snIDogJ2NsaWNrJztcblxuICAgICAgICB0aGF0LiRzZWxlY3RhYmxlVWwub24oYWN0aW9uLCAnLm1zLWVsZW0tc2VsZWN0YWJsZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdGhhdC5zZWxlY3QoJCh0aGlzKS5kYXRhKCdtcy12YWx1ZScpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoYXQuJHNlbGVjdGlvblVsLm9uKGFjdGlvbiwgJy5tcy1lbGVtLXNlbGVjdGlvbicsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdGhhdC5kZXNlbGVjdCgkKHRoaXMpLmRhdGEoJ21zLXZhbHVlJykpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGF0LmFjdGl2ZU1vdXNlKHRoYXQuJHNlbGVjdGlvblVsKTtcbiAgICAgICAgdGhhdC5hY3RpdmVLZXlib2FyZCh0aGF0LiRzZWxlY3Rpb25VbCk7XG5cbiAgICAgICAgbXMub24oJ2ZvY3VzJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGF0LiRzZWxlY3RhYmxlVWwuZm9jdXMoKTtcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdmFyIHNlbGVjdGVkVmFsdWVzID0gbXMuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykubWFwKGZ1bmN0aW9uKCl7IHJldHVybiAkKHRoaXMpLnZhbCgpOyB9KS5nZXQoKTtcbiAgICAgIHRoYXQuc2VsZWN0KHNlbGVjdGVkVmFsdWVzLCAnaW5pdCcpO1xuXG4gICAgICBpZiAodHlwZW9mIHRoYXQub3B0aW9ucy5hZnRlckluaXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhhdC5vcHRpb25zLmFmdGVySW5pdC5jYWxsKHRoaXMsIHRoaXMuJGNvbnRhaW5lcik7XG4gICAgICB9XG4gICAgfSxcblxuICAgICdnZW5lcmF0ZUxpc0Zyb21PcHRpb24nIDogZnVuY3Rpb24ob3B0aW9uLCBpbmRleCwgJGNvbnRhaW5lcil7XG4gICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgbXMgPSB0aGF0LiRlbGVtZW50LFxuICAgICAgICAgIGF0dHJpYnV0ZXMgPSBcIlwiLFxuICAgICAgICAgICRvcHRpb24gPSAkKG9wdGlvbik7XG5cbiAgICAgIGZvciAodmFyIGNwdCA9IDA7IGNwdCA8IG9wdGlvbi5hdHRyaWJ1dGVzLmxlbmd0aDsgY3B0Kyspe1xuICAgICAgICB2YXIgYXR0ciA9IG9wdGlvbi5hdHRyaWJ1dGVzW2NwdF07XG5cbiAgICAgICAgaWYoYXR0ci5uYW1lICE9PSAndmFsdWUnICYmIGF0dHIubmFtZSAhPT0gJ2Rpc2FibGVkJyl7XG4gICAgICAgICAgYXR0cmlidXRlcyArPSBhdHRyLm5hbWUrJz1cIicrYXR0ci52YWx1ZSsnXCIgJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIHNlbGVjdGFibGVMaSA9ICQoJzxsaSAnK2F0dHJpYnV0ZXMrJz48c3Bhbj4nK3RoYXQuZXNjYXBlSFRNTCgkb3B0aW9uLnRleHQoKSkrJzwvc3Bhbj48L2xpPicpLFxuICAgICAgICAgIHNlbGVjdGVkTGkgPSBzZWxlY3RhYmxlTGkuY2xvbmUoKSxcbiAgICAgICAgICB2YWx1ZSA9ICRvcHRpb24udmFsKCksXG4gICAgICAgICAgZWxlbWVudElkID0gdGhhdC5zYW5pdGl6ZSh2YWx1ZSk7XG5cbiAgICAgIHNlbGVjdGFibGVMaVxuICAgICAgICAuZGF0YSgnbXMtdmFsdWUnLCB2YWx1ZSlcbiAgICAgICAgLmFkZENsYXNzKCdtcy1lbGVtLXNlbGVjdGFibGUnKVxuICAgICAgICAuYXR0cignaWQnLCBlbGVtZW50SWQrJy1zZWxlY3RhYmxlJyk7XG5cbiAgICAgIHNlbGVjdGVkTGlcbiAgICAgICAgLmRhdGEoJ21zLXZhbHVlJywgdmFsdWUpXG4gICAgICAgIC5hZGRDbGFzcygnbXMtZWxlbS1zZWxlY3Rpb24nKVxuICAgICAgICAuYXR0cignaWQnLCBlbGVtZW50SWQrJy1zZWxlY3Rpb24nKVxuICAgICAgICAuaGlkZSgpO1xuXG4gICAgICBpZiAoJG9wdGlvbi5wcm9wKCdkaXNhYmxlZCcpIHx8IG1zLnByb3AoJ2Rpc2FibGVkJykpe1xuICAgICAgICBzZWxlY3RlZExpLmFkZENsYXNzKHRoYXQub3B0aW9ucy5kaXNhYmxlZENsYXNzKTtcbiAgICAgICAgc2VsZWN0YWJsZUxpLmFkZENsYXNzKHRoYXQub3B0aW9ucy5kaXNhYmxlZENsYXNzKTtcbiAgICAgIH1cblxuICAgICAgdmFyICRvcHRncm91cCA9ICRvcHRpb24ucGFyZW50KCdvcHRncm91cCcpO1xuXG4gICAgICBpZiAoJG9wdGdyb3VwLmxlbmd0aCA+IDApe1xuICAgICAgICB2YXIgb3B0Z3JvdXBMYWJlbCA9ICRvcHRncm91cC5hdHRyKCdsYWJlbCcpLFxuICAgICAgICAgICAgb3B0Z3JvdXBJZCA9IHRoYXQuc2FuaXRpemUob3B0Z3JvdXBMYWJlbCksXG4gICAgICAgICAgICAkc2VsZWN0YWJsZU9wdGdyb3VwID0gdGhhdC4kc2VsZWN0YWJsZVVsLmZpbmQoJyNvcHRncm91cC1zZWxlY3RhYmxlLScrb3B0Z3JvdXBJZCksXG4gICAgICAgICAgICAkc2VsZWN0aW9uT3B0Z3JvdXAgPSB0aGF0LiRzZWxlY3Rpb25VbC5maW5kKCcjb3B0Z3JvdXAtc2VsZWN0aW9uLScrb3B0Z3JvdXBJZCk7XG5cbiAgICAgICAgaWYgKCRzZWxlY3RhYmxlT3B0Z3JvdXAubGVuZ3RoID09PSAwKXtcbiAgICAgICAgICB2YXIgb3B0Z3JvdXBDb250YWluZXJUcGwgPSAnPGxpIGNsYXNzPVwibXMtb3B0Z3JvdXAtY29udGFpbmVyXCI+PC9saT4nLFxuICAgICAgICAgICAgICBvcHRncm91cFRwbCA9ICc8dWwgY2xhc3M9XCJtcy1vcHRncm91cFwiPjxsaSBjbGFzcz1cIm1zLW9wdGdyb3VwLWxhYmVsXCI+PHNwYW4+JytvcHRncm91cExhYmVsKyc8L3NwYW4+PC9saT48L3VsPic7XG5cbiAgICAgICAgICAkc2VsZWN0YWJsZU9wdGdyb3VwID0gJChvcHRncm91cENvbnRhaW5lclRwbCk7XG4gICAgICAgICAgJHNlbGVjdGlvbk9wdGdyb3VwID0gJChvcHRncm91cENvbnRhaW5lclRwbCk7XG4gICAgICAgICAgJHNlbGVjdGFibGVPcHRncm91cC5hdHRyKCdpZCcsICdvcHRncm91cC1zZWxlY3RhYmxlLScrb3B0Z3JvdXBJZCk7XG4gICAgICAgICAgJHNlbGVjdGlvbk9wdGdyb3VwLmF0dHIoJ2lkJywgJ29wdGdyb3VwLXNlbGVjdGlvbi0nK29wdGdyb3VwSWQpO1xuICAgICAgICAgICRzZWxlY3RhYmxlT3B0Z3JvdXAuYXBwZW5kKCQob3B0Z3JvdXBUcGwpKTtcbiAgICAgICAgICAkc2VsZWN0aW9uT3B0Z3JvdXAuYXBwZW5kKCQob3B0Z3JvdXBUcGwpKTtcbiAgICAgICAgICBpZiAodGhhdC5vcHRpb25zLnNlbGVjdGFibGVPcHRncm91cCl7XG4gICAgICAgICAgICAkc2VsZWN0YWJsZU9wdGdyb3VwLmZpbmQoJy5tcy1vcHRncm91cC1sYWJlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIHZhciB2YWx1ZXMgPSAkb3B0Z3JvdXAuY2hpbGRyZW4oJzpub3QoOnNlbGVjdGVkLCA6ZGlzYWJsZWQpJykubWFwKGZ1bmN0aW9uKCl7IHJldHVybiAkKHRoaXMpLnZhbCgpIH0pLmdldCgpO1xuICAgICAgICAgICAgICB0aGF0LnNlbGVjdCh2YWx1ZXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkc2VsZWN0aW9uT3B0Z3JvdXAuZmluZCgnLm1zLW9wdGdyb3VwLWxhYmVsJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgdmFyIHZhbHVlcyA9ICRvcHRncm91cC5jaGlsZHJlbignOnNlbGVjdGVkOm5vdCg6ZGlzYWJsZWQpJykubWFwKGZ1bmN0aW9uKCl7IHJldHVybiAkKHRoaXMpLnZhbCgpIH0pLmdldCgpO1xuICAgICAgICAgICAgICB0aGF0LmRlc2VsZWN0KHZhbHVlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhhdC4kc2VsZWN0YWJsZVVsLmFwcGVuZCgkc2VsZWN0YWJsZU9wdGdyb3VwKTtcbiAgICAgICAgICB0aGF0LiRzZWxlY3Rpb25VbC5hcHBlbmQoJHNlbGVjdGlvbk9wdGdyb3VwKTtcbiAgICAgICAgfVxuICAgICAgICBpbmRleCA9IGluZGV4ID09IHVuZGVmaW5lZCA/ICRzZWxlY3RhYmxlT3B0Z3JvdXAuZmluZCgndWwnKS5jaGlsZHJlbigpLmxlbmd0aCA6IGluZGV4ICsgMTtcbiAgICAgICAgc2VsZWN0YWJsZUxpLmluc2VydEF0KGluZGV4LCAkc2VsZWN0YWJsZU9wdGdyb3VwLmNoaWxkcmVuKCkpO1xuICAgICAgICBzZWxlY3RlZExpLmluc2VydEF0KGluZGV4LCAkc2VsZWN0aW9uT3B0Z3JvdXAuY2hpbGRyZW4oKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmRleCA9IGluZGV4ID09IHVuZGVmaW5lZCA/IHRoYXQuJHNlbGVjdGFibGVVbC5jaGlsZHJlbigpLmxlbmd0aCA6IGluZGV4O1xuXG4gICAgICAgIHNlbGVjdGFibGVMaS5pbnNlcnRBdChpbmRleCwgdGhhdC4kc2VsZWN0YWJsZVVsKTtcbiAgICAgICAgc2VsZWN0ZWRMaS5pbnNlcnRBdChpbmRleCwgdGhhdC4kc2VsZWN0aW9uVWwpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAnYWRkT3B0aW9uJyA6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICBpZiAob3B0aW9ucy52YWx1ZSkgb3B0aW9ucyA9IFtvcHRpb25zXTtcbiAgICAgICQuZWFjaChvcHRpb25zLCBmdW5jdGlvbihpbmRleCwgb3B0aW9uKXtcbiAgICAgICAgaWYgKG9wdGlvbi52YWx1ZSAmJiB0aGF0LiRlbGVtZW50LmZpbmQoXCJvcHRpb25bdmFsdWU9J1wiK29wdGlvbi52YWx1ZStcIiddXCIpLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgICAgdmFyICRvcHRpb24gPSAkKCc8b3B0aW9uIHZhbHVlPVwiJytvcHRpb24udmFsdWUrJ1wiPicrb3B0aW9uLnRleHQrJzwvb3B0aW9uPicpLFxuICAgICAgICAgICAgICBpbmRleCA9IHBhcnNlSW50KCh0eXBlb2Ygb3B0aW9uLmluZGV4ID09PSAndW5kZWZpbmVkJyA/IHRoYXQuJGVsZW1lbnQuY2hpbGRyZW4oKS5sZW5ndGggOiBvcHRpb24uaW5kZXgpKSxcbiAgICAgICAgICAgICAgJGNvbnRhaW5lciA9IG9wdGlvbi5uZXN0ZWQgPT0gdW5kZWZpbmVkID8gdGhhdC4kZWxlbWVudCA6ICQoXCJvcHRncm91cFtsYWJlbD0nXCIrb3B0aW9uLm5lc3RlZCtcIiddXCIpXG5cbiAgICAgICAgICAkb3B0aW9uLmluc2VydEF0KGluZGV4LCAkY29udGFpbmVyKTtcbiAgICAgICAgICB0aGF0LmdlbmVyYXRlTGlzRnJvbU9wdGlvbigkb3B0aW9uLmdldCgwKSwgaW5kZXgsIG9wdGlvbi5uZXN0ZWQpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sXG5cbiAgICAnZXNjYXBlSFRNTCcgOiBmdW5jdGlvbih0ZXh0KXtcbiAgICAgIHJldHVybiAkKFwiPGRpdj5cIikudGV4dCh0ZXh0KS5odG1sKCk7XG4gICAgfSxcblxuICAgICdhY3RpdmVLZXlib2FyZCcgOiBmdW5jdGlvbigkbGlzdCl7XG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICRsaXN0Lm9uKCdmb2N1cycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ21zLWZvY3VzJyk7XG4gICAgICB9KVxuICAgICAgLm9uKCdibHVyJywgZnVuY3Rpb24oKXtcbiAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnbXMtZm9jdXMnKTtcbiAgICAgIH0pXG4gICAgICAub24oJ2tleWRvd24nLCBmdW5jdGlvbihlKXtcbiAgICAgICAgc3dpdGNoIChlLndoaWNoKSB7XG4gICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICBjYXNlIDM4OlxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHRoYXQubW92ZUhpZ2hsaWdodCgkKHRoaXMpLCAoZS53aGljaCA9PT0gMzgpID8gLTEgOiAxKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICBjYXNlIDM3OlxuICAgICAgICAgIGNhc2UgMzk6XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgdGhhdC5zd2l0Y2hMaXN0KCRsaXN0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICBpZih0aGF0LiRlbGVtZW50LmlzKCdbdGFiaW5kZXhdJykpe1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIHZhciB0YWJpbmRleCA9IHBhcnNlSW50KHRoYXQuJGVsZW1lbnQuYXR0cigndGFiaW5kZXgnKSwgMTApO1xuICAgICAgICAgICAgICB0YWJpbmRleCA9IChlLnNoaWZ0S2V5KSA/IHRhYmluZGV4LTEgOiB0YWJpbmRleCsxO1xuICAgICAgICAgICAgICAkKCdbdGFiaW5kZXg9XCInKyh0YWJpbmRleCkrJ1wiXScpLmZvY3VzKCk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICBpZihlLnNoaWZ0S2V5KXtcbiAgICAgICAgICAgICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ2ZvY3VzJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZigkLmluQXJyYXkoZS53aGljaCwgdGhhdC5vcHRpb25zLmtleVNlbGVjdCkgPiAtMSl7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgdGhhdC5zZWxlY3RIaWdobGlnaHRlZCgkbGlzdCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgJ21vdmVIaWdobGlnaHQnOiBmdW5jdGlvbigkbGlzdCwgZGlyZWN0aW9uKXtcbiAgICAgIHZhciAkZWxlbXMgPSAkbGlzdC5maW5kKHRoaXMuZWxlbXNTZWxlY3RvciksXG4gICAgICAgICAgJGN1cnJFbGVtID0gJGVsZW1zLmZpbHRlcignLm1zLWhvdmVyJyksXG4gICAgICAgICAgJG5leHRFbGVtID0gbnVsbCxcbiAgICAgICAgICBlbGVtSGVpZ2h0ID0gJGVsZW1zLmZpcnN0KCkub3V0ZXJIZWlnaHQoKSxcbiAgICAgICAgICBjb250YWluZXJIZWlnaHQgPSAkbGlzdC5oZWlnaHQoKSxcbiAgICAgICAgICBjb250YWluZXJTZWxlY3RvciA9ICcjJyt0aGlzLiRjb250YWluZXIucHJvcCgnaWQnKTtcblxuICAgICAgJGVsZW1zLnJlbW92ZUNsYXNzKCdtcy1ob3ZlcicpO1xuICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gMSl7IC8vIERPV05cblxuICAgICAgICAkbmV4dEVsZW0gPSAkY3VyckVsZW0ubmV4dEFsbCh0aGlzLmVsZW1zU2VsZWN0b3IpLmZpcnN0KCk7XG4gICAgICAgIGlmICgkbmV4dEVsZW0ubGVuZ3RoID09PSAwKXtcbiAgICAgICAgICB2YXIgJG9wdGdyb3VwVWwgPSAkY3VyckVsZW0ucGFyZW50KCk7XG5cbiAgICAgICAgICBpZiAoJG9wdGdyb3VwVWwuaGFzQ2xhc3MoJ21zLW9wdGdyb3VwJykpe1xuICAgICAgICAgICAgdmFyICRvcHRncm91cExpID0gJG9wdGdyb3VwVWwucGFyZW50KCksXG4gICAgICAgICAgICAgICAgJG5leHRPcHRncm91cExpID0gJG9wdGdyb3VwTGkubmV4dCgnOnZpc2libGUnKTtcblxuICAgICAgICAgICAgaWYgKCRuZXh0T3B0Z3JvdXBMaS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgJG5leHRFbGVtID0gJG5leHRPcHRncm91cExpLmZpbmQodGhpcy5lbGVtc1NlbGVjdG9yKS5maXJzdCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgJG5leHRFbGVtID0gJGVsZW1zLmZpcnN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRuZXh0RWxlbSA9ICRlbGVtcy5maXJzdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IC0xKXsgLy8gVVBcblxuICAgICAgICAkbmV4dEVsZW0gPSAkY3VyckVsZW0ucHJldkFsbCh0aGlzLmVsZW1zU2VsZWN0b3IpLmZpcnN0KCk7XG4gICAgICAgIGlmICgkbmV4dEVsZW0ubGVuZ3RoID09PSAwKXtcbiAgICAgICAgICB2YXIgJG9wdGdyb3VwVWwgPSAkY3VyckVsZW0ucGFyZW50KCk7XG5cbiAgICAgICAgICBpZiAoJG9wdGdyb3VwVWwuaGFzQ2xhc3MoJ21zLW9wdGdyb3VwJykpe1xuICAgICAgICAgICAgdmFyICRvcHRncm91cExpID0gJG9wdGdyb3VwVWwucGFyZW50KCksXG4gICAgICAgICAgICAgICAgJHByZXZPcHRncm91cExpID0gJG9wdGdyb3VwTGkucHJldignOnZpc2libGUnKTtcblxuICAgICAgICAgICAgaWYgKCRwcmV2T3B0Z3JvdXBMaS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgJG5leHRFbGVtID0gJHByZXZPcHRncm91cExpLmZpbmQodGhpcy5lbGVtc1NlbGVjdG9yKS5sYXN0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAkbmV4dEVsZW0gPSAkZWxlbXMubGFzdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkbmV4dEVsZW0gPSAkZWxlbXMubGFzdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCRuZXh0RWxlbS5sZW5ndGggPiAwKXtcbiAgICAgICAgJG5leHRFbGVtLmFkZENsYXNzKCdtcy1ob3ZlcicpO1xuICAgICAgICB2YXIgc2Nyb2xsVG8gPSAkbGlzdC5zY3JvbGxUb3AoKSArICRuZXh0RWxlbS5wb3NpdGlvbigpLnRvcCAtIFxuICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXJIZWlnaHQgLyAyICsgZWxlbUhlaWdodCAvIDI7XG5cbiAgICAgICAgJGxpc3Quc2Nyb2xsVG9wKHNjcm9sbFRvKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJ3NlbGVjdEhpZ2hsaWdodGVkJyA6IGZ1bmN0aW9uKCRsaXN0KXtcbiAgICAgIHZhciAkZWxlbXMgPSAkbGlzdC5maW5kKHRoaXMuZWxlbXNTZWxlY3RvciksXG4gICAgICAgICAgJGhpZ2hsaWdodGVkRWxlbSA9ICRlbGVtcy5maWx0ZXIoJy5tcy1ob3ZlcicpLmZpcnN0KCk7XG5cbiAgICAgIGlmICgkaGlnaGxpZ2h0ZWRFbGVtLmxlbmd0aCA+IDApe1xuICAgICAgICBpZiAoJGxpc3QucGFyZW50KCkuaGFzQ2xhc3MoJ21zLXNlbGVjdGFibGUnKSl7XG4gICAgICAgICAgdGhpcy5zZWxlY3QoJGhpZ2hsaWdodGVkRWxlbS5kYXRhKCdtcy12YWx1ZScpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmRlc2VsZWN0KCRoaWdobGlnaHRlZEVsZW0uZGF0YSgnbXMtdmFsdWUnKSk7XG4gICAgICAgIH1cbiAgICAgICAgJGVsZW1zLnJlbW92ZUNsYXNzKCdtcy1ob3ZlcicpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAnc3dpdGNoTGlzdCcgOiBmdW5jdGlvbigkbGlzdCl7XG4gICAgICAkbGlzdC5ibHVyKCk7XG4gICAgICB0aGlzLiRjb250YWluZXIuZmluZCh0aGlzLmVsZW1zU2VsZWN0b3IpLnJlbW92ZUNsYXNzKCdtcy1ob3ZlcicpO1xuICAgICAgaWYgKCRsaXN0LnBhcmVudCgpLmhhc0NsYXNzKCdtcy1zZWxlY3RhYmxlJykpe1xuICAgICAgICB0aGlzLiRzZWxlY3Rpb25VbC5mb2N1cygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kc2VsZWN0YWJsZVVsLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgICdhY3RpdmVNb3VzZScgOiBmdW5jdGlvbigkbGlzdCl7XG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICQoJ2JvZHknKS5vbignbW91c2VlbnRlcicsIHRoYXQuZWxlbXNTZWxlY3RvciwgZnVuY3Rpb24oKXtcbiAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcubXMtY29udGFpbmVyJykuZmluZCh0aGF0LmVsZW1zU2VsZWN0b3IpLnJlbW92ZUNsYXNzKCdtcy1ob3ZlcicpO1xuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdtcy1ob3ZlcicpO1xuICAgICAgfSk7XG5cbiAgICAgICQoJ2JvZHknKS5vbignbW91c2VsZWF2ZScsIHRoYXQuZWxlbXNTZWxlY3RvciwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICQodGhpcykucGFyZW50cygnLm1zLWNvbnRhaW5lcicpLmZpbmQodGhhdC5lbGVtc1NlbGVjdG9yKS5yZW1vdmVDbGFzcygnbXMtaG92ZXInKTs7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgJ3JlZnJlc2gnIDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuJGVsZW1lbnQubXVsdGlTZWxlY3QodGhpcy5vcHRpb25zKTtcbiAgICB9LFxuXG4gICAgJ2Rlc3Ryb3knIDogZnVuY3Rpb24oKXtcbiAgICAgICQoXCIjbXMtXCIrdGhpcy4kZWxlbWVudC5hdHRyKFwiaWRcIikpLnJlbW92ZSgpO1xuICAgICAgdGhpcy4kZWxlbWVudC5jc3MoJ3Bvc2l0aW9uJywgJycpLmNzcygnbGVmdCcsICcnKVxuICAgICAgdGhpcy4kZWxlbWVudC5yZW1vdmVEYXRhKCdtdWx0aXNlbGVjdCcpO1xuICAgIH0sXG5cbiAgICAnc2VsZWN0JyA6IGZ1bmN0aW9uKHZhbHVlLCBtZXRob2Qpe1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpeyB2YWx1ZSA9IFt2YWx1ZV07IH1cblxuICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgIG1zID0gdGhpcy4kZWxlbWVudCxcbiAgICAgICAgICBtc0lkcyA9ICQubWFwKHZhbHVlLCBmdW5jdGlvbih2YWwpeyByZXR1cm4odGhhdC5zYW5pdGl6ZSh2YWwpKTsgfSksXG4gICAgICAgICAgc2VsZWN0YWJsZXMgPSB0aGlzLiRzZWxlY3RhYmxlVWwuZmluZCgnIycgKyBtc0lkcy5qb2luKCctc2VsZWN0YWJsZSwgIycpKyctc2VsZWN0YWJsZScpLmZpbHRlcignOm5vdCguJyt0aGF0Lm9wdGlvbnMuZGlzYWJsZWRDbGFzcysnKScpLFxuICAgICAgICAgIHNlbGVjdGlvbnMgPSB0aGlzLiRzZWxlY3Rpb25VbC5maW5kKCcjJyArIG1zSWRzLmpvaW4oJy1zZWxlY3Rpb24sICMnKSArICctc2VsZWN0aW9uJykuZmlsdGVyKCc6bm90KC4nK3RoYXQub3B0aW9ucy5kaXNhYmxlZENsYXNzKycpJyksXG4gICAgICAgICAgb3B0aW9ucyA9IG1zLmZpbmQoJ29wdGlvbjpub3QoOmRpc2FibGVkKScpLmZpbHRlcihmdW5jdGlvbigpeyByZXR1cm4oJC5pbkFycmF5KHRoaXMudmFsdWUsIHZhbHVlKSA+IC0xKTsgfSk7XG5cbiAgICAgIGlmIChtZXRob2QgPT09ICdpbml0Jyl7XG4gICAgICAgIHNlbGVjdGFibGVzID0gdGhpcy4kc2VsZWN0YWJsZVVsLmZpbmQoJyMnICsgbXNJZHMuam9pbignLXNlbGVjdGFibGUsICMnKSsnLXNlbGVjdGFibGUnKSxcbiAgICAgICAgc2VsZWN0aW9ucyA9IHRoaXMuJHNlbGVjdGlvblVsLmZpbmQoJyMnICsgbXNJZHMuam9pbignLXNlbGVjdGlvbiwgIycpICsgJy1zZWxlY3Rpb24nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNlbGVjdGFibGVzLmxlbmd0aCA+IDApe1xuICAgICAgICBzZWxlY3RhYmxlcy5hZGRDbGFzcygnbXMtc2VsZWN0ZWQnKS5oaWRlKCk7XG4gICAgICAgIHNlbGVjdGlvbnMuYWRkQ2xhc3MoJ21zLXNlbGVjdGVkJykuc2hvdygpO1xuXG4gICAgICAgIG9wdGlvbnMucHJvcCgnc2VsZWN0ZWQnLCB0cnVlKTtcblxuICAgICAgICB0aGF0LiRjb250YWluZXIuZmluZCh0aGF0LmVsZW1zU2VsZWN0b3IpLnJlbW92ZUNsYXNzKCdtcy1ob3ZlcicpO1xuXG4gICAgICAgIHZhciBzZWxlY3RhYmxlT3B0Z3JvdXBzID0gdGhhdC4kc2VsZWN0YWJsZVVsLmNoaWxkcmVuKCcubXMtb3B0Z3JvdXAtY29udGFpbmVyJyk7XG4gICAgICAgIGlmIChzZWxlY3RhYmxlT3B0Z3JvdXBzLmxlbmd0aCA+IDApe1xuICAgICAgICAgIHNlbGVjdGFibGVPcHRncm91cHMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHNlbGVjdGFibGVzTGkgPSAkKHRoaXMpLmZpbmQoJy5tcy1lbGVtLXNlbGVjdGFibGUnKTtcbiAgICAgICAgICAgIGlmIChzZWxlY3RhYmxlc0xpLmxlbmd0aCA9PT0gc2VsZWN0YWJsZXNMaS5maWx0ZXIoJy5tcy1zZWxlY3RlZCcpLmxlbmd0aCl7XG4gICAgICAgICAgICAgICQodGhpcykuZmluZCgnLm1zLW9wdGdyb3VwLWxhYmVsJykuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdmFyIHNlbGVjdGlvbk9wdGdyb3VwcyA9IHRoYXQuJHNlbGVjdGlvblVsLmNoaWxkcmVuKCcubXMtb3B0Z3JvdXAtY29udGFpbmVyJyk7XG4gICAgICAgICAgc2VsZWN0aW9uT3B0Z3JvdXBzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBzZWxlY3Rpb25zTGkgPSAkKHRoaXMpLmZpbmQoJy5tcy1lbGVtLXNlbGVjdGlvbicpO1xuICAgICAgICAgICAgaWYgKHNlbGVjdGlvbnNMaS5maWx0ZXIoJy5tcy1zZWxlY3RlZCcpLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy5tcy1vcHRncm91cC1sYWJlbCcpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhhdC5vcHRpb25zLmtlZXBPcmRlciAmJiBtZXRob2QgIT09ICdpbml0Jyl7XG4gICAgICAgICAgICB2YXIgc2VsZWN0aW9uTGlMYXN0ID0gdGhhdC4kc2VsZWN0aW9uVWwuZmluZCgnLm1zLXNlbGVjdGVkJyk7XG4gICAgICAgICAgICBpZigoc2VsZWN0aW9uTGlMYXN0Lmxlbmd0aCA+IDEpICYmIChzZWxlY3Rpb25MaUxhc3QubGFzdCgpLmdldCgwKSAhPSBzZWxlY3Rpb25zLmdldCgwKSkpIHtcbiAgICAgICAgICAgICAgc2VsZWN0aW9ucy5pbnNlcnRBZnRlcihzZWxlY3Rpb25MaUxhc3QubGFzdCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1ldGhvZCAhPT0gJ2luaXQnKXtcbiAgICAgICAgICBtcy50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgICAgICBpZiAodHlwZW9mIHRoYXQub3B0aW9ucy5hZnRlclNlbGVjdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhhdC5vcHRpb25zLmFmdGVyU2VsZWN0LmNhbGwodGhpcywgdmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAnZGVzZWxlY3QnIDogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpeyB2YWx1ZSA9IFt2YWx1ZV07IH1cblxuICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgIG1zID0gdGhpcy4kZWxlbWVudCxcbiAgICAgICAgICBtc0lkcyA9ICQubWFwKHZhbHVlLCBmdW5jdGlvbih2YWwpeyByZXR1cm4odGhhdC5zYW5pdGl6ZSh2YWwpKTsgfSksXG4gICAgICAgICAgc2VsZWN0YWJsZXMgPSB0aGlzLiRzZWxlY3RhYmxlVWwuZmluZCgnIycgKyBtc0lkcy5qb2luKCctc2VsZWN0YWJsZSwgIycpKyctc2VsZWN0YWJsZScpLFxuICAgICAgICAgIHNlbGVjdGlvbnMgPSB0aGlzLiRzZWxlY3Rpb25VbC5maW5kKCcjJyArIG1zSWRzLmpvaW4oJy1zZWxlY3Rpb24sICMnKSsnLXNlbGVjdGlvbicpLmZpbHRlcignLm1zLXNlbGVjdGVkJykuZmlsdGVyKCc6bm90KC4nK3RoYXQub3B0aW9ucy5kaXNhYmxlZENsYXNzKycpJyksXG4gICAgICAgICAgb3B0aW9ucyA9IG1zLmZpbmQoJ29wdGlvbicpLmZpbHRlcihmdW5jdGlvbigpeyByZXR1cm4oJC5pbkFycmF5KHRoaXMudmFsdWUsIHZhbHVlKSA+IC0xKTsgfSk7XG5cbiAgICAgIGlmIChzZWxlY3Rpb25zLmxlbmd0aCA+IDApe1xuICAgICAgICBzZWxlY3RhYmxlcy5yZW1vdmVDbGFzcygnbXMtc2VsZWN0ZWQnKS5zaG93KCk7XG4gICAgICAgIHNlbGVjdGlvbnMucmVtb3ZlQ2xhc3MoJ21zLXNlbGVjdGVkJykuaGlkZSgpO1xuICAgICAgICBvcHRpb25zLnByb3AoJ3NlbGVjdGVkJywgZmFsc2UpO1xuXG4gICAgICAgIHRoYXQuJGNvbnRhaW5lci5maW5kKHRoYXQuZWxlbXNTZWxlY3RvcikucmVtb3ZlQ2xhc3MoJ21zLWhvdmVyJyk7XG5cbiAgICAgICAgdmFyIHNlbGVjdGFibGVPcHRncm91cHMgPSB0aGF0LiRzZWxlY3RhYmxlVWwuY2hpbGRyZW4oJy5tcy1vcHRncm91cC1jb250YWluZXInKTtcbiAgICAgICAgaWYgKHNlbGVjdGFibGVPcHRncm91cHMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgc2VsZWN0YWJsZU9wdGdyb3Vwcy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgc2VsZWN0YWJsZXNMaSA9ICQodGhpcykuZmluZCgnLm1zLWVsZW0tc2VsZWN0YWJsZScpO1xuICAgICAgICAgICAgaWYgKHNlbGVjdGFibGVzTGkuZmlsdGVyKCc6bm90KC5tcy1zZWxlY3RlZCknKS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcubXMtb3B0Z3JvdXAtbGFiZWwnKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB2YXIgc2VsZWN0aW9uT3B0Z3JvdXBzID0gdGhhdC4kc2VsZWN0aW9uVWwuY2hpbGRyZW4oJy5tcy1vcHRncm91cC1jb250YWluZXInKTtcbiAgICAgICAgICBzZWxlY3Rpb25PcHRncm91cHMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHNlbGVjdGlvbnNMaSA9ICQodGhpcykuZmluZCgnLm1zLWVsZW0tc2VsZWN0aW9uJyk7XG4gICAgICAgICAgICBpZiAoc2VsZWN0aW9uc0xpLmZpbHRlcignLm1zLXNlbGVjdGVkJykubGVuZ3RoID09PSAwKXtcbiAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcubXMtb3B0Z3JvdXAtbGFiZWwnKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgbXMudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgIGlmICh0eXBlb2YgdGhhdC5vcHRpb25zLmFmdGVyRGVzZWxlY3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0aGF0Lm9wdGlvbnMuYWZ0ZXJEZXNlbGVjdC5jYWxsKHRoaXMsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAnc2VsZWN0X2FsbCcgOiBmdW5jdGlvbigpe1xuICAgICAgdmFyIG1zID0gdGhpcy4kZWxlbWVudCxcbiAgICAgICAgICB2YWx1ZXMgPSBtcy52YWwoKTtcblxuICAgICAgbXMuZmluZCgnb3B0aW9uOm5vdChcIjpkaXNhYmxlZFwiKScpLnByb3AoJ3NlbGVjdGVkJywgdHJ1ZSk7XG4gICAgICB0aGlzLiRzZWxlY3RhYmxlVWwuZmluZCgnLm1zLWVsZW0tc2VsZWN0YWJsZScpLmZpbHRlcignOm5vdCguJyt0aGlzLm9wdGlvbnMuZGlzYWJsZWRDbGFzcysnKScpLmFkZENsYXNzKCdtcy1zZWxlY3RlZCcpLmhpZGUoKTtcbiAgICAgIHRoaXMuJHNlbGVjdGlvblVsLmZpbmQoJy5tcy1vcHRncm91cC1sYWJlbCcpLnNob3coKTtcbiAgICAgIHRoaXMuJHNlbGVjdGFibGVVbC5maW5kKCcubXMtb3B0Z3JvdXAtbGFiZWwnKS5oaWRlKCk7XG4gICAgICB0aGlzLiRzZWxlY3Rpb25VbC5maW5kKCcubXMtZWxlbS1zZWxlY3Rpb24nKS5maWx0ZXIoJzpub3QoLicrdGhpcy5vcHRpb25zLmRpc2FibGVkQ2xhc3MrJyknKS5hZGRDbGFzcygnbXMtc2VsZWN0ZWQnKS5zaG93KCk7XG4gICAgICB0aGlzLiRzZWxlY3Rpb25VbC5mb2N1cygpO1xuICAgICAgbXMudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5hZnRlclNlbGVjdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YXIgc2VsZWN0ZWRWYWx1ZXMgPSAkLmdyZXAobXMudmFsKCksIGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgIHJldHVybiAkLmluQXJyYXkoaXRlbSwgdmFsdWVzKSA8IDA7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm9wdGlvbnMuYWZ0ZXJTZWxlY3QuY2FsbCh0aGlzLCBzZWxlY3RlZFZhbHVlcyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgICdkZXNlbGVjdF9hbGwnIDogZnVuY3Rpb24oKXtcbiAgICAgIHZhciBtcyA9IHRoaXMuJGVsZW1lbnQsXG4gICAgICAgICAgdmFsdWVzID0gbXMudmFsKCk7XG5cbiAgICAgIG1zLmZpbmQoJ29wdGlvbicpLnByb3AoJ3NlbGVjdGVkJywgZmFsc2UpO1xuICAgICAgdGhpcy4kc2VsZWN0YWJsZVVsLmZpbmQoJy5tcy1lbGVtLXNlbGVjdGFibGUnKS5yZW1vdmVDbGFzcygnbXMtc2VsZWN0ZWQnKS5zaG93KCk7XG4gICAgICB0aGlzLiRzZWxlY3Rpb25VbC5maW5kKCcubXMtb3B0Z3JvdXAtbGFiZWwnKS5oaWRlKCk7XG4gICAgICB0aGlzLiRzZWxlY3RhYmxlVWwuZmluZCgnLm1zLW9wdGdyb3VwLWxhYmVsJykuc2hvdygpO1xuICAgICAgdGhpcy4kc2VsZWN0aW9uVWwuZmluZCgnLm1zLWVsZW0tc2VsZWN0aW9uJykucmVtb3ZlQ2xhc3MoJ21zLXNlbGVjdGVkJykuaGlkZSgpO1xuICAgICAgdGhpcy4kc2VsZWN0YWJsZVVsLmZvY3VzKCk7XG4gICAgICBtcy50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmFmdGVyRGVzZWxlY3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmFmdGVyRGVzZWxlY3QuY2FsbCh0aGlzLCB2YWx1ZXMpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBzYW5pdGl6ZTogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgdmFyIGhhc2ggPSAwLCBpLCBjaGFyYWN0ZXI7XG4gICAgICBpZiAodmFsdWUubGVuZ3RoID09IDApIHJldHVybiBoYXNoO1xuICAgICAgdmFyIGxzID0gMDtcbiAgICAgIGZvciAoaSA9IDAsIGxzID0gdmFsdWUubGVuZ3RoOyBpIDwgbHM7IGkrKykge1xuICAgICAgICBjaGFyYWN0ZXIgID0gdmFsdWUuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaGFzaCAgPSAoKGhhc2g8PDUpLWhhc2gpK2NoYXJhY3RlcjtcbiAgICAgICAgaGFzaCB8PSAwOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgICAgIH1cbiAgICAgIHJldHVybiBoYXNoO1xuICAgIH1cbiAgfTtcblxuICAvKiBNVUxUSVNFTEVDVCBQTFVHSU4gREVGSU5JVElPTlxuICAgKiA9PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4gICQuZm4ubXVsdGlTZWxlY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbiA9IGFyZ3VtZW50c1swXSxcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcblxuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICBkYXRhID0gJHRoaXMuZGF0YSgnbXVsdGlzZWxlY3QnKSxcbiAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoe30sICQuZm4ubXVsdGlTZWxlY3QuZGVmYXVsdHMsICR0aGlzLmRhdGEoKSwgdHlwZW9mIG9wdGlvbiA9PT0gJ29iamVjdCcgJiYgb3B0aW9uKTtcblxuICAgICAgaWYgKCFkYXRhKXsgJHRoaXMuZGF0YSgnbXVsdGlzZWxlY3QnLCAoZGF0YSA9IG5ldyBNdWx0aVNlbGVjdCh0aGlzLCBvcHRpb25zKSkpOyB9XG5cbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09PSAnc3RyaW5nJyl7XG4gICAgICAgIGRhdGFbb3B0aW9uXShhcmdzWzFdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRhdGEuaW5pdCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gICQuZm4ubXVsdGlTZWxlY3QuZGVmYXVsdHMgPSB7XG4gICAga2V5U2VsZWN0OiBbMzJdLFxuICAgIHNlbGVjdGFibGVPcHRncm91cDogZmFsc2UsXG4gICAgZGlzYWJsZWRDbGFzcyA6ICdkaXNhYmxlZCcsXG4gICAgZGJsQ2xpY2sgOiBmYWxzZSxcbiAgICBrZWVwT3JkZXI6IGZhbHNlLFxuICAgIGNzc0NsYXNzOiAnJ1xuICB9O1xuXG4gICQuZm4ubXVsdGlTZWxlY3QuQ29uc3RydWN0b3IgPSBNdWx0aVNlbGVjdDtcblxuICAkLmZuLmluc2VydEF0ID0gZnVuY3Rpb24oaW5kZXgsICRwYXJlbnQpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICRwYXJlbnQucHJlcGVuZCh0aGlzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRwYXJlbnQuY2hpbGRyZW4oKS5lcShpbmRleCAtIDEpLmFmdGVyKHRoaXMpO1xuICAgICAgfVxuICAgIH0pO1xufVxuXG59KHdpbmRvdy5qUXVlcnkpO1xuIl0sImZpbGUiOiJkYWlseXN0YXRlbWVudC9tdWx0aS1zZWxlY3QuanMifQ==
