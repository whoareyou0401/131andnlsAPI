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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJwYXkvcmVhbHRpbWVfc2FsZXMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJChmdW5jdGlvbigpIHtcblxuICAgICBzZXR1cENTUkYoKTtcbiAgICAgdmFyIGFwcCA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogJyNhcHAnLFxuICAgICAgICBkYXRhOiB7XG5cbiAgICAgICAgICAgIHVzZXJzOiBbXSxcbiAgICAgICAgICAgIHNlbGVjdHM6W10sXG4gICAgICAgICAgICBtYXhfY29sdW1uczowLFxuICAgICAgICAgICAgbWF4X3Jvd3M6IDAsXG4gICAgICAgICAgICByb3dzOicwMDAwMC4wJyxcbiAgICAgICAgICAgIC8vIHJvd3M6WycwJywgJzAnLCAnMCcsICcwJywgJzAnLCAnLicsICcwJ10sXG4gICAgICAgICAgICBjb2x1bW5zOlsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4XVxuICAgICAgICB9LFxuICAgICAgICBiZWZvcmVDcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIF9zZWxmID0gdGhpcztcbiAgICAgICAgICAgIC8vICQuYWpheCh7XG4gICAgICAgICAgICAvLyAgICAgdXJsOiBcIi9hcGkvdjEuMS9wYXkvc3RhZmZcIixcbiAgICAgICAgICAgIC8vICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICAgICAgLy8gICAgIGRhdGF0eXBlOiBcIkpTT05QXCIsXG4gICAgICAgICAgICAvLyAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgX3NlbGYudXNlcnMgPSBkYXRhLmRhdGE7XG4gICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHdhdGNoOntcbiAgICAgICAgICAgIG1heF9yb3dzOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5tYXhfcm93cyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWF4X2NvbHVtbnM6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLm1heF9jb2x1bW5zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgY2hhbmdlUm93OiBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXhfcm93cyA9IGV2ZW50LnNyY0VsZW1lbnQudmFsdWU7XG4gICAgICAgICAgICAgICAgLy8gdmFyIF9zZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICAvLyB2YXIganNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KF9zZWxmLnVzZXJzKTtcbiAgICAgICAgICAgICAgICAvLyAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIC8vICAgICB1cmw6IFwiL2FwaS92MS4xL3BheS9zdGFmZlwiLFxuICAgICAgICAgICAgICAgIC8vICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICAvLyAgICAgZGF0YTp7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBkYXRhOiBqc29uU3RyaW5nXG4gICAgICAgICAgICAgICAgLy8gICAgIH0sXG4gICAgICAgICAgICAgICAgLy8gICAgIGRhdGF0eXBlOlwiSlNPTlwiLFxuICAgICAgICAgICAgICAgIC8vICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBpZiAoZGF0YS5jb2RlID09IDApe1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGFsZXJ0KCfmiJDlip8nKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBfc2VsZi51c2VycyA9IGRhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgYWxlcnQoJ+Wksei0pScpO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGFuZ2VDbHVtbjogZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgIHRoaXMubWF4X2NvbHVtbnMgPSBldmVudC5zcmNFbGVtZW50LnZhbHVlO1xuICAgICAgICAgICAgICAgIC8vIHZhciBfc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgLy8gdmFyIGpzb25TdHJpbmcgPSBKU09OLnN0cmluZ2lmeShfc2VsZi51c2Vycyk7XG4gICAgICAgICAgICAgICAgLy8gJC5hamF4KHtcbiAgICAgICAgICAgICAgICAvLyAgICAgdXJsOiBcIi9hcGkvdjEuMS9wYXkvc3RhZmZcIixcbiAgICAgICAgICAgICAgICAvLyAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgLy8gICAgIGRhdGE6e1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgZGF0YToganNvblN0cmluZ1xuICAgICAgICAgICAgICAgIC8vICAgICB9LFxuICAgICAgICAgICAgICAgIC8vICAgICBkYXRhdHlwZTpcIkpTT05cIixcbiAgICAgICAgICAgICAgICAvLyAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgaWYgKGRhdGEuY29kZSA9PSAwKXtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBhbGVydCgn5oiQ5YqfJyk7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgX3NlbGYudXNlcnMgPSBkYXRhLmRhdGE7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGFsZXJ0KCflpLHotKUnKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5wdXRTZWFyY2g6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIF9zZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICB2YXIgd29yZCA9ICQoXCIjc2VhcmNoXCIpLnZhbCgpO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjEvcGF5L3N0YWZmLXNlYXJjaFwiLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmQ6IHdvcmRcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YXR5cGU6XCJKU09OXCIsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLnVzZXJzID0gZGF0YS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5wdXRJbnRlcmdyYXRpb246ZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgICAgICAgICAgIHZhciBpbnRlZ3JhdGlvbiA9IHBhcnNlSW50KCQoJyMnK2luZGV4KS52YWwoKSk7XG4gICAgICAgICAgICAgICAgdGhpcy51c2Vyc1tpbmRleF0uaW50ZWdyYXRpb24gPSBpbnRlZ3JhdGlvbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfSk7XG5cblxufSk7XG4iXSwiZmlsZSI6InBheS9yZWFsdGltZV9zYWxlcy5qcyJ9
