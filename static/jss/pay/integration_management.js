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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJwYXkvaW50ZWdyYXRpb25fbWFuYWdlbWVudC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIkKGZ1bmN0aW9uKCkge1xuXG4gICAgIHNldHVwQ1NSRigpO1xuICAgICB2YXIgYXBwID0gbmV3IFZ1ZSh7XG4gICAgICAgIGVsOiAnI2FwcCcsXG4gICAgICAgIGRhdGE6IHtcblxuICAgICAgICAgICAgdXNlcnM6IFtdLFxuICAgICAgICAgICAgc2VsZWN0czpbXSxcbiAgICAgICAgICAgIGludGVncmF0aW9uOicnLFxuICAgICAgICAgICAgZWRpdGFibGVFbmQ6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIGJlZm9yZUNyZWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4xL3BheS9zdGFmZlwiLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgICAgICAgICAgZGF0YXR5cGU6IFwiSlNPTlBcIixcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIF9zZWxmLnVzZXJzID0gZGF0YS5kYXRhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICB3YXRjaDp7XG5cbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgY29tbWl0QXZnOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgc2V0dXBDU1JGKCk7XG4gICAgICAgICAgICAgICAgdmFyIGF2ZyA9ICQoXCIjYXZnXCIpLnZhbCgpO1xuICAgICAgICAgICAgICAgIHZhciBpbnRlZ3JhdGlvbiA9IHBhcnNlSW50KGF2ZylcbiAgICAgICAgICAgICAgICBpZiAoYXZnLmxlbmd0aD09MCkge1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgn6K+36L6T5YWl56ev5YiGJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMi9wYXkvc3RhZmYtYXZnXCIsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgICAgIGF2ZzogYXZnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGF0eXBlOlwiSlNPTlwiLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi51c2VycyA9IGRhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoYW5nZVN0YXR1czpmdW5jdGlvbihpbmRleCl7XG4gICAgICAgICAgICAgICAgdmFyIHVpZCA9IHRoaXMudXNlcnNbaW5kZXhdLmlkO1xuICAgICAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMS9wYXkvc3RhZmZcIixcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJERUxFVEVcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YTp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3VpZCc6IHVpZFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhdHlwZTpcIkpTT05cIixcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuY29kZSA9PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn5oiQ5YqfJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYudXNlcnMgPSBkYXRhLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCflpLHotKUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29tbWl0OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdmFyIGpzb25TdHJpbmcgPSBKU09OLnN0cmluZ2lmeShfc2VsZi51c2Vycyk7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMS9wYXkvc3RhZmZcIixcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToganNvblN0cmluZ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhdHlwZTpcIkpTT05cIixcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuY29kZSA9PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn5oiQ5YqfJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYudXNlcnMgPSBkYXRhLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCflpLHotKUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5wdXRTZWFyY2g6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIF9zZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICB2YXIgd29yZCA9ICQoXCIjc2VhcmNoXCIpLnZhbCgpO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjEvcGF5L3N0YWZmLXNlYXJjaFwiLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmQ6IHdvcmRcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YXR5cGU6XCJKU09OXCIsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLnVzZXJzID0gZGF0YS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5wdXRJbnRlcmdyYXRpb246ZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgICAgICAgICAgIHZhciBpbnRlZ3JhdGlvbiA9IHBhcnNlSW50KCQoJyMnK2luZGV4KS52YWwoKSk7XG4gICAgICAgICAgICAgICAgdGhpcy51c2Vyc1tpbmRleF0uaW50ZWdyYXRpb24gPSBpbnRlZ3JhdGlvbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfSk7XG5cblxufSk7XG4iXSwiZmlsZSI6InBheS9pbnRlZ3JhdGlvbl9tYW5hZ2VtZW50LmpzIn0=
