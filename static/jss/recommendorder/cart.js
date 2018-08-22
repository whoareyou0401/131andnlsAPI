(function(cmApp) {
    'use strict';
    setupCSRF();
    var url = '/api/v1.1/recommendorder/customer/' + window.customer_id + '/cart';
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
         beforeCreate: function(){
            var user_role = getCookie('user_role');
            this.isSalesman = user_role === "salesman";
        },
        data: {
            dealers: [],
            insufficient_items: [],
            bus_hr_from: "",
            bus_hr_to: "",
            sum: 0,
            isShowBlank:false,
            isShowPlaceorderCell:true,
            isShowCon:true,
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
            change:function(it){
                // if (Number(e)==parseInt(e)) {
// item.original_price,item.item_prices,item.item_id
                // }
                // changeprice.items=item;
                // changeprice.prices=item.item_prices;
                console.log(it);
                it.original_price = Number(Number(it.original_price).toFixed(2));
                changeprice.items=it;
                changeprice.id=it.id;
                console.log(changeprice.items);
                changeprice.price_id=0;
                // $(".change_price_own").addClass("active");
                changeprice.originalactive=true;
                $(".change_price_priceo li").removeClass("active");
                // $("#change_price").css('display','block');
                changeprice.changprice=true;
                // $(".change_price_own").html("¥"+a+"&nbsp(原价)");
            },
            addpricemargin:function(data){
                        // 更新changeprice组件items数据
                        for (var i in data.items) {
                            for (var q in data.items[i].items) {
                                 for (var t in data.items[i].items[q].item_prices) {
                                     data.items[i].items[q].item_prices[t].price = Number(Number(data.items[i].items[q].original_price).toFixed(2))+Number(Number(data.items[i].items[q].item_prices[t].price).toFixed(2));
                                 }
                              if (data.items[i].items[q].id==changeprice.id) {
                                data.items[i].items[q].original_price = Number(Number(data.items[i].items[q].original_price).toFixed(2));
                                changeprice.items=data.items[i].items[q];
                                break;
                              }
                            }
                        }
                        return data;
            },
            init: function(){
                var _this = this;
                $.ajax({
                    url: url,
                    type: 'get',
                    success: function(data){
                        _this.dealers =_this.addpricemargin(data).items;
                        _this.sum = data.sum;
                        if(_this.dealers.length === 0){
                            _this.isShowBlank = true;
                            _this.isShowPlaceorderCell = false;
                            _this.isShowCon = false;
                        }else{
                            _this.isShowBlank = false;
                            _this.isShowPlaceorderCell = true;
                            _this.isShowCon = true;
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
                var _url = !item.is_giveaway ? "/api/v1.1/recommendorder/customer/" + window.customer_id + "/cart" : "/api/v1.1/recommendorder/customer/" + window.customer_id + "/giveaway";
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
                var _url = !item.is_giveaway ? "/api/v1.1/recommendorder/customer/" + window.customer_id + "/cart" : "/api/v1.1/recommendorder/customer/" + window.customer_id + "/giveaway";
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
            confirmOrder: function(){
                var _this = this;
                if (this.dealers.length === 0){
                    // alert("无商品");
                    return;
                }
                if(_this.sum === 0){
                    // $('#placeorder').css('background','#dbdbdb');
                    return;
                }
                for(var i = 0; i < this.dealers.length; i++){
                    if(this.dealers[i].amount < this.dealers[i].initial_price && this.dealers[i].amount!==0){
                        alert("在" + this.dealers[i].name + "的订单未达到起送金额!");
                        return;
                    }
                    var d = new Date();
                    var min_of_day = d.getMinutes() + d.getHours() * 60;
                    var from = this.dealers[i].bus_hr_from;
                    var to = this.dealers[i].bus_hr_to;
                    if(from !== null && to !== null && this.dealers[i].amount !== 0) {
                        if (from < to && (min_of_day < from || min_of_day > to)) {
                            alert("每日" + intPad(Math.floor(to / 60), 2) + ":" + intPad(to % 60, 2) + " ~ 次日" + intPad(Math.floor(from / 60), 2) + ":" + intPad(from % 60, 2) + this.dealers[i].name + "下单系统升级， 不能提供网购下单服务，敬请谅解 ");
                            return;
                        } else if (from > to && (min_of_day> to && min_of_day < from)){
                            alert("每日" + intPad(Math.floor(to / 60), 2) + ":" + intPad(to % 60, 2) + " ~ " + intPad(Math.floor(from / 60), 2) + ":" + intPad(from % 60, 2) + this.dealers[i].name + "下单系统升级， 不能提供网购下单服务，敬请谅解 ");
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
            giveawayIconSrc: function(price){
                return "/static/images/recommendorder/full_" + Number(price).toFixed(0) + ".png";
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
                        },1000);
                        _this.init();
                    }
                });
            },
            addProduct:function(){
                window.location.href = "/recommendorder/customer/" + window.customer_id + "/dealer-list";
            }
        }
    });
        var changeprice = new Vue({
        el: '#change_price',
        data:{
            items:{},
            prices:[],
            val:"",
            id:"",
            price_id:0,
            timeOutEvent:0,
            // 修改价格遮罩层
            changprice:false,
            // 删除按钮
            close:false,
            // 原价
            originalactive:false,
            //价格展示
            haveprice:false
            
        },
        methods: {
             addprice:function(origprice){
                 var _this = this;
                 for (var i in _this.items.item_prices) {
                    if (_this.val == _this.items.item_prices[i].price) {
                        // $(".change_price_bodyo span").css("display","block")
                        _this.haveprice=true;
                        break;
                    }else{
                        // $(".change_price_bodyo span").css("display","none")
                        _this.haveprice=false;
                    }
                 }
                 if (_this.val!=='' && _this.haveprice===false) {
                    $.ajax({
                            url: "/api/v1.2/recommendorder/customer/"+window.customer_id+"/item-price",
                            type: 'put',
                            data: {
                                "item_id":_this.items.item_id,
                                "price":(Number(_this.val)-Number(origprice))
                            },
                            success: function(data){
                                 bind.init();
                                 bind.change(_this.items);
                                 _this.val="";
                   
                            }
                        });
                     }
                  


            },
            changeclose:function(){
                var _this = this;
                _this.changprice=false;
                _this.haveprice=false;
                changeprice.close=false;
            },
            disclose:function(){
                var _this = this;
                 _this.close=false;
            },
            delprice:function(i){
                 var _this = this;
                 var id = i;
                $.ajax({
                    url: "/api/v1.2/recommendorder/customer/"+window.customer_id+"/item-price",
                    type: 'DELETE',
                    data: {
                        "price_id":id,
                        "cart_item_id":_this.id

                    },
                    success: function(data){
                        bind.init();
                        bind.change(_this.items);
                    }
                });  
            },
            okprice:function(e,id){
                var _this = this;
                if(_this.close===false){
                    _this.price_id=id;
                    $(e.currentTarget).addClass("active");
                    $(e.currentTarget).siblings().removeClass("active");
                    // $(".change_price_own").removeClass("active");
                    _this.originalactive=false;
                    _this.haveprice=false;
                }
                
            },
            gtouchstart:function(){
                var _this = this;
                _this.timeOutEvent = setTimeout(function(){
                _this.close=true;
                _this.price_id=0;
                // $(".change_price_price_close").css("display","block")
               },500);
            },
            originalprice:function(){
                var _this = this;
                _this.price_id=0;
                // $(".change_price_own").addClass("active");
                 _this.originalactive=true;
                $(".change_price_priceo li").removeClass("active");
            },
            gtouchend:function(){
                var _this = this;
                clearTimeout(_this.timeOutEvent);
            },
            commit:function(){
                var _this = this;
                if ( _this.price_id===0) {
                    $.ajax({
                        url: "/api/v1.2/recommendorder/customer/"+window.customer_id+"/item-price",
                        type: 'post',
                        data: {
                            "original_price":1,
                            "cart_item_id":_this.id
                        },
                        success: function(data){
                            bind.init();
                            bind.change(_this.items);
                            // $("#change_price").css('display','none');
                            _this.changprice=false;
                            _this.haveprice=false;
                             _this.val="";
                        }
                    });
                }else{
                    $.ajax({
                        url: "/api/v1.2/recommendorder/customer/"+window.customer_id+"/item-price",
                        type: 'post',
                        data: {
                            "price_id":_this.price_id,
                            "cart_item_id":_this.id
                        },
                        success: function(data){
                            bind.init();
                            bind.change(_this.items);
                            // $("#change_price").css('display','none');
                            _this.changprice=false;
                            _this.haveprice=false;
                             _this.val="";
                        }
                    });
                }
            }
        },
        mounted:function(){
        }
    });
bind.init();
})(window.cmApp = window.cmApp || {});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9jYXJ0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbihjbUFwcCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBzZXR1cENTUkYoKTtcbiAgICB2YXIgdXJsID0gJy9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9jdXN0b21lci8nICsgd2luZG93LmN1c3RvbWVyX2lkICsgJy9jYXJ0JztcbiAgICBWdWUuZmlsdGVyKCd0b0ZpeGVkJywgZnVuY3Rpb24gKG51bSwgcHJlY2lzaW9uKSB7XG4gICAgICAgIHJldHVybiBOdW1iZXIoTnVtYmVyKG51bSkudG9GaXhlZChwcmVjaXNpb24pKTtcbiAgICB9KTtcbiAgICB2YXIgaGVhZGVyVnVlID0gbmV3IFZ1ZSh7XG4gICAgICAgIGVsOiBcImhlYWRlclwiLFxuICAgICAgICBiZWZvcmVDcmVhdGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgdXNlcl9yb2xlID0gZ2V0Q29va2llKCd1c2VyX3JvbGUnKTtcbiAgICAgICAgICAgIHRoaXMuaXNTYWxlc21hbiA9IHVzZXJfcm9sZSA9PT0gXCJzYWxlc21hblwiO1xuICAgICAgICB9LFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBhZGRHaWZ0czogXCJcIlxuICAgICAgICB9LFxuICAgICAgICBtZXRob2RzOiB7XG4gICAgICAgICAgICBiYWNrOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvcmVjb21tZW5kb3JkZXIvc2FsZXNtYW4vY3VzdG9tZXItc3RhdHVzXCI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWRkR2lmdDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiICsgd2luZG93LmN1c3RvbWVyX2lkICsgXCIvYWRkLWdpZnRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBiaW5kID0gbmV3IFZ1ZSh7XG4gICAgICAgIGVsOiAnI2NhcnQtaXRlbXMnLFxuICAgICAgICAgYmVmb3JlQ3JlYXRlOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHVzZXJfcm9sZSA9IGdldENvb2tpZSgndXNlcl9yb2xlJyk7XG4gICAgICAgICAgICB0aGlzLmlzU2FsZXNtYW4gPSB1c2VyX3JvbGUgPT09IFwic2FsZXNtYW5cIjtcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZGVhbGVyczogW10sXG4gICAgICAgICAgICBpbnN1ZmZpY2llbnRfaXRlbXM6IFtdLFxuICAgICAgICAgICAgYnVzX2hyX2Zyb206IFwiXCIsXG4gICAgICAgICAgICBidXNfaHJfdG86IFwiXCIsXG4gICAgICAgICAgICBzdW06IDAsXG4gICAgICAgICAgICBpc1Nob3dCbGFuazpmYWxzZSxcbiAgICAgICAgICAgIGlzU2hvd1BsYWNlb3JkZXJDZWxsOnRydWUsXG4gICAgICAgICAgICBpc1Nob3dDb246dHJ1ZSxcbiAgICAgICAgICAgIHJlY29tbWVuZFVybDogXCIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyB3aW5kb3cuY3VzdG9tZXJfaWQgKyBcIi9yZWNvbW1lbmRcIixcbiAgICAgICAgICAgIGN1c3RvbWVyUHJvZmlsZTogXCIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyB3aW5kb3cuY3VzdG9tZXJfaWQgKyBcIi9wcm9maWxlXCIsXG4gICAgICAgICAgICBkZWFsZXJMaXN0VXJsIDogXCIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyB3aW5kb3cuY3VzdG9tZXJfaWQgKyBcIi9kZWFsZXItbGlzdFwiLFxuICAgICAgICB9LFxuICAgICAgICB3YXRjaDoge1xuICAgICAgICAgICAgc3VtOiBmdW5jdGlvbihuZXdfdmFsdWUsb2xkX3ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5ld192YWx1ZSA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNwbGFjZW9yZGVyJykuY3NzKCdiYWNrZ3JvdW5kJywnI2ZmNGEwYycpO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmKG5ld192YWx1ZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcjcGxhY2VvcmRlcicpLmNzcygnYmFja2dyb3VuZCcsJyNkYmRiZGInKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgIGNoYW5nZTpmdW5jdGlvbihpdCl7XG4gICAgICAgICAgICAgICAgLy8gaWYgKE51bWJlcihlKT09cGFyc2VJbnQoZSkpIHtcbi8vIGl0ZW0ub3JpZ2luYWxfcHJpY2UsaXRlbS5pdGVtX3ByaWNlcyxpdGVtLml0ZW1faWRcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgLy8gY2hhbmdlcHJpY2UuaXRlbXM9aXRlbTtcbiAgICAgICAgICAgICAgICAvLyBjaGFuZ2VwcmljZS5wcmljZXM9aXRlbS5pdGVtX3ByaWNlcztcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpdCk7XG4gICAgICAgICAgICAgICAgaXQub3JpZ2luYWxfcHJpY2UgPSBOdW1iZXIoTnVtYmVyKGl0Lm9yaWdpbmFsX3ByaWNlKS50b0ZpeGVkKDIpKTtcbiAgICAgICAgICAgICAgICBjaGFuZ2VwcmljZS5pdGVtcz1pdDtcbiAgICAgICAgICAgICAgICBjaGFuZ2VwcmljZS5pZD1pdC5pZDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFuZ2VwcmljZS5pdGVtcyk7XG4gICAgICAgICAgICAgICAgY2hhbmdlcHJpY2UucHJpY2VfaWQ9MDtcbiAgICAgICAgICAgICAgICAvLyAkKFwiLmNoYW5nZV9wcmljZV9vd25cIikuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICAgICAgY2hhbmdlcHJpY2Uub3JpZ2luYWxhY3RpdmU9dHJ1ZTtcbiAgICAgICAgICAgICAgICAkKFwiLmNoYW5nZV9wcmljZV9wcmljZW8gbGlcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICAgICAgLy8gJChcIiNjaGFuZ2VfcHJpY2VcIikuY3NzKCdkaXNwbGF5JywnYmxvY2snKTtcbiAgICAgICAgICAgICAgICBjaGFuZ2VwcmljZS5jaGFuZ3ByaWNlPXRydWU7XG4gICAgICAgICAgICAgICAgLy8gJChcIi5jaGFuZ2VfcHJpY2Vfb3duXCIpLmh0bWwoXCLCpVwiK2ErXCImbmJzcCjljp/ku7cpXCIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkZHByaWNlbWFyZ2luOmZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5pu05pawY2hhbmdlcHJpY2Xnu4Tku7ZpdGVtc+aVsOaNrlxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBkYXRhLml0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcSBpbiBkYXRhLml0ZW1zW2ldLml0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB0IGluIGRhdGEuaXRlbXNbaV0uaXRlbXNbcV0uaXRlbV9wcmljZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLml0ZW1zW2ldLml0ZW1zW3FdLml0ZW1fcHJpY2VzW3RdLnByaWNlID0gTnVtYmVyKE51bWJlcihkYXRhLml0ZW1zW2ldLml0ZW1zW3FdLm9yaWdpbmFsX3ByaWNlKS50b0ZpeGVkKDIpKStOdW1iZXIoTnVtYmVyKGRhdGEuaXRlbXNbaV0uaXRlbXNbcV0uaXRlbV9wcmljZXNbdF0ucHJpY2UpLnRvRml4ZWQoMikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuaXRlbXNbaV0uaXRlbXNbcV0uaWQ9PWNoYW5nZXByaWNlLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuaXRlbXNbaV0uaXRlbXNbcV0ub3JpZ2luYWxfcHJpY2UgPSBOdW1iZXIoTnVtYmVyKGRhdGEuaXRlbXNbaV0uaXRlbXNbcV0ub3JpZ2luYWxfcHJpY2UpLnRvRml4ZWQoMikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VwcmljZS5pdGVtcz1kYXRhLml0ZW1zW2ldLml0ZW1zW3FdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnZXQnLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmRlYWxlcnMgPV90aGlzLmFkZHByaWNlbWFyZ2luKGRhdGEpLml0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuc3VtID0gZGF0YS5zdW07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihfdGhpcy5kZWFsZXJzLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuaXNTaG93QmxhbmsgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmlzU2hvd1BsYWNlb3JkZXJDZWxsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuaXNTaG93Q29uID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5pc1Nob3dCbGFuayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmlzU2hvd1BsYWNlb3JkZXJDZWxsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5pc1Nob3dDb24gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF90aGlzLnN1bSA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3BsYWNlb3JkZXInKS5jc3MoJ2JhY2tncm91bmQnLCcjZmY0YTBjJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZihfdGhpcy5zdW0gPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjcGxhY2VvcmRlcicpLmNzcygnYmFja2dyb3VuZCcsJyNkYmRiZGInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkZDogZnVuY3Rpb24oaXRlbSwgbnVtKXtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciBkYXRhVG9TZW5kID0ge307XG4gICAgICAgICAgICAgICAgZGF0YVRvU2VuZFtpdGVtLml0ZW1faWRdID0gbnVtO1xuICAgICAgICAgICAgICAgIHZhciBfdXJsID0gIWl0ZW0uaXNfZ2l2ZWF3YXkgPyBcIi9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9jdXN0b21lci9cIiArIHdpbmRvdy5jdXN0b21lcl9pZCArIFwiL2NhcnRcIiA6IFwiL2FwaS92MS4xL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiICsgd2luZG93LmN1c3RvbWVyX2lkICsgXCIvZ2l2ZWF3YXlcIjtcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IF91cmwsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwdXQnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhVG9TZW5kLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24oJGV2ZW50LCBpdGVtKXtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciBkYXRhVG9TZW5kID0ge307XG4gICAgICAgICAgICAgICAgZGF0YVRvU2VuZFtpdGVtLml0ZW1faWRdID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0uaXNfZ2l2ZWF3YXkpO1xuICAgICAgICAgICAgICAgIHZhciBfdXJsID0gIWl0ZW0uaXNfZ2l2ZWF3YXkgPyBcIi9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9jdXN0b21lci9cIiArIHdpbmRvdy5jdXN0b21lcl9pZCArIFwiL2NhcnRcIiA6IFwiL2FwaS92MS4xL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiICsgd2luZG93LmN1c3RvbWVyX2lkICsgXCIvZ2l2ZWF3YXlcIjtcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IF91cmwsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YVRvU2VuZCxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5pbml0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkQWxsU2VsZWN0ZWQ6IGZ1bmN0aW9uKGRpZCl7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuZGVhbGVycy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlYWxlcnNbaV0uaWQgIT09IGRpZCAmJiBkaWQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgdGhpcy5kZWFsZXJzW2ldLml0ZW1zLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlYWxlcnNbaV0uaXRlbXNbal0uc2VsZWN0ZWQgPT09IGZhbHNlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZFNlbGVjdEFsbDogZnVuY3Rpb24oJGV2ZW50LCBkaWQpe1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGFUb1NlbmQgPSB7fTtcbiAgICAgICAgICAgICAgICBkYXRhVG9TZW5kLml0ZW1zID0gW107XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZhciBpLCBqO1xuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IHRoaXMuZGVhbGVycy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlYWxlcnNbaV0uaWQgIT09IGRpZCAmJiBkaWQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICBmb3IoaiA9IDA7IGogPCB0aGlzLmRlYWxlcnNbaV0uaXRlbXMubGVuZ3RoOyBqKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVhbGVyc1tpXS5pdGVtc1tqXS5zZWxlY3RlZCA9PT0gZmFsc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLmRlYWxlcnMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZWFsZXJzW2ldLmlkICE9PSBkaWQgJiYgZGlkICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgZm9yKGogPSAwOyBqIDwgdGhpcy5kZWFsZXJzW2ldLml0ZW1zLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlYWxlcnNbaV0uaXRlbXNbal0uc2VsZWN0ZWQgPT09IGN1cnJlbnQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUb1NlbmQuaXRlbXMucHVzaCh0aGlzLmRlYWxlcnNbaV0uaXRlbXNbal0uaXRlbV9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwYXRjaCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFUb1NlbmQsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuaW5pdCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2VsZWN0OiBmdW5jdGlvbigkZXZlbnQsIGl0ZW1faWQpe1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGFUb1NlbmQgPSB7fTtcbiAgICAgICAgICAgICAgICBkYXRhVG9TZW5kLml0ZW1zID0gW2l0ZW1faWRdO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncGF0Y2gnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhVG9TZW5kLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNlbmRDaGVja2VkOiBmdW5jdGlvbihpbml0aWFsX3ByaWNlLCBhbW91bnQpe1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbmRfbm86IGluaXRpYWxfcHJpY2UgPiBhbW91bnQsXG4gICAgICAgICAgICAgICAgICAgIHNlbmRfY2hlY2tlZDogaW5pdGlhbF9wcmljZSA8PSBhbW91bnRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRocmVmOiBmdW5jdGlvbihkaWQpe1xuICAgICAgICAgICAgICAgIHJldHVybiBcIi9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIgKyBkaWQgKyBcIi9jdXN0b21lci9cIiArIHdpbmRvdy5jdXN0b21lcl9pZCArXCIvYWRkLWl0ZW1cIjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb25maXJtT3JkZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kZWFsZXJzLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFsZXJ0KFwi5peg5ZWG5ZOBXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKF90aGlzLnN1bSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgICAgIC8vICQoJyNwbGFjZW9yZGVyJykuY3NzKCdiYWNrZ3JvdW5kJywnI2RiZGJkYicpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmRlYWxlcnMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmRlYWxlcnNbaV0uYW1vdW50IDwgdGhpcy5kZWFsZXJzW2ldLmluaXRpYWxfcHJpY2UgJiYgdGhpcy5kZWFsZXJzW2ldLmFtb3VudCE9PTApe1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCLlnKhcIiArIHRoaXMuZGVhbGVyc1tpXS5uYW1lICsgXCLnmoTorqLljZXmnKrovr7liLDotbfpgIHph5Hpop0hXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBkID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1pbl9vZl9kYXkgPSBkLmdldE1pbnV0ZXMoKSArIGQuZ2V0SG91cnMoKSAqIDYwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZnJvbSA9IHRoaXMuZGVhbGVyc1tpXS5idXNfaHJfZnJvbTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvID0gdGhpcy5kZWFsZXJzW2ldLmJ1c19ocl90bztcbiAgICAgICAgICAgICAgICAgICAgaWYoZnJvbSAhPT0gbnVsbCAmJiB0byAhPT0gbnVsbCAmJiB0aGlzLmRlYWxlcnNbaV0uYW1vdW50ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZnJvbSA8IHRvICYmIChtaW5fb2ZfZGF5IDwgZnJvbSB8fCBtaW5fb2ZfZGF5ID4gdG8pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCLmr4/ml6VcIiArIGludFBhZChNYXRoLmZsb29yKHRvIC8gNjApLCAyKSArIFwiOlwiICsgaW50UGFkKHRvICUgNjAsIDIpICsgXCIgfiDmrKHml6VcIiArIGludFBhZChNYXRoLmZsb29yKGZyb20gLyA2MCksIDIpICsgXCI6XCIgKyBpbnRQYWQoZnJvbSAlIDYwLCAyKSArIHRoaXMuZGVhbGVyc1tpXS5uYW1lICsgXCLkuIvljZXns7vnu5/ljYfnuqfvvIwg5LiN6IO95o+Q5L6b572R6LSt5LiL5Y2V5pyN5Yqh77yM5pWs6K+36LCF6KejIFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZyb20gPiB0byAmJiAobWluX29mX2RheT4gdG8gJiYgbWluX29mX2RheSA8IGZyb20pKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIuavj+aXpVwiICsgaW50UGFkKE1hdGguZmxvb3IodG8gLyA2MCksIDIpICsgXCI6XCIgKyBpbnRQYWQodG8gJSA2MCwgMikgKyBcIiB+IFwiICsgaW50UGFkKE1hdGguZmxvb3IoZnJvbSAvIDYwKSwgMikgKyBcIjpcIiArIGludFBhZChmcm9tICUgNjAsIDIpICsgdGhpcy5kZWFsZXJzW2ldLm5hbWUgKyBcIuS4i+WNleezu+e7n+WNh+e6p++8jCDkuI3og73mj5DkvpvnvZHotK3kuIvljZXmnI3liqHvvIzmlazor7fosIXop6MgXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL3YxLjEvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvJyArIHdpbmRvdy5jdXN0b21lcl9pZCArICcvY2hlY2stY2FydCcsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnZXQnLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLml0ZW1zLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmluc3VmZmljaWVudF9pdGVtcyA9IGRhdGEuaXRlbXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmRlbC11bmRlcnN0b2NrLW1vZGVsJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ2Zvb3RlcicpLmFkZENsYXNzKCdncy1ibHVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxlcnQoXCLpg6jliIbllYblk4HmmoLml7bnvLrotKfvvIzor7fkv67mlLnmlbDph4/lkI7lho3ov5vooYzkuIvljZXjgIJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiICsgd2luZG93LmN1c3RvbWVyX2lkICsgXCIvY29uZmlybS1vcmRlclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2l2ZWF3YXlJY29uU3JjOiBmdW5jdGlvbihwcmljZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiL3N0YXRpYy9pbWFnZXMvcmVjb21tZW5kb3JkZXIvZnVsbF9cIiArIE51bWJlcihwcmljZSkudG9GaXhlZCgwKSArIFwiLnBuZ1wiO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsb3NlRGVsZXRlSW5zSXRlbXM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgJCgnZm9vdGVyJykucmVtb3ZlQ2xhc3MoJ2dzLWJsdXInKTtcbiAgICAgICAgICAgICAgICAkKCcuZGVsLXVuZGVyc3RvY2stbW9kZWwnKS5oaWRlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xlYXJVbmRlcnN0b2NrOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgJCgnZm9vdGVyJykucmVtb3ZlQ2xhc3MoJ2dzLWJsdXInKTtcbiAgICAgICAgICAgICAgICAkKCcuZGVsLXVuZGVyc3RvY2stbW9kZWwnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGFUb1NlbmQgPSB7J2l0ZW1zJzogW119O1xuICAgICAgICAgICAgICAgIHZhciBpLCBqO1xuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IHRoaXMuaW5zdWZmaWNpZW50X2l0ZW1zLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgZm9yKGogPSAwOyBqIDwgdGhpcy5pbnN1ZmZpY2llbnRfaXRlbXNbaV0uaXRlbXMubGVuZ3RoOyBqKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVRvU2VuZC5pdGVtcy5wdXNoKHRoaXMuaW5zdWZmaWNpZW50X2l0ZW1zW2ldLml0ZW1zW2pdLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlbGV0ZScsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFUb1NlbmQsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnVuZGVyc3RvY2stbW9kZWwnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy51bmRlcnN0b2NrLW1vZGVsJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwxMDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkZFByb2R1Y3Q6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiICsgd2luZG93LmN1c3RvbWVyX2lkICsgXCIvZGVhbGVyLWxpc3RcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgICAgICB2YXIgY2hhbmdlcHJpY2UgPSBuZXcgVnVlKHtcbiAgICAgICAgZWw6ICcjY2hhbmdlX3ByaWNlJyxcbiAgICAgICAgZGF0YTp7XG4gICAgICAgICAgICBpdGVtczp7fSxcbiAgICAgICAgICAgIHByaWNlczpbXSxcbiAgICAgICAgICAgIHZhbDpcIlwiLFxuICAgICAgICAgICAgaWQ6XCJcIixcbiAgICAgICAgICAgIHByaWNlX2lkOjAsXG4gICAgICAgICAgICB0aW1lT3V0RXZlbnQ6MCxcbiAgICAgICAgICAgIC8vIOS/ruaUueS7t+agvOmBrue9qeWxglxuICAgICAgICAgICAgY2hhbmdwcmljZTpmYWxzZSxcbiAgICAgICAgICAgIC8vIOWIoOmZpOaMiemSrlxuICAgICAgICAgICAgY2xvc2U6ZmFsc2UsXG4gICAgICAgICAgICAvLyDljp/ku7dcbiAgICAgICAgICAgIG9yaWdpbmFsYWN0aXZlOmZhbHNlLFxuICAgICAgICAgICAgLy/ku7fmoLzlsZXnpLpcbiAgICAgICAgICAgIGhhdmVwcmljZTpmYWxzZVxuICAgICAgICAgICAgXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgICBhZGRwcmljZTpmdW5jdGlvbihvcmlncHJpY2Upe1xuICAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIF90aGlzLml0ZW1zLml0ZW1fcHJpY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfdGhpcy52YWwgPT0gX3RoaXMuaXRlbXMuaXRlbV9wcmljZXNbaV0ucHJpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICQoXCIuY2hhbmdlX3ByaWNlX2JvZHlvIHNwYW5cIikuY3NzKFwiZGlzcGxheVwiLFwiYmxvY2tcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmhhdmVwcmljZT10cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gJChcIi5jaGFuZ2VfcHJpY2VfYm9keW8gc3BhblwiKS5jc3MoXCJkaXNwbGF5XCIsXCJub25lXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5oYXZlcHJpY2U9ZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICBpZiAoX3RoaXMudmFsIT09JycgJiYgX3RoaXMuaGF2ZXByaWNlPT09ZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiK3dpbmRvdy5jdXN0b21lcl9pZCtcIi9pdGVtLXByaWNlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3B1dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIml0ZW1faWRcIjpfdGhpcy5pdGVtcy5pdGVtX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInByaWNlXCI6KE51bWJlcihfdGhpcy52YWwpLU51bWJlcihvcmlncHJpY2UpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQuY2hhbmdlKF90aGlzLml0ZW1zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnZhbD1cIlwiO1xuICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgXG5cblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoYW5nZWNsb3NlOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICBfdGhpcy5jaGFuZ3ByaWNlPWZhbHNlO1xuICAgICAgICAgICAgICAgIF90aGlzLmhhdmVwcmljZT1mYWxzZTtcbiAgICAgICAgICAgICAgICBjaGFuZ2VwcmljZS5jbG9zZT1mYWxzZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaXNjbG9zZTpmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgIF90aGlzLmNsb3NlPWZhbHNlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlbHByaWNlOmZ1bmN0aW9uKGkpe1xuICAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgICB2YXIgaWQgPSBpO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIrd2luZG93LmN1c3RvbWVyX2lkK1wiL2l0ZW0tcHJpY2VcIixcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ0RFTEVURScsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJpY2VfaWRcIjppZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2FydF9pdGVtX2lkXCI6X3RoaXMuaWRcblxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQuaW5pdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYmluZC5jaGFuZ2UoX3RoaXMuaXRlbXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7ICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBva3ByaWNlOmZ1bmN0aW9uKGUsaWQpe1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYoX3RoaXMuY2xvc2U9PT1mYWxzZSl7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnByaWNlX2lkPWlkO1xuICAgICAgICAgICAgICAgICAgICAkKGUuY3VycmVudFRhcmdldCkuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICAgICAgICAgICQoZS5jdXJyZW50VGFyZ2V0KS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgICAgICAvLyAkKFwiLmNoYW5nZV9wcmljZV9vd25cIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm9yaWdpbmFsYWN0aXZlPWZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5oYXZlcHJpY2U9ZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGd0b3VjaHN0YXJ0OmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICBfdGhpcy50aW1lT3V0RXZlbnQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2xvc2U9dHJ1ZTtcbiAgICAgICAgICAgICAgICBfdGhpcy5wcmljZV9pZD0wO1xuICAgICAgICAgICAgICAgIC8vICQoXCIuY2hhbmdlX3ByaWNlX3ByaWNlX2Nsb3NlXCIpLmNzcyhcImRpc3BsYXlcIixcImJsb2NrXCIpXG4gICAgICAgICAgICAgICB9LDUwMCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3JpZ2luYWxwcmljZTpmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgX3RoaXMucHJpY2VfaWQ9MDtcbiAgICAgICAgICAgICAgICAvLyAkKFwiLmNoYW5nZV9wcmljZV9vd25cIikuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICAgICAgIF90aGlzLm9yaWdpbmFsYWN0aXZlPXRydWU7XG4gICAgICAgICAgICAgICAgJChcIi5jaGFuZ2VfcHJpY2VfcHJpY2VvIGxpXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGd0b3VjaGVuZDpmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KF90aGlzLnRpbWVPdXRFdmVudCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29tbWl0OmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAoIF90aGlzLnByaWNlX2lkPT09MCkge1xuICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9jdXN0b21lci9cIit3aW5kb3cuY3VzdG9tZXJfaWQrXCIvaXRlbS1wcmljZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwib3JpZ2luYWxfcHJpY2VcIjoxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2FydF9pdGVtX2lkXCI6X3RoaXMuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kLmNoYW5nZShfdGhpcy5pdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gJChcIiNjaGFuZ2VfcHJpY2VcIikuY3NzKCdkaXNwbGF5Jywnbm9uZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmNoYW5ncHJpY2U9ZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuaGF2ZXByaWNlPWZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy52YWw9XCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiK3dpbmRvdy5jdXN0b21lcl9pZCtcIi9pdGVtLXByaWNlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwcmljZV9pZFwiOl90aGlzLnByaWNlX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2FydF9pdGVtX2lkXCI6X3RoaXMuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kLmNoYW5nZShfdGhpcy5pdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gJChcIiNjaGFuZ2VfcHJpY2VcIikuY3NzKCdkaXNwbGF5Jywnbm9uZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmNoYW5ncHJpY2U9ZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuaGF2ZXByaWNlPWZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy52YWw9XCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtb3VudGVkOmZ1bmN0aW9uKCl7XG4gICAgICAgIH1cbiAgICB9KTtcbmJpbmQuaW5pdCgpO1xufSkod2luZG93LmNtQXBwID0gd2luZG93LmNtQXBwIHx8IHt9KTtcbiJdLCJmaWxlIjoicmVjb21tZW5kb3JkZXIvY2FydC5qcyJ9
