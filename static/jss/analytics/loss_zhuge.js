$(function () {
    window.zhuge = window.zhuge || [];
    window.zhuge.methods = "_init debug identify track trackLink trackForm page".split(" ");
    window.zhuge.factory = function (b) {
        return function () {
            var a = Array.prototype.slice.call(arguments);
            a.unshift(b);
            window.zhuge.push(a);
            return window.zhuge;
        };
    };
    for (var i = 0; i < window.zhuge.methods.length; i++) {
        var key = window.zhuge.methods[i];
        window.zhuge[key] = window.zhuge.factory(key);
    }
    window.zhuge.load = function (b, x) {
        if (!document.getElementById("zhuge-js")) {
            var a = document.createElement("script");
            var verDate = new Date();
            var verStr = verDate.getFullYear().toString() + verDate.getMonth().toString() + verDate.getDate().toString();

            a.type = "text/javascript";
            a.id = "zhuge-js";
            a.async = !0;
            a.src = (location.protocol == 'http:' ? "http://sdk.zhugeio.com/zhuge.min.js?v=" : 'https://zgsdk.zhugeio.com/zhuge.min.js?v=') + verStr;
            a.onerror = function(){
                window.zhuge.identify = window.zhuge.track = function(ename, props, callback){
                    if(callback && Object.prototype.toString.call(callback) === '[object Function]')callback();
                };
            };
            var c = document.getElementsByTagName("script")[0];
            c.parentNode.insertBefore(a, c);
            window.zhuge._init(b, x);
        }
    };
    window.zhuge.load('2d92a56761754c03a4d714aa0c9eb593');
    // tracking code written within individual pages
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhbmFseXRpY3MvbG9zc196aHVnZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIkKGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cuemh1Z2UgPSB3aW5kb3cuemh1Z2UgfHwgW107XG4gICAgd2luZG93LnpodWdlLm1ldGhvZHMgPSBcIl9pbml0IGRlYnVnIGlkZW50aWZ5IHRyYWNrIHRyYWNrTGluayB0cmFja0Zvcm0gcGFnZVwiLnNwbGl0KFwiIFwiKTtcbiAgICB3aW5kb3cuemh1Z2UuZmFjdG9yeSA9IGZ1bmN0aW9uIChiKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBhLnVuc2hpZnQoYik7XG4gICAgICAgICAgICB3aW5kb3cuemh1Z2UucHVzaChhKTtcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuemh1Z2U7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdpbmRvdy56aHVnZS5tZXRob2RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBrZXkgPSB3aW5kb3cuemh1Z2UubWV0aG9kc1tpXTtcbiAgICAgICAgd2luZG93LnpodWdlW2tleV0gPSB3aW5kb3cuemh1Z2UuZmFjdG9yeShrZXkpO1xuICAgIH1cbiAgICB3aW5kb3cuemh1Z2UubG9hZCA9IGZ1bmN0aW9uIChiLCB4KSB7XG4gICAgICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ6aHVnZS1qc1wiKSkge1xuICAgICAgICAgICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICAgICAgdmFyIHZlckRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdmFyIHZlclN0ciA9IHZlckRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpICsgdmVyRGF0ZS5nZXRNb250aCgpLnRvU3RyaW5nKCkgKyB2ZXJEYXRlLmdldERhdGUoKS50b1N0cmluZygpO1xuXG4gICAgICAgICAgICBhLnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xuICAgICAgICAgICAgYS5pZCA9IFwiemh1Z2UtanNcIjtcbiAgICAgICAgICAgIGEuYXN5bmMgPSAhMDtcbiAgICAgICAgICAgIGEuc3JjID0gKGxvY2F0aW9uLnByb3RvY29sID09ICdodHRwOicgPyBcImh0dHA6Ly9zZGsuemh1Z2Vpby5jb20vemh1Z2UubWluLmpzP3Y9XCIgOiAnaHR0cHM6Ly96Z3Nkay56aHVnZWlvLmNvbS96aHVnZS5taW4uanM/dj0nKSArIHZlclN0cjtcbiAgICAgICAgICAgIGEub25lcnJvciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgd2luZG93LnpodWdlLmlkZW50aWZ5ID0gd2luZG93LnpodWdlLnRyYWNrID0gZnVuY3Rpb24oZW5hbWUsIHByb3BzLCBjYWxsYmFjayl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGNhbGxiYWNrICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChjYWxsYmFjaykgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXScpY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBjID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIilbMF07XG4gICAgICAgICAgICBjLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGEsIGMpO1xuICAgICAgICAgICAgd2luZG93LnpodWdlLl9pbml0KGIsIHgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICB3aW5kb3cuemh1Z2UubG9hZCgnMmQ5MmE1Njc2MTc1NGMwM2E0ZDcxNGFhMGM5ZWI1OTMnKTtcbiAgICAvLyB0cmFja2luZyBjb2RlIHdyaXR0ZW4gd2l0aGluIGluZGl2aWR1YWwgcGFnZXNcbn0pO1xuIl0sImZpbGUiOiJhbmFseXRpY3MvbG9zc196aHVnZS5qcyJ9
