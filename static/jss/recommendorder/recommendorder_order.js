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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlcl9vcmRlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgc2V0dXBDU1JGKCk7XG5cbiAgICBmdW5jdGlvbiBnZXRVUkxQYXJhbWV0ZXIobmFtZSkge1xuICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KChuZXcgUmVnRXhwKCdbP3wmXScgKyBuYW1lICsgJz0nICsgJyhbXiY7XSs/KSgmfCN8O3wkKScpLmV4ZWMobG9jYXRpb24uc2VhcmNoKSB8fCBbbnVsbCwgJyddKVsxXS5yZXBsYWNlKC9cXCsvZywgJyUyMCcpKSB8fCBudWxsO1xuICAgIH1cblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2dlc3R1cmVzdGFydCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9KTtcblxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0YWIgPSBnZXRVUkxQYXJhbWV0ZXIoJ3RhYicpO1xuICAgICAgICBjb25zb2xlLmxvZyh0YWIpO1xuICAgICAgICB2YXIgaGFzUmVjID0gJCgnLm9yZGVyX2Zvb2RyZWNvbScpLmZpbmQoJy5vcmRlcl9mb29kX2xpJykubGVuZ3RoID4gMDtcbiAgICAgICAgaWYgKHRhYiA9PT0gJ2Jhc2tldCcgfHwgIWhhc1JlYykge1xuICAgICAgICAgICAgJCgnLm9yZGVyX2FkZCcpLmNsaWNrKCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coJ2NsaWNraW5nJyk7XG4gICAgICAgICQoJy5vcmRlcl9mb29kYWRkJykuZmluZCgnLm9yZGVyX2Zvb2RfY2hvb3NlJykuY2xpY2soKTtcbiAgICB9KTtcblxuXG4gICAgZnVuY3Rpb24gc2V0VG9SZWNQYWdlKCkge1xuICAgICAgICAkKCcjcGxhY2VvcmRlcicpLnJlbW92ZUNsYXNzKCdhZGQnKTtcbiAgICAgICAgJCgnI3BsYWNlb3JkZXInKS5hZGRDbGFzcygncmVjJyk7XG4gICAgICAgICQoJyNwbGFjZW9yZGVyJykuaHRtbCgn5re75YqgJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0VG9BZGRQYWdlKCkge1xuICAgICAgICAkKCcjcGxhY2VvcmRlcicpLnJlbW92ZUNsYXNzKCdyZWMnKTtcbiAgICAgICAgJCgnI3BsYWNlb3JkZXInKS5hZGRDbGFzcygnYWRkJyk7XG4gICAgICAgICQoJyNwbGFjZW9yZGVyJykuaHRtbCgn5LiL5Y2VJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2F2ZUJhc2tldCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3VubG9hZGluZyBwYWdlJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTYXZpbmcgYmFza2V0IGJlZm9yZSBsZWF2aW5nJyk7XG5cbiAgICAgICAgdmFyIG9yZGVyID0gcHJvY2Vzc09yZGVyKCk7XG4gICAgICAgIHZhciBzYW5pdHkgPSBvcmRlclswXTtcbiAgICAgICAgdmFyIG9yZGVyX3N0ciA9IG9yZGVyWzFdO1xuICAgICAgICB2YXIgcmVjX3N0ciA9IG9yZGVyWzJdO1xuXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IFwiL3JlY29tbWVuZG9yZGVyL2FwaS92MS9jdXN0b21lci9cIiArIHdpbmRvdy5jdXN0b21lcl9pZCArIFwiL2Jhc2tldFwiLFxuICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXG4gICAgICAgICAgICBkYXRhdHlwZTogXCJqc29ucFwiLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICdiYXNrZXQnOiBvcmRlcl9zdHIsXG4gICAgICAgICAgICAgICAgJ3JlYyc6IHJlY19zdHJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIOaOqOiNkOWSjOaWsOWinuWVhuWTgVxuICAgICQoJy5zaG9wJykuZWFjaChmdW5jdGlvbihpbmRleCxlbGUpe1xuICAgICAgICAkKGVsZSkuY2hpbGRyZW4oJy5vcmVjJykuZmluZCgnLmhvbWUtc3RvcmUtaW5mbycpLmNoaWxkcmVuKCdzcGFuJykuY2xpY2soZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICB2YXIgZWw9ZS50YXJnZXQ7XG4gICAgICAgICAgICBpZigkKGVsKS5odG1sKCk9PSfmjqjojZDllYblk4EnKXtcbiAgICAgICAgICAgICAgICAkKGVsZSkuY2hpbGRyZW4oJy5vcmVjJykuY3NzKCdkaXNwbGF5JywnYmxvY2snKTtcbiAgICAgICAgICAgICAgICAkKGVsZSkuY2hpbGRyZW4oJy5uZXdhZGQnKS5jc3MoJ2Rpc3BsYXknLCdub25lJyk7XG4gICAgICAgICAgICAgICAgc2V0VG9SZWNQYWdlKCk7XG4gICAgICAgICAgICB9ZWxzZSBpZigkKGVsKS5odG1sKCk9PSfotK0g54mpIOi9picpe1xuICAgICAgICAgICAgICAgICQoZWxlKS5jaGlsZHJlbignLm9yZWMnKS5jc3MoJ2Rpc3BsYXknLCdub25lJyk7XG4gICAgICAgICAgICAgICAgJChlbGUpLmNoaWxkcmVuKCcubmV3YWRkJykuY3NzKCdkaXNwbGF5JywnYmxvY2snKTtcbiAgICAgICAgICAgICAgICBzZXRUb0FkZFBhZ2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgICQoZWxlKS5jaGlsZHJlbignLm5ld2FkZCcpLmZpbmQoJy5ob21lLXN0b3JlLWluZm8nKS5jaGlsZHJlbignc3BhbicpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgdmFyIGVsPWUudGFyZ2V0O1xuICAgICAgICAgICAgaWYoJChlbCkuaHRtbCgpPT0n5o6o6I2Q5ZWG5ZOBJyl7XG4gICAgICAgICAgICAgICAgJChlbGUpLmNoaWxkcmVuKCcub3JlYycpLmNzcygnZGlzcGxheScsJ2Jsb2NrJyk7XG4gICAgICAgICAgICAgICAgJChlbGUpLmNoaWxkcmVuKCcubmV3YWRkJykuY3NzKCdkaXNwbGF5Jywnbm9uZScpO1xuICAgICAgICAgICAgICAgIHNldFRvUmVjUGFnZSgpO1xuICAgICAgICAgICAgfWVsc2UgaWYoJChlbCkuaHRtbCgpPT0n6LStIOeJqSDovaYnKXtcbiAgICAgICAgICAgICAgICAkKGVsZSkuY2hpbGRyZW4oJy5vcmVjJykuY3NzKCdkaXNwbGF5Jywnbm9uZScpO1xuICAgICAgICAgICAgICAgICQoZWxlKS5jaGlsZHJlbignLm5ld2FkZCcpLmNzcygnZGlzcGxheScsJ2Jsb2NrJyk7XG4gICAgICAgICAgICAgICAgc2V0VG9BZGRQYWdlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdmFyIG1vPTA7XG4gICAgdmFyIGo9MDtcbiAgICB2YXIgaz0wO1xuICAgIHZhciBwPTA7XG5cbiAgICAvLyDlpLHnhKZcbiAgICAkKGRvY3VtZW50KS5vbignY2hhbmdlJywnLm51bV92YWx1ZScsZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoIWlzTmFOKHBhcnNlSW50KCQodGhpcykudmFsKCkpKSl7XG4gICAgICAgICAgICBpZigkKHRoaXMpLnZhbCgpPT09JzAnKXtcbiAgICAgICAgICAgICAgICBpZigkKHRoaXMpLnBhcmVudHMoJy5vcmRlcl9mb29kX2xpJykuZmluZCgnLm9yZGVyX2Zvb2RfY2hvb3NlJykuYXR0cignc3JjJyk9PWFzc2lzdG9yKXtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcuc2hvcCcpLmZpbmQoJy5vcmRlcl9mb29kX2Nob29zZScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCQodGhpcykuYXR0cignc3JjJyk9PWFzc2lzdG9yKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtbys9cGFyc2VGbG9hdCgkKHRoaXMpLnBhcmVudHMoJy5vcmRlcl9mb29kX2xpJykuZmluZCgnLm9yZGVyX2Zvb2RfbW8nKS5odG1sKCkuc3BsaXQoJ8KlJylbMV0pKnBhcnNlSW50KCQodGhpcykucGFyZW50cygnLm9yZGVyX2Zvb2RfbGknKS5maW5kKCcubnVtX3ZhbHVlJykudmFsKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygnLnNob3AnKS5maW5kKCcubW9uZXknKS5maW5kKCcubW9uZXlfbW8nKS5odG1sKCfCpScrbW8udG9GaXhlZCgyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIG1vPTA7XG4gICAgICAgICAgICAgICAgICAgIC8vIOWQiOiuoeS7t+mSsVxuICAgICAgICAgICAgICAgICAgICBzdW1fbW9uZXkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcub3JkZXJfZm9vZF9saScpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfWVsc2UgaWYoJCh0aGlzKS52YWwoKT4wKXtcbiAgICAgICAgICAgICAgICBpZigkKHRoaXMpLnBhcmVudHMoJy5vcmRlcl9mb29kX2xpJykuZmluZCgnLm9yZGVyX2Zvb2RfY2hvb3NlJykuYXR0cignc3JjJyk9PWFzc2lzdG9yKXtcbiAgICAgICAgICAgICAgICAgICAgLy/ljZXkuKrlupfpk7rku7fpkrFcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcuc2hvcCcpLmZpbmQoJy5vcmRlcl9mb29kX2Nob29zZScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCQodGhpcykuYXR0cignc3JjJyk9PWFzc2lzdG9yKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtbys9cGFyc2VGbG9hdCgkKHRoaXMpLnBhcmVudHMoJy5vcmRlcl9mb29kX2xpJykuZmluZCgnLm9yZGVyX2Zvb2RfbW8nKS5odG1sKCkuc3BsaXQoJ8KlJylbMV0pKnBhcnNlSW50KCQodGhpcykucGFyZW50cygnLm9yZGVyX2Zvb2RfbGknKS5maW5kKCcubnVtX3ZhbHVlJykudmFsKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygnLnNob3AnKS5maW5kKCcubW9uZXknKS5maW5kKCcubW9uZXlfbW8nKS5odG1sKCfCpScrbW8udG9GaXhlZCgyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgbW89MDtcbiAgICAgICAgICAgICAgICAgICAgLy8g5ZCI6K6h5Lu36ZKxXG4gICAgICAgICAgICAgICAgICAgIHN1bV9tb25leSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNlIGlmKCQodGhpcykudmFsKCk8MHx8JCh0aGlzKS52YWwoKT09PScnKXtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnZhbCgxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfWVsc2UgaWYoaXNOYU4ocGFyc2VJbnQoJCh0aGlzKS52YWwoKSkpKXtcbiAgICAgICAgICAgICQodGhpcykudmFsKDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy/otoXov4flupPlrZjlpLHmlYhcbiAgICAgICAgdmFyIHZhbDE9JCh0aGlzKS52YWwoKTtcbiAgICAgICAgdmFyIHZhbDI9JCh0aGlzKS5wYXJlbnRzKCcub3JkZXJfZm9vZF9udW0nKS5maW5kKCcubnVtX2xhY2snKS5hdHRyKCdzdG9ja19udW0nKTtcbiAgICAgICAgaWYodmFsMSA+IHZhbDIpIHtcbiAgICAgICAgICAgICQodGhpcykudmFsKHZhbDIpO1xuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcub3JkZXJfZm9vZF9udW0nKS5maW5kKCcubnVtX2xhY2snKS5jc3MoJ2Rpc3BsYXknLCdibG9jaycpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICQodGhpcykucGFyZW50cygnLm9yZGVyX2Zvb2RfbnVtJykuZmluZCgnLm51bV9sYWNrJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOa0vumAgVxuICAgICAgICBzZW5kKCk7XG4gICAgfSk7XG5cblxuICAgIC8vIOWinuWKoFxuICAgICQoZG9jdW1lbnQpLm9uKCd0b3VjaHN0YXJ0JywnLm51bV9hZGQnLGZ1bmN0aW9uKCl7XG4gICAgICAgIC8v6LaF6L+H5bqT5a2Y5aSx5pWIXG4gICAgICAgIHZhciB2YWwxPSQodGhpcykuc2libGluZ3MoJy5udW1fdmFsdWUnKS52YWwoKTtcbiAgICAgICAgdmFyIHZhbDI9JCh0aGlzKS5wYXJlbnRzKCcub3JkZXJfZm9vZF9udW0nKS5maW5kKCcubnVtX2xhY2snKS5hdHRyKCdzdG9ja19udW0nKTtcbiAgICAgICAgaWYodmFsMT4odmFsMi0xKSl7XG4gICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcubnVtX3ZhbHVlJykudmFsKHZhbDItMSk7XG4gICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJy5vcmRlcl9mb29kX251bScpLmZpbmQoJy5udW1fbGFjaycpLmNzcygnZGlzcGxheScsJ2Jsb2NrJyk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcub3JkZXJfZm9vZF9udW0nKS5maW5kKCcubnVtX2xhY2snKS5jc3MoJ2Rpc3BsYXknLCdub25lJyk7XG4gICAgICAgIH1cblxuICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcubnVtX3ZhbHVlJykudmFsKHBhcnNlSW50KCQodGhpcykuc2libGluZ3MoJy5udW1fdmFsdWUnKS52YWwoKSkrMSk7XG4gICAgICAgIGlmKCQodGhpcykucGFyZW50cygnLm9yZGVyX2Zvb2RfbGknKS5maW5kKCcub3JkZXJfZm9vZF9jaG9vc2UnKS5hdHRyKCdzcmMnKT09YXNzaXN0b3Ipe1xuICAgICAgICAgICAgLy/ljZXkuKrlupfpk7rku7fpkrFcbiAgICAgICAgICAgICQodGhpcykucGFyZW50cygnLnNob3AnKS5maW5kKCcub3JkZXJfZm9vZF9jaG9vc2UnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYoJCh0aGlzKS5hdHRyKCdzcmMnKT09YXNzaXN0b3Ipe1xuICAgICAgICAgICAgICAgICAgICBtbys9cGFyc2VGbG9hdCgkKHRoaXMpLnBhcmVudHMoJy5vcmRlcl9mb29kX2xpJykuZmluZCgnLm9yZGVyX2Zvb2RfbW8nKS5odG1sKCkuc3BsaXQoJ8KlJylbMV0pKnBhcnNlSW50KCQodGhpcykucGFyZW50cygnLm9yZGVyX2Zvb2RfbGknKS5maW5kKCcubnVtX3ZhbHVlJykudmFsKCkpO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJy5zaG9wJykuZmluZCgnLm1vbmV5JykuZmluZCgnLm1vbmV5X21vJykuaHRtbCgnwqUnK21vLnRvRml4ZWQoMikpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG1vPTA7XG4gICAgICAgICAgICAvLyDlkIjorqHku7fpkrFcbiAgICAgICAgICAgIHN1bV9tb25leSgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIOa0vumAgVxuICAgICAgICBzZW5kKCk7XG4gICAgfSk7XG4gICAgJCgnLm51bV9hZGQnKS5vbigndG91Y2hzdGFydCcsZnVuY3Rpb24oKXtcbiAgICAgICQodGhpcykuY3NzKCdvcGFjaXR5JywnMC41Jyk7XG4gIH0pO1xuICAgICQoJy5udW1fYWRkJykub24oJ3RvdWNoZW5kJyxmdW5jdGlvbigpe1xuICAgICAgJCh0aGlzKS5jc3MoJ29wYWNpdHknLCcxJyk7XG4gIH0pO1xuXG5cbiAgICAvLyDlh4/lsJFcbiAgICAkKGRvY3VtZW50KS5vbigndG91Y2hzdGFydCcsJy5udW1fbWludXMnLGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKCQodGhpcykuc2libGluZ3MoJy5udW1fdmFsdWUnKS52YWwoKT09PScwJyl7XG4gICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcubnVtX3ZhbHVlJykucGFyZW50cygnLm9yZGVyX2Zvb2RfbGknKS5yZW1vdmUoKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcubnVtX3ZhbHVlJykudmFsKHBhcnNlSW50KCQodGhpcykuc2libGluZ3MoJy5udW1fdmFsdWUnKS52YWwoKSktMSk7XG4gICAgICAgIH1cblxuICAgICAgICAvL+S9juS6juW6k+WtmOaPkOekuua2iOWksVxuICAgICAgICAkKHRoaXMpLnBhcmVudHMoJy5vcmRlcl9mb29kX251bScpLmZpbmQoJy5udW1fbGFjaycpLmNzcygnZGlzcGxheScsJ25vbmUnKTtcblxuICAgICAgICBpZigkKHRoaXMpLnNpYmxpbmdzKCcubnVtX3ZhbHVlJykudmFsKCk9PT0nMCcpe1xuICAgICAgICAgICAgaWYoJCh0aGlzKS5wYXJlbnRzKCcub3JkZXJfZm9vZF9saScpLmZpbmQoJy5vcmRlcl9mb29kX2Nob29zZScpLmF0dHIoJ3NyYycpPT1hc3Npc3Rvcil7XG4gICAgICAgICAgICAgICAgdmFyIG01PXBhcnNlRmxvYXQoJCh0aGlzKS5wYXJlbnRzKCcuc2hvcCcpLmZpbmQoJy5tb25leScpLmZpbmQoJy5tb25leV9tbycpLmh0bWwoKS5zcGxpdCgnwqUnKVsxXSk7XG4gICAgICAgICAgICAgICAgdmFyIG41PXBhcnNlRmxvYXQoJCh0aGlzKS5wYXJlbnRzKCcub3JkZXJfZm9vZF9saScpLmZpbmQoJy5vcmRlcl9mb29kX21vJykuaHRtbCgpLnNwbGl0KCfCpScpWzFdKTtcblxuICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygnLnNob3AnKS5maW5kKCcubW9uZXknKS5maW5kKCcubW9uZXlfbW8nKS5odG1sKCfCpScrKG01LW41KS50b0ZpeGVkKDIpKTtcbiAgICAgICAgICAgICAgICAvLyDlkIjorqHku7fpkrFcbiAgICAgICAgICAgICAgICBzdW1fbW9uZXkoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLm51bV92YWx1ZScpLnBhcmVudHMoJy5vcmRlcl9mb29kX2xpJykucmVtb3ZlKCk7XG4gICAgICAgIH1lbHNlIGlmKCQodGhpcykuc2libGluZ3MoJy5udW1fdmFsdWUnKS52YWwoKT4wKXtcbiAgICAgICAgICAgIGlmKCQodGhpcykucGFyZW50cygnLm9yZGVyX2Zvb2RfbGknKS5maW5kKCcub3JkZXJfZm9vZF9jaG9vc2UnKS5hdHRyKCdzcmMnKT09YXNzaXN0b3Ipe1xuICAgICAgICAgICAgICAgIHZhciBtNj1wYXJzZUZsb2F0KCQodGhpcykucGFyZW50cygnLnNob3AnKS5maW5kKCcubW9uZXknKS5maW5kKCcubW9uZXlfbW8nKS5odG1sKCkuc3BsaXQoJ8KlJylbMV0pO1xuICAgICAgICAgICAgICAgIHZhciBuNj1wYXJzZUZsb2F0KCQodGhpcykucGFyZW50cygnLm9yZGVyX2Zvb2RfbGknKS5maW5kKCcub3JkZXJfZm9vZF9tbycpLmh0bWwoKS5zcGxpdCgnwqUnKVsxXSk7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcuc2hvcCcpLmZpbmQoJy5tb25leScpLmZpbmQoJy5tb25leV9tbycpLmh0bWwoJ8KlJysobTYtbjYpLnRvRml4ZWQoMikpO1xuICAgICAgICAgICAgICAgIC8vIOWQiOiuoeS7t+mSsVxuICAgICAgICAgICAgICAgIHN1bV9tb25leSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIOa0vumAgVxuICAgICAgICBzZW5kKCk7XG4gICAgfSk7XG4gICAgJCgnLm51bV9taW51cycpLm9uKCd0b3VjaHN0YXJ0JyxmdW5jdGlvbigpe1xuICAgICAgJCh0aGlzKS5jc3MoJ29wYWNpdHknLCcwLjUnKTtcbiAgfSk7XG4gICAgJCgnLm51bV9taW51cycpLm9uKCd0b3VjaGVuZCcsZnVuY3Rpb24oKXtcbiAgICAgICQodGhpcykuY3NzKCdvcGFjaXR5JywnMScpO1xuICB9KTtcblxuICAgIC8vIOWFqOmAieWSjOWFqOS4jemAiVxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5vcmRlcl9jaG9vc2UnLGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKCQodGhpcykuYXR0cignc3JjJyk9PWljX3VuX2Nob29zZSl7XG4gICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ3NyYycsYXNzaXN0b3IpO1xuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcuaG9tZS1zdG9yZScpLnNpYmxpbmdzKCcub3JkZXJfZm9vZCcpLmZpbmQoJy5vcmRlcl9mb29kX2Nob29zZScpLmF0dHIoJ3NyYycsYXNzaXN0b3IpO1xuXG4gICAgICAgICAgICAvL+WNleS4quW6l+mTuuS7t+mSsVxuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcuc2hvcCcpLmZpbmQoJy5vcmRlcl9mb29kX2Nob29zZScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBpZigkKHRoaXMpLmF0dHIoJ3NyYycpPT1hc3Npc3Rvcil7XG4gICAgICAgICAgICAgICAgICAgIG1vKz1wYXJzZUZsb2F0KCQodGhpcykucGFyZW50cygnLm9yZGVyX2Zvb2RfbGknKS5maW5kKCcub3JkZXJfZm9vZF9tbycpLmh0bWwoKS5zcGxpdCgnwqUnKVsxXSkqcGFyc2VJbnQoJCh0aGlzKS5wYXJlbnRzKCcub3JkZXJfZm9vZF9saScpLmZpbmQoJy5udW1fdmFsdWUnKS52YWwoKSk7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygnLnNob3AnKS5maW5kKCcubW9uZXknKS5maW5kKCcubW9uZXlfbW8nKS5odG1sKCfCpScrbW8udG9GaXhlZCgyKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbW89MDtcblxuICAgICAgICB9ZWxzZSBpZigkKHRoaXMpLmF0dHIoJ3NyYycpPT1hc3Npc3Rvcil7XG4gICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ3NyYycsaWNfdW5fY2hvb3NlKTtcbiAgICAgICAgICAgICQodGhpcykucGFyZW50cygnLmhvbWUtc3RvcmUnKS5zaWJsaW5ncygnLm9yZGVyX2Zvb2QnKS5maW5kKCcub3JkZXJfZm9vZF9jaG9vc2UnKS5hdHRyKCdzcmMnLGljX3VuX2Nob29zZSk7XG5cbiAgICAgICAgICAgIC8v5Y2V5Liq5bqX6ZO65Lu36ZKxXG4gICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJy5zaG9wJykuZmluZCgnLm9yZGVyX2Zvb2RfY2hvb3NlJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmKCQodGhpcykuYXR0cignc3JjJyk9PWFzc2lzdG9yKXtcbiAgICAgICAgICAgICAgICAgICAgbW8rPXBhcnNlRmxvYXQoJCh0aGlzKS5wYXJlbnRzKCcub3JkZXJfZm9vZF9saScpLmZpbmQoJy5vcmRlcl9mb29kX21vJykuaHRtbCgpLnNwbGl0KCfCpScpWzFdKSpwYXJzZUludCgkKHRoaXMpLnBhcmVudHMoJy5vcmRlcl9mb29kX2xpJykuZmluZCgnLm51bV92YWx1ZScpLnZhbCgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcuc2hvcCcpLmZpbmQoJy5tb25leScpLmZpbmQoJy5tb25leV9tbycpLmh0bWwoJ8KlJyttby50b0ZpeGVkKDIpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbW89MDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOWQiOiuoeS7t+mSsVxuICAgICAgICBzdW1fbW9uZXkoKTtcblxuICAgICAgICAvLyDmtL7pgIFcbiAgICAgICAgc2VuZCgpO1xuICAgIH0pO1xuXG5cblxuXG4gICAgLy8g5Y2V6YCJXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywnLm9yZGVyX2Zvb2RfY2hvb3NlJyxmdW5jdGlvbigpe1xuICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICBpZigkKHRoaXMpLmF0dHIoJ3NyYycpPT1pY191bl9jaG9vc2Upe1xuICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdzcmMnLGFzc2lzdG9yKTtcbiAgICAgICAgICAgIC8v5Y2V5Liq5bqX6ZO65Lu36ZKxXG4gICAgICAgICAgICBrPXBhcnNlRmxvYXQoJCh0aGlzKS5wYXJlbnRzKCcuc2hvcCcpLmZpbmQoJy5tb25leScpLmZpbmQoJy5tb25leV9tbycpLmh0bWwoKS5zcGxpdCgnwqUnKVsxXSk7XG4gICAgICAgICAgICB2YXIgazE9cGFyc2VGbG9hdCgkKHRoaXMpLnBhcmVudHMoJy5vcmRlcl9mb29kX2xpJykuZmluZCgnLm9yZGVyX2Zvb2RfbW8nKS5odG1sKCkuc3BsaXQoJ8KlJylbMV0pKnBhcnNlSW50KCQodGhpcykucGFyZW50cygnLm9yZGVyX2Zvb2RfbGknKS5maW5kKCcubnVtX3ZhbHVlJykudmFsKCkpO1xuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcuc2hvcCcpLmZpbmQoJy5tb25leScpLmZpbmQoJy5tb25leV9tbycpLmh0bWwoJ8KlJysoaytrMSkudG9GaXhlZCgyKSk7XG4gICAgICAgIH1lbHNlIGlmKCQodGhpcykuYXR0cignc3JjJyk9PWFzc2lzdG9yKXtcbiAgICAgICAgICAgICQodGhpcykuYXR0cignc3JjJyxpY191bl9jaG9vc2UpO1xuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcub3JkZXJfZm9vZCcpLnNpYmxpbmdzKCcuaG9tZS1zdG9yZScpLmZpbmQoJy5vcmRlcl9jaG9vc2UnKS5hdHRyKCdzcmMnLGljX3VuX2Nob29zZSk7XG4gICAgICAgICAgICAvLyDljZXkuKrlupfpk7rku7fpkrFcbiAgICAgICAgICAgIGs9cGFyc2VGbG9hdCgkKHRoaXMpLnBhcmVudHMoJy5zaG9wJykuZmluZCgnLm1vbmV5JykuZmluZCgnLm1vbmV5X21vJykuaHRtbCgpLnNwbGl0KCfCpScpWzFdKTtcbiAgICAgICAgICAgIHZhciBrMj1wYXJzZUZsb2F0KCQodGhpcykucGFyZW50cygnLm9yZGVyX2Zvb2RfbGknKS5maW5kKCcub3JkZXJfZm9vZF9tbycpLmh0bWwoKS5zcGxpdCgnwqUnKVsxXSkqcGFyc2VJbnQoJCh0aGlzKS5wYXJlbnRzKCcub3JkZXJfZm9vZF9saScpLmZpbmQoJy5udW1fdmFsdWUnKS52YWwoKSk7XG4gICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJy5zaG9wJykuZmluZCgnLm1vbmV5JykuZmluZCgnLm1vbmV5X21vJykuaHRtbCgnwqUnKyhrLWsyKS50b0ZpeGVkKDIpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyDlkIjorqHku7fpkrFcbiAgICAgICAgc3VtX21vbmV5KCk7XG4gICAgICAgIC8vIOa0vumAgVxuICAgICAgICBzZW5kKCk7XG4gICAgfSk7XG5cblxuICAgIC8vIOWQiOiuoeS7t+mSsVxuICAgIGZ1bmN0aW9uIHN1bV9tb25leSgpe1xuICAgICAgICAkKCcubW9uZXlfbW8nKS5lYWNoKGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIGogPSBqK3BhcnNlRmxvYXQoJCh0aGlzKS5odG1sKCkuc3BsaXQoJ8KlJylbMV0pO1xuICAgICAgICAgICAgJCgnLnhpYWRhbl9zdW0nKS5odG1sKCfCpScrai50b0ZpeGVkKDIpKTtcblxuICAgICAgICB9KTtcbiAgICAgICAgaiA9IDA7XG4gICAgfVxuXG4gICAgLy8g5rS+6YCBXG4gICAgZnVuY3Rpb24gc2VuZCgpe1xuICAgICAgICAkKCcubW9uZXlfbW8nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZigkKHRoaXMpLmh0bWwoKS5zcGxpdCgnwqUnKVsxXT4wJiYkKHRoaXMpLmh0bWwoKS5zcGxpdCgnwqUnKVsxXTwzMDApe1xuICAgICAgICAgICAgICAgICQodGhpcykuc2libGluZ3MoJy5zZW5kX25vJykuY3NzKCdkaXNwbGF5JywnaW5saW5lLWJsb2NrJyk7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLnNlbmRfb2snKS5jc3MoJ2Rpc3BsYXknLCdub25lJyk7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLnNlbmRfbm8nKS5odG1sKCfov5jlt67CpSAnKygzMDAtJCh0aGlzKS5odG1sKCkuc3BsaXQoJ8KlJylbMV0pLnRvRml4ZWQoMikpO1xuICAgICAgICAgICAgfWVsc2UgaWYoJCh0aGlzKS5odG1sKCkuc3BsaXQoJ8KlJylbMV0+PTMwMCl7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLnNlbmRfbm8nKS5jc3MoJ2Rpc3BsYXknLCdub25lJyk7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLnNlbmRfb2snKS5jc3MoJ2Rpc3BsYXknLCdpbmxpbmUtYmxvY2snKTtcbiAgICAgICAgICAgIH1lbHNlIGlmKCQodGhpcykuaHRtbCgpLnNwbGl0KCfCpScpWzFdPT09JzAuMDAnKXtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcuc2VuZF9ubycpLmNzcygnZGlzcGxheScsJ2lubGluZS1ibG9jaycpO1xuICAgICAgICAgICAgICAgICQodGhpcykuc2libGluZ3MoJy5zZW5kX29rJykuY3NzKCdkaXNwbGF5Jywnbm9uZScpO1xuICAgICAgICAgICAgICAgICQodGhpcykuc2libGluZ3MoJy5zZW5kX25vJykuaHRtbCgnwqUgMzAw6LW36YCBJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzYXZlQmFza2V0KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc09yZGVyKCkge1xuICAgICAgICBjb25zb2xlLmxvZygncGxhY2Ugb3JkZXIgY2xpY2tlZCcpO1xuICAgICAgICB2YXIgc2FuaXR5ID0gdHJ1ZTtcblxuICAgICAgICB2YXIgb3JkZXJfc3RyID0gJyc7XG4gICAgICAgIHZhciByZWNfc3RyID0gJyc7XG4gICAgICAgICQoJy5vcmRlcl9mb29kX2Nob29zZScpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygkKHRoaXMpLmF0dHIoXCJzcmNcIikpO1xuICAgICAgICAgICAgdmFyIGN1cl9saSA9ICQodGhpcykucGFyZW50KCk7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGN1cl9saS5maW5kKFwiLml0ZW1fbmFtZVwiKTtcbiAgICAgICAgICAgIHZhciBpdGVtX25hbWUgPSBpdGVtLmh0bWwoKTtcbiAgICAgICAgICAgIHZhciBpdGVtX2lkID0gaXRlbS5hdHRyKFwiaXRlbV9pZFwiKTtcbiAgICAgICAgICAgIHZhciBpbnZlbnRvcnkgPSBjdXJfbGkuZmluZChcIi5udW1fbGFja1wiKS5hdHRyKFwic3RvY2tfbnVtXCIpO1xuICAgICAgICAgICAgdmFyIG51bV9zZWxlY3RlZCA9IGN1cl9saS5maW5kKFwiLm51bV92YWx1ZVwiKS52YWwoKTtcbiAgICAgICAgICAgIGlmKCQodGhpcykuaGFzQ2xhc3MoXCJzZWxlY3RlZFwiKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGb3VuZCBzZWxlY3RlZCBpdGVtJyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaXRlbV9uYW1lICsgXCIsXCIgKyAgaXRlbV9pZCArIFwiLFwiICsgaW52ZW50b3J5ICsgXCIsXCIgKyBudW1fc2VsZWN0ZWQpO1xuICAgICAgICAgICAgICAgIGlmIChwYXJzZUludChudW1fc2VsZWN0ZWQpID4gcGFyc2VJbnQoaW52ZW50b3J5KSkge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChpdGVtX25hbWUgKyAn5bqT5a2Y5LiN6LazICgnICsgbnVtX3NlbGVjdGVkICsgJy8nICsgaW52ZW50b3J5ICsgJyknKTtcbiAgICAgICAgICAgICAgICAgICAgc2FuaXR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3JkZXJfc3RyID0gb3JkZXJfc3RyICsgaXRlbV9pZCArICcsJyArIG51bV9zZWxlY3RlZCArICd8JztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJCh0aGlzKS5oYXNDbGFzcygncmVjJykpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyc2VJbnQobnVtX3NlbGVjdGVkKSA+IHBhcnNlSW50KGludmVudG9yeSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbnVtX3NlbGVjdGVkID0gaW52ZW50b3J5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZWNfc3RyID0gcmVjX3N0ciArIGl0ZW1faWQgKyAnLCcgKyBudW1fc2VsZWN0ZWQgKyAnfCc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gW3Nhbml0eSwgb3JkZXJfc3RyLCByZWNfc3RyXTtcbiAgICB9XG5cblxuICAgICQoJyNwbGFjZW9yZGVyJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgkKCcjcGxhY2VvcmRlcicpLmhhc0NsYXNzKCdyZWMnKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3BsYWNlIG9yZGVyJyk7XG4gICAgICAgICAgICAkKCcub3JkZXJfYWRkJykuY2xpY2soKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBvcmRlciA9IHByb2Nlc3NPcmRlcigpO1xuICAgICAgICAgICAgdmFyIHNhbml0eSA9IG9yZGVyWzBdO1xuICAgICAgICAgICAgdmFyIG9yZGVyX3N0ciA9IG9yZGVyWzFdO1xuICAgICAgICAgICAgaWYgKHNhbml0eSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdPcmRlcnM6ICcgKyBvcmRlcl9zdHIpO1xuICAgICAgICAgICAgICAgIHZhciBuZXh0X2hyZWYgPSAnL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyLycgKyB3aW5kb3cuY3VzdG9tZXJfaWQgKyAnL2NvbmZpcm0tb3JkZXI/b3JkZXJzPScgKyBvcmRlcl9zdHI7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBuZXh0X2hyZWY7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoJyN0b2RlYWxlcicpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZygndG8gZGVhbGVyJyk7XG4gICAgICAgIC8vIFRPRE86IGRvbid0IGhhcmRjb2RlIGRlYWxlcjEsIGdvIHRvIHRoZSBkZWFsZXIgc2VsZWN0aW9uIHBhZ2VcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL3JlY29tbWVuZG9yZGVyL2RlYWxlci8xL2N1c3RvbWVyLycgKyB3aW5kb3cuY3VzdG9tZXJfaWQgKyAnL2FkZC1pdGVtJztcbiAgICB9KTtcblxuICAgIG5vZG91YmxldGFwem9vbSgpO1xufSk7XG4iXSwiZmlsZSI6InJlY29tbWVuZG9yZGVyL3JlY29tbWVuZG9yZGVyX29yZGVyLmpzIn0=
