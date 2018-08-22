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