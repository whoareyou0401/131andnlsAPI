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


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJiYWdtYW4vY2FydC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oY21BcHApIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBzZXR1cENTUkYoKTtcbiAgICB2YXIgdXJsID0gJy9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9iYWdtYW4vY3VzdG9tZXIvJyArIHdpbmRvdy5jdXN0b21lcl9pZCArICcvY2FydCc7XG5cbiAgICBWdWUuZmlsdGVyKCd0b0ZpeGVkJywgZnVuY3Rpb24gKG51bSwgcHJlY2lzaW9uKSB7XG4gICAgICAgIHJldHVybiBOdW1iZXIoTnVtYmVyKG51bSkudG9GaXhlZChwcmVjaXNpb24pKTtcbiAgICB9KTtcblxuICAgIHZhciBoZWFkZXJWdWUgPSBuZXcgVnVlKHtcbiAgICAgICAgZWw6IFwiaGVhZGVyXCIsXG4gICAgICAgIGJlZm9yZUNyZWF0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciB1c2VyX3JvbGUgPSBnZXRDb29raWUoJ3VzZXJfcm9sZScpO1xuICAgICAgICAgICAgdGhpcy5pc1NhbGVzbWFuID0gdXNlcl9yb2xlID09PSBcInNhbGVzbWFuXCI7XG4gICAgICAgIH0sXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGFkZEdpZnRzOiBcIlwiXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgIGJhY2s6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9yZWNvbW1lbmRvcmRlci9zYWxlc21hbi9jdXN0b21lci1zdGF0dXNcIjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhZGRHaWZ0OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyB3aW5kb3cuY3VzdG9tZXJfaWQgKyBcIi9hZGQtZ2lmdFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgYmluZCA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogJyNjYXJ0LWl0ZW1zJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZGVhbGVyczogW10sXG4gICAgICAgICAgICBpbnN1ZmZpY2llbnRfaXRlbXM6IFtdLFxuICAgICAgICAgICAgYnVzX2hyX2Zyb206IFwiXCIsXG4gICAgICAgICAgICBidXNfaHJfdG86IFwiXCIsXG4gICAgICAgICAgICBzdW06IDAsXG4gICAgICAgICAgICByZWNvbW1lbmRVcmw6IFwiL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiICsgd2luZG93LmN1c3RvbWVyX2lkICsgXCIvcmVjb21tZW5kXCIsXG4gICAgICAgICAgICBjdXN0b21lclByb2ZpbGU6IFwiL3JlY29tbWVuZG9yZGVyL2JhZ21hbi9jdXN0b21lci9cIiArIHdpbmRvdy5jdXN0b21lcl9pZCArIFwiL3Byb2ZpbGVcIixcbiAgICAgICAgICAgIGRlYWxlckxpc3RVcmwgOiBcIi9yZWNvbW1lbmRvcmRlci9jdXN0b21lci9cIiArIHdpbmRvdy5jdXN0b21lcl9pZCArIFwiL2RlYWxlci1saXN0XCIsXG4gICAgICAgIH0sXG4gICAgICAgIHdhdGNoOiB7XG4gICAgICAgICAgICBzdW06IGZ1bmN0aW9uKG5ld192YWx1ZSxvbGRfdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAobmV3X3ZhbHVlID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnI3BsYWNlb3JkZXInKS5jc3MoJ2JhY2tncm91bmQnLCcjZmY0YTBjJyk7XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYobmV3X3ZhbHVlID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNwbGFjZW9yZGVyJykuY3NzKCdiYWNrZ3JvdW5kJywnI2RiZGJkYicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuZGVhbGVycyA9IGRhdGEuaXRlbXM7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5zdW0gPSBkYXRhLnN1bTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKF90aGlzLmRlYWxlcnMubGVuZ3RoID09PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcuYmxhbmsnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcuZGVhbGVycy1jb24nKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX3RoaXMuc3VtID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjcGxhY2VvcmRlcicpLmNzcygnYmFja2dyb3VuZCcsJyNmZjRhMGMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKF90aGlzLnN1bSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNwbGFjZW9yZGVyJykuY3NzKCdiYWNrZ3JvdW5kJywnI2RiZGJkYicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkZDogZnVuY3Rpb24oaXRlbSwgbnVtKXtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciBkYXRhVG9TZW5kID0ge307XG4gICAgICAgICAgICAgICAgc2V0dXBDU1JGKCk7XG4gICAgICAgICAgICAgICAgZGF0YVRvU2VuZFtpdGVtLml0ZW1faWRdID0gbnVtO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncHV0JyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YVRvU2VuZCxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5pbml0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKCRldmVudCwgaXRlbSl7XG4gICAgICAgICAgICAgICAgc2V0dXBDU1JGKCk7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICB2YXIgZGF0YVRvU2VuZCA9IHt9O1xuICAgICAgICAgICAgICAgIGRhdGFUb1NlbmRbaXRlbS5pdGVtX2lkXSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtLmlzX2dpdmVhd2F5KTtcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhVG9TZW5kLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRBbGxTZWxlY3RlZDogZnVuY3Rpb24oZGlkKXtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5kZWFsZXJzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVhbGVyc1tpXS5pZCAhPT0gZGlkICYmIGRpZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlYWxlcnNbaV0uc2VsZWN0ZWQgPT09IGZhbHNlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZFNlbGVjdEFsbDogZnVuY3Rpb24oJGV2ZW50LCBkaWQpe1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGFUb1NlbmQgPSB7fTtcbiAgICAgICAgICAgICAgICBkYXRhVG9TZW5kLml0ZW1zID0gW107XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZhciBpLCBqO1xuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IHRoaXMuZGVhbGVycy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlYWxlcnNbaV0uaWQgIT09IGRpZCAmJiBkaWQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZWFsZXJzW2ldLnNlbGVjdGVkID09PSBmYWxzZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IHRoaXMuZGVhbGVycy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlYWxlcnNbaV0uaWQgIT09IGRpZCAmJiBkaWQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZWFsZXJzW2ldLnNlbGVjdGVkID09PSBjdXJyZW50KXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhVG9TZW5kLml0ZW1zLnB1c2godGhpcy5kZWFsZXJzW2ldLml0ZW1faWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNldHVwQ1NSRigpO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncGF0Y2gnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhVG9TZW5kLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNlbGVjdDogZnVuY3Rpb24oJGV2ZW50LCBpdGVtX2lkKXtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciBkYXRhVG9TZW5kID0ge307XG4gICAgICAgICAgICAgICAgc2V0dXBDU1JGKCk7XG4gICAgICAgICAgICAgICAgZGF0YVRvU2VuZC5pdGVtcyA9IFtpdGVtX2lkXTtcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3BhdGNoJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YVRvU2VuZCxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5pbml0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZW5kQ2hlY2tlZDogZnVuY3Rpb24oaW5pdGlhbF9wcmljZSwgYW1vdW50KXtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzZW5kX25vOiBpbml0aWFsX3ByaWNlID4gYW1vdW50LFxuICAgICAgICAgICAgICAgICAgICBzZW5kX2NoZWNrZWQ6IGluaXRpYWxfcHJpY2UgPD0gYW1vdW50XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaHJlZjogZnVuY3Rpb24oZGlkKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCIvcmVjb21tZW5kb3JkZXIvZGVhbGVyL1wiICsgZGlkICsgXCIvY3VzdG9tZXIvXCIgKyB3aW5kb3cuY3VzdG9tZXJfaWQgK1wiL2JhZ21hbi1hZGQtaXRlbVwiO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbmZpcm1PcmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9yZWNvbW1lbmRvcmRlci9iYWdtYW4vY3VzdG9tZXIvXCIgKyB3aW5kb3cuY3VzdG9tZXJfaWQgKyBcIi9jb25maXJtLW9yZGVyXCI7XG4gICAgICAgICAgICAgICAgLy8gdmFyIF90aGlzID0gdGhpc1xuICAgICAgICAgICAgICAgIC8vIGlmICh0aGlzLmRlYWxlcnMubGVuZ3RoID09PSAwKXtcbiAgICAgICAgICAgICAgICAvLyAgICAgLy8gYWxlcnQoXCLml6DllYblk4FcIik7XG4gICAgICAgICAgICAgICAgLy8gICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgLy8gaWYoX3RoaXMuc3VtID09PSAwKXtcbiAgICAgICAgICAgICAgICAvLyAgICAgLy8gJCgnI3BsYWNlb3JkZXInKS5jc3MoJ2JhY2tncm91bmQnLCcjZGJkYmRiJyk7XG4gICAgICAgICAgICAgICAgLy8gICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgLy8gZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuZGVhbGVycy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgLy8gICAgIGlmKHRoaXMuZGVhbGVyc1tpXS5hbW91bnQgPCB0aGlzLmRlYWxlcnNbaV0uaW5pdGlhbF9wcmljZSAmJiB0aGlzLmRlYWxlcnNbaV0uYW1vdW50IT0wKXtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGFsZXJ0KFwi5ZyoXCIgKyB0aGlzLmRlYWxlcnNbaV0ubmFtZSArIFwi55qE6K6i5Y2V5pyq6L6+5Yiw6LW36YCB6YeR6aKdIVwiKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAvLyAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gICAgIHZhciBkID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgdmFyIG1pbl9vZl9kYXkgPSBkLmdldE1pbnV0ZXMoKSArIGQuZ2V0SG91cnMoKSAqIDYwO1xuICAgICAgICAgICAgICAgIC8vICAgICB2YXIgZnJvbSA9IHRoaXMuZGVhbGVyc1tpXS5idXNfaHJfZnJvbTtcbiAgICAgICAgICAgICAgICAvLyAgICAgdmFyIHRvID0gdGhpcy5kZWFsZXJzW2ldLmJ1c19ocl90bztcbiAgICAgICAgICAgICAgICAvLyAgICAgaWYoZnJvbSAhPT0gbnVsbCAmJiB0byAhPT0gbnVsbCAmJiB0aGlzLmRlYWxlcnNbaV0uYW1vdW50ICE9IDApIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGlmIChmcm9tIDwgdG8gJiYgKG1pbl9vZl9kYXkgPCBmcm9tIHx8IG1pbl9vZl9kYXkgPiB0bykpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBhbGVydChcIuavj+aXpVwiICsgaW50UGFkKE1hdGguZmxvb3IodG8gLyA2MCksIDIpICsgXCI6XCIgKyBpbnRQYWQodG8gJSA2MCwgMikgKyBcIiB+IOasoeaXpVwiICsgaW50UGFkKE1hdGguZmxvb3IoZnJvbSAvIDYwKSwgMikgKyBcIjpcIiArIGludFBhZChmcm9tICUgNjAsIDIpXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICsgdGhpcy5kZWFsZXJzW2ldLm5hbWUgKyBcIuS4i+WNleezu+e7n+WNh+e6p++8jCDkuI3og73mj5DkvpvnvZHotK3kuIvljZXmnI3liqHvvIzmlazor7fosIXop6MgXCIpO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIH0gZWxzZSBpZiAoZnJvbSA+IHRvICYmIChtaW5fb2ZfZGF5PiB0byAmJiBtaW5fb2ZfZGF5IDwgZnJvbSkpe1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGFsZXJ0KFwi5q+P5pelXCIgKyBpbnRQYWQoTWF0aC5mbG9vcih0byAvIDYwKSwgMikgKyBcIjpcIiArIGludFBhZCh0byAlIDYwLCAyKSArIFwiIH4gXCIgKyBpbnRQYWQoTWF0aC5mbG9vcihmcm9tIC8gNjApLCAyKSArIFwiOlwiICsgaW50UGFkKGZyb20gJSA2MCwgMilcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgKyB0aGlzLmRlYWxlcnNbaV0ubmFtZSArIFwi5LiL5Y2V57O757uf5Y2H57qn77yMIOS4jeiDveaPkOS+m+e9kei0reS4i+WNleacjeWKoe+8jOaVrOivt+iwheinoyBcIik7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIC8vICQuYWpheCh7XG4gICAgICAgICAgICAgICAgLy8gICAgIHVybDogJy9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9jdXN0b21lci8nICsgd2luZG93LmN1c3RvbWVyX2lkICsgJy9jaGVjay1jYXJ0JyxcbiAgICAgICAgICAgICAgICAvLyAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgLy8gICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgaWYgKGRhdGEuaXRlbXMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgX3RoaXMuaW5zdWZmaWNpZW50X2l0ZW1zID0gZGF0YS5pdGVtcztcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAkKCcuZGVsLXVuZGVyc3RvY2stbW9kZWwnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgJCgnZm9vdGVyJykuYWRkQ2xhc3MoJ2dzLWJsdXInKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAvLyBhbGVydChcIumDqOWIhuWVhuWTgeaaguaXtue8uui0p++8jOivt+S/ruaUueaVsOmHj+WQjuWGjei/m+ihjOS4i+WNleOAglwiKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyB3aW5kb3cuY3VzdG9tZXJfaWQgKyBcIi9jb25maXJtLW9yZGVyXCI7XG5cbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgICAgIC8vIH0pO1xuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gY2FuY2VsRGVsZXRlSW5zSXRlbXM6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIC8vICAgICAkKCcubW9kZWwgJykuY3NzKHtcbiAgICAgICAgICAgIC8vICAgICAgICAgJ2Rpc3BsYXknOidub25lJ1xuICAgICAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgIC8vIGRlbGV0ZUluc0l0ZW1zOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy8gICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAvLyAgICAgJCgnLm1vZGVsICcpLmNzcyh7XG4gICAgICAgICAgICAvLyAgICAgICAgICdkaXNwbGF5Jzonbm9uZSdcbiAgICAgICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgICAgIC8vICAgICB2YXIgZGF0YVRvU2VuZCA9IHsnaXRlbXMnOiBbXX07XG4gICAgICAgICAgICAvLyAgICAgdmFyIGksIGo7XG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2codGhpcy5pbnN1ZmZpY2llbnRfaXRlbXMpO1xuICAgICAgICAgICAgLy8gICAgIGZvcihpID0gMDsgaSA8IHRoaXMuaW5zdWZmaWNpZW50X2l0ZW1zLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIC8vICAgICAgICAgZm9yKGogPSAwOyBqIDwgdGhpcy5pbnN1ZmZpY2llbnRfaXRlbXNbaV0uaXRlbXMubGVuZ3RoOyBqKyspe1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgZGF0YVRvU2VuZC5pdGVtcy5wdXNoKHRoaXMuaW5zdWZmaWNpZW50X2l0ZW1zW2ldLml0ZW1zW2pdLmlkKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgLy8gICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgIC8vICAgICAgICAgdHlwZTogJ2RlbGV0ZScsXG4gICAgICAgICAgICAvLyAgICAgICAgIGRhdGE6IGRhdGFUb1NlbmQsXG4gICAgICAgICAgICAvLyAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgX3RoaXMuaW5pdCgpO1xuICAgICAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgICAgICAvLyAgICAgfSk7XG4gICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgZ2l2ZWF3YXlJY29uU3JjOiBmdW5jdGlvbihwcmljZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiL3N0YXRpYy9pbWFnZXMvcmVjb21tZW5kb3JkZXIvZnVsbF9cIiArIE51bWJlcihwcmljZSkudG9GaXhlZCgwKSArIFwiLnBuZ1wiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xvc2VEZWxldGVJbnNJdGVtczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAkKCdmb290ZXInKS5yZW1vdmVDbGFzcygnZ3MtYmx1cicpO1xuICAgICAgICAgICAgICAgICQoJy5kZWwtdW5kZXJzdG9jay1tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbGVhclVuZGVyc3RvY2s6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICAkKCdmb290ZXInKS5yZW1vdmVDbGFzcygnZ3MtYmx1cicpO1xuICAgICAgICAgICAgICAgICQoJy5kZWwtdW5kZXJzdG9jay1tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YVRvU2VuZCA9IHsnaXRlbXMnOiBbXX07XG4gICAgICAgICAgICAgICAgdmFyIGksIGo7XG4gICAgICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgdGhpcy5pbnN1ZmZpY2llbnRfaXRlbXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBmb3IoaiA9IDA7IGogPCB0aGlzLmluc3VmZmljaWVudF9pdGVtc1tpXS5pdGVtcy5sZW5ndGg7IGorKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVG9TZW5kLml0ZW1zLnB1c2godGhpcy5pbnN1ZmZpY2llbnRfaXRlbXNbaV0uaXRlbXNbal0uaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZGVsZXRlJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YVRvU2VuZCxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcudW5kZXJzdG9jay1tb2RlbCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnVuZGVyc3RvY2stbW9kZWwnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LDEwMDApXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5pbml0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhZGRQcm9kdWN0OmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9yZWNvbW1lbmRvcmRlci9jdXN0b21lci9cIiArIHdpbmRvdy5jdXN0b21lcl9pZCArIFwiL2RlYWxlci1saXN0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuYmluZC5pbml0KCk7XG5cbn0pKHdpbmRvdy5jbUFwcCA9IHdpbmRvdy5jbUFwcCB8fCB7fSk7XG5cbiJdLCJmaWxlIjoiYmFnbWFuL2NhcnQuanMifQ==
