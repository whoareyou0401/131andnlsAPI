
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



//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb21tb24vdGFibGVzb3J0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuJC50YWJsZXNvcnQgPSBmdW5jdGlvbiAoJHRhYmxlLCBzZXR0aW5ncykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLiR0YWJsZSA9ICR0YWJsZTtcbiAgICB0aGlzLnNldHRpbmdzID0gJC5leHRlbmQoe30sICQudGFibGVzb3J0LmRlZmF1bHRzLCBzZXR0aW5ncyk7XG4gICAgdGhpcy4kdGFibGUuZmluZCgndGhlYWQgdGgnKS5iaW5kKCdjbGljay50YWJsZXNvcnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKFwiLnBhZ2luYXRpb24gc2VsZWN0IG9wdGlvblwiKS5sZW5ndGggPiAxICYmIHNldHRpbmdzLmZ1bmMpe1xuICAgICAgICAgICAgJC5leHRlbmQoc2V0dGluZ3MpO1xuICAgICAgICAgICAgc2VsZi5zb3J0QmFja0VuZCgkKHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghJCh0aGlzKS5oYXNDbGFzcygnZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgc2VsZi5zb3J0KCQodGhpcykpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5pbmRleCA9IG51bGw7XG4gICAgdGhpcy4kdGggPSBudWxsO1xuICAgIHRoaXMuZGlyZWN0aW9uID0gW107XG59O1xuXG4kLnRhYmxlc29ydC5wcm90b3R5cGUgPSB7XG4gICAgc29ydEJhY2tFbmQ6IGZ1bmN0aW9uKHRoLCBkaXJlY3Rpb24pe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICB0YWJsZSA9IHRoaXMuJHRhYmxlLFxuICAgICAgICAgICAgcm93cyA9IHRhYmxlLmZpbmQoJ3Rib2R5IHRyJyksXG4gICAgICAgICAgICBpbmRleCA9IHRoLmluZGV4KCksXG4gICAgICAgICAgICBkaXYgPSB0aC5jaGlsZHJlbihcImRpdlwiKSxcbiAgICAgICAgICAgIGRyID0gZGl2Lmhhc0NsYXNzKHNlbGYuc2V0dGluZ3MuYXNjKSA/IHNlbGYuc2V0dGluZ3MuZGVzYzpzZWxmLnNldHRpbmdzLmFzYztcblxuICAgICAgICBzZWxmLiR0YWJsZS5maW5kKCd0aGVhZCB0aCBkaXYnKS5yZW1vdmVDbGFzcyhzZWxmLnNldHRpbmdzLmFzYyArICcgJyArIHNlbGYuc2V0dGluZ3MuZGVzYyk7XG4gICAgICAgIGRpdi5hZGRDbGFzcyhkcik7XG4gICAgICAgICQuZnVuYygpO1xuICAgIH0sXG5cbiAgICBzb3J0OiBmdW5jdGlvbiAodGgsIGRpcmVjdGlvbikge1xuICAgICAgICB2YXIgc3RhcnQgPSBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICB0YWJsZSA9IHRoaXMuJHRhYmxlLFxuICAgICAgICAgICAgcm93cyA9IHRhYmxlLmZpbmQoJ3Rib2R5IHRyJyksXG4gICAgICAgICAgICBpbmRleCA9IHRoLmluZGV4KCksXG4gICAgICAgICAgICBkaXYgPSB0aC5jaGlsZHJlbihcImRpdlwiKSxcbiAgICAgICAgICAgIGNhY2hlID0gW10sXG4gICAgICAgICAgICBmcmFnbWVudCA9ICQoJzxkaXYvPicpLFxuICAgICAgICAgICAgc29ydFZhbHVlRm9yQ2VsbCA9IGZ1bmN0aW9uICh0aCwgdGQsIHNvcnRlcikge1xuICAgICAgICAgICAgICAgIHZhciBzb3J0Qnk7XG4gICAgICAgICAgICAgICAgaWYgKHRoLmRhdGEoKS5zb3J0QnkpIHtcbiAgICAgICAgICAgICAgICAgICAgc29ydEJ5ID0gdGguZGF0YSgpLnNvcnRCeTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICh0eXBlb2Ygc29ydEJ5ID09PSAnZnVuY3Rpb24nKSA/IHNvcnRCeSh0aCwgdGQsIHNvcnRlcikgOiBzb3J0Qnk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAoIHRkLmRhdGEoJ3NvcnQnKSkgPyB0ZC5kYXRhKCdzb3J0JykgOiB0ZC50ZXh0KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmF0dXJhbFNvcnQgPSBmdW5jdGlvbiBuYXR1cmFsU29ydChhLCBiKSB7XG4gICAgICAgICAgICAgICAgdmFyXG4gICAgICAgICAgICAgICAgICAgIGNodW5rUmVnRXhwID0gLyheLT9bMC05XSsoXFwuP1swLTldKilbZGZdP2U/WzAtOV0/JHxeMHhbMC05YS1mXSskfFswLTldKykvZ2ksXG4gICAgICAgICAgICAgICAgICAgIHN0cmlwUmVnRXhwID0gLyheWyBdKnxbIF0qJCkvZyxcbiAgICAgICAgICAgICAgICAgICAgZGF0ZVJlZ0V4cCA9IC8oXihbXFx3IF0rLD9bXFx3IF0rKT9bXFx3IF0rLD9bXFx3IF0rXFxkKzpcXGQrKDpcXGQrKT9bXFx3IF0/fF5cXGR7MSw0fVtcXC9cXC1dXFxkezEsNH1bXFwvXFwtXVxcZHsxLDR9fF5cXHcrLCBcXHcrIFxcZCssIFxcZHs0fSkvLFxuICAgICAgICAgICAgICAgICAgICBudW1lcmljUmVnRXhwID0gL14weFswLTlhLWZdKyQvaSxcbiAgICAgICAgICAgICAgICAgICAgb1JlZ0V4cCA9IC9eMC8sXG4gICAgICAgICAgICAgICAgICAgIGNMb2MgPSAwLFxuICAgICAgICAgICAgICAgICAgICB1c2VJbnNlbnNpdGl2ZSA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoJycgKyBzdHJpbmcpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnLCcsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgLy8gY29udmVydCBhbGwgdG8gc3RyaW5ncyBzdHJpcCB3aGl0ZXNwYWNlXG4gICAgICAgICAgICAgICAgICAgIHggPSB1c2VJbnNlbnNpdGl2ZShhKS5yZXBsYWNlKHN0cmlwUmVnRXhwLCAnJykgfHwgJycsXG4gICAgICAgICAgICAgICAgICAgIHkgPSB1c2VJbnNlbnNpdGl2ZShiKS5yZXBsYWNlKHN0cmlwUmVnRXhwLCAnJykgfHwgJycsXG4gICAgICAgICAgICAgICAgICAgIC8vIGNodW5rL3Rva2VuaXplXG4gICAgICAgICAgICAgICAgICAgIHhDaHVua2VkID0geC5yZXBsYWNlKGNodW5rUmVnRXhwLCAnXFwwJDFcXDAnKS5yZXBsYWNlKC9cXDAkLywgJycpLnJlcGxhY2UoL15cXDAvLCAnJykuc3BsaXQoJ1xcMCcpLFxuICAgICAgICAgICAgICAgICAgICB5Q2h1bmtlZCA9IHkucmVwbGFjZShjaHVua1JlZ0V4cCwgJ1xcMCQxXFwwJykucmVwbGFjZSgvXFwwJC8sICcnKS5yZXBsYWNlKC9eXFwwLywgJycpLnNwbGl0KCdcXDAnKSxcbiAgICAgICAgICAgICAgICAgICAgY2h1bmtMZW5ndGggPSBNYXRoLm1heCh4Q2h1bmtlZC5sZW5ndGgsIHlDaHVua2VkLmxlbmd0aCksXG4gICAgICAgICAgICAgICAgICAgIC8vIG51bWVyaWMsIGhleCBvciBkYXRlIGRldGVjdGlvblxuICAgICAgICAgICAgICAgICAgICB4RGF0ZSA9IHBhcnNlSW50KHgubWF0Y2gobnVtZXJpY1JlZ0V4cCksIDEwKSB8fCAoeENodW5rZWQubGVuZ3RoICE9IDEgJiYgeC5tYXRjaChkYXRlUmVnRXhwKSAmJiBEYXRlLnBhcnNlKHgpKSxcbiAgICAgICAgICAgICAgICAgICAgeURhdGUgPSBwYXJzZUludCh5Lm1hdGNoKG51bWVyaWNSZWdFeHApLCAxMCkgfHwgeERhdGUgJiYgeS5tYXRjaChkYXRlUmVnRXhwKSAmJiBEYXRlLnBhcnNlKHkpIHx8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHhIZXhWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgeUhleFZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBpbmRleDtcbiAgICAgICAgICAgICAgICBpZiAoeURhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHhEYXRlIDwgeURhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh4RGF0ZSA+IHlEYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBjaHVua0xlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICAvLyBmaW5kIGZsb2F0cyBub3Qgc3RhcnRpbmcgd2l0aCAnMCcsIHN0cmluZyBvciAwIGlmIG5vdCBkZWZpbmVkIChDbGludCBQcmllc3QpXG4gICAgICAgICAgICAgICAgICAgIHhIZXhWYWx1ZSA9ICEoeENodW5rZWRbaW5kZXhdIHx8ICcnKS5tYXRjaChvUmVnRXhwKSAmJiBwYXJzZUZsb2F0KHhDaHVua2VkW2luZGV4XSkgfHwgeENodW5rZWRbaW5kZXhdIHx8IDA7XG4gICAgICAgICAgICAgICAgICAgIHlIZXhWYWx1ZSA9ICEoeUNodW5rZWRbaW5kZXhdIHx8ICcnKS5tYXRjaChvUmVnRXhwKSAmJiBwYXJzZUZsb2F0KHlDaHVua2VkW2luZGV4XSkgfHwgeUNodW5rZWRbaW5kZXhdIHx8IDA7XG4gICAgICAgICAgICAgICAgICAgIC8vIGhhbmRsZSBudW1lcmljIHZzIHN0cmluZyBjb21wYXJpc29uIC0gbnVtYmVyIDwgc3RyaW5nIC0gKEt5bGUgQWRhbXMpXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc05hTih4SGV4VmFsdWUpICE9PSBpc05hTih5SGV4VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCBpc05hTih4SGV4VmFsdWUpICkgPyAxIDogLTEgO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbHkgb24gc3RyaW5nIGNvbXBhcmlzb24gaWYgZGlmZmVyZW50IHR5cGVzIC0gaS5lLiAnMDInIDwgMiAhPSAnMDInIDwgJzInXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB4SGV4VmFsdWUgIT09IHR5cGVvZiB5SGV4VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHhIZXhWYWx1ZSArPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHlIZXhWYWx1ZSArPSAnJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoeEhleFZhbHVlIDwgeUhleFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHhIZXhWYWx1ZSA+IHlIZXhWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA7XG5cbiAgICAgICAgaWYgKHJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLiR0YWJsZS5maW5kKCd0aGVhZCB0aCBkaXYnKS5yZW1vdmVDbGFzcyhzZWxmLnNldHRpbmdzLmFzYyArICcgJyArIHNlbGYuc2V0dGluZ3MuZGVzYyk7XG5cbiAgICAgICAgdGhpcy4kdGggPSB0aDtcbiAgICAgICAgaWYgKHRoaXMuaW5kZXggIT0gaW5kZXgpIHtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9uW2luZGV4XSA9ICdkZXNjJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkaXJlY3Rpb24gIT09ICdhc2MnICYmIGRpcmVjdGlvbiAhPT0gJ2Rlc2MnKSB7XG4gICAgICAgICAgICB0aGlzLmRpcmVjdGlvbltpbmRleF0gPSB0aGlzLmRpcmVjdGlvbltpbmRleF0gPT09ICdkZXNjJyA/ICdhc2MnIDogJ2Rlc2MnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb25baW5kZXhdID0gZGlyZWN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgZGlyZWN0aW9uID0gdGhpcy5kaXJlY3Rpb25baW5kZXhdID09ICdhc2MnID8gMSA6IC0xO1xuXG4gICAgICAgIHNlbGYuJHRhYmxlLnRyaWdnZXIoJ3RhYmxlc29ydDpzdGFydCcsIFtzZWxmXSk7XG4gICAgICAgIHNlbGYubG9nKFwiU29ydGluZyBieSBcIiArIHRoaXMuaW5kZXggKyAnICcgKyB0aGlzLmRpcmVjdGlvbltpbmRleF0pO1xuXG4gICAgICAgIHJvd3Muc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgdmFyIGFSb3cgPSAkKGEpO1xuICAgICAgICAgICAgdmFyIGJSb3cgPSAkKGIpO1xuICAgICAgICAgICAgdmFyIGFJbmRleCA9IGFSb3cuaW5kZXgoKTtcbiAgICAgICAgICAgIHZhciBiSW5kZXggPSBiUm93LmluZGV4KCk7XG5cbiAgICAgICAgICAgIC8vIFNvcnQgdmFsdWUgQVxuICAgICAgICAgICAgaWYgKGNhY2hlW2FJbmRleF0pIHtcbiAgICAgICAgICAgICAgICBhID0gY2FjaGVbYUluZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGEgPSBzb3J0VmFsdWVGb3JDZWxsKHRoLCBzZWxmLmNlbGxUb1NvcnQoYSksIHNlbGYpO1xuICAgICAgICAgICAgICAgIGNhY2hlW2FJbmRleF0gPSBhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU29ydCBWYWx1ZSBCXG4gICAgICAgICAgICBpZiAoY2FjaGVbYkluZGV4XSkge1xuICAgICAgICAgICAgICAgIGIgPSBjYWNoZVtiSW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYiA9IHNvcnRWYWx1ZUZvckNlbGwodGgsIHNlbGYuY2VsbFRvU29ydChiKSwgc2VsZik7XG4gICAgICAgICAgICAgICAgY2FjaGVbYkluZGV4XSA9IGI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKG5hdHVyYWxTb3J0KGEsIGIpICogZGlyZWN0aW9uKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcm93cy5lYWNoKGZ1bmN0aW9uIChpLCB0cikge1xuICAgICAgICAgICAgZnJhZ21lbnQuYXBwZW5kKHRyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRhYmxlLmFwcGVuZChmcmFnbWVudC5odG1sKCkpO1xuXG4gICAgICAgIGRpdi5hZGRDbGFzcyhzZWxmLnNldHRpbmdzW3NlbGYuZGlyZWN0aW9uW2luZGV4XV0pO1xuXG4gICAgICAgIHNlbGYubG9nKCdTb3J0IGZpbmlzaGVkIGluICcgKyAoKG5ldyBEYXRlKCkpLmdldFRpbWUoKSAtIHN0YXJ0LmdldFRpbWUoKSkgKyAnbXMnKTtcbiAgICAgICAgc2VsZi4kdGFibGUudHJpZ2dlcigndGFibGVzb3J0OmNvbXBsZXRlJywgW3NlbGZdKTtcblxuICAgIH0sXG5cbiAgICBjZWxsVG9Tb3J0OiBmdW5jdGlvbiAocm93KSB7XG4gICAgICAgIHJldHVybiAkKCQocm93KS5maW5kKCd0ZCcpLmdldCh0aGlzLmluZGV4KSk7XG4gICAgfSxcblxuXG4gICAgbG9nOiBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIGlmICgoJC50YWJsZXNvcnQuREVCVUcgfHwgdGhpcy5zZXR0aW5ncy5kZWJ1ZykgJiYgY29uc29sZSAmJiBjb25zb2xlLmxvZykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1t0YWJsZXNvcnRdICcgKyBtc2cpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy4kdGFibGUuZmluZCgndGhlYWQgdGgnKS51bmJpbmQoJ2NsaWNrLnRhYmxlc29ydCcpO1xuICAgICAgICB0aGlzLiR0YWJsZS5kYXRhKCd0YWJsZXNvcnQnLCBudWxsKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG59O1xuXG4kLnRhYmxlc29ydC5ERUJVRyA9IGZhbHNlO1xuXG4kLnRhYmxlc29ydC5kZWZhdWx0cyA9IHtcbiAgICBkZWJ1ZzogJC50YWJsZXNvcnQuREVCVUcsXG4gICAgYXNjOiAnYXNjZW5kaW5nJyxcbiAgICBkZXNjOiAnZGVzY2VuZGluZydcbn07XG5cbiQuZm4udGFibGVzb3J0ID0gZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gICAgdmFyIHRhYmxlLCBzb3J0YWJsZSwgcHJldmlvdXM7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRhYmxlID0gJCh0aGlzKTtcbiAgICAgICAgcHJldmlvdXMgPSB0YWJsZS5kYXRhKCd0YWJsZXNvcnQnKTtcbiAgICAgICAgaWYgKHByZXZpb3VzKSB7XG4gICAgICAgICAgICBwcmV2aW91cy5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGFibGUuZGF0YSgndGFibGVzb3J0JywgbmV3ICQudGFibGVzb3J0KHRhYmxlLCBzZXR0aW5ncykpO1xuICAgIH0pO1xufTtcblxuXG4iXSwiZmlsZSI6ImNvbW1vbi90YWJsZXNvcnQuanMifQ==
