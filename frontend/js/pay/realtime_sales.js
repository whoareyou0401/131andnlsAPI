$(function() {

     setupCSRF();
     var app = new Vue({
        el: '#app',
        data: {

            users: [],
            selects:[],
            max_columns:0,
            max_rows: 0,
            rows:'00000.0',
            // rows:['0', '0', '0', '0', '0', '.', '0'],
            columns:[1, 2, 3, 4, 5, 6, 7, 8]
        },
        beforeCreate: function() {
            var _self = this;
            // $.ajax({
            //     url: "/api/v1.1/pay/staff",
            //     type: "GET",
            //     datatype: "JSONP",
            //     success: function(data) {
            //         console.log(data);
            //         _self.users = data.data;
            //     }
            // });
        },
        watch:{
            max_rows:function(){
                console.log(this.max_rows);
            },
            max_columns:function(){
                console.log(this.max_columns);
            }
        },
        methods: {
            changeRow: function(event){
                this.max_rows = event.srcElement.value;
                // var _self = this;
                // var jsonString = JSON.stringify(_self.users);
                // $.ajax({
                //     url: "/api/v1.1/pay/staff",
                //     type: "POST",
                //     data:{
                //         data: jsonString
                //     },
                //     datatype:"JSON",
                //     success: function(data) {
                //         if (data.code == 0){
                //             alert('成功');
                //             _self.users = data.data;
                //         } else {
                //             alert('失败');
                //         }

                //     }
                // });
            },
            changeClumn: function(event){
                this.max_columns = event.srcElement.value;
                // var _self = this;
                // var jsonString = JSON.stringify(_self.users);
                // $.ajax({
                //     url: "/api/v1.1/pay/staff",
                //     type: "POST",
                //     data:{
                //         data: jsonString
                //     },
                //     datatype:"JSON",
                //     success: function(data) {
                //         if (data.code == 0){
                //             alert('成功');
                //             _self.users = data.data;
                //         } else {
                //             alert('失败');
                //         }

                //     }
                // });
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
