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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9jdXN0b21lcl9zdGF0dXMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJChmdW5jdGlvbigpe1xuICAgIHZhciBocmVmPXdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIHZhciBhcnI9aHJlZi5zcGxpdChcIi9cIik7XG4gICAgdmFyIGkgPSBhcnIuaW5kZXhPZihcImRlYWxlclwiKTtcbiAgICB2YXIgZGVhbGVySUQgPSBhcnJbaSsxXTtcbiAgICB2YXIgaiA9IGFyci5pbmRleE9mKFwic2FsZXNtYW5cIik7XG4gICAgdmFyIHNhbGVzbWFuSUQgPSBhcnJbaisxXTtcbiAgICB2YXIgc2VhcmNoX3Jlc3VsdHMgPSAkKCcjc2VhcmNoJykudmFsKCk7XG4gICAgdmFyIG5ld19ocmVmPVwiL3JlY29tbWVuZG9yZGVyL2FwaS92MS9kZWFsZXIvXCIrZGVhbGVySUQrXCIvc2FsZXNtYW4vXCIrc2FsZXNtYW5JRCtcIi9jdXN0b21lclwiO1xuICAgIGZ1bmN0aW9uIGFqYXgoKXtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogbmV3X2hyZWYsXG4gICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgICAgICQoJy5wcmV2LW9yZGVyJykuY2hpbGRyZW4oKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAkKCcuYWZ0ZXItb3JkZXInKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaSBpbiByZXMuZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuZGF0YVtpXS5sYXN0X29yZGVyID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuZGF0YVtpXS5sYXN0X29yZGVyPVwi5oKo6L+Y5rKh5pyJ5LiL6L+H5Y2VXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYocmVzLmRhdGFbaV0ub3JkZXJlZD09PWZhbHNlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaXN0X3llcyA9IFwiPGxpIGNsYXNzPSdpdGVtJz48ZGl2IGNsYXNzPSdsZWZ0Jz48cCBjbGFzcz0nY3VzdG9tZXItbmFtZSc+XCIrcmVzLmRhdGFbaV0uY3VzdG9tZXJfbmFtZStcIjwvcD48cD48aT48L2k+PHNwYW4gY2xhc3M9J3RpbWUtdGlwJz5cIisn5LiK5qyh5LiL5Y2V5pe26Ze0OicrXCI8L3NwYW4+PHNwYW4gY2xhc3M9J2xhc3QtdGltZSc+XCIrcmVzLmRhdGFbaV0ubGFzdF9vcmRlcitcIjwvc3Bhbj48L3A+PC9kaXY+PHNwYW4gY2xhc3M9J2N1c3RvbWVySWQnPlwiK3Jlcy5kYXRhW2ldLmlkK1wiPC9zcGFuPjxzcGFuIGNsYXNzPSdzdGF0dXMnPlwiKyfmnKrkuIvljZUnK1wiPC9zcGFuPjwvbGk+XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcucHJldi1vcmRlcicpLmFwcGVuZChsaXN0X3llcyk7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKHJlcy5kYXRhW2ldLm9yZGVyZWQ9PT10cnVlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaXN0X25vID0gXCI8bGkgY2xhc3M9J2l0ZW0nPjxkaXYgY2xhc3M9J2xlZnQnPjxwIGNsYXNzPSdjdXN0b21lci1uYW1lJz5cIityZXMuZGF0YVtpXS5jdXN0b21lcl9uYW1lK1wiPC9wPjxwPjxpPjwvaT48c3BhbiBjbGFzcz0ndGltZS10aXAnPlwiKyfkuIrmrKHkuIvljZXml7bpl7Q6JytcIjwvc3Bhbj48c3BhbiBjbGFzcz0nbGFzdC10aW1lJz5cIityZXMuZGF0YVtpXS5sYXN0X29yZGVyK1wiPC9zcGFuPjwvcD48L2Rpdj48c3BhbiBjbGFzcz0nY3VzdG9tZXJJZCc+XCIrcmVzLmRhdGFbaV0uaWQrXCI8L3NwYW4+PHNwYW4gY2xhc3M9J3N0YXR1cyBvdmVyJz5cIisn5bey5LiL5Y2VJytcIjwvc3Bhbj48L2xpPlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmFmdGVyLW9yZGVyJykuYXBwZW5kKGxpc3Rfbm8pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuZGF0YVtpXS5jdXN0b21lcl9uYW1lPT09bnVsbCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuY3VzdG9tZXJfbmFtZScpLmh0bWwoXCLmmoLml6Dpob7lrqLlkI3np7BcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vIGFqYXgoKTtcblxuICAgICQoJyNzZWFyY2gnKS5iaW5kKCdpbnB1dCBwcm9wZXJ0eWNoYW5nZScsZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHNlYXJjaF9yZXN1bHRzID0gJCgnI3NlYXJjaCcpLnZhbCgpO1xuICAgICAgICB2YXIgbGVuZ3RoID0gc2VhcmNoX3Jlc3VsdHMubGVuZ3RoO1xuICAgICAgICBpZihsZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDpuZXdfaHJlZixcbiAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJjdXN0b21lcl9uYW1lX19jb250YWluc1wiOnNlYXJjaF9yZXN1bHRzXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgICAgICAgICAkKCcucHJldi1vcmRlcicpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5hZnRlci1vcmRlcicpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSBpbiByZXMuZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmRhdGFbaV0ubGFzdF9vcmRlcj09PW51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuZGF0YVtpXS5sYXN0X29yZGVyPVwi5oKo6L+Y5rKh5pyJ5LiL6L+H5Y2VXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WAvOS4umZhbHNl5pe25YCZ6KGo56S65pyq5LiL5Y2VXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihyZXMuZGF0YVtpXS5vcmRlcmVkPT09ZmFsc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaXN0X3llcyA9IFwiPGxpIGNsYXNzPSdpdGVtJz48ZGl2IGNsYXNzPSdsZWZ0Jz48cCBjbGFzcz0nY3VzdG9tZXItbmFtZSc+XCIrcmVzLmRhdGFbaV0uY3VzdG9tZXJfbmFtZStcIjwvcD48cD48aT48L2k+PHNwYW4gY2xhc3M9J3RpbWUtdGlwJz5cIisn5LiK5qyh5LiL5Y2V5pe26Ze0OicrXCI8L3NwYW4+PHNwYW4gY2xhc3M9J2xhc3QtdGltZSc+XCIrcmVzLmRhdGFbaV0ubGFzdF9vcmRlcitcIjwvc3Bhbj48L3A+PC9kaXY+PHNwYW4gY2xhc3M9J2N1c3RvbWVySWQnPlwiK3Jlcy5kYXRhW2ldLmlkK1wiPC9zcGFuPjxzcGFuIGNsYXNzPSdzdGF0dXMnPlwiKyfmnKrkuIvljZUnK1wiPC9zcGFuPjwvbGk+XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnByZXYtb3JkZXInKS5hcHBlbmQobGlzdF95ZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYocmVzLmRhdGFbaV0ub3JkZXJlZD09PXRydWUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaXN0X25vID0gXCI8bGkgY2xhc3M9J2l0ZW0nPjxkaXYgY2xhc3M9J2xlZnQnPjxwIGNsYXNzPSdjdXN0b21lci1uYW1lJz5cIityZXMuZGF0YVtpXS5jdXN0b21lcl9uYW1lK1wiPC9wPjxwPjxpPjwvaT48c3BhbiBjbGFzcz0ndGltZS10aXAnPlwiKyfkuIrmrKHkuIvljZXml7bpl7Q6JytcIjwvc3Bhbj48c3BhbiBjbGFzcz0nbGFzdC10aW1lJz5cIityZXMuZGF0YVtpXS5sYXN0X29yZGVyK1wiPC9zcGFuPjwvcD48L2Rpdj48c3BhbiBjbGFzcz0nY3VzdG9tZXJJZCc+XCIrcmVzLmRhdGFbaV0uaWQrXCI8L3NwYW4+PHNwYW4gY2xhc3M9J3N0YXR1cyBvdmVyJz5cIisn5bey5LiL5Y2VJytcIjwvc3Bhbj48L2xpPlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5hZnRlci1vcmRlcicpLmFwcGVuZChsaXN0X25vKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXMuZGF0YVtpXS5jdXN0b21lcl9uYW1lPT09bnVsbCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmN1c3RvbWVyX25hbWUnKS5odG1sKFwi5pqC5peg6aG+5a6i5ZCN56ewXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1lbHNlIGlmKGxlbmd0aCA9PT0gMCl7XG4gICAgICAgICAgICBhamF4KCk7XG4gICAgICAgIH1cblxuICAgIH0pO1xuICAgIC8v54K55Ye75Yig6Zmk5oyJ6ZKuXG4gICAgJCgnLm5vJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnI3NlYXJjaCcpLnZhbCgnJyk7XG4gICAgICAgIGFqYXgoKTtcbiAgICB9KTtcbiAgICAvL+eCueWHu+i/lOWbnuaMiemSrlxuICAgICQoJy5ob21lLWluZm8tbmF2LWEnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZj0naW5kZXgnO1xuICAgIH0pO1xuICAgICQoJy5wcmV2LW9yZGVyJykub24oJ2NsaWNrJywnLml0ZW0nLGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBjdXN0b21lcklEID0gJCh0aGlzKS5maW5kKCcuY3VzdG9tZXJJZCcpLmh0bWwoKTtcblxuICAgICAgICB2YXIgbmV4dF9ocmVmPVwiL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiK2N1c3RvbWVySUQrXCIvZGVhbGVyLWxpc3RcIjtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9bmV4dF9ocmVmO1xuICAgIH0pO1xuICAgICQoJy5hZnRlci1vcmRlcicpLm9uKCdjbGljaycsJy5pdGVtJyxmdW5jdGlvbigpe1xuICAgICAgICB2YXIgY3VzdG9tZXJJRCA9ICQodGhpcykuZmluZCgnLmN1c3RvbWVySWQnKS5odG1sKCk7XG4gICAgICAgIHZhciBuZXh0X2hyZWY9XCIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIrY3VzdG9tZXJJRCtcIi9kZWFsZXItbGlzdFwiO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZj1uZXh0X2hyZWY7XG4gICAgfSk7XG59KTtcbiJdLCJmaWxlIjoicmVjb21tZW5kb3JkZXIvY3VzdG9tZXJfc3RhdHVzLmpzIn0=
