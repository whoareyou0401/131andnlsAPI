(function(cmApp) {

    "use strict";

    var url = window.location.href;
    var customer_id = Number(url.match(/(customer\/)\d+\//)[0].split("/")[1]);

    Vue.filter("toFixed", function (num, precision) {
        return Number(Number(num).toFixed(precision));
    });

    url = "/api/v1.1/recommendorder/customer/" + customer_id + "/dealer-list";
    
    var bind = new Vue({
        el: "#main",
        data: {
            dealers: [],
            isShowAdd:true,
            recommendUrl: "/recommendorder/customer/" + customer_id + "/recommend",
            customerProfile: "/recommendorder/customer/" + customer_id + "/profile",
            historyUrl: "/recommendorder/customer/" + customer_id + "/history"
        },
        beforeCreate: function(){
            var user_role = getCookie('user_role');
            if(user_role === "salesman"){
                $('.home-info-nav-a').show();
            }else if(user_role === "customer"){
                $('.add-nearbyDealer').show();
            }
        },
        methods: {
            init: function(){
                var _this = this;
                $.ajax({
                    url: url,
                    type: 'get',
                    success: function(data){
                        _this.dealers = data.dealers;
                        for(var i = 0;i<data.dealers.length;i++){
                            if(data.dealers[i].id === 12 || data.dealers[i].id === 1){
                                _this.isShowAdd = false;
                            }
                        }
                        if(_this.dealers.length === 0){
                            $('.blank').show();
                        }else{
                            $('.list-con').show();
                        }
                    }
                });
            },
            toDealerPage: function(dealer){
                console.log(dealer.id);
                if (dealer.orderable){
                    window.location.href = "/recommendorder/dealer/" + dealer.id +"/customer/" + customer_id + "/add-item";
                } else {
                    alert("商户" + dealer.name + "正在维护，请稍后再试。");
                }
            },
            dealerUrl: function(did){
                return "/recommendorder/dealer/" + did + "/customer/" + customer_id + "/add-item";
            },
            nearbyDealers: function(){
                window.location.href = "/recommendorder/customer/" + customer_id + "/nearby-dealers";
            },
            back: function(){
                window.location.href = "/recommendorder/salesman/customer-status";
            }
        }
    });

    bind.init();
})(window.cmApp = window.cmApp || {});