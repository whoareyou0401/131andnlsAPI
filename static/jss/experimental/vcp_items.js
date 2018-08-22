$(function() {
     var app = new Vue({
        el: '#app',
        data: {

            items: [],
            page: 1,
            max_page: 1,
            pages:[]
        },
        beforeCreate: function() {
            var _self = this;
            $.ajax({
                url: "/experimental/api/vcp-items",
                type: "GET",
                datatype: "JSONP",
                data: {
                    'page': 1
                },
                success: function(data) {
                    _self.items = data.data;
                    _self.max_page = data.page_count;
                    _self.pages = data.pages;
                }
            });
        },
        watch:{
            page: function(new_data) {
                var _self = this;
                _self.page = parseInt(new_data);
                $.ajax({
                    url: "/experimental/api/vcp-items",
                    type: "GET",
                    data: {
                        'page': _self.page
                    },
                    dataType: "JSON",
                    success: function(data) {
                        _self.items = data.data;
                        _self.max_page = data.page_count;
                    }
                });
            }
        },
        methods: {
            before:function(){
                var _self = this;
                if (_self.page == _self.max_page){
                    alert('这是最后一页');
                    return;
                } else {
                    _self.page = _self.page + 1;
                }
                $.ajax({
                    url: "/experimental/api/vcp-items",
                    type: "GET",
                    data: {
                        'page': _self.page
                    },
                    dataType: "JSON",
                    success: function(data) {
                        _self.items = data.data;
                    }
                });
            },
            after: function(){
                var _self = this;
                if (_self.page == 1){
                    alert('到头了');
                    return;
                } else {
                    _self.page = _self.page - 1;
                }
                $.ajax({
                    url: "/experimental/api/vcp-items",
                    type: "GET",
                    data: {
                        'page': _self.page
                    },
                    datatype: "JSON",
                    success: function(data) {
                        _self.items = data.data;
                    }
                });
            }
        }
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJleHBlcmltZW50YWwvdmNwX2l0ZW1zLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiQoZnVuY3Rpb24oKSB7XG4gICAgIHZhciBhcHAgPSBuZXcgVnVlKHtcbiAgICAgICAgZWw6ICcjYXBwJyxcbiAgICAgICAgZGF0YToge1xuXG4gICAgICAgICAgICBpdGVtczogW10sXG4gICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgbWF4X3BhZ2U6IDEsXG4gICAgICAgICAgICBwYWdlczpbXVxuICAgICAgICB9LFxuICAgICAgICBiZWZvcmVDcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIF9zZWxmID0gdGhpcztcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBcIi9leHBlcmltZW50YWwvYXBpL3ZjcC1pdGVtc1wiLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgICAgICAgICAgZGF0YXR5cGU6IFwiSlNPTlBcIixcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICdwYWdlJzogMVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBfc2VsZi5pdGVtcyA9IGRhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgX3NlbGYubWF4X3BhZ2UgPSBkYXRhLnBhZ2VfY291bnQ7XG4gICAgICAgICAgICAgICAgICAgIF9zZWxmLnBhZ2VzID0gZGF0YS5wYWdlcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgd2F0Y2g6e1xuICAgICAgICAgICAgcGFnZTogZnVuY3Rpb24obmV3X2RhdGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIF9zZWxmLnBhZ2UgPSBwYXJzZUludChuZXdfZGF0YSk7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9leHBlcmltZW50YWwvYXBpL3ZjcC1pdGVtc1wiLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAncGFnZSc6IF9zZWxmLnBhZ2VcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwiSlNPTlwiLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5pdGVtcyA9IGRhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLm1heF9wYWdlID0gZGF0YS5wYWdlX2NvdW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgIGJlZm9yZTpmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKF9zZWxmLnBhZ2UgPT0gX3NlbGYubWF4X3BhZ2Upe1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgn6L+Z5piv5pyA5ZCO5LiA6aG1Jyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfc2VsZi5wYWdlID0gX3NlbGYucGFnZSArIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvZXhwZXJpbWVudGFsL2FwaS92Y3AtaXRlbXNcIixcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3BhZ2UnOiBfc2VsZi5wYWdlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcIkpTT05cIixcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYuaXRlbXMgPSBkYXRhLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhZnRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGlmIChfc2VsZi5wYWdlID09IDEpe1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgn5Yiw5aS05LqGJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfc2VsZi5wYWdlID0gX3NlbGYucGFnZSAtIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvZXhwZXJpbWVudGFsL2FwaS92Y3AtaXRlbXNcIixcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3BhZ2UnOiBfc2VsZi5wYWdlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGF0eXBlOiBcIkpTT05cIixcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYuaXRlbXMgPSBkYXRhLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iXSwiZmlsZSI6ImV4cGVyaW1lbnRhbC92Y3BfaXRlbXMuanMifQ==
