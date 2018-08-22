

;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'jquery', 'blobjs', 'file-saverjs', 'xlsx-js'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('jquery'), require('blobjs'), require('file-saverjs'), require('xlsx-js'));
    } else {
        // Browser globals
        factory(root, root.jQuery, root.Blob, root.saveAs, root.XLSX);
    }
}(this, function (exports, $, Blob, saveAs, XLSX) {
        'use strict';
        /**
         * TableExport main plugin constructor
         * @param selectors {jQuery} jQuery selector(s)
         * @param options {Object} TableExport configuration options
         * @param isUpdate {Boolean}
         * @constructor
         */
        var TableExport = function (selectors, options, isUpdate) {

            var self = this;
            /**
             * TableExport configuration options (user-defined w/ default fallback)
             */
            self.settings = isUpdate ? options : $.extend({}, TableExport.prototype.defaults, options);
            /**
             * jQuery selectors (tables) to apply the plugin to
             */
            self.selectors = selectors;

            var rowD = TableExport.prototype.rowDel,
                ignoreRows = self.settings.ignoreRows instanceof Array ? self.settings.ignoreRows : [self.settings.ignoreRows],
                ignoreCols = self.settings.ignoreCols instanceof Array ? self.settings.ignoreCols : [self.settings.ignoreCols],
                ignoreCSS = self.settings.ignoreCSS instanceof Array ? self.settings.ignoreCSS.join(", ") : self.settings.ignoreCSS,
                emptyCSS = self.settings.emptyCSS instanceof Array ? self.settings.emptyCSS.join(", ") : self.settings.emptyCSS,
                bootstrapClass, bootstrapTheme, bootstrapSpacing;

            if (self.settings.bootstrap) {
                bootstrapClass = TableExport.prototype.bootstrap[0] + " ";
                bootstrapTheme = TableExport.prototype.bootstrap[1] + " ";
                bootstrapSpacing = TableExport.prototype.bootstrap[2] + " ";
            } else {
                bootstrapClass = TableExport.prototype.defaultButton + " ";
                bootstrapTheme = bootstrapSpacing = "";
            }

            self.selectors.each(function () {
                var $el = $(this);
                if (isUpdate) {
                    $el.find('caption:not(.head)').remove();
                }
                var $rows = $el.find('tbody').find('tr'),
                    $rows = self.settings.headings ? $rows.add($el.find('thead>tr')) : $rows,
                    $rows = self.settings.footers ? $rows.add($el.find('tfoot>tr')) : $rows,
                    thAdj = self.settings.headings ? $el.find('thead>tr').length : 0,
                    fileName = self.settings.fileName === "id" ? ($el.attr('id') ? $el.attr('id') : TableExport.prototype.defaultFileName) : self.settings.fileName,
                    exporters = {
                        xlsx: function (rDel, name) {
                            var rcMap = {},
                                dataURL = $rows.map(function (ir, val) {
                                    if (!!~ignoreRows.indexOf(ir - thAdj) || $(val).is(ignoreCSS)) {
                                        return;
                                    }
                                    var $cols = $(val).find('th, td');
                                    return [$cols.map(function (ic, val) {
                                        if (!!~ignoreCols.indexOf(ic) || $(val).is(ignoreCSS)) {
                                            return;
                                        }
                                        if ($(val).is(emptyCSS)) {
                                            return " ";
                                        }
                                        if (val.hasAttribute('colspan')) {
                                            rcMap[ir] = rcMap[ir] || {};
                                            rcMap[ir][ic + 1] = val.getAttribute('colspan') - 1;
                                        }
                                        if (val.hasAttribute('rowspan')) {
                                            for (var i = 1; i < val.getAttribute('rowspan'); i++) {
                                                rcMap[ir + i] = rcMap[ir + i] || {};
                                                rcMap[ir + i][ic] = 1;
                                            }
                                        }
                                        if (rcMap[ir] && rcMap[ir][ic]) {
                                            return new Array(rcMap[ir][ic]).concat($(val).text());
                                        }
                                        return $(val).text();
                                    }).get()];
                                }).get(),
                                dataObject = TableExport.prototype.escapeHtml(
                                    JSON.stringify({
                                        data: dataURL,
                                        fileName: name,
                                        mimeType: TableExport.prototype.xlsx.mimeType,
                                        fileExtension: TableExport.prototype.xlsx.fileExtension
                                    })),
                                myContent = TableExport.prototype.xlsx.buttonContent,
                                myClass = TableExport.prototype.xlsx.defaultClass;
                            createObjButton(dataObject, myContent, myClass);
                        },
                        xlsm: function (rDel, name) {
                            var rcMap = {},
                                dataURL = $rows.map(function (ir, val) {
                                    if (!!~ignoreRows.indexOf(ir - thAdj) || $(val).is(ignoreCSS)) {
                                        return;
                                    }
                                    var $cols = $(val).find('th, td');
                                    return [$cols.map(function (ic, val) {
                                        if (!!~ignoreCols.indexOf(ic) || $(val).is(ignoreCSS)) {
                                            return;
                                        }
                                        if ($(val).is(emptyCSS)) {
                                            return " ";
                                        }
                                        if (val.hasAttribute('colspan')) {
                                            rcMap[ir] = rcMap[ir] || {};
                                            rcMap[ir][ic + 1] = val.getAttribute('colspan') - 1;
                                        }
                                        if (val.hasAttribute('rowspan')) {
                                            for (var i = 1; i < val.getAttribute('rowspan'); i++) {
                                                rcMap[ir + i] = rcMap[ir + i] || {};
                                                rcMap[ir + i][ic] = 1;
                                            }
                                        }
                                        if (rcMap[ir] && rcMap[ir][ic]) {
                                            return new Array(rcMap[ir][ic]).concat($(val).text());
                                        }
                                        return $(val).text();
                                    }).get()];
                                }).get(),
                                dataObject = TableExport.prototype.escapeHtml(
                                    JSON.stringify({
                                        data: dataURL,
                                        fileName: name,
                                        mimeType: TableExport.prototype.xls.mimeType,
                                        fileExtension: TableExport.prototype.xls.fileExtension
                                    })),
                                myContent = TableExport.prototype.xls.buttonContent,
                                myClass = TableExport.prototype.xls.defaultClass;
                            createObjButton(dataObject, myContent, myClass);
                        },
                        xls: function (rdel, name) {
                            var colD = TableExport.prototype.xls.separator,
                                dataURL = $rows.map(function (i, val) {
                                    if (!!~ignoreRows.indexOf(i - thAdj) || $(val).is(ignoreCSS)) {
                                        return;
                                    }
                                    var $cols = $(val).find('th, td');
                                    return $cols.map(function (i, val) {
                                        if (!!~ignoreCols.indexOf(i) || $(val).is(ignoreCSS)) {
                                            return;
                                        }
                                        if ($(val).is(emptyCSS)) {
                                            return " ";
                                        }
                                        return $(val).text();
                                    }).get().join(colD);
                                }).get().join(rdel),
                                dataObject = TableExport.prototype.escapeHtml(
                                    JSON.stringify({
                                        data: dataURL,
                                        fileName: name,
                                        mimeType: TableExport.prototype.xls.mimeType,
                                        fileExtension: TableExport.prototype.xls.fileExtension
                                    })),
                                myContent = TableExport.prototype.xls.buttonContent,
                                myClass = TableExport.prototype.xls.defaultClass;
                            createObjButton(dataObject, myContent, myClass);
                        },
                        csv: function (rdel, name) {
                            var colD = TableExport.prototype.csv.separator,
                                dataURL = $rows.map(function (i, val) {
                                    if (!!~ignoreRows.indexOf(i - thAdj) || $(val).is(ignoreCSS)) {
                                        return;
                                    }
                                    var $cols = $(val).find('th, td');
                                    return $cols.map(function (i, val) {
                                        if (!!~ignoreCols.indexOf(i) || $(val).is(ignoreCSS)) {
                                            return;
                                        }
                                        if ($(val).is(emptyCSS)) {
                                            return " ";
                                        }
                                        return '"' + $(val).text().replace(/"/g, '""') + '"';
                                    }).get().join(colD);
                                }).get().join(rdel),
                                dataObject = TableExport.prototype.escapeHtml(
                                    JSON.stringify({
                                        data: dataURL,
                                        fileName: name,
                                        mimeType: TableExport.prototype.csv.mimeType,
                                        fileExtension: TableExport.prototype.csv.fileExtension
                                    })),
                                myContent = TableExport.prototype.csv.buttonContent,
                                myClass = TableExport.prototype.csv.defaultClass;
                            createObjButton(dataObject, myContent, myClass);
                        },
                        txt: function (rdel, name) {
                            var colD = TableExport.prototype.txt.separator,
                                dataURL = $rows.map(function (i, val) {
                                    if (!!~ignoreRows.indexOf(i - thAdj) || $(val).is(ignoreCSS)) {
                                        return;
                                    }
                                    var $cols = $(val).find('th, td');
                                    return $cols.map(function (i, val) {
                                        if (!!~ignoreCols.indexOf(i) || $(val).is(ignoreCSS)) {
                                            return;
                                        }
                                        if ($(val).is(emptyCSS)) {
                                            return " ";
                                        }
                                        return $(val).text();
                                    }).get().join(colD);
                                }).get().join(rdel),
                                dataObject = TableExport.prototype.escapeHtml(
                                    JSON.stringify({
                                        data: dataURL,
                                        fileName: name,
                                        mimeType: TableExport.prototype.txt.mimeType,
                                        fileExtension: TableExport.prototype.txt.fileExtension
                                    })),
                                myContent = TableExport.prototype.txt.buttonContent,
                                myClass = TableExport.prototype.txt.defaultClass;
                            createObjButton(dataObject, myContent, myClass);
                        }
                    };

                self.settings.formats.forEach(
                    function (key) {
                        XLSX && key === 'xls' ? key = 'xlsm' : false;
                        !XLSX && key === 'xlsx' ? key = null : false;
                        key && exporters[key](rowD, fileName);
                    }
                );

                function checkCaption(exportButton) {
                    var $caption = $('caption:not(.head)');
                    $caption.length ? $caption.append(exportButton) : $el.prepend('<caption class="' + bootstrapSpacing + self.settings.position + '">' + exportButton + '</caption>');
                }

                function createObjButton(dataObject, myContent, myClass) {
                    // var exportButton = "<button data-fileblob='" + dataObject + "' class='" + bootstrapClass + bootstrapTheme + myClass + "'>" + myContent + "</button>";
                    // checkCaption(exportButton);
                    $(".download").attr("data-fileblob", dataObject);
                    var object = $(".download").data("fileblob"),
                        data = object.data,
                        fileName = object.fileName,
                        mimeType = object.mimeType,
                        fileExtension = object.fileExtension;
                    TableExport.prototype.export2file(data, mimeType, fileName, fileExtension);
                }
            });

            $(".download")
                .off("click")
                .on("click", function () {
                    var object = $(this).data("fileblob"),
                        data = object.data,
                        fileName = object.fileName,
                        mimeType = object.mimeType,
                        fileExtension = object.fileExtension;
                    TableExport.prototype.export2file(data, mimeType, fileName, fileExtension);
                });

            return self;
        };


        TableExport.prototype = {
            /**
             * Version.
             * @memberof TableExport.prototype
             */
            version: "3.3.5",
            /**
             * Default plugin options.
             * @memberof TableExport.prototype
             */
            defaults: {
                headings: true,                             // (Boolean), display table headings (th or td elements) in the <thead>, (default: true)
                footers: true,                              // (Boolean), display table footers (th or td elements) in the <tfoot>, (default: false)
                formats: ["xls", "csv", "txt"],             // (String[]), filetype(s) for the export, (default: ["xls", "csv", "txt"])
                fileName: "id",                             // (id, String), filename for the downloaded file, (default: "id")
                bootstrap: true,                            // (Boolean), style buttons using bootstrap, (default: true)
                position: "bottom",                         // (top, bottom), position of the caption element relative to table, (default: "bottom")
                ignoreRows: null,                           // (Number, Number[]), row indices to exclude from the exported file (default: null)
                ignoreCols: null,                           // (Number, Number[]), column indices to exclude from the exported file (default: null)
                ignoreCSS: ".tableexport-ignore",           // (selector, selector[]), selector(s) to exclude cells from the exported file (default: ".tableexport-ignore")
                emptyCSS: ".tableexport-empty"              // (selector, selector[]), selector(s) to replace cells with an empty string in the exported file (default: ".tableexport-empty")
            },
            /**
             * Character set (character encoding) of the HTML.
             * @memberof TableExport.prototype
             */
            charset: "charset=utf-8",
            /**
             * Filename fallback for exported files.
             * @memberof TableExport.prototype
             */
            defaultFileName: "myDownload",
            /**
             * Class applied to each export button element.
             * @memberof TableExport.prototype
             */
            defaultButton: "button-default",
            /**
             * Bootstrap configuration classes ["base", "theme", "container"].
             * @memberof TableExport.prototype
             */
            bootstrap: ["btn", "btn-default", "btn-toolbar"],
            /**
             * Row delimeter
             * @memberof TableExport.prototype
             */
            rowDel: "\r\n",
            /**
             * HTML entity mapping for special characters.
             * @memberof TableExport.prototype
             */
            entityMap: {"&": "&#38;", "<": "&#60;", ">": "&#62;", "'": '&#39;', "/": '&#47;'},
            /**
             * XLSX (Open XML spreadsheet) file extension configuration
             * @memberof TableExport.prototype
             */
            xlsx: {
                defaultClass: "xlsx",
                buttonContent: "Export to xlsx",
                mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                fileExtension: ".xlsx"
            },
            /**
             * XLS (Binary spreadsheet) file extension configuration
             * @memberof TableExport.prototype
             */
            xls: {
                defaultClass: "xls",
                buttonContent: "Export to xls",
                separator: "\t",
                mimeType: "application/vnd.ms-excel",
                fileExtension: ".xls"
            },
            /**
             * CSV (Comma Separated Values) file extension configuration
             * @memberof TableExport.prototype
             */
            csv: {
                defaultClass: "csv",
                buttonContent: "Export to csv",
                separator: ",",
                mimeType: "text/csv",
                fileExtension: ".csv"
            },
            /**
             * TXT (Plain Text) file extension configuration
             * @memberof TableExport.prototype
             */
            txt: {
                defaultClass: "txt",
                buttonContent: "Export to txt",
                separator: "  ",
                mimeType: "text/plain",
                fileExtension: ".txt"
            },
            /**
             * Escapes special characters with HTML entities
             * @memberof TableExport.prototype
             * @param string {String}
             * @returns {String} escaped string
             */
            escapeHtml: function (string) {
                return String(string).replace(/[&<>'\/]/g, function (s) {
                    return TableExport.prototype.entityMap[s];
                });
            },
            /**
             * Formats datetimes for compatibility with Excel
             * @memberof TableExport.prototype
             * @param v {Number}
             * @param date1904 {Date}
             * @returns {Number} epoch time
             */
            dateNum: function (v, date1904) {
                if (date1904) v += 1462;
                var epoch = Date.parse(v);
                return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
            },
            /**
             * Creates an Excel spreadsheet from a data string
             * @memberof TableExport.prototype
             * @param data {String}
             * @returns {Number} epoch time
             */
            createSheet: function (data) {
                var ws = {};
                var range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};
                for (var R = 0; R != data.length; ++R) {
                    for (var C = 0; C != data[R].length; ++C) {
                        if (range.s.r > R) range.s.r = R;
                        if (range.s.c > C) range.s.c = C;
                        if (range.e.r < R) range.e.r = R;
                        if (range.e.c < C) range.e.c = C;
                        var cell = {v: data[R][C]};
                        if (cell.v === null) continue;
                        var cell_ref = XLSX.utils.encode_cell({c: C, r: R});

                        if (typeof cell.v === 'number') cell.t = 'n';
                        else if (typeof cell.v === 'boolean') cell.t = 'b';
                        else if (cell.v instanceof Date) {
                            cell.t = 'n';
                            cell.z = XLSX.SSF._table[14];
                            cell.v = this.dateNum(cell.v);
                        }
                        else cell.t = 's';

                        ws[cell_ref] = cell;
                    }
                }
                if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
                return ws;
            },
            /**
             * Excel Workbook constructor
             * @memberof TableExport.prototype
             * @constructor
             */
            Workbook: function () {
                this.SheetNames = [];
                this.Sheets = {};
            },
            /**
             * Converts a string to an arraybuffer
             * @param s {String}
             * @memberof TableExport.prototype
             * @returns {ArrayBuffer}
             */
            string2ArrayBuffer: function (s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            },
            /**
             * Exports and downloads the file
             * @memberof TableExport.prototype
             * @param data {String}
             * @param mime {String} mime type
             * @param name {String} filename
             * @param extension {String} file extension
             */
            export2file: function (data, mime, name, extension) {
                if (XLSX && extension.substr(0, 4) == (".xls")) {
                    var wb = new this.Workbook(),
                        ws = this.createSheet(data);

                    wb.SheetNames.push(name);
                    wb.Sheets[name] = ws;
                    var wopts = {
                            bookType: extension.substr(1, 3) + (extension.substr(4) || 'm'),
                            bookSST: false,
                            type: 'binary'
                        },
                        wbout = XLSX.write(wb, wopts);

                    data = this.string2ArrayBuffer(wbout);
                }
                saveAs(new Blob(["\uFEFF" + data],
                    {type: mime + ";" + this.charset}),
                    name + extension, true);
            },
            /**
             * Updates the plugin instance with new/updated options
             * @param options {Object} TableExport configuration options
             * @returns {TableExport} updated TableExport instance
             */
            update: function (options) {
                return new TableExport(this.selectors, $.extend({}, this.settings, options), true);
            },
            /**
             * Reset the plugin instance to its original state
             * @returns {TableExport} original TableExport instance
             */
            reset: function () {
                return new TableExport(this.selectors, settings, true);
            },
            /**
             * Remove the instance (i.e. caption containing the export buttons)
             */
            remove: function () {
                this.selectors.each(function () {
                    $(this).find('caption:not(.head)').remove();
                });
            }
        };

        /**
         * jQuery TableExport wrapper
         * @param options {Object} TableExport configuration options
         * @param isUpdate {Boolean}
         * @returns {TableExport} TableExport instance
         */
        $.fn.tableExport = function (options, isUpdate) {
            return new TableExport(this, options, isUpdate);
        };

        // alias the TableExport prototype
        for (var prop in TableExport.prototype) {
            $.fn.tableExport[prop] = TableExport.prototype[prop];
        }

        return exports.default = exports.TableExport = TableExport;

    }
));
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb21tb24vdGFibGVleHBvcnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG5cbjsoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICAgICAgZGVmaW5lKFsnZXhwb3J0cycsICdqcXVlcnknLCAnYmxvYmpzJywgJ2ZpbGUtc2F2ZXJqcycsICd4bHN4LWpzJ10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBleHBvcnRzLm5vZGVOYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICAvLyBDb21tb25KU1xuICAgICAgICBmYWN0b3J5KGV4cG9ydHMsIHJlcXVpcmUoJ2pxdWVyeScpLCByZXF1aXJlKCdibG9ianMnKSwgcmVxdWlyZSgnZmlsZS1zYXZlcmpzJyksIHJlcXVpcmUoJ3hsc3gtanMnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzXG4gICAgICAgIGZhY3Rvcnkocm9vdCwgcm9vdC5qUXVlcnksIHJvb3QuQmxvYiwgcm9vdC5zYXZlQXMsIHJvb3QuWExTWCk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiAoZXhwb3J0cywgJCwgQmxvYiwgc2F2ZUFzLCBYTFNYKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRhYmxlRXhwb3J0IG1haW4gcGx1Z2luIGNvbnN0cnVjdG9yXG4gICAgICAgICAqIEBwYXJhbSBzZWxlY3RvcnMge2pRdWVyeX0galF1ZXJ5IHNlbGVjdG9yKHMpXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IFRhYmxlRXhwb3J0IGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgICAgICAgKiBAcGFyYW0gaXNVcGRhdGUge0Jvb2xlYW59XG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIFRhYmxlRXhwb3J0ID0gZnVuY3Rpb24gKHNlbGVjdG9ycywgb3B0aW9ucywgaXNVcGRhdGUpIHtcblxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUYWJsZUV4cG9ydCBjb25maWd1cmF0aW9uIG9wdGlvbnMgKHVzZXItZGVmaW5lZCB3LyBkZWZhdWx0IGZhbGxiYWNrKVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBzZWxmLnNldHRpbmdzID0gaXNVcGRhdGUgPyBvcHRpb25zIDogJC5leHRlbmQoe30sIFRhYmxlRXhwb3J0LnByb3RvdHlwZS5kZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIGpRdWVyeSBzZWxlY3RvcnMgKHRhYmxlcykgdG8gYXBwbHkgdGhlIHBsdWdpbiB0b1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBzZWxmLnNlbGVjdG9ycyA9IHNlbGVjdG9ycztcblxuICAgICAgICAgICAgdmFyIHJvd0QgPSBUYWJsZUV4cG9ydC5wcm90b3R5cGUucm93RGVsLFxuICAgICAgICAgICAgICAgIGlnbm9yZVJvd3MgPSBzZWxmLnNldHRpbmdzLmlnbm9yZVJvd3MgaW5zdGFuY2VvZiBBcnJheSA/IHNlbGYuc2V0dGluZ3MuaWdub3JlUm93cyA6IFtzZWxmLnNldHRpbmdzLmlnbm9yZVJvd3NdLFxuICAgICAgICAgICAgICAgIGlnbm9yZUNvbHMgPSBzZWxmLnNldHRpbmdzLmlnbm9yZUNvbHMgaW5zdGFuY2VvZiBBcnJheSA/IHNlbGYuc2V0dGluZ3MuaWdub3JlQ29scyA6IFtzZWxmLnNldHRpbmdzLmlnbm9yZUNvbHNdLFxuICAgICAgICAgICAgICAgIGlnbm9yZUNTUyA9IHNlbGYuc2V0dGluZ3MuaWdub3JlQ1NTIGluc3RhbmNlb2YgQXJyYXkgPyBzZWxmLnNldHRpbmdzLmlnbm9yZUNTUy5qb2luKFwiLCBcIikgOiBzZWxmLnNldHRpbmdzLmlnbm9yZUNTUyxcbiAgICAgICAgICAgICAgICBlbXB0eUNTUyA9IHNlbGYuc2V0dGluZ3MuZW1wdHlDU1MgaW5zdGFuY2VvZiBBcnJheSA/IHNlbGYuc2V0dGluZ3MuZW1wdHlDU1Muam9pbihcIiwgXCIpIDogc2VsZi5zZXR0aW5ncy5lbXB0eUNTUyxcbiAgICAgICAgICAgICAgICBib290c3RyYXBDbGFzcywgYm9vdHN0cmFwVGhlbWUsIGJvb3RzdHJhcFNwYWNpbmc7XG5cbiAgICAgICAgICAgIGlmIChzZWxmLnNldHRpbmdzLmJvb3RzdHJhcCkge1xuICAgICAgICAgICAgICAgIGJvb3RzdHJhcENsYXNzID0gVGFibGVFeHBvcnQucHJvdG90eXBlLmJvb3RzdHJhcFswXSArIFwiIFwiO1xuICAgICAgICAgICAgICAgIGJvb3RzdHJhcFRoZW1lID0gVGFibGVFeHBvcnQucHJvdG90eXBlLmJvb3RzdHJhcFsxXSArIFwiIFwiO1xuICAgICAgICAgICAgICAgIGJvb3RzdHJhcFNwYWNpbmcgPSBUYWJsZUV4cG9ydC5wcm90b3R5cGUuYm9vdHN0cmFwWzJdICsgXCIgXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJvb3RzdHJhcENsYXNzID0gVGFibGVFeHBvcnQucHJvdG90eXBlLmRlZmF1bHRCdXR0b24gKyBcIiBcIjtcbiAgICAgICAgICAgICAgICBib290c3RyYXBUaGVtZSA9IGJvb3RzdHJhcFNwYWNpbmcgPSBcIlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLnNlbGVjdG9ycy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJGVsID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNVcGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgJGVsLmZpbmQoJ2NhcHRpb246bm90KC5oZWFkKScpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgJHJvd3MgPSAkZWwuZmluZCgndGJvZHknKS5maW5kKCd0cicpLFxuICAgICAgICAgICAgICAgICAgICAkcm93cyA9IHNlbGYuc2V0dGluZ3MuaGVhZGluZ3MgPyAkcm93cy5hZGQoJGVsLmZpbmQoJ3RoZWFkPnRyJykpIDogJHJvd3MsXG4gICAgICAgICAgICAgICAgICAgICRyb3dzID0gc2VsZi5zZXR0aW5ncy5mb290ZXJzID8gJHJvd3MuYWRkKCRlbC5maW5kKCd0Zm9vdD50cicpKSA6ICRyb3dzLFxuICAgICAgICAgICAgICAgICAgICB0aEFkaiA9IHNlbGYuc2V0dGluZ3MuaGVhZGluZ3MgPyAkZWwuZmluZCgndGhlYWQ+dHInKS5sZW5ndGggOiAwLFxuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSA9IHNlbGYuc2V0dGluZ3MuZmlsZU5hbWUgPT09IFwiaWRcIiA/ICgkZWwuYXR0cignaWQnKSA/ICRlbC5hdHRyKCdpZCcpIDogVGFibGVFeHBvcnQucHJvdG90eXBlLmRlZmF1bHRGaWxlTmFtZSkgOiBzZWxmLnNldHRpbmdzLmZpbGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICBleHBvcnRlcnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4bHN4OiBmdW5jdGlvbiAockRlbCwgbmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByY01hcCA9IHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhVVJMID0gJHJvd3MubWFwKGZ1bmN0aW9uIChpciwgdmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoISF+aWdub3JlUm93cy5pbmRleE9mKGlyIC0gdGhBZGopIHx8ICQodmFsKS5pcyhpZ25vcmVDU1MpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRjb2xzID0gJCh2YWwpLmZpbmQoJ3RoLCB0ZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFskY29scy5tYXAoZnVuY3Rpb24gKGljLCB2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoISF+aWdub3JlQ29scy5pbmRleE9mKGljKSB8fCAkKHZhbCkuaXMoaWdub3JlQ1NTKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHZhbCkuaXMoZW1wdHlDU1MpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIiBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbC5oYXNBdHRyaWJ1dGUoJ2NvbHNwYW4nKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByY01hcFtpcl0gPSByY01hcFtpcl0gfHwge307XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJjTWFwW2lyXVtpYyArIDFdID0gdmFsLmdldEF0dHJpYnV0ZSgnY29sc3BhbicpIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbC5oYXNBdHRyaWJ1dGUoJ3Jvd3NwYW4nKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHZhbC5nZXRBdHRyaWJ1dGUoJ3Jvd3NwYW4nKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByY01hcFtpciArIGldID0gcmNNYXBbaXIgKyBpXSB8fCB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJjTWFwW2lyICsgaV1baWNdID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmNNYXBbaXJdICYmIHJjTWFwW2lyXVtpY10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBBcnJheShyY01hcFtpcl1baWNdKS5jb25jYXQoJCh2YWwpLnRleHQoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkKHZhbCkudGV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuZ2V0KCldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5nZXQoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YU9iamVjdCA9IFRhYmxlRXhwb3J0LnByb3RvdHlwZS5lc2NhcGVIdG1sKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFVUkwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWltZVR5cGU6IFRhYmxlRXhwb3J0LnByb3RvdHlwZS54bHN4Lm1pbWVUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVFeHRlbnNpb246IFRhYmxlRXhwb3J0LnByb3RvdHlwZS54bHN4LmZpbGVFeHRlbnNpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXlDb250ZW50ID0gVGFibGVFeHBvcnQucHJvdG90eXBlLnhsc3guYnV0dG9uQ29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXlDbGFzcyA9IFRhYmxlRXhwb3J0LnByb3RvdHlwZS54bHN4LmRlZmF1bHRDbGFzcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVPYmpCdXR0b24oZGF0YU9iamVjdCwgbXlDb250ZW50LCBteUNsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB4bHNtOiBmdW5jdGlvbiAockRlbCwgbmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByY01hcCA9IHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhVVJMID0gJHJvd3MubWFwKGZ1bmN0aW9uIChpciwgdmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoISF+aWdub3JlUm93cy5pbmRleE9mKGlyIC0gdGhBZGopIHx8ICQodmFsKS5pcyhpZ25vcmVDU1MpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRjb2xzID0gJCh2YWwpLmZpbmQoJ3RoLCB0ZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFskY29scy5tYXAoZnVuY3Rpb24gKGljLCB2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoISF+aWdub3JlQ29scy5pbmRleE9mKGljKSB8fCAkKHZhbCkuaXMoaWdub3JlQ1NTKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHZhbCkuaXMoZW1wdHlDU1MpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIiBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbC5oYXNBdHRyaWJ1dGUoJ2NvbHNwYW4nKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByY01hcFtpcl0gPSByY01hcFtpcl0gfHwge307XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJjTWFwW2lyXVtpYyArIDFdID0gdmFsLmdldEF0dHJpYnV0ZSgnY29sc3BhbicpIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbC5oYXNBdHRyaWJ1dGUoJ3Jvd3NwYW4nKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHZhbC5nZXRBdHRyaWJ1dGUoJ3Jvd3NwYW4nKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByY01hcFtpciArIGldID0gcmNNYXBbaXIgKyBpXSB8fCB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJjTWFwW2lyICsgaV1baWNdID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmNNYXBbaXJdICYmIHJjTWFwW2lyXVtpY10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBBcnJheShyY01hcFtpcl1baWNdKS5jb25jYXQoJCh2YWwpLnRleHQoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkKHZhbCkudGV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuZ2V0KCldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5nZXQoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YU9iamVjdCA9IFRhYmxlRXhwb3J0LnByb3RvdHlwZS5lc2NhcGVIdG1sKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFVUkwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWltZVR5cGU6IFRhYmxlRXhwb3J0LnByb3RvdHlwZS54bHMubWltZVR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZUV4dGVuc2lvbjogVGFibGVFeHBvcnQucHJvdG90eXBlLnhscy5maWxlRXh0ZW5zaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG15Q29udGVudCA9IFRhYmxlRXhwb3J0LnByb3RvdHlwZS54bHMuYnV0dG9uQ29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXlDbGFzcyA9IFRhYmxlRXhwb3J0LnByb3RvdHlwZS54bHMuZGVmYXVsdENsYXNzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZU9iakJ1dHRvbihkYXRhT2JqZWN0LCBteUNvbnRlbnQsIG15Q2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHhsczogZnVuY3Rpb24gKHJkZWwsIG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29sRCA9IFRhYmxlRXhwb3J0LnByb3RvdHlwZS54bHMuc2VwYXJhdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhVVJMID0gJHJvd3MubWFwKGZ1bmN0aW9uIChpLCB2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghIX5pZ25vcmVSb3dzLmluZGV4T2YoaSAtIHRoQWRqKSB8fCAkKHZhbCkuaXMoaWdub3JlQ1NTKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkY29scyA9ICQodmFsKS5maW5kKCd0aCwgdGQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkY29scy5tYXAoZnVuY3Rpb24gKGksIHZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghIX5pZ25vcmVDb2xzLmluZGV4T2YoaSkgfHwgJCh2YWwpLmlzKGlnbm9yZUNTUykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCh2YWwpLmlzKGVtcHR5Q1NTKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCIgXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkKHZhbCkudGV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuZ2V0KCkuam9pbihjb2xEKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuZ2V0KCkuam9pbihyZGVsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YU9iamVjdCA9IFRhYmxlRXhwb3J0LnByb3RvdHlwZS5lc2NhcGVIdG1sKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFVUkwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWltZVR5cGU6IFRhYmxlRXhwb3J0LnByb3RvdHlwZS54bHMubWltZVR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZUV4dGVuc2lvbjogVGFibGVFeHBvcnQucHJvdG90eXBlLnhscy5maWxlRXh0ZW5zaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG15Q29udGVudCA9IFRhYmxlRXhwb3J0LnByb3RvdHlwZS54bHMuYnV0dG9uQ29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXlDbGFzcyA9IFRhYmxlRXhwb3J0LnByb3RvdHlwZS54bHMuZGVmYXVsdENsYXNzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZU9iakJ1dHRvbihkYXRhT2JqZWN0LCBteUNvbnRlbnQsIG15Q2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzdjogZnVuY3Rpb24gKHJkZWwsIG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29sRCA9IFRhYmxlRXhwb3J0LnByb3RvdHlwZS5jc3Yuc2VwYXJhdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhVVJMID0gJHJvd3MubWFwKGZ1bmN0aW9uIChpLCB2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghIX5pZ25vcmVSb3dzLmluZGV4T2YoaSAtIHRoQWRqKSB8fCAkKHZhbCkuaXMoaWdub3JlQ1NTKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkY29scyA9ICQodmFsKS5maW5kKCd0aCwgdGQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkY29scy5tYXAoZnVuY3Rpb24gKGksIHZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghIX5pZ25vcmVDb2xzLmluZGV4T2YoaSkgfHwgJCh2YWwpLmlzKGlnbm9yZUNTUykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCh2YWwpLmlzKGVtcHR5Q1NTKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCIgXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnXCInICsgJCh2YWwpLnRleHQoKS5yZXBsYWNlKC9cIi9nLCAnXCJcIicpICsgJ1wiJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmdldCgpLmpvaW4oY29sRCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmdldCgpLmpvaW4ocmRlbCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFPYmplY3QgPSBUYWJsZUV4cG9ydC5wcm90b3R5cGUuZXNjYXBlSHRtbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhVVJMLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbWVUeXBlOiBUYWJsZUV4cG9ydC5wcm90b3R5cGUuY3N2Lm1pbWVUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVFeHRlbnNpb246IFRhYmxlRXhwb3J0LnByb3RvdHlwZS5jc3YuZmlsZUV4dGVuc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBteUNvbnRlbnQgPSBUYWJsZUV4cG9ydC5wcm90b3R5cGUuY3N2LmJ1dHRvbkNvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG15Q2xhc3MgPSBUYWJsZUV4cG9ydC5wcm90b3R5cGUuY3N2LmRlZmF1bHRDbGFzcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVPYmpCdXR0b24oZGF0YU9iamVjdCwgbXlDb250ZW50LCBteUNsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0eHQ6IGZ1bmN0aW9uIChyZGVsLCBuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbEQgPSBUYWJsZUV4cG9ydC5wcm90b3R5cGUudHh0LnNlcGFyYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVVSTCA9ICRyb3dzLm1hcChmdW5jdGlvbiAoaSwgdmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoISF+aWdub3JlUm93cy5pbmRleE9mKGkgLSB0aEFkaikgfHwgJCh2YWwpLmlzKGlnbm9yZUNTUykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgJGNvbHMgPSAkKHZhbCkuZmluZCgndGgsIHRkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGNvbHMubWFwKGZ1bmN0aW9uIChpLCB2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoISF+aWdub3JlQ29scy5pbmRleE9mKGkpIHx8ICQodmFsKS5pcyhpZ25vcmVDU1MpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQodmFsKS5pcyhlbXB0eUNTUykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiIFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJCh2YWwpLnRleHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmdldCgpLmpvaW4oY29sRCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmdldCgpLmpvaW4ocmRlbCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFPYmplY3QgPSBUYWJsZUV4cG9ydC5wcm90b3R5cGUuZXNjYXBlSHRtbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhVVJMLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbWVUeXBlOiBUYWJsZUV4cG9ydC5wcm90b3R5cGUudHh0Lm1pbWVUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVFeHRlbnNpb246IFRhYmxlRXhwb3J0LnByb3RvdHlwZS50eHQuZmlsZUV4dGVuc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBteUNvbnRlbnQgPSBUYWJsZUV4cG9ydC5wcm90b3R5cGUudHh0LmJ1dHRvbkNvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG15Q2xhc3MgPSBUYWJsZUV4cG9ydC5wcm90b3R5cGUudHh0LmRlZmF1bHRDbGFzcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVPYmpCdXR0b24oZGF0YU9iamVjdCwgbXlDb250ZW50LCBteUNsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHNlbGYuc2V0dGluZ3MuZm9ybWF0cy5mb3JFYWNoKFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBYTFNYICYmIGtleSA9PT0gJ3hscycgPyBrZXkgPSAneGxzbScgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICFYTFNYICYmIGtleSA9PT0gJ3hsc3gnID8ga2V5ID0gbnVsbCA6IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5ICYmIGV4cG9ydGVyc1trZXldKHJvd0QsIGZpbGVOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBjaGVja0NhcHRpb24oZXhwb3J0QnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkY2FwdGlvbiA9ICQoJ2NhcHRpb246bm90KC5oZWFkKScpO1xuICAgICAgICAgICAgICAgICAgICAkY2FwdGlvbi5sZW5ndGggPyAkY2FwdGlvbi5hcHBlbmQoZXhwb3J0QnV0dG9uKSA6ICRlbC5wcmVwZW5kKCc8Y2FwdGlvbiBjbGFzcz1cIicgKyBib290c3RyYXBTcGFjaW5nICsgc2VsZi5zZXR0aW5ncy5wb3NpdGlvbiArICdcIj4nICsgZXhwb3J0QnV0dG9uICsgJzwvY2FwdGlvbj4nKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBjcmVhdGVPYmpCdXR0b24oZGF0YU9iamVjdCwgbXlDb250ZW50LCBteUNsYXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHZhciBleHBvcnRCdXR0b24gPSBcIjxidXR0b24gZGF0YS1maWxlYmxvYj0nXCIgKyBkYXRhT2JqZWN0ICsgXCInIGNsYXNzPSdcIiArIGJvb3RzdHJhcENsYXNzICsgYm9vdHN0cmFwVGhlbWUgKyBteUNsYXNzICsgXCInPlwiICsgbXlDb250ZW50ICsgXCI8L2J1dHRvbj5cIjtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2tDYXB0aW9uKGV4cG9ydEJ1dHRvbik7XG4gICAgICAgICAgICAgICAgICAgICQoXCIuZG93bmxvYWRcIikuYXR0cihcImRhdGEtZmlsZWJsb2JcIiwgZGF0YU9iamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvYmplY3QgPSAkKFwiLmRvd25sb2FkXCIpLmRhdGEoXCJmaWxlYmxvYlwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBvYmplY3QuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lID0gb2JqZWN0LmZpbGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWltZVR5cGUgPSBvYmplY3QubWltZVR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlRXh0ZW5zaW9uID0gb2JqZWN0LmZpbGVFeHRlbnNpb247XG4gICAgICAgICAgICAgICAgICAgIFRhYmxlRXhwb3J0LnByb3RvdHlwZS5leHBvcnQyZmlsZShkYXRhLCBtaW1lVHlwZSwgZmlsZU5hbWUsIGZpbGVFeHRlbnNpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKFwiLmRvd25sb2FkXCIpXG4gICAgICAgICAgICAgICAgLm9mZihcImNsaWNrXCIpXG4gICAgICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb2JqZWN0ID0gJCh0aGlzKS5kYXRhKFwiZmlsZWJsb2JcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gb2JqZWN0LmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSA9IG9iamVjdC5maWxlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbWVUeXBlID0gb2JqZWN0Lm1pbWVUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZUV4dGVuc2lvbiA9IG9iamVjdC5maWxlRXh0ZW5zaW9uO1xuICAgICAgICAgICAgICAgICAgICBUYWJsZUV4cG9ydC5wcm90b3R5cGUuZXhwb3J0MmZpbGUoZGF0YSwgbWltZVR5cGUsIGZpbGVOYW1lLCBmaWxlRXh0ZW5zaW9uKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICAgIH07XG5cblxuICAgICAgICBUYWJsZUV4cG9ydC5wcm90b3R5cGUgPSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFZlcnNpb24uXG4gICAgICAgICAgICAgKiBAbWVtYmVyb2YgVGFibGVFeHBvcnQucHJvdG90eXBlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZlcnNpb246IFwiMy4zLjVcIixcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBwbHVnaW4gb3B0aW9ucy5cbiAgICAgICAgICAgICAqIEBtZW1iZXJvZiBUYWJsZUV4cG9ydC5wcm90b3R5cGVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgICAgICBoZWFkaW5nczogdHJ1ZSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIChCb29sZWFuKSwgZGlzcGxheSB0YWJsZSBoZWFkaW5ncyAodGggb3IgdGQgZWxlbWVudHMpIGluIHRoZSA8dGhlYWQ+LCAoZGVmYXVsdDogdHJ1ZSlcbiAgICAgICAgICAgICAgICBmb290ZXJzOiB0cnVlLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIChCb29sZWFuKSwgZGlzcGxheSB0YWJsZSBmb290ZXJzICh0aCBvciB0ZCBlbGVtZW50cykgaW4gdGhlIDx0Zm9vdD4sIChkZWZhdWx0OiBmYWxzZSlcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbXCJ4bHNcIiwgXCJjc3ZcIiwgXCJ0eHRcIl0sICAgICAgICAgICAgIC8vIChTdHJpbmdbXSksIGZpbGV0eXBlKHMpIGZvciB0aGUgZXhwb3J0LCAoZGVmYXVsdDogW1wieGxzXCIsIFwiY3N2XCIsIFwidHh0XCJdKVxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBcImlkXCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAoaWQsIFN0cmluZyksIGZpbGVuYW1lIGZvciB0aGUgZG93bmxvYWRlZCBmaWxlLCAoZGVmYXVsdDogXCJpZFwiKVxuICAgICAgICAgICAgICAgIGJvb3RzdHJhcDogdHJ1ZSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gKEJvb2xlYW4pLCBzdHlsZSBidXR0b25zIHVzaW5nIGJvb3RzdHJhcCwgKGRlZmF1bHQ6IHRydWUpXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IFwiYm90dG9tXCIsICAgICAgICAgICAgICAgICAgICAgICAgIC8vICh0b3AsIGJvdHRvbSksIHBvc2l0aW9uIG9mIHRoZSBjYXB0aW9uIGVsZW1lbnQgcmVsYXRpdmUgdG8gdGFibGUsIChkZWZhdWx0OiBcImJvdHRvbVwiKVxuICAgICAgICAgICAgICAgIGlnbm9yZVJvd3M6IG51bGwsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gKE51bWJlciwgTnVtYmVyW10pLCByb3cgaW5kaWNlcyB0byBleGNsdWRlIGZyb20gdGhlIGV4cG9ydGVkIGZpbGUgKGRlZmF1bHQ6IG51bGwpXG4gICAgICAgICAgICAgICAgaWdub3JlQ29sczogbnVsbCwgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAoTnVtYmVyLCBOdW1iZXJbXSksIGNvbHVtbiBpbmRpY2VzIHRvIGV4Y2x1ZGUgZnJvbSB0aGUgZXhwb3J0ZWQgZmlsZSAoZGVmYXVsdDogbnVsbClcbiAgICAgICAgICAgICAgICBpZ25vcmVDU1M6IFwiLnRhYmxlZXhwb3J0LWlnbm9yZVwiLCAgICAgICAgICAgLy8gKHNlbGVjdG9yLCBzZWxlY3RvcltdKSwgc2VsZWN0b3IocykgdG8gZXhjbHVkZSBjZWxscyBmcm9tIHRoZSBleHBvcnRlZCBmaWxlIChkZWZhdWx0OiBcIi50YWJsZWV4cG9ydC1pZ25vcmVcIilcbiAgICAgICAgICAgICAgICBlbXB0eUNTUzogXCIudGFibGVleHBvcnQtZW1wdHlcIiAgICAgICAgICAgICAgLy8gKHNlbGVjdG9yLCBzZWxlY3RvcltdKSwgc2VsZWN0b3IocykgdG8gcmVwbGFjZSBjZWxscyB3aXRoIGFuIGVtcHR5IHN0cmluZyBpbiB0aGUgZXhwb3J0ZWQgZmlsZSAoZGVmYXVsdDogXCIudGFibGVleHBvcnQtZW1wdHlcIilcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIENoYXJhY3RlciBzZXQgKGNoYXJhY3RlciBlbmNvZGluZykgb2YgdGhlIEhUTUwuXG4gICAgICAgICAgICAgKiBAbWVtYmVyb2YgVGFibGVFeHBvcnQucHJvdG90eXBlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNoYXJzZXQ6IFwiY2hhcnNldD11dGYtOFwiLFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaWxlbmFtZSBmYWxsYmFjayBmb3IgZXhwb3J0ZWQgZmlsZXMuXG4gICAgICAgICAgICAgKiBAbWVtYmVyb2YgVGFibGVFeHBvcnQucHJvdG90eXBlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRGaWxlTmFtZTogXCJteURvd25sb2FkXCIsXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIENsYXNzIGFwcGxpZWQgdG8gZWFjaCBleHBvcnQgYnV0dG9uIGVsZW1lbnQuXG4gICAgICAgICAgICAgKiBAbWVtYmVyb2YgVGFibGVFeHBvcnQucHJvdG90eXBlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRCdXR0b246IFwiYnV0dG9uLWRlZmF1bHRcIixcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQm9vdHN0cmFwIGNvbmZpZ3VyYXRpb24gY2xhc3NlcyBbXCJiYXNlXCIsIFwidGhlbWVcIiwgXCJjb250YWluZXJcIl0uXG4gICAgICAgICAgICAgKiBAbWVtYmVyb2YgVGFibGVFeHBvcnQucHJvdG90eXBlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGJvb3RzdHJhcDogW1wiYnRuXCIsIFwiYnRuLWRlZmF1bHRcIiwgXCJidG4tdG9vbGJhclwiXSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogUm93IGRlbGltZXRlclxuICAgICAgICAgICAgICogQG1lbWJlcm9mIFRhYmxlRXhwb3J0LnByb3RvdHlwZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByb3dEZWw6IFwiXFxyXFxuXCIsXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEhUTUwgZW50aXR5IG1hcHBpbmcgZm9yIHNwZWNpYWwgY2hhcmFjdGVycy5cbiAgICAgICAgICAgICAqIEBtZW1iZXJvZiBUYWJsZUV4cG9ydC5wcm90b3R5cGVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZW50aXR5TWFwOiB7XCImXCI6IFwiJiMzODtcIiwgXCI8XCI6IFwiJiM2MDtcIiwgXCI+XCI6IFwiJiM2MjtcIiwgXCInXCI6ICcmIzM5OycsIFwiL1wiOiAnJiM0NzsnfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogWExTWCAoT3BlbiBYTUwgc3ByZWFkc2hlZXQpIGZpbGUgZXh0ZW5zaW9uIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgICAgICAqIEBtZW1iZXJvZiBUYWJsZUV4cG9ydC5wcm90b3R5cGVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgeGxzeDoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHRDbGFzczogXCJ4bHN4XCIsXG4gICAgICAgICAgICAgICAgYnV0dG9uQ29udGVudDogXCJFeHBvcnQgdG8geGxzeFwiLFxuICAgICAgICAgICAgICAgIG1pbWVUeXBlOiBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5zcHJlYWRzaGVldG1sLnNoZWV0XCIsXG4gICAgICAgICAgICAgICAgZmlsZUV4dGVuc2lvbjogXCIueGxzeFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBYTFMgKEJpbmFyeSBzcHJlYWRzaGVldCkgZmlsZSBleHRlbnNpb24gY29uZmlndXJhdGlvblxuICAgICAgICAgICAgICogQG1lbWJlcm9mIFRhYmxlRXhwb3J0LnByb3RvdHlwZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB4bHM6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0Q2xhc3M6IFwieGxzXCIsXG4gICAgICAgICAgICAgICAgYnV0dG9uQ29udGVudDogXCJFeHBvcnQgdG8geGxzXCIsXG4gICAgICAgICAgICAgICAgc2VwYXJhdG9yOiBcIlxcdFwiLFxuICAgICAgICAgICAgICAgIG1pbWVUeXBlOiBcImFwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbFwiLFxuICAgICAgICAgICAgICAgIGZpbGVFeHRlbnNpb246IFwiLnhsc1wiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBDU1YgKENvbW1hIFNlcGFyYXRlZCBWYWx1ZXMpIGZpbGUgZXh0ZW5zaW9uIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgICAgICAqIEBtZW1iZXJvZiBUYWJsZUV4cG9ydC5wcm90b3R5cGVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY3N2OiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdENsYXNzOiBcImNzdlwiLFxuICAgICAgICAgICAgICAgIGJ1dHRvbkNvbnRlbnQ6IFwiRXhwb3J0IHRvIGNzdlwiLFxuICAgICAgICAgICAgICAgIHNlcGFyYXRvcjogXCIsXCIsXG4gICAgICAgICAgICAgICAgbWltZVR5cGU6IFwidGV4dC9jc3ZcIixcbiAgICAgICAgICAgICAgICBmaWxlRXh0ZW5zaW9uOiBcIi5jc3ZcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVFhUIChQbGFpbiBUZXh0KSBmaWxlIGV4dGVuc2lvbiBjb25maWd1cmF0aW9uXG4gICAgICAgICAgICAgKiBAbWVtYmVyb2YgVGFibGVFeHBvcnQucHJvdG90eXBlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHR4dDoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHRDbGFzczogXCJ0eHRcIixcbiAgICAgICAgICAgICAgICBidXR0b25Db250ZW50OiBcIkV4cG9ydCB0byB0eHRcIixcbiAgICAgICAgICAgICAgICBzZXBhcmF0b3I6IFwiICBcIixcbiAgICAgICAgICAgICAgICBtaW1lVHlwZTogXCJ0ZXh0L3BsYWluXCIsXG4gICAgICAgICAgICAgICAgZmlsZUV4dGVuc2lvbjogXCIudHh0XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEVzY2FwZXMgc3BlY2lhbCBjaGFyYWN0ZXJzIHdpdGggSFRNTCBlbnRpdGllc1xuICAgICAgICAgICAgICogQG1lbWJlcm9mIFRhYmxlRXhwb3J0LnByb3RvdHlwZVxuICAgICAgICAgICAgICogQHBhcmFtIHN0cmluZyB7U3RyaW5nfVxuICAgICAgICAgICAgICogQHJldHVybnMge1N0cmluZ30gZXNjYXBlZCBzdHJpbmdcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZXNjYXBlSHRtbDogZnVuY3Rpb24gKHN0cmluZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcoc3RyaW5nKS5yZXBsYWNlKC9bJjw+J1xcL10vZywgZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFRhYmxlRXhwb3J0LnByb3RvdHlwZS5lbnRpdHlNYXBbc107XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGb3JtYXRzIGRhdGV0aW1lcyBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIEV4Y2VsXG4gICAgICAgICAgICAgKiBAbWVtYmVyb2YgVGFibGVFeHBvcnQucHJvdG90eXBlXG4gICAgICAgICAgICAgKiBAcGFyYW0gdiB7TnVtYmVyfVxuICAgICAgICAgICAgICogQHBhcmFtIGRhdGUxOTA0IHtEYXRlfVxuICAgICAgICAgICAgICogQHJldHVybnMge051bWJlcn0gZXBvY2ggdGltZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkYXRlTnVtOiBmdW5jdGlvbiAodiwgZGF0ZTE5MDQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0ZTE5MDQpIHYgKz0gMTQ2MjtcbiAgICAgICAgICAgICAgICB2YXIgZXBvY2ggPSBEYXRlLnBhcnNlKHYpO1xuICAgICAgICAgICAgICAgIHJldHVybiAoZXBvY2ggLSBuZXcgRGF0ZShEYXRlLlVUQygxODk5LCAxMSwgMzApKSkgLyAoMjQgKiA2MCAqIDYwICogMTAwMCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBDcmVhdGVzIGFuIEV4Y2VsIHNwcmVhZHNoZWV0IGZyb20gYSBkYXRhIHN0cmluZ1xuICAgICAgICAgICAgICogQG1lbWJlcm9mIFRhYmxlRXhwb3J0LnByb3RvdHlwZVxuICAgICAgICAgICAgICogQHBhcmFtIGRhdGEge1N0cmluZ31cbiAgICAgICAgICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9IGVwb2NoIHRpbWVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY3JlYXRlU2hlZXQ6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIHdzID0ge307XG4gICAgICAgICAgICAgICAgdmFyIHJhbmdlID0ge3M6IHtjOiAxMDAwMDAwMCwgcjogMTAwMDAwMDB9LCBlOiB7YzogMCwgcjogMH19O1xuICAgICAgICAgICAgICAgIGZvciAodmFyIFIgPSAwOyBSICE9IGRhdGEubGVuZ3RoOyArK1IpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgQyA9IDA7IEMgIT0gZGF0YVtSXS5sZW5ndGg7ICsrQykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJhbmdlLnMuciA+IFIpIHJhbmdlLnMuciA9IFI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmFuZ2Uucy5jID4gQykgcmFuZ2Uucy5jID0gQztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyYW5nZS5lLnIgPCBSKSByYW5nZS5lLnIgPSBSO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJhbmdlLmUuYyA8IEMpIHJhbmdlLmUuYyA9IEM7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IHt2OiBkYXRhW1JdW0NdfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjZWxsLnYgPT09IG51bGwpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGxfcmVmID0gWExTWC51dGlscy5lbmNvZGVfY2VsbCh7YzogQywgcjogUn0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNlbGwudiA9PT0gJ251bWJlcicpIGNlbGwudCA9ICduJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBjZWxsLnYgPT09ICdib29sZWFuJykgY2VsbC50ID0gJ2InO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoY2VsbC52IGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwudCA9ICduJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsLnogPSBYTFNYLlNTRi5fdGFibGVbMTRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwudiA9IHRoaXMuZGF0ZU51bShjZWxsLnYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBjZWxsLnQgPSAncyc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHdzW2NlbGxfcmVmXSA9IGNlbGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJhbmdlLnMuYyA8IDEwMDAwMDAwKSB3c1snIXJlZiddID0gWExTWC51dGlscy5lbmNvZGVfcmFuZ2UocmFuZ2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiB3cztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEV4Y2VsIFdvcmtib29rIGNvbnN0cnVjdG9yXG4gICAgICAgICAgICAgKiBAbWVtYmVyb2YgVGFibGVFeHBvcnQucHJvdG90eXBlXG4gICAgICAgICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgV29ya2Jvb2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLlNoZWV0TmFtZXMgPSBbXTtcbiAgICAgICAgICAgICAgICB0aGlzLlNoZWV0cyA9IHt9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQ29udmVydHMgYSBzdHJpbmcgdG8gYW4gYXJyYXlidWZmZXJcbiAgICAgICAgICAgICAqIEBwYXJhbSBzIHtTdHJpbmd9XG4gICAgICAgICAgICAgKiBAbWVtYmVyb2YgVGFibGVFeHBvcnQucHJvdG90eXBlXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7QXJyYXlCdWZmZXJ9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHN0cmluZzJBcnJheUJ1ZmZlcjogZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICAgICAgICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKHMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1Zik7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgIT0gcy5sZW5ndGg7ICsraSkgdmlld1tpXSA9IHMuY2hhckNvZGVBdChpKSAmIDB4RkY7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJ1ZjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEV4cG9ydHMgYW5kIGRvd25sb2FkcyB0aGUgZmlsZVxuICAgICAgICAgICAgICogQG1lbWJlcm9mIFRhYmxlRXhwb3J0LnByb3RvdHlwZVxuICAgICAgICAgICAgICogQHBhcmFtIGRhdGEge1N0cmluZ31cbiAgICAgICAgICAgICAqIEBwYXJhbSBtaW1lIHtTdHJpbmd9IG1pbWUgdHlwZVxuICAgICAgICAgICAgICogQHBhcmFtIG5hbWUge1N0cmluZ30gZmlsZW5hbWVcbiAgICAgICAgICAgICAqIEBwYXJhbSBleHRlbnNpb24ge1N0cmluZ30gZmlsZSBleHRlbnNpb25cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZXhwb3J0MmZpbGU6IGZ1bmN0aW9uIChkYXRhLCBtaW1lLCBuYW1lLCBleHRlbnNpb24pIHtcbiAgICAgICAgICAgICAgICBpZiAoWExTWCAmJiBleHRlbnNpb24uc3Vic3RyKDAsIDQpID09IChcIi54bHNcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdiID0gbmV3IHRoaXMuV29ya2Jvb2soKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdzID0gdGhpcy5jcmVhdGVTaGVldChkYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICB3Yi5TaGVldE5hbWVzLnB1c2gobmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHdiLlNoZWV0c1tuYW1lXSA9IHdzO1xuICAgICAgICAgICAgICAgICAgICB2YXIgd29wdHMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9va1R5cGU6IGV4dGVuc2lvbi5zdWJzdHIoMSwgMykgKyAoZXh0ZW5zaW9uLnN1YnN0cig0KSB8fCAnbScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tTU1Q6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdiaW5hcnknXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgd2JvdXQgPSBYTFNYLndyaXRlKHdiLCB3b3B0cyk7XG5cbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHRoaXMuc3RyaW5nMkFycmF5QnVmZmVyKHdib3V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2F2ZUFzKG5ldyBCbG9iKFtcIlxcdUZFRkZcIiArIGRhdGFdLFxuICAgICAgICAgICAgICAgICAgICB7dHlwZTogbWltZSArIFwiO1wiICsgdGhpcy5jaGFyc2V0fSksXG4gICAgICAgICAgICAgICAgICAgIG5hbWUgKyBleHRlbnNpb24sIHRydWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVXBkYXRlcyB0aGUgcGx1Z2luIGluc3RhbmNlIHdpdGggbmV3L3VwZGF0ZWQgb3B0aW9uc1xuICAgICAgICAgICAgICogQHBhcmFtIG9wdGlvbnMge09iamVjdH0gVGFibGVFeHBvcnQgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7VGFibGVFeHBvcnR9IHVwZGF0ZWQgVGFibGVFeHBvcnQgaW5zdGFuY2VcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVGFibGVFeHBvcnQodGhpcy5zZWxlY3RvcnMsICQuZXh0ZW5kKHt9LCB0aGlzLnNldHRpbmdzLCBvcHRpb25zKSwgdHJ1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBSZXNldCB0aGUgcGx1Z2luIGluc3RhbmNlIHRvIGl0cyBvcmlnaW5hbCBzdGF0ZVxuICAgICAgICAgICAgICogQHJldHVybnMge1RhYmxlRXhwb3J0fSBvcmlnaW5hbCBUYWJsZUV4cG9ydCBpbnN0YW5jZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXNldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVGFibGVFeHBvcnQodGhpcy5zZWxlY3RvcnMsIHNldHRpbmdzLCB0cnVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFJlbW92ZSB0aGUgaW5zdGFuY2UgKGkuZS4gY2FwdGlvbiBjb250YWluaW5nIHRoZSBleHBvcnQgYnV0dG9ucylcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RvcnMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnY2FwdGlvbjpub3QoLmhlYWQpJykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGpRdWVyeSBUYWJsZUV4cG9ydCB3cmFwcGVyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IFRhYmxlRXhwb3J0IGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgICAgICAgKiBAcGFyYW0gaXNVcGRhdGUge0Jvb2xlYW59XG4gICAgICAgICAqIEByZXR1cm5zIHtUYWJsZUV4cG9ydH0gVGFibGVFeHBvcnQgaW5zdGFuY2VcbiAgICAgICAgICovXG4gICAgICAgICQuZm4udGFibGVFeHBvcnQgPSBmdW5jdGlvbiAob3B0aW9ucywgaXNVcGRhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVGFibGVFeHBvcnQodGhpcywgb3B0aW9ucywgaXNVcGRhdGUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGFsaWFzIHRoZSBUYWJsZUV4cG9ydCBwcm90b3R5cGVcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBUYWJsZUV4cG9ydC5wcm90b3R5cGUpIHtcbiAgICAgICAgICAgICQuZm4udGFibGVFeHBvcnRbcHJvcF0gPSBUYWJsZUV4cG9ydC5wcm90b3R5cGVbcHJvcF07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXhwb3J0cy5kZWZhdWx0ID0gZXhwb3J0cy5UYWJsZUV4cG9ydCA9IFRhYmxlRXhwb3J0O1xuXG4gICAgfVxuKSk7Il0sImZpbGUiOiJjb21tb24vdGFibGVleHBvcnQuanMifQ==
