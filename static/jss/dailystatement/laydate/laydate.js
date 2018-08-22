/**
 
 @Name : layDate v1.1 日期控件
 @Author: 贤心
 @Date: 2014-06-25
 @QQ群：176047195
 @Site：http://sentsin.com/layui/laydate
 
 */

; !
function(a) {
    var b = {
        path: "/static/css/dailystatement",
        defSkin: "default",
        format: "YYYY-MM-DD",
        min: "1900-01-01 00:00:00",
        max: "2099-12-31 23:59:59",
        isv: !1
    },
    c = {},
    d = document,
    e = "createElement",
    f = "getElementById",
    g = "getElementsByTagName",
    h = ["laydate_box", "laydate_void", "laydate_click", "LayDateSkin", "skins/", "/laydate.css","/laydate-skin.css"];
    a.laydate = function(b) {
        b = b || {};
        try {
            h.event = a.event ? a.event: laydate.caller.arguments[0]
        } catch(d) {}
        return c.run(b),
        laydate
    },
    laydate.v = "1.1",
    c.getPath = function() {
        var a = document.scripts,
        c = a[a.length - 1].src;
        return b.path ? b.path: c.substring(0, c.lastIndexOf("/") + 1)
    } (),
    c.use = function(a) {
        var f = d[e]("link");
        f.type = "text/css",
        f.rel = "stylesheet",
        f.href = c.getPath + a,
        a && (f.id = a),
        d[g]("head")[0].appendChild(f),
        f = null
    },
    c.trim = function(a) {
        return a = a || "",
        a.replace(/^\s|\s$/g, "").replace(/\s+/g, " ")
    },
    c.digit = function(a) {
        return 10 > a ? "0" + (0 | a) : a
    },
    c.stopmp = function(b) {
        return b = b || a.event,
        b.stopPropagation ? b.stopPropagation() : b.cancelBubble = !0,
        this
    },
    c.each = function(a, b) {
        for (var c = 0,
        d = a.length; d > c && b(c, a[c]) !== !1; c++);
    },
    c.hasClass = function(a, b) {
        return a = a || {},
        new RegExp("\\b" + b + "\\b").test(a.className)
    },
    c.addClass = function(a, b) {
        return a = a || {},
        c.hasClass(a, b) || (a.className += " " + b),
        a.className = c.trim(a.className),
        this
    },
    c.removeClass = function(a, b) {
        if (a = a || {},
        c.hasClass(a, b)) {
            var d = new RegExp("\\b" + b + "\\b");
            a.className = a.className.replace(d, "")
        }
        return this
    },
    c.removeCssAttr = function(a, b) {
        var c = a.style;
        c.removeProperty ? c.removeProperty(b) : c.removeAttribute(b)
    },
    c.shde = function(a, b) {
        a.style.display = b ? "none": "block"
    },
    c.query = function(a) {
        var e, b, h, i, j;
        return a = c.trim(a).split(" "),
        b = d[f](a[0].substr(1)),
        b ? a[1] ? /^\./.test(a[1]) ? (i = a[1].substr(1), j = new RegExp("\\b" + i + "\\b"), e = [], h = d.getElementsByClassName ? b.getElementsByClassName(i) : b[g]("*"), c.each(h,
        function(a, b) {
            j.test(b.className) && e.push(b)
        }), e[0] ? e: "") : (e = b[g](a[1]), e[0] ? b[g](a[1]) : "") : b: void 0
    },
    c.on = function(b, d, e) {
        return b.attachEvent ? b.attachEvent("on" + d,
        function() {
            e.call(b, a.even)
        }) : b.addEventListener(d, e, !1),
        c
    },
    c.stopMosup = function(a, b) {
        "mouseup" !== a && c.on(b, "mouseup",
        function(a) {
            c.stopmp(a)
        })
    },
    c.run = function(a) {
        var d, e, g, b = c.query,
        f = h.event;
        try {
            g = f.target || f.srcElement || {}
        } catch(i) {
            g = {}
        }
        if (d = a.elem ? b(a.elem) : g, f && g.tagName) {
            if (!d || d === c.elem) return;
            c.stopMosup(f.type, d),
            c.stopmp(f),
            c.view(d, a),
            c.reshow()
        } else e = a.event || "click",
        c.each((0 | d.length) > 0 ? d: [d],
        function(b, d) {
            c.stopMosup(e, d),
            c.on(d, e,
            function(b) {
                c.stopmp(b),
                d !== c.elem && (c.view(d, a), c.reshow())
            })
        })
    },
    c.scroll = function(a) {
        return a = a ? "scrollLeft": "scrollTop",
        d.body[a] | d.documentElement[a]
    },
    c.winarea = function(a) {
        return document.documentElement[a ? "clientWidth": "clientHeight"]
    },
    c.isleap = function(a) {
        return 0 === a % 4 && 0 !== a % 100 || 0 === a % 400
    },
    c.checkVoid = function(a, b, d) {
        var e = [];
        return a = 0 | a,
        b = 0 | b,
        d = 0 | d,
        a < c.mins[0] ? e = ["y"] : a > c.maxs[0] ? e = ["y", 1] : a >= c.mins[0] && a <= c.maxs[0] && (a == c.mins[0] && (b < c.mins[1] ? e = ["m"] : b == c.mins[1] && d < c.mins[2] && (e = ["d"])), a == c.maxs[0] && (b > c.maxs[1] ? e = ["m", 1] : b == c.maxs[1] && d > c.maxs[2] && (e = ["d", 1]))),
        e
    },
    c.timeVoid = function(a, b) {
        if (c.ymd[1] + 1 == c.mins[1] && c.ymd[2] == c.mins[2]) {
            if (0 === b && a < c.mins[3]) return 1;
            if (1 === b && a < c.mins[4]) return 1;
            if (2 === b && a < c.mins[5]) return 1
        } else if (c.ymd[1] + 1 == c.maxs[1] && c.ymd[2] == c.maxs[2]) {
            if (0 === b && a > c.maxs[3]) return 1;
            if (1 === b && a > c.maxs[4]) return 1;
            if (2 === b && a > c.maxs[5]) return 1
        }
        return a > (b ? 59 : 23) ? 1 : void 0
    },
    c.check = function() {
        var a = c.options.format.replace(/YYYY|MM|DD|hh|mm|ss/g, "\\d+\\").replace(/\\$/g, ""),
        b = new RegExp(a),
        d = c.elem[h.elemv],
        e = d.match(/\d+/g) || [],
        f = c.checkVoid(e[0], e[1], e[2]);
        if ("" !== d.replace(/\s/g, "")) {
            if (!b.test(d)) return c.elem[h.elemv] = "",
            c.msg("日期不符合格式，请重新选择。"),
            1;
            if (f[0]) return c.elem[h.elemv] = "",
            c.msg("日期不在有效期内，请重新选择。"),
            1;
            f.value = c.elem[h.elemv].match(b).join(),
            e = f.value.match(/\d+/g),
            e[1] < 1 ? (e[1] = 1, f.auto = 1) : e[1] > 12 ? (e[1] = 12, f.auto = 1) : e[1].length < 2 && (f.auto = 1),
            e[2] < 1 ? (e[2] = 1, f.auto = 1) : e[2] > c.months[(0 | e[1]) - 1] ? (e[2] = 31, f.auto = 1) : e[2].length < 2 && (f.auto = 1),
            e.length > 3 && (c.timeVoid(e[3], 0) && (f.auto = 1), c.timeVoid(e[4], 1) && (f.auto = 1), c.timeVoid(e[5], 2) && (f.auto = 1)),
            f.auto ? c.creation([e[0], 0 | e[1], 0 | e[2]], 1) : f.value !== c.elem[h.elemv] && (c.elem[h.elemv] = f.value)
        }
    },
    c.months = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    c.viewDate = function(a, b, d) {
        var f = (c.query, {}),
        g = new Date;
        a < (0 | c.mins[0]) && (a = 0 | c.mins[0]),
        a > (0 | c.maxs[0]) && (a = 0 | c.maxs[0]),
        g.setFullYear(a, b, d),
        f.ymd = [g.getFullYear(), g.getMonth(), g.getDate()],
        c.months[1] = c.isleap(f.ymd[0]) ? 29 : 28,
        g.setFullYear(f.ymd[0], f.ymd[1], 1),
        f.FDay = g.getDay(),
        f.PDay = c.months[0 === b ? 11 : b - 1] - f.FDay + 1,
        f.NDay = 1,
        c.each(h.tds,
        function(a, b) {
            var g, d = f.ymd[0],
            e = f.ymd[1] + 1;
            b.className = "",
            a < f.FDay ? (b.innerHTML = g = a + f.PDay, c.addClass(b, "laydate_nothis"), 1 === e && (d -= 1), e = 1 === e ? 12 : e - 1) : a >= f.FDay && a < f.FDay + c.months[f.ymd[1]] ? (b.innerHTML = g = a - f.FDay + 1, a - f.FDay + 1 === f.ymd[2] && (c.addClass(b, h[2]), f.thisDay = b)) : (b.innerHTML = g = f.NDay++, c.addClass(b, "laydate_nothis"), 12 === e && (d += 1), e = 12 === e ? 1 : e + 1),
            c.checkVoid(d, e, g)[0] && c.addClass(b, h[1]),
            c.options.festival && c.festival(b, e + "." + g),
            b.setAttribute("y", d),
            b.setAttribute("m", e),
            b.setAttribute("d", g),
            d = e = g = null
        }),
        c.valid = !c.hasClass(f.thisDay, h[1]),
        c.ymd = f.ymd,
        h.year.value = c.ymd[0] + "年",
        h.month.value = c.digit(c.ymd[1] + 1) + "月",
        c.each(h.mms,
        function(a, b) {
            var d = c.checkVoid(c.ymd[0], (0 | b.getAttribute("m")) + 1);
            "y" === d[0] || "m" === d[0] ? c.addClass(b, h[1]) : c.removeClass(b, h[1]),
            c.removeClass(b, h[2]),
            d = null
        }),
        c.addClass(h.mms[c.ymd[1]], h[2]),
        f.times = [0 | c.inymd[3] || 0, 0 | c.inymd[4] || 0, 0 | c.inymd[5] || 0],
        c.each(new Array(3),
        function(a) {
            c.hmsin[a].value = c.digit(c.timeVoid(f.times[a], a) ? 0 | c.mins[a + 3] : 0 | f.times[a])
        }),
        c[c.valid ? "removeClass": "addClass"](h.ok, h[1])
    },
    c.festival = function(a, b) {
        var c;
        switch (b) {
        case "1.1":
            c = "元旦";
            break;
        case "3.8":
            c = "妇女";
            break;
        case "4.5":
            c = "清明";
            break;
        case "5.1":
            c = "劳动";
            break;
        case "6.1":
            c = "儿童";
            break;
        case "9.10":
            c = "教师";
            break;
        case "10.1":
            c = "国庆"
        }
        c && (a.innerHTML = c),
        c = null
    },
    c.viewYears = function(a) {
        var b = c.query,
        d = "";
        c.each(new Array(14),
        function(b) {
            d += 7 === b ? "<li " + (parseInt(h.year.value) === a ? 'class="' + h[2] + '"': "") + ' y="' + a + '">' + a + "年</li>": '<li y="' + (a - 7 + b) + '">' + (a - 7 + b) + "年</li>"
        }),
        b("#laydate_ys").innerHTML = d,
        c.each(b("#laydate_ys li"),
        function(a, b) {
            "y" === c.checkVoid(b.getAttribute("y"))[0] ? c.addClass(b, h[1]) : c.on(b, "click",
            function(a) {
                c.stopmp(a).reshow(),
                c.viewDate(0 | this.getAttribute("y"), c.ymd[1], c.ymd[2])
            })
        })
    },
    c.initDate = function() {
        var d = (c.query, new Date),
        e = c.elem[h.elemv].match(/\d+/g) || [];
        e.length < 3 && (e = c.options.start.match(/\d+/g) || [], e.length < 3 && (e = [d.getFullYear(), d.getMonth() + 1, d.getDate()])),
        c.inymd = e,
        c.viewDate(e[0], e[1] - 1, e[2])
    },
    c.iswrite = function() {
        var a = c.query,
        b = {
            time: a("#laydate_hms")
        };
        c.shde(b.time, !c.options.istime),
        c.shde(h.oclear, !("isclear" in c.options ? c.options.isclear: 1)),
        c.shde(h.otoday, !("istoday" in c.options ? c.options.istoday: 1)),
        c.shde(h.ok, !("issure" in c.options ? c.options.issure: 1))
    },
    c.orien = function(a, b) {
        var d, e = c.elem.getBoundingClientRect();
        a.style.left = e.left + (b ? 0 : c.scroll(1)) + "px",
        d = e.bottom + a.offsetHeight / 1.5 <= c.winarea() ? e.bottom - 1 : e.top > a.offsetHeight / 1.5 ? e.top - a.offsetHeight + 1 : c.winarea() - a.offsetHeight,
        a.style.top = (d + (b ? 0 : c.scroll()))/2 + "px"
    },
    c.follow = function(a) {
        c.options.fixed ? (a.style.position = "fixed", c.orien(a, 1)) : (a.style.position = "absolute", c.orien(a))
    },
    c.viewtb = function() {
        var a, b = [],
        f = ["日", "一", "二", "三", "四", "五", "六"],
        h = {},
        i = d[e]("table"),
        j = d[e]("thead");
        return j.appendChild(d[e]("tr")),
        h.creath = function(a) {
            var b = d[e]("th");
            b.innerHTML = f[a],
            j[g]("tr")[0].appendChild(b),
            b = null
        },
        c.each(new Array(6),
        function(d) {
            b.push([]),
            a = i.insertRow(0),
            c.each(new Array(7),
            function(c) {
                b[d][c] = 0,
                0 === d && h.creath(c),
                a.insertCell(c)
            })
        }),
        i.insertBefore(j, i.children[0]),
        i.id = i.className = "laydate_table",
        a = b = null,
        i.outerHTML.toLowerCase()
    } (),
    c.view = function(a, f) {
        var i, g = c.query,
        j = {};
        f = f || a,
        c.elem = a,
        c.options = f,
        c.options.format || (c.options.format = b.format),
        c.options.start = c.options.start || "",
        c.mm = j.mm = [c.options.min || b.min, c.options.max || b.max],
        c.mins = j.mm[0].match(/\d+/g),
        c.maxs = j.mm[1].match(/\d+/g),
        h.elemv = /textarea|input/.test(c.elem.tagName.toLocaleLowerCase()) ? "value": "innerHTML",
        c.box ? c.shde(c.box) : (i = d[e]("div"), i.id = h[0], i.className = h[0], i.style.cssText = "position: absolute;", i.setAttribute("name", "laydate-v" + laydate.v), i.innerHTML = j.html = '<div class="laydate_top"><div class="laydate_ym laydate_y" id="laydate_YY"><a class="laydate_choose laydate_chprev laydate_tab"><cite></cite></a><input id="laydate_y" readonly><label></label><a class="laydate_choose laydate_chnext laydate_tab"><cite></cite></a><div class="laydate_yms"><a class="laydate_tab laydate_chtop"><cite></cite></a><ul id="laydate_ys"></ul><a class="laydate_tab laydate_chdown"><cite></cite></a></div></div><div class="laydate_ym laydate_m" id="laydate_MM"><a class="laydate_choose laydate_chprev laydate_tab"><cite></cite></a><input id="laydate_m" readonly><label></label><a class="laydate_choose laydate_chnext laydate_tab"><cite></cite></a><div class="laydate_yms" id="laydate_ms">' +
        function() {
            var a = "";
            return c.each(new Array(12),
            function(b) {
                a += '<span m="' + b + '">' + c.digit(b + 1) + "月</span>"
            }),
            a
        } () + "</div>" + "</div>" + "</div>" + c.viewtb + '<div class="laydate_bottom">' + '<ul id="laydate_hms">' + '<li class="laydate_sj">时间</li>' + "<li><input readonly>:</li>" + "<li><input readonly>:</li>" + "<li><input readonly></li>" + "</ul>" + '<div class="laydate_time" id="laydate_time"></div>' + '<div class="laydate_btn">' + '<a id="laydate_clear">清空</a>' + '<a id="laydate_today">今天</a>' + '<a id="laydate_ok">确认</a>' + "</div>" + (b.isv ? '<a href="http://sentsin.com/layui/laydate/" class="laydate_v" target="_blank">laydate-v' + laydate.v + "</a>": "") + "</div>", d.body.appendChild(i), c.box = g("#" + h[0]), c.events(), i = null),
        c.follow(c.box),
        f.zIndex ? c.box.style.zIndex = f.zIndex: c.removeCssAttr(c.box, "z-index"),
        c.stopMosup("click", c.box),
        c.initDate(),
        c.iswrite(),
        c.check()
    },
    c.reshow = function() {
        return c.each(c.query("#" + h[0] + " .laydate_show"),
        function(a, b) {
            c.removeClass(b, "laydate_show")
        }),
        this
    },
    c.close = function() {
        c.reshow(),
        c.shde(c.query("#" + h[0]), 1),
        c.elem = null
    },
    c.parse = function(a, d, e) {
        return a = a.concat(d),
        e = e || (c.options ? c.options.format: b.format),
        e.replace(/YYYY|MM|DD|hh|mm|ss/g,
        function() {
            return a.index = 0 | ++a.index,
            c.digit(a[a.index])
        })
    },
    c.creation = function(a, b) {
        var e = (c.query, c.hmsin),
        f = c.parse(a, [e[0].value, e[1].value, e[2].value]);
        c.elem[h.elemv] = f,
        b || (c.close(), "function" == typeof c.options.choose && c.options.choose(f))
    },
    c.events = function() {
        var b = c.query,
        e = {
            box: "#" + h[0]
        };
        c.addClass(d.body, "laydate_body"),
        h.tds = b("#laydate_table td"),
        h.mms = b("#laydate_ms span"),
        h.year = b("#laydate_y"),
        h.month = b("#laydate_m"),
        c.each(b(e.box + " .laydate_ym"),
        function(a, b) {
            c.on(b, "click",
            function(b) {
                c.stopmp(b).reshow(),
                c.addClass(this[g]("div")[0], "laydate_show"),
                a || (e.YY = parseInt(h.year.value), c.viewYears(e.YY))
            })
        }),
        c.on(b(e.box), "click",
        function() {
            c.reshow()
        }),
        e.tabYear = function(a) {
            0 === a ? c.ymd[0]--:1 === a ? c.ymd[0]++:2 === a ? e.YY -= 14 : e.YY += 14,
            2 > a ? (c.viewDate(c.ymd[0], c.ymd[1], c.ymd[2]), c.reshow()) : c.viewYears(e.YY)
        },
        c.each(b("#laydate_YY .laydate_tab"),
        function(a, b) {
            c.on(b, "click",
            function(b) {
                c.stopmp(b),
                e.tabYear(a)
            })
        }),
        e.tabMonth = function(a) {
            a ? (c.ymd[1]++, 12 === c.ymd[1] && (c.ymd[0]++, c.ymd[1] = 0)) : (c.ymd[1]--, -1 === c.ymd[1] && (c.ymd[0]--, c.ymd[1] = 11)),
            c.viewDate(c.ymd[0], c.ymd[1], c.ymd[2])
        },
        c.each(b("#laydate_MM .laydate_tab"),
        function(a, b) {
            c.on(b, "click",
            function(b) {
                c.stopmp(b).reshow(),
                e.tabMonth(a)
            })
        }),
        c.each(b("#laydate_ms span"),
        function(a, b) {
            c.on(b, "click",
            function(a) {
                c.stopmp(a).reshow(),
                c.hasClass(this, h[1]) || c.viewDate(c.ymd[0], 0 | this.getAttribute("m"), c.ymd[2])
            })
        }),
        c.each(b("#laydate_table td"),
        function(a, b) {
            c.on(b, "click",
            function(a) {
                c.hasClass(this, h[1]) || (c.stopmp(a), c.creation([0 | this.getAttribute("y"), 0 | this.getAttribute("m"), 0 | this.getAttribute("d")]))
            })
        }),
        h.oclear = b("#laydate_clear"),
        c.on(h.oclear, "click",
        function() {
            c.elem[h.elemv] = "",
            c.close()
        }),
        h.otoday = b("#laydate_today"),
        c.on(h.otoday, "click",
        function() {
            c.elem[h.elemv] = laydate.now(0, c.options.format),
            c.close()
        }),
        h.ok = b("#laydate_ok"),
        c.on(h.ok, "click",
        function() {
            c.valid && c.creation([c.ymd[0], c.ymd[1] + 1, c.ymd[2]])
        }),
        e.times = b("#laydate_time"),
        c.hmsin = e.hmsin = b("#laydate_hms input"),
        e.hmss = ["小时", "分钟", "秒数"],
        e.hmsarr = [],
        c.msg = function(a, d) {
            var f = '<div class="laydte_hsmtex">' + (d || "提示") + "<span>×</span></div>";
            "string" == typeof a ? (f += "<p>" + a + "</p>", c.shde(b("#" + h[0])), c.removeClass(e.times, "laydate_time1").addClass(e.times, "laydate_msg")) : (e.hmsarr[a] ? f = e.hmsarr[a] : (f += '<div id="laydate_hmsno" class="laydate_hmsno">', c.each(new Array(0 === a ? 24 : 60),
            function(a) {
                f += "<span>" + a + "</span>"
            }), f += "</div>", e.hmsarr[a] = f), c.removeClass(e.times, "laydate_msg"), c[0 === a ? "removeClass": "addClass"](e.times, "laydate_time1")),
            c.addClass(e.times, "laydate_show"),
            e.times.innerHTML = f
        },
        e.hmson = function(a, d) {
            var e = b("#laydate_hmsno span"),
            f = c.valid ? null: 1;
            c.each(e,
            function(b, e) {
                f ? c.addClass(e, h[1]) : c.timeVoid(b, d) ? c.addClass(e, h[1]) : c.on(e, "click",
                function() {
                    c.hasClass(this, h[1]) || (a.value = c.digit(0 | this.innerHTML))
                })
            }),
            c.addClass(e[0 | a.value], "laydate_click")
        },
        c.each(e.hmsin,
        function(a, b) {
            c.on(b, "click",
            function(b) {
                c.stopmp(b).reshow(),
                c.msg(a, e.hmss[a]),
                e.hmson(this, a)
            })
        }),
        c.on(d, "mouseup",
        function() {
            var a = b("#" + h[0]);
            a && "none" !== a.style.display && (c.check() || c.close())
        }).on(d, "keydown",
        function(b) {
            b = b || a.event;
            var d = b.keyCode;
            13 === d && c.creation([c.ymd[0], c.ymd[1] + 1, c.ymd[2]])
        })
    },
    c.init = function() {
        c.use(h[5]),
        c.use(h[6]),
        c.skinLink = c.query("#" + h[3])
    } (),
    laydate.reset = function() {
        c.box && c.elem && c.follow(c.box)
    },
    laydate.now = function(a, b) {
        var d = new Date(0 | a ?
        function(a) {
            return 864e5 > a ? +new Date + 864e5 * a: a
        } (parseInt(a)) : +new Date);
        return c.parse([d.getFullYear(), d.getMonth() + 1, d.getDate()], [d.getHours(), d.getMinutes(), d.getSeconds()], b)
    },
    laydate.skin = function(a) {
        c.skinLink.href = c.getPath + h[5]
    }
} (window);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkYWlseXN0YXRlbWVudC9sYXlkYXRlL2xheWRhdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiBcclxuIEBOYW1lIDogbGF5RGF0ZSB2MS4xIOaXpeacn+aOp+S7tlxyXG4gQEF1dGhvcjog6LSk5b+DXHJcbiBARGF0ZTogMjAxNC0wNi0yNVxyXG4gQFFR576k77yaMTc2MDQ3MTk1XHJcbiBAU2l0Ze+8mmh0dHA6Ly9zZW50c2luLmNvbS9sYXl1aS9sYXlkYXRlXHJcbiBcclxuICovXHJcblxyXG47ICFcclxuZnVuY3Rpb24oYSkge1xyXG4gICAgdmFyIGIgPSB7XHJcbiAgICAgICAgcGF0aDogXCIvc3RhdGljL2Nzcy9kYWlseXN0YXRlbWVudFwiLFxyXG4gICAgICAgIGRlZlNraW46IFwiZGVmYXVsdFwiLFxyXG4gICAgICAgIGZvcm1hdDogXCJZWVlZLU1NLUREXCIsXHJcbiAgICAgICAgbWluOiBcIjE5MDAtMDEtMDEgMDA6MDA6MDBcIixcclxuICAgICAgICBtYXg6IFwiMjA5OS0xMi0zMSAyMzo1OTo1OVwiLFxyXG4gICAgICAgIGlzdjogITFcclxuICAgIH0sXHJcbiAgICBjID0ge30sXHJcbiAgICBkID0gZG9jdW1lbnQsXHJcbiAgICBlID0gXCJjcmVhdGVFbGVtZW50XCIsXHJcbiAgICBmID0gXCJnZXRFbGVtZW50QnlJZFwiLFxyXG4gICAgZyA9IFwiZ2V0RWxlbWVudHNCeVRhZ05hbWVcIixcclxuICAgIGggPSBbXCJsYXlkYXRlX2JveFwiLCBcImxheWRhdGVfdm9pZFwiLCBcImxheWRhdGVfY2xpY2tcIiwgXCJMYXlEYXRlU2tpblwiLCBcInNraW5zL1wiLCBcIi9sYXlkYXRlLmNzc1wiLFwiL2xheWRhdGUtc2tpbi5jc3NcIl07XHJcbiAgICBhLmxheWRhdGUgPSBmdW5jdGlvbihiKSB7XHJcbiAgICAgICAgYiA9IGIgfHwge307XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaC5ldmVudCA9IGEuZXZlbnQgPyBhLmV2ZW50OiBsYXlkYXRlLmNhbGxlci5hcmd1bWVudHNbMF1cclxuICAgICAgICB9IGNhdGNoKGQpIHt9XHJcbiAgICAgICAgcmV0dXJuIGMucnVuKGIpLFxyXG4gICAgICAgIGxheWRhdGVcclxuICAgIH0sXHJcbiAgICBsYXlkYXRlLnYgPSBcIjEuMVwiLFxyXG4gICAgYy5nZXRQYXRoID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGEgPSBkb2N1bWVudC5zY3JpcHRzLFxyXG4gICAgICAgIGMgPSBhW2EubGVuZ3RoIC0gMV0uc3JjO1xyXG4gICAgICAgIHJldHVybiBiLnBhdGggPyBiLnBhdGg6IGMuc3Vic3RyaW5nKDAsIGMubGFzdEluZGV4T2YoXCIvXCIpICsgMSlcclxuICAgIH0gKCksXHJcbiAgICBjLnVzZSA9IGZ1bmN0aW9uKGEpIHtcclxuICAgICAgICB2YXIgZiA9IGRbZV0oXCJsaW5rXCIpO1xyXG4gICAgICAgIGYudHlwZSA9IFwidGV4dC9jc3NcIixcclxuICAgICAgICBmLnJlbCA9IFwic3R5bGVzaGVldFwiLFxyXG4gICAgICAgIGYuaHJlZiA9IGMuZ2V0UGF0aCArIGEsXHJcbiAgICAgICAgYSAmJiAoZi5pZCA9IGEpLFxyXG4gICAgICAgIGRbZ10oXCJoZWFkXCIpWzBdLmFwcGVuZENoaWxkKGYpLFxyXG4gICAgICAgIGYgPSBudWxsXHJcbiAgICB9LFxyXG4gICAgYy50cmltID0gZnVuY3Rpb24oYSkge1xyXG4gICAgICAgIHJldHVybiBhID0gYSB8fCBcIlwiLFxyXG4gICAgICAgIGEucmVwbGFjZSgvXlxcc3xcXHMkL2csIFwiXCIpLnJlcGxhY2UoL1xccysvZywgXCIgXCIpXHJcbiAgICB9LFxyXG4gICAgYy5kaWdpdCA9IGZ1bmN0aW9uKGEpIHtcclxuICAgICAgICByZXR1cm4gMTAgPiBhID8gXCIwXCIgKyAoMCB8IGEpIDogYVxyXG4gICAgfSxcclxuICAgIGMuc3RvcG1wID0gZnVuY3Rpb24oYikge1xyXG4gICAgICAgIHJldHVybiBiID0gYiB8fCBhLmV2ZW50LFxyXG4gICAgICAgIGIuc3RvcFByb3BhZ2F0aW9uID8gYi5zdG9wUHJvcGFnYXRpb24oKSA6IGIuY2FuY2VsQnViYmxlID0gITAsXHJcbiAgICAgICAgdGhpc1xyXG4gICAgfSxcclxuICAgIGMuZWFjaCA9IGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICBmb3IgKHZhciBjID0gMCxcclxuICAgICAgICBkID0gYS5sZW5ndGg7IGQgPiBjICYmIGIoYywgYVtjXSkgIT09ICExOyBjKyspO1xyXG4gICAgfSxcclxuICAgIGMuaGFzQ2xhc3MgPSBmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgcmV0dXJuIGEgPSBhIHx8IHt9LFxyXG4gICAgICAgIG5ldyBSZWdFeHAoXCJcXFxcYlwiICsgYiArIFwiXFxcXGJcIikudGVzdChhLmNsYXNzTmFtZSlcclxuICAgIH0sXHJcbiAgICBjLmFkZENsYXNzID0gZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgIHJldHVybiBhID0gYSB8fCB7fSxcclxuICAgICAgICBjLmhhc0NsYXNzKGEsIGIpIHx8IChhLmNsYXNzTmFtZSArPSBcIiBcIiArIGIpLFxyXG4gICAgICAgIGEuY2xhc3NOYW1lID0gYy50cmltKGEuY2xhc3NOYW1lKSxcclxuICAgICAgICB0aGlzXHJcbiAgICB9LFxyXG4gICAgYy5yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICBpZiAoYSA9IGEgfHwge30sXHJcbiAgICAgICAgYy5oYXNDbGFzcyhhLCBiKSkge1xyXG4gICAgICAgICAgICB2YXIgZCA9IG5ldyBSZWdFeHAoXCJcXFxcYlwiICsgYiArIFwiXFxcXGJcIik7XHJcbiAgICAgICAgICAgIGEuY2xhc3NOYW1lID0gYS5jbGFzc05hbWUucmVwbGFjZShkLCBcIlwiKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfSxcclxuICAgIGMucmVtb3ZlQ3NzQXR0ciA9IGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICB2YXIgYyA9IGEuc3R5bGU7XHJcbiAgICAgICAgYy5yZW1vdmVQcm9wZXJ0eSA/IGMucmVtb3ZlUHJvcGVydHkoYikgOiBjLnJlbW92ZUF0dHJpYnV0ZShiKVxyXG4gICAgfSxcclxuICAgIGMuc2hkZSA9IGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICBhLnN0eWxlLmRpc3BsYXkgPSBiID8gXCJub25lXCI6IFwiYmxvY2tcIlxyXG4gICAgfSxcclxuICAgIGMucXVlcnkgPSBmdW5jdGlvbihhKSB7XHJcbiAgICAgICAgdmFyIGUsIGIsIGgsIGksIGo7XHJcbiAgICAgICAgcmV0dXJuIGEgPSBjLnRyaW0oYSkuc3BsaXQoXCIgXCIpLFxyXG4gICAgICAgIGIgPSBkW2ZdKGFbMF0uc3Vic3RyKDEpKSxcclxuICAgICAgICBiID8gYVsxXSA/IC9eXFwuLy50ZXN0KGFbMV0pID8gKGkgPSBhWzFdLnN1YnN0cigxKSwgaiA9IG5ldyBSZWdFeHAoXCJcXFxcYlwiICsgaSArIFwiXFxcXGJcIiksIGUgPSBbXSwgaCA9IGQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSA/IGIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShpKSA6IGJbZ10oXCIqXCIpLCBjLmVhY2goaCxcclxuICAgICAgICBmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgICAgIGoudGVzdChiLmNsYXNzTmFtZSkgJiYgZS5wdXNoKGIpXHJcbiAgICAgICAgfSksIGVbMF0gPyBlOiBcIlwiKSA6IChlID0gYltnXShhWzFdKSwgZVswXSA/IGJbZ10oYVsxXSkgOiBcIlwiKSA6IGI6IHZvaWQgMFxyXG4gICAgfSxcclxuICAgIGMub24gPSBmdW5jdGlvbihiLCBkLCBlKSB7XHJcbiAgICAgICAgcmV0dXJuIGIuYXR0YWNoRXZlbnQgPyBiLmF0dGFjaEV2ZW50KFwib25cIiArIGQsXHJcbiAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGUuY2FsbChiLCBhLmV2ZW4pXHJcbiAgICAgICAgfSkgOiBiLmFkZEV2ZW50TGlzdGVuZXIoZCwgZSwgITEpLFxyXG4gICAgICAgIGNcclxuICAgIH0sXHJcbiAgICBjLnN0b3BNb3N1cCA9IGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICBcIm1vdXNldXBcIiAhPT0gYSAmJiBjLm9uKGIsIFwibW91c2V1cFwiLFxyXG4gICAgICAgIGZ1bmN0aW9uKGEpIHtcclxuICAgICAgICAgICAgYy5zdG9wbXAoYSlcclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuICAgIGMucnVuID0gZnVuY3Rpb24oYSkge1xyXG4gICAgICAgIHZhciBkLCBlLCBnLCBiID0gYy5xdWVyeSxcclxuICAgICAgICBmID0gaC5ldmVudDtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBnID0gZi50YXJnZXQgfHwgZi5zcmNFbGVtZW50IHx8IHt9XHJcbiAgICAgICAgfSBjYXRjaChpKSB7XHJcbiAgICAgICAgICAgIGcgPSB7fVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZCA9IGEuZWxlbSA/IGIoYS5lbGVtKSA6IGcsIGYgJiYgZy50YWdOYW1lKSB7XHJcbiAgICAgICAgICAgIGlmICghZCB8fCBkID09PSBjLmVsZW0pIHJldHVybjtcclxuICAgICAgICAgICAgYy5zdG9wTW9zdXAoZi50eXBlLCBkKSxcclxuICAgICAgICAgICAgYy5zdG9wbXAoZiksXHJcbiAgICAgICAgICAgIGMudmlldyhkLCBhKSxcclxuICAgICAgICAgICAgYy5yZXNob3coKVxyXG4gICAgICAgIH0gZWxzZSBlID0gYS5ldmVudCB8fCBcImNsaWNrXCIsXHJcbiAgICAgICAgYy5lYWNoKCgwIHwgZC5sZW5ndGgpID4gMCA/IGQ6IFtkXSxcclxuICAgICAgICBmdW5jdGlvbihiLCBkKSB7XHJcbiAgICAgICAgICAgIGMuc3RvcE1vc3VwKGUsIGQpLFxyXG4gICAgICAgICAgICBjLm9uKGQsIGUsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKGIpIHtcclxuICAgICAgICAgICAgICAgIGMuc3RvcG1wKGIpLFxyXG4gICAgICAgICAgICAgICAgZCAhPT0gYy5lbGVtICYmIChjLnZpZXcoZCwgYSksIGMucmVzaG93KCkpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBjLnNjcm9sbCA9IGZ1bmN0aW9uKGEpIHtcclxuICAgICAgICByZXR1cm4gYSA9IGEgPyBcInNjcm9sbExlZnRcIjogXCJzY3JvbGxUb3BcIixcclxuICAgICAgICBkLmJvZHlbYV0gfCBkLmRvY3VtZW50RWxlbWVudFthXVxyXG4gICAgfSxcclxuICAgIGMud2luYXJlYSA9IGZ1bmN0aW9uKGEpIHtcclxuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50W2EgPyBcImNsaWVudFdpZHRoXCI6IFwiY2xpZW50SGVpZ2h0XCJdXHJcbiAgICB9LFxyXG4gICAgYy5pc2xlYXAgPSBmdW5jdGlvbihhKSB7XHJcbiAgICAgICAgcmV0dXJuIDAgPT09IGEgJSA0ICYmIDAgIT09IGEgJSAxMDAgfHwgMCA9PT0gYSAlIDQwMFxyXG4gICAgfSxcclxuICAgIGMuY2hlY2tWb2lkID0gZnVuY3Rpb24oYSwgYiwgZCkge1xyXG4gICAgICAgIHZhciBlID0gW107XHJcbiAgICAgICAgcmV0dXJuIGEgPSAwIHwgYSxcclxuICAgICAgICBiID0gMCB8IGIsXHJcbiAgICAgICAgZCA9IDAgfCBkLFxyXG4gICAgICAgIGEgPCBjLm1pbnNbMF0gPyBlID0gW1wieVwiXSA6IGEgPiBjLm1heHNbMF0gPyBlID0gW1wieVwiLCAxXSA6IGEgPj0gYy5taW5zWzBdICYmIGEgPD0gYy5tYXhzWzBdICYmIChhID09IGMubWluc1swXSAmJiAoYiA8IGMubWluc1sxXSA/IGUgPSBbXCJtXCJdIDogYiA9PSBjLm1pbnNbMV0gJiYgZCA8IGMubWluc1syXSAmJiAoZSA9IFtcImRcIl0pKSwgYSA9PSBjLm1heHNbMF0gJiYgKGIgPiBjLm1heHNbMV0gPyBlID0gW1wibVwiLCAxXSA6IGIgPT0gYy5tYXhzWzFdICYmIGQgPiBjLm1heHNbMl0gJiYgKGUgPSBbXCJkXCIsIDFdKSkpLFxyXG4gICAgICAgIGVcclxuICAgIH0sXHJcbiAgICBjLnRpbWVWb2lkID0gZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgIGlmIChjLnltZFsxXSArIDEgPT0gYy5taW5zWzFdICYmIGMueW1kWzJdID09IGMubWluc1syXSkge1xyXG4gICAgICAgICAgICBpZiAoMCA9PT0gYiAmJiBhIDwgYy5taW5zWzNdKSByZXR1cm4gMTtcclxuICAgICAgICAgICAgaWYgKDEgPT09IGIgJiYgYSA8IGMubWluc1s0XSkgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIGlmICgyID09PSBiICYmIGEgPCBjLm1pbnNbNV0pIHJldHVybiAxXHJcbiAgICAgICAgfSBlbHNlIGlmIChjLnltZFsxXSArIDEgPT0gYy5tYXhzWzFdICYmIGMueW1kWzJdID09IGMubWF4c1syXSkge1xyXG4gICAgICAgICAgICBpZiAoMCA9PT0gYiAmJiBhID4gYy5tYXhzWzNdKSByZXR1cm4gMTtcclxuICAgICAgICAgICAgaWYgKDEgPT09IGIgJiYgYSA+IGMubWF4c1s0XSkgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIGlmICgyID09PSBiICYmIGEgPiBjLm1heHNbNV0pIHJldHVybiAxXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhID4gKGIgPyA1OSA6IDIzKSA/IDEgOiB2b2lkIDBcclxuICAgIH0sXHJcbiAgICBjLmNoZWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGEgPSBjLm9wdGlvbnMuZm9ybWF0LnJlcGxhY2UoL1lZWVl8TU18RER8aGh8bW18c3MvZywgXCJcXFxcZCtcXFxcXCIpLnJlcGxhY2UoL1xcXFwkL2csIFwiXCIpLFxyXG4gICAgICAgIGIgPSBuZXcgUmVnRXhwKGEpLFxyXG4gICAgICAgIGQgPSBjLmVsZW1baC5lbGVtdl0sXHJcbiAgICAgICAgZSA9IGQubWF0Y2goL1xcZCsvZykgfHwgW10sXHJcbiAgICAgICAgZiA9IGMuY2hlY2tWb2lkKGVbMF0sIGVbMV0sIGVbMl0pO1xyXG4gICAgICAgIGlmIChcIlwiICE9PSBkLnJlcGxhY2UoL1xccy9nLCBcIlwiKSkge1xyXG4gICAgICAgICAgICBpZiAoIWIudGVzdChkKSkgcmV0dXJuIGMuZWxlbVtoLmVsZW12XSA9IFwiXCIsXHJcbiAgICAgICAgICAgIGMubXNnKFwi5pel5pyf5LiN56ym5ZCI5qC85byP77yM6K+36YeN5paw6YCJ5oup44CCXCIpLFxyXG4gICAgICAgICAgICAxO1xyXG4gICAgICAgICAgICBpZiAoZlswXSkgcmV0dXJuIGMuZWxlbVtoLmVsZW12XSA9IFwiXCIsXHJcbiAgICAgICAgICAgIGMubXNnKFwi5pel5pyf5LiN5Zyo5pyJ5pWI5pyf5YaF77yM6K+36YeN5paw6YCJ5oup44CCXCIpLFxyXG4gICAgICAgICAgICAxO1xyXG4gICAgICAgICAgICBmLnZhbHVlID0gYy5lbGVtW2guZWxlbXZdLm1hdGNoKGIpLmpvaW4oKSxcclxuICAgICAgICAgICAgZSA9IGYudmFsdWUubWF0Y2goL1xcZCsvZyksXHJcbiAgICAgICAgICAgIGVbMV0gPCAxID8gKGVbMV0gPSAxLCBmLmF1dG8gPSAxKSA6IGVbMV0gPiAxMiA/IChlWzFdID0gMTIsIGYuYXV0byA9IDEpIDogZVsxXS5sZW5ndGggPCAyICYmIChmLmF1dG8gPSAxKSxcclxuICAgICAgICAgICAgZVsyXSA8IDEgPyAoZVsyXSA9IDEsIGYuYXV0byA9IDEpIDogZVsyXSA+IGMubW9udGhzWygwIHwgZVsxXSkgLSAxXSA/IChlWzJdID0gMzEsIGYuYXV0byA9IDEpIDogZVsyXS5sZW5ndGggPCAyICYmIChmLmF1dG8gPSAxKSxcclxuICAgICAgICAgICAgZS5sZW5ndGggPiAzICYmIChjLnRpbWVWb2lkKGVbM10sIDApICYmIChmLmF1dG8gPSAxKSwgYy50aW1lVm9pZChlWzRdLCAxKSAmJiAoZi5hdXRvID0gMSksIGMudGltZVZvaWQoZVs1XSwgMikgJiYgKGYuYXV0byA9IDEpKSxcclxuICAgICAgICAgICAgZi5hdXRvID8gYy5jcmVhdGlvbihbZVswXSwgMCB8IGVbMV0sIDAgfCBlWzJdXSwgMSkgOiBmLnZhbHVlICE9PSBjLmVsZW1baC5lbGVtdl0gJiYgKGMuZWxlbVtoLmVsZW12XSA9IGYudmFsdWUpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGMubW9udGhzID0gWzMxLCBudWxsLCAzMSwgMzAsIDMxLCAzMCwgMzEsIDMxLCAzMCwgMzEsIDMwLCAzMV0sXHJcbiAgICBjLnZpZXdEYXRlID0gZnVuY3Rpb24oYSwgYiwgZCkge1xyXG4gICAgICAgIHZhciBmID0gKGMucXVlcnksIHt9KSxcclxuICAgICAgICBnID0gbmV3IERhdGU7XHJcbiAgICAgICAgYSA8ICgwIHwgYy5taW5zWzBdKSAmJiAoYSA9IDAgfCBjLm1pbnNbMF0pLFxyXG4gICAgICAgIGEgPiAoMCB8IGMubWF4c1swXSkgJiYgKGEgPSAwIHwgYy5tYXhzWzBdKSxcclxuICAgICAgICBnLnNldEZ1bGxZZWFyKGEsIGIsIGQpLFxyXG4gICAgICAgIGYueW1kID0gW2cuZ2V0RnVsbFllYXIoKSwgZy5nZXRNb250aCgpLCBnLmdldERhdGUoKV0sXHJcbiAgICAgICAgYy5tb250aHNbMV0gPSBjLmlzbGVhcChmLnltZFswXSkgPyAyOSA6IDI4LFxyXG4gICAgICAgIGcuc2V0RnVsbFllYXIoZi55bWRbMF0sIGYueW1kWzFdLCAxKSxcclxuICAgICAgICBmLkZEYXkgPSBnLmdldERheSgpLFxyXG4gICAgICAgIGYuUERheSA9IGMubW9udGhzWzAgPT09IGIgPyAxMSA6IGIgLSAxXSAtIGYuRkRheSArIDEsXHJcbiAgICAgICAgZi5ORGF5ID0gMSxcclxuICAgICAgICBjLmVhY2goaC50ZHMsXHJcbiAgICAgICAgZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgICAgICB2YXIgZywgZCA9IGYueW1kWzBdLFxyXG4gICAgICAgICAgICBlID0gZi55bWRbMV0gKyAxO1xyXG4gICAgICAgICAgICBiLmNsYXNzTmFtZSA9IFwiXCIsXHJcbiAgICAgICAgICAgIGEgPCBmLkZEYXkgPyAoYi5pbm5lckhUTUwgPSBnID0gYSArIGYuUERheSwgYy5hZGRDbGFzcyhiLCBcImxheWRhdGVfbm90aGlzXCIpLCAxID09PSBlICYmIChkIC09IDEpLCBlID0gMSA9PT0gZSA/IDEyIDogZSAtIDEpIDogYSA+PSBmLkZEYXkgJiYgYSA8IGYuRkRheSArIGMubW9udGhzW2YueW1kWzFdXSA/IChiLmlubmVySFRNTCA9IGcgPSBhIC0gZi5GRGF5ICsgMSwgYSAtIGYuRkRheSArIDEgPT09IGYueW1kWzJdICYmIChjLmFkZENsYXNzKGIsIGhbMl0pLCBmLnRoaXNEYXkgPSBiKSkgOiAoYi5pbm5lckhUTUwgPSBnID0gZi5ORGF5KyssIGMuYWRkQ2xhc3MoYiwgXCJsYXlkYXRlX25vdGhpc1wiKSwgMTIgPT09IGUgJiYgKGQgKz0gMSksIGUgPSAxMiA9PT0gZSA/IDEgOiBlICsgMSksXHJcbiAgICAgICAgICAgIGMuY2hlY2tWb2lkKGQsIGUsIGcpWzBdICYmIGMuYWRkQ2xhc3MoYiwgaFsxXSksXHJcbiAgICAgICAgICAgIGMub3B0aW9ucy5mZXN0aXZhbCAmJiBjLmZlc3RpdmFsKGIsIGUgKyBcIi5cIiArIGcpLFxyXG4gICAgICAgICAgICBiLnNldEF0dHJpYnV0ZShcInlcIiwgZCksXHJcbiAgICAgICAgICAgIGIuc2V0QXR0cmlidXRlKFwibVwiLCBlKSxcclxuICAgICAgICAgICAgYi5zZXRBdHRyaWJ1dGUoXCJkXCIsIGcpLFxyXG4gICAgICAgICAgICBkID0gZSA9IGcgPSBudWxsXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgYy52YWxpZCA9ICFjLmhhc0NsYXNzKGYudGhpc0RheSwgaFsxXSksXHJcbiAgICAgICAgYy55bWQgPSBmLnltZCxcclxuICAgICAgICBoLnllYXIudmFsdWUgPSBjLnltZFswXSArIFwi5bm0XCIsXHJcbiAgICAgICAgaC5tb250aC52YWx1ZSA9IGMuZGlnaXQoYy55bWRbMV0gKyAxKSArIFwi5pyIXCIsXHJcbiAgICAgICAgYy5lYWNoKGgubW1zLFxyXG4gICAgICAgIGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICAgICAgdmFyIGQgPSBjLmNoZWNrVm9pZChjLnltZFswXSwgKDAgfCBiLmdldEF0dHJpYnV0ZShcIm1cIikpICsgMSk7XHJcbiAgICAgICAgICAgIFwieVwiID09PSBkWzBdIHx8IFwibVwiID09PSBkWzBdID8gYy5hZGRDbGFzcyhiLCBoWzFdKSA6IGMucmVtb3ZlQ2xhc3MoYiwgaFsxXSksXHJcbiAgICAgICAgICAgIGMucmVtb3ZlQ2xhc3MoYiwgaFsyXSksXHJcbiAgICAgICAgICAgIGQgPSBudWxsXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgYy5hZGRDbGFzcyhoLm1tc1tjLnltZFsxXV0sIGhbMl0pLFxyXG4gICAgICAgIGYudGltZXMgPSBbMCB8IGMuaW55bWRbM10gfHwgMCwgMCB8IGMuaW55bWRbNF0gfHwgMCwgMCB8IGMuaW55bWRbNV0gfHwgMF0sXHJcbiAgICAgICAgYy5lYWNoKG5ldyBBcnJheSgzKSxcclxuICAgICAgICBmdW5jdGlvbihhKSB7XHJcbiAgICAgICAgICAgIGMuaG1zaW5bYV0udmFsdWUgPSBjLmRpZ2l0KGMudGltZVZvaWQoZi50aW1lc1thXSwgYSkgPyAwIHwgYy5taW5zW2EgKyAzXSA6IDAgfCBmLnRpbWVzW2FdKVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGNbYy52YWxpZCA/IFwicmVtb3ZlQ2xhc3NcIjogXCJhZGRDbGFzc1wiXShoLm9rLCBoWzFdKVxyXG4gICAgfSxcclxuICAgIGMuZmVzdGl2YWwgPSBmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgdmFyIGM7XHJcbiAgICAgICAgc3dpdGNoIChiKSB7XHJcbiAgICAgICAgY2FzZSBcIjEuMVwiOlxyXG4gICAgICAgICAgICBjID0gXCLlhYPml6ZcIjtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIjMuOFwiOlxyXG4gICAgICAgICAgICBjID0gXCLlpoflpbNcIjtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIjQuNVwiOlxyXG4gICAgICAgICAgICBjID0gXCLmuIXmmI5cIjtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIjUuMVwiOlxyXG4gICAgICAgICAgICBjID0gXCLlirPliqhcIjtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIjYuMVwiOlxyXG4gICAgICAgICAgICBjID0gXCLlhL/nq6VcIjtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIjkuMTBcIjpcclxuICAgICAgICAgICAgYyA9IFwi5pWZ5biIXCI7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCIxMC4xXCI6XHJcbiAgICAgICAgICAgIGMgPSBcIuWbveW6hlwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGMgJiYgKGEuaW5uZXJIVE1MID0gYyksXHJcbiAgICAgICAgYyA9IG51bGxcclxuICAgIH0sXHJcbiAgICBjLnZpZXdZZWFycyA9IGZ1bmN0aW9uKGEpIHtcclxuICAgICAgICB2YXIgYiA9IGMucXVlcnksXHJcbiAgICAgICAgZCA9IFwiXCI7XHJcbiAgICAgICAgYy5lYWNoKG5ldyBBcnJheSgxNCksXHJcbiAgICAgICAgZnVuY3Rpb24oYikge1xyXG4gICAgICAgICAgICBkICs9IDcgPT09IGIgPyBcIjxsaSBcIiArIChwYXJzZUludChoLnllYXIudmFsdWUpID09PSBhID8gJ2NsYXNzPVwiJyArIGhbMl0gKyAnXCInOiBcIlwiKSArICcgeT1cIicgKyBhICsgJ1wiPicgKyBhICsgXCLlubQ8L2xpPlwiOiAnPGxpIHk9XCInICsgKGEgLSA3ICsgYikgKyAnXCI+JyArIChhIC0gNyArIGIpICsgXCLlubQ8L2xpPlwiXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgYihcIiNsYXlkYXRlX3lzXCIpLmlubmVySFRNTCA9IGQsXHJcbiAgICAgICAgYy5lYWNoKGIoXCIjbGF5ZGF0ZV95cyBsaVwiKSxcclxuICAgICAgICBmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgICAgIFwieVwiID09PSBjLmNoZWNrVm9pZChiLmdldEF0dHJpYnV0ZShcInlcIikpWzBdID8gYy5hZGRDbGFzcyhiLCBoWzFdKSA6IGMub24oYiwgXCJjbGlja1wiLFxyXG4gICAgICAgICAgICBmdW5jdGlvbihhKSB7XHJcbiAgICAgICAgICAgICAgICBjLnN0b3BtcChhKS5yZXNob3coKSxcclxuICAgICAgICAgICAgICAgIGMudmlld0RhdGUoMCB8IHRoaXMuZ2V0QXR0cmlidXRlKFwieVwiKSwgYy55bWRbMV0sIGMueW1kWzJdKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgYy5pbml0RGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBkID0gKGMucXVlcnksIG5ldyBEYXRlKSxcclxuICAgICAgICBlID0gYy5lbGVtW2guZWxlbXZdLm1hdGNoKC9cXGQrL2cpIHx8IFtdO1xyXG4gICAgICAgIGUubGVuZ3RoIDwgMyAmJiAoZSA9IGMub3B0aW9ucy5zdGFydC5tYXRjaCgvXFxkKy9nKSB8fCBbXSwgZS5sZW5ndGggPCAzICYmIChlID0gW2QuZ2V0RnVsbFllYXIoKSwgZC5nZXRNb250aCgpICsgMSwgZC5nZXREYXRlKCldKSksXHJcbiAgICAgICAgYy5pbnltZCA9IGUsXHJcbiAgICAgICAgYy52aWV3RGF0ZShlWzBdLCBlWzFdIC0gMSwgZVsyXSlcclxuICAgIH0sXHJcbiAgICBjLmlzd3JpdGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYSA9IGMucXVlcnksXHJcbiAgICAgICAgYiA9IHtcclxuICAgICAgICAgICAgdGltZTogYShcIiNsYXlkYXRlX2htc1wiKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgYy5zaGRlKGIudGltZSwgIWMub3B0aW9ucy5pc3RpbWUpLFxyXG4gICAgICAgIGMuc2hkZShoLm9jbGVhciwgIShcImlzY2xlYXJcIiBpbiBjLm9wdGlvbnMgPyBjLm9wdGlvbnMuaXNjbGVhcjogMSkpLFxyXG4gICAgICAgIGMuc2hkZShoLm90b2RheSwgIShcImlzdG9kYXlcIiBpbiBjLm9wdGlvbnMgPyBjLm9wdGlvbnMuaXN0b2RheTogMSkpLFxyXG4gICAgICAgIGMuc2hkZShoLm9rLCAhKFwiaXNzdXJlXCIgaW4gYy5vcHRpb25zID8gYy5vcHRpb25zLmlzc3VyZTogMSkpXHJcbiAgICB9LFxyXG4gICAgYy5vcmllbiA9IGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICB2YXIgZCwgZSA9IGMuZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBhLnN0eWxlLmxlZnQgPSBlLmxlZnQgKyAoYiA/IDAgOiBjLnNjcm9sbCgxKSkgKyBcInB4XCIsXHJcbiAgICAgICAgZCA9IGUuYm90dG9tICsgYS5vZmZzZXRIZWlnaHQgLyAxLjUgPD0gYy53aW5hcmVhKCkgPyBlLmJvdHRvbSAtIDEgOiBlLnRvcCA+IGEub2Zmc2V0SGVpZ2h0IC8gMS41ID8gZS50b3AgLSBhLm9mZnNldEhlaWdodCArIDEgOiBjLndpbmFyZWEoKSAtIGEub2Zmc2V0SGVpZ2h0LFxyXG4gICAgICAgIGEuc3R5bGUudG9wID0gKGQgKyAoYiA/IDAgOiBjLnNjcm9sbCgpKSkvMiArIFwicHhcIlxyXG4gICAgfSxcclxuICAgIGMuZm9sbG93ID0gZnVuY3Rpb24oYSkge1xyXG4gICAgICAgIGMub3B0aW9ucy5maXhlZCA/IChhLnN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiLCBjLm9yaWVuKGEsIDEpKSA6IChhLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiLCBjLm9yaWVuKGEpKVxyXG4gICAgfSxcclxuICAgIGMudmlld3RiID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGEsIGIgPSBbXSxcclxuICAgICAgICBmID0gW1wi5pelXCIsIFwi5LiAXCIsIFwi5LqMXCIsIFwi5LiJXCIsIFwi5ZubXCIsIFwi5LqUXCIsIFwi5YWtXCJdLFxyXG4gICAgICAgIGggPSB7fSxcclxuICAgICAgICBpID0gZFtlXShcInRhYmxlXCIpLFxyXG4gICAgICAgIGogPSBkW2VdKFwidGhlYWRcIik7XHJcbiAgICAgICAgcmV0dXJuIGouYXBwZW5kQ2hpbGQoZFtlXShcInRyXCIpKSxcclxuICAgICAgICBoLmNyZWF0aCA9IGZ1bmN0aW9uKGEpIHtcclxuICAgICAgICAgICAgdmFyIGIgPSBkW2VdKFwidGhcIik7XHJcbiAgICAgICAgICAgIGIuaW5uZXJIVE1MID0gZlthXSxcclxuICAgICAgICAgICAgaltnXShcInRyXCIpWzBdLmFwcGVuZENoaWxkKGIpLFxyXG4gICAgICAgICAgICBiID0gbnVsbFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYy5lYWNoKG5ldyBBcnJheSg2KSxcclxuICAgICAgICBmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgIGIucHVzaChbXSksXHJcbiAgICAgICAgICAgIGEgPSBpLmluc2VydFJvdygwKSxcclxuICAgICAgICAgICAgYy5lYWNoKG5ldyBBcnJheSg3KSxcclxuICAgICAgICAgICAgZnVuY3Rpb24oYykge1xyXG4gICAgICAgICAgICAgICAgYltkXVtjXSA9IDAsXHJcbiAgICAgICAgICAgICAgICAwID09PSBkICYmIGguY3JlYXRoKGMpLFxyXG4gICAgICAgICAgICAgICAgYS5pbnNlcnRDZWxsKGMpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgaS5pbnNlcnRCZWZvcmUoaiwgaS5jaGlsZHJlblswXSksXHJcbiAgICAgICAgaS5pZCA9IGkuY2xhc3NOYW1lID0gXCJsYXlkYXRlX3RhYmxlXCIsXHJcbiAgICAgICAgYSA9IGIgPSBudWxsLFxyXG4gICAgICAgIGkub3V0ZXJIVE1MLnRvTG93ZXJDYXNlKClcclxuICAgIH0gKCksXHJcbiAgICBjLnZpZXcgPSBmdW5jdGlvbihhLCBmKSB7XHJcbiAgICAgICAgdmFyIGksIGcgPSBjLnF1ZXJ5LFxyXG4gICAgICAgIGogPSB7fTtcclxuICAgICAgICBmID0gZiB8fCBhLFxyXG4gICAgICAgIGMuZWxlbSA9IGEsXHJcbiAgICAgICAgYy5vcHRpb25zID0gZixcclxuICAgICAgICBjLm9wdGlvbnMuZm9ybWF0IHx8IChjLm9wdGlvbnMuZm9ybWF0ID0gYi5mb3JtYXQpLFxyXG4gICAgICAgIGMub3B0aW9ucy5zdGFydCA9IGMub3B0aW9ucy5zdGFydCB8fCBcIlwiLFxyXG4gICAgICAgIGMubW0gPSBqLm1tID0gW2Mub3B0aW9ucy5taW4gfHwgYi5taW4sIGMub3B0aW9ucy5tYXggfHwgYi5tYXhdLFxyXG4gICAgICAgIGMubWlucyA9IGoubW1bMF0ubWF0Y2goL1xcZCsvZyksXHJcbiAgICAgICAgYy5tYXhzID0gai5tbVsxXS5tYXRjaCgvXFxkKy9nKSxcclxuICAgICAgICBoLmVsZW12ID0gL3RleHRhcmVhfGlucHV0Ly50ZXN0KGMuZWxlbS50YWdOYW1lLnRvTG9jYWxlTG93ZXJDYXNlKCkpID8gXCJ2YWx1ZVwiOiBcImlubmVySFRNTFwiLFxyXG4gICAgICAgIGMuYm94ID8gYy5zaGRlKGMuYm94KSA6IChpID0gZFtlXShcImRpdlwiKSwgaS5pZCA9IGhbMF0sIGkuY2xhc3NOYW1lID0gaFswXSwgaS5zdHlsZS5jc3NUZXh0ID0gXCJwb3NpdGlvbjogYWJzb2x1dGU7XCIsIGkuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcImxheWRhdGUtdlwiICsgbGF5ZGF0ZS52KSwgaS5pbm5lckhUTUwgPSBqLmh0bWwgPSAnPGRpdiBjbGFzcz1cImxheWRhdGVfdG9wXCI+PGRpdiBjbGFzcz1cImxheWRhdGVfeW0gbGF5ZGF0ZV95XCIgaWQ9XCJsYXlkYXRlX1lZXCI+PGEgY2xhc3M9XCJsYXlkYXRlX2Nob29zZSBsYXlkYXRlX2NocHJldiBsYXlkYXRlX3RhYlwiPjxjaXRlPjwvY2l0ZT48L2E+PGlucHV0IGlkPVwibGF5ZGF0ZV95XCIgcmVhZG9ubHk+PGxhYmVsPjwvbGFiZWw+PGEgY2xhc3M9XCJsYXlkYXRlX2Nob29zZSBsYXlkYXRlX2NobmV4dCBsYXlkYXRlX3RhYlwiPjxjaXRlPjwvY2l0ZT48L2E+PGRpdiBjbGFzcz1cImxheWRhdGVfeW1zXCI+PGEgY2xhc3M9XCJsYXlkYXRlX3RhYiBsYXlkYXRlX2NodG9wXCI+PGNpdGU+PC9jaXRlPjwvYT48dWwgaWQ9XCJsYXlkYXRlX3lzXCI+PC91bD48YSBjbGFzcz1cImxheWRhdGVfdGFiIGxheWRhdGVfY2hkb3duXCI+PGNpdGU+PC9jaXRlPjwvYT48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwibGF5ZGF0ZV95bSBsYXlkYXRlX21cIiBpZD1cImxheWRhdGVfTU1cIj48YSBjbGFzcz1cImxheWRhdGVfY2hvb3NlIGxheWRhdGVfY2hwcmV2IGxheWRhdGVfdGFiXCI+PGNpdGU+PC9jaXRlPjwvYT48aW5wdXQgaWQ9XCJsYXlkYXRlX21cIiByZWFkb25seT48bGFiZWw+PC9sYWJlbD48YSBjbGFzcz1cImxheWRhdGVfY2hvb3NlIGxheWRhdGVfY2huZXh0IGxheWRhdGVfdGFiXCI+PGNpdGU+PC9jaXRlPjwvYT48ZGl2IGNsYXNzPVwibGF5ZGF0ZV95bXNcIiBpZD1cImxheWRhdGVfbXNcIj4nICtcclxuICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGEgPSBcIlwiO1xyXG4gICAgICAgICAgICByZXR1cm4gYy5lYWNoKG5ldyBBcnJheSgxMiksXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKGIpIHtcclxuICAgICAgICAgICAgICAgIGEgKz0gJzxzcGFuIG09XCInICsgYiArICdcIj4nICsgYy5kaWdpdChiICsgMSkgKyBcIuaciDwvc3Bhbj5cIlxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgYVxyXG4gICAgICAgIH0gKCkgKyBcIjwvZGl2PlwiICsgXCI8L2Rpdj5cIiArIFwiPC9kaXY+XCIgKyBjLnZpZXd0YiArICc8ZGl2IGNsYXNzPVwibGF5ZGF0ZV9ib3R0b21cIj4nICsgJzx1bCBpZD1cImxheWRhdGVfaG1zXCI+JyArICc8bGkgY2xhc3M9XCJsYXlkYXRlX3NqXCI+5pe26Ze0PC9saT4nICsgXCI8bGk+PGlucHV0IHJlYWRvbmx5Pjo8L2xpPlwiICsgXCI8bGk+PGlucHV0IHJlYWRvbmx5Pjo8L2xpPlwiICsgXCI8bGk+PGlucHV0IHJlYWRvbmx5PjwvbGk+XCIgKyBcIjwvdWw+XCIgKyAnPGRpdiBjbGFzcz1cImxheWRhdGVfdGltZVwiIGlkPVwibGF5ZGF0ZV90aW1lXCI+PC9kaXY+JyArICc8ZGl2IGNsYXNzPVwibGF5ZGF0ZV9idG5cIj4nICsgJzxhIGlkPVwibGF5ZGF0ZV9jbGVhclwiPua4heepujwvYT4nICsgJzxhIGlkPVwibGF5ZGF0ZV90b2RheVwiPuS7iuWkqTwvYT4nICsgJzxhIGlkPVwibGF5ZGF0ZV9va1wiPuehruiupDwvYT4nICsgXCI8L2Rpdj5cIiArIChiLmlzdiA/ICc8YSBocmVmPVwiaHR0cDovL3NlbnRzaW4uY29tL2xheXVpL2xheWRhdGUvXCIgY2xhc3M9XCJsYXlkYXRlX3ZcIiB0YXJnZXQ9XCJfYmxhbmtcIj5sYXlkYXRlLXYnICsgbGF5ZGF0ZS52ICsgXCI8L2E+XCI6IFwiXCIpICsgXCI8L2Rpdj5cIiwgZC5ib2R5LmFwcGVuZENoaWxkKGkpLCBjLmJveCA9IGcoXCIjXCIgKyBoWzBdKSwgYy5ldmVudHMoKSwgaSA9IG51bGwpLFxyXG4gICAgICAgIGMuZm9sbG93KGMuYm94KSxcclxuICAgICAgICBmLnpJbmRleCA/IGMuYm94LnN0eWxlLnpJbmRleCA9IGYuekluZGV4OiBjLnJlbW92ZUNzc0F0dHIoYy5ib3gsIFwiei1pbmRleFwiKSxcclxuICAgICAgICBjLnN0b3BNb3N1cChcImNsaWNrXCIsIGMuYm94KSxcclxuICAgICAgICBjLmluaXREYXRlKCksXHJcbiAgICAgICAgYy5pc3dyaXRlKCksXHJcbiAgICAgICAgYy5jaGVjaygpXHJcbiAgICB9LFxyXG4gICAgYy5yZXNob3cgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gYy5lYWNoKGMucXVlcnkoXCIjXCIgKyBoWzBdICsgXCIgLmxheWRhdGVfc2hvd1wiKSxcclxuICAgICAgICBmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgICAgIGMucmVtb3ZlQ2xhc3MoYiwgXCJsYXlkYXRlX3Nob3dcIilcclxuICAgICAgICB9KSxcclxuICAgICAgICB0aGlzXHJcbiAgICB9LFxyXG4gICAgYy5jbG9zZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGMucmVzaG93KCksXHJcbiAgICAgICAgYy5zaGRlKGMucXVlcnkoXCIjXCIgKyBoWzBdKSwgMSksXHJcbiAgICAgICAgYy5lbGVtID0gbnVsbFxyXG4gICAgfSxcclxuICAgIGMucGFyc2UgPSBmdW5jdGlvbihhLCBkLCBlKSB7XHJcbiAgICAgICAgcmV0dXJuIGEgPSBhLmNvbmNhdChkKSxcclxuICAgICAgICBlID0gZSB8fCAoYy5vcHRpb25zID8gYy5vcHRpb25zLmZvcm1hdDogYi5mb3JtYXQpLFxyXG4gICAgICAgIGUucmVwbGFjZSgvWVlZWXxNTXxERHxoaHxtbXxzcy9nLFxyXG4gICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYS5pbmRleCA9IDAgfCArK2EuaW5kZXgsXHJcbiAgICAgICAgICAgIGMuZGlnaXQoYVthLmluZGV4XSlcclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuICAgIGMuY3JlYXRpb24gPSBmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgdmFyIGUgPSAoYy5xdWVyeSwgYy5obXNpbiksXHJcbiAgICAgICAgZiA9IGMucGFyc2UoYSwgW2VbMF0udmFsdWUsIGVbMV0udmFsdWUsIGVbMl0udmFsdWVdKTtcclxuICAgICAgICBjLmVsZW1baC5lbGVtdl0gPSBmLFxyXG4gICAgICAgIGIgfHwgKGMuY2xvc2UoKSwgXCJmdW5jdGlvblwiID09IHR5cGVvZiBjLm9wdGlvbnMuY2hvb3NlICYmIGMub3B0aW9ucy5jaG9vc2UoZikpXHJcbiAgICB9LFxyXG4gICAgYy5ldmVudHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYiA9IGMucXVlcnksXHJcbiAgICAgICAgZSA9IHtcclxuICAgICAgICAgICAgYm94OiBcIiNcIiArIGhbMF1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGMuYWRkQ2xhc3MoZC5ib2R5LCBcImxheWRhdGVfYm9keVwiKSxcclxuICAgICAgICBoLnRkcyA9IGIoXCIjbGF5ZGF0ZV90YWJsZSB0ZFwiKSxcclxuICAgICAgICBoLm1tcyA9IGIoXCIjbGF5ZGF0ZV9tcyBzcGFuXCIpLFxyXG4gICAgICAgIGgueWVhciA9IGIoXCIjbGF5ZGF0ZV95XCIpLFxyXG4gICAgICAgIGgubW9udGggPSBiKFwiI2xheWRhdGVfbVwiKSxcclxuICAgICAgICBjLmVhY2goYihlLmJveCArIFwiIC5sYXlkYXRlX3ltXCIpLFxyXG4gICAgICAgIGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICAgICAgYy5vbihiLCBcImNsaWNrXCIsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKGIpIHtcclxuICAgICAgICAgICAgICAgIGMuc3RvcG1wKGIpLnJlc2hvdygpLFxyXG4gICAgICAgICAgICAgICAgYy5hZGRDbGFzcyh0aGlzW2ddKFwiZGl2XCIpWzBdLCBcImxheWRhdGVfc2hvd1wiKSxcclxuICAgICAgICAgICAgICAgIGEgfHwgKGUuWVkgPSBwYXJzZUludChoLnllYXIudmFsdWUpLCBjLnZpZXdZZWFycyhlLllZKSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KSxcclxuICAgICAgICBjLm9uKGIoZS5ib3gpLCBcImNsaWNrXCIsXHJcbiAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGMucmVzaG93KClcclxuICAgICAgICB9KSxcclxuICAgICAgICBlLnRhYlllYXIgPSBmdW5jdGlvbihhKSB7XHJcbiAgICAgICAgICAgIDAgPT09IGEgPyBjLnltZFswXS0tOjEgPT09IGEgPyBjLnltZFswXSsrOjIgPT09IGEgPyBlLllZIC09IDE0IDogZS5ZWSArPSAxNCxcclxuICAgICAgICAgICAgMiA+IGEgPyAoYy52aWV3RGF0ZShjLnltZFswXSwgYy55bWRbMV0sIGMueW1kWzJdKSwgYy5yZXNob3coKSkgOiBjLnZpZXdZZWFycyhlLllZKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYy5lYWNoKGIoXCIjbGF5ZGF0ZV9ZWSAubGF5ZGF0ZV90YWJcIiksXHJcbiAgICAgICAgZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgICAgICBjLm9uKGIsIFwiY2xpY2tcIixcclxuICAgICAgICAgICAgZnVuY3Rpb24oYikge1xyXG4gICAgICAgICAgICAgICAgYy5zdG9wbXAoYiksXHJcbiAgICAgICAgICAgICAgICBlLnRhYlllYXIoYSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KSxcclxuICAgICAgICBlLnRhYk1vbnRoID0gZnVuY3Rpb24oYSkge1xyXG4gICAgICAgICAgICBhID8gKGMueW1kWzFdKyssIDEyID09PSBjLnltZFsxXSAmJiAoYy55bWRbMF0rKywgYy55bWRbMV0gPSAwKSkgOiAoYy55bWRbMV0tLSwgLTEgPT09IGMueW1kWzFdICYmIChjLnltZFswXS0tLCBjLnltZFsxXSA9IDExKSksXHJcbiAgICAgICAgICAgIGMudmlld0RhdGUoYy55bWRbMF0sIGMueW1kWzFdLCBjLnltZFsyXSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGMuZWFjaChiKFwiI2xheWRhdGVfTU0gLmxheWRhdGVfdGFiXCIpLFxyXG4gICAgICAgIGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICAgICAgYy5vbihiLCBcImNsaWNrXCIsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKGIpIHtcclxuICAgICAgICAgICAgICAgIGMuc3RvcG1wKGIpLnJlc2hvdygpLFxyXG4gICAgICAgICAgICAgICAgZS50YWJNb250aChhKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGMuZWFjaChiKFwiI2xheWRhdGVfbXMgc3BhblwiKSxcclxuICAgICAgICBmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgICAgIGMub24oYiwgXCJjbGlja1wiLFxyXG4gICAgICAgICAgICBmdW5jdGlvbihhKSB7XHJcbiAgICAgICAgICAgICAgICBjLnN0b3BtcChhKS5yZXNob3coKSxcclxuICAgICAgICAgICAgICAgIGMuaGFzQ2xhc3ModGhpcywgaFsxXSkgfHwgYy52aWV3RGF0ZShjLnltZFswXSwgMCB8IHRoaXMuZ2V0QXR0cmlidXRlKFwibVwiKSwgYy55bWRbMl0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgYy5lYWNoKGIoXCIjbGF5ZGF0ZV90YWJsZSB0ZFwiKSxcclxuICAgICAgICBmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgICAgIGMub24oYiwgXCJjbGlja1wiLFxyXG4gICAgICAgICAgICBmdW5jdGlvbihhKSB7XHJcbiAgICAgICAgICAgICAgICBjLmhhc0NsYXNzKHRoaXMsIGhbMV0pIHx8IChjLnN0b3BtcChhKSwgYy5jcmVhdGlvbihbMCB8IHRoaXMuZ2V0QXR0cmlidXRlKFwieVwiKSwgMCB8IHRoaXMuZ2V0QXR0cmlidXRlKFwibVwiKSwgMCB8IHRoaXMuZ2V0QXR0cmlidXRlKFwiZFwiKV0pKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGgub2NsZWFyID0gYihcIiNsYXlkYXRlX2NsZWFyXCIpLFxyXG4gICAgICAgIGMub24oaC5vY2xlYXIsIFwiY2xpY2tcIixcclxuICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgYy5lbGVtW2guZWxlbXZdID0gXCJcIixcclxuICAgICAgICAgICAgYy5jbG9zZSgpXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgaC5vdG9kYXkgPSBiKFwiI2xheWRhdGVfdG9kYXlcIiksXHJcbiAgICAgICAgYy5vbihoLm90b2RheSwgXCJjbGlja1wiLFxyXG4gICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjLmVsZW1baC5lbGVtdl0gPSBsYXlkYXRlLm5vdygwLCBjLm9wdGlvbnMuZm9ybWF0KSxcclxuICAgICAgICAgICAgYy5jbG9zZSgpXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgaC5vayA9IGIoXCIjbGF5ZGF0ZV9va1wiKSxcclxuICAgICAgICBjLm9uKGgub2ssIFwiY2xpY2tcIixcclxuICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgYy52YWxpZCAmJiBjLmNyZWF0aW9uKFtjLnltZFswXSwgYy55bWRbMV0gKyAxLCBjLnltZFsyXV0pXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgZS50aW1lcyA9IGIoXCIjbGF5ZGF0ZV90aW1lXCIpLFxyXG4gICAgICAgIGMuaG1zaW4gPSBlLmhtc2luID0gYihcIiNsYXlkYXRlX2htcyBpbnB1dFwiKSxcclxuICAgICAgICBlLmhtc3MgPSBbXCLlsI/ml7ZcIiwgXCLliIbpkp9cIiwgXCLnp5LmlbBcIl0sXHJcbiAgICAgICAgZS5obXNhcnIgPSBbXSxcclxuICAgICAgICBjLm1zZyA9IGZ1bmN0aW9uKGEsIGQpIHtcclxuICAgICAgICAgICAgdmFyIGYgPSAnPGRpdiBjbGFzcz1cImxheWR0ZV9oc210ZXhcIj4nICsgKGQgfHwgXCLmj5DnpLpcIikgKyBcIjxzcGFuPsOXPC9zcGFuPjwvZGl2PlwiO1xyXG4gICAgICAgICAgICBcInN0cmluZ1wiID09IHR5cGVvZiBhID8gKGYgKz0gXCI8cD5cIiArIGEgKyBcIjwvcD5cIiwgYy5zaGRlKGIoXCIjXCIgKyBoWzBdKSksIGMucmVtb3ZlQ2xhc3MoZS50aW1lcywgXCJsYXlkYXRlX3RpbWUxXCIpLmFkZENsYXNzKGUudGltZXMsIFwibGF5ZGF0ZV9tc2dcIikpIDogKGUuaG1zYXJyW2FdID8gZiA9IGUuaG1zYXJyW2FdIDogKGYgKz0gJzxkaXYgaWQ9XCJsYXlkYXRlX2htc25vXCIgY2xhc3M9XCJsYXlkYXRlX2htc25vXCI+JywgYy5lYWNoKG5ldyBBcnJheSgwID09PSBhID8gMjQgOiA2MCksXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKGEpIHtcclxuICAgICAgICAgICAgICAgIGYgKz0gXCI8c3Bhbj5cIiArIGEgKyBcIjwvc3Bhbj5cIlxyXG4gICAgICAgICAgICB9KSwgZiArPSBcIjwvZGl2PlwiLCBlLmhtc2FyclthXSA9IGYpLCBjLnJlbW92ZUNsYXNzKGUudGltZXMsIFwibGF5ZGF0ZV9tc2dcIiksIGNbMCA9PT0gYSA/IFwicmVtb3ZlQ2xhc3NcIjogXCJhZGRDbGFzc1wiXShlLnRpbWVzLCBcImxheWRhdGVfdGltZTFcIikpLFxyXG4gICAgICAgICAgICBjLmFkZENsYXNzKGUudGltZXMsIFwibGF5ZGF0ZV9zaG93XCIpLFxyXG4gICAgICAgICAgICBlLnRpbWVzLmlubmVySFRNTCA9IGZcclxuICAgICAgICB9LFxyXG4gICAgICAgIGUuaG1zb24gPSBmdW5jdGlvbihhLCBkKSB7XHJcbiAgICAgICAgICAgIHZhciBlID0gYihcIiNsYXlkYXRlX2htc25vIHNwYW5cIiksXHJcbiAgICAgICAgICAgIGYgPSBjLnZhbGlkID8gbnVsbDogMTtcclxuICAgICAgICAgICAgYy5lYWNoKGUsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKGIsIGUpIHtcclxuICAgICAgICAgICAgICAgIGYgPyBjLmFkZENsYXNzKGUsIGhbMV0pIDogYy50aW1lVm9pZChiLCBkKSA/IGMuYWRkQ2xhc3MoZSwgaFsxXSkgOiBjLm9uKGUsIFwiY2xpY2tcIixcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGMuaGFzQ2xhc3ModGhpcywgaFsxXSkgfHwgKGEudmFsdWUgPSBjLmRpZ2l0KDAgfCB0aGlzLmlubmVySFRNTCkpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgYy5hZGRDbGFzcyhlWzAgfCBhLnZhbHVlXSwgXCJsYXlkYXRlX2NsaWNrXCIpXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjLmVhY2goZS5obXNpbixcclxuICAgICAgICBmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgICAgIGMub24oYiwgXCJjbGlja1wiLFxyXG4gICAgICAgICAgICBmdW5jdGlvbihiKSB7XHJcbiAgICAgICAgICAgICAgICBjLnN0b3BtcChiKS5yZXNob3coKSxcclxuICAgICAgICAgICAgICAgIGMubXNnKGEsIGUuaG1zc1thXSksXHJcbiAgICAgICAgICAgICAgICBlLmhtc29uKHRoaXMsIGEpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgYy5vbihkLCBcIm1vdXNldXBcIixcclxuICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGEgPSBiKFwiI1wiICsgaFswXSk7XHJcbiAgICAgICAgICAgIGEgJiYgXCJub25lXCIgIT09IGEuc3R5bGUuZGlzcGxheSAmJiAoYy5jaGVjaygpIHx8IGMuY2xvc2UoKSlcclxuICAgICAgICB9KS5vbihkLCBcImtleWRvd25cIixcclxuICAgICAgICBmdW5jdGlvbihiKSB7XHJcbiAgICAgICAgICAgIGIgPSBiIHx8IGEuZXZlbnQ7XHJcbiAgICAgICAgICAgIHZhciBkID0gYi5rZXlDb2RlO1xyXG4gICAgICAgICAgICAxMyA9PT0gZCAmJiBjLmNyZWF0aW9uKFtjLnltZFswXSwgYy55bWRbMV0gKyAxLCBjLnltZFsyXV0pXHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBjLmluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBjLnVzZShoWzVdKSxcclxuICAgICAgICBjLnVzZShoWzZdKSxcclxuICAgICAgICBjLnNraW5MaW5rID0gYy5xdWVyeShcIiNcIiArIGhbM10pXHJcbiAgICB9ICgpLFxyXG4gICAgbGF5ZGF0ZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGMuYm94ICYmIGMuZWxlbSAmJiBjLmZvbGxvdyhjLmJveClcclxuICAgIH0sXHJcbiAgICBsYXlkYXRlLm5vdyA9IGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKDAgfCBhID9cclxuICAgICAgICBmdW5jdGlvbihhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiA4NjRlNSA+IGEgPyArbmV3IERhdGUgKyA4NjRlNSAqIGE6IGFcclxuICAgICAgICB9IChwYXJzZUludChhKSkgOiArbmV3IERhdGUpO1xyXG4gICAgICAgIHJldHVybiBjLnBhcnNlKFtkLmdldEZ1bGxZZWFyKCksIGQuZ2V0TW9udGgoKSArIDEsIGQuZ2V0RGF0ZSgpXSwgW2QuZ2V0SG91cnMoKSwgZC5nZXRNaW51dGVzKCksIGQuZ2V0U2Vjb25kcygpXSwgYilcclxuICAgIH0sXHJcbiAgICBsYXlkYXRlLnNraW4gPSBmdW5jdGlvbihhKSB7XHJcbiAgICAgICAgYy5za2luTGluay5ocmVmID0gYy5nZXRQYXRoICsgaFs1XVxyXG4gICAgfVxyXG59ICh3aW5kb3cpOyJdLCJmaWxlIjoiZGFpbHlzdGF0ZW1lbnQvbGF5ZGF0ZS9sYXlkYXRlLmpzIn0=
