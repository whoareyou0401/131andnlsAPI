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
