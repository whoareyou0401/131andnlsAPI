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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9zYWxlc21hbl9wcm9maWxlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbihjbUFwcCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICB2YXIgc2FsZXNtYW5faWQgPSBOdW1iZXIodXJsLm1hdGNoKC8oc2FsZXNtYW5cXC8pXFxkK1xcLy8pWzBdLnNwbGl0KCcvJylbMV0pO1xuICAgIFZ1ZS5maWx0ZXIoXCJ0b0ZpeGVkXCIsIGZ1bmN0aW9uIChudW0sIHByZWNpc2lvbikge1xuICAgICAgICByZXR1cm4gTnVtYmVyKE51bWJlcihudW0pLnRvRml4ZWQocHJlY2lzaW9uKSk7XG4gICAgfSk7XG4gICAgZnVuY3Rpb24gZ2V0Tm93Rm9ybWF0RGF0ZSgpIHtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB2YXIgc2VwZXJhdG9yMSA9IFwiLVwiO1xuICAgICAgICB2YXIgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgdmFyIG1vbnRoID0gZGF0ZS5nZXRNb250aCgpICsgMTtcbiAgICAgICAgdmFyIHN0ckRhdGUgPSBkYXRlLmdldERhdGUoKTtcbiAgICAgICAgaWYgKG1vbnRoID49IDEgJiYgbW9udGggPD0gOSkge1xuICAgICAgICAgICAgbW9udGggPSBcIjBcIiArIG1vbnRoO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdHJEYXRlID49IDAgJiYgc3RyRGF0ZSA8PSA5KSB7XG4gICAgICAgICAgICBzdHJEYXRlID0gXCIwXCIgKyBzdHJEYXRlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjdXJyZW50ZGF0ZSA9IHllYXIgKyBzZXBlcmF0b3IxICsgbW9udGggKyBzZXBlcmF0b3IxICsgc3RyRGF0ZTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRkYXRlO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRPbmVBZ29Gb3JtYXREYXRlKCkge1xuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHZhciBzZXBlcmF0b3IxID0gXCItXCI7XG4gICAgICAgIHZhciB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICB2YXIgbW9udGggPSBkYXRlLmdldE1vbnRoKCk7XG4gICAgICAgIHZhciBzdHJEYXRlID0gZGF0ZS5nZXREYXRlKCk7XG4gICAgICAgIGlmIChtb250aCA+PSAxICYmIG1vbnRoIDw9IDkpIHtcbiAgICAgICAgICAgIG1vbnRoID0gXCIwXCIgKyBtb250aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RyRGF0ZSA+PSAwICYmIHN0ckRhdGUgPD0gOSkge1xuICAgICAgICAgICAgc3RyRGF0ZSA9IFwiMFwiICsgc3RyRGF0ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY3VycmVudGRhdGUgPSB5ZWFyICsgc2VwZXJhdG9yMSArIG1vbnRoICsgc2VwZXJhdG9yMSArIHN0ckRhdGU7XG4gICAgICAgIHJldHVybiBjdXJyZW50ZGF0ZTtcbiAgICB9XG4gICAgdmFyIGFwcCA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogJyNhcHAnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBzYWxlc21hbjoge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwiTG9hZGluZ1wiLFxuICAgICAgICAgICAgICAgIGRlYWxlcjoge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkxvYWRpbmdcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvcmRlcnM6IFtdLFxuICAgICAgICAgICAgc2VsZWN0czpbeyduYW1lJzon5YWo6YOo6K6i5Y2VJywgJ3ZhbHVlJzowfSxcbiAgICAgICAgICAgICAgICAgICAgIHsnbmFtZSc6J+mXqOW6l+iuouWNlScsICd2YWx1ZSc6MX0sXG4gICAgICAgICAgICAgICAgICAgICB7J25hbWUnOifovabplIDorqLljZUnLCAndmFsdWUnOjJ9XSxcbiAgICAgICAgICAgIHNlbGVjdF9uYW1lOiAn5YWo6YOo6K6i5Y2VJyxcbiAgICAgICAgICAgIGlzX3Nob3c6IGZhbHNlLFxuICAgICAgICAgICAgc2VsZWN0X3R5cGU6IDAsXG4gICAgICAgICAgICBzdGFydERhdGU6Z2V0T25lQWdvRm9ybWF0RGF0ZSgpLFxuICAgICAgICAgICAgZW5kRGF0ZTpnZXROb3dGb3JtYXREYXRlKCksXG4gICAgICAgICAgICBlZGl0YWJsZVN0YXJ0OiBmYWxzZSxcbiAgICAgICAgICAgIGVkaXRhYmxlRW5kOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBiZWZvcmVDcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIF9zZWxmID0gdGhpcztcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBcIi9yZWNvbW1lbmRvcmRlci9hcGkvdjEvc2FsZXNtYW4vXCIgKyBzYWxlc21hbl9pZCxcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgIGRhdGF0eXBlOiBcIkpTT05QXCIsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBfc2VsZi5zYWxlc21hbiA9IGRhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgX3NlbGYuZ2V0Q2hhbmdlRGF0YShfc2VsZi5zZWxlY3RfdHlwZSwgX3NlbGYuc3RhcnREYXRlLCBfc2VsZi5lbmREYXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgY2hhbmdlU2VsZWN0OiBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIF9zZWxmLnNlbGVjdF9uYW1lID0gX3NlbGYuc2VsZWN0c1tlLnRhcmdldC52YWx1ZV0ubmFtZTtcbiAgICAgICAgICAgICAgICBfc2VsZi5pc19zaG93ID0gIV9zZWxmLmlzX3Nob3c7XG4gICAgICAgICAgICAgICAgX3NlbGYuc2VsZWN0X3R5cGUgPSBfc2VsZi5zZWxlY3RzW2UudGFyZ2V0LnZhbHVlXS52YWx1ZTtcbiAgICAgICAgICAgICAgICBfc2VsZi5nZXRDaGFuZ2VEYXRhKF9zZWxmLnNlbGVjdF90eXBlLCBfc2VsZi5zdGFydERhdGUsIF9zZWxmLmVuZERhdGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldENoYW5nZURhdGE6IGZ1bmN0aW9uKHR5cGUsIHN0YXJ0X3RpbWUsIGVuZF90aW1lKXtcbiAgICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjMvcmVjb21tZW5kb3JkZXIvZGVhbGVyL1wiICsgX3NlbGYuc2FsZXNtYW4uZGVhbGVyLmlkICsgXCIvc2FsZXNtYW4vXCIgKyBzYWxlc21hbl9pZCArIFwiL3N1Ym9yZGVyXCIsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0YXJ0X3RpbWUnOiBzdGFydF90aW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2VuZF90aW1lJzogZW5kX3RpbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6IHR5cGVcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YXR5cGU6IFwiSlNPTlBcIixcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYub3JkZXJzID0gZGF0YS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2hvd1NlbGVjdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgX3NlbGYuaXNfc2hvdyA9ICFfc2VsZi5pc19zaG93O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoYW5nZVN0YXJ0RGF0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIF9zZWxmLnNob3dfc3RhcnQgPSAhX3NlbGYuc2hvd19zdGFydDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoYW5kbGVTdGFydERhdGU6IGZ1bmN0aW9uIChkYXRlKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9zZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBfc2VsZi5zdGFydERhdGUgPSBkYXRlO1xuICAgICAgICAgICAgICAgIF9zZWxmLmdldENoYW5nZURhdGEoX3NlbGYuc2VsZWN0X3R5cGUsIF9zZWxmLnN0YXJ0RGF0ZSwgX3NlbGYuZW5kRGF0ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGFuZGxlRW5kRGF0ZTogZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIF9zZWxmLmVuZERhdGUgPSBkYXRlO1xuICAgICAgICAgICAgICAgIF9zZWxmLmdldENoYW5nZURhdGEoX3NlbGYuc2VsZWN0X3R5cGUsIF9zZWxmLnN0YXJ0RGF0ZSwgX3NlbGYuZW5kRGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn0pKHdpbmRvdy5jbUFwcCA9IHdpbmRvdy5jbUFwcCB8fCB7fSk7Il0sImZpbGUiOiJyZWNvbW1lbmRvcmRlci9zYWxlc21hbl9wcm9maWxlLmpzIn0=
