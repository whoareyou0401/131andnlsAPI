(function(cmApp) {

    "use strict";

    var url = window.location.href;
    var customer_id = Number(url.match(/(customer\/)\d+\//)[0].split("/")[1]);
    setupCSRF();
    Vue.filter("toFixed", function (num, precision) {
        return Number(Number(num).toFixed(precision));
    });
    document.body.addEventListener('touchstart', function () {});
    url = "/api/v1.2/recommendorder/bagman/customer/" + customer_id;
    var headerVue = new Vue({
        el: "header",
        beforeCreate: function(){
            var user_role = getCookie('user_role');
            // this.isSalesman = user_role === "salesman";
            // this.isCustomer = user_role === "customer";
            if(user_role === "salesman"){
                $('.home-info-nav-a').show();
            }else if(user_role === "customer"){
                $('.home-setting').show();
            }
        },
        methods: {
            back: function(){
                window.location.href = "/recommendorder/salesman/bagman-customer-status";
            },
            setting: function(){
                window.location.href='/recommendorder/customer/' + customer_id + '/setting';
            }
        }
    });
    var bind = new Vue({
        el: '#profile',
        data: {
            phone: '',
            name: '',
            address: '',
            suborders: [],
            selectedItem:{},

            historyUrl: "/recommendorder/bagman/customer/" + customer_id + "/history"

        },
        methods: {
            'init': function(){
                var _this = this;
                $.ajax({
                    url: url,
                    type: 'get',
                    success: function(data){
                        console.log(data);
                        _this.phone = data.phone;
                        _this.name = data.name;
                        _this.address = data.address;
                        _this.suborders = data.last_order;
                        if(_this.suborders.length === 0){
                            $('.blank').show();
                        }else{
                            $('.home-con-mid').show();
                        }
                        $('.home-con-mid').on('click','.additional_order',function() {
                            var add_index = $(this).parents('.home-store').index();
                            console.log(add_index);
                            _this.additional_order(_this.suborders[add_index].append_able,_this.suborders[add_index].status,_this.suborders[add_index].dealer_id);
                        });
                        $('.home-con-mid').on('click','.again_purchase',function(){
                            var again_index = $(this).parents('.home-store').index();
                            var items = _this.suborders[again_index].items;
                            for(var item in items){
                                _this.addToSelectedItem(items[item]);
                            }
                            _this.confirmOrder();
                        });
                    }
                });
            },
            dealerUrl: function(did){
                return "/recommendorder/dealer/" + did + "/customer/" + customer_id + "/bagman-add-item";
            },
            //添加商品数据
            addToSelectedItem: function (item) {
                var _this = this;
                _this.selectedItem[item.id] = parseInt(item.num);
            },
            //添加并跳转到购物车订单页面
            confirmOrder: function () {

                setupCSRF();
                var url = '/api/v1.2/recommendorder/bagman/customer/' + customer_id + '/cart';
                var _this = this;
                $.ajax({
                    url: url,
                    type: 'post',
                    data: _this.selectedItem,
                    success: function(){
                        window.location.href = '/recommendorder/bagman/customer/' + customer_id + '/cart';
                    }
                });
            },
            //追加订单
            additional_order: function(append_able,status,dealer_id) {
                if(status === 1 || status === 2) {
                    if(append_able === true) {
                        window.location.href = "/recommendorder/dealer/" + dealer_id + "/customer/" + customer_id + "/bagman-add-item";
                    }else if(append_able === false) {
                        $('.additional_text').text('本次订单已超过20分钟啦，不能追加商品了，敬请谅解！');
                        $('.additional_order_model').show();
                        $('.know').on('click',function() {
                            $('.additional_order_model').hide();
                        });
                    }
                }else if(status === 0 || status === 3) {
                    $('.additional_text').text('本次订单失败啦，不能追加商品了，敬请谅解！');
                    $('.additional_order_model').show();
                    $('.know').on('click',function() {
                        $('.additional_order_model').hide();
                    });
                }
            }
        }
    });

bind.init();
$('.history').on('touchstart',function() {
    $(this).css('opacity','0.6');
});
$('.history').on('touchend',function() {
    $(this).css('opacity','1');
});


})(window.cmApp = window.cmApp || {});
