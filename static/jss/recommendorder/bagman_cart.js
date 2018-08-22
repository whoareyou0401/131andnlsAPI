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


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9iYWdtYW5fY2FydC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oY21BcHApIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBzZXR1cENTUkYoKTtcbiAgICB2YXIgdXJsID0gJy9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9iYWdtYW4vY3VzdG9tZXIvJyArIHdpbmRvdy5jdXN0b21lcl9pZCArICcvY2FydCc7XG5cbiAgICBWdWUuZmlsdGVyKCd0b0ZpeGVkJywgZnVuY3Rpb24gKG51bSwgcHJlY2lzaW9uKSB7XG4gICAgICAgIHJldHVybiBOdW1iZXIoTnVtYmVyKG51bSkudG9GaXhlZChwcmVjaXNpb24pKTtcbiAgICB9KTtcblxuICAgIHZhciBoZWFkZXJWdWUgPSBuZXcgVnVlKHtcbiAgICAgICAgZWw6IFwiaGVhZGVyXCIsXG4gICAgICAgIGJlZm9yZUNyZWF0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciB1c2VyX3JvbGUgPSBnZXRDb29raWUoJ3VzZXJfcm9sZScpO1xuICAgICAgICAgICAgdGhpcy5pc1NhbGVzbWFuID0gdXNlcl9yb2xlID09PSBcInNhbGVzbWFuXCI7XG4gICAgICAgIH0sXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGFkZEdpZnRzOiBcIlwiXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgIGJhY2s6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgc2VsZi5sb2NhdGlvbiA9IGRvY3VtZW50LnJlZmVycmVyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkZEdpZnQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9yZWNvbW1lbmRvcmRlci9jdXN0b21lci9cIiArIHdpbmRvdy5jdXN0b21lcl9pZCArIFwiL2FkZC1naWZ0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBiaW5kID0gbmV3IFZ1ZSh7XG4gICAgICAgIGVsOiAnI2NhcnQtaXRlbXMnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBkZWFsZXJzOiBbXSxcbiAgICAgICAgICAgIGluc3VmZmljaWVudF9pdGVtczogW10sXG4gICAgICAgICAgICBidXNfaHJfZnJvbTogXCJcIixcbiAgICAgICAgICAgIGJ1c19ocl90bzogXCJcIixcbiAgICAgICAgICAgIHN1bTogMCxcbiAgICAgICAgICAgIHJlY29tbWVuZFVybDogXCIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyB3aW5kb3cuY3VzdG9tZXJfaWQgKyBcIi9yZWNvbW1lbmRcIixcbiAgICAgICAgICAgIGN1c3RvbWVyUHJvZmlsZTogXCIvcmVjb21tZW5kb3JkZXIvYmFnbWFuL2N1c3RvbWVyL1wiICsgd2luZG93LmN1c3RvbWVyX2lkICsgXCIvcHJvZmlsZVwiLFxuICAgICAgICAgICAgZGVhbGVyTGlzdFVybCA6IFwiL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiICsgd2luZG93LmN1c3RvbWVyX2lkICsgXCIvZGVhbGVyLWxpc3RcIixcbiAgICAgICAgfSxcbiAgICAgICAgd2F0Y2g6IHtcbiAgICAgICAgICAgIHN1bTogZnVuY3Rpb24obmV3X3ZhbHVlLG9sZF92YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChuZXdfdmFsdWUgPiAwICkge1xuICAgICAgICAgICAgICAgICAgICAkKCcjcGxhY2VvcmRlcicpLmNzcygnYmFja2dyb3VuZCcsJyNmZjRhMGMnKTtcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihuZXdfdmFsdWUgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnI3BsYWNlb3JkZXInKS5jc3MoJ2JhY2tncm91bmQnLCcjZGJkYmRiJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtZXRob2RzOiB7XG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnZXQnLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5kZWFsZXJzID0gZGF0YS5pdGVtcztcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnN1bSA9IGRhdGEuc3VtO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoX3RoaXMuZGVhbGVycy5sZW5ndGggPT09IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5ibGFuaycpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5kZWFsZXJzLWNvbicpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfdGhpcy5zdW0gPiAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNwbGFjZW9yZGVyJykuY3NzKCdiYWNrZ3JvdW5kJywnI2ZmNGEwYycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYoX3RoaXMuc3VtID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3BsYWNlb3JkZXInKS5jc3MoJ2JhY2tncm91bmQnLCcjZGJkYmRiJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWRkOiBmdW5jdGlvbihpdGVtLCBudW0pe1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGFUb1NlbmQgPSB7fTtcbiAgICAgICAgICAgICAgICBzZXR1cENTUkYoKTtcbiAgICAgICAgICAgICAgICBkYXRhVG9TZW5kW2l0ZW0uaXRlbV9pZF0gPSBudW07XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwdXQnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhVG9TZW5kLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24oJGV2ZW50LCBpdGVtKXtcbiAgICAgICAgICAgICAgICBzZXR1cENTUkYoKTtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciBkYXRhVG9TZW5kID0ge307XG4gICAgICAgICAgICAgICAgZGF0YVRvU2VuZFtpdGVtLml0ZW1faWRdID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0uaXNfZ2l2ZWF3YXkpO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFUb1NlbmQsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuaW5pdCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZEFsbFNlbGVjdGVkOiBmdW5jdGlvbihkaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmRlYWxlcnMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZWFsZXJzW2ldLmlkICE9PSBkaWQgJiYgZGlkICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVhbGVyc1tpXS5zZWxlY3RlZCA9PT0gZmFsc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkU2VsZWN0QWxsOiBmdW5jdGlvbigkZXZlbnQsIGRpZCl7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICB2YXIgZGF0YVRvU2VuZCA9IHt9O1xuICAgICAgICAgICAgICAgIGRhdGFUb1NlbmQuaXRlbXMgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdmFyIGksIGo7XG4gICAgICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgdGhpcy5kZWFsZXJzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVhbGVyc1tpXS5pZCAhPT0gZGlkICYmIGRpZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlYWxlcnNbaV0uc2VsZWN0ZWQgPT09IGZhbHNlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgdGhpcy5kZWFsZXJzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVhbGVyc1tpXS5pZCAhPT0gZGlkICYmIGRpZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlYWxlcnNbaV0uc2VsZWN0ZWQgPT09IGN1cnJlbnQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUb1NlbmQuaXRlbXMucHVzaCh0aGlzLmRlYWxlcnNbaV0uaXRlbV9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2V0dXBDU1JGKCk7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwYXRjaCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFUb1NlbmQsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuaW5pdCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2VsZWN0OiBmdW5jdGlvbigkZXZlbnQsIGl0ZW1faWQpe1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGFUb1NlbmQgPSB7fTtcbiAgICAgICAgICAgICAgICBzZXR1cENTUkYoKTtcbiAgICAgICAgICAgICAgICBkYXRhVG9TZW5kLml0ZW1zID0gW2l0ZW1faWRdO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncGF0Y2gnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhVG9TZW5kLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNlbmRDaGVja2VkOiBmdW5jdGlvbihpbml0aWFsX3ByaWNlLCBhbW91bnQpe1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbmRfbm86IGluaXRpYWxfcHJpY2UgPiBhbW91bnQsXG4gICAgICAgICAgICAgICAgICAgIHNlbmRfY2hlY2tlZDogaW5pdGlhbF9wcmljZSA8PSBhbW91bnRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRocmVmOiBmdW5jdGlvbihkaWQpe1xuICAgICAgICAgICAgICAgIHJldHVybiBcIi9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIgKyBkaWQgKyBcIi9jdXN0b21lci9cIiArIHdpbmRvdy5jdXN0b21lcl9pZCArXCIvYmFnbWFuLWFkZC1pdGVtXCI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29uZmlybU9yZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL3JlY29tbWVuZG9yZGVyL2JhZ21hbi9jdXN0b21lci9cIiArIHdpbmRvdy5jdXN0b21lcl9pZCArIFwiL2NvbmZpcm0tb3JkZXJcIjtcbiAgICAgICAgICAgICAgICAvLyB2YXIgX3RoaXMgPSB0aGlzXG4gICAgICAgICAgICAgICAgLy8gaWYgKHRoaXMuZGVhbGVycy5sZW5ndGggPT09IDApe1xuICAgICAgICAgICAgICAgIC8vICAgICAvLyBhbGVydChcIuaXoOWVhuWTgVwiKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAvLyBpZihfdGhpcy5zdW0gPT09IDApe1xuICAgICAgICAgICAgICAgIC8vICAgICAvLyAkKCcjcGxhY2VvcmRlcicpLmNzcygnYmFja2dyb3VuZCcsJyNkYmRiZGInKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAvLyBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5kZWFsZXJzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAvLyAgICAgaWYodGhpcy5kZWFsZXJzW2ldLmFtb3VudCA8IHRoaXMuZGVhbGVyc1tpXS5pbml0aWFsX3ByaWNlICYmIHRoaXMuZGVhbGVyc1tpXS5hbW91bnQhPTApe1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgYWxlcnQoXCLlnKhcIiArIHRoaXMuZGVhbGVyc1tpXS5uYW1lICsgXCLnmoTorqLljZXmnKrovr7liLDotbfpgIHph5Hpop0hXCIpO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIC8vICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyAgICAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIC8vICAgICB2YXIgbWluX29mX2RheSA9IGQuZ2V0TWludXRlcygpICsgZC5nZXRIb3VycygpICogNjA7XG4gICAgICAgICAgICAgICAgLy8gICAgIHZhciBmcm9tID0gdGhpcy5kZWFsZXJzW2ldLmJ1c19ocl9mcm9tO1xuICAgICAgICAgICAgICAgIC8vICAgICB2YXIgdG8gPSB0aGlzLmRlYWxlcnNbaV0uYnVzX2hyX3RvO1xuICAgICAgICAgICAgICAgIC8vICAgICBpZihmcm9tICE9PSBudWxsICYmIHRvICE9PSBudWxsICYmIHRoaXMuZGVhbGVyc1tpXS5hbW91bnQgIT0gMCkge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgaWYgKGZyb20gPCB0byAmJiAobWluX29mX2RheSA8IGZyb20gfHwgbWluX29mX2RheSA+IHRvKSkge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGFsZXJ0KFwi5q+P5pelXCIgKyBpbnRQYWQoTWF0aC5mbG9vcih0byAvIDYwKSwgMikgKyBcIjpcIiArIGludFBhZCh0byAlIDYwLCAyKSArIFwiIH4g5qyh5pelXCIgKyBpbnRQYWQoTWF0aC5mbG9vcihmcm9tIC8gNjApLCAyKSArIFwiOlwiICsgaW50UGFkKGZyb20gJSA2MCwgMilcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgKyB0aGlzLmRlYWxlcnNbaV0ubmFtZSArIFwi5LiL5Y2V57O757uf5Y2H57qn77yMIOS4jeiDveaPkOS+m+e9kei0reS4i+WNleacjeWKoe+8jOaVrOivt+iwheinoyBcIik7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSBlbHNlIGlmIChmcm9tID4gdG8gJiYgKG1pbl9vZl9kYXk+IHRvICYmIG1pbl9vZl9kYXkgPCBmcm9tKSl7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgYWxlcnQoXCLmr4/ml6VcIiArIGludFBhZChNYXRoLmZsb29yKHRvIC8gNjApLCAyKSArIFwiOlwiICsgaW50UGFkKHRvICUgNjAsIDIpICsgXCIgfiBcIiArIGludFBhZChNYXRoLmZsb29yKGZyb20gLyA2MCksIDIpICsgXCI6XCIgKyBpbnRQYWQoZnJvbSAlIDYwLCAyKVxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICArIHRoaXMuZGVhbGVyc1tpXS5uYW1lICsgXCLkuIvljZXns7vnu5/ljYfnuqfvvIwg5LiN6IO95o+Q5L6b572R6LSt5LiL5Y2V5pyN5Yqh77yM5pWs6K+36LCF6KejIFwiKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgLy8gJC5hamF4KHtcbiAgICAgICAgICAgICAgICAvLyAgICAgdXJsOiAnL2FwaS92MS4xL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyLycgKyB3aW5kb3cuY3VzdG9tZXJfaWQgKyAnL2NoZWNrLWNhcnQnLFxuICAgICAgICAgICAgICAgIC8vICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICAvLyAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBpZiAoZGF0YS5pdGVtcy5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBfdGhpcy5pbnN1ZmZpY2llbnRfaXRlbXMgPSBkYXRhLml0ZW1zO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICQoJy5kZWwtdW5kZXJzdG9jay1tb2RlbCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAkKCdmb290ZXInKS5hZGRDbGFzcygnZ3MtYmx1cicpO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIC8vIGFsZXJ0KFwi6YOo5YiG5ZWG5ZOB5pqC5pe257y66LSn77yM6K+35L+u5pS55pWw6YeP5ZCO5YaN6L+b6KGM5LiL5Y2V44CCXCIpO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9yZWNvbW1lbmRvcmRlci9jdXN0b21lci9cIiArIHdpbmRvdy5jdXN0b21lcl9pZCArIFwiL2NvbmZpcm0tb3JkZXJcIjtcblxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAgICAgLy8gfSk7XG5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyBjYW5jZWxEZWxldGVJbnNJdGVtczogZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgLy8gICAgICQoJy5tb2RlbCAnKS5jc3Moe1xuICAgICAgICAgICAgLy8gICAgICAgICAnZGlzcGxheSc6J25vbmUnXG4gICAgICAgICAgICAvLyAgICAgfSk7XG4gICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgLy8gZGVsZXRlSW5zSXRlbXM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvLyAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIC8vICAgICAkKCcubW9kZWwgJykuY3NzKHtcbiAgICAgICAgICAgIC8vICAgICAgICAgJ2Rpc3BsYXknOidub25lJ1xuICAgICAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICAgICAgLy8gICAgIHZhciBkYXRhVG9TZW5kID0geydpdGVtcyc6IFtdfTtcbiAgICAgICAgICAgIC8vICAgICB2YXIgaSwgajtcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyh0aGlzLmluc3VmZmljaWVudF9pdGVtcyk7XG4gICAgICAgICAgICAvLyAgICAgZm9yKGkgPSAwOyBpIDwgdGhpcy5pbnN1ZmZpY2llbnRfaXRlbXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgLy8gICAgICAgICBmb3IoaiA9IDA7IGogPCB0aGlzLmluc3VmZmljaWVudF9pdGVtc1tpXS5pdGVtcy5sZW5ndGg7IGorKyl7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBkYXRhVG9TZW5kLml0ZW1zLnB1c2godGhpcy5pbnN1ZmZpY2llbnRfaXRlbXNbaV0uaXRlbXNbal0uaWQpO1xuICAgICAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgLy8gICAgICQuYWpheCh7XG4gICAgICAgICAgICAvLyAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgLy8gICAgICAgICB0eXBlOiAnZGVsZXRlJyxcbiAgICAgICAgICAgIC8vICAgICAgICAgZGF0YTogZGF0YVRvU2VuZCxcbiAgICAgICAgICAgIC8vICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBfdGhpcy5pbml0KCk7XG4gICAgICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgICBnaXZlYXdheUljb25TcmM6IGZ1bmN0aW9uKHByaWNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCIvc3RhdGljL2ltYWdlcy9yZWNvbW1lbmRvcmRlci9mdWxsX1wiICsgTnVtYmVyKHByaWNlKS50b0ZpeGVkKDApICsgXCIucG5nXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbG9zZURlbGV0ZUluc0l0ZW1zOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICQoJ2Zvb3RlcicpLnJlbW92ZUNsYXNzKCdncy1ibHVyJyk7XG4gICAgICAgICAgICAgICAgJCgnLmRlbC11bmRlcnN0b2NrLW1vZGVsJykuaGlkZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsZWFyVW5kZXJzdG9jazogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgICQoJ2Zvb3RlcicpLnJlbW92ZUNsYXNzKCdncy1ibHVyJyk7XG4gICAgICAgICAgICAgICAgJCgnLmRlbC11bmRlcnN0b2NrLW1vZGVsJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgIHZhciBkYXRhVG9TZW5kID0geydpdGVtcyc6IFtdfTtcbiAgICAgICAgICAgICAgICB2YXIgaSwgajtcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLmluc3VmZmljaWVudF9pdGVtcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGZvcihqID0gMDsgaiA8IHRoaXMuaW5zdWZmaWNpZW50X2l0ZW1zW2ldLml0ZW1zLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUb1NlbmQuaXRlbXMucHVzaCh0aGlzLmluc3VmZmljaWVudF9pdGVtc1tpXS5pdGVtc1tqXS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkZWxldGUnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhVG9TZW5kLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy51bmRlcnN0b2NrLW1vZGVsJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcudW5kZXJzdG9jay1tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sMTAwMClcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkZFByb2R1Y3Q6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiICsgd2luZG93LmN1c3RvbWVyX2lkICsgXCIvZGVhbGVyLWxpc3RcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG5iaW5kLmluaXQoKTtcblxufSkod2luZG93LmNtQXBwID0gd2luZG93LmNtQXBwIHx8IHt9KTtcblxuIl0sImZpbGUiOiJyZWNvbW1lbmRvcmRlci9iYWdtYW5fY2FydC5qcyJ9
