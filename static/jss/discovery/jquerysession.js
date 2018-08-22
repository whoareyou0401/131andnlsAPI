(function($){

    $.session = {

        _id: null,

        _cookieCache: undefined,

        _init: function()
        {
            if (!window.name) {
                window.name = Math.random();
            }
            this._id = window.name;
            this._initCache();

            // See if we've changed protcols

            var matches = (new RegExp(this._generatePrefix() + "=([^;]+);")).exec(document.cookie);
            if (matches && document.location.protocol !== matches[1]) {
               this._clearSession();
               for (var key in this._cookieCache) {
                   try {
                   window.sessionStorage.setItem(key, this._cookieCache[key]);
                   } catch (e) {};
               }
            }

            document.cookie = this._generatePrefix() + "=" + document.location.protocol + ';path=/;expires=' + (new Date((new Date).getTime() + 120000)).toUTCString();

        },

        _generatePrefix: function()
        {
            return '__session:' + this._id + ':';
        },

        _initCache: function()
        {
            var cookies = document.cookie.split(';');
            this._cookieCache = {};
            for (var i in cookies) {
                var kv = cookies[i].split('=');
                if ((new RegExp(this._generatePrefix() + '.+')).test(kv[0]) && kv[1]) {
                    this._cookieCache[kv[0].split(':', 3)[2]] = kv[1];
                }
            }
        },

        _setFallback: function(key, value, onceOnly)
        {
            var cookie = this._generatePrefix() + key + "=" + value + "; path=/";
            if (onceOnly) {
                cookie += "; expires=" + (new Date(Date.now() + 120000)).toUTCString();
            }
            document.cookie = cookie;
            this._cookieCache[key] = value;
            return this;
        },

        _getFallback: function(key)
        {
            if (!this._cookieCache) {
                this._initCache();
            }
            return this._cookieCache[key];
        },

        _clearFallback: function()
        {
            for (var i in this._cookieCache) {
                document.cookie = this._generatePrefix() + i + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            }
            this._cookieCache = {};
        },

        _deleteFallback: function(key)
        {
            document.cookie = this._generatePrefix() + key + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            delete this._cookieCache[key];
        },

        get: function(key)
        {
            return window.sessionStorage.getItem(key) || this._getFallback(key);
        },

        set: function(key, value, onceOnly)
        {
            try {
                window.sessionStorage.setItem(key, value);
            } catch (e) {}
            this._setFallback(key, value, onceOnly || false);
            return this;
        },
        
        'delete': function(key){
            return this.remove(key);
        },

        remove: function(key)
        {
            try {
            window.sessionStorage.removeItem(key);
            } catch (e) {};
            this._deleteFallback(key);
            return this;
        },

        _clearSession: function()
        {
          try {
                window.sessionStorage.clear();
            } catch (e) {
                for (var i in window.sessionStorage) {
                    window.sessionStorage.removeItem(i);
                }
            }
        },

        clear: function()
        {
            this._clearSession();
            this._clearFallback();
            return this;
        }

    };

    $.session._init();

})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkaXNjb3ZlcnkvanF1ZXJ5c2Vzc2lvbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oJCl7XG5cbiAgICAkLnNlc3Npb24gPSB7XG5cbiAgICAgICAgX2lkOiBudWxsLFxuXG4gICAgICAgIF9jb29raWVDYWNoZTogdW5kZWZpbmVkLFxuXG4gICAgICAgIF9pbml0OiBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICghd2luZG93Lm5hbWUpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cubmFtZSA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9pZCA9IHdpbmRvdy5uYW1lO1xuICAgICAgICAgICAgdGhpcy5faW5pdENhY2hlKCk7XG5cbiAgICAgICAgICAgIC8vIFNlZSBpZiB3ZSd2ZSBjaGFuZ2VkIHByb3Rjb2xzXG5cbiAgICAgICAgICAgIHZhciBtYXRjaGVzID0gKG5ldyBSZWdFeHAodGhpcy5fZ2VuZXJhdGVQcmVmaXgoKSArIFwiPShbXjtdKyk7XCIpKS5leGVjKGRvY3VtZW50LmNvb2tpZSk7XG4gICAgICAgICAgICBpZiAobWF0Y2hlcyAmJiBkb2N1bWVudC5sb2NhdGlvbi5wcm90b2NvbCAhPT0gbWF0Y2hlc1sxXSkge1xuICAgICAgICAgICAgICAgdGhpcy5fY2xlYXJTZXNzaW9uKCk7XG4gICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5fY29va2llQ2FjaGUpIHtcbiAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKGtleSwgdGhpcy5fY29va2llQ2FjaGVba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge307XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IHRoaXMuX2dlbmVyYXRlUHJlZml4KCkgKyBcIj1cIiArIGRvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sICsgJztwYXRoPS87ZXhwaXJlcz0nICsgKG5ldyBEYXRlKChuZXcgRGF0ZSkuZ2V0VGltZSgpICsgMTIwMDAwKSkudG9VVENTdHJpbmcoKTtcblxuICAgICAgICB9LFxuXG4gICAgICAgIF9nZW5lcmF0ZVByZWZpeDogZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gJ19fc2Vzc2lvbjonICsgdGhpcy5faWQgKyAnOic7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2luaXRDYWNoZTogZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuICAgICAgICAgICAgdGhpcy5fY29va2llQ2FjaGUgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gY29va2llcykge1xuICAgICAgICAgICAgICAgIHZhciBrdiA9IGNvb2tpZXNbaV0uc3BsaXQoJz0nKTtcbiAgICAgICAgICAgICAgICBpZiAoKG5ldyBSZWdFeHAodGhpcy5fZ2VuZXJhdGVQcmVmaXgoKSArICcuKycpKS50ZXN0KGt2WzBdKSAmJiBrdlsxXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb29raWVDYWNoZVtrdlswXS5zcGxpdCgnOicsIDMpWzJdXSA9IGt2WzFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfc2V0RmFsbGJhY2s6IGZ1bmN0aW9uKGtleSwgdmFsdWUsIG9uY2VPbmx5KVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgY29va2llID0gdGhpcy5fZ2VuZXJhdGVQcmVmaXgoKSArIGtleSArIFwiPVwiICsgdmFsdWUgKyBcIjsgcGF0aD0vXCI7XG4gICAgICAgICAgICBpZiAob25jZU9ubHkpIHtcbiAgICAgICAgICAgICAgICBjb29raWUgKz0gXCI7IGV4cGlyZXM9XCIgKyAobmV3IERhdGUoRGF0ZS5ub3coKSArIDEyMDAwMCkpLnRvVVRDU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSBjb29raWU7XG4gICAgICAgICAgICB0aGlzLl9jb29raWVDYWNoZVtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBfZ2V0RmFsbGJhY2s6IGZ1bmN0aW9uKGtleSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9jb29raWVDYWNoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2luaXRDYWNoZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Nvb2tpZUNhY2hlW2tleV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2NsZWFyRmFsbGJhY2s6IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLl9jb29raWVDYWNoZSkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IHRoaXMuX2dlbmVyYXRlUHJlZml4KCkgKyBpICsgJz07IHBhdGg9LzsgZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAxIEdNVDsnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fY29va2llQ2FjaGUgPSB7fTtcbiAgICAgICAgfSxcblxuICAgICAgICBfZGVsZXRlRmFsbGJhY2s6IGZ1bmN0aW9uKGtleSlcbiAgICAgICAge1xuICAgICAgICAgICAgZG9jdW1lbnQuY29va2llID0gdGhpcy5fZ2VuZXJhdGVQcmVmaXgoKSArIGtleSArICc9OyBwYXRoPS87IGV4cGlyZXM9VGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMSBHTVQ7JztcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9jb29raWVDYWNoZVtrZXldO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldDogZnVuY3Rpb24oa2V5KVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gd2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oa2V5KSB8fCB0aGlzLl9nZXRGYWxsYmFjayhrZXkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSwgb25jZU9ubHkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICAgICAgdGhpcy5fc2V0RmFsbGJhY2soa2V5LCB2YWx1ZSwgb25jZU9ubHkgfHwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAnZGVsZXRlJzogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZShrZXkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24oa2V5KVxuICAgICAgICB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9O1xuICAgICAgICAgICAgdGhpcy5fZGVsZXRlRmFsbGJhY2soa2V5KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9jbGVhclNlc3Npb246IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlLmNsZWFyKCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGNsZWFyOiBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2NsZWFyU2Vzc2lvbigpO1xuICAgICAgICAgICAgdGhpcy5fY2xlYXJGYWxsYmFjaygpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICAkLnNlc3Npb24uX2luaXQoKTtcblxufSkoalF1ZXJ5KTsiXSwiZmlsZSI6ImRpc2NvdmVyeS9qcXVlcnlzZXNzaW9uLmpzIn0=
