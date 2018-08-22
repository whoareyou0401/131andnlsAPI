
$.tablesort = function ($table, settings) {
    var self = this;
    this.$table = $table;
    this.settings = $.extend({}, $.tablesort.defaults, settings);
    this.$table.find('thead th').bind('click.tablesort', function () {
        if ($(".pagination select option").length > 1 && settings.func){
            $.extend(settings);
            self.sortBackEnd($(this));
        }
        else if (!$(this).hasClass('disabled')) {
            self.sort($(this));
        }
    });
    this.index = null;
    this.$th = null;
    this.direction = [];
};

$.tablesort.prototype = {
    sortBackEnd: function(th, direction){
        var self = this,
            table = this.$table,
            rows = table.find('tbody tr'),
            index = th.index(),
            div = th.children("div"),
            dr = div.hasClass(self.settings.asc) ? self.settings.desc:self.settings.asc;

        self.$table.find('thead th div').removeClass(self.settings.asc + ' ' + self.settings.desc);
        div.addClass(dr);
        $.func();
    },

    sort: function (th, direction) {
        var start = new Date(),
            self = this,
            table = this.$table,
            rows = table.find('tbody tr'),
            index = th.index(),
            div = th.children("div"),
            cache = [],
            fragment = $('<div/>'),
            sortValueForCell = function (th, td, sorter) {
                var sortBy;
                if (th.data().sortBy) {
                    sortBy = th.data().sortBy;
                    return (typeof sortBy === 'function') ? sortBy(th, td, sorter) : sortBy;
                }
                return ( td.data('sort')) ? td.data('sort') : td.text();
            },
            naturalSort = function naturalSort(a, b) {
                var
                    chunkRegExp = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
                    stripRegExp = /(^[ ]*|[ ]*$)/g,
                    dateRegExp = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
                    numericRegExp = /^0x[0-9a-f]+$/i,
                    oRegExp = /^0/,
                    cLoc = 0,
                    useInsensitive = function (string) {
                        return ('' + string).toLowerCase().replace(',', '');
                    },
                    // convert all to strings strip whitespace
                    x = useInsensitive(a).replace(stripRegExp, '') || '',
                    y = useInsensitive(b).replace(stripRegExp, '') || '',
                    // chunk/tokenize
                    xChunked = x.replace(chunkRegExp, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
                    yChunked = y.replace(chunkRegExp, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
                    chunkLength = Math.max(xChunked.length, yChunked.length),
                    // numeric, hex or date detection
                    xDate = parseInt(x.match(numericRegExp), 10) || (xChunked.length != 1 && x.match(dateRegExp) && Date.parse(x)),
                    yDate = parseInt(y.match(numericRegExp), 10) || xDate && y.match(dateRegExp) && Date.parse(y) || null,
                    xHexValue,
                    yHexValue,
                    index;
                if (yDate) {
                    if (xDate < yDate) {
                        return -1;
                    }
                    else if (xDate > yDate) {
                        return 1;
                    }
                }
                for (index = 0; index < chunkLength; index++) {
                    // find floats not starting with '0', string or 0 if not defined (Clint Priest)
                    xHexValue = !(xChunked[index] || '').match(oRegExp) && parseFloat(xChunked[index]) || xChunked[index] || 0;
                    yHexValue = !(yChunked[index] || '').match(oRegExp) && parseFloat(yChunked[index]) || yChunked[index] || 0;
                    // handle numeric vs string comparison - number < string - (Kyle Adams)
                    if (isNaN(xHexValue) !== isNaN(yHexValue)) {
                        return ( isNaN(xHexValue) ) ? 1 : -1 ;
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

        if (rows.length === 0) {
            return;
        }

        self.$table.find('thead th div').removeClass(self.settings.asc + ' ' + self.settings.desc);

        this.$th = th;
        if (this.index != index) {
            this.direction[index] = 'desc';
        }
        else if (direction !== 'asc' && direction !== 'desc') {
            this.direction[index] = this.direction[index] === 'desc' ? 'asc' : 'desc';
        }
        else {
            this.direction[index] = direction;
        }
        this.index = index;
        direction = this.direction[index] == 'asc' ? 1 : -1;

        self.$table.trigger('tablesort:start', [self]);
        self.log("Sorting by " + this.index + ' ' + this.direction[index]);

        rows.sort(function (a, b) {
            var aRow = $(a);
            var bRow = $(b);
            var aIndex = aRow.index();
            var bIndex = bRow.index();

            // Sort value A
            if (cache[aIndex]) {
                a = cache[aIndex];
            }
            else {
                a = sortValueForCell(th, self.cellToSort(a), self);
                cache[aIndex] = a;
            }
            // Sort Value B
            if (cache[bIndex]) {
                b = cache[bIndex];
            }
            else {
                b = sortValueForCell(th, self.cellToSort(b), self);
                cache[bIndex] = b;
            }
            return (naturalSort(a, b) * direction);
        });

        rows.each(function (i, tr) {
            fragment.append(tr);
        });
        table.append(fragment.html());

        div.addClass(self.settings[self.direction[index]]);

        self.log('Sort finished in ' + ((new Date()).getTime() - start.getTime()) + 'ms');
        self.$table.trigger('tablesort:complete', [self]);

    },

    cellToSort: function (row) {
        return $($(row).find('td').get(this.index));
    },


    log: function (msg) {
        if (($.tablesort.DEBUG || this.settings.debug) && console && console.log) {
            console.log('[tablesort] ' + msg);
        }
    },

    destroy: function () {
        this.$table.find('thead th').unbind('click.tablesort');
        this.$table.data('tablesort', null);
        return null;
    }

};

$.tablesort.DEBUG = false;

$.tablesort.defaults = {
    debug: $.tablesort.DEBUG,
    asc: 'ascending',
    desc: 'descending'
};

$.fn.tablesort = function (settings) {
    var table, sortable, previous;
    return this.each(function () {
        table = $(this);
        previous = table.data('tablesort');
        if (previous) {
            previous.destroy();
        }
        table.data('tablesort', new $.tablesort(table, settings));
    });
};



//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkYWlseXN0YXRlbWVudC90YWJsZXNvcnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG4kLnRhYmxlc29ydCA9IGZ1bmN0aW9uICgkdGFibGUsIHNldHRpbmdzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuJHRhYmxlID0gJHRhYmxlO1xuICAgIHRoaXMuc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgJC50YWJsZXNvcnQuZGVmYXVsdHMsIHNldHRpbmdzKTtcbiAgICB0aGlzLiR0YWJsZS5maW5kKCd0aGVhZCB0aCcpLmJpbmQoJ2NsaWNrLnRhYmxlc29ydCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQoXCIucGFnaW5hdGlvbiBzZWxlY3Qgb3B0aW9uXCIpLmxlbmd0aCA+IDEgJiYgc2V0dGluZ3MuZnVuYyl7XG4gICAgICAgICAgICAkLmV4dGVuZChzZXR0aW5ncyk7XG4gICAgICAgICAgICBzZWxmLnNvcnRCYWNrRW5kKCQodGhpcykpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCEkKHRoaXMpLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICBzZWxmLnNvcnQoJCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmluZGV4ID0gbnVsbDtcbiAgICB0aGlzLiR0aCA9IG51bGw7XG4gICAgdGhpcy5kaXJlY3Rpb24gPSBbXTtcbn07XG5cbiQudGFibGVzb3J0LnByb3RvdHlwZSA9IHtcbiAgICBzb3J0QmFja0VuZDogZnVuY3Rpb24odGgsIGRpcmVjdGlvbil7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIHRhYmxlID0gdGhpcy4kdGFibGUsXG4gICAgICAgICAgICByb3dzID0gdGFibGUuZmluZCgndGJvZHkgdHInKSxcbiAgICAgICAgICAgIGluZGV4ID0gdGguaW5kZXgoKSxcbiAgICAgICAgICAgIGRpdiA9IHRoLmNoaWxkcmVuKFwiZGl2XCIpLFxuICAgICAgICAgICAgZHIgPSBkaXYuaGFzQ2xhc3Moc2VsZi5zZXR0aW5ncy5hc2MpID8gc2VsZi5zZXR0aW5ncy5kZXNjOnNlbGYuc2V0dGluZ3MuYXNjO1xuXG4gICAgICAgIHNlbGYuJHRhYmxlLmZpbmQoJ3RoZWFkIHRoIGRpdicpLnJlbW92ZUNsYXNzKHNlbGYuc2V0dGluZ3MuYXNjICsgJyAnICsgc2VsZi5zZXR0aW5ncy5kZXNjKTtcbiAgICAgICAgZGl2LmFkZENsYXNzKGRyKTtcbiAgICAgICAgJC5mdW5jKCk7XG4gICAgfSxcblxuICAgIHNvcnQ6IGZ1bmN0aW9uICh0aCwgZGlyZWN0aW9uKSB7XG4gICAgICAgIHZhciBzdGFydCA9IG5ldyBEYXRlKCksXG4gICAgICAgICAgICBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIHRhYmxlID0gdGhpcy4kdGFibGUsXG4gICAgICAgICAgICByb3dzID0gdGFibGUuZmluZCgndGJvZHkgdHInKSxcbiAgICAgICAgICAgIGluZGV4ID0gdGguaW5kZXgoKSxcbiAgICAgICAgICAgIGRpdiA9IHRoLmNoaWxkcmVuKFwiZGl2XCIpLFxuICAgICAgICAgICAgY2FjaGUgPSBbXSxcbiAgICAgICAgICAgIGZyYWdtZW50ID0gJCgnPGRpdi8+JyksXG4gICAgICAgICAgICBzb3J0VmFsdWVGb3JDZWxsID0gZnVuY3Rpb24gKHRoLCB0ZCwgc29ydGVyKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNvcnRCeTtcbiAgICAgICAgICAgICAgICBpZiAodGguZGF0YSgpLnNvcnRCeSkge1xuICAgICAgICAgICAgICAgICAgICBzb3J0QnkgPSB0aC5kYXRhKCkuc29ydEJ5O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKHR5cGVvZiBzb3J0QnkgPT09ICdmdW5jdGlvbicpID8gc29ydEJ5KHRoLCB0ZCwgc29ydGVyKSA6IHNvcnRCeTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuICggdGQuZGF0YSgnc29ydCcpKSA/IHRkLmRhdGEoJ3NvcnQnKSA6IHRkLnRleHQoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuYXR1cmFsU29ydCA9IGZ1bmN0aW9uIG5hdHVyYWxTb3J0KGEsIGIpIHtcbiAgICAgICAgICAgICAgICB2YXJcbiAgICAgICAgICAgICAgICAgICAgY2h1bmtSZWdFeHAgPSAvKF4tP1swLTldKyhcXC4/WzAtOV0qKVtkZl0/ZT9bMC05XT8kfF4weFswLTlhLWZdKyR8WzAtOV0rKS9naSxcbiAgICAgICAgICAgICAgICAgICAgc3RyaXBSZWdFeHAgPSAvKF5bIF0qfFsgXSokKS9nLFxuICAgICAgICAgICAgICAgICAgICBkYXRlUmVnRXhwID0gLyheKFtcXHcgXSssP1tcXHcgXSspP1tcXHcgXSssP1tcXHcgXStcXGQrOlxcZCsoOlxcZCspP1tcXHcgXT98XlxcZHsxLDR9W1xcL1xcLV1cXGR7MSw0fVtcXC9cXC1dXFxkezEsNH18XlxcdyssIFxcdysgXFxkKywgXFxkezR9KS8sXG4gICAgICAgICAgICAgICAgICAgIG51bWVyaWNSZWdFeHAgPSAvXjB4WzAtOWEtZl0rJC9pLFxuICAgICAgICAgICAgICAgICAgICBvUmVnRXhwID0gL14wLyxcbiAgICAgICAgICAgICAgICAgICAgY0xvYyA9IDAsXG4gICAgICAgICAgICAgICAgICAgIHVzZUluc2Vuc2l0aXZlID0gZnVuY3Rpb24gKHN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgnJyArIHN0cmluZykudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcsJywgJycpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAvLyBjb252ZXJ0IGFsbCB0byBzdHJpbmdzIHN0cmlwIHdoaXRlc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgeCA9IHVzZUluc2Vuc2l0aXZlKGEpLnJlcGxhY2Uoc3RyaXBSZWdFeHAsICcnKSB8fCAnJyxcbiAgICAgICAgICAgICAgICAgICAgeSA9IHVzZUluc2Vuc2l0aXZlKGIpLnJlcGxhY2Uoc3RyaXBSZWdFeHAsICcnKSB8fCAnJyxcbiAgICAgICAgICAgICAgICAgICAgLy8gY2h1bmsvdG9rZW5pemVcbiAgICAgICAgICAgICAgICAgICAgeENodW5rZWQgPSB4LnJlcGxhY2UoY2h1bmtSZWdFeHAsICdcXDAkMVxcMCcpLnJlcGxhY2UoL1xcMCQvLCAnJykucmVwbGFjZSgvXlxcMC8sICcnKS5zcGxpdCgnXFwwJyksXG4gICAgICAgICAgICAgICAgICAgIHlDaHVua2VkID0geS5yZXBsYWNlKGNodW5rUmVnRXhwLCAnXFwwJDFcXDAnKS5yZXBsYWNlKC9cXDAkLywgJycpLnJlcGxhY2UoL15cXDAvLCAnJykuc3BsaXQoJ1xcMCcpLFxuICAgICAgICAgICAgICAgICAgICBjaHVua0xlbmd0aCA9IE1hdGgubWF4KHhDaHVua2VkLmxlbmd0aCwgeUNodW5rZWQubGVuZ3RoKSxcbiAgICAgICAgICAgICAgICAgICAgLy8gbnVtZXJpYywgaGV4IG9yIGRhdGUgZGV0ZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIHhEYXRlID0gcGFyc2VJbnQoeC5tYXRjaChudW1lcmljUmVnRXhwKSwgMTApIHx8ICh4Q2h1bmtlZC5sZW5ndGggIT0gMSAmJiB4Lm1hdGNoKGRhdGVSZWdFeHApICYmIERhdGUucGFyc2UoeCkpLFxuICAgICAgICAgICAgICAgICAgICB5RGF0ZSA9IHBhcnNlSW50KHkubWF0Y2gobnVtZXJpY1JlZ0V4cCksIDEwKSB8fCB4RGF0ZSAmJiB5Lm1hdGNoKGRhdGVSZWdFeHApICYmIERhdGUucGFyc2UoeSkgfHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgeEhleFZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB5SGV4VmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGluZGV4O1xuICAgICAgICAgICAgICAgIGlmICh5RGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoeERhdGUgPCB5RGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHhEYXRlID4geURhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IGNodW5rTGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZpbmQgZmxvYXRzIG5vdCBzdGFydGluZyB3aXRoICcwJywgc3RyaW5nIG9yIDAgaWYgbm90IGRlZmluZWQgKENsaW50IFByaWVzdClcbiAgICAgICAgICAgICAgICAgICAgeEhleFZhbHVlID0gISh4Q2h1bmtlZFtpbmRleF0gfHwgJycpLm1hdGNoKG9SZWdFeHApICYmIHBhcnNlRmxvYXQoeENodW5rZWRbaW5kZXhdKSB8fCB4Q2h1bmtlZFtpbmRleF0gfHwgMDtcbiAgICAgICAgICAgICAgICAgICAgeUhleFZhbHVlID0gISh5Q2h1bmtlZFtpbmRleF0gfHwgJycpLm1hdGNoKG9SZWdFeHApICYmIHBhcnNlRmxvYXQoeUNodW5rZWRbaW5kZXhdKSB8fCB5Q2h1bmtlZFtpbmRleF0gfHwgMDtcbiAgICAgICAgICAgICAgICAgICAgLy8gaGFuZGxlIG51bWVyaWMgdnMgc3RyaW5nIGNvbXBhcmlzb24gLSBudW1iZXIgPCBzdHJpbmcgLSAoS3lsZSBBZGFtcylcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzTmFOKHhIZXhWYWx1ZSkgIT09IGlzTmFOKHlIZXhWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoIGlzTmFOKHhIZXhWYWx1ZSkgKSA/IDEgOiAtMSA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gcmVseSBvbiBzdHJpbmcgY29tcGFyaXNvbiBpZiBkaWZmZXJlbnQgdHlwZXMgLSBpLmUuICcwMicgPCAyICE9ICcwMicgPCAnMidcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHhIZXhWYWx1ZSAhPT0gdHlwZW9mIHlIZXhWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeEhleFZhbHVlICs9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgeUhleFZhbHVlICs9ICcnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh4SGV4VmFsdWUgPCB5SGV4VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoeEhleFZhbHVlID4geUhleFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDtcblxuICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuJHRhYmxlLmZpbmQoJ3RoZWFkIHRoIGRpdicpLnJlbW92ZUNsYXNzKHNlbGYuc2V0dGluZ3MuYXNjICsgJyAnICsgc2VsZi5zZXR0aW5ncy5kZXNjKTtcblxuICAgICAgICB0aGlzLiR0aCA9IHRoO1xuICAgICAgICBpZiAodGhpcy5pbmRleCAhPSBpbmRleCkge1xuICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb25baW5kZXhdID0gJ2Rlc2MnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRpcmVjdGlvbiAhPT0gJ2FzYycgJiYgZGlyZWN0aW9uICE9PSAnZGVzYycpIHtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9uW2luZGV4XSA9IHRoaXMuZGlyZWN0aW9uW2luZGV4XSA9PT0gJ2Rlc2MnID8gJ2FzYycgOiAnZGVzYyc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRpcmVjdGlvbltpbmRleF0gPSBkaXJlY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgICBkaXJlY3Rpb24gPSB0aGlzLmRpcmVjdGlvbltpbmRleF0gPT0gJ2FzYycgPyAxIDogLTE7XG5cbiAgICAgICAgc2VsZi4kdGFibGUudHJpZ2dlcigndGFibGVzb3J0OnN0YXJ0JywgW3NlbGZdKTtcbiAgICAgICAgc2VsZi5sb2coXCJTb3J0aW5nIGJ5IFwiICsgdGhpcy5pbmRleCArICcgJyArIHRoaXMuZGlyZWN0aW9uW2luZGV4XSk7XG5cbiAgICAgICAgcm93cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICB2YXIgYVJvdyA9ICQoYSk7XG4gICAgICAgICAgICB2YXIgYlJvdyA9ICQoYik7XG4gICAgICAgICAgICB2YXIgYUluZGV4ID0gYVJvdy5pbmRleCgpO1xuICAgICAgICAgICAgdmFyIGJJbmRleCA9IGJSb3cuaW5kZXgoKTtcblxuICAgICAgICAgICAgLy8gU29ydCB2YWx1ZSBBXG4gICAgICAgICAgICBpZiAoY2FjaGVbYUluZGV4XSkge1xuICAgICAgICAgICAgICAgIGEgPSBjYWNoZVthSW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYSA9IHNvcnRWYWx1ZUZvckNlbGwodGgsIHNlbGYuY2VsbFRvU29ydChhKSwgc2VsZik7XG4gICAgICAgICAgICAgICAgY2FjaGVbYUluZGV4XSA9IGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTb3J0IFZhbHVlIEJcbiAgICAgICAgICAgIGlmIChjYWNoZVtiSW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgYiA9IGNhY2hlW2JJbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBiID0gc29ydFZhbHVlRm9yQ2VsbCh0aCwgc2VsZi5jZWxsVG9Tb3J0KGIpLCBzZWxmKTtcbiAgICAgICAgICAgICAgICBjYWNoZVtiSW5kZXhdID0gYjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAobmF0dXJhbFNvcnQoYSwgYikgKiBkaXJlY3Rpb24pO1xuICAgICAgICB9KTtcblxuICAgICAgICByb3dzLmVhY2goZnVuY3Rpb24gKGksIHRyKSB7XG4gICAgICAgICAgICBmcmFnbWVudC5hcHBlbmQodHIpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGFibGUuYXBwZW5kKGZyYWdtZW50Lmh0bWwoKSk7XG5cbiAgICAgICAgZGl2LmFkZENsYXNzKHNlbGYuc2V0dGluZ3Nbc2VsZi5kaXJlY3Rpb25baW5kZXhdXSk7XG5cbiAgICAgICAgc2VsZi5sb2coJ1NvcnQgZmluaXNoZWQgaW4gJyArICgobmV3IERhdGUoKSkuZ2V0VGltZSgpIC0gc3RhcnQuZ2V0VGltZSgpKSArICdtcycpO1xuICAgICAgICBzZWxmLiR0YWJsZS50cmlnZ2VyKCd0YWJsZXNvcnQ6Y29tcGxldGUnLCBbc2VsZl0pO1xuXG4gICAgfSxcblxuICAgIGNlbGxUb1NvcnQ6IGZ1bmN0aW9uIChyb3cpIHtcbiAgICAgICAgcmV0dXJuICQoJChyb3cpLmZpbmQoJ3RkJykuZ2V0KHRoaXMuaW5kZXgpKTtcbiAgICB9LFxuXG5cbiAgICBsb2c6IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgaWYgKCgkLnRhYmxlc29ydC5ERUJVRyB8fCB0aGlzLnNldHRpbmdzLmRlYnVnKSAmJiBjb25zb2xlICYmIGNvbnNvbGUubG9nKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnW3RhYmxlc29ydF0gJyArIG1zZyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLiR0YWJsZS5maW5kKCd0aGVhZCB0aCcpLnVuYmluZCgnY2xpY2sudGFibGVzb3J0Jyk7XG4gICAgICAgIHRoaXMuJHRhYmxlLmRhdGEoJ3RhYmxlc29ydCcsIG51bGwpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbn07XG5cbiQudGFibGVzb3J0LkRFQlVHID0gZmFsc2U7XG5cbiQudGFibGVzb3J0LmRlZmF1bHRzID0ge1xuICAgIGRlYnVnOiAkLnRhYmxlc29ydC5ERUJVRyxcbiAgICBhc2M6ICdhc2NlbmRpbmcnLFxuICAgIGRlc2M6ICdkZXNjZW5kaW5nJ1xufTtcblxuJC5mbi50YWJsZXNvcnQgPSBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICB2YXIgdGFibGUsIHNvcnRhYmxlLCBwcmV2aW91cztcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGFibGUgPSAkKHRoaXMpO1xuICAgICAgICBwcmV2aW91cyA9IHRhYmxlLmRhdGEoJ3RhYmxlc29ydCcpO1xuICAgICAgICBpZiAocHJldmlvdXMpIHtcbiAgICAgICAgICAgIHByZXZpb3VzLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICB0YWJsZS5kYXRhKCd0YWJsZXNvcnQnLCBuZXcgJC50YWJsZXNvcnQodGFibGUsIHNldHRpbmdzKSk7XG4gICAgfSk7XG59O1xuXG5cbiJdLCJmaWxlIjoiZGFpbHlzdGF0ZW1lbnQvdGFibGVzb3J0LmpzIn0=
