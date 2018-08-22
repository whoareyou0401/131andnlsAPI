(function(cmApp) {

    "use strict";

    var url = window.location.href;
    var customer_id = Number(url.match(/(customer\/)\d+\//)[0].split("/")[1]);
    setupCSRF();
    Vue.filter("toFixed", function (num, precision) {
        return Number(Number(num).toFixed(precision));
    });

    url = "/api/v1.2/recommendorder/bagman/customer/" + customer_id + "/history";

    var bind = new Vue({
        el: '.home-con',
        data: {
            phone: '',
            name: '',
            address: '',
            orders: [],
            selectedItem:{},
            recommendUrl: "/recommendorder/customer/" + customer_id + "/recommend",
            customerProfile: "/recommendorder/bagman/customer/" + customer_id + "/profile",
            historyUrl: "/recommendorder/bagman/customer/" + customer_id + "/history",
            dealerListUrl : "/recommendorder/customer/" + customer_id + "/dealer-list",
            isloaded:false
        },
        watch: {
            isloaded: function(new_value,old_value) {
                if (new_value === true) {
                    $('.nm-con').css('display','block');
                }else if(new_value === false) {
                    $('.nm-con').css('display','none');
                }
            }
        },
        methods: {
            init: function(){
                var _this = this;
                $.ajax({
                    url: url,
                    type: 'get',
                    beforeSend: function(XMLHttpRequest) {
                        var loading_str = "<div class='loading_con'><div class='loading_img'></div><p class='loading_text'>" +
                        "正在加载，请稍后...</p></div>";
                        $('.loading_con_mid').append(loading_str);
                    },
                    success: function(data){
                        console.log(data);
                        _this.orders = data.orders;
                        _this.isloaded = true;
                        $('.loading_con_mid').remove();

                        $('.home-con-mid').on('click','.additional_order',function() {
                            var add_index = $(this).parents('.history-b').index();
                            _this.additional_order(_this.orders[add_index].append_able,_this.orders[add_index].status,_this.orders[add_index].dealer_id);
                        });
                        $('.home-con-mid').on('click','.again_purchase',function(){
                            var again_index = $(this).parents('.history-b').index();
                            var items = _this.orders[again_index].items;
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
                var url = '/api/v1.2/recommendorder/bagman/customer/' + customer_id + '/cart';;
                var _this = this;
                setupCSRF();
                $.ajax({
                    url: url,
                    type: 'post',
                    data: _this.selectedItem
                });
                window.location.href = '/recommendorder/bagman/customer/' + customer_id + '/cart';
            },
            //追加订单
            additional_order: function(append_able,status,dealer_id) {
                if(status === 1 || status === 2) {
                    if(append_able === true) {
                        window.location.href = "/recommendorder/dealer/" + dealer_id + "/customer/" + customer_id + "/bagman-add-item";
                    }else if(append_able === false) {
                        $('.additional_text').text('本次订单已超过30分钟啦，不能追加商品了，敬请谅解！');
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

})(window.cmApp = window.cmApp || {});
