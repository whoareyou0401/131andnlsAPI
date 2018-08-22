(function(cmApp) {
    "use strict";
    var url = window.location.href;
    var dealer_id = Number(url.match(/(dealer\/)\d+\//)[0].split('/')[1]);
    setupCSRF();
    
    // 订单管理
    var endDate = new Date();
    var startDate = new Date();
    var endT = endDate.getTime();
    var startT = endDate.getTime()-6*24*60*60*1000;
    endDate.setTime(endT);
    startDate.setTime(startT);
    $('#datepicker').val(startDate.getMonth() + 1 + '/' + startDate.getDate() + '/' + startDate.getFullYear());
    $('#datepickerEnd').val(endDate.getMonth() + 1 + '/' + endDate.getDate() + '/' + endDate.getFullYear());
    var orderSalData;
    var orderSalPages = 1;
    var orderSalCurrentPage = 1;
    var orderStatus='';
    var orderStartTime='';
    var orderEndTime='';
    var searchOrderKey='';
    var orderSalId='';
    var orderData = {};
    var searchResults = '';
    function timeFilters(time){
        var timeArr = time.split('/');
        var time1 = timeArr[2] + '-' + timeArr[0] + '-' + timeArr[1];
        return time1;
    }
    function orderDataFun(orderSalId,orderStatus,orderSalCurrentPage){
        if($('#search').val().length >= 1){
            searchResults = $('#search').val();
        }else{
            searchResults = '';
        }
        if($('#datepicker').val()!== '' && $('#datepickerEnd').val() !== ''){
            orderStartTime = timeFilters($('#datepicker').val());
            orderEndTime = timeFilters($('#datepickerEnd').val());
            orderData = {
                perpage:20,
                page:orderSalCurrentPage,
                salesman:orderSalId,
                status:orderStatus,
                start:orderStartTime,
                end:orderEndTime,
                key:searchResults
            }
        }else{
            orderData = {
                perpage:20,
                page:orderSalCurrentPage,
                salesman:orderSalId,
                status:orderStatus,
                key:searchResults
            }
        }
    }
    $.ajax({
        url:'/api/v1.2/recommendorder/dealer/' + dealer_id + '/salesmen',
        type:'get',
        dataType:'json',
        success:function(data){
            var sal_items = data.salesmen;
            for(var sal_item in sal_items){
                var sal_option = "<option value=" + sal_items[sal_item].id + ">" + sal_items[sal_item].name + "</option>";
                $('#selectSal').append(sal_option);
            }
        }
    });
    $.ajax({
        url:'/api/v1.2/recommendorder/dealer/' + dealer_id + '/suborders',
        type:'get',
        dataType:'json',
        data:{
            perpage:20,
            page:orderSalCurrentPage,
            salesman:orderSalId,
            status:orderStatus,
            key:searchResults
        },
        success:function(data){
            orderSalPages = data.pages;
            order_sal_pagi(orderSalPages);
            orderSalTable(orderData);
            orderSalChangeStatusFun();
            detailClick();
        }
    });
    $('#selectSal').on('change',function(){
        $('#table').empty();
        $('.order-sal-pagi').empty();
        orderSalId = $('#selectSal').val();
        orderStatus = $('#select').val();
        orderSalCurrentPage = 1;
        orderDataFun(orderSalId,orderStatus,orderSalCurrentPage);
        $.ajax({
            url:'/api/v1.2/recommendorder/dealer/' + dealer_id + '/suborders',
            type:'get',
            dataType:'json',
            data:orderData,
            success:function(data){
                orderSalPages = data.pages;
                order_sal_pagi(orderSalPages);
                orderSalTable(orderData);
                orderSalChangeStatusFun();
                detailClick();
            }
        });
    });
    $('#select').on('change',function(){
        $('#table').empty();
        $('.order-sal-pagi').empty();
        orderSalId = $('#selectSal').val();
        orderStatus = $('#select').val();
        orderSalCurrentPage = 1;
        orderDataFun(orderSalId,orderStatus,orderSalCurrentPage);
        $.ajax({
            url:'/api/v1.2/recommendorder/dealer/' + dealer_id + '/suborders',
            type:'get',
            dataType:'json',
            data:orderData,
            success:function(data){
                orderSalPages = data.pages;
                order_sal_pagi(orderSalPages);
                orderSalTable(orderData);
                orderSalChangeStatusFun();
                detailClick();
            }
        });
    });
    $('#datepicker,#datepickerEnd').on('change',function(){
        $('#table').empty();
        $('.order-sal-pagi').empty();
        orderSalId = $('#selectSal').val();
        orderStatus = $('#select').val();
        orderSalCurrentPage = 1;
        orderDataFun(orderSalId,orderStatus,orderSalCurrentPage);
        $.ajax({
            url:'/api/v1.2/recommendorder/dealer/' + dealer_id + '/suborders',
            type:'get',
            dataType:'json',
            data:orderData,
            success:function(data){
                orderSalPages = data.pages;
                order_sal_pagi(orderSalPages);
                orderSalTable(orderData);
                orderSalChangeStatusFun();
                detailClick();
            }
        });
    });
    $('#search').bind('input propertychange',function(){
        var search_results = $('#search').val();
        var length = search_results.length;
        orderSalCurrentPage = 1;
        orderDataFun(orderSalId,orderStatus,orderSalCurrentPage);
        $.ajax({
            url:'/api/v1.2/recommendorder/dealer/' + dealer_id + '/suborders',
            type:'get',
            dataType:'json',
            data:orderData,
            success:function(data){
                orderSalPages = data.pages;
                order_sal_pagi(orderSalPages);
                orderSalTable(orderData);
                orderSalChangeStatusFun();
                detailClick();
            }
        });
    });
        //详情的点击事件
    function detailClick(){
        $('#table').off('click').on('click','tr #detail',function(){
            var suborderId = $(this).find('.suborderId').html();
            var customerName = $(this).parent().find('.customerName').html();
            var customerPhone =$(this).parent().find('.phone').html();
            $('.model').css({
                'display':'block'
            });
            $('#no').off('click').click(function(){
                $('.model').css({
                    'display':'none'
                });

            });
            $('.customer').children().remove();
            var customer = "<div class='four wide column' style='background:#fff;'><b>客户名称: "+customerName+"</b></div><div class='four wide column' style='background:#fff;'><b>电话: "+customerPhone+"</b></div>";
            $('.customer').append(customer);
                $.ajax({
                    url: "/api/v1.1/recommendorder/dealer/"+dealer_id+"/suborder/"+suborderId+"/",
                    type: 'get',
                    datatype: 'json',
                    success:function(res){
                        if(res.data.status === 1){
                            $('#button').show();
                        }else{
                            $('#button').hide();
                        }
                        createContent(res.data.orderitem_set);
                        handleClick(res);
                        closeClick(res);
                        //进入详情页面点击导出时触发的事件
                        $('#detailExport').off('click').on('click',function(){
                            if($.inArray(dealer_id, [5, 10, 11, 12]) != -1){
                                window.location.href = "/api/v1.2/recommendorder/dealer/"+dealer_id+"/suborder/"+suborderId+"?filesave=1";

                            } else
                                window.location.href = "/api/v1.1/recommendorder/dealer/"+dealer_id+"/suborder/"+suborderId+"/?filesave=1";
                        });
                    }
                });
        });
    }
        //动态创建弹框出来的内容
        function createContent(data){
            $('#newTr').children().remove();
            for(var i in data){
                var newTr="<tr><td>"+data[i].item_name+"</td><td>"+data[i].original_unit_price+"</td><td food_id="+i+">"+data[i].unit_price+"</td><td>"+data[i].num+"</td><tr>";
                $('#newTr').append(newTr);
                if(data[i].original_unit_price !== data[i].unit_price){
                    $("td[food_id='" + i + "']").css('color','#ff4a0c');
                }
            }
        }
        //点击处理按钮触发的是事件

        function handleClick(res){
            $('#handle').off('click').on('click',function(){
                $('#handle').attr('disabled', true);
                $.ajax({
                    url:"/api/v1.2/recommendorder/dealer/"+dealer_id+"/suborder/"+res.data.id,
                    type: 'patch',
                    datatype: 'json',
                    data:{
                        "status":2
                    },
                    success:function(res){
                        alert('订单处理成功');
                        $('#handle').removeAttr("disabled");
                        $('.model').hide();
                        orderSalTable(orderData);
                    },
                    error:function(res){
                        alert('订单处理失败');
                        $('#handle').removeAttr("disabled");
                        $('.model').hide();
                        orderSalTable(orderData);
                    }
                });
                 
            });
        }
        //点击关闭按钮时候触发的
        function closeClick(res){
            $('#close').off('click').click(function(){
                $.ajax({
                    url:"/api/v1.1/recommendorder/dealer/"+dealer_id+"/suborder/"+res.data.id+"/",
                    type: 'patch',
                    datatype: 'json',
                    data:{
                        "status":3
                    },
                    success:function(res){
                        alert('订单关闭成功');
                        $('.model').hide();
                        orderSalTable(orderData);
                    }
                });
                
            });
        }
    function order_sal_pagi(data){
        var prePage = "<a href='javascript:' class='item pre-page' sign='pre-page' id='orderSal-pre-page'>上一页</a>";
        var nextPage = "<a href='javascript:' class='item next-page' sign='next-page' id='orderSal-next-page'>下一页</a>";
        var singlePage = "";
        for (var k = 1; k <= data; k++) {
            if (k <= 6) {
                singlePage += "<a href='javascript:' class='item pagi' sign='pagi'>"+ k +"</a>";
            }
        }
        var allPage = prePage + singlePage + nextPage;
        $('.order-sal-pagi').empty();
        $('.order-sal-pagi').append(allPage);
        $('.order-sal-pagi .pagi:first').addClass('active');
    }
    function orderSalTable(orderData){
        $('#table').empty();
        $.ajax({
            url:'/api/v1.2/recommendorder/dealer/' + dealer_id + '/suborders',
            type:'get',
            dataType:'json',
            data:orderData,
            success:function(data){
                var orderSalItems = data.suborders;
                for(var orderSalItem in orderSalItems){
                    if(orderSalItems[orderSalItem].customer_address === null){
                        orderSalItems[orderSalItem].customer_address = '';
                    }
                    if(orderSalItems[orderSalItem].postscript === null){
                        orderSalItems[orderSalItem].postscript = '';
                    }
                    if(orderSalItems[orderSalItem].salesman === null){
                        orderSalItems[orderSalItem].salesman = '';
                    }
                    var subOrderSalTr = "<tr><td>"+orderSalItems[orderSalItem].suborder_id + "</td><td><span class='customerName'>"+orderSalItems[orderSalItem].customer +
                    "</span><i class='phone'>"+orderSalItems[orderSalItem].phone + "</i></td><td>"+orderSalItems[orderSalItem].salesman + "</td><td>"+orderSalItems[orderSalItem].order_time+"</td><td>"+orderSalItems[orderSalItem].customer_address+
                    "</td><td>"+orderSalItems[orderSalItem].postscript+"</td><td>"+orderSalItems[orderSalItem].status + 
                    "</td><td id='detail'><a>"+'详情'+"</a><i class='suborderId' style='color:#fff;'>"+orderSalItems[orderSalItem].suborder_id+"</i></td></tr>";
                    $('#table').append(subOrderSalTr);
                }        
            }
        });
    }
    function orderSalChangeStatusFun() {        
        // 每一页
        $('.order-sal-pagi').off('click').on('click','.pagi',function(){
            orderSalCurrentPage = $(this).html();
            orderSalId = $('#selectSal').val();
            orderStatus = $('#select').val();
            orderDataFun(orderSalId,orderStatus,orderSalCurrentPage);
            orderSalTable(orderData);
            orderSalCurrentPageStatus();
        });

        // 左右翻页
        $('.order-sal-pagi #orderSal-pre-page').click(function(){
            orderSalCurrentPage = orderSalCurrentPage - 1;
            if (orderSalCurrentPage <= 0) {
                orderSalCurrentPage = 1;
            }
            orderSalId = $('#selectSal').val();
            orderStatus = $('#select').val();
            orderDataFun(orderSalId,orderStatus,orderSalCurrentPage);
            orderSalTable(orderData);
            orderSalCurrentPageStatus();

        });
        $('.order-sal-pagi #orderSal-next-page').click(function(){
            orderSalCurrentPage = orderSalCurrentPage -0 + 1;
            if (orderSalCurrentPage >= orderSalPages) {
                orderSalCurrentPage = orderSalPages;
            }
            orderSalId = $('#selectSal').val();
            orderStatus = $('#select').val();
            orderDataFun(orderSalId,orderStatus,orderSalCurrentPage);
            orderSalTable(orderData);
            orderSalCurrentPageStatus();

        });
    }

    function orderSalCurrentPageStatus() {
        $('.order-sal-pagi .pagi').each(function(){
            if ($(this).html() == orderSalCurrentPage) {
                $(this).addClass('active').siblings().removeClass('active');
            }
            if (orderSalCurrentPage >= 4 && orderSalPages > 6) {
                if (orderSalCurrentPage >= orderSalPages - 2) {
                    $('.order-sal-pagi .pagi').each(function(pagi_index,pagi_ele) {
                        var nowPage = orderSalPages - 5 + pagi_index;
                        $(pagi_ele).html(nowPage);
                    });
                }else{
                    $('.order-sal-pagi .pagi').each(function(pagi_index,pagi_ele) {
                        var nowPageOther = orderSalCurrentPage - 3 + pagi_index;
                        $(pagi_ele).html(nowPageOther);
                    });
                }

            }else if(orderSalCurrentPage < 4 && orderSalPages > 6){
                $('.order-sal-pagi .pagi').each(function(pagi_index,pagi_ele) {
                    var nowPagepre = 1 - 0 + pagi_index;
                    $(pagi_ele).html(nowPagepre);
                });
            }
        });

    }

    function wss(data){
        var ws;
        var tmpTag = 'https:' == document.location.protocol ? true : false;
        if(tmpTag){
            ws = new WebSocket("wss://" + window.location.host + "/message");
        }else{
            ws = new WebSocket("ws://" + window.location.host + "/message");
        }        
        ws.onopen = function() {
            ws.send(JSON.stringify({"session_id": data.session_id}));
        };
        ws.onmessage = function (evt) {
            try {
                if(JSON.parse(evt.data).type == 'new order'){
                    var audio = new Audio("//tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=6&text=您有新的订单，请及时处理");
                    audio.play();
                    orderSalTable(orderData);
                } else if(JSON.parse(evt.data).type == 'apply-dealer'){
                    var audio = new Audio("//tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=6&text=您有新的网购开通申请，请及时处理");
                    audio.play();
                    orderSalTable(orderData);
                }
            } catch (e) {
                return false;
            }
        };
        ws.onclose = function(){
            setTimeout(function(){
                wss(data);
            },2000);
        };
    }
    $.ajax({
        url: "/api/v1.1/recommendorder/session-id",
        type: 'get',
        success: function(data){
            wss(data);
        }
    });

    //点击退出系统触发的事件
    $('#exit').off('click').on('click',function(){
        window.location.href="/login";
    });
    //点击订单管理的时候触发事件
    $('#manage').off('click').on('click',function(){
        $('.management_con').hide();
        $('#contentq').css({
            'display':'block'
        });
    });
    //当点击经销商信息的时候触发的事件
    $('#delear_manage').off('click').on('click',function(){
        $('.management_con').hide();
        $('.delear_manage').css({
            'display':'block'
        });
        function dealerManagement(){
            $.ajax({
                url:"/api/v1.2/recommendorder/dealer/"+dealer_id,
                type:'get',
                dataType:'json',
                success:function(data){
                    if(data.order_able===true){
                        $('#select input').prop('checked','checked');
                    }
                    if(data.price_adjust===true){
                        $('#change-price').checkbox('set checked');
                    }else{
                        $('#change-price').checkbox('set unchecked');
                    }
                    $('#time-from').val(data.bus_hr_from);
                    $('#time-to').val(data.bus_hr_to);
                    $('#initial-price').val(data.initial_price);
                }

            });
        }
        dealerManagement();
        $('#submit').off('click').on('click',function(){
            $.ajax({
                url:"/api/v1.2/recommendorder/dealer/"+dealer_id,
                type:'patch',
                dataType:'json',
                data:{
                    "bus_hr_to": $('#time-to').val(),
                    "bus_hr_from": $('#time-from').val(),
                    "initial_price": $('#initial-price').val(),
                    "order_able":$('#select input').prop('checked'),
                    "price_adjust":$('#change-price').checkbox('is checked')
                },
                success:function(data){
                    dealerManagement();
                }
            });
        });
    });
    //点击客户管理中的权限管理触发的事件
    $('.privilege_management').off('click').on('click',function(){
        window.location.href="/recommendorder/dealer/assign-uac";
    });
    // 总页数
    var cus_pages = 0;
    var sal_pages = 0;
    // 当前页数
    var cus_current_page = 1;
    var sal_current_page = 1;
    //客户ID
    var customer_id;
    var cusSearch_results = '';
    var invite_account_arr = [];
    //业务员ID
    var salesman_id;
    //需要删除的客户ID数组
    var delete_customer_arr = [];
    //需要删除的业务员ID数组
    var delete_salesman_arr = [];
    // 是否开通网购变量
    var customer_tr = '';
    var customer_other = '';
    var invite_ok = '';
    var invite_no = '';
    var invite_finish = '';
    var salesman_tr = '';
    // 正则
    var number_reg = new RegExp(/^(\+86|)1[0-9]{10}$/);
    // 点击客户管理出现右边内容
    $.ajax({
        url:'/api/v1.2/recommendorder/dealer/' + dealer_id + '/customers',
        type:'get',
        dataType:'json',
        data:{
            sourcetype:2,
            per_page:20,
            page:cus_current_page,
            keyword:cusSearch_results
        },
        success:function(data){
            cus_pages = data.pages;
            cusPagiFun(cus_pages);
            loadCustomers(cus_current_page);
            changeStatusFun();
            isInvite();
            customer_change();
        }
    });
    $.ajax({
        url:'/api/v1.2/recommendorder/dealer/' + dealer_id + '/salesmen',
        type:'get',
        dataType:'json',
        success:function(data){
            var sal_items = data.salesmen;
            for(var sal_item in sal_items){
                var sal_option = "<option value=" + sal_items[sal_item].id + ">" + sal_items[sal_item].name + "</option>";
                $('.sal-select').append(sal_option);
            }
        }
    });
    //客户管理搜索
    $('#customer-search').bind('keydown',function(){
        var x = event.which || event.keyCode
        //监听删除键如果input为空发送请求
        if (x==8) {
        if ($('#customer-search').val().length==1) {
            cusSearch_results = '';
            $.ajax({
                url:'/api/v1.2/recommendorder/dealer/' + dealer_id + '/customers',
                type:'get',
                dataType:'json',
                data:{
                    sourcetype:2,
                    per_page:20,
                    page:1,
                    keyword:cusSearch_results
                },
                success:function(data){
                    cus_pages = data.pages;
                    cusPagiFun(cus_pages);
                    loadCustomers(1)
                    changeStatusFun();
                    isInvite();
                    customer_change();
                    
                }
            });
        }
        

        }
        // 按回车键搜索
        if (x==13) {
            $('#cus-tbody').empty(); 
        if($('#customer-search').val().length >=1){
            cusSearch_results = $('#customer-search').val();
        }else{
            cusSearch_results = '';
        }
        $.ajax({
            url:'/api/v1.2/recommendorder/dealer/' + dealer_id + '/customers',
            type:'get',
            dataType:'json',
            data:{
                sourcetype:2,
                per_page:20,
                page:1,
                keyword:cusSearch_results
            },
            success:function(data){
                cus_pages = data.pages;
                cusPagiFun(cus_pages);
                loadCustomers(1)
                changeStatusFun();
                isInvite();
                customer_change();
                
            }
        });
        }
    });
    $('.customer_management_con .circular').bind('click',function(){
        $('#cus-tbody').empty(); 
        if($('#customer-search').val().length >=1){
            cusSearch_results = $('#customer-search').val();
        }else{
            cusSearch_results = '';
        }       
        $.ajax({
            url:'/api/v1.2/recommendorder/dealer/' + dealer_id + '/customers',
            type:'get',
            dataType:'json',
            data:{
                sourcetype:2,
                per_page:20,
                page:1,
                keyword:cusSearch_results
            },
            success:function(data){
                cus_pages = data.pages;
                cusPagiFun(cus_pages);
                loadCustomers(1)
                changeStatusFun();
                isInvite();
                customer_change();
                
            }
        });
    })
    $('.customer_management').off('click').on('click',function() {
        $('.management_con').css('display','none');
        $('.customer_management_con').show();
    });
    $('.account-management').off('click').on('click',function() {
        $('.management_con').css('display','none');
        $('.customer_management_con').show();
    });
    function cusPagiFun(data){
        var prePage = "<a href='javascript:' class='item pre-page' sign='pre-page' id='cus_pre_page'>上一页</a>";
        var nextPage = "<a href='javascript:' class='item next-page' sign='next-page' id='cus_next_page'>下一页</a>";
        var singlePage = "";
        for (var k = 1; k <= data; k++) {
            if (k <= 6) {
                singlePage += "<a href='javascript:' class='item pagi' sign='pagi'>"+ k +"</a>";
            }
        }
        var allPage = prePage + singlePage + nextPage;
        $('.cus_pagination').empty();
        $('.cus_pagination').append(allPage);
        $('.cus_pagination .pagi:first').addClass('active');
    }
    function changeStatusFun() {
        // 每一页
        $('.cus_pagination').off('click').on('click','.pagi',function(){
            cus_current_page = $(this).html();
            loadCustomers(cus_current_page);
            currentPageStatus();
        });

        // 左右翻页
        $('.cus_pagination .pre-page').off('click').on('click',function(){
            cus_current_page = cus_current_page - 1;
            if (cus_current_page <= 0) {
                cus_current_page = 1;
            }
            loadCustomers(cus_current_page);
            currentPageStatus();

        });
        $('.cus_pagination .next-page').off('click').on('click',function(){
            cus_current_page = cus_current_page -0 + 1;
            if (cus_current_page >= cus_pages) {
                cus_current_page = cus_pages;
            }
            loadCustomers(cus_current_page);
            currentPageStatus();

        });
    }

    function currentPageStatus() {
        $('.cus_pagination .pagi').each(function(){
            if ($(this).html() == cus_current_page) {
                $(this).addClass('active').siblings().removeClass('active');
            }
            if (cus_current_page >= 4 && cus_pages > 6) {
                if (cus_current_page >= cus_pages - 2) {
                    $('.cus_pagination .pagi').each(function(pagi_index,pagi_ele) {
                        var nowPage = cus_pages - 5 + pagi_index;
                        $(pagi_ele).html(nowPage);
                    });
                }else{
                    $('.cus_pagination .pagi').each(function(pagi_index,pagi_ele) {
                        var nowPageOther = cus_current_page - 3 + pagi_index;
                        $(pagi_ele).html(nowPageOther);
                    });
                }
            }else if(cus_current_page < 4 && cus_pages > 6){
                $('.cus_pagination .pagi').each(function(pagi_index,pagi_ele) {
                    var nowPagepre = 1 - 0 + pagi_index;
                    $(pagi_ele).html(nowPagepre);
                });
            }
        });
    }
    // 请求客户数据
    function loadCustomers(cus_current_page) {
        $(".checkboxAll").checkbox('set unchecked');
        if($('#customer-search').val().length >=1){
            cusSearch_results = $('#customer-search').val();
        }else{
            cusSearch_results = '';
        } 
        $.ajax({
            url:'/api/v1.2/recommendorder/dealer/' + dealer_id + '/customers',
            type:'get',
            dataType:'json',
            data:{
                sourcetype:2,
                per_page:20,
                page:cus_current_page,
                keyword:cusSearch_results
            },
            success:function(data){
                $('.customer_management_con').find('tbody').children().remove();
                for(var n in data.customers){
                    if(data.customers[n].customer_address === null){
                        data.customers[n].customer_address = '';
                    }
                    if(data.customers[n].customer_phone === null){
                        data.customers[n].customer_phone = '';
                    }
                    if(data.customers[n].contact === null){
                        data.customers[n].contact = '';
                    }
                    if(data.customers[n].account === null){
                        data.customers[n].account = '';
                    }
                    if(data.customers[n].salesman_name === null){
                        data.customers[n].salesman_name = '';
                    }
                    customer_other="<tr class='ui center aligned'  customer_id=" + data.customers[n].customer_id +"><td><div class='ui checkbox checkboxChild' customer_id=" + data.customers[n].customer_id +"><input type='checkbox'>" +
                    "<label></label></div></td><td class='cus_name'>" + data.customers[n].customer_name +"</td><td class='cus_address'>" + data.customers[n].customer_address + "</td>" +
                    "<td class='cus_people'>" + data.customers[n].contact + "</td><td class='cus_tel'>" + data.customers[n].customer_phone + "</td>" +
                    "<td class='cus_account'>" + data.customers[n].account + "</td>" + "<td class='cus_sal'>" + data.customers[n].salesman_name + "</td>" +
                    "<td><a class='change' customer_id=" + data.customers[n].customer_id +">修改</a></td>";

                    invite_finish = "<td><button class='invition invitionFinish' customer_id=" + data.customers[n].customer_id +">已邀请</button></td></tr>";
                    invite_no = "<td><button class='invition invitionNo' customer_id=" + data.customers[n].customer_id +">未邀请</button></td></tr>";
                    invite_ok = "<td><button class='invition invitionOk' customer_id=" + data.customers[n].customer_id +">邀请成功</button></td></tr>";

                    if(data.customers[n].invitationstatus === 1) {
                        customer_tr =  customer_other + invite_finish;
                    }else if(data.customers[n].invitationstatus === 0 || data.customers[n].invitationstatus === null){
                        customer_tr =  customer_other + invite_no;
                    }else if(data.customers[n].invitationstatus === 2){                    
                        customer_tr =  customer_other + invite_ok;
                    }
                    $('.customer_management_con').find('tbody').append(customer_tr);
                    if(data.customers[n].invitationstatus === 2){
                        $("tr[customer_id='" + data.customers[n].customer_id + "']").addClass('invitionOkTr');
                        $(".invitionOk[customer_id='" + data.customers[n].customer_id + "']").removeClass('invition'); 
                        $(".checkbox[customer_id='" + data.customers[n].customer_id + "']").find('input').attr('disabled','disabled');
                        $(".checkbox[customer_id='" + data.customers[n].customer_id + "']").removeClass('checkboxChild'); 
                        $(".checkbox[customer_id='" + data.customers[n].customer_id + "']").checkbox('set disabled');                            
                    }
                }
                customer_change();
                isInvite();
            }
        });
    }
    // 客户管理中是否邀请
    function isInvite() {
        $('.customer_management_con').off('click').on('click','.invition',function() {
            customer_id = $(this).attr('customer_id');
            $('.invite_model').show();
            $('.invite_model .cancel').off('click').on('click',function() {
                $('.invite_model').hide();
            });
            $('.invite_model .sure').off('click').on('click',function() {
                $('.invite_model').hide();
                $.ajax({
                    url:'/api/v1.1/recommendorder/dealer/' + dealer_id + '/customer/' + customer_id,
                    type:'patch',
                    dataType:'json',
                    data:{
                        cid:customer_id,
                        invitationstatus:1
                    },
                    success:function(data){
                        if(data.code === 0) {
                            alert('已邀请成功！');
                            loadCustomers(cus_current_page);
                        }else if(data.code === 1){
                            if(data.error === 'failed_validations'){
                                alert('邀请失败。请在erp内完善所选账户的“客户名称”,“联系方式”。');
                            }
                            if(data.error === 'failed_exclusion'){
                                alert('邀请失败。该账户已存在，请在erp内更换该账户的手机号。');
                            }                            
                        }
                    }
                });
            });
        });
    }

    // 客户管理中的修改
    function customer_change(){
        $('.customer_management_con .change').off('click').on('click',function(){
            customer_id = $(this).attr('customer_id');
            $('.change_customer_model').show();
            $('.change_customer_model .opt_cancel').off('click').on('click',function() {
                $('.change_customer_model').hide();

            });
            $('.change_customer_model .opt_sure').off('click').on('click',function() {              
                $('.change_customer_model').hide();
                $.ajax({
                    url:'/api/v1.1/recommendorder/dealer/' + dealer_id + '/customer/' + customer_id,
                    type:'post',
                    dataType:'json',
                    data:{
                        cid:customer_id,
                        salesman_id:$('.change_customer_model').find('.sal-select').val()
                    },
                    success:function(data){
                        alert('客户信息修改成功！');
                        loadCustomers(cus_current_page);
                    }
                });
            });
        });
    }
    //全选和全不选
     $('.customer_management_con .checkboxAll.checkbox')
    .checkbox({
        onChecked: function() {
          $('.checkboxChild').checkbox('check');
        },
        onUnchecked: function() {
          $('.checkboxChild').checkbox('uncheck');
        }
    });
    $('.customer_management_con').off('change').on('change','.checkboxChild',function() { 
        var childArr = $(".checkboxChild").checkbox('is checked');
        var childCheckedNum = 0;
        for(var j in childArr){
            if(childArr[j] === true){
                childCheckedNum += 1;
            }
        }
        if($('.checkboxChild').length == childCheckedNum) {
            $(".checkboxAll").checkbox('set checked');
        }else{
            $(".checkboxAll").checkbox('set unchecked');
        }
    });
    
    // 客户管理中批量邀请
    $('.customer-management-invite').off('click').on('click',function() {
        invite_account_arr = [];
        $('.customer_management_con').find('.checkboxChild').each(function() {
            if($(this).checkbox('is checked') === true) {
                invite_account_arr.push(Number($(this).attr('customer_id')));
            }
        });
        if(invite_account_arr.length === 0){
            alert('未选择任何信息！');
        }else if(invite_account_arr.length > 0){
            $('.invite_model').show();
            $('.invite_model .cancel').off('click').on('click',function() {
                $('.invite_model').hide();
            });
            $('.invite_model .sure').off('click').on('click',function() {
                $('.invite_model').hide();
                $.ajax({
                    url:'/api/v1.1/recommendorder/dealer/' + dealer_id + '/customer',
                    type:'patch',
                    dataType:'json',
                    data:{
                        cids:invite_account_arr,
                        batch:1,
                        invitationstatus:1
                    },
                    success:function(data){
                        if(data.code === 0){
                            alert('客户邀请成功！');
                            loadCustomers(cus_current_page);
                        }else if(data.code === 1){
                            var failedStr,failedStr1,failedStr2;
                            if(data.failed_exclusion.length !== 0){
                                failedStr1 = data.failed_exclusion.join(',');
                                failedStr = '以下客户因信息不全邀请失败:' + failedStr1 + '\n';
                            }
                            if(data.failedvalidations.length !== 0){
                                failedStr2 = data.failedvalidations.join(',');
                                failedStr += '以下客户因帐号已存在邀请失败:' + failedStr2
                            }
                            alert(failedStr);
                        }
                        
                    }
                });
            });
        }
    });
    //客户管理导出
    $('.cus_export').off('click').on('click',function() {
        $('.cus_export_model').show();
        $('.cus_export_model .cancel').off('click').on('click',function() {
            $('.cus_export_model').hide();
        });
        $('.cus_export_model .sure').off('click').on('click',function() {
            $('.cus_export_model').hide();
            var cus_url = '/api/v1.2/recommendorder/dealer/' + dealer_id + '/customers';
            window.location.href = cus_url + '?filesave=1&&sourcetype=2';
        });
    });
     //录入管理
    var entering_pages = 0;
    var entering_current_page = 1;
    var entering_id;
    var enteringSearch_results = '';
    var entering_arr = [];
    var entering_ok = '';
    var entering_no = '';
    var entering_tr = '';
    var entering_other = '';
    // 点击录入用户出现右边内容
    $.ajax({
        url:'/api/v1.2/recommendorder/dealer/' + dealer_id + '/customers',
        type:'get',
        dataType:'json',
        data:{
            sourcetype:1,
            per_page:20,
            page:entering_current_page,
            keyword:enteringSearch_results
        },
        success:function(data){
            entering_pages = data.pages;
            enteringPagiFun(entering_pages);
            loadEntering(1);
            enteringChangeStatusFun();
            enteringStatusFun();
        }
    });
    $('.entering-management').off('click').on('click',function() {
        $('.management_con').css('display','none');
        $('.entering-management-con').show();
    });
    // 录入管理搜索
    $('#customer-entering-search').bind('input propertychange',function(){
        $('#entering-tbody').empty(); 
        if($('#customer-entering-search').val().length >=1){
            enteringSearch_results = $('#customer-entering-search').val();
        }else{
            enteringSearch_results = '';
        }       
        $.ajax({
            url:'/api/v1.2/recommendorder/dealer/' + dealer_id + '/customers',
            type:'get',
            dataType:'json',
            data:{
                sourcetype:1,
                per_page:20,
                page:1,
                keyword:enteringSearch_results
            },
            success:function(data){
                entering_pages = data.pages;
                enteringPagiFun(entering_pages);
                loadEntering(1);
                enteringChangeStatusFun();
                enteringStatusFun();
                
            }
        });
    });
    function enteringPagiFun(data){
        var prePage = "<a href='javascript:' class='item pre-page' id='entering-pre-page'>上一页</a>";
        var nextPage = "<a href='javascript:' class='item next-page' id='entering-next-page'>下一页</a>";
        var singlePage = "";
        for (var k = 1; k <= data; k++) {
            if (k <= 6) {
                singlePage += "<a href='javascript:' class='item pagi' sign='pagi'>"+ k +"</a>";
            }
        }
        var allPage = prePage + singlePage + nextPage;
        $('.entering-pagination').empty();
        $('.entering-pagination').append(allPage);
        $('.entering-pagination .pagi:first').addClass('active');
    }
    function enteringChangeStatusFun() {
        // 每一页
        $('.entering-pagination').off('click').on('click','.pagi',function(){
            entering_current_page = $(this).html();
            loadEntering(entering_current_page);
            enteringCurrentPageStatus();
        });

        // 左右翻页
        $('.entering-pagination .pre-page').off('click').on('click',function(){
            entering_current_page = entering_current_page - 1;
            if (entering_current_page <= 0) {
                entering_current_page = 1;
            }
            loadEntering(entering_current_page);
            enteringCurrentPageStatus();

        });
        $('.entering-pagination .next-page').off('click').on('click',function(){
            entering_current_page = entering_current_page -0 + 1;
            if (entering_current_page >= entering_pages) {
                entering_current_page = entering_pages;
            }
            loadEntering(entering_current_page);
            enteringCurrentPageStatus();

        });
    }

    function enteringCurrentPageStatus() {
        $('.entering-pagination .pagi').each(function(){
            if ($(this).html() == entering_current_page) {
                $(this).addClass('active').siblings().removeClass('active');
            }
            if (entering_current_page >= 4 && entering_pages > 6) {
                if (entering_current_page >= entering_pages - 2) {
                    $('.entering-pagination .pagi').each(function(pagi_index,pagi_ele) {
                        var nowPage = entering_pages - 5 + pagi_index;
                        $(pagi_ele).html(nowPage);
                    });
                }else{
                    $('.entering-pagination .pagi').each(function(pagi_index,pagi_ele) {
                        var nowPageOther = entering_current_page - 3 + pagi_index;
                        $(pagi_ele).html(nowPageOther);
                    });
                }
            }else if(entering_current_page < 4 && entering_pages > 6){
                $('.entering-pagination .pagi').each(function(pagi_index,pagi_ele) {
                    var nowPagepre = 1 - 0 + pagi_index;
                    $(pagi_ele).html(nowPagepre);
                });
            }
        });
    }
    // 请求录入管理数据
    function loadEntering(entering_current_page) {
        $(".enteringCheckboxAll").checkbox('set unchecked');
        if($('#customer-entering-search').val().length >=1){
            enteringSearch_results = $('#customer-entering-search').val();
        }else{
            enteringSearch_results = '';
        }
        $.ajax({
            url:'/api/v1.2/recommendorder/dealer/' + dealer_id + '/customers',
            type:'get',
            dataType:'json',
            data:{
                sourcetype:1,
                per_page:20,
                page:entering_current_page,
                keyword:enteringSearch_results
            },
            success:function(data){
                $('.entering-management-con').find('tbody').children().remove();
                for(var n in data.customers){
                    if(data.customers[n].customer_address === null){
                        data.customers[n].customer_address = '';
                    }
                    if(data.customers[n].customer_phone === null){
                        data.customers[n].customer_phone = '';
                    }
                    if(data.customers[n].contact === null){
                        data.customers[n].contact = '';
                    }
                    if(data.customers[n].postscript === null){
                        data.customers[n].postscript = '';
                    }
                    entering_other="<tr class='ui center aligned'  customer_id=" + data.customers[n].customer_id +"><td><div class='ui checkbox enteringCheckboxChild' customer_id=" + data.customers[n].customer_id +"><input type='checkbox'>" +
                    "<label></label></div></td><td class='cus_name'>" + data.customers[n].customer_name +"</td><td class='cus_address'>" + data.customers[n].customer_address + "</td>" +
                    "<td class='cus_people'>" + data.customers[n].contact + "</td><td class='cus_tel'>" + data.customers[n].customer_phone + "</td><td>" + data.customers[n].salesman_name + "</td>" +
                    "<td class='cus_account'>" + data.customers[n].postscript + "</td>";
                    entering_ok = "<td><button class='entering enteringActive' customer_id=" + data.customers[n].customer_id +">已录入</button></td></tr>";
                    entering_no = "<td><button class='entering enteringNo' customer_id=" + data.customers[n].customer_id +">待录入</button></td></tr>"; 


                    if(data.customers[n].entrystatus === 1) {
                        entering_tr =  entering_other + entering_ok;
                    }else {
                        entering_tr =  entering_other + entering_no;
                    }
                    $('.entering-management-con').find('tbody').append(entering_tr);
                    if(data.customers[n].entrystatus === 1){
                        $("tr[customer_id='" + data.customers[n].customer_id + "']").addClass('enteringOkTr');
                        $(".enteringActive[customer_id='" + data.customers[n].customer_id + "']").removeClass('entering'); 
                        $(".checkbox[customer_id='" + data.customers[n].customer_id + "']").find('input').attr('disabled','disabled');
                        $(".checkbox[customer_id='" + data.customers[n].customer_id + "']").removeClass('enteringCheckboxChild'); 
                        $(".checkbox[customer_id='" + data.customers[n].customer_id + "']").checkbox('set disabled');                            
                    }
                }
                enteringStatusFun();
            }
        });
    }
    //录入管理是否录入
    function enteringStatusFun(){
        $('.entering-management-con').off('click').on('click','.entering',function() {
            entering_id = $(this).attr('customer_id');
            $('.entering_model').show();
            $('.entering_model .cancel').off('click').on('click',function() {
                $('.entering_model').hide();
            });
            $('.entering_model .sure').off('click').on('click',function() {
                $('.entering_model').hide();
                $.ajax({
                    url:'/api/v1.1/recommendorder/dealer/' + dealer_id + '/customer/' + entering_id,
                    type:'patch',
                    dataType:'json',
                    data:{
                        cid:entering_id,
                        entrystatus:1
                    },
                    success:function(data){
                        if(data.code === 0) {
                            alert('录入成功！');
                            loadEntering(entering_current_page);
                        }else{
                            alert('录入失败！');
                        }
                    }
                });
            });
        });
    }
    //全选和全不选
     $('.entering-management-con .enteringCheckboxAll.checkbox')
    .checkbox({
        onChecked: function() {
          $('.enteringCheckboxChild').checkbox('check');
        },
        onUnchecked: function() {
          $('.enteringCheckboxChild').checkbox('uncheck');
        }
    });
    $('.entering-management-con').off('change').on('change','.enteringCheckboxChild',function() { 
        var childArr = $(".enteringCheckboxChild").checkbox('is checked');
        var childCheckedNum = 0;
        for(var j in childArr){
            if(childArr[j] === true){
                childCheckedNum += 1;
            }
        }
        if($('.enteringCheckboxChild').length == childCheckedNum) {
            $(".enteringCheckboxAll").checkbox('set checked');
        }else{
            $(".enteringCheckboxAll").checkbox('set unchecked');
        }
    });
    // 录入管理中批量录入
    $('.entering-management-entering').off('click').on('click',function() {
        entering_arr = [];
        $('.entering-management-con').find('.enteringCheckboxChild').each(function() {
            if($(this).checkbox('is checked') === true) {
                entering_arr.push(Number($(this).attr('customer_id')));
            }
        });
        if(entering_arr.length === 0){
            alert('未选择任何信息！');
        }else if(entering_arr.length > 0){
            $('.entering_model').show();
            $('.entering_model .cancel').off('click').on('click',function() {
                $('.entering_model').hide();
            });
            $('.entering_model .sure').off('click').on('click',function() {
                $('.entering_model').hide();
                $.ajax({
                    url:'/api/v1.1/recommendorder/dealer/' + dealer_id + '/customer',
                    type:'patch',
                    dataType:'json',
                    data:{
                        cids:entering_arr,
                        batch:1,
                        entrystatus:1
                    },
                    success:function(data){
                        if(data.code === 0){
                            alert('录入成功！');
                            loadEntering(entering_current_page);
                        }else{
                            alert('录入失败！');
                        }
                        
                    }
                });
            });

        }
    });

    // 点击业务员管理出现右边内容
    $('#sal_datepicker').val(startDate.getMonth() + 1 + '/' + startDate.getDate() + '/' + startDate.getFullYear());
    $('#sal_datepickerEnd').val(endDate.getMonth() + 1 + '/' + endDate.getDate() + '/' + endDate.getFullYear());
    var start = '';
    var end = '';
    var salesmenData={};
    $.ajax({
        url:'/api/v1.2/recommendorder/dealer/' + dealer_id + '/salesmen',
        type:'get',
        dataType:'json',
        data:{
            per_page:20,
            page:sal_current_page
        },
        success:function(data){
            sal_pages = data.pages;
            for (var sal_k = 1; sal_k <= sal_pages; sal_k++) {
                if (sal_k <= 6) {
                    var sal_single = $('<a href="javascript:" class="item pagi" sign="pagi">'+ sal_k +'</a>');
                    $("#sal_next_page").before(sal_single);
                }
            }
            $('.sal_pagination .pagi:first').addClass('active');
            sal_pagi_click();
            salesman_change();

        }
    });
    sal_data();
    $('.salesman_management').off('click').on('click',function() {
        $('.management_con').hide();
        sal_ajaxRequest();
        $('.salesman_management_con').show();
    });
    function sal_data(){
        //时间判断
            //时间框的开始时间
            $('#sal_datepicker').on('change',function(){
                sal_ajaxRequest();
                sal_currentPageStatus();
            });
            //时间框的结束时间
            $('#sal_datepickerEnd').on('change',function(){
                sal_ajaxRequest();
                sal_currentPageStatus();
            });
    }
    function salesmenDataFun(sal_current_page){
        if($('#sal_datepicker').val()!=='' && $('#sal_datepickerEnd').val() !== ''){
            start = timeFilters($('#sal_datepicker').val());
            end = timeFilters($('#sal_datepickerEnd').val());
            salesmenData = {
                per_page:20,
                page:sal_current_page,
                start:start,
                end:end
            };
        }else{
            salesmenData = {
                per_page:20,
                page:sal_current_page
            };
        }
    }
    function sal_pagi_click() {
        // 每一页
        $('.sal_pagination').on('click','.pagi',function(){
            sal_current_page = $(this).html();
            sal_ajaxRequest();
            sal_currentPageStatus();
        });

        // 左右翻页
        $('.sal_pagination .pre-page').click(function(){
            sal_current_page = sal_current_page - 1;
            if (sal_current_page <= 0) {
                sal_current_page = 1;
            }
            sal_ajaxRequest();
            sal_currentPageStatus();

        });
        $('.sal_pagination .next-page').click(function(){
            sal_current_page = sal_current_page -0 + 1;
            if (sal_current_page >= sal_pages) {
                sal_current_page = sal_pages;
            }
            sal_ajaxRequest();
            sal_currentPageStatus();

        });
    }

    function sal_currentPageStatus() {
        $('.sal_pagination .pagi').each(function(){
            if ($(this).html() == sal_current_page) {
                $(this).addClass('active').siblings().removeClass('active');
            }
            if (sal_current_page >= 4 && sal_pages > 6) {
                if (sal_current_page >= sal_pages - 2) {
                    $('.sal_pagination .pagi').each(function(pagi_index,pagi_ele) {
                        var nowPage = sal_pages - 5 + pagi_index;
                        $(pagi_ele).html(nowPage);
                    });
                }else{
                    $('.sal_pagination .pagi').each(function(pagi_index,pagi_ele) {
                        var nowPageOther = sal_current_page - 3 + pagi_index;
                        $(pagi_ele).html(nowPageOther);
                    });
                }

            }
        });

    }
    // 请求业务员数据
    function sal_ajaxRequest() {
        salesmenDataFun(sal_current_page);
        $.ajax({
            url:'/api/v1.2/recommendorder/dealer/' + dealer_id + '/salesmen',
            type:'get',
            dataType:'json',
            data:salesmenData,
            success:function(data){
                sal_pages = data.pages;
                $('.salesman_management_con').find('tbody').children().remove();
                for(var sal_n in data.salesmen){
                    if(data.salesmen[sal_n].phone === null){
                        data.salesmen[sal_n].phone = '';
                    }
                    salesman_tr="<tr class='ui center aligned'><td><div class='ui checkbox' salesman_id=" + data.salesmen[sal_n].id +"><input type='checkbox'>" +
                    "<label></label></div></td><td class='sal_name'>" + data.salesmen[sal_n].name +"</td>" +
                    "<td class='sal_tel'>" + data.salesmen[sal_n].phone + "</td><td class='sal_account'>" + data.salesmen[sal_n].username + "</td>" + "</td><td class='sal_num'>" + data.salesmen[sal_n].num + "</td>" +
                    "</td><td class='sal_price'>" + Number(data.salesmen[sal_n].sales).toFixed(2) + "</td>" +
                    "<td><a href='#' class='change' salesman_id=" + data.salesmen[sal_n].id +">修改</a></td>";

                    $('.salesman_management_con').find('tbody').append(salesman_tr);
                }
                salesman_change();

            }
        });
    }
  // 业务员管理中的修改
    function salesman_change() {
        $('.salesman_management_con').on('click','.change',function(){
            salesman_id = $(this).attr('salesman_id');
            $('.change_salesman_model').find('.model_salesman_name_input').val($(".change[salesman_id='" + salesman_id + "']").parents('tr').find('.sal_name').text());
            $('.change_salesman_model').find('.model_tel_method').val($(".change[salesman_id='" + salesman_id + "']").parents('tr').find('.sal_tel').text());
            $('.change_salesman_model').show();

            $('.change_salesman_model .opt_cancel').off('click').on('click',function() {
                $('.change_salesman_model').hide();
            });
            $('.change_salesman_model .opt_sure').off('click').on('click',function() {
                var model_salesman_name_input = $('.change_salesman_model').find('.model_salesman_name_input').val();
                var model_tel_method = $('.change_salesman_model').find('.model_tel_method').val();
                if(model_salesman_name_input !== '' && model_tel_method.match(number_reg) !== null) {
                    $('.change_salesman_model').hide();
                    $.ajax({
                        url:'/api/v1.1/recommendorder/dealer/' + dealer_id + '/salesman/' + salesman_id,
                        type:'post',
                        dataType:'json',
                        data:{
                            sid:salesman_id,
                            name:$('.change_salesman_model').find('.model_salesman_name_input').val(),
                            phone:$('.change_salesman_model').find('.model_tel_method').val(),
                            password:$('.change_salesman_model').find('.model_password').val()
                        },
                        success:function(data){
                            alert('业务员信息修改成功！');
                            $(".change[salesman_id='" + salesman_id + "']").parents('tr').find('.sal_name').text($('.change_salesman_model').find('.model_salesman_name_input').val());
                            $(".change[salesman_id='" + salesman_id + "']").parents('tr').find('.sal_tel').text($('.change_salesman_model').find('.model_tel_method').val());
                        }
                    });
                }else{
                    alert('请将信息填写完整及规范！');
                }


            });
        });
    }

    // 业务员管理中新增用户
    $('.salesman_management_con .addCustomer').on('click',function() {
        $('.add_salesman_model').show();
        $('.add_salesman_model .opt_cancel').off('click').on('click',function() {
            $('.add_salesman_model').hide();
        });

        $('.add_salesman_model .opt_sure').off('click').on('click',function() {

            var model_salesman_name_input = $('.add_salesman_model').find('.model_salesman_name_input').val();
            var model_tel_method = $('.add_salesman_model').find('.model_tel_method').val();
            var model_account = $('.add_salesman_model').find('.model_account').val();
            if(model_salesman_name_input !== '' && model_tel_method.match(number_reg) !== null) {
                $('.add_salesman_model').hide();
                $.ajax({
                    url:'/api/v1.1/recommendorder/dealer/' + dealer_id + '/salesman',
                    type:'put',
                    dataType:'json',
                    data:{
                        name:$('.add_salesman_model').find('.model_salesman_name_input').val(),
                        phone:$('.add_salesman_model').find('.model_tel_method').val()
                        // username:$('.add_salesman_model').find('.model_account').val()
                    },
                    success:function(data){
                        alert('业务员添加成功！');
                        sal_ajaxRequest();
                    },
                    complete:function(XMLHttpRequest, textStatus){
                        if(XMLHttpRequest.status === 409) {
                            alert('该业务员账号已存在！');
                        }else if(XMLHttpRequest.status === 500) {
                            alert('请填写业务员账号信息！');
                        }
                    }
                });
            }else{
                alert('请将信息填写完整及规范！');
            }

        });
    });

    // 业务员管理中批量删除
    $('.salesman_management_delete').on('click',function() {
        delete_salesman_arr = [];
        $('.salesman_management_con').find('.checkbox').each(function() {
            if($(this).checkbox('is checked') === true) {
                delete_salesman_arr.push(Number($(this).attr('salesman_id')));
            }
        });
        if(delete_salesman_arr.length === 0){
            alert('未选择删除信息！');
        }else if(delete_salesman_arr.length > 0){
            $('.sal_delete_model').show();
            $('.sal_delete_model .cancel').off('click').on('click',function() {
                $('.sal_delete_model').hide();
            });
            $('.sal_delete_model .sure').off('click').on('click',function() {
                $('.sal_delete_model').hide();
                for(var sal_del_id in delete_salesman_arr){
                    $(".salesman_management_con .checkbox[salesman_id='" + delete_salesman_arr[sal_del_id] + "']").parents('tr').remove();
                }
                $.ajax({
                    url:'/api/v1.1/recommendorder/dealer/' + dealer_id + '/salesman',
                    type:'delete',
                    dataType:'json',
                    data:{
                        sids:delete_salesman_arr
                    },
                    success:function(data){
                        alert('业务员删除成功！');
                    }
                });
            });

        }

    });
    //业务员导出
    $('.sal_export').on('click',function() {
        $('.sal_export_model').show();
        $('.sal_export_model .cancel').off('click').on('click',function() {
            $('.sal_export_model').hide();
        });
        $('.sal_export_model .sure').off('click').on('click',function() {
            $('.sal_export_model').hide();
            var sal_url = '/api/v1.2/recommendorder/dealer/' + dealer_id + '/salesmen';
            window.location.href = sal_url + '?filesave=1';
        });
    });
    // 商品管理
        $('.product-management').off('click').on('click',function() {
            $('.management_con').hide();
            $('.product-management-con').show();
        });
        var content = new Vue({
            el: "#product-management-con",
            beforeCreate: function() {
                var _self = this;
                $.ajax({
                    url: "/api/v1.1/recommendorder/dealer/" + dealer_id + "/item",
                    type: 'get',
                    success: function(data) {
                        _self.cats = data.data;
                    }
                });
            },
            data: {
                cats: [],
                items: [],
                seriesItems:[],
                productSeries:[],
                moveCatId:'',
                moveProductArr:[],
                checkedAllFlag:false,
                checkedSingleFlag:false
            },
            updated: function() {
                var _self = this;
                $(".teal.item").each(function() {
                    $(this).popup({
                        inline: true,
                        hoverable: true,
                        popup: "#" + $(this).attr("id") + "menu",
                        position: 'bottom left',
                        delay: {
                            show: 100,
                            hide: 200
                        }
                    });
                });
            },
            methods: {
                showItemsByCatId: function(id) {
                    var _self = this;
                    _self.productSeries = [];
                    for (var i = _self.cats.length - 1; i >= 0; i--) {
                        if(_self.cats[i].id===id){
                            _self.items = _self.cats[i].items;
                            _self.moveCatId = id;
                            _self.checkedSingleFlag = false;
                            _self.checkedAllFlag = false;
                        }
                    }
                },
                showItemsBySeriesItemId: function(id) {
                    var _self = this;
                    _self.checkedSingleFlag = false;
                    _self.checkedAllFlag = false;
                    for (var i = _self.cats.length - 1; i >= 0; i--) {
                        for (var j = _self.cats[i].series.length - 1; j >= 0; j--) {
                            for (var k = _self.cats[i].series[j].series_items.length - 1; k >= 0; k--) {
                                if(_self.cats[i].series[j].series_items[k].id===id){
                                    _self.items = _self.cats[i].series[j].series_items[k].items;    
                                    _self.moveCatId = id;
                                    return;
                                }
                            }
                        }
                    }
                },
                checkedAll:function(){
                    var _self = this;
                    if($('.productCheckboxAll input').prop('checked') === true){
                        _self.checkedSingleFlag = true;
                        _self.checkedAllFlag = true;
                    }else{
                        _self.checkedSingleFlag = false;
                        _self.checkedAllFlag = false;
                    }
                },
                checkedSingle:function(){
                    var _self = this;
                    var moveChildArr = [];
                    $('.product-management-con').find('.productCheckboxChild').each(function() {
                        moveChildArr.push($(this).checkbox('is checked'));
                    });
                    var childCheckedNum = 0;
                    for(var j in moveChildArr){
                        if(moveChildArr[j] === true){
                            childCheckedNum += 1;
                        }
                    }
                    if($('.productCheckboxChild').length == childCheckedNum) {
                         _self.checkedAllFlag = true;
                         _self.checkedSingleFlag = true;
                    }else{
                         _self.checkedAllFlag = false;
                    }

                },
                move:function(id){
                    var _self = this;
                    _self.moveProductArr = [];
                    $('.product-management-con').find('.productCheckboxChild').each(function() {
                        if($(this).checkbox('is checked') === true) {
                            _self.moveProductArr.push(Number($(this).parents('tr').attr('itemId')));
                        }
                    });
                    if(_self.moveProductArr.length === 0){
                        alert('请先勾选要移动的商品！');
                    }else{
                        _self.seriesItems = [];
                        _self.productSeries = [];
                        for (var i = _self.cats.length - 1; i >= 0; i--) {
                            if(_self.cats[i].id===id){
                                $('.move-back').hide();
                                for(var q = _self.cats[i].series.length - 1; q >= 0; q--){
                                    _self.productSeries.push(_self.cats[i].series[q]);
                                }
                            }else{
                                for(var j = _self.cats[i].series.length - 1; j >= 0; j--){
                                    for(var k = _self.cats[i].series[j].series_items.length - 1; k >= 0; k--){
                                        if(_self.cats[i].series[j].series_items[k].id === id){
                                            $('.move-back').show();
                                            for(var e = _self.cats[i].series.length - 1; e >= 0; e--){
                                                _self.productSeries.push(_self.cats[i].series[e]);
                                            }
                                            
                                        }
                                    }          
                                }
                            }
                        }                   
                        $('.move-product-model').show();
                        $('.series-product-select').on('change',function(){
                            _self.seriesItems = [];
                            for (var i = _self.cats.length - 1; i >= 0; i--) {
                                if(_self.cats[i].id===id){
                                    for(var q = _self.cats[i].series.length - 1; q >= 0; q--){
                                        if(_self.cats[i].series[q].id === Number($('.series-product-select').val())){
                                            for(var r = _self.cats[i].series[q].series_items.length - 1; r >= 0; r--){
                                                _self.seriesItems.push(_self.cats[i].series[q].series_items[r]);
                                            }
                                        }
                                    }
                                }else{
                                    for(var j = _self.cats[i].series.length - 1; j >= 0; j--){
                                        for(var k = _self.cats[i].series[j].series_items.length - 1; k >= 0; k--){
                                            if(_self.cats[i].series[j].series_items[k].id === id){
                                                for(var m = _self.cats[i].series.length - 1; m >= 0; m--){
                                                    if(_self.cats[i].series[m].id === Number($('.series-product-select').val())){
                                                        for(var n = _self.cats[i].series[m].series_items.length - 1; n >= 0; n--){
                                                            _self.seriesItems.push(_self.cats[i].series[m].series_items[n]);
                                                        }
                                                    }
                                                }
                                                
                                            }
                                        }          
                                    }
                                }
                            }
                            
                        })
                    }
                                        
                    var moveProductData = {};
                    $('.move-save').off('click').on('click',function(){
                        if($('.series-product-select').val() === ''){
                            alert("请选择商品系列！");
                        }else{
                            if($('.series-product-select').val() === 'null'){
                                moveProductData = {
                                    'type':'seriesitem',
                                    'item_ids':_self.moveProductArr,
                                    'operation_type':0,
                                    'series_id':$('.series-product-select').val(),
                                    'seriesitem_id':$('.series-item-select').val()
                                };
                            }else{
                                moveProductData = {
                                    'type':'seriesitem',
                                    'item_ids':_self.moveProductArr,
                                    'operation_type':1,
                                    'series_id':$('.series-product-select').val(),
                                    'seriesitem_id':$('.series-item-select').val()
                                };
                            }                            
                            $.ajax({
                                url: "/api/v1.3/recommendorder/dealers/" + dealer_id + "/items",
                                type: 'patch',
                                data: moveProductData,
                                success: function(data) {
                                    $('.move-product-model').hide();
                                    $.ajax({
                                        url: "/api/v1.1/recommendorder/dealer/" + dealer_id + "/item",
                                        type: 'get',
                                        success: function(data) {
                                            for (var ii = _self.cats.length - 1; ii >= 0; ii--) {
                                                if(_self.cats[ii].id===id){
                                                    _self.cats = data.data;
                                                    _self.items = _self.cats[ii].items;
                                                    Vue.nextTick(function () {
                                                        alert('移动商品成功');
                                                        _self.seriesItems = [];
                                                        _self.productSeries = [];
                                                    });
                                                    
                                                }else{
                                                    for (var jj = _self.cats[ii].series.length - 1; jj >= 0; jj--) {
                                                        for (var kk = _self.cats[ii].series[jj].series_items.length - 1; kk >= 0; kk--) {
                                                            if(_self.cats[ii].series[jj].series_items[kk].id===id){
                                                                _self.cats = data.data;
                                                                _self.items = _self.cats[ii].series[jj].series_items[kk].items;
                                                                Vue.nextTick(function () {
                                                                    alert('移动商品成功');
                                                                    _self.seriesItems = [];
                                                                    _self.productSeries = [];
                                                                });    
                                                            }
                                                        }
                                                    }
                                                }    
                                            }        
                                        }
                                    });
                                }
                            });
                        }
                    });
                    $('.move-cancel').off('click').on('click',function(){
                        $('.move-product-model').hide();
                        _self.seriesItems = [];
                        _self.productSeries = [];
                    });
                },
                disable: function(id) {
                var _self = this;
                var disableProductData = {};

                $('.disable-product-model').show();
                $('.product-disable').off('click').on('click', function() {
                    disableProductData = {
                        'type': 'disabledflag',
                        'item_id': id,
                        'status': 1
                    };
                    $.ajax({
                        url: "/api/v1.1/recommendorder/dealer/" + dealer_id + "/item",
                        type: 'post',
                        data: disableProductData,
                        success: function(data) {
                            $('.disable-product-model').hide();
                            $.ajax({
                                url: "/api/v1.1/recommendorder/dealer/" + dealer_id + "/item",
                                type: 'get',
                                success: function(data) {
                                    for (var ii = _self.cats.length - 1; ii >= 0; ii--) {
                                            for(var pp = _self.cats[ii].items.length - 1; pp >= 0; pp--){
                                                if(_self.cats[ii].items[pp].id===id){
                                                    _self.cats = data.data;
                                                    _self.items = _self.cats[ii].items;
                                                    Vue.nextTick(function () {
                                                        alert('停用商品成功');
                                                    });
                                                    return;
                                                }
                                            }
                                            for (var jj = _self.cats[ii].series.length - 1; jj >= 0; jj--) {
                                                for (var kk = _self.cats[ii].series[jj].series_items.length - 1; kk >= 0; kk--) {
                                                    for(var mm = _self.cats[ii].series[jj].series_items[kk].items.length - 1; mm >= 0; mm--) {
                                                        if(_self.cats[ii].series[jj].series_items[kk].items[mm].id===id){
                                                            _self.cats = data.data;
                                                            _self.items = _self.cats[ii].series[jj].series_items[kk].items;
                                                            Vue.nextTick(function () {
                                                                alert('停用商品成功');
                                                            });
                                                            return;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                }
                            });
                        }

                    });
                });
                $('.product-enable').off('click').on('click', function() {
                    disableProductData = {
                        'type': 'disabledflag',
                        'item_id': id,
                        'status': 0
                    };
                    $.ajax({
                        url: "/api/v1.1/recommendorder/dealer/" + dealer_id + "/item",
                        type: 'post',
                        data: disableProductData,
                        success: function(data) {
                            $('.disable-product-model').hide();
                            $.ajax({
                                url: "/api/v1.1/recommendorder/dealer/" + dealer_id + "/item",
                                type: 'get',
                                success: function(data) {
                                    for (var ii = _self.cats.length - 1; ii >= 0; ii--) {
                                        for(var pp = _self.cats[ii].items.length - 1; pp >= 0; pp--){
                                            if(_self.cats[ii].items[pp].id===id){
                                                _self.cats = data.data;
                                                _self.items = _self.cats[ii].items;
                                                Vue.nextTick(function () {
                                                    alert('启用商品成功');
                                                });
                                                return;
                                            }
                                        }
                                        for (var jj = _self.cats[ii].series.length - 1; jj >= 0; jj--) {
                                            for (var kk = _self.cats[ii].series[jj].series_items.length - 1; kk >= 0; kk--) {
                                                for(var mm = _self.cats[ii].series[jj].series_items[kk].items.length - 1; mm >= 0; mm--) {
                                                    if(_self.cats[ii].series[jj].series_items[kk].items[mm].id===id){
                                                        _self.cats = data.data;
                                                        _self.items = _self.cats[ii].series[jj].series_items[kk].items;
                                                        Vue.nextTick(function () {
                                                            alert('启用商品成功');
                                                        });
                                                        return;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    });
                });
                $('.product-cancel').off('click').on('click', function() {
                    $('.disable-product-model').hide();
                });
            },
                addSeries: function() {
                    var _self = this;
                    $('.add-series-model').show();
                    $('.series-save').off('click').on('click',function(){
                        if($('.add-series-name').val() !== ''){
                            $.ajax({
                                url: "/api/v1.1/recommendorder/dealer/" + dealer_id + "/item",
                                type: 'put',
                                data: {
                                    'type':'series',
                                    'id':$('.seriesParents').val(),
                                    'name':$('.add-series-name').val()
                                },
                                success: function(data) {
                                    $('.add-series-model').hide();
                                    $.ajax({
                                        url: "/api/v1.1/recommendorder/dealer/" + dealer_id + "/item",
                                        type: 'get',
                                        success: function(data) {
                                            _self.cats = data.data;
                                            Vue.nextTick(function () {
                                                alert('新增系列成功');
                                            });
                                        }
                                    });
                                }
                            });
                        }else{
                            alert('请输入内容！');
                        }
                    });
                    $('.series-cancel').off('click').on('click',function(){
                        $('.add-series-model').hide();
                    });
                },
                addSeriesProduct:function(seriesId){
                    var _self = this;
                    $('.add-seriesProduct-model').show();
                    $('.seriesProduct-save').off('click').on('click',function(){
                        if($('.add-seriesProduct-name').val() !== ''){
                            $.ajax({
                                url: "/api/v1.1/recommendorder/dealer/" + dealer_id + "/item",
                                type: 'put',
                                data: {
                                    'type':'seriesitem',
                                    'id':seriesId,
                                    'name':$('.add-seriesProduct-name').val()
                                },
                                success: function(data) {
                                    $('.add-seriesProduct-model').hide();
                                    
                                    $.ajax({
                                        url: "/api/v1.1/recommendorder/dealer/" + dealer_id + "/item",
                                        type: 'get',
                                        success: function(data) {
                                            _self.cats = data.data;
                                            Vue.nextTick(function () {
                                                alert('新增系列商品成功');
                                            });
                                        }
                                    });
                                }
                            });
                        }else{
                            alert('请输入内容！');
                        }
                    });
                    $('.seriesProduct-cancel').off('click').on('click',function(){
                        $('.add-seriesProduct-model').hide();
                    });
                },
                editorSeries:function(seriesId){
                    var _self = this;
                    $(".series-name-input[inputSeriesId='"+seriesId+"']").show();
                    $(".series-name-input[inputSeriesId='"+seriesId+"']").on('blur',function(){
                        $(".series-name-input[inputSeriesId='"+seriesId+"']").hide();
                        $.ajax({
                                url: "/api/v1.1/recommendorder/dealer/" + dealer_id + "/item",
                                type: 'post',
                                data: {
                                    'type':'series',
                                    'id':seriesId,
                                    'name':$(".series-name-input[inputSeriesId='"+seriesId+"']").val()
                                },
                                success: function(data) {
                                    $.ajax({
                                        url: "/api/v1.1/recommendorder/dealer/" + dealer_id + "/item",
                                        type: 'get',
                                        success: function(data) {
                                            _self.cats = data.data;
                                        }
                                    });
                                }
                            });
                    });
                },
                editorSeriesItem:function(seriesItemId){
                    var _self = this;
                    $(".seriesItem-name-input[inputSeriesItemId='"+seriesItemId+"']").show();
                    $(".seriesItem-name-input[inputSeriesItemId='"+seriesItemId+"']").on('blur',function(){
                    $(".seriesItem-name-input[inputSeriesItemId='"+seriesItemId+"']").hide();
                        $.ajax({
                                url: "/api/v1.1/recommendorder/dealer/" + dealer_id + "/item",
                                type: 'post',
                                data: {
                                    'type':'seriesitem',
                                    'id':seriesItemId,
                                    'name':$(".seriesItem-name-input[inputSeriesItemId='"+seriesItemId+"']").val()
                                },
                                success: function(data) {
                                    $.ajax({
                                        url: "/api/v1.1/recommendorder/dealer/" + dealer_id + "/item",
                                        type: 'get',
                                        success: function(data) {
                                            _self.cats = data.data;
                                        }
                                    });
                                }
                            });
                    });
                },
                editorProductSpecification:function(productId){
                    var _self = this;
                    $(".product-specification-input[inputProductId='"+productId+"']").show();
                    $(".product-specification-input[inputProductId='"+productId+"']").on('blur',function(){
                    $(".product-specification-input[inputProductId='"+productId+"']").hide();
                        $.ajax({
                                url: "/api/v1.1/recommendorder/dealer/" + dealer_id + "/item",
                                type: 'post',
                                data: {
                                    'type':'specification',
                                    'id':productId,
                                    'specification':$(".product-specification-input[inputProductId='"+productId+"']").val()
                                },
                                success: function(data) {
                                    $.ajax({
                                        url: "/api/v1.1/recommendorder/dealer/" + dealer_id + "/item",
                                        type: 'get',
                                        success: function(data) {
                                            _self.cats = data.data;
                                        }
                                    });
                                }
                            });
                    });
                },
                editorProductImage:function(productId){
                    var _self = this;
                    $(".product-img-from[inputProductId='"+productId+"']").show();
                    $('.upload-cancel').off('click').on('click',function(){
                        $('.product-img-from').hide();
                    });
                    $(".product-img-from").off('submit').on('submit',function () {
                        $('.product-img-from').hide();
                        var options = {
                            url: "/api/v1.1/recommendorder/dealer/" + dealer_id + "/item",
                            type: 'post',
                            dataType: 'json',
                            data:{
                                'type':'image'
                            },
                            success:function(data){
                                $.ajax({
                                    url: "/api/v1.1/recommendorder/dealer/" + dealer_id + "/item",
                                    type: 'get',
                                    success: function(data) {
                                        for (var ii = _self.cats.length - 1; ii >= 0; ii--) {
                                            for(var pp = _self.cats[ii].items.length - 1; pp >= 0; pp--){
                                                if(_self.cats[ii].items[pp].id===productId){
                                                    _self.cats = data.data;
                                                    _self.items = _self.cats[ii].items;
                                                    Vue.nextTick(function () {
                                                        alert('图片上传成功');
                                                    });
                                                    return;
                                                }
                                            }
                                            for (var jj = _self.cats[ii].series.length - 1; jj >= 0; jj--) {
                                                for (var kk = _self.cats[ii].series[jj].series_items.length - 1; kk >= 0; kk--) {
                                                    for(var mm = _self.cats[ii].series[jj].series_items[kk].items.length - 1; mm >= 0; mm--) {
                                                        if(_self.cats[ii].series[jj].series_items[kk].items[mm].id===productId){
                                                            _self.cats = data.data;
                                                            _self.items = _self.cats[ii].series[jj].series_items[kk].items;
                                                            Vue.nextTick(function () {
                                                                alert('图片上传成功');
                                                            });
                                                            return;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        };
                        $(this).ajaxSubmit(options); 
                        return false;    
                    });
                },
                deleteSeries:function(serierId,serierLength){
                    var _self = this;
                    if(serierLength === 0){
                        $.ajax({
                            url: "/api/v1.1/recommendorder/dealer/" + dealer_id + "/item",
                            type:'delete',
                            dataType:'json',
                            data:{
                                'type':'series',
                                'id':serierId,
                            },
                            success:function(data){                               
                                $.ajax({
                                    url: "/api/v1.1/recommendorder/dealer/" + dealer_id + "/item",
                                    type: 'get',
                                    success: function(data) {
                                        _self.cats = data.data;
                                        Vue.nextTick(function () {
                                            alert('该系列删除成功！');
                                        });
                                    }
                                });
                            }
                        });
                    }else{
                        alert('该系列不能删除！');
                    }

                },
                deleteSeriesProduct:function(serierProductId,serierProductLength){
                    var _self = this;
                    if(serierProductLength === 0){
                        $.ajax({
                            url: "/api/v1.1/recommendorder/dealer/" + dealer_id + "/item",
                            type:'delete',
                            dataType:'json',
                            data:{
                                'type':'seriesitem',
                                'id':serierProductId,
                            },
                            success:function(data){
                                $.ajax({
                                    url: "/api/v1.1/recommendorder/dealer/" + dealer_id + "/item",
                                    type: 'get',
                                    success: function(data) {
                                        _self.cats = data.data;
                                        Vue.nextTick(function () {
                                            alert('该系列商品删除成功！');
                                        });
                                    }
                                });    
                            }
                        });
                    }else{
                        alert('该系列商品不能删除！');
                    }

                }
            }
        });
    // 活动管理
    $('.active-management').off('click').on('click',function() {
        $('.management_con').hide();
        $('.active-management-con').show();
    });
    var active = new Vue({
        el: "#active-management-con",
        beforeCreate: function() {
            var _self = this;
            $.ajax({
                url: "/api/v1.2/recommendorder/dealer/" + dealer_id + "/activity",
                type: 'get',
                success: function(data) {
                    _self.banner_enabled = data.bannerenabled;
                    _self.popup_enabled = data.popupenabled;
                    _self.bannerthumbnail = data.bannerthumbnail;
                    _self.bannerjumpthumbnail = data.bannerjumpthumbnail;
                    _self.popupthumbnail = data.popupthumbnail;
                    _self.popupjumpthumbnail = data.popupjumpthumbnail;
                }
            });
        },
        data: {
            banner_enabled: 0,
            popup_enabled:0,
            bannerthumbnail: '',
            bannerjumpthumbnail: '',
            popupthumbnail:'',
            popupjumpthumbnail:''
        },
        methods: {
            previewBanner:function(){
                var _self = this;
                if ($('#bannerImg').val()===""){
                    alert("请点击“选择文件”按钮，选择上传图片!");
                    $('#bannerImg').focus();
                    return false;
                }
                var ErrMsgErrMsg = "";//错误信息
                var f = document.getElementById("bannerImg").files[0];
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    //加载图片获取图片真实宽度和高度
                    var image = new Image();
                    image.onload=function(){
                        var width = image.width;
                        var height = image.height;
                        if(width !== 484 || height !== 258){
                            ErrMsgErrMsg="图片尺寸不符合要求"; 
                            alert(ErrMsgErrMsg); 
                            return false;
                        }else{
                            var options = {
                                url: "/api/v1.2/recommendorder/dealer/" + dealer_id + "/activity",
                                type: 'post',
                                dataType: 'json',
                                data:{
                                    'type':'bannerimage'
                                },
                                success:function(data){
                                    $.ajax({
                                        url: "/api/v1.2/recommendorder/dealer/" + dealer_id + "/activity",
                                        type: 'get',
                                        success: function(data) {    
                                            _self.bannerthumbnail = data.bannerthumbnail;
                                        }
                                    });        
                                }
                            };
                            $("#banner-form").ajaxSubmit(options); 
                            return false;
                        }  
                    };
                    image.src= data;
                };
                reader.readAsDataURL(f);
            },
            previewBannerJump:function(){
                var _self = this;
                if ($('#bannerJumpImg').val()===""){
                    alert("请点击“选择文件”按钮，选择上传图片!");
                    $('#bannerJumpImg').focus();
                    return false;
                }
                var ErrMsgErrMsg = "";//错误信息
                var f = document.getElementById("bannerJumpImg").files[0];
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    //加载图片获取图片真实宽度和高度
                    var image = new Image();
                    image.onload=function(){
                        var width = image.width;
                        var height = image.height;
                        if(width !== 640){
                            ErrMsgErrMsg="图片尺寸不符合要求"; 
                            alert(ErrMsgErrMsg); 
                            return false;
                        }else{
                            var options = {
                                url: "/api/v1.2/recommendorder/dealer/" + dealer_id + "/activity",
                                type: 'post',
                                dataType: 'json',
                                data:{
                                    'type':'bannerjumpimage'
                                },
                                success:function(data){
                                    $.ajax({
                                        url: "/api/v1.2/recommendorder/dealer/" + dealer_id + "/activity",
                                        type: 'get',
                                        success: function(data) {    
                                            _self.bannerjumpthumbnail = data.bannerjumpthumbnail;
                                        }
                                    });        
                                }
                            };
                            $('#bannerJump-form').ajaxSubmit(options); 
                            return false; 
                        }  
                    };
                    image.src= data;
                };
                reader.readAsDataURL(f);    
            },
            previewPopup:function(){
                var _self = this;    
                if ($('#popupImg').val()===""){
                    alert("请点击“选择文件”按钮，选择上传图片");
                    $('#popupImg').focus();
                    return false;
                }
                var ErrMsgErrMsg = "";//错误信息
                var f = document.getElementById("popupImg").files[0];
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    //加载图片获取图片真实宽度和高度
                    var image = new Image();
                    image.onload=function(){
                        var width = image.width;
                        var height = image.height;
                        if(width !== 520 || height !== 640){
                            ErrMsgErrMsg="图片尺寸不符合要求"; 
                            alert(ErrMsgErrMsg); 
                            return false;
                        }else{
                            var options = {
                                url: "/api/v1.2/recommendorder/dealer/" + dealer_id + "/activity",
                                type: 'post',
                                dataType: 'json',
                                data:{
                                    'type':'popupimage'
                                },
                                success:function(data){
                                    $.ajax({
                                        url: "/api/v1.2/recommendorder/dealer/" + dealer_id + "/activity",
                                        type: 'get',
                                        success: function(data) {    
                                            _self.popupthumbnail = data.popupthumbnail;
                                        }
                                    });        
                                }
                            };
                            $('#popup-form').ajaxSubmit(options); 
                            return false;
                        }  
                    };
                    image.src= data;
                };
                reader.readAsDataURL(f);     
                
            },
            previewPopupJump:function(){
                var _self = this;    
                if ($('#popupJumpImg').val()===""){
                    alert("请点击“选择文件”按钮，选择上传图片");
                    $('#popupJumpImg').focus();
                    return false;
                }
                var ErrMsgErrMsg = "";//错误信息
                var f = document.getElementById("popupJumpImg").files[0];
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    //加载图片获取图片真实宽度和高度
                    var image = new Image();
                    image.onload=function(){
                        var width = image.width;
                        var height = image.height;
                        if(width !== 640){
                            ErrMsgErrMsg="图片尺寸不符合要求"; 
                            alert(ErrMsgErrMsg); 
                            return false;
                        }else{
                            var options = {
                                url: "/api/v1.2/recommendorder/dealer/" + dealer_id + "/activity",
                                type: 'post',
                                dataType: 'json',
                                data:{
                                    'type':'popupjumpimage'
                                },
                                success:function(data){
                                    $.ajax({
                                        url: "/api/v1.2/recommendorder/dealer/" + dealer_id + "/activity",
                                        type: 'get',
                                        success: function(data) {    
                                            _self.popupjumpthumbnail = data.popupjumpthumbnail;
                                        }
                                    });        
                                }
                            };
                            $('#popupJump-form').ajaxSubmit(options); 
                            return false;
                        }  
                    };
                    image.src= data;
                };
                reader.readAsDataURL(f); 
            },
            bannerAble:function(isSure){
                var _self = this;
                $.ajax({
                    url: "/api/v1.2/recommendorder/dealer/" + dealer_id + "/activity",
                    type: 'post',
                    dataType: 'json',
                    data:{
                        enable:isSure,
                        type:"bannerenabled"
                    },
                    success: function(data) {  
                        _self.banner_enabled = isSure;
                        Vue.nextTick(function () {
                            if(isSure === 0){
                                alert('停用活动成功！');
                            }else{
                                alert('启用活动成功！');
                            }
                        });
                        
                    }
                });
            },
            popupAble:function(isSure){
                var _self = this;
                $.ajax({
                    url: "/api/v1.2/recommendorder/dealer/" + dealer_id + "/activity",
                    type: 'post',
                    dataType: 'json',
                    data:{
                        enable:isSure,
                        type:"popupenabled"
                    },
                    success: function(data) {         
                        _self.popup_enabled = isSure;
                        Vue.nextTick(function () {
                            if(isSure === 0){
                                alert('停用活动成功！');
                            }else{
                                alert('启用活动成功！');
                            }
                        });
                        
                    }
                });
            },
            clearBannerImg:function(){
                var _self = this;
                $.ajax({
                    url: "/api/v1.2/recommendorder/dealer/" + dealer_id + "/activity",
                    type: 'post',
                    dataType: 'json',
                    data:{
                        type:"rmbannerimage"
                    },
                    success: function(res) {    
                        $.ajax({
                            url: "/api/v1.2/recommendorder/dealer/" + dealer_id + "/activity",
                            type: 'get',
                            success: function(data) {
                                _self.bannerthumbnail = data.bannerthumbnail;
                            }
                        });
                        Vue.nextTick(function () {
                            alert("图片清除成功");
                        });
                        
                    }
                });
            },
            clearBannerJumpImg:function(){
                var _self = this;
                $.ajax({
                    url: "/api/v1.2/recommendorder/dealer/" + dealer_id + "/activity",
                    type: 'post',
                    dataType: 'json',
                    data:{
                        type:"rmbannerjumpimage"
                    },
                    success: function(res) {    
                        $.ajax({
                            url: "/api/v1.2/recommendorder/dealer/" + dealer_id + "/activity",
                            type: 'get',
                            success: function(data) {
                                _self.bannerjumpthumbnail = data.bannerjumpthumbnail;
                            }
                        });
                        Vue.nextTick(function () {
                            alert("图片清除成功");
                        });
                        
                    }
                });
            },
            clearPopupImg:function(){
                var _self = this;
                $.ajax({
                    url: "/api/v1.2/recommendorder/dealer/" + dealer_id + "/activity",
                    type: 'post',
                    dataType: 'json',
                    data:{
                        type:"rmpopupimage"
                    },
                    success: function(res) {    
                        $.ajax({
                            url: "/api/v1.2/recommendorder/dealer/" + dealer_id + "/activity",
                            type: 'get',
                            success: function(data) {
                                _self.popupthumbnail = data.popupthumbnail;
                            }
                        });
                        Vue.nextTick(function () {
                            alert("图片清除成功");
                        });
                        
                    }
                });
            },
            clearPopupJumpImg:function(){
                var _self = this;
                $.ajax({
                    url: "/api/v1.2/recommendorder/dealer/" + dealer_id + "/activity",
                    type: 'post',
                    dataType: 'json',
                    data:{
                        type:"rmpopupjumpimage"
                    },
                    success: function(res) {    
                        $.ajax({
                            url: "/api/v1.2/recommendorder/dealer/" + dealer_id + "/activity",
                            type: 'get',
                            success: function(data) {
                                _self.popupjumpthumbnail = data.popupjumpthumbnail;
                            }
                        });
                        Vue.nextTick(function () {
                            alert("图片清除成功");
                        });
                        
                    }
                });
            }
        }
    });
    
})(window.cmApp = window.CmApp || {});

