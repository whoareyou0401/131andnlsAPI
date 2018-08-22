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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9iYWdtYW5fY3VzdG9tZXJfc3RhdHVzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiQoZnVuY3Rpb24oKXtcbiAgICB2YXIgaHJlZj13aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICB2YXIgYXJyPWhyZWYuc3BsaXQoXCIvXCIpO1xuICAgIHZhciBpID0gYXJyLmluZGV4T2YoXCJkZWFsZXJcIik7XG4gICAgdmFyIGRlYWxlcklEID0gYXJyW2krMV07XG4gICAgdmFyIGogPSBhcnIuaW5kZXhPZihcInNhbGVzbWFuXCIpO1xuICAgIHZhciBzYWxlc21hbklEID0gYXJyW2orMV07XG4gICAgdmFyIHNlYXJjaF9yZXN1bHRzID0gJCgnI3NlYXJjaCcpLnZhbCgpO1xuICAgIHZhciBuZXdfaHJlZj1cIi9yZWNvbW1lbmRvcmRlci9hcGkvdjEvZGVhbGVyL1wiK2RlYWxlcklEK1wiL3NhbGVzbWFuL1wiK3NhbGVzbWFuSUQrXCIvY3VzdG9tZXJcIjtcbiAgICBmdW5jdGlvbiBhamF4KCl7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IG5ld19ocmVmLFxuICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICAgICAkKCcucHJldi1vcmRlcicpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgJCgnLmFmdGVyLW9yZGVyJykuY2hpbGRyZW4oKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgaW4gcmVzLmRhdGEpe1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmRhdGFbaV0ubGFzdF9vcmRlciA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLmRhdGFbaV0ubGFzdF9vcmRlcj1cIuaCqOi/mOayoeacieS4i+i/h+WNlVwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmKHJlcy5kYXRhW2ldLm9yZGVyZWQ9PT1mYWxzZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGlzdF95ZXMgPSBcIjxsaSBjbGFzcz0naXRlbSc+PGRpdiBjbGFzcz0nbGVmdCc+PHAgY2xhc3M9J2N1c3RvbWVyLW5hbWUnPlwiK3Jlcy5kYXRhW2ldLmN1c3RvbWVyX25hbWUrXCI8L3A+PHA+PGk+PC9pPjxzcGFuIGNsYXNzPSd0aW1lLXRpcCc+XCIrJ+S4iuasoeS4i+WNleaXtumXtDonK1wiPC9zcGFuPjxzcGFuIGNsYXNzPSdsYXN0LXRpbWUnPlwiK3Jlcy5kYXRhW2ldLmxhc3Rfb3JkZXIrXCI8L3NwYW4+PC9wPjwvZGl2PjxzcGFuIGNsYXNzPSdjdXN0b21lcklkJz5cIityZXMuZGF0YVtpXS5pZCtcIjwvc3Bhbj48c3BhbiBjbGFzcz0nc3RhdHVzJz5cIisn5pyq5LiL5Y2VJytcIjwvc3Bhbj48L2xpPlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnByZXYtb3JkZXInKS5hcHBlbmQobGlzdF95ZXMpO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZihyZXMuZGF0YVtpXS5vcmRlcmVkPT09dHJ1ZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGlzdF9ubyA9IFwiPGxpIGNsYXNzPSdpdGVtJz48ZGl2IGNsYXNzPSdsZWZ0Jz48cCBjbGFzcz0nY3VzdG9tZXItbmFtZSc+XCIrcmVzLmRhdGFbaV0uY3VzdG9tZXJfbmFtZStcIjwvcD48cD48aT48L2k+PHNwYW4gY2xhc3M9J3RpbWUtdGlwJz5cIisn5LiK5qyh5LiL5Y2V5pe26Ze0OicrXCI8L3NwYW4+PHNwYW4gY2xhc3M9J2xhc3QtdGltZSc+XCIrcmVzLmRhdGFbaV0ubGFzdF9vcmRlcitcIjwvc3Bhbj48L3A+PC9kaXY+PHNwYW4gY2xhc3M9J2N1c3RvbWVySWQnPlwiK3Jlcy5kYXRhW2ldLmlkK1wiPC9zcGFuPjxzcGFuIGNsYXNzPSdzdGF0dXMgb3Zlcic+XCIrJ+W3suS4i+WNlScrXCI8L3NwYW4+PC9saT5cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5hZnRlci1vcmRlcicpLmFwcGVuZChsaXN0X25vKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmRhdGFbaV0uY3VzdG9tZXJfbmFtZT09PW51bGwpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmN1c3RvbWVyX25hbWUnKS5odG1sKFwi5pqC5peg6aG+5a6i5ZCN56ewXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBhamF4KCk7XG5cbiAgICAkKCcjc2VhcmNoJykuYmluZCgnaW5wdXQgcHJvcGVydHljaGFuZ2UnLGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBzZWFyY2hfcmVzdWx0cyA9ICQoJyNzZWFyY2gnKS52YWwoKTtcbiAgICAgICAgdmFyIGxlbmd0aCA9IHNlYXJjaF9yZXN1bHRzLmxlbmd0aDtcbiAgICAgICAgaWYobGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6bmV3X2hyZWYsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiY3VzdG9tZXJfbmFtZV9fY29udGFpbnNcIjpzZWFyY2hfcmVzdWx0c1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnByZXYtb3JkZXInKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAkKCcuYWZ0ZXItb3JkZXInKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgaW4gcmVzLmRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5kYXRhW2ldLmxhc3Rfb3JkZXI9PT1udWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLmRhdGFbaV0ubGFzdF9vcmRlcj1cIuaCqOi/mOayoeacieS4i+i/h+WNlVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy/lvZPlgLzkuLpmYWxzZeaXtuWAmeihqOekuuacquS4i+WNlVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYocmVzLmRhdGFbaV0ub3JkZXJlZD09PWZhbHNlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGlzdF95ZXMgPSBcIjxsaSBjbGFzcz0naXRlbSc+PGRpdiBjbGFzcz0nbGVmdCc+PHAgY2xhc3M9J2N1c3RvbWVyLW5hbWUnPlwiK3Jlcy5kYXRhW2ldLmN1c3RvbWVyX25hbWUrXCI8L3A+PHA+PGk+PC9pPjxzcGFuIGNsYXNzPSd0aW1lLXRpcCc+XCIrJ+S4iuasoeS4i+WNleaXtumXtDonK1wiPC9zcGFuPjxzcGFuIGNsYXNzPSdsYXN0LXRpbWUnPlwiK3Jlcy5kYXRhW2ldLmxhc3Rfb3JkZXIrXCI8L3NwYW4+PC9wPjwvZGl2PjxzcGFuIGNsYXNzPSdjdXN0b21lcklkJz5cIityZXMuZGF0YVtpXS5pZCtcIjwvc3Bhbj48c3BhbiBjbGFzcz0nc3RhdHVzJz5cIisn5pyq5LiL5Y2VJytcIjwvc3Bhbj48L2xpPlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5wcmV2LW9yZGVyJykuYXBwZW5kKGxpc3RfeWVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKHJlcy5kYXRhW2ldLm9yZGVyZWQ9PT10cnVlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGlzdF9ubyA9IFwiPGxpIGNsYXNzPSdpdGVtJz48ZGl2IGNsYXNzPSdsZWZ0Jz48cCBjbGFzcz0nY3VzdG9tZXItbmFtZSc+XCIrcmVzLmRhdGFbaV0uY3VzdG9tZXJfbmFtZStcIjwvcD48cD48aT48L2k+PHNwYW4gY2xhc3M9J3RpbWUtdGlwJz5cIisn5LiK5qyh5LiL5Y2V5pe26Ze0OicrXCI8L3NwYW4+PHNwYW4gY2xhc3M9J2xhc3QtdGltZSc+XCIrcmVzLmRhdGFbaV0ubGFzdF9vcmRlcitcIjwvc3Bhbj48L3A+PC9kaXY+PHNwYW4gY2xhc3M9J2N1c3RvbWVySWQnPlwiK3Jlcy5kYXRhW2ldLmlkK1wiPC9zcGFuPjxzcGFuIGNsYXNzPSdzdGF0dXMgb3Zlcic+XCIrJ+W3suS4i+WNlScrXCI8L3NwYW4+PC9saT5cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcuYWZ0ZXItb3JkZXInKS5hcHBlbmQobGlzdF9ubyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmRhdGFbaV0uY3VzdG9tZXJfbmFtZT09PW51bGwpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5jdXN0b21lcl9uYW1lJykuaHRtbChcIuaaguaXoOmhvuWuouWQjeensFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9ZWxzZSBpZihsZW5ndGggPT09IDApe1xuICAgICAgICAgICAgYWpheCgpO1xuICAgICAgICB9XG5cbiAgICB9KTtcbiAgICAvL+eCueWHu+WIoOmZpOaMiemSrlxuICAgICQoJy5ubycpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJyNzZWFyY2gnKS52YWwoJycpO1xuICAgICAgICBhamF4KCk7XG4gICAgfSk7XG4gICAgLy/ngrnlh7vov5Tlm57mjInpkq5cbiAgICAkKCcuaG9tZS1pbmZvLW5hdi1hJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9J2luZGV4JztcbiAgICB9KTtcbiAgICAkKCcucHJldi1vcmRlcicpLm9uKCdjbGljaycsJy5pdGVtJyxmdW5jdGlvbigpe1xuICAgICAgICB2YXIgY3VzdG9tZXJJRCA9ICQodGhpcykuZmluZCgnLmN1c3RvbWVySWQnKS5odG1sKCk7XG5cbiAgICAgICAgdmFyIG5leHRfaHJlZj1cIi9yZWNvbW1lbmRvcmRlci9jdXN0b21lci9cIitjdXN0b21lcklEK1wiL2RlYWxlci1saXN0XCI7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmPW5leHRfaHJlZjtcbiAgICB9KTtcbiAgICAkKCcuYWZ0ZXItb3JkZXInKS5vbignY2xpY2snLCcuaXRlbScsZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGN1c3RvbWVySUQgPSAkKHRoaXMpLmZpbmQoJy5jdXN0b21lcklkJykuaHRtbCgpO1xuICAgICAgICB2YXIgbmV4dF9ocmVmPVwiL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiK2N1c3RvbWVySUQrXCIvZGVhbGVyLWxpc3RcIjtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9bmV4dF9ocmVmO1xuICAgIH0pO1xufSk7XG4iXSwiZmlsZSI6InJlY29tbWVuZG9yZGVyL2JhZ21hbl9jdXN0b21lcl9zdGF0dXMuanMifQ==
