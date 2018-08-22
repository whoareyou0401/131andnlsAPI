$(document).ready(function(){
    "use strict";

    setupCSRF();

    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
    }

    document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    });


    $(document).ready(function() {
        var tab = getURLParameter('tab');
        console.log(tab);
        var hasRec = $('.order_foodrecom').find('.order_food_li').length > 0;
        if (tab === 'basket' || !hasRec) {
            $('.order_add').click();
        }
        console.log('clicking');
        $('.order_foodadd').find('.order_food_choose').click();
    });


    function setToRecPage() {
        $('#placeorder').removeClass('add');
        $('#placeorder').addClass('rec');
        $('#placeorder').html('添加');
    }

    function setToAddPage() {
        $('#placeorder').removeClass('rec');
        $('#placeorder').addClass('add');
        $('#placeorder').html('下单');
    }

    function saveBasket() {
        console.log('unloading page');
        console.log('Saving basket before leaving');

        var order = processOrder();
        var sanity = order[0];
        var order_str = order[1];
        var rec_str = order[2];

        $.ajax({
            url: "/recommendorder/api/v1/customer/" + window.customer_id + "/basket",
            type: "post",
            datatype: "jsonp",
            data: {
                'basket': order_str,
                'rec': rec_str
            },
            success: function(data) {
                console.log(data);
            }
        });
    }

    // 推荐和新增商品
    $('.shop').each(function(index,ele){
        $(ele).children('.orec').find('.home-store-info').children('span').click(function(e){
            var el=e.target;
            if($(el).html()=='推荐商品'){
                $(ele).children('.orec').css('display','block');
                $(ele).children('.newadd').css('display','none');
                setToRecPage();
            }else if($(el).html()=='购 物 车'){
                $(ele).children('.orec').css('display','none');
                $(ele).children('.newadd').css('display','block');
                setToAddPage();
            }
        });
        $(ele).children('.newadd').find('.home-store-info').children('span').click(function(e){
            var el=e.target;
            if($(el).html()=='推荐商品'){
                $(ele).children('.orec').css('display','block');
                $(ele).children('.newadd').css('display','none');
                setToRecPage();
            }else if($(el).html()=='购 物 车'){
                $(ele).children('.orec').css('display','none');
                $(ele).children('.newadd').css('display','block');
                setToAddPage();
            }
        });
    });

    var mo=0;
    var j=0;
    var k=0;
    var p=0;

    // 失焦
    $(document).on('change','.num_value',function(){
        if(!isNaN(parseInt($(this).val()))){
            if($(this).val()==='0'){
                if($(this).parents('.order_food_li').find('.order_food_choose').attr('src')==assistor){
                    $(this).parents('.shop').find('.order_food_choose').each(function(){
                        if($(this).attr('src')==assistor){
                            mo+=parseFloat($(this).parents('.order_food_li').find('.order_food_mo').html().split('¥')[1])*parseInt($(this).parents('.order_food_li').find('.num_value').val());
                            $(this).parents('.shop').find('.money').find('.money_mo').html('¥'+mo.toFixed(2));
                        }

                    });
                    mo=0;
                    // 合计价钱
                    sum_money();
                }
                $(this).parents('.order_food_li').remove();
            }else if($(this).val()>0){
                if($(this).parents('.order_food_li').find('.order_food_choose').attr('src')==assistor){
                    //单个店铺价钱
                    $(this).parents('.shop').find('.order_food_choose').each(function(){
                        if($(this).attr('src')==assistor){
                            mo+=parseFloat($(this).parents('.order_food_li').find('.order_food_mo').html().split('¥')[1])*parseInt($(this).parents('.order_food_li').find('.num_value').val());
                            $(this).parents('.shop').find('.money').find('.money_mo').html('¥'+mo.toFixed(2));
                        }

                    });

                    mo=0;
                    // 合计价钱
                    sum_money();
                }
            }else if($(this).val()<0||$(this).val()===''){
                $(this).val(1);
            }
        }else if(isNaN(parseInt($(this).val()))){
            $(this).val(1);
        }

        //超过库存失效
        var val1=$(this).val();
        var val2=$(this).parents('.order_food_num').find('.num_lack').attr('stock_num');
        if(val1 > val2) {
            $(this).val(val2);
            $(this).parents('.order_food_num').find('.num_lack').css('display','block');
        }else{
            $(this).parents('.order_food_num').find('.num_lack').css('display', 'none');
        }

        // 派送
        send();
    });


    // 增加
    $(document).on('touchstart','.num_add',function(){
        //超过库存失效
        var val1=$(this).siblings('.num_value').val();
        var val2=$(this).parents('.order_food_num').find('.num_lack').attr('stock_num');
        if(val1>(val2-1)){
            $(this).siblings('.num_value').val(val2-1);
            $(this).parents('.order_food_num').find('.num_lack').css('display','block');
        }else{
            $(this).parents('.order_food_num').find('.num_lack').css('display','none');
        }

        $(this).siblings('.num_value').val(parseInt($(this).siblings('.num_value').val())+1);
        if($(this).parents('.order_food_li').find('.order_food_choose').attr('src')==assistor){
            //单个店铺价钱
            $(this).parents('.shop').find('.order_food_choose').each(function(){
                if($(this).attr('src')==assistor){
                    mo+=parseFloat($(this).parents('.order_food_li').find('.order_food_mo').html().split('¥')[1])*parseInt($(this).parents('.order_food_li').find('.num_value').val());
                    $(this).parents('.shop').find('.money').find('.money_mo').html('¥'+mo.toFixed(2));
                }

            });

            mo=0;
            // 合计价钱
            sum_money();
        }
        // 派送
        send();
    });
    $('.num_add').on('touchstart',function(){
      $(this).css('opacity','0.5');
  });
    $('.num_add').on('touchend',function(){
      $(this).css('opacity','1');
  });


    // 减少
    $(document).on('touchstart','.num_minus',function(){
        if($(this).siblings('.num_value').val()==='0'){
            $(this).siblings('.num_value').parents('.order_food_li').remove();
        }else{
            $(this).siblings('.num_value').val(parseInt($(this).siblings('.num_value').val())-1);
        }

        //低于库存提示消失
        $(this).parents('.order_food_num').find('.num_lack').css('display','none');

        if($(this).siblings('.num_value').val()==='0'){
            if($(this).parents('.order_food_li').find('.order_food_choose').attr('src')==assistor){
                var m5=parseFloat($(this).parents('.shop').find('.money').find('.money_mo').html().split('¥')[1]);
                var n5=parseFloat($(this).parents('.order_food_li').find('.order_food_mo').html().split('¥')[1]);

                $(this).parents('.shop').find('.money').find('.money_mo').html('¥'+(m5-n5).toFixed(2));
                // 合计价钱
                sum_money();
            }

            $(this).siblings('.num_value').parents('.order_food_li').remove();
        }else if($(this).siblings('.num_value').val()>0){
            if($(this).parents('.order_food_li').find('.order_food_choose').attr('src')==assistor){
                var m6=parseFloat($(this).parents('.shop').find('.money').find('.money_mo').html().split('¥')[1]);
                var n6=parseFloat($(this).parents('.order_food_li').find('.order_food_mo').html().split('¥')[1]);
                $(this).parents('.shop').find('.money').find('.money_mo').html('¥'+(m6-n6).toFixed(2));
                // 合计价钱
                sum_money();
            }
        }
        // 派送
        send();
    });
    $('.num_minus').on('touchstart',function(){
      $(this).css('opacity','0.5');
  });
    $('.num_minus').on('touchend',function(){
      $(this).css('opacity','1');
  });

    // 全选和全不选
    $(document).on('click','.order_choose',function(){
        if($(this).attr('src')==ic_un_choose){
            $(this).attr('src',assistor);
            $(this).parents('.home-store').siblings('.order_food').find('.order_food_choose').attr('src',assistor);

            //单个店铺价钱
            $(this).parents('.shop').find('.order_food_choose').each(function(){
                if($(this).attr('src')==assistor){
                    mo+=parseFloat($(this).parents('.order_food_li').find('.order_food_mo').html().split('¥')[1])*parseInt($(this).parents('.order_food_li').find('.num_value').val());
                    $(this).parents('.shop').find('.money').find('.money_mo').html('¥'+mo.toFixed(2));
                }

            });

            mo=0;

        }else if($(this).attr('src')==assistor){
            $(this).attr('src',ic_un_choose);
            $(this).parents('.home-store').siblings('.order_food').find('.order_food_choose').attr('src',ic_un_choose);

            //单个店铺价钱
            $(this).parents('.shop').find('.order_food_choose').each(function(){
                if($(this).attr('src')==assistor){
                    mo+=parseFloat($(this).parents('.order_food_li').find('.order_food_mo').html().split('¥')[1])*parseInt($(this).parents('.order_food_li').find('.num_value').val());
                }
                $(this).parents('.shop').find('.money').find('.money_mo').html('¥'+mo.toFixed(2));
            });
            mo=0;
        }

        // 合计价钱
        sum_money();

        // 派送
        send();
    });




    // 单选
    $(document).on('click','.order_food_choose',function(){
        $(this).toggleClass('selected');
        if($(this).attr('src')==ic_un_choose){
            $(this).attr('src',assistor);
            //单个店铺价钱
            k=parseFloat($(this).parents('.shop').find('.money').find('.money_mo').html().split('¥')[1]);
            var k1=parseFloat($(this).parents('.order_food_li').find('.order_food_mo').html().split('¥')[1])*parseInt($(this).parents('.order_food_li').find('.num_value').val());
            $(this).parents('.shop').find('.money').find('.money_mo').html('¥'+(k+k1).toFixed(2));
        }else if($(this).attr('src')==assistor){
            $(this).attr('src',ic_un_choose);
            $(this).parents('.order_food').siblings('.home-store').find('.order_choose').attr('src',ic_un_choose);
            // 单个店铺价钱
            k=parseFloat($(this).parents('.shop').find('.money').find('.money_mo').html().split('¥')[1]);
            var k2=parseFloat($(this).parents('.order_food_li').find('.order_food_mo').html().split('¥')[1])*parseInt($(this).parents('.order_food_li').find('.num_value').val());
            $(this).parents('.shop').find('.money').find('.money_mo').html('¥'+(k-k2).toFixed(2));
        }
        // 合计价钱
        sum_money();
        // 派送
        send();
    });


    // 合计价钱
    function sum_money(){
        $('.money_mo').each(function(){

            j = j+parseFloat($(this).html().split('¥')[1]);
            $('.xiadan_sum').html('¥'+j.toFixed(2));

        });
        j = 0;
    }

    // 派送
    function send(){
        $('.money_mo').each(function(){
            if($(this).html().split('¥')[1]>0&&$(this).html().split('¥')[1]<300){
                $(this).siblings('.send_no').css('display','inline-block');
                $(this).siblings('.send_ok').css('display','none');
                $(this).siblings('.send_no').html('还差¥ '+(300-$(this).html().split('¥')[1]).toFixed(2));
            }else if($(this).html().split('¥')[1]>=300){
                $(this).siblings('.send_no').css('display','none');
                $(this).siblings('.send_ok').css('display','inline-block');
            }else if($(this).html().split('¥')[1]==='0.00'){
                $(this).siblings('.send_no').css('display','inline-block');
                $(this).siblings('.send_ok').css('display','none');
                $(this).siblings('.send_no').html('¥ 300起送');
            }
        });
        saveBasket();
    }

    function processOrder() {
        console.log('place order clicked');
        var sanity = true;

        var order_str = '';
        var rec_str = '';
        $('.order_food_choose').each(function() {
            console.log($(this).attr("src"));
            var cur_li = $(this).parent();
            var item = cur_li.find(".item_name");
            var item_name = item.html();
            var item_id = item.attr("item_id");
            var inventory = cur_li.find(".num_lack").attr("stock_num");
            var num_selected = cur_li.find(".num_value").val();
            if($(this).hasClass("selected")) {
                console.log('Found selected item');
                console.log(item_name + "," +  item_id + "," + inventory + "," + num_selected);
                if (parseInt(num_selected) > parseInt(inventory)) {
                    alert(item_name + '库存不足 (' + num_selected + '/' + inventory + ')');
                    sanity = false;
                    return false;
                }
                order_str = order_str + item_id + ',' + num_selected + '|';
            } else if ($(this).hasClass('rec')) {
                if (parseInt(num_selected) > parseInt(inventory)) {
                    num_selected = inventory;
                }
                rec_str = rec_str + item_id + ',' + num_selected + '|';
            }
        });
        return [sanity, order_str, rec_str];
    }


    $('#placeorder').click(function() {
        if ($('#placeorder').hasClass('rec')) {
            console.log('place order');
            $('.order_add').click();
        } else {
            var order = processOrder();
            var sanity = order[0];
            var order_str = order[1];
            if (sanity) {
                console.log('Orders: ' + order_str);
                var next_href = '/recommendorder/customer/' + window.customer_id + '/confirm-order?orders=' + order_str;
                window.location.href = next_href;
            }
        }
    });

    $('#todealer').click(function() {
        console.log('to dealer');
        // TODO: don't hardcode dealer1, go to the dealer selection page
        window.location.href = '/recommendorder/dealer/1/customer/' + window.customer_id + '/add-item';
    });

    nodoubletapzoom();
});
