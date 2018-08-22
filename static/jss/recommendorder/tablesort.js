/*
  A simple, lightweight jQuery plugin for creating sortable tables.
  https://github.com/kylefox/jquery-tablesort
  Version 0.0.1
*/

;(function($) {

  $.tablesort = function ($table, settings) {
    var self = this;
    this.$table = $table;
    this.settings = $.extend({}, $.tablesort.defaults, settings);
    this.$table.find('thead th').bind('click.tablesort', function() {
      if( !$(this).hasClass('disabled') ) {
        self.sort($(this));
      }
    });
    this.index = null;
    this.$th = null;
    this.direction = [];
  };

  $.tablesort.prototype = {

    sort: function(th, direction) {
      var start = new Date(),
        self        = this,
        table       = this.$table,
        rows        = table.find('tbody tr'),
        index       = th.index(),
        cache       = [],
        fragment    = $('<div/>'),
        sortValueForCell = function(th, td, sorter) {
          var
            sortBy
          ;
          if(th.data().sortBy) {
            sortBy = th.data().sortBy;
            return (typeof sortBy === 'function') ? sortBy(th, td, sorter) : sortBy ;
          }
          return ( td.data('sort') ) ? td.data('sort') : td.text() ;
        },
        naturalSort =  function naturalSort (a, b) {
          var
            chunkRegExp    = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
            stripRegExp    = /(^[ ]*|[ ]*$)/g,
            dateRegExp     = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
            numericRegExp  = /^0x[0-9a-f]+$/i,
            oRegExp        = /^0/,
            cLoc           = 0,
            useInsensitive = function(string) {
              return ('' + string).toLowerCase().replace(',', '');
            },
            // convert all to strings strip whitespace
            x              = useInsensitive(a).replace(stripRegExp, '') || '',
            y              = useInsensitive(b).replace(stripRegExp, '') || '',
            // chunk/tokenize
            xChunked       = x.replace(chunkRegExp, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
            yChunked       = y.replace(chunkRegExp, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
            chunkLength    = Math.max(xChunked.length, yChunked.length),
            // numeric, hex or date detection
            xDate          = parseInt(x.match(numericRegExp), 10) || (xChunked.length != 1 && x.match(dateRegExp) && Date.parse(x)),
            yDate          = parseInt(y.match(numericRegExp), 10) || xDate && y.match(dateRegExp) && Date.parse(y) || null,
            xHexValue,
            yHexValue,
            index
          ;
          // first try and sort Hex codes or Dates
          if (yDate) {
            if( xDate < yDate ) {
              return -1;
            }
            else if ( xDate > yDate ) {
              return 1;
            }
          }
          // natural sorting through split numeric strings and default strings
          for(index = 0; index < chunkLength; index++) {
              // find floats not starting with '0', string or 0 if not defined (Clint Priest)
              xHexValue = !(xChunked[index] || '').match(oRegExp) && parseFloat(xChunked[index]) || xChunked[index] || 0;
              yHexValue = !(yChunked[index] || '').match(oRegExp) && parseFloat(yChunked[index]) || yChunked[index] || 0;
              // handle numeric vs string comparison - number < string - (Kyle Adams)
              if (isNaN(xHexValue) !== isNaN(yHexValue)) {
                return ( isNaN(xHexValue) ) ? 1: -1;
              }
              // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
              else if (typeof xHexValue !== typeof yHexValue) {
                xHexValue += '';
                yHexValue += '';
              }
              if (xHexValue < yHexValue) {
                return -1;
              }
              if (xHexValue > yHexValue) {
                return 1;
              }
          }
          return 0;
        }
      ;

      if(rows.length === 0) {
        return;
      }

      self.$table.find('thead th').removeClass(self.settings.asc + ' ' + self.settings.desc);

      this.$th = th;
      if(this.index != index) {
        this.direction[index] = 'desc';
      }
      else if(direction !== 'asc' && direction !== 'desc') {
        this.direction[index] = this.direction[index] === 'desc' ? 'asc' : 'desc';
      }
      else {
        this.direction[index] = direction;
      }
      this.index = index;
      direction = this.direction[index] == 'asc' ? 1 : -1;

      self.$table.trigger('tablesort:start', [self]);
      self.log("Sorting by " + this.index + ' ' + this.direction[index]);

      rows.sort(function(a, b) {
        var aRow = $(a);
        var bRow = $(b);
        var aIndex = aRow.index();
        var bIndex = bRow.index();

        // Sort value A
        if(cache[aIndex]) {
          a = cache[aIndex];
        }
        else {
          a = sortValueForCell(th, self.cellToSort(a), self);
          cache[aIndex] = a;
        }
        // Sort Value B
        if(cache[bIndex]) {
          b = cache[bIndex];
        }
        else {
          b = sortValueForCell(th, self.cellToSort(b), self);
          cache[bIndex]= b;
        }
        return (naturalSort(a, b) * direction);
      });

      rows.each(function(i, tr) {
        fragment.append(tr);
      });
      table.append(fragment.html());

      th.addClass(self.settings[self.direction[index]]);

      self.log('Sort finished in ' + ((new Date()).getTime() - start.getTime()) + 'ms');
      self.$table.trigger('tablesort:complete', [self]);

    },

    cellToSort: function(row) {
      return $($(row).find('td').get(this.index));
    },


    log: function(msg) {
      if(($.tablesort.DEBUG || this.settings.debug) && console && console.log) {
        console.log('[tablesort] ' + msg);
      }
    },

    destroy: function() {
      this.$table.find('thead th').unbind('click.tablesort');
      this.$table.data('tablesort', null);
      return null;
    }

  };

  $.tablesort.DEBUG = false;

  $.tablesort.defaults = {
    debug: $.tablesort.DEBUG,
    asc: 'sorted ascending',
    desc: 'sorted descending'
  };

  $.fn.tablesort = function(settings) {
    var table, sortable, previous;
    return this.each(function() {
      table = $(this);
      previous = table.data('tablesort');
      if(previous) {
        previous.destroy();
      }
      table.data('tablesort', new $.tablesort(table, settings));
    });
  };

})(jQuery);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci90YWJsZXNvcnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbiAgQSBzaW1wbGUsIGxpZ2h0d2VpZ2h0IGpRdWVyeSBwbHVnaW4gZm9yIGNyZWF0aW5nIHNvcnRhYmxlIHRhYmxlcy5cbiAgaHR0cHM6Ly9naXRodWIuY29tL2t5bGVmb3gvanF1ZXJ5LXRhYmxlc29ydFxuICBWZXJzaW9uIDAuMC4xXG4qL1xuXG47KGZ1bmN0aW9uKCQpIHtcblxuICAkLnRhYmxlc29ydCA9IGZ1bmN0aW9uICgkdGFibGUsIHNldHRpbmdzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuJHRhYmxlID0gJHRhYmxlO1xuICAgIHRoaXMuc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgJC50YWJsZXNvcnQuZGVmYXVsdHMsIHNldHRpbmdzKTtcbiAgICB0aGlzLiR0YWJsZS5maW5kKCd0aGVhZCB0aCcpLmJpbmQoJ2NsaWNrLnRhYmxlc29ydCcsIGZ1bmN0aW9uKCkge1xuICAgICAgaWYoICEkKHRoaXMpLmhhc0NsYXNzKCdkaXNhYmxlZCcpICkge1xuICAgICAgICBzZWxmLnNvcnQoJCh0aGlzKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5pbmRleCA9IG51bGw7XG4gICAgdGhpcy4kdGggPSBudWxsO1xuICAgIHRoaXMuZGlyZWN0aW9uID0gW107XG4gIH07XG5cbiAgJC50YWJsZXNvcnQucHJvdG90eXBlID0ge1xuXG4gICAgc29ydDogZnVuY3Rpb24odGgsIGRpcmVjdGlvbikge1xuICAgICAgdmFyIHN0YXJ0ID0gbmV3IERhdGUoKSxcbiAgICAgICAgc2VsZiAgICAgICAgPSB0aGlzLFxuICAgICAgICB0YWJsZSAgICAgICA9IHRoaXMuJHRhYmxlLFxuICAgICAgICByb3dzICAgICAgICA9IHRhYmxlLmZpbmQoJ3Rib2R5IHRyJyksXG4gICAgICAgIGluZGV4ICAgICAgID0gdGguaW5kZXgoKSxcbiAgICAgICAgY2FjaGUgICAgICAgPSBbXSxcbiAgICAgICAgZnJhZ21lbnQgICAgPSAkKCc8ZGl2Lz4nKSxcbiAgICAgICAgc29ydFZhbHVlRm9yQ2VsbCA9IGZ1bmN0aW9uKHRoLCB0ZCwgc29ydGVyKSB7XG4gICAgICAgICAgdmFyXG4gICAgICAgICAgICBzb3J0QnlcbiAgICAgICAgICA7XG4gICAgICAgICAgaWYodGguZGF0YSgpLnNvcnRCeSkge1xuICAgICAgICAgICAgc29ydEJ5ID0gdGguZGF0YSgpLnNvcnRCeTtcbiAgICAgICAgICAgIHJldHVybiAodHlwZW9mIHNvcnRCeSA9PT0gJ2Z1bmN0aW9uJykgPyBzb3J0QnkodGgsIHRkLCBzb3J0ZXIpIDogc29ydEJ5IDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICggdGQuZGF0YSgnc29ydCcpICkgPyB0ZC5kYXRhKCdzb3J0JykgOiB0ZC50ZXh0KCkgO1xuICAgICAgICB9LFxuICAgICAgICBuYXR1cmFsU29ydCA9ICBmdW5jdGlvbiBuYXR1cmFsU29ydCAoYSwgYikge1xuICAgICAgICAgIHZhclxuICAgICAgICAgICAgY2h1bmtSZWdFeHAgICAgPSAvKF4tP1swLTldKyhcXC4/WzAtOV0qKVtkZl0/ZT9bMC05XT8kfF4weFswLTlhLWZdKyR8WzAtOV0rKS9naSxcbiAgICAgICAgICAgIHN0cmlwUmVnRXhwICAgID0gLyheWyBdKnxbIF0qJCkvZyxcbiAgICAgICAgICAgIGRhdGVSZWdFeHAgICAgID0gLyheKFtcXHcgXSssP1tcXHcgXSspP1tcXHcgXSssP1tcXHcgXStcXGQrOlxcZCsoOlxcZCspP1tcXHcgXT98XlxcZHsxLDR9W1xcL1xcLV1cXGR7MSw0fVtcXC9cXC1dXFxkezEsNH18XlxcdyssIFxcdysgXFxkKywgXFxkezR9KS8sXG4gICAgICAgICAgICBudW1lcmljUmVnRXhwICA9IC9eMHhbMC05YS1mXSskL2ksXG4gICAgICAgICAgICBvUmVnRXhwICAgICAgICA9IC9eMC8sXG4gICAgICAgICAgICBjTG9jICAgICAgICAgICA9IDAsXG4gICAgICAgICAgICB1c2VJbnNlbnNpdGl2ZSA9IGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgICAgICAgICByZXR1cm4gKCcnICsgc3RyaW5nKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJywnLCAnJyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gY29udmVydCBhbGwgdG8gc3RyaW5ncyBzdHJpcCB3aGl0ZXNwYWNlXG4gICAgICAgICAgICB4ICAgICAgICAgICAgICA9IHVzZUluc2Vuc2l0aXZlKGEpLnJlcGxhY2Uoc3RyaXBSZWdFeHAsICcnKSB8fCAnJyxcbiAgICAgICAgICAgIHkgICAgICAgICAgICAgID0gdXNlSW5zZW5zaXRpdmUoYikucmVwbGFjZShzdHJpcFJlZ0V4cCwgJycpIHx8ICcnLFxuICAgICAgICAgICAgLy8gY2h1bmsvdG9rZW5pemVcbiAgICAgICAgICAgIHhDaHVua2VkICAgICAgID0geC5yZXBsYWNlKGNodW5rUmVnRXhwLCAnXFwwJDFcXDAnKS5yZXBsYWNlKC9cXDAkLywnJykucmVwbGFjZSgvXlxcMC8sJycpLnNwbGl0KCdcXDAnKSxcbiAgICAgICAgICAgIHlDaHVua2VkICAgICAgID0geS5yZXBsYWNlKGNodW5rUmVnRXhwLCAnXFwwJDFcXDAnKS5yZXBsYWNlKC9cXDAkLywnJykucmVwbGFjZSgvXlxcMC8sJycpLnNwbGl0KCdcXDAnKSxcbiAgICAgICAgICAgIGNodW5rTGVuZ3RoICAgID0gTWF0aC5tYXgoeENodW5rZWQubGVuZ3RoLCB5Q2h1bmtlZC5sZW5ndGgpLFxuICAgICAgICAgICAgLy8gbnVtZXJpYywgaGV4IG9yIGRhdGUgZGV0ZWN0aW9uXG4gICAgICAgICAgICB4RGF0ZSAgICAgICAgICA9IHBhcnNlSW50KHgubWF0Y2gobnVtZXJpY1JlZ0V4cCksIDEwKSB8fCAoeENodW5rZWQubGVuZ3RoICE9IDEgJiYgeC5tYXRjaChkYXRlUmVnRXhwKSAmJiBEYXRlLnBhcnNlKHgpKSxcbiAgICAgICAgICAgIHlEYXRlICAgICAgICAgID0gcGFyc2VJbnQoeS5tYXRjaChudW1lcmljUmVnRXhwKSwgMTApIHx8IHhEYXRlICYmIHkubWF0Y2goZGF0ZVJlZ0V4cCkgJiYgRGF0ZS5wYXJzZSh5KSB8fCBudWxsLFxuICAgICAgICAgICAgeEhleFZhbHVlLFxuICAgICAgICAgICAgeUhleFZhbHVlLFxuICAgICAgICAgICAgaW5kZXhcbiAgICAgICAgICA7XG4gICAgICAgICAgLy8gZmlyc3QgdHJ5IGFuZCBzb3J0IEhleCBjb2RlcyBvciBEYXRlc1xuICAgICAgICAgIGlmICh5RGF0ZSkge1xuICAgICAgICAgICAgaWYoIHhEYXRlIDwgeURhdGUgKSB7XG4gICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCB4RGF0ZSA+IHlEYXRlICkge1xuICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gbmF0dXJhbCBzb3J0aW5nIHRocm91Z2ggc3BsaXQgbnVtZXJpYyBzdHJpbmdzIGFuZCBkZWZhdWx0IHN0cmluZ3NcbiAgICAgICAgICBmb3IoaW5kZXggPSAwOyBpbmRleCA8IGNodW5rTGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgIC8vIGZpbmQgZmxvYXRzIG5vdCBzdGFydGluZyB3aXRoICcwJywgc3RyaW5nIG9yIDAgaWYgbm90IGRlZmluZWQgKENsaW50IFByaWVzdClcbiAgICAgICAgICAgICAgeEhleFZhbHVlID0gISh4Q2h1bmtlZFtpbmRleF0gfHwgJycpLm1hdGNoKG9SZWdFeHApICYmIHBhcnNlRmxvYXQoeENodW5rZWRbaW5kZXhdKSB8fCB4Q2h1bmtlZFtpbmRleF0gfHwgMDtcbiAgICAgICAgICAgICAgeUhleFZhbHVlID0gISh5Q2h1bmtlZFtpbmRleF0gfHwgJycpLm1hdGNoKG9SZWdFeHApICYmIHBhcnNlRmxvYXQoeUNodW5rZWRbaW5kZXhdKSB8fCB5Q2h1bmtlZFtpbmRleF0gfHwgMDtcbiAgICAgICAgICAgICAgLy8gaGFuZGxlIG51bWVyaWMgdnMgc3RyaW5nIGNvbXBhcmlzb24gLSBudW1iZXIgPCBzdHJpbmcgLSAoS3lsZSBBZGFtcylcbiAgICAgICAgICAgICAgaWYgKGlzTmFOKHhIZXhWYWx1ZSkgIT09IGlzTmFOKHlIZXhWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCBpc05hTih4SGV4VmFsdWUpICkgPyAxOiAtMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyByZWx5IG9uIHN0cmluZyBjb21wYXJpc29uIGlmIGRpZmZlcmVudCB0eXBlcyAtIGkuZS4gJzAyJyA8IDIgIT0gJzAyJyA8ICcyJ1xuICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgeEhleFZhbHVlICE9PSB0eXBlb2YgeUhleFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgeEhleFZhbHVlICs9ICcnO1xuICAgICAgICAgICAgICAgIHlIZXhWYWx1ZSArPSAnJztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoeEhleFZhbHVlIDwgeUhleFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmICh4SGV4VmFsdWUgPiB5SGV4VmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgO1xuXG4gICAgICBpZihyb3dzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNlbGYuJHRhYmxlLmZpbmQoJ3RoZWFkIHRoJykucmVtb3ZlQ2xhc3Moc2VsZi5zZXR0aW5ncy5hc2MgKyAnICcgKyBzZWxmLnNldHRpbmdzLmRlc2MpO1xuXG4gICAgICB0aGlzLiR0aCA9IHRoO1xuICAgICAgaWYodGhpcy5pbmRleCAhPSBpbmRleCkge1xuICAgICAgICB0aGlzLmRpcmVjdGlvbltpbmRleF0gPSAnZGVzYyc7XG4gICAgICB9XG4gICAgICBlbHNlIGlmKGRpcmVjdGlvbiAhPT0gJ2FzYycgJiYgZGlyZWN0aW9uICE9PSAnZGVzYycpIHtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb25baW5kZXhdID0gdGhpcy5kaXJlY3Rpb25baW5kZXhdID09PSAnZGVzYycgPyAnYXNjJyA6ICdkZXNjJztcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmRpcmVjdGlvbltpbmRleF0gPSBkaXJlY3Rpb247XG4gICAgICB9XG4gICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICBkaXJlY3Rpb24gPSB0aGlzLmRpcmVjdGlvbltpbmRleF0gPT0gJ2FzYycgPyAxIDogLTE7XG5cbiAgICAgIHNlbGYuJHRhYmxlLnRyaWdnZXIoJ3RhYmxlc29ydDpzdGFydCcsIFtzZWxmXSk7XG4gICAgICBzZWxmLmxvZyhcIlNvcnRpbmcgYnkgXCIgKyB0aGlzLmluZGV4ICsgJyAnICsgdGhpcy5kaXJlY3Rpb25baW5kZXhdKTtcblxuICAgICAgcm93cy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgdmFyIGFSb3cgPSAkKGEpO1xuICAgICAgICB2YXIgYlJvdyA9ICQoYik7XG4gICAgICAgIHZhciBhSW5kZXggPSBhUm93LmluZGV4KCk7XG4gICAgICAgIHZhciBiSW5kZXggPSBiUm93LmluZGV4KCk7XG5cbiAgICAgICAgLy8gU29ydCB2YWx1ZSBBXG4gICAgICAgIGlmKGNhY2hlW2FJbmRleF0pIHtcbiAgICAgICAgICBhID0gY2FjaGVbYUluZGV4XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBhID0gc29ydFZhbHVlRm9yQ2VsbCh0aCwgc2VsZi5jZWxsVG9Tb3J0KGEpLCBzZWxmKTtcbiAgICAgICAgICBjYWNoZVthSW5kZXhdID0gYTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTb3J0IFZhbHVlIEJcbiAgICAgICAgaWYoY2FjaGVbYkluZGV4XSkge1xuICAgICAgICAgIGIgPSBjYWNoZVtiSW5kZXhdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGIgPSBzb3J0VmFsdWVGb3JDZWxsKHRoLCBzZWxmLmNlbGxUb1NvcnQoYiksIHNlbGYpO1xuICAgICAgICAgIGNhY2hlW2JJbmRleF09IGI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChuYXR1cmFsU29ydChhLCBiKSAqIGRpcmVjdGlvbik7XG4gICAgICB9KTtcblxuICAgICAgcm93cy5lYWNoKGZ1bmN0aW9uKGksIHRyKSB7XG4gICAgICAgIGZyYWdtZW50LmFwcGVuZCh0cik7XG4gICAgICB9KTtcbiAgICAgIHRhYmxlLmFwcGVuZChmcmFnbWVudC5odG1sKCkpO1xuXG4gICAgICB0aC5hZGRDbGFzcyhzZWxmLnNldHRpbmdzW3NlbGYuZGlyZWN0aW9uW2luZGV4XV0pO1xuXG4gICAgICBzZWxmLmxvZygnU29ydCBmaW5pc2hlZCBpbiAnICsgKChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgLSBzdGFydC5nZXRUaW1lKCkpICsgJ21zJyk7XG4gICAgICBzZWxmLiR0YWJsZS50cmlnZ2VyKCd0YWJsZXNvcnQ6Y29tcGxldGUnLCBbc2VsZl0pO1xuXG4gICAgfSxcblxuICAgIGNlbGxUb1NvcnQ6IGZ1bmN0aW9uKHJvdykge1xuICAgICAgcmV0dXJuICQoJChyb3cpLmZpbmQoJ3RkJykuZ2V0KHRoaXMuaW5kZXgpKTtcbiAgICB9LFxuXG5cbiAgICBsb2c6IGZ1bmN0aW9uKG1zZykge1xuICAgICAgaWYoKCQudGFibGVzb3J0LkRFQlVHIHx8IHRoaXMuc2V0dGluZ3MuZGVidWcpICYmIGNvbnNvbGUgJiYgY29uc29sZS5sb2cpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1t0YWJsZXNvcnRdICcgKyBtc2cpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuJHRhYmxlLmZpbmQoJ3RoZWFkIHRoJykudW5iaW5kKCdjbGljay50YWJsZXNvcnQnKTtcbiAgICAgIHRoaXMuJHRhYmxlLmRhdGEoJ3RhYmxlc29ydCcsIG51bGwpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gIH07XG5cbiAgJC50YWJsZXNvcnQuREVCVUcgPSBmYWxzZTtcblxuICAkLnRhYmxlc29ydC5kZWZhdWx0cyA9IHtcbiAgICBkZWJ1ZzogJC50YWJsZXNvcnQuREVCVUcsXG4gICAgYXNjOiAnc29ydGVkIGFzY2VuZGluZycsXG4gICAgZGVzYzogJ3NvcnRlZCBkZXNjZW5kaW5nJ1xuICB9O1xuXG4gICQuZm4udGFibGVzb3J0ID0gZnVuY3Rpb24oc2V0dGluZ3MpIHtcbiAgICB2YXIgdGFibGUsIHNvcnRhYmxlLCBwcmV2aW91cztcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgdGFibGUgPSAkKHRoaXMpO1xuICAgICAgcHJldmlvdXMgPSB0YWJsZS5kYXRhKCd0YWJsZXNvcnQnKTtcbiAgICAgIGlmKHByZXZpb3VzKSB7XG4gICAgICAgIHByZXZpb3VzLmRlc3Ryb3koKTtcbiAgICAgIH1cbiAgICAgIHRhYmxlLmRhdGEoJ3RhYmxlc29ydCcsIG5ldyAkLnRhYmxlc29ydCh0YWJsZSwgc2V0dGluZ3MpKTtcbiAgICB9KTtcbiAgfTtcblxufSkoalF1ZXJ5KTtcbiJdLCJmaWxlIjoicmVjb21tZW5kb3JkZXIvdGFibGVzb3J0LmpzIn0=
