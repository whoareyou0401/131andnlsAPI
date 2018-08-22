(function(cmApp) {
    "use strict";
    var url = window.location.href;
    var salesman_id = Number(url.match(/(salesman\/)\d+\//)[0].split('/')[1]);
    Vue.filter("toFixed", function (num, precision) {
        return Number(Number(num).toFixed(precision));
    });
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }
    function getOneAgoFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth();
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }
    var app = new Vue({
        el: '#app',
        data: {
            salesman: {
                name: "Loading",
                dealer: {
                    name: "Loading"
                }
            },
            orders: [],
            selects:[{'name':'全部订单', 'value':0},
                     {'name':'门店订单', 'value':1},
                     {'name':'车销订单', 'value':2}],
            select_name: '全部订单',
            is_show: false,
            select_type: 0,
            startDate:getOneAgoFormatDate(),
            endDate:getNowFormatDate(),
            editableStart: false,
            editableEnd: false
        },
        beforeCreate: function() {
            var _self = this;
            $.ajax({
                url: "/recommendorder/api/v1/salesman/" + salesman_id,
                type: "GET",
                datatype: "JSONP",
                success: function(data) {
                    _self.salesman = data.data;
                    _self.getChangeData(_self.select_type, _self.startDate, _self.endDate);
                }
            });
        },
        methods: {
            changeSelect: function(e){
                var _self = this;
                _self.select_name = _self.selects[e.target.value].name;
                _self.is_show = !_self.is_show;
                _self.select_type = _self.selects[e.target.value].value;
                _self.getChangeData(_self.select_type, _self.startDate, _self.endDate);
            },
            getChangeData: function(type, start_time, end_time){
                var _self = this;
                $.ajax({
                    url: "/api/v1.3/recommendorder/dealer/" + _self.salesman.dealer.id + "/salesman/" + salesman_id + "/suborder",
                    type: "GET",
                    data:{
                        'start_time': start_time,
                        'end_time': end_time,
                        'type': type
                    },
                    datatype: "JSONP",
                    success: function(data) {
                        _self.orders = data.data;
                    }
                });
            },
            showSelect: function () {
                var _self = this;
                _self.is_show = !_self.is_show;
            },
            changeStartDate: function(){
                var _self = this;
                _self.show_start = !_self.show_start;
            },
            handleStartDate: function (date) {
                var _self = this;
                _self.startDate = date;
                _self.getChangeData(_self.select_type, _self.startDate, _self.endDate);
            },
            handleEndDate: function (date) {
                var _self = this;
                _self.endDate = date;
                _self.getChangeData(_self.select_type, _self.startDate, _self.endDate);
            }
        }
    });
})(window.cmApp = window.cmApp || {});