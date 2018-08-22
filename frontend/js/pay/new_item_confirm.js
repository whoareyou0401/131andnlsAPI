$(function() {

     setupCSRF();
     var app = new Vue({
        el: '#app',
        data: {

            datas: [],
            current_page: 1,
            integration:'',
            search_type:'person',
            word:'',
            pages:[]

        },
        beforeCreate: function() {
            var _self = this;
            $.ajax({
                url: "/api/v1.1/pay/new-item-log",
                type: "GET",
                data:{
                    page:1
                },
                datatype:"JSON",
                success: function(data) {
                    console.log(data.data);
                    _self.datas = data.data.datas;
                    _self.pages = data.data.pages;
                }
            });
        },
        watch:{
            current_page:function(){
                var _self = this;
                $.ajax({
                    url: "/api/v1.1/pay/new-item-log",
                    type: "GET",
                    data:{
                        'page':_self.current_page
                    },
                    datatype:"JSON",
                    success: function(data) {
                        console.log(data);
                        _self.datas = data.data.datas;
                        _self.pages = data.data.pages;
                    }
                });
            }
        },
        methods: {
            pageChange: function(index) {
                this.current_page = index + 1;
            },
            pageBefore: function(){
                if (this.current_page == 1) {
                    alert('已经是第一页了');
                    return;
                }
                this.current_page -= 1;
            },
            pageAfter: function(){
                if (this.current_page == this.pages.length) {
                    alert('已经是最后页了');
                    return;
                }
                this.current_page += 1;
            },
            commit: function(){
                var _self = this;
                $.ajax({
                    url: "/api/v1.1/pay/new-item-search",
                    type: "GET",
                    data:{
                        word: _self.word,
                        search_type: _self.search_type
                    },
                    datatype:"JSON",
                    success: function(data) {
                        console.log(data);
                        _self.datas = data.data.datas;
                        _self.pages = data.data.pages;
                    }
                });
            },
            confirm:function(index, event){

                var confirm = event.srcElement.value;
                var obj = this.datas[index];
                var status = 0;
                if (confirm == 'yes') {
                    status = 1;
                } else if (confirm == 'no') {
                    status = 2;
                } else {
                    return;
                }
                $.ajax({
                    url: "/api/v1.1/pay/new-item",
                    type: "PATCH",
                    data:{
                        status: status,
                        uid: obj.uid,
                        id: obj.id
                    },
                    datatype:"JSON",
                    success: function(data) {
                        console.log(data);
                    }
                });
            },
            inputSearch: function(){
                this.word = $("#search").val();
            },
            selectVal:function(e){
                this.search_type = e.srcElement.value;
            }

        }
    });
});
