$(function(){
    var href=window.location.href;
    var arr=href.split("/");
    var i = arr.indexOf("dealer");
    var dealerID = arr[i+1];
    var j = arr.indexOf("salesman");
    var salesmanID = arr[j+1];
    var search_results = $('#search').val();
    var new_href="/recommendorder/api/v1/dealer/"+dealerID+"/salesman/"+salesmanID+"/customer";
    function ajax(){
        $.ajax({
            url: new_href,
            type: 'get',
            dataType: 'json',
            success: function(res){
                $('.prev-order').children().remove();
                $('.after-order').children().remove();
                for(var i in res.data){
                    if (res.data[i].last_order === null) {
                        res.data[i].last_order="您还没有下过单";
                    }
                    if(res.data[i].ordered===false){
                        var list_yes = "<li class='item'><div class='left'><p class='customer-name'>"+res.data[i].customer_name+"</p><p><i></i><span class='time-tip'>"+'上次下单时间:'+"</span><span class='last-time'>"+res.data[i].last_order+"</span></p></div><span class='customerId'>"+res.data[i].id+"</span><span class='status'>"+'未下单'+"</span></li>";
                        $('.prev-order').append(list_yes);
                    }else if(res.data[i].ordered===true){
                        var list_no = "<li class='item'><div class='left'><p class='customer-name'>"+res.data[i].customer_name+"</p><p><i></i><span class='time-tip'>"+'上次下单时间:'+"</span><span class='last-time'>"+res.data[i].last_order+"</span></p></div><span class='customerId'>"+res.data[i].id+"</span><span class='status over'>"+'已下单'+"</span></li>";
                        $('.after-order').append(list_no);
                    }
                    if (res.data[i].customer_name===null){
                        $('.customer_name').html("暂无顾客名称");
                    }
                }
            }

        });
    }
    // ajax();

    $('#search').bind('input propertychange',function(){
        var search_results = $('#search').val();
        var length = search_results.length;
        if(length > 1) {
            $.ajax({
                url:new_href,
                type: 'get',
                dataType: 'json',
                data: {
                    "customer_name__contains":search_results
                },
                success: function(res){
                    $('.prev-order').children().remove();
                    $('.after-order').children().remove();
                    for(var i in res.data){
                        if (res.data[i].last_order===null) {
                            res.data[i].last_order="您还没有下过单";
                        }
                        //当值为false时候表示未下单
                        if(res.data[i].ordered===false){
                            var list_yes = "<li class='item'><div class='left'><p class='customer-name'>"+res.data[i].customer_name+"</p><p><i></i><span class='time-tip'>"+'上次下单时间:'+"</span><span class='last-time'>"+res.data[i].last_order+"</span></p></div><span class='customerId'>"+res.data[i].id+"</span><span class='status'>"+'未下单'+"</span></li>";
                            $('.prev-order').append(list_yes);
                        }else if(res.data[i].ordered===true){
                            var list_no = "<li class='item'><div class='left'><p class='customer-name'>"+res.data[i].customer_name+"</p><p><i></i><span class='time-tip'>"+'上次下单时间:'+"</span><span class='last-time'>"+res.data[i].last_order+"</span></p></div><span class='customerId'>"+res.data[i].id+"</span><span class='status over'>"+'已下单'+"</span></li>";
                            $('.after-order').append(list_no);
                        }
                        if (res.data[i].customer_name===null){
                            $('.customer_name').html("暂无顾客名称");
                        }
                    }
                }
            });
        }else if(length === 0){
            ajax();
        }

    });
    //点击删除按钮
    $('.no').click(function(){
        $('#search').val('');
        ajax();
    });
    //点击返回按钮
    $('.home-info-nav-a').click(function(){
        window.location.href='index';
    });
    $('.prev-order').on('click','.item',function(){
        var customerID = $(this).find('.customerId').html();

        var next_href="/recommendorder/customer/"+customerID+"/dealer-list";
        window.location.href=next_href;
    });
    $('.after-order').on('click','.item',function(){
        var customerID = $(this).find('.customerId').html();
        var next_href="/recommendorder/customer/"+customerID+"/dealer-list";
        window.location.href=next_href;
    });
});
