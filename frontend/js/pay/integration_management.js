$(function() {

     setupCSRF();
     var app = new Vue({
        el: '#app',
        data: {

            users: [],
            selects:[],
            integration:'',
            editableEnd: false
        },
        beforeCreate: function() {
            var _self = this;
            $.ajax({
                url: "/api/v1.1/pay/staff",
                type: "GET",
                datatype: "JSONP",
                success: function(data) {
                    _self.users = data.data;
                }
            });
        },
        watch:{

        },
        methods: {
            commitAvg:function(){
                setupCSRF();
                var avg = $("#avg").val();
                var integration = parseInt(avg)
                if (avg.length==0) {
                    alert('请输入积分');
                    return;
                };
                var _self = this;
                $.ajax({
                    url: "/api/v1.2/pay/staff-avg",
                    type: "POST",
                    data:{
                        avg: avg
                    },
                    datatype:"JSON",
                    success: function(data) {
                        _self.users = data.data;
                    }
                });
            },
            changeStatus:function(index){
                var uid = this.users[index].id;
                var _self = this;
                $.ajax({
                    url: "/api/v1.1/pay/staff",
                    type: "DELETE",
                    data:{
                            'uid': uid
                    },
                    datatype:"JSON",
                    success: function(data) {
                        if (data.code == 0){
                            alert('成功');
                            _self.users = data.data;
                        } else {
                            alert('失败');
                        }

                    }
                });
            },
            commit: function(){
                var _self = this;
                var jsonString = JSON.stringify(_self.users);
                $.ajax({
                    url: "/api/v1.1/pay/staff",
                    type: "POST",
                    data:{
                        data: jsonString
                    },
                    datatype:"JSON",
                    success: function(data) {
                        if (data.code == 0){
                            alert('成功');
                            _self.users = data.data;
                        } else {
                            alert('失败');
                        }

                    }
                });
            },
            inputSearch: function(){
                var _self = this;
                var word = $("#search").val();
                $.ajax({
                    url: "/api/v1.1/pay/staff-search",
                    type: "GET",
                    data:{
                        word: word
                    },
                    datatype:"JSON",
                    success: function(data) {
                        _self.users = data.data;
                    }
                });
            },
            inputIntergration:function(index){
                var integration = parseInt($('#'+index).val());
                this.users[index].integration = integration;
            }

        }
    });


});
