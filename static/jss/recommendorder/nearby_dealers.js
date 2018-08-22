(function(cmApp) {

    "use strict";
    var map, geolocation;
    map = new AMap.Map("null", {
    });
    map.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            convert: true
        });
    });

    var url = window.location.href;
    var customer_id = Number(url.match(/(customer\/)\d+\//)[0].split("/")[1]);

    Vue.filter("toFixed", function(num, precision) {
        return Number(Number(num).toFixed(precision));
    });

    url = "/api/v1.1/recommendorder/customer/" + customer_id + "/nearby-dealers";

    var bind = new Vue({
        el: "#main",
        data: {
            dealers: [],
            recommendUrl: "/recommendorder/customer/" + customer_id + "/recommend",
            customerProfile: "/recommendorder/customer/" + customer_id + "/profile",
            historyUrl: "/recommendorder/customer/" + customer_id + "/history"
        },
        methods: {
            init: function(position) {
                var _this = this;
                $.ajax({
                    url: url,
                    data: position,
                    type: 'get',
                    success: function(data) {
                        _this.dealers = data.dealers;
                        for(var dealerItem in _this.dealers){
                            if(_this.dealers[dealerItem].status === -1){
                                _this.dealers.length-=1;
                            }
                        }
                        if(_this.dealers.length === 0){
                            $('.blank').show();
                        }else{
                            $('.list-con').show();
                        }
                        var cookies = getCookie('user_role');
                    }
                });
            },
            toDealerPage: function(dealer) {
                if (dealer.orderable) {
                    window.location.href = "/recommendorder/dealer/" + dealer.id + "/customer/" + customer_id + "/add-item";
                } else {
                    alert("商户" + dealer.name + "正在维护，请稍后再试。");
                }
            },
            dealerUrl: function(did) {
                return "/recommendorder/dealer/" + did + "/customer/" + customer_id + "/add-item";
            },
            applyDealer: function(dealer) {
                window.location.href = "/recommendorder/customer/" + customer_id+ "/dealer/" + dealer.id + "/apply-dealer";
            },
            backOff: function() {
                window.location.href = "/recommendorder/customer/" + customer_id + "/dealer-list";
            }
        }
    });
    function getLocation()
    {
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(function(position){
                bind.init({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            });
        }
        else
        {
            alert("该浏览器不支持获取地理位置。");
        }
    }

    try {
        geolocation.getCurrentPosition(function(status, result){
            if (status === 'complete'){
                bind.init({
                    lat: result.position.lat,
                    lng: result.position.lng
                });
            } else {
                alert("定位失败，请刷新后再试。")
            }

            console.log(status, result);
        });
    } catch (e) {
        console.log(e);
        getLocation();
    }

})(window.cmApp = window.cmApp || {});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9uZWFyYnlfZGVhbGVycy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oY21BcHApIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBtYXAsIGdlb2xvY2F0aW9uO1xuICAgIG1hcCA9IG5ldyBBTWFwLk1hcChcIm51bGxcIiwge1xuICAgIH0pO1xuICAgIG1hcC5wbHVnaW4oJ0FNYXAuR2VvbG9jYXRpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZ2VvbG9jYXRpb24gPSBuZXcgQU1hcC5HZW9sb2NhdGlvbih7XG4gICAgICAgICAgICBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWUsIC8v5piv5ZCm5L2/55So6auY57K+5bqm5a6a5L2N77yM6buY6K6kOnRydWVcbiAgICAgICAgICAgIGNvbnZlcnQ6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB2YXIgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgdmFyIGN1c3RvbWVyX2lkID0gTnVtYmVyKHVybC5tYXRjaCgvKGN1c3RvbWVyXFwvKVxcZCtcXC8vKVswXS5zcGxpdChcIi9cIilbMV0pO1xuXG4gICAgVnVlLmZpbHRlcihcInRvRml4ZWRcIiwgZnVuY3Rpb24obnVtLCBwcmVjaXNpb24pIHtcbiAgICAgICAgcmV0dXJuIE51bWJlcihOdW1iZXIobnVtKS50b0ZpeGVkKHByZWNpc2lvbikpO1xuICAgIH0pO1xuXG4gICAgdXJsID0gXCIvYXBpL3YxLjEvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyBjdXN0b21lcl9pZCArIFwiL25lYXJieS1kZWFsZXJzXCI7XG5cbiAgICB2YXIgYmluZCA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogXCIjbWFpblwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBkZWFsZXJzOiBbXSxcbiAgICAgICAgICAgIHJlY29tbWVuZFVybDogXCIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyBjdXN0b21lcl9pZCArIFwiL3JlY29tbWVuZFwiLFxuICAgICAgICAgICAgY3VzdG9tZXJQcm9maWxlOiBcIi9yZWNvbW1lbmRvcmRlci9jdXN0b21lci9cIiArIGN1c3RvbWVyX2lkICsgXCIvcHJvZmlsZVwiLFxuICAgICAgICAgICAgaGlzdG9yeVVybDogXCIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyBjdXN0b21lcl9pZCArIFwiL2hpc3RvcnlcIlxuICAgICAgICB9LFxuICAgICAgICBtZXRob2RzOiB7XG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbihwb3NpdGlvbikge1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuZGVhbGVycyA9IGRhdGEuZGVhbGVycztcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgZGVhbGVySXRlbSBpbiBfdGhpcy5kZWFsZXJzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihfdGhpcy5kZWFsZXJzW2RlYWxlckl0ZW1dLnN0YXR1cyA9PT0gLTEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5kZWFsZXJzLmxlbmd0aC09MTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihfdGhpcy5kZWFsZXJzLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmJsYW5rJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmxpc3QtY29uJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvb2tpZXMgPSBnZXRDb29raWUoJ3VzZXJfcm9sZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9EZWFsZXJQYWdlOiBmdW5jdGlvbihkZWFsZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGVhbGVyLm9yZGVyYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL3JlY29tbWVuZG9yZGVyL2RlYWxlci9cIiArIGRlYWxlci5pZCArIFwiL2N1c3RvbWVyL1wiICsgY3VzdG9tZXJfaWQgKyBcIi9hZGQtaXRlbVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi5ZWG5oi3XCIgKyBkZWFsZXIubmFtZSArIFwi5q2j5Zyo57u05oqk77yM6K+356iN5ZCO5YaN6K+V44CCXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZWFsZXJVcmw6IGZ1bmN0aW9uKGRpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIi9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIgKyBkaWQgKyBcIi9jdXN0b21lci9cIiArIGN1c3RvbWVyX2lkICsgXCIvYWRkLWl0ZW1cIjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhcHBseURlYWxlcjogZnVuY3Rpb24oZGVhbGVyKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9yZWNvbW1lbmRvcmRlci9jdXN0b21lci9cIiArIGN1c3RvbWVyX2lkKyBcIi9kZWFsZXIvXCIgKyBkZWFsZXIuaWQgKyBcIi9hcHBseS1kZWFsZXJcIjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiYWNrT2ZmOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiICsgY3VzdG9tZXJfaWQgKyBcIi9kZWFsZXItbGlzdFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgZnVuY3Rpb24gZ2V0TG9jYXRpb24oKVxuICAgIHtcbiAgICAgICAgaWYgKG5hdmlnYXRvci5nZW9sb2NhdGlvbilcbiAgICAgICAge1xuICAgICAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbihwb3NpdGlvbil7XG4gICAgICAgICAgICAgICAgYmluZC5pbml0KHtcbiAgICAgICAgICAgICAgICAgICAgbGF0OiBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsXG4gICAgICAgICAgICAgICAgICAgIGxuZzogcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBhbGVydChcIuivpea1j+iniOWZqOS4jeaUr+aMgeiOt+WPluWcsOeQhuS9jee9ruOAglwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAgIGdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbihzdGF0dXMsIHJlc3VsdCl7XG4gICAgICAgICAgICBpZiAoc3RhdHVzID09PSAnY29tcGxldGUnKXtcbiAgICAgICAgICAgICAgICBiaW5kLmluaXQoe1xuICAgICAgICAgICAgICAgICAgICBsYXQ6IHJlc3VsdC5wb3NpdGlvbi5sYXQsXG4gICAgICAgICAgICAgICAgICAgIGxuZzogcmVzdWx0LnBvc2l0aW9uLmxuZ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbGVydChcIuWumuS9jeWksei0pe+8jOivt+WIt+aWsOWQjuWGjeivleOAglwiKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzdGF0dXMsIHJlc3VsdCk7XG4gICAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgIGdldExvY2F0aW9uKCk7XG4gICAgfVxuXG59KSh3aW5kb3cuY21BcHAgPSB3aW5kb3cuY21BcHAgfHwge30pOyJdLCJmaWxlIjoicmVjb21tZW5kb3JkZXIvbmVhcmJ5X2RlYWxlcnMuanMifQ==
