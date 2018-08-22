(function(cmApp) {
    'use strict';

    setupCSRF();
    var url =  "/api/v1.2/recommendorder/bagman/customer/" + window.customer_id + "/cart";

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
                window.location.href = "/recommendorder/salesman/customer-status";
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
            customerProfile: "/recommendorder/customer/" + window.customer_id + "/profile",
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
                dataToSend[item.item_id] = num;
                var _url = "/api/v1.2/recommendorder/bagman/customer/" + window.customer_id + "/cart";
                $.ajax({
                    url: _url,
                    type: 'put',
                    data: dataToSend,
                    success: function(data){
                        _this.init();
                    }
                });
            },
            set: function($event, item){
                var _this = this;
                var dataToSend = {};
                dataToSend[item.item_id] = event.target.value;
                console.log(item.is_giveaway);
                var _url = "/api/v1.2/recommendorder/bagman/customer/" + window.customer_id + "/cart";
                $.ajax({
                    url: _url,
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
                    for(var j = 0; j < this.dealers[i].items.length; j++){
                        if (this.dealers[i].items[j].selected === false){
                            return false;
                        }
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
                    for(j = 0; j < this.dealers[i].items.length; j++){
                        if (this.dealers[i].items[j].selected === false){
                            current = false;
                            break;
                        }
                    }
                }
                for(i = 0; i < this.dealers.length; i++){
                    if (this.dealers[i].id !== did && did !== undefined)
                        continue;
                    for(j = 0; j < this.dealers[i].items.length; j++){
                        if (this.dealers[i].items[j].selected === current){
                            dataToSend.items.push(this.dealers[i].items[j].item_id);
                        }
                    }
                }
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
                return "/recommendorder/dealer/" + did + "/customer/" + window.customer_id +"/add-item";
            },
            // 无用的
            confirmOrder: function(){
                var _this = this
                if (this.dealers.length === 0){
                    // alert("无商品");
                    return;
                }
                if(_this.sum === 0){
                    // $('#placeorder').css('background','#dbdbdb');
                    return;
                }
                for(var i = 0; i < this.dealers.length; i++){
                    if(this.dealers[i].amount < this.dealers[i].initial_price && this.dealers[i].amount!=0){
                        alert("在" + this.dealers[i].name + "的订单未达到起送金额!");
                        return;
                    }

                    var d = new Date();
                    var min_of_day = d.getMinutes() + d.getHours() * 60;
                    var from = this.dealers[i].bus_hr_from;
                    var to = this.dealers[i].bus_hr_to;
                    if(from !== null && to !== null && this.dealers[i].amount != 0) {
                        if (from < to && (min_of_day < from || min_of_day > to)) {
                            alert("每日" + intPad(Math.floor(to / 60), 2) + ":" + intPad(to % 60, 2) + " ~ 次日" + intPad(Math.floor(from / 60), 2) + ":" + intPad(from % 60, 2)
                                + this.dealers[i].name + "下单系统升级， 不能提供网购下单服务，敬请谅解 ");
                            return;
                        } else if (from > to && (min_of_day> to && min_of_day < from)){
                            alert("每日" + intPad(Math.floor(to / 60), 2) + ":" + intPad(to % 60, 2) + " ~ " + intPad(Math.floor(from / 60), 2) + ":" + intPad(from % 60, 2)
                                + this.dealers[i].name + "下单系统升级， 不能提供网购下单服务，敬请谅解 ");
                            return;
                        }
                    }
                }
                $.ajax({
                    url: '/api/v1.1/recommendorder/customer/' + window.customer_id + '/check-cart',
                    type: 'get',
                    success: function(data){
                        if (data.items.length > 0){
                            _this.insufficient_items = data.items;
                            $('.del-understock-model').show();
                            $('footer').addClass('gs-blur');
                            // alert("部分商品暂时缺货，请修改数量后再进行下单。");
                            return;
                        } else {
                            window.location.href = "/recommendorder/customer/" + window.customer_id + "/confirm-order";

                        }
                    }
                });

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
            // 无用
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


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9iYWdtbmFfY2FydC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oY21BcHApIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBzZXR1cENTUkYoKTtcbiAgICB2YXIgdXJsID0gIFwiL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2JhZ21hbi9jdXN0b21lci9cIiArIHdpbmRvdy5jdXN0b21lcl9pZCArIFwiL2NhcnRcIjtcblxuICAgIFZ1ZS5maWx0ZXIoJ3RvRml4ZWQnLCBmdW5jdGlvbiAobnVtLCBwcmVjaXNpb24pIHtcbiAgICAgICAgcmV0dXJuIE51bWJlcihOdW1iZXIobnVtKS50b0ZpeGVkKHByZWNpc2lvbikpO1xuICAgIH0pO1xuXG4gICAgdmFyIGhlYWRlclZ1ZSA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogXCJoZWFkZXJcIixcbiAgICAgICAgYmVmb3JlQ3JlYXRlOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHVzZXJfcm9sZSA9IGdldENvb2tpZSgndXNlcl9yb2xlJyk7XG4gICAgICAgICAgICB0aGlzLmlzU2FsZXNtYW4gPSB1c2VyX3JvbGUgPT09IFwic2FsZXNtYW5cIjtcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgYWRkR2lmdHM6IFwiXCJcbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgYmFjazogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL3JlY29tbWVuZG9yZGVyL3NhbGVzbWFuL2N1c3RvbWVyLXN0YXR1c1wiO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkZEdpZnQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9yZWNvbW1lbmRvcmRlci9jdXN0b21lci9cIiArIHdpbmRvdy5jdXN0b21lcl9pZCArIFwiL2FkZC1naWZ0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBiaW5kID0gbmV3IFZ1ZSh7XG4gICAgICAgIGVsOiAnI2NhcnQtaXRlbXMnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBkZWFsZXJzOiBbXSxcbiAgICAgICAgICAgIGluc3VmZmljaWVudF9pdGVtczogW10sXG4gICAgICAgICAgICBidXNfaHJfZnJvbTogXCJcIixcbiAgICAgICAgICAgIGJ1c19ocl90bzogXCJcIixcbiAgICAgICAgICAgIHN1bTogMCxcbiAgICAgICAgICAgIHJlY29tbWVuZFVybDogXCIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyB3aW5kb3cuY3VzdG9tZXJfaWQgKyBcIi9yZWNvbW1lbmRcIixcbiAgICAgICAgICAgIGN1c3RvbWVyUHJvZmlsZTogXCIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyB3aW5kb3cuY3VzdG9tZXJfaWQgKyBcIi9wcm9maWxlXCIsXG4gICAgICAgICAgICBkZWFsZXJMaXN0VXJsIDogXCIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyB3aW5kb3cuY3VzdG9tZXJfaWQgKyBcIi9kZWFsZXItbGlzdFwiLFxuICAgICAgICB9LFxuICAgICAgICB3YXRjaDoge1xuICAgICAgICAgICAgc3VtOiBmdW5jdGlvbihuZXdfdmFsdWUsb2xkX3ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5ld192YWx1ZSA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNwbGFjZW9yZGVyJykuY3NzKCdiYWNrZ3JvdW5kJywnI2ZmNGEwYycpO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmKG5ld192YWx1ZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcjcGxhY2VvcmRlcicpLmNzcygnYmFja2dyb3VuZCcsJyNkYmRiZGInKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuZGVhbGVycyA9IGRhdGEuaXRlbXM7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5zdW0gPSBkYXRhLnN1bTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKF90aGlzLmRlYWxlcnMubGVuZ3RoID09PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcuYmxhbmsnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcuZGVhbGVycy1jb24nKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX3RoaXMuc3VtID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjcGxhY2VvcmRlcicpLmNzcygnYmFja2dyb3VuZCcsJyNmZjRhMGMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKF90aGlzLnN1bSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNwbGFjZW9yZGVyJykuY3NzKCdiYWNrZ3JvdW5kJywnI2RiZGJkYicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkZDogZnVuY3Rpb24oaXRlbSwgbnVtKXtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciBkYXRhVG9TZW5kID0ge307XG4gICAgICAgICAgICAgICAgZGF0YVRvU2VuZFtpdGVtLml0ZW1faWRdID0gbnVtO1xuICAgICAgICAgICAgICAgIHZhciBfdXJsID0gXCIvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvYmFnbWFuL2N1c3RvbWVyL1wiICsgd2luZG93LmN1c3RvbWVyX2lkICsgXCIvY2FydFwiO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogX3VybCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3B1dCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFUb1NlbmQsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuaW5pdCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbigkZXZlbnQsIGl0ZW0pe1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGFUb1NlbmQgPSB7fTtcbiAgICAgICAgICAgICAgICBkYXRhVG9TZW5kW2l0ZW0uaXRlbV9pZF0gPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaXRlbS5pc19naXZlYXdheSk7XG4gICAgICAgICAgICAgICAgdmFyIF91cmwgPSBcIi9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9iYWdtYW4vY3VzdG9tZXIvXCIgKyB3aW5kb3cuY3VzdG9tZXJfaWQgKyBcIi9jYXJ0XCI7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBfdXJsLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFUb1NlbmQsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuaW5pdCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZEFsbFNlbGVjdGVkOiBmdW5jdGlvbihkaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmRlYWxlcnMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZWFsZXJzW2ldLmlkICE9PSBkaWQgJiYgZGlkICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBqID0gMDsgaiA8IHRoaXMuZGVhbGVyc1tpXS5pdGVtcy5sZW5ndGg7IGorKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZWFsZXJzW2ldLml0ZW1zW2pdLnNlbGVjdGVkID09PSBmYWxzZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRTZWxlY3RBbGw6IGZ1bmN0aW9uKCRldmVudCwgZGlkKXtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciBkYXRhVG9TZW5kID0ge307XG4gICAgICAgICAgICAgICAgZGF0YVRvU2VuZC5pdGVtcyA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB2YXIgaSwgajtcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLmRlYWxlcnMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZWFsZXJzW2ldLmlkICE9PSBkaWQgJiYgZGlkICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgZm9yKGogPSAwOyBqIDwgdGhpcy5kZWFsZXJzW2ldLml0ZW1zLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlYWxlcnNbaV0uaXRlbXNbal0uc2VsZWN0ZWQgPT09IGZhbHNlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgdGhpcy5kZWFsZXJzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVhbGVyc1tpXS5pZCAhPT0gZGlkICYmIGRpZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGZvcihqID0gMDsgaiA8IHRoaXMuZGVhbGVyc1tpXS5pdGVtcy5sZW5ndGg7IGorKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZWFsZXJzW2ldLml0ZW1zW2pdLnNlbGVjdGVkID09PSBjdXJyZW50KXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhVG9TZW5kLml0ZW1zLnB1c2godGhpcy5kZWFsZXJzW2ldLml0ZW1zW2pdLml0ZW1faWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncGF0Y2gnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhVG9TZW5kLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNlbGVjdDogZnVuY3Rpb24oJGV2ZW50LCBpdGVtX2lkKXtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciBkYXRhVG9TZW5kID0ge307XG4gICAgICAgICAgICAgICAgZGF0YVRvU2VuZC5pdGVtcyA9IFtpdGVtX2lkXTtcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3BhdGNoJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YVRvU2VuZCxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5pbml0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZW5kQ2hlY2tlZDogZnVuY3Rpb24oaW5pdGlhbF9wcmljZSwgYW1vdW50KXtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzZW5kX25vOiBpbml0aWFsX3ByaWNlID4gYW1vdW50LFxuICAgICAgICAgICAgICAgICAgICBzZW5kX2NoZWNrZWQ6IGluaXRpYWxfcHJpY2UgPD0gYW1vdW50XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaHJlZjogZnVuY3Rpb24oZGlkKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCIvcmVjb21tZW5kb3JkZXIvZGVhbGVyL1wiICsgZGlkICsgXCIvY3VzdG9tZXIvXCIgKyB3aW5kb3cuY3VzdG9tZXJfaWQgK1wiL2FkZC1pdGVtXCI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8g5peg55So55qEXG4gICAgICAgICAgICBjb25maXJtT3JkZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpc1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlYWxlcnMubGVuZ3RoID09PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgLy8gYWxlcnQoXCLml6DllYblk4FcIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoX3RoaXMuc3VtID09PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgLy8gJCgnI3BsYWNlb3JkZXInKS5jc3MoJ2JhY2tncm91bmQnLCcjZGJkYmRiJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuZGVhbGVycy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZGVhbGVyc1tpXS5hbW91bnQgPCB0aGlzLmRlYWxlcnNbaV0uaW5pdGlhbF9wcmljZSAmJiB0aGlzLmRlYWxlcnNbaV0uYW1vdW50IT0wKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi5ZyoXCIgKyB0aGlzLmRlYWxlcnNbaV0ubmFtZSArIFwi55qE6K6i5Y2V5pyq6L6+5Yiw6LW36YCB6YeR6aKdIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBkID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1pbl9vZl9kYXkgPSBkLmdldE1pbnV0ZXMoKSArIGQuZ2V0SG91cnMoKSAqIDYwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZnJvbSA9IHRoaXMuZGVhbGVyc1tpXS5idXNfaHJfZnJvbTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvID0gdGhpcy5kZWFsZXJzW2ldLmJ1c19ocl90bztcbiAgICAgICAgICAgICAgICAgICAgaWYoZnJvbSAhPT0gbnVsbCAmJiB0byAhPT0gbnVsbCAmJiB0aGlzLmRlYWxlcnNbaV0uYW1vdW50ICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmcm9tIDwgdG8gJiYgKG1pbl9vZl9kYXkgPCBmcm9tIHx8IG1pbl9vZl9kYXkgPiB0bykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIuavj+aXpVwiICsgaW50UGFkKE1hdGguZmxvb3IodG8gLyA2MCksIDIpICsgXCI6XCIgKyBpbnRQYWQodG8gJSA2MCwgMikgKyBcIiB+IOasoeaXpVwiICsgaW50UGFkKE1hdGguZmxvb3IoZnJvbSAvIDYwKSwgMikgKyBcIjpcIiArIGludFBhZChmcm9tICUgNjAsIDIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgdGhpcy5kZWFsZXJzW2ldLm5hbWUgKyBcIuS4i+WNleezu+e7n+WNh+e6p++8jCDkuI3og73mj5DkvpvnvZHotK3kuIvljZXmnI3liqHvvIzmlazor7fosIXop6MgXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZnJvbSA+IHRvICYmIChtaW5fb2ZfZGF5PiB0byAmJiBtaW5fb2ZfZGF5IDwgZnJvbSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi5q+P5pelXCIgKyBpbnRQYWQoTWF0aC5mbG9vcih0byAvIDYwKSwgMikgKyBcIjpcIiArIGludFBhZCh0byAlIDYwLCAyKSArIFwiIH4gXCIgKyBpbnRQYWQoTWF0aC5mbG9vcihmcm9tIC8gNjApLCAyKSArIFwiOlwiICsgaW50UGFkKGZyb20gJSA2MCwgMilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyB0aGlzLmRlYWxlcnNbaV0ubmFtZSArIFwi5LiL5Y2V57O757uf5Y2H57qn77yMIOS4jeiDveaPkOS+m+e9kei0reS4i+WNleacjeWKoe+8jOaVrOivt+iwheinoyBcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9jdXN0b21lci8nICsgd2luZG93LmN1c3RvbWVyX2lkICsgJy9jaGVjay1jYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuaXRlbXMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuaW5zdWZmaWNpZW50X2l0ZW1zID0gZGF0YS5pdGVtcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcuZGVsLXVuZGVyc3RvY2stbW9kZWwnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnZm9vdGVyJykuYWRkQ2xhc3MoJ2dzLWJsdXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbGVydChcIumDqOWIhuWVhuWTgeaaguaXtue8uui0p++8jOivt+S/ruaUueaVsOmHj+WQjuWGjei/m+ihjOS4i+WNleOAglwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyB3aW5kb3cuY3VzdG9tZXJfaWQgKyBcIi9jb25maXJtLW9yZGVyXCI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gY2FuY2VsRGVsZXRlSW5zSXRlbXM6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIC8vICAgICAkKCcubW9kZWwgJykuY3NzKHtcbiAgICAgICAgICAgIC8vICAgICAgICAgJ2Rpc3BsYXknOidub25lJ1xuICAgICAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgIC8vIGRlbGV0ZUluc0l0ZW1zOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy8gICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAvLyAgICAgJCgnLm1vZGVsICcpLmNzcyh7XG4gICAgICAgICAgICAvLyAgICAgICAgICdkaXNwbGF5Jzonbm9uZSdcbiAgICAgICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgICAgIC8vICAgICB2YXIgZGF0YVRvU2VuZCA9IHsnaXRlbXMnOiBbXX07XG4gICAgICAgICAgICAvLyAgICAgdmFyIGksIGo7XG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2codGhpcy5pbnN1ZmZpY2llbnRfaXRlbXMpO1xuICAgICAgICAgICAgLy8gICAgIGZvcihpID0gMDsgaSA8IHRoaXMuaW5zdWZmaWNpZW50X2l0ZW1zLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIC8vICAgICAgICAgZm9yKGogPSAwOyBqIDwgdGhpcy5pbnN1ZmZpY2llbnRfaXRlbXNbaV0uaXRlbXMubGVuZ3RoOyBqKyspe1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgZGF0YVRvU2VuZC5pdGVtcy5wdXNoKHRoaXMuaW5zdWZmaWNpZW50X2l0ZW1zW2ldLml0ZW1zW2pdLmlkKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgLy8gICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgIC8vICAgICAgICAgdHlwZTogJ2RlbGV0ZScsXG4gICAgICAgICAgICAvLyAgICAgICAgIGRhdGE6IGRhdGFUb1NlbmQsXG4gICAgICAgICAgICAvLyAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgX3RoaXMuaW5pdCgpO1xuICAgICAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgICAgICAvLyAgICAgfSk7XG4gICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgLy8g5peg55SoXG4gICAgICAgICAgICBnaXZlYXdheUljb25TcmM6IGZ1bmN0aW9uKHByaWNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCIvc3RhdGljL2ltYWdlcy9yZWNvbW1lbmRvcmRlci9mdWxsX1wiICsgTnVtYmVyKHByaWNlKS50b0ZpeGVkKDApICsgXCIucG5nXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbG9zZURlbGV0ZUluc0l0ZW1zOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICQoJ2Zvb3RlcicpLnJlbW92ZUNsYXNzKCdncy1ibHVyJyk7XG4gICAgICAgICAgICAgICAgJCgnLmRlbC11bmRlcnN0b2NrLW1vZGVsJykuaGlkZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsZWFyVW5kZXJzdG9jazogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgICQoJ2Zvb3RlcicpLnJlbW92ZUNsYXNzKCdncy1ibHVyJyk7XG4gICAgICAgICAgICAgICAgJCgnLmRlbC11bmRlcnN0b2NrLW1vZGVsJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgIHZhciBkYXRhVG9TZW5kID0geydpdGVtcyc6IFtdfTtcbiAgICAgICAgICAgICAgICB2YXIgaSwgajtcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLmluc3VmZmljaWVudF9pdGVtcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGZvcihqID0gMDsgaiA8IHRoaXMuaW5zdWZmaWNpZW50X2l0ZW1zW2ldLml0ZW1zLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUb1NlbmQuaXRlbXMucHVzaCh0aGlzLmluc3VmZmljaWVudF9pdGVtc1tpXS5pdGVtc1tqXS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkZWxldGUnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhVG9TZW5kLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy51bmRlcnN0b2NrLW1vZGVsJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcudW5kZXJzdG9jay1tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sMTAwMClcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkZFByb2R1Y3Q6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiICsgd2luZG93LmN1c3RvbWVyX2lkICsgXCIvZGVhbGVyLWxpc3RcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG5iaW5kLmluaXQoKTtcblxufSkod2luZG93LmNtQXBwID0gd2luZG93LmNtQXBwIHx8IHt9KTtcblxuIl0sImZpbGUiOiJyZWNvbW1lbmRvcmRlci9iYWdtbmFfY2FydC5qcyJ9
