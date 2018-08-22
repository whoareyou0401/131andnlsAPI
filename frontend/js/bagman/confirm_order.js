(function(cmApp) {

    "use strict";
    var url = window.location.href;

    window.customer_id = Number(url.match(/(customer\/)\d+\//)[0].split('/')[1]);

    url = '/api/v1.2/recommendorder/bagman/' + window.customer_id + '/order';

    setupCSRF();

    Vue.filter('toFixed', function (num, precision) {
        return Number(Number(num).toFixed(precision));
    });
    document.body.addEventListener('touchstart', function () {});
    var bind = new Vue({
        el: '#order',
        data: {
            customer_name: "",
            phone: "",
            address: "",
            dealers: [],
            sum: 0,
            amount:0
        },
        methods: {
            init: function(){
                var _this = this;
                $.ajax({
                    url: '/api/v1.2/recommendorder/bagman/customer/' + window.customer_id + '/cart',
                    type: 'get',
                    success: function(data){
                        if (data.code === 0){
                            // _this.dealers = data.items;
                            var temp=[];
                            console.log(data.items);
                            for (var i=0;i<data.items.length;i++){
                                if (data.items[i].selected==true){
                                     temp.push(data.items[i]);
                                }
                            }
                            _this.dealers = temp;
                            _this.sum = data.sum;
                        }
                    }
                });
                $.ajax({
                    url: '/api/v1.2/recommendorder/bagman/customer/' + window.customer_id,
                    type: 'get',
                    success: function(data){
                        if (data.code === 0){
                            _this.customer_name = data.name;
                            _this.phone = data.phone;
                            _this.address = data.address;
                        }
                    }
                });
            },
            dhref: function(did){
                return "/recommendorder/dealer/" + did + "/customer/" + window.customer_id +"/bag-add-item";
            },
            commit: function(){
                $(".model").css("display", "block");
                console.log(this.dealers);
            },
            cancel: function(){
                $(".model").css("display", "none");
            },
            commit_confirm: function(){
                var dataToSend = {};
                if (this.dealers.length === 0) {
                    alert("无商品，请先在购物车添加商品!");
                    window.location.href =  "/recommendorder/dealer/" + did + "/customer/" + window.customer_id +"/bag-add-item";

                    return;
                }

                $.ajax({
                    url: url,
                    type: 'post',
                    data: dataToSend,
                    beforeSend: function(xhr,settings) {
                        var csrftoken = getCookie('csrftoken');
                        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                            xhr.setRequestHeader("X-CSRFToken", csrftoken);
                        }
                        $(".model").hide();
                        $('.loading_con_mid').show();
                    },
                    success: function(data){
                        $('.loading_con_mid').hide();
                        if (data.code === 0){
                            if (window.printer != null){
                                for(var i = 0; i < data.tokens.length; i++){
                                    window.printer.printReceipt(data.tokens[i]);
                                }
                            }

                            $('.order_success_model').show();
                            $('.order_know').on('click',function() {
                                $('.order_success_model').hide();
                                window.location.href = "/recommendorder/bagman/customer/" + window.customer_id + "/profile";
                            });

                        } else {
                            $('.order_failure_model').show();
                            $('.order_know').on('click',function() {
                                $('.order_failure_model').hide();
                                window.location.href = "/recommendorder/bagman/customer/" + window.customer_id + "/profile";
                            });
                        }
                    },
                    error: function(data){
                        $('.loading_con_mid').hide();
                        $('.order_failure_model').show();
                        $('.order_know').on('click',function() {
                            $('.order_failure_model').hide();
                            window.location.href = "/recommendorder/bagman/customer/" + window.customer_id + "/profile";
                        });
                    }
                });
            }

        }
    });

bind.init();
$('.home-info-nav-a1').click(function(){
    window.location.href="/recommendorder/bagman/customer/"+window.customer_id+"/cart";
});

})(window.cmApp = window.cmApp || {});