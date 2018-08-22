(function(cmApp) {
    'use strict';

    setupCSRF();
    var url = '/api/v1.2/recommendorder/bagman/customer/' + window.customer_id + '/cart';

    Vue.filter('toFixed', function (num, precision) {
        return Number(Number(num).toFixed(precision));
    });

    var headerVue = new Vue({
        el: "header",
        beforeCreate: function(){
            var user_role = getCookie('user_role');
            this.isSalesman = user_role === "salesman";
        },
        data: {
            addGifts: ""
        },
        methods: {
            back: function(){
                self.location = document.referrer;
            },
            addGift: function(){
                window.location.href = "/recommendorder/customer/" + window.customer_id + "/add-gift";
            }
        }
    });

    var bind = new Vue({
        el: '#cart-items',
        data: {
            dealers: [],
            insufficient_items: [],
            bus_hr_from: "",
            bus_hr_to: "",
            sum: 0,
            recommendUrl: "/recommendorder/customer/" + window.customer_id + "/recommend",
            customerProfile: "/recommendorder/bagman/customer/" + window.customer_id + "/profile",
            dealerListUrl : "/recommendorder/customer/" + window.customer_id + "/dealer-list",
        },
        watch: {
            sum: function(new_value,old_value) {
                if (new_value > 0 ) {
                    $('#placeorder').css('background','#ff4a0c');
                }else if(new_value === 0) {
                    $('#placeorder').css('background','#dbdbdb');
                }
            }
        },
        methods: {
            init: function(){
                var _this = this;
                $.ajax({
                    url: url,
                    type: 'get',
                    success: function(data){
                        console.log(data)
                        _this.dealers = data.items;
                        _this.sum = data.sum;
                        if(_this.dealers.length === 0){
                            $('.blank').show();
                        }else{
                            $('.dealers-con').show();
                        }
                        if (_this.sum > 0 ) {
                            $('#placeorder').css('background','#ff4a0c');
                        }else if(_this.sum === 0) {
                            $('#placeorder').css('background','#dbdbdb');
                        }

                    }

                });
            },
            add: function(item, num){
                var _this = this;
                var dataToSend = {};
                setupCSRF();
                dataToSend[item.item_id] = num;
                $.ajax({
                    url: url,
                    type: 'put',
                    data: dataToSend,
                    success: function(data){
                        _this.init();
                    }
                });
            },
            set: function($event, item){
                setupCSRF();
                var _this = this;
                var dataToSend = {};
                dataToSend[item.item_id] = event.target.value;
                console.log(item.is_giveaway);
                $.ajax({
                    url: url,
                    type: 'post',
                    data: dataToSend,
                    success: function(data){
                        _this.init();
                    }
                });
            },
            dAllSelected: function(did){
                for(var i = 0; i < this.dealers.length; i++){
                    if (this.dealers[i].id !== did && did !== undefined)
                        continue;

                        if (this.dealers[i].selected === false){
                            return false;
                        }

                }
                return true;
            },
            dSelectAll: function($event, did){
                var _this = this;
                var dataToSend = {};
                dataToSend.items = [];
                var current = true;
                var i, j;
                for(i = 0; i < this.dealers.length; i++){
                    if (this.dealers[i].id !== did && did !== undefined)
                        continue;

                        if (this.dealers[i].selected === false){
                            current = false;
                            break;
                        }

                }
                for(i = 0; i < this.dealers.length; i++){
                    if (this.dealers[i].id !== did && did !== undefined)
                        continue;

                        if (this.dealers[i].selected === current){
                            dataToSend.items.push(this.dealers[i].item_id);
                        }

                }
                setupCSRF();
                $.ajax({
                    url: url,
                    type: 'patch',
                    data: dataToSend,
                    success: function(data){
                        _this.init();
                    }
                });
            },
            select: function($event, item_id){
                var _this = this;
                var dataToSend = {};
                setupCSRF();
                dataToSend.items = [item_id];
                $.ajax({
                    url: url,
                    type: 'patch',
                    data: dataToSend,
                    success: function(data){
                        _this.init();
                    }
                });
            },
            sendChecked: function(initial_price, amount){
                return {
                    send_no: initial_price > amount,
                    send_checked: initial_price <= amount
                };
            },
            dhref: function(did){
                return "/recommendorder/dealer/" + did + "/customer/" + window.customer_id +"/bagman-add-item";
            },
            confirmOrder: function(){
                 window.location.href = "/recommendorder/bagman/customer/" + window.customer_id + "/confirm-order";
                // var _this = this
                // if (this.dealers.length === 0){
                //     // alert("无商品");
                //     return;
                // }
                // if(_this.sum === 0){
                //     // $('#placeorder').css('background','#dbdbdb');
                //     return;
                // }
                // for(var i = 0; i < this.dealers.length; i++){
                //     if(this.dealers[i].amount < this.dealers[i].initial_price && this.dealers[i].amount!=0){
                //         alert("在" + this.dealers[i].name + "的订单未达到起送金额!");
                //         return;
                //     }

                //     var d = new Date();
                //     var min_of_day = d.getMinutes() + d.getHours() * 60;
                //     var from = this.dealers[i].bus_hr_from;
                //     var to = this.dealers[i].bus_hr_to;
                //     if(from !== null && to !== null && this.dealers[i].amount != 0) {
                //         if (from < to && (min_of_day < from || min_of_day > to)) {
                //             alert("每日" + intPad(Math.floor(to / 60), 2) + ":" + intPad(to % 60, 2) + " ~ 次日" + intPad(Math.floor(from / 60), 2) + ":" + intPad(from % 60, 2)
                //                 + this.dealers[i].name + "下单系统升级， 不能提供网购下单服务，敬请谅解 ");
                //             return;
                //         } else if (from > to && (min_of_day> to && min_of_day < from)){
                //             alert("每日" + intPad(Math.floor(to / 60), 2) + ":" + intPad(to % 60, 2) + " ~ " + intPad(Math.floor(from / 60), 2) + ":" + intPad(from % 60, 2)
                //                 + this.dealers[i].name + "下单系统升级， 不能提供网购下单服务，敬请谅解 ");
                //             return;
                //         }
                //     }
                // }
                // $.ajax({
                //     url: '/api/v1.1/recommendorder/customer/' + window.customer_id + '/check-cart',
                //     type: 'get',
                //     success: function(data){
                //         if (data.items.length > 0){
                //             _this.insufficient_items = data.items;
                //             $('.del-understock-model').show();
                //             $('footer').addClass('gs-blur');
                //             // alert("部分商品暂时缺货，请修改数量后再进行下单。");
                //             return;
                //         } else {
                //             window.location.href = "/recommendorder/customer/" + window.customer_id + "/confirm-order";

                //         }
                //     }
                // });

            },
            // cancelDeleteInsItems: function(){

            //     $('.model ').css({
            //         'display':'none'
            //     });
            // },
            // deleteInsItems: function(){
            //     var _this = this;
            //     $('.model ').css({
            //         'display':'none'
            //     });
            //     var dataToSend = {'items': []};
            //     var i, j;
            //     console.log(this.insufficient_items);
            //     for(i = 0; i < this.insufficient_items.length; i++){
            //         for(j = 0; j < this.insufficient_items[i].items.length; j++){
            //             dataToSend.items.push(this.insufficient_items[i].items[j].id);
            //         }
            //     }
            //     $.ajax({
            //         url: url,
            //         type: 'delete',
            //         data: dataToSend,
            //         success: function(data){
            //             _this.init();
            //         }
            //     });
            // },
            giveawayIconSrc: function(price){
                return "/static/images/recommendorder/full_" + Number(price).toFixed(0) + ".png"
            },
            closeDeleteInsItems: function(){
                $('footer').removeClass('gs-blur');
                $('.del-understock-model').hide();
            },
            clearUnderstock: function(){
                var _this = this;
                $('footer').removeClass('gs-blur');
                $('.del-understock-model').hide();
                var dataToSend = {'items': []};
                var i, j;
                for(i = 0; i < this.insufficient_items.length; i++){
                    for(j = 0; j < this.insufficient_items[i].items.length; j++){
                        dataToSend.items.push(this.insufficient_items[i].items[j].id);
                    }
                }
                $.ajax({
                    url: url,
                    type: 'delete',
                    data: dataToSend,
                    success: function(data){
                        $('.understock-model').show();
                        setTimeout(function() {
                            $('.understock-model').hide();
                        },1000)
                        _this.init();
                    }
                });
            },
            addProduct:function(){
                window.location.href = "/recommendorder/customer/" + window.customer_id + "/dealer-list";
            }
        }
    });

bind.init();

})(window.cmApp = window.cmApp || {});

