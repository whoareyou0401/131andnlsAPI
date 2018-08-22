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
