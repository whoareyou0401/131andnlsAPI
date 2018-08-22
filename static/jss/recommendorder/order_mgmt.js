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


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9vcmRlcl9tZ210LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbihjbUFwcCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICB2YXIgZGVhbGVyX2lkID0gTnVtYmVyKHVybC5tYXRjaCgvKGRlYWxlclxcLylcXGQrXFwvLylbMF0uc3BsaXQoJy8nKVsxXSk7XG4gICAgc2V0dXBDU1JGKCk7XG4gICAgXG4gICAgLy8g6K6i5Y2V566h55CGXG4gICAgdmFyIGVuZERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciBzdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciBlbmRUID0gZW5kRGF0ZS5nZXRUaW1lKCk7XG4gICAgdmFyIHN0YXJ0VCA9IGVuZERhdGUuZ2V0VGltZSgpLTYqMjQqNjAqNjAqMTAwMDtcbiAgICBlbmREYXRlLnNldFRpbWUoZW5kVCk7XG4gICAgc3RhcnREYXRlLnNldFRpbWUoc3RhcnRUKTtcbiAgICAkKCcjZGF0ZXBpY2tlcicpLnZhbChzdGFydERhdGUuZ2V0TW9udGgoKSArIDEgKyAnLycgKyBzdGFydERhdGUuZ2V0RGF0ZSgpICsgJy8nICsgc3RhcnREYXRlLmdldEZ1bGxZZWFyKCkpO1xuICAgICQoJyNkYXRlcGlja2VyRW5kJykudmFsKGVuZERhdGUuZ2V0TW9udGgoKSArIDEgKyAnLycgKyBlbmREYXRlLmdldERhdGUoKSArICcvJyArIGVuZERhdGUuZ2V0RnVsbFllYXIoKSk7XG4gICAgdmFyIG9yZGVyU2FsRGF0YTtcbiAgICB2YXIgb3JkZXJTYWxQYWdlcyA9IDE7XG4gICAgdmFyIG9yZGVyU2FsQ3VycmVudFBhZ2UgPSAxO1xuICAgIHZhciBvcmRlclN0YXR1cz0nJztcbiAgICB2YXIgb3JkZXJTdGFydFRpbWU9Jyc7XG4gICAgdmFyIG9yZGVyRW5kVGltZT0nJztcbiAgICB2YXIgc2VhcmNoT3JkZXJLZXk9Jyc7XG4gICAgdmFyIG9yZGVyU2FsSWQ9Jyc7XG4gICAgdmFyIG9yZGVyRGF0YSA9IHt9O1xuICAgIHZhciBzZWFyY2hSZXN1bHRzID0gJyc7XG4gICAgZnVuY3Rpb24gdGltZUZpbHRlcnModGltZSl7XG4gICAgICAgIHZhciB0aW1lQXJyID0gdGltZS5zcGxpdCgnLycpO1xuICAgICAgICB2YXIgdGltZTEgPSB0aW1lQXJyWzJdICsgJy0nICsgdGltZUFyclswXSArICctJyArIHRpbWVBcnJbMV07XG4gICAgICAgIHJldHVybiB0aW1lMTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb3JkZXJEYXRhRnVuKG9yZGVyU2FsSWQsb3JkZXJTdGF0dXMsb3JkZXJTYWxDdXJyZW50UGFnZSl7XG4gICAgICAgIGlmKCQoJyNzZWFyY2gnKS52YWwoKS5sZW5ndGggPj0gMSl7XG4gICAgICAgICAgICBzZWFyY2hSZXN1bHRzID0gJCgnI3NlYXJjaCcpLnZhbCgpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHNlYXJjaFJlc3VsdHMgPSAnJztcbiAgICAgICAgfVxuICAgICAgICBpZigkKCcjZGF0ZXBpY2tlcicpLnZhbCgpIT09ICcnICYmICQoJyNkYXRlcGlja2VyRW5kJykudmFsKCkgIT09ICcnKXtcbiAgICAgICAgICAgIG9yZGVyU3RhcnRUaW1lID0gdGltZUZpbHRlcnMoJCgnI2RhdGVwaWNrZXInKS52YWwoKSk7XG4gICAgICAgICAgICBvcmRlckVuZFRpbWUgPSB0aW1lRmlsdGVycygkKCcjZGF0ZXBpY2tlckVuZCcpLnZhbCgpKTtcbiAgICAgICAgICAgIG9yZGVyRGF0YSA9IHtcbiAgICAgICAgICAgICAgICBwZXJwYWdlOjIwLFxuICAgICAgICAgICAgICAgIHBhZ2U6b3JkZXJTYWxDdXJyZW50UGFnZSxcbiAgICAgICAgICAgICAgICBzYWxlc21hbjpvcmRlclNhbElkLFxuICAgICAgICAgICAgICAgIHN0YXR1czpvcmRlclN0YXR1cyxcbiAgICAgICAgICAgICAgICBzdGFydDpvcmRlclN0YXJ0VGltZSxcbiAgICAgICAgICAgICAgICBlbmQ6b3JkZXJFbmRUaW1lLFxuICAgICAgICAgICAgICAgIGtleTpzZWFyY2hSZXN1bHRzXG4gICAgICAgICAgICB9XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgb3JkZXJEYXRhID0ge1xuICAgICAgICAgICAgICAgIHBlcnBhZ2U6MjAsXG4gICAgICAgICAgICAgICAgcGFnZTpvcmRlclNhbEN1cnJlbnRQYWdlLFxuICAgICAgICAgICAgICAgIHNhbGVzbWFuOm9yZGVyU2FsSWQsXG4gICAgICAgICAgICAgICAgc3RhdHVzOm9yZGVyU3RhdHVzLFxuICAgICAgICAgICAgICAgIGtleTpzZWFyY2hSZXN1bHRzXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOicvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvZGVhbGVyLycgKyBkZWFsZXJfaWQgKyAnL3NhbGVzbWVuJyxcbiAgICAgICAgdHlwZTonZ2V0JyxcbiAgICAgICAgZGF0YVR5cGU6J2pzb24nLFxuICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgdmFyIHNhbF9pdGVtcyA9IGRhdGEuc2FsZXNtZW47XG4gICAgICAgICAgICBmb3IodmFyIHNhbF9pdGVtIGluIHNhbF9pdGVtcyl7XG4gICAgICAgICAgICAgICAgdmFyIHNhbF9vcHRpb24gPSBcIjxvcHRpb24gdmFsdWU9XCIgKyBzYWxfaXRlbXNbc2FsX2l0ZW1dLmlkICsgXCI+XCIgKyBzYWxfaXRlbXNbc2FsX2l0ZW1dLm5hbWUgKyBcIjwvb3B0aW9uPlwiO1xuICAgICAgICAgICAgICAgICQoJyNzZWxlY3RTYWwnKS5hcHBlbmQoc2FsX29wdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6Jy9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9kZWFsZXIvJyArIGRlYWxlcl9pZCArICcvc3Vib3JkZXJzJyxcbiAgICAgICAgdHlwZTonZ2V0JyxcbiAgICAgICAgZGF0YVR5cGU6J2pzb24nLFxuICAgICAgICBkYXRhOntcbiAgICAgICAgICAgIHBlcnBhZ2U6MjAsXG4gICAgICAgICAgICBwYWdlOm9yZGVyU2FsQ3VycmVudFBhZ2UsXG4gICAgICAgICAgICBzYWxlc21hbjpvcmRlclNhbElkLFxuICAgICAgICAgICAgc3RhdHVzOm9yZGVyU3RhdHVzLFxuICAgICAgICAgICAga2V5OnNlYXJjaFJlc3VsdHNcbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczpmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIG9yZGVyU2FsUGFnZXMgPSBkYXRhLnBhZ2VzO1xuICAgICAgICAgICAgb3JkZXJfc2FsX3BhZ2kob3JkZXJTYWxQYWdlcyk7XG4gICAgICAgICAgICBvcmRlclNhbFRhYmxlKG9yZGVyRGF0YSk7XG4gICAgICAgICAgICBvcmRlclNhbENoYW5nZVN0YXR1c0Z1bigpO1xuICAgICAgICAgICAgZGV0YWlsQ2xpY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICQoJyNzZWxlY3RTYWwnKS5vbignY2hhbmdlJyxmdW5jdGlvbigpe1xuICAgICAgICAkKCcjdGFibGUnKS5lbXB0eSgpO1xuICAgICAgICAkKCcub3JkZXItc2FsLXBhZ2knKS5lbXB0eSgpO1xuICAgICAgICBvcmRlclNhbElkID0gJCgnI3NlbGVjdFNhbCcpLnZhbCgpO1xuICAgICAgICBvcmRlclN0YXR1cyA9ICQoJyNzZWxlY3QnKS52YWwoKTtcbiAgICAgICAgb3JkZXJTYWxDdXJyZW50UGFnZSA9IDE7XG4gICAgICAgIG9yZGVyRGF0YUZ1bihvcmRlclNhbElkLG9yZGVyU3RhdHVzLG9yZGVyU2FsQ3VycmVudFBhZ2UpO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOicvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvZGVhbGVyLycgKyBkZWFsZXJfaWQgKyAnL3N1Ym9yZGVycycsXG4gICAgICAgICAgICB0eXBlOidnZXQnLFxuICAgICAgICAgICAgZGF0YVR5cGU6J2pzb24nLFxuICAgICAgICAgICAgZGF0YTpvcmRlckRhdGEsXG4gICAgICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIG9yZGVyU2FsUGFnZXMgPSBkYXRhLnBhZ2VzO1xuICAgICAgICAgICAgICAgIG9yZGVyX3NhbF9wYWdpKG9yZGVyU2FsUGFnZXMpO1xuICAgICAgICAgICAgICAgIG9yZGVyU2FsVGFibGUob3JkZXJEYXRhKTtcbiAgICAgICAgICAgICAgICBvcmRlclNhbENoYW5nZVN0YXR1c0Z1bigpO1xuICAgICAgICAgICAgICAgIGRldGFpbENsaWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJyNzZWxlY3QnKS5vbignY2hhbmdlJyxmdW5jdGlvbigpe1xuICAgICAgICAkKCcjdGFibGUnKS5lbXB0eSgpO1xuICAgICAgICAkKCcub3JkZXItc2FsLXBhZ2knKS5lbXB0eSgpO1xuICAgICAgICBvcmRlclNhbElkID0gJCgnI3NlbGVjdFNhbCcpLnZhbCgpO1xuICAgICAgICBvcmRlclN0YXR1cyA9ICQoJyNzZWxlY3QnKS52YWwoKTtcbiAgICAgICAgb3JkZXJTYWxDdXJyZW50UGFnZSA9IDE7XG4gICAgICAgIG9yZGVyRGF0YUZ1bihvcmRlclNhbElkLG9yZGVyU3RhdHVzLG9yZGVyU2FsQ3VycmVudFBhZ2UpO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOicvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvZGVhbGVyLycgKyBkZWFsZXJfaWQgKyAnL3N1Ym9yZGVycycsXG4gICAgICAgICAgICB0eXBlOidnZXQnLFxuICAgICAgICAgICAgZGF0YVR5cGU6J2pzb24nLFxuICAgICAgICAgICAgZGF0YTpvcmRlckRhdGEsXG4gICAgICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIG9yZGVyU2FsUGFnZXMgPSBkYXRhLnBhZ2VzO1xuICAgICAgICAgICAgICAgIG9yZGVyX3NhbF9wYWdpKG9yZGVyU2FsUGFnZXMpO1xuICAgICAgICAgICAgICAgIG9yZGVyU2FsVGFibGUob3JkZXJEYXRhKTtcbiAgICAgICAgICAgICAgICBvcmRlclNhbENoYW5nZVN0YXR1c0Z1bigpO1xuICAgICAgICAgICAgICAgIGRldGFpbENsaWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJyNkYXRlcGlja2VyLCNkYXRlcGlja2VyRW5kJykub24oJ2NoYW5nZScsZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnI3RhYmxlJykuZW1wdHkoKTtcbiAgICAgICAgJCgnLm9yZGVyLXNhbC1wYWdpJykuZW1wdHkoKTtcbiAgICAgICAgb3JkZXJTYWxJZCA9ICQoJyNzZWxlY3RTYWwnKS52YWwoKTtcbiAgICAgICAgb3JkZXJTdGF0dXMgPSAkKCcjc2VsZWN0JykudmFsKCk7XG4gICAgICAgIG9yZGVyU2FsQ3VycmVudFBhZ2UgPSAxO1xuICAgICAgICBvcmRlckRhdGFGdW4ob3JkZXJTYWxJZCxvcmRlclN0YXR1cyxvcmRlclNhbEN1cnJlbnRQYWdlKTtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDonL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2RlYWxlci8nICsgZGVhbGVyX2lkICsgJy9zdWJvcmRlcnMnLFxuICAgICAgICAgICAgdHlwZTonZ2V0JyxcbiAgICAgICAgICAgIGRhdGFUeXBlOidqc29uJyxcbiAgICAgICAgICAgIGRhdGE6b3JkZXJEYXRhLFxuICAgICAgICAgICAgc3VjY2VzczpmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICBvcmRlclNhbFBhZ2VzID0gZGF0YS5wYWdlcztcbiAgICAgICAgICAgICAgICBvcmRlcl9zYWxfcGFnaShvcmRlclNhbFBhZ2VzKTtcbiAgICAgICAgICAgICAgICBvcmRlclNhbFRhYmxlKG9yZGVyRGF0YSk7XG4gICAgICAgICAgICAgICAgb3JkZXJTYWxDaGFuZ2VTdGF0dXNGdW4oKTtcbiAgICAgICAgICAgICAgICBkZXRhaWxDbGljaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkKCcjc2VhcmNoJykuYmluZCgnaW5wdXQgcHJvcGVydHljaGFuZ2UnLGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBzZWFyY2hfcmVzdWx0cyA9ICQoJyNzZWFyY2gnKS52YWwoKTtcbiAgICAgICAgdmFyIGxlbmd0aCA9IHNlYXJjaF9yZXN1bHRzLmxlbmd0aDtcbiAgICAgICAgb3JkZXJTYWxDdXJyZW50UGFnZSA9IDE7XG4gICAgICAgIG9yZGVyRGF0YUZ1bihvcmRlclNhbElkLG9yZGVyU3RhdHVzLG9yZGVyU2FsQ3VycmVudFBhZ2UpO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOicvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvZGVhbGVyLycgKyBkZWFsZXJfaWQgKyAnL3N1Ym9yZGVycycsXG4gICAgICAgICAgICB0eXBlOidnZXQnLFxuICAgICAgICAgICAgZGF0YVR5cGU6J2pzb24nLFxuICAgICAgICAgICAgZGF0YTpvcmRlckRhdGEsXG4gICAgICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIG9yZGVyU2FsUGFnZXMgPSBkYXRhLnBhZ2VzO1xuICAgICAgICAgICAgICAgIG9yZGVyX3NhbF9wYWdpKG9yZGVyU2FsUGFnZXMpO1xuICAgICAgICAgICAgICAgIG9yZGVyU2FsVGFibGUob3JkZXJEYXRhKTtcbiAgICAgICAgICAgICAgICBvcmRlclNhbENoYW5nZVN0YXR1c0Z1bigpO1xuICAgICAgICAgICAgICAgIGRldGFpbENsaWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICAgICAvL+ivpuaDheeahOeCueWHu+S6i+S7tlxuICAgIGZ1bmN0aW9uIGRldGFpbENsaWNrKCl7XG4gICAgICAgICQoJyN0YWJsZScpLm9mZignY2xpY2snKS5vbignY2xpY2snLCd0ciAjZGV0YWlsJyxmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHN1Ym9yZGVySWQgPSAkKHRoaXMpLmZpbmQoJy5zdWJvcmRlcklkJykuaHRtbCgpO1xuICAgICAgICAgICAgdmFyIGN1c3RvbWVyTmFtZSA9ICQodGhpcykucGFyZW50KCkuZmluZCgnLmN1c3RvbWVyTmFtZScpLmh0bWwoKTtcbiAgICAgICAgICAgIHZhciBjdXN0b21lclBob25lID0kKHRoaXMpLnBhcmVudCgpLmZpbmQoJy5waG9uZScpLmh0bWwoKTtcbiAgICAgICAgICAgICQoJy5tb2RlbCcpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ2Rpc3BsYXknOidibG9jaydcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI25vJykub2ZmKCdjbGljaycpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgJCgnLm1vZGVsJykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgJ2Rpc3BsYXknOidub25lJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJy5jdXN0b21lcicpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XG4gICAgICAgICAgICB2YXIgY3VzdG9tZXIgPSBcIjxkaXYgY2xhc3M9J2ZvdXIgd2lkZSBjb2x1bW4nIHN0eWxlPSdiYWNrZ3JvdW5kOiNmZmY7Jz48Yj7lrqLmiLflkI3np7A6IFwiK2N1c3RvbWVyTmFtZStcIjwvYj48L2Rpdj48ZGl2IGNsYXNzPSdmb3VyIHdpZGUgY29sdW1uJyBzdHlsZT0nYmFja2dyb3VuZDojZmZmOyc+PGI+55S16K+dOiBcIitjdXN0b21lclBob25lK1wiPC9iPjwvZGl2PlwiO1xuICAgICAgICAgICAgJCgnLmN1c3RvbWVyJykuYXBwZW5kKGN1c3RvbWVyKTtcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4xL3JlY29tbWVuZG9yZGVyL2RlYWxlci9cIitkZWFsZXJfaWQrXCIvc3Vib3JkZXIvXCIrc3Vib3JkZXJJZCtcIi9cIixcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGF0eXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6ZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHJlcy5kYXRhLnN0YXR1cyA9PT0gMSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2J1dHRvbicpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNidXR0b24nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVDb250ZW50KHJlcy5kYXRhLm9yZGVyaXRlbV9zZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlQ2xpY2socmVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlQ2xpY2socmVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v6L+b5YWl6K+m5oOF6aG16Z2i54K55Ye75a+85Ye65pe26Kem5Y+R55qE5LqL5Lu2XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjZGV0YWlsRXhwb3J0Jykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZigkLmluQXJyYXkoZGVhbGVyX2lkLCBbNSwgMTAsIDExLCAxMl0pICE9IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIrZGVhbGVyX2lkK1wiL3N1Ym9yZGVyL1wiK3N1Ym9yZGVySWQrXCI/ZmlsZXNhdmU9MVwiO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvYXBpL3YxLjEvcmVjb21tZW5kb3JkZXIvZGVhbGVyL1wiK2RlYWxlcl9pZCtcIi9zdWJvcmRlci9cIitzdWJvcmRlcklkK1wiLz9maWxlc2F2ZT0xXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgICAgIC8v5Yqo5oCB5Yib5bu65by55qGG5Ye65p2l55qE5YaF5a65XG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbnRlbnQoZGF0YSl7XG4gICAgICAgICAgICAkKCcjbmV3VHInKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xuICAgICAgICAgICAgZm9yKHZhciBpIGluIGRhdGEpe1xuICAgICAgICAgICAgICAgIHZhciBuZXdUcj1cIjx0cj48dGQ+XCIrZGF0YVtpXS5pdGVtX25hbWUrXCI8L3RkPjx0ZD5cIitkYXRhW2ldLm9yaWdpbmFsX3VuaXRfcHJpY2UrXCI8L3RkPjx0ZCBmb29kX2lkPVwiK2krXCI+XCIrZGF0YVtpXS51bml0X3ByaWNlK1wiPC90ZD48dGQ+XCIrZGF0YVtpXS5udW0rXCI8L3RkPjx0cj5cIjtcbiAgICAgICAgICAgICAgICAkKCcjbmV3VHInKS5hcHBlbmQobmV3VHIpO1xuICAgICAgICAgICAgICAgIGlmKGRhdGFbaV0ub3JpZ2luYWxfdW5pdF9wcmljZSAhPT0gZGF0YVtpXS51bml0X3ByaWNlKXtcbiAgICAgICAgICAgICAgICAgICAgJChcInRkW2Zvb2RfaWQ9J1wiICsgaSArIFwiJ11cIikuY3NzKCdjb2xvcicsJyNmZjRhMGMnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy/ngrnlh7vlpITnkIbmjInpkq7op6blj5HnmoTmmK/kuovku7ZcblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVDbGljayhyZXMpe1xuICAgICAgICAgICAgJCgnI2hhbmRsZScpLm9mZignY2xpY2snKS5vbignY2xpY2snLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgJCgnI2hhbmRsZScpLmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOlwiL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2RlYWxlci9cIitkZWFsZXJfaWQrXCIvc3Vib3JkZXIvXCIrcmVzLmRhdGEuaWQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwYXRjaCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGF0eXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdGF0dXNcIjoyXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6ZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCforqLljZXlpITnkIbmiJDlip8nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNoYW5kbGUnKS5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcubW9kZWwnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlclNhbFRhYmxlKG9yZGVyRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn6K6i5Y2V5aSE55CG5aSx6LSlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjaGFuZGxlJykucmVtb3ZlQXR0cihcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLm1vZGVsJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJTYWxUYWJsZShvcmRlckRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy/ngrnlh7vlhbPpl63mjInpkq7ml7blgJnop6blj5HnmoRcbiAgICAgICAgZnVuY3Rpb24gY2xvc2VDbGljayhyZXMpe1xuICAgICAgICAgICAgJCgnI2Nsb3NlJykub2ZmKCdjbGljaycpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOlwiL2FwaS92MS4xL3JlY29tbWVuZG9yZGVyL2RlYWxlci9cIitkZWFsZXJfaWQrXCIvc3Vib3JkZXIvXCIrcmVzLmRhdGEuaWQrXCIvXCIsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwYXRjaCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGF0eXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdGF0dXNcIjozXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6ZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCforqLljZXlhbPpl63miJDlip8nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyU2FsVGFibGUob3JkZXJEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICBmdW5jdGlvbiBvcmRlcl9zYWxfcGFnaShkYXRhKXtcbiAgICAgICAgdmFyIHByZVBhZ2UgPSBcIjxhIGhyZWY9J2phdmFzY3JpcHQ6JyBjbGFzcz0naXRlbSBwcmUtcGFnZScgc2lnbj0ncHJlLXBhZ2UnIGlkPSdvcmRlclNhbC1wcmUtcGFnZSc+5LiK5LiA6aG1PC9hPlwiO1xuICAgICAgICB2YXIgbmV4dFBhZ2UgPSBcIjxhIGhyZWY9J2phdmFzY3JpcHQ6JyBjbGFzcz0naXRlbSBuZXh0LXBhZ2UnIHNpZ249J25leHQtcGFnZScgaWQ9J29yZGVyU2FsLW5leHQtcGFnZSc+5LiL5LiA6aG1PC9hPlwiO1xuICAgICAgICB2YXIgc2luZ2xlUGFnZSA9IFwiXCI7XG4gICAgICAgIGZvciAodmFyIGsgPSAxOyBrIDw9IGRhdGE7IGsrKykge1xuICAgICAgICAgICAgaWYgKGsgPD0gNikge1xuICAgICAgICAgICAgICAgIHNpbmdsZVBhZ2UgKz0gXCI8YSBocmVmPSdqYXZhc2NyaXB0OicgY2xhc3M9J2l0ZW0gcGFnaScgc2lnbj0ncGFnaSc+XCIrIGsgK1wiPC9hPlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBhbGxQYWdlID0gcHJlUGFnZSArIHNpbmdsZVBhZ2UgKyBuZXh0UGFnZTtcbiAgICAgICAgJCgnLm9yZGVyLXNhbC1wYWdpJykuZW1wdHkoKTtcbiAgICAgICAgJCgnLm9yZGVyLXNhbC1wYWdpJykuYXBwZW5kKGFsbFBhZ2UpO1xuICAgICAgICAkKCcub3JkZXItc2FsLXBhZ2kgLnBhZ2k6Zmlyc3QnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9yZGVyU2FsVGFibGUob3JkZXJEYXRhKXtcbiAgICAgICAgJCgnI3RhYmxlJykuZW1wdHkoKTtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDonL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2RlYWxlci8nICsgZGVhbGVyX2lkICsgJy9zdWJvcmRlcnMnLFxuICAgICAgICAgICAgdHlwZTonZ2V0JyxcbiAgICAgICAgICAgIGRhdGFUeXBlOidqc29uJyxcbiAgICAgICAgICAgIGRhdGE6b3JkZXJEYXRhLFxuICAgICAgICAgICAgc3VjY2VzczpmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICB2YXIgb3JkZXJTYWxJdGVtcyA9IGRhdGEuc3Vib3JkZXJzO1xuICAgICAgICAgICAgICAgIGZvcih2YXIgb3JkZXJTYWxJdGVtIGluIG9yZGVyU2FsSXRlbXMpe1xuICAgICAgICAgICAgICAgICAgICBpZihvcmRlclNhbEl0ZW1zW29yZGVyU2FsSXRlbV0uY3VzdG9tZXJfYWRkcmVzcyA9PT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlclNhbEl0ZW1zW29yZGVyU2FsSXRlbV0uY3VzdG9tZXJfYWRkcmVzcyA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmKG9yZGVyU2FsSXRlbXNbb3JkZXJTYWxJdGVtXS5wb3N0c2NyaXB0ID09PSBudWxsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyU2FsSXRlbXNbb3JkZXJTYWxJdGVtXS5wb3N0c2NyaXB0ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYob3JkZXJTYWxJdGVtc1tvcmRlclNhbEl0ZW1dLnNhbGVzbWFuID09PSBudWxsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyU2FsSXRlbXNbb3JkZXJTYWxJdGVtXS5zYWxlc21hbiA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdWJPcmRlclNhbFRyID0gXCI8dHI+PHRkPlwiK29yZGVyU2FsSXRlbXNbb3JkZXJTYWxJdGVtXS5zdWJvcmRlcl9pZCArIFwiPC90ZD48dGQ+PHNwYW4gY2xhc3M9J2N1c3RvbWVyTmFtZSc+XCIrb3JkZXJTYWxJdGVtc1tvcmRlclNhbEl0ZW1dLmN1c3RvbWVyICtcbiAgICAgICAgICAgICAgICAgICAgXCI8L3NwYW4+PGkgY2xhc3M9J3Bob25lJz5cIitvcmRlclNhbEl0ZW1zW29yZGVyU2FsSXRlbV0ucGhvbmUgKyBcIjwvaT48L3RkPjx0ZD5cIitvcmRlclNhbEl0ZW1zW29yZGVyU2FsSXRlbV0uc2FsZXNtYW4gKyBcIjwvdGQ+PHRkPlwiK29yZGVyU2FsSXRlbXNbb3JkZXJTYWxJdGVtXS5vcmRlcl90aW1lK1wiPC90ZD48dGQ+XCIrb3JkZXJTYWxJdGVtc1tvcmRlclNhbEl0ZW1dLmN1c3RvbWVyX2FkZHJlc3MrXG4gICAgICAgICAgICAgICAgICAgIFwiPC90ZD48dGQ+XCIrb3JkZXJTYWxJdGVtc1tvcmRlclNhbEl0ZW1dLnBvc3RzY3JpcHQrXCI8L3RkPjx0ZD5cIitvcmRlclNhbEl0ZW1zW29yZGVyU2FsSXRlbV0uc3RhdHVzICsgXG4gICAgICAgICAgICAgICAgICAgIFwiPC90ZD48dGQgaWQ9J2RldGFpbCc+PGE+XCIrJ+ivpuaDhScrXCI8L2E+PGkgY2xhc3M9J3N1Ym9yZGVySWQnIHN0eWxlPSdjb2xvcjojZmZmOyc+XCIrb3JkZXJTYWxJdGVtc1tvcmRlclNhbEl0ZW1dLnN1Ym9yZGVyX2lkK1wiPC9pPjwvdGQ+PC90cj5cIjtcbiAgICAgICAgICAgICAgICAgICAgJCgnI3RhYmxlJykuYXBwZW5kKHN1Yk9yZGVyU2FsVHIpO1xuICAgICAgICAgICAgICAgIH0gICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb3JkZXJTYWxDaGFuZ2VTdGF0dXNGdW4oKSB7ICAgICAgICBcbiAgICAgICAgLy8g5q+P5LiA6aG1XG4gICAgICAgICQoJy5vcmRlci1zYWwtcGFnaScpLm9mZignY2xpY2snKS5vbignY2xpY2snLCcucGFnaScsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG9yZGVyU2FsQ3VycmVudFBhZ2UgPSAkKHRoaXMpLmh0bWwoKTtcbiAgICAgICAgICAgIG9yZGVyU2FsSWQgPSAkKCcjc2VsZWN0U2FsJykudmFsKCk7XG4gICAgICAgICAgICBvcmRlclN0YXR1cyA9ICQoJyNzZWxlY3QnKS52YWwoKTtcbiAgICAgICAgICAgIG9yZGVyRGF0YUZ1bihvcmRlclNhbElkLG9yZGVyU3RhdHVzLG9yZGVyU2FsQ3VycmVudFBhZ2UpO1xuICAgICAgICAgICAgb3JkZXJTYWxUYWJsZShvcmRlckRhdGEpO1xuICAgICAgICAgICAgb3JkZXJTYWxDdXJyZW50UGFnZVN0YXR1cygpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyDlt6blj7Pnv7vpobVcbiAgICAgICAgJCgnLm9yZGVyLXNhbC1wYWdpICNvcmRlclNhbC1wcmUtcGFnZScpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBvcmRlclNhbEN1cnJlbnRQYWdlID0gb3JkZXJTYWxDdXJyZW50UGFnZSAtIDE7XG4gICAgICAgICAgICBpZiAob3JkZXJTYWxDdXJyZW50UGFnZSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgb3JkZXJTYWxDdXJyZW50UGFnZSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcmRlclNhbElkID0gJCgnI3NlbGVjdFNhbCcpLnZhbCgpO1xuICAgICAgICAgICAgb3JkZXJTdGF0dXMgPSAkKCcjc2VsZWN0JykudmFsKCk7XG4gICAgICAgICAgICBvcmRlckRhdGFGdW4ob3JkZXJTYWxJZCxvcmRlclN0YXR1cyxvcmRlclNhbEN1cnJlbnRQYWdlKTtcbiAgICAgICAgICAgIG9yZGVyU2FsVGFibGUob3JkZXJEYXRhKTtcbiAgICAgICAgICAgIG9yZGVyU2FsQ3VycmVudFBhZ2VTdGF0dXMoKTtcblxuICAgICAgICB9KTtcbiAgICAgICAgJCgnLm9yZGVyLXNhbC1wYWdpICNvcmRlclNhbC1uZXh0LXBhZ2UnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgb3JkZXJTYWxDdXJyZW50UGFnZSA9IG9yZGVyU2FsQ3VycmVudFBhZ2UgLTAgKyAxO1xuICAgICAgICAgICAgaWYgKG9yZGVyU2FsQ3VycmVudFBhZ2UgPj0gb3JkZXJTYWxQYWdlcykge1xuICAgICAgICAgICAgICAgIG9yZGVyU2FsQ3VycmVudFBhZ2UgPSBvcmRlclNhbFBhZ2VzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3JkZXJTYWxJZCA9ICQoJyNzZWxlY3RTYWwnKS52YWwoKTtcbiAgICAgICAgICAgIG9yZGVyU3RhdHVzID0gJCgnI3NlbGVjdCcpLnZhbCgpO1xuICAgICAgICAgICAgb3JkZXJEYXRhRnVuKG9yZGVyU2FsSWQsb3JkZXJTdGF0dXMsb3JkZXJTYWxDdXJyZW50UGFnZSk7XG4gICAgICAgICAgICBvcmRlclNhbFRhYmxlKG9yZGVyRGF0YSk7XG4gICAgICAgICAgICBvcmRlclNhbEN1cnJlbnRQYWdlU3RhdHVzKCk7XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb3JkZXJTYWxDdXJyZW50UGFnZVN0YXR1cygpIHtcbiAgICAgICAgJCgnLm9yZGVyLXNhbC1wYWdpIC5wYWdpJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYgKCQodGhpcykuaHRtbCgpID09IG9yZGVyU2FsQ3VycmVudFBhZ2UpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcmRlclNhbEN1cnJlbnRQYWdlID49IDQgJiYgb3JkZXJTYWxQYWdlcyA+IDYpIHtcbiAgICAgICAgICAgICAgICBpZiAob3JkZXJTYWxDdXJyZW50UGFnZSA+PSBvcmRlclNhbFBhZ2VzIC0gMikge1xuICAgICAgICAgICAgICAgICAgICAkKCcub3JkZXItc2FsLXBhZ2kgLnBhZ2knKS5lYWNoKGZ1bmN0aW9uKHBhZ2lfaW5kZXgscGFnaV9lbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBub3dQYWdlID0gb3JkZXJTYWxQYWdlcyAtIDUgKyBwYWdpX2luZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgJChwYWdpX2VsZSkuaHRtbChub3dQYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICQoJy5vcmRlci1zYWwtcGFnaSAucGFnaScpLmVhY2goZnVuY3Rpb24ocGFnaV9pbmRleCxwYWdpX2VsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5vd1BhZ2VPdGhlciA9IG9yZGVyU2FsQ3VycmVudFBhZ2UgLSAzICsgcGFnaV9pbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgICQocGFnaV9lbGUpLmh0bWwobm93UGFnZU90aGVyKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9ZWxzZSBpZihvcmRlclNhbEN1cnJlbnRQYWdlIDwgNCAmJiBvcmRlclNhbFBhZ2VzID4gNil7XG4gICAgICAgICAgICAgICAgJCgnLm9yZGVyLXNhbC1wYWdpIC5wYWdpJykuZWFjaChmdW5jdGlvbihwYWdpX2luZGV4LHBhZ2lfZWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBub3dQYWdlcHJlID0gMSAtIDAgKyBwYWdpX2luZGV4O1xuICAgICAgICAgICAgICAgICAgICAkKHBhZ2lfZWxlKS5odG1sKG5vd1BhZ2VwcmUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdzcyhkYXRhKXtcbiAgICAgICAgdmFyIHdzO1xuICAgICAgICB2YXIgdG1wVGFnID0gJ2h0dHBzOicgPT0gZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2wgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIGlmKHRtcFRhZyl7XG4gICAgICAgICAgICB3cyA9IG5ldyBXZWJTb2NrZXQoXCJ3c3M6Ly9cIiArIHdpbmRvdy5sb2NhdGlvbi5ob3N0ICsgXCIvbWVzc2FnZVwiKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB3cyA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL1wiICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyBcIi9tZXNzYWdlXCIpO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgd3Mub25vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB3cy5zZW5kKEpTT04uc3RyaW5naWZ5KHtcInNlc3Npb25faWRcIjogZGF0YS5zZXNzaW9uX2lkfSkpO1xuICAgICAgICB9O1xuICAgICAgICB3cy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmKEpTT04ucGFyc2UoZXZ0LmRhdGEpLnR5cGUgPT0gJ25ldyBvcmRlcicpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXVkaW8gPSBuZXcgQXVkaW8oXCIvL3R0cy5iYWlkdS5jb20vdGV4dDJhdWRpbz9sYW49emgmaWU9VVRGLTgmc3BkPTYmdGV4dD3mgqjmnInmlrDnmoTorqLljZXvvIzor7flj4rml7blpITnkIZcIik7XG4gICAgICAgICAgICAgICAgICAgIGF1ZGlvLnBsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJTYWxUYWJsZShvcmRlckRhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihKU09OLnBhcnNlKGV2dC5kYXRhKS50eXBlID09ICdhcHBseS1kZWFsZXInKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF1ZGlvID0gbmV3IEF1ZGlvKFwiLy90dHMuYmFpZHUuY29tL3RleHQyYXVkaW8/bGFuPXpoJmllPVVURi04JnNwZD02JnRleHQ95oKo5pyJ5paw55qE572R6LSt5byA6YCa55Sz6K+377yM6K+35Y+K5pe25aSE55CGXCIpO1xuICAgICAgICAgICAgICAgICAgICBhdWRpby5wbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIG9yZGVyU2FsVGFibGUob3JkZXJEYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB3cy5vbmNsb3NlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB3c3MoZGF0YSk7XG4gICAgICAgICAgICB9LDIwMDApO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IFwiL2FwaS92MS4xL3JlY29tbWVuZG9yZGVyL3Nlc3Npb24taWRcIixcbiAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgd3NzKGRhdGEpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvL+eCueWHu+mAgOWHuuezu+e7n+inpuWPkeeahOS6i+S7tlxuICAgICQoJyNleGl0Jykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9XCIvbG9naW5cIjtcbiAgICB9KTtcbiAgICAvL+eCueWHu+iuouWNleeuoeeQhueahOaXtuWAmeinpuWPkeS6i+S7tlxuICAgICQoJyNtYW5hZ2UnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJyxmdW5jdGlvbigpe1xuICAgICAgICAkKCcubWFuYWdlbWVudF9jb24nKS5oaWRlKCk7XG4gICAgICAgICQoJyNjb250ZW50cScpLmNzcyh7XG4gICAgICAgICAgICAnZGlzcGxheSc6J2Jsb2NrJ1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAvL+W9k+eCueWHu+e7j+mUgOWVhuS/oeaBr+eahOaXtuWAmeinpuWPkeeahOS6i+S7tlxuICAgICQoJyNkZWxlYXJfbWFuYWdlJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLm1hbmFnZW1lbnRfY29uJykuaGlkZSgpO1xuICAgICAgICAkKCcuZGVsZWFyX21hbmFnZScpLmNzcyh7XG4gICAgICAgICAgICAnZGlzcGxheSc6J2Jsb2NrJ1xuICAgICAgICB9KTtcbiAgICAgICAgZnVuY3Rpb24gZGVhbGVyTWFuYWdlbWVudCgpe1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6XCIvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvZGVhbGVyL1wiK2RlYWxlcl9pZCxcbiAgICAgICAgICAgICAgICB0eXBlOidnZXQnLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOidqc29uJyxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICBpZihkYXRhLm9yZGVyX2FibGU9PT10cnVlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNzZWxlY3QgaW5wdXQnKS5wcm9wKCdjaGVja2VkJywnY2hlY2tlZCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmKGRhdGEucHJpY2VfYWRqdXN0PT09dHJ1ZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjY2hhbmdlLXByaWNlJykuY2hlY2tib3goJ3NldCBjaGVja2VkJyk7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2NoYW5nZS1wcmljZScpLmNoZWNrYm94KCdzZXQgdW5jaGVja2VkJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJCgnI3RpbWUtZnJvbScpLnZhbChkYXRhLmJ1c19ocl9mcm9tKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI3RpbWUtdG8nKS52YWwoZGF0YS5idXNfaHJfdG8pO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaW5pdGlhbC1wcmljZScpLnZhbChkYXRhLmluaXRpYWxfcHJpY2UpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZGVhbGVyTWFuYWdlbWVudCgpO1xuICAgICAgICAkKCcjc3VibWl0Jykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOlwiL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2RlYWxlci9cIitkZWFsZXJfaWQsXG4gICAgICAgICAgICAgICAgdHlwZToncGF0Y2gnLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOidqc29uJyxcbiAgICAgICAgICAgICAgICBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgXCJidXNfaHJfdG9cIjogJCgnI3RpbWUtdG8nKS52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgXCJidXNfaHJfZnJvbVwiOiAkKCcjdGltZS1mcm9tJykudmFsKCksXG4gICAgICAgICAgICAgICAgICAgIFwiaW5pdGlhbF9wcmljZVwiOiAkKCcjaW5pdGlhbC1wcmljZScpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICBcIm9yZGVyX2FibGVcIjokKCcjc2VsZWN0IGlucHV0JykucHJvcCgnY2hlY2tlZCcpLFxuICAgICAgICAgICAgICAgICAgICBcInByaWNlX2FkanVzdFwiOiQoJyNjaGFuZ2UtcHJpY2UnKS5jaGVja2JveCgnaXMgY2hlY2tlZCcpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICBkZWFsZXJNYW5hZ2VtZW50KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIC8v54K55Ye75a6i5oi3566h55CG5Lit55qE5p2D6ZmQ566h55CG6Kem5Y+R55qE5LqL5Lu2XG4gICAgJCgnLnByaXZpbGVnZV9tYW5hZ2VtZW50Jykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9XCIvcmVjb21tZW5kb3JkZXIvZGVhbGVyL2Fzc2lnbi11YWNcIjtcbiAgICB9KTtcbiAgICAvLyDmgLvpobXmlbBcbiAgICB2YXIgY3VzX3BhZ2VzID0gMDtcbiAgICB2YXIgc2FsX3BhZ2VzID0gMDtcbiAgICAvLyDlvZPliY3pobXmlbBcbiAgICB2YXIgY3VzX2N1cnJlbnRfcGFnZSA9IDE7XG4gICAgdmFyIHNhbF9jdXJyZW50X3BhZ2UgPSAxO1xuICAgIC8v5a6i5oi3SURcbiAgICB2YXIgY3VzdG9tZXJfaWQ7XG4gICAgdmFyIGN1c1NlYXJjaF9yZXN1bHRzID0gJyc7XG4gICAgdmFyIGludml0ZV9hY2NvdW50X2FyciA9IFtdO1xuICAgIC8v5Lia5Yqh5ZGYSURcbiAgICB2YXIgc2FsZXNtYW5faWQ7XG4gICAgLy/pnIDopoHliKDpmaTnmoTlrqLmiLdJROaVsOe7hFxuICAgIHZhciBkZWxldGVfY3VzdG9tZXJfYXJyID0gW107XG4gICAgLy/pnIDopoHliKDpmaTnmoTkuJrliqHlkZhJROaVsOe7hFxuICAgIHZhciBkZWxldGVfc2FsZXNtYW5fYXJyID0gW107XG4gICAgLy8g5piv5ZCm5byA6YCa572R6LSt5Y+Y6YePXG4gICAgdmFyIGN1c3RvbWVyX3RyID0gJyc7XG4gICAgdmFyIGN1c3RvbWVyX290aGVyID0gJyc7XG4gICAgdmFyIGludml0ZV9vayA9ICcnO1xuICAgIHZhciBpbnZpdGVfbm8gPSAnJztcbiAgICB2YXIgaW52aXRlX2ZpbmlzaCA9ICcnO1xuICAgIHZhciBzYWxlc21hbl90ciA9ICcnO1xuICAgIC8vIOato+WImVxuICAgIHZhciBudW1iZXJfcmVnID0gbmV3IFJlZ0V4cCgvXihcXCs4NnwpMVswLTldezEwfSQvKTtcbiAgICAvLyDngrnlh7vlrqLmiLfnrqHnkIblh7rnjrDlj7PovrnlhoXlrrlcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6Jy9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9kZWFsZXIvJyArIGRlYWxlcl9pZCArICcvY3VzdG9tZXJzJyxcbiAgICAgICAgdHlwZTonZ2V0JyxcbiAgICAgICAgZGF0YVR5cGU6J2pzb24nLFxuICAgICAgICBkYXRhOntcbiAgICAgICAgICAgIHNvdXJjZXR5cGU6MixcbiAgICAgICAgICAgIHBlcl9wYWdlOjIwLFxuICAgICAgICAgICAgcGFnZTpjdXNfY3VycmVudF9wYWdlLFxuICAgICAgICAgICAga2V5d29yZDpjdXNTZWFyY2hfcmVzdWx0c1xuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgY3VzX3BhZ2VzID0gZGF0YS5wYWdlcztcbiAgICAgICAgICAgIGN1c1BhZ2lGdW4oY3VzX3BhZ2VzKTtcbiAgICAgICAgICAgIGxvYWRDdXN0b21lcnMoY3VzX2N1cnJlbnRfcGFnZSk7XG4gICAgICAgICAgICBjaGFuZ2VTdGF0dXNGdW4oKTtcbiAgICAgICAgICAgIGlzSW52aXRlKCk7XG4gICAgICAgICAgICBjdXN0b21lcl9jaGFuZ2UoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDonL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2RlYWxlci8nICsgZGVhbGVyX2lkICsgJy9zYWxlc21lbicsXG4gICAgICAgIHR5cGU6J2dldCcsXG4gICAgICAgIGRhdGFUeXBlOidqc29uJyxcbiAgICAgICAgc3VjY2VzczpmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIHZhciBzYWxfaXRlbXMgPSBkYXRhLnNhbGVzbWVuO1xuICAgICAgICAgICAgZm9yKHZhciBzYWxfaXRlbSBpbiBzYWxfaXRlbXMpe1xuICAgICAgICAgICAgICAgIHZhciBzYWxfb3B0aW9uID0gXCI8b3B0aW9uIHZhbHVlPVwiICsgc2FsX2l0ZW1zW3NhbF9pdGVtXS5pZCArIFwiPlwiICsgc2FsX2l0ZW1zW3NhbF9pdGVtXS5uYW1lICsgXCI8L29wdGlvbj5cIjtcbiAgICAgICAgICAgICAgICAkKCcuc2FsLXNlbGVjdCcpLmFwcGVuZChzYWxfb3B0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIC8v5a6i5oi3566h55CG5pCc57SiXG4gICAgJCgnI2N1c3RvbWVyLXNlYXJjaCcpLmJpbmQoJ2tleWRvd24nLGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB4ID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZVxuICAgICAgICAvL+ebkeWQrOWIoOmZpOmUruWmguaenGlucHV05Li656m65Y+R6YCB6K+35rGCXG4gICAgICAgIGlmICh4PT04KSB7XG4gICAgICAgIGlmICgkKCcjY3VzdG9tZXItc2VhcmNoJykudmFsKCkubGVuZ3RoPT0xKSB7XG4gICAgICAgICAgICBjdXNTZWFyY2hfcmVzdWx0cyA9ICcnO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9kZWFsZXIvJyArIGRlYWxlcl9pZCArICcvY3VzdG9tZXJzJyxcbiAgICAgICAgICAgICAgICB0eXBlOidnZXQnLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOidqc29uJyxcbiAgICAgICAgICAgICAgICBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgc291cmNldHlwZToyLFxuICAgICAgICAgICAgICAgICAgICBwZXJfcGFnZToyMCxcbiAgICAgICAgICAgICAgICAgICAgcGFnZToxLFxuICAgICAgICAgICAgICAgICAgICBrZXl3b3JkOmN1c1NlYXJjaF9yZXN1bHRzXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICBjdXNfcGFnZXMgPSBkYXRhLnBhZ2VzO1xuICAgICAgICAgICAgICAgICAgICBjdXNQYWdpRnVuKGN1c19wYWdlcyk7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRDdXN0b21lcnMoMSlcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlU3RhdHVzRnVuKCk7XG4gICAgICAgICAgICAgICAgICAgIGlzSW52aXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIGN1c3RvbWVyX2NoYW5nZSgpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBcblxuICAgICAgICB9XG4gICAgICAgIC8vIOaMieWbnui9pumUruaQnOe0olxuICAgICAgICBpZiAoeD09MTMpIHtcbiAgICAgICAgICAgICQoJyNjdXMtdGJvZHknKS5lbXB0eSgpOyBcbiAgICAgICAgaWYoJCgnI2N1c3RvbWVyLXNlYXJjaCcpLnZhbCgpLmxlbmd0aCA+PTEpe1xuICAgICAgICAgICAgY3VzU2VhcmNoX3Jlc3VsdHMgPSAkKCcjY3VzdG9tZXItc2VhcmNoJykudmFsKCk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgY3VzU2VhcmNoX3Jlc3VsdHMgPSAnJztcbiAgICAgICAgfVxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOicvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvZGVhbGVyLycgKyBkZWFsZXJfaWQgKyAnL2N1c3RvbWVycycsXG4gICAgICAgICAgICB0eXBlOidnZXQnLFxuICAgICAgICAgICAgZGF0YVR5cGU6J2pzb24nLFxuICAgICAgICAgICAgZGF0YTp7XG4gICAgICAgICAgICAgICAgc291cmNldHlwZToyLFxuICAgICAgICAgICAgICAgIHBlcl9wYWdlOjIwLFxuICAgICAgICAgICAgICAgIHBhZ2U6MSxcbiAgICAgICAgICAgICAgICBrZXl3b3JkOmN1c1NlYXJjaF9yZXN1bHRzXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczpmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICBjdXNfcGFnZXMgPSBkYXRhLnBhZ2VzO1xuICAgICAgICAgICAgICAgIGN1c1BhZ2lGdW4oY3VzX3BhZ2VzKTtcbiAgICAgICAgICAgICAgICBsb2FkQ3VzdG9tZXJzKDEpXG4gICAgICAgICAgICAgICAgY2hhbmdlU3RhdHVzRnVuKCk7XG4gICAgICAgICAgICAgICAgaXNJbnZpdGUoKTtcbiAgICAgICAgICAgICAgICBjdXN0b21lcl9jaGFuZ2UoKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkKCcuY3VzdG9tZXJfbWFuYWdlbWVudF9jb24gLmNpcmN1bGFyJykuYmluZCgnY2xpY2snLGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJyNjdXMtdGJvZHknKS5lbXB0eSgpOyBcbiAgICAgICAgaWYoJCgnI2N1c3RvbWVyLXNlYXJjaCcpLnZhbCgpLmxlbmd0aCA+PTEpe1xuICAgICAgICAgICAgY3VzU2VhcmNoX3Jlc3VsdHMgPSAkKCcjY3VzdG9tZXItc2VhcmNoJykudmFsKCk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgY3VzU2VhcmNoX3Jlc3VsdHMgPSAnJztcbiAgICAgICAgfSAgICAgICBcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDonL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2RlYWxlci8nICsgZGVhbGVyX2lkICsgJy9jdXN0b21lcnMnLFxuICAgICAgICAgICAgdHlwZTonZ2V0JyxcbiAgICAgICAgICAgIGRhdGFUeXBlOidqc29uJyxcbiAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICAgIHNvdXJjZXR5cGU6MixcbiAgICAgICAgICAgICAgICBwZXJfcGFnZToyMCxcbiAgICAgICAgICAgICAgICBwYWdlOjEsXG4gICAgICAgICAgICAgICAga2V5d29yZDpjdXNTZWFyY2hfcmVzdWx0c1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6ZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgY3VzX3BhZ2VzID0gZGF0YS5wYWdlcztcbiAgICAgICAgICAgICAgICBjdXNQYWdpRnVuKGN1c19wYWdlcyk7XG4gICAgICAgICAgICAgICAgbG9hZEN1c3RvbWVycygxKVxuICAgICAgICAgICAgICAgIGNoYW5nZVN0YXR1c0Z1bigpO1xuICAgICAgICAgICAgICAgIGlzSW52aXRlKCk7XG4gICAgICAgICAgICAgICAgY3VzdG9tZXJfY2hhbmdlKCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pXG4gICAgJCgnLmN1c3RvbWVyX21hbmFnZW1lbnQnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLm1hbmFnZW1lbnRfY29uJykuY3NzKCdkaXNwbGF5Jywnbm9uZScpO1xuICAgICAgICAkKCcuY3VzdG9tZXJfbWFuYWdlbWVudF9jb24nKS5zaG93KCk7XG4gICAgfSk7XG4gICAgJCgnLmFjY291bnQtbWFuYWdlbWVudCcpLm9mZignY2xpY2snKS5vbignY2xpY2snLGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcubWFuYWdlbWVudF9jb24nKS5jc3MoJ2Rpc3BsYXknLCdub25lJyk7XG4gICAgICAgICQoJy5jdXN0b21lcl9tYW5hZ2VtZW50X2NvbicpLnNob3coKTtcbiAgICB9KTtcbiAgICBmdW5jdGlvbiBjdXNQYWdpRnVuKGRhdGEpe1xuICAgICAgICB2YXIgcHJlUGFnZSA9IFwiPGEgaHJlZj0namF2YXNjcmlwdDonIGNsYXNzPSdpdGVtIHByZS1wYWdlJyBzaWduPSdwcmUtcGFnZScgaWQ9J2N1c19wcmVfcGFnZSc+5LiK5LiA6aG1PC9hPlwiO1xuICAgICAgICB2YXIgbmV4dFBhZ2UgPSBcIjxhIGhyZWY9J2phdmFzY3JpcHQ6JyBjbGFzcz0naXRlbSBuZXh0LXBhZ2UnIHNpZ249J25leHQtcGFnZScgaWQ9J2N1c19uZXh0X3BhZ2UnPuS4i+S4gOmhtTwvYT5cIjtcbiAgICAgICAgdmFyIHNpbmdsZVBhZ2UgPSBcIlwiO1xuICAgICAgICBmb3IgKHZhciBrID0gMTsgayA8PSBkYXRhOyBrKyspIHtcbiAgICAgICAgICAgIGlmIChrIDw9IDYpIHtcbiAgICAgICAgICAgICAgICBzaW5nbGVQYWdlICs9IFwiPGEgaHJlZj0namF2YXNjcmlwdDonIGNsYXNzPSdpdGVtIHBhZ2knIHNpZ249J3BhZ2knPlwiKyBrICtcIjwvYT5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgYWxsUGFnZSA9IHByZVBhZ2UgKyBzaW5nbGVQYWdlICsgbmV4dFBhZ2U7XG4gICAgICAgICQoJy5jdXNfcGFnaW5hdGlvbicpLmVtcHR5KCk7XG4gICAgICAgICQoJy5jdXNfcGFnaW5hdGlvbicpLmFwcGVuZChhbGxQYWdlKTtcbiAgICAgICAgJCgnLmN1c19wYWdpbmF0aW9uIC5wYWdpOmZpcnN0JykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjaGFuZ2VTdGF0dXNGdW4oKSB7XG4gICAgICAgIC8vIOavj+S4gOmhtVxuICAgICAgICAkKCcuY3VzX3BhZ2luYXRpb24nKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywnLnBhZ2knLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjdXNfY3VycmVudF9wYWdlID0gJCh0aGlzKS5odG1sKCk7XG4gICAgICAgICAgICBsb2FkQ3VzdG9tZXJzKGN1c19jdXJyZW50X3BhZ2UpO1xuICAgICAgICAgICAgY3VycmVudFBhZ2VTdGF0dXMoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g5bem5Y+z57+76aG1XG4gICAgICAgICQoJy5jdXNfcGFnaW5hdGlvbiAucHJlLXBhZ2UnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJyxmdW5jdGlvbigpe1xuICAgICAgICAgICAgY3VzX2N1cnJlbnRfcGFnZSA9IGN1c19jdXJyZW50X3BhZ2UgLSAxO1xuICAgICAgICAgICAgaWYgKGN1c19jdXJyZW50X3BhZ2UgPD0gMCkge1xuICAgICAgICAgICAgICAgIGN1c19jdXJyZW50X3BhZ2UgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbG9hZEN1c3RvbWVycyhjdXNfY3VycmVudF9wYWdlKTtcbiAgICAgICAgICAgIGN1cnJlbnRQYWdlU3RhdHVzKCk7XG5cbiAgICAgICAgfSk7XG4gICAgICAgICQoJy5jdXNfcGFnaW5hdGlvbiAubmV4dC1wYWdlJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGN1c19jdXJyZW50X3BhZ2UgPSBjdXNfY3VycmVudF9wYWdlIC0wICsgMTtcbiAgICAgICAgICAgIGlmIChjdXNfY3VycmVudF9wYWdlID49IGN1c19wYWdlcykge1xuICAgICAgICAgICAgICAgIGN1c19jdXJyZW50X3BhZ2UgPSBjdXNfcGFnZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2FkQ3VzdG9tZXJzKGN1c19jdXJyZW50X3BhZ2UpO1xuICAgICAgICAgICAgY3VycmVudFBhZ2VTdGF0dXMoKTtcblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjdXJyZW50UGFnZVN0YXR1cygpIHtcbiAgICAgICAgJCgnLmN1c19wYWdpbmF0aW9uIC5wYWdpJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYgKCQodGhpcykuaHRtbCgpID09IGN1c19jdXJyZW50X3BhZ2UpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjdXNfY3VycmVudF9wYWdlID49IDQgJiYgY3VzX3BhZ2VzID4gNikge1xuICAgICAgICAgICAgICAgIGlmIChjdXNfY3VycmVudF9wYWdlID49IGN1c19wYWdlcyAtIDIpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmN1c19wYWdpbmF0aW9uIC5wYWdpJykuZWFjaChmdW5jdGlvbihwYWdpX2luZGV4LHBhZ2lfZWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbm93UGFnZSA9IGN1c19wYWdlcyAtIDUgKyBwYWdpX2luZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgJChwYWdpX2VsZSkuaHRtbChub3dQYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICQoJy5jdXNfcGFnaW5hdGlvbiAucGFnaScpLmVhY2goZnVuY3Rpb24ocGFnaV9pbmRleCxwYWdpX2VsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5vd1BhZ2VPdGhlciA9IGN1c19jdXJyZW50X3BhZ2UgLSAzICsgcGFnaV9pbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgICQocGFnaV9lbGUpLmh0bWwobm93UGFnZU90aGVyKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2UgaWYoY3VzX2N1cnJlbnRfcGFnZSA8IDQgJiYgY3VzX3BhZ2VzID4gNil7XG4gICAgICAgICAgICAgICAgJCgnLmN1c19wYWdpbmF0aW9uIC5wYWdpJykuZWFjaChmdW5jdGlvbihwYWdpX2luZGV4LHBhZ2lfZWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBub3dQYWdlcHJlID0gMSAtIDAgKyBwYWdpX2luZGV4O1xuICAgICAgICAgICAgICAgICAgICAkKHBhZ2lfZWxlKS5odG1sKG5vd1BhZ2VwcmUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8g6K+35rGC5a6i5oi35pWw5o2uXG4gICAgZnVuY3Rpb24gbG9hZEN1c3RvbWVycyhjdXNfY3VycmVudF9wYWdlKSB7XG4gICAgICAgICQoXCIuY2hlY2tib3hBbGxcIikuY2hlY2tib3goJ3NldCB1bmNoZWNrZWQnKTtcbiAgICAgICAgaWYoJCgnI2N1c3RvbWVyLXNlYXJjaCcpLnZhbCgpLmxlbmd0aCA+PTEpe1xuICAgICAgICAgICAgY3VzU2VhcmNoX3Jlc3VsdHMgPSAkKCcjY3VzdG9tZXItc2VhcmNoJykudmFsKCk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgY3VzU2VhcmNoX3Jlc3VsdHMgPSAnJztcbiAgICAgICAgfSBcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDonL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2RlYWxlci8nICsgZGVhbGVyX2lkICsgJy9jdXN0b21lcnMnLFxuICAgICAgICAgICAgdHlwZTonZ2V0JyxcbiAgICAgICAgICAgIGRhdGFUeXBlOidqc29uJyxcbiAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICAgIHNvdXJjZXR5cGU6MixcbiAgICAgICAgICAgICAgICBwZXJfcGFnZToyMCxcbiAgICAgICAgICAgICAgICBwYWdlOmN1c19jdXJyZW50X3BhZ2UsXG4gICAgICAgICAgICAgICAga2V5d29yZDpjdXNTZWFyY2hfcmVzdWx0c1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6ZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgJCgnLmN1c3RvbWVyX21hbmFnZW1lbnRfY29uJykuZmluZCgndGJvZHknKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGZvcih2YXIgbiBpbiBkYXRhLmN1c3RvbWVycyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGRhdGEuY3VzdG9tZXJzW25dLmN1c3RvbWVyX2FkZHJlc3MgPT09IG51bGwpe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5jdXN0b21lcnNbbl0uY3VzdG9tZXJfYWRkcmVzcyA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmKGRhdGEuY3VzdG9tZXJzW25dLmN1c3RvbWVyX3Bob25lID09PSBudWxsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuY3VzdG9tZXJzW25dLmN1c3RvbWVyX3Bob25lID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5jdXN0b21lcnNbbl0uY29udGFjdCA9PT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmN1c3RvbWVyc1tuXS5jb250YWN0ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5jdXN0b21lcnNbbl0uYWNjb3VudCA9PT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmN1c3RvbWVyc1tuXS5hY2NvdW50ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5jdXN0b21lcnNbbl0uc2FsZXNtYW5fbmFtZSA9PT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmN1c3RvbWVyc1tuXS5zYWxlc21hbl9uYW1lID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tZXJfb3RoZXI9XCI8dHIgY2xhc3M9J3VpIGNlbnRlciBhbGlnbmVkJyAgY3VzdG9tZXJfaWQ9XCIgKyBkYXRhLmN1c3RvbWVyc1tuXS5jdXN0b21lcl9pZCArXCI+PHRkPjxkaXYgY2xhc3M9J3VpIGNoZWNrYm94IGNoZWNrYm94Q2hpbGQnIGN1c3RvbWVyX2lkPVwiICsgZGF0YS5jdXN0b21lcnNbbl0uY3VzdG9tZXJfaWQgK1wiPjxpbnB1dCB0eXBlPSdjaGVja2JveCc+XCIgK1xuICAgICAgICAgICAgICAgICAgICBcIjxsYWJlbD48L2xhYmVsPjwvZGl2PjwvdGQ+PHRkIGNsYXNzPSdjdXNfbmFtZSc+XCIgKyBkYXRhLmN1c3RvbWVyc1tuXS5jdXN0b21lcl9uYW1lICtcIjwvdGQ+PHRkIGNsYXNzPSdjdXNfYWRkcmVzcyc+XCIgKyBkYXRhLmN1c3RvbWVyc1tuXS5jdXN0b21lcl9hZGRyZXNzICsgXCI8L3RkPlwiICtcbiAgICAgICAgICAgICAgICAgICAgXCI8dGQgY2xhc3M9J2N1c19wZW9wbGUnPlwiICsgZGF0YS5jdXN0b21lcnNbbl0uY29udGFjdCArIFwiPC90ZD48dGQgY2xhc3M9J2N1c190ZWwnPlwiICsgZGF0YS5jdXN0b21lcnNbbl0uY3VzdG9tZXJfcGhvbmUgKyBcIjwvdGQ+XCIgK1xuICAgICAgICAgICAgICAgICAgICBcIjx0ZCBjbGFzcz0nY3VzX2FjY291bnQnPlwiICsgZGF0YS5jdXN0b21lcnNbbl0uYWNjb3VudCArIFwiPC90ZD5cIiArIFwiPHRkIGNsYXNzPSdjdXNfc2FsJz5cIiArIGRhdGEuY3VzdG9tZXJzW25dLnNhbGVzbWFuX25hbWUgKyBcIjwvdGQ+XCIgK1xuICAgICAgICAgICAgICAgICAgICBcIjx0ZD48YSBjbGFzcz0nY2hhbmdlJyBjdXN0b21lcl9pZD1cIiArIGRhdGEuY3VzdG9tZXJzW25dLmN1c3RvbWVyX2lkICtcIj7kv67mlLk8L2E+PC90ZD5cIjtcblxuICAgICAgICAgICAgICAgICAgICBpbnZpdGVfZmluaXNoID0gXCI8dGQ+PGJ1dHRvbiBjbGFzcz0naW52aXRpb24gaW52aXRpb25GaW5pc2gnIGN1c3RvbWVyX2lkPVwiICsgZGF0YS5jdXN0b21lcnNbbl0uY3VzdG9tZXJfaWQgK1wiPuW3sumCgOivtzwvYnV0dG9uPjwvdGQ+PC90cj5cIjtcbiAgICAgICAgICAgICAgICAgICAgaW52aXRlX25vID0gXCI8dGQ+PGJ1dHRvbiBjbGFzcz0naW52aXRpb24gaW52aXRpb25ObycgY3VzdG9tZXJfaWQ9XCIgKyBkYXRhLmN1c3RvbWVyc1tuXS5jdXN0b21lcl9pZCArXCI+5pyq6YKA6K+3PC9idXR0b24+PC90ZD48L3RyPlwiO1xuICAgICAgICAgICAgICAgICAgICBpbnZpdGVfb2sgPSBcIjx0ZD48YnV0dG9uIGNsYXNzPSdpbnZpdGlvbiBpbnZpdGlvbk9rJyBjdXN0b21lcl9pZD1cIiArIGRhdGEuY3VzdG9tZXJzW25dLmN1c3RvbWVyX2lkICtcIj7pgoDor7fmiJDlip88L2J1dHRvbj48L3RkPjwvdHI+XCI7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5jdXN0b21lcnNbbl0uaW52aXRhdGlvbnN0YXR1cyA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VzdG9tZXJfdHIgPSAgY3VzdG9tZXJfb3RoZXIgKyBpbnZpdGVfZmluaXNoO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZihkYXRhLmN1c3RvbWVyc1tuXS5pbnZpdGF0aW9uc3RhdHVzID09PSAwIHx8IGRhdGEuY3VzdG9tZXJzW25dLmludml0YXRpb25zdGF0dXMgPT09IG51bGwpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VzdG9tZXJfdHIgPSAgY3VzdG9tZXJfb3RoZXIgKyBpbnZpdGVfbm87XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKGRhdGEuY3VzdG9tZXJzW25dLmludml0YXRpb25zdGF0dXMgPT09IDIpeyAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXN0b21lcl90ciA9ICBjdXN0b21lcl9vdGhlciArIGludml0ZV9vaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkKCcuY3VzdG9tZXJfbWFuYWdlbWVudF9jb24nKS5maW5kKCd0Ym9keScpLmFwcGVuZChjdXN0b21lcl90cik7XG4gICAgICAgICAgICAgICAgICAgIGlmKGRhdGEuY3VzdG9tZXJzW25dLmludml0YXRpb25zdGF0dXMgPT09IDIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcInRyW2N1c3RvbWVyX2lkPSdcIiArIGRhdGEuY3VzdG9tZXJzW25dLmN1c3RvbWVyX2lkICsgXCInXVwiKS5hZGRDbGFzcygnaW52aXRpb25Pa1RyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiLmludml0aW9uT2tbY3VzdG9tZXJfaWQ9J1wiICsgZGF0YS5jdXN0b21lcnNbbl0uY3VzdG9tZXJfaWQgKyBcIiddXCIpLnJlbW92ZUNsYXNzKCdpbnZpdGlvbicpOyBcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIuY2hlY2tib3hbY3VzdG9tZXJfaWQ9J1wiICsgZGF0YS5jdXN0b21lcnNbbl0uY3VzdG9tZXJfaWQgKyBcIiddXCIpLmZpbmQoJ2lucHV0JykuYXR0cignZGlzYWJsZWQnLCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5jaGVja2JveFtjdXN0b21lcl9pZD0nXCIgKyBkYXRhLmN1c3RvbWVyc1tuXS5jdXN0b21lcl9pZCArIFwiJ11cIikucmVtb3ZlQ2xhc3MoJ2NoZWNrYm94Q2hpbGQnKTsgXG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiLmNoZWNrYm94W2N1c3RvbWVyX2lkPSdcIiArIGRhdGEuY3VzdG9tZXJzW25dLmN1c3RvbWVyX2lkICsgXCInXVwiKS5jaGVja2JveCgnc2V0IGRpc2FibGVkJyk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGN1c3RvbWVyX2NoYW5nZSgpO1xuICAgICAgICAgICAgICAgIGlzSW52aXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyDlrqLmiLfnrqHnkIbkuK3mmK/lkKbpgoDor7dcbiAgICBmdW5jdGlvbiBpc0ludml0ZSgpIHtcbiAgICAgICAgJCgnLmN1c3RvbWVyX21hbmFnZW1lbnRfY29uJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsJy5pbnZpdGlvbicsZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjdXN0b21lcl9pZCA9ICQodGhpcykuYXR0cignY3VzdG9tZXJfaWQnKTtcbiAgICAgICAgICAgICQoJy5pbnZpdGVfbW9kZWwnKS5zaG93KCk7XG4gICAgICAgICAgICAkKCcuaW52aXRlX21vZGVsIC5jYW5jZWwnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkKCcuaW52aXRlX21vZGVsJykuaGlkZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcuaW52aXRlX21vZGVsIC5zdXJlJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJCgnLmludml0ZV9tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6Jy9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9kZWFsZXIvJyArIGRlYWxlcl9pZCArICcvY3VzdG9tZXIvJyArIGN1c3RvbWVyX2lkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOidwYXRjaCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOidqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTp7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaWQ6Y3VzdG9tZXJfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZpdGF0aW9uc3RhdHVzOjFcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczpmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRhdGEuY29kZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCflt7LpgoDor7fmiJDlip/vvIEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkQ3VzdG9tZXJzKGN1c19jdXJyZW50X3BhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYoZGF0YS5jb2RlID09PSAxKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihkYXRhLmVycm9yID09PSAnZmFpbGVkX3ZhbGlkYXRpb25zJyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCfpgoDor7flpLHotKXjgILor7flnKhlcnDlhoXlrozlloTmiYDpgInotKbmiLfnmoTigJzlrqLmiLflkI3np7DigJ0s4oCc6IGU57O75pa55byP4oCd44CCJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRhdGEuZXJyb3IgPT09ICdmYWlsZWRfZXhjbHVzaW9uJyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCfpgoDor7flpLHotKXjgILor6XotKbmiLflt7LlrZjlnKjvvIzor7flnKhlcnDlhoXmm7TmjaLor6XotKbmiLfnmoTmiYvmnLrlj7fjgIInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8g5a6i5oi3566h55CG5Lit55qE5L+u5pS5XG4gICAgZnVuY3Rpb24gY3VzdG9tZXJfY2hhbmdlKCl7XG4gICAgICAgICQoJy5jdXN0b21lcl9tYW5hZ2VtZW50X2NvbiAuY2hhbmdlJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGN1c3RvbWVyX2lkID0gJCh0aGlzKS5hdHRyKCdjdXN0b21lcl9pZCcpO1xuICAgICAgICAgICAgJCgnLmNoYW5nZV9jdXN0b21lcl9tb2RlbCcpLnNob3coKTtcbiAgICAgICAgICAgICQoJy5jaGFuZ2VfY3VzdG9tZXJfbW9kZWwgLm9wdF9jYW5jZWwnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkKCcuY2hhbmdlX2N1c3RvbWVyX21vZGVsJykuaGlkZSgpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJy5jaGFuZ2VfY3VzdG9tZXJfbW9kZWwgLm9wdF9zdXJlJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7ICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAkKCcuY2hhbmdlX2N1c3RvbWVyX21vZGVsJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDonL2FwaS92MS4xL3JlY29tbWVuZG9yZGVyL2RlYWxlci8nICsgZGVhbGVyX2lkICsgJy9jdXN0b21lci8nICsgY3VzdG9tZXJfaWQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6J3Bvc3QnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTonanNvbicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgY2lkOmN1c3RvbWVyX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2FsZXNtYW5faWQ6JCgnLmNoYW5nZV9jdXN0b21lcl9tb2RlbCcpLmZpbmQoJy5zYWwtc2VsZWN0JykudmFsKClcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczpmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCflrqLmiLfkv6Hmga/kv67mlLnmiJDlip/vvIEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRDdXN0b21lcnMoY3VzX2N1cnJlbnRfcGFnZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy/lhajpgInlkozlhajkuI3pgIlcbiAgICAgJCgnLmN1c3RvbWVyX21hbmFnZW1lbnRfY29uIC5jaGVja2JveEFsbC5jaGVja2JveCcpXG4gICAgLmNoZWNrYm94KHtcbiAgICAgICAgb25DaGVja2VkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAkKCcuY2hlY2tib3hDaGlsZCcpLmNoZWNrYm94KCdjaGVjaycpO1xuICAgICAgICB9LFxuICAgICAgICBvblVuY2hlY2tlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJCgnLmNoZWNrYm94Q2hpbGQnKS5jaGVja2JveCgndW5jaGVjaycpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgJCgnLmN1c3RvbWVyX21hbmFnZW1lbnRfY29uJykub2ZmKCdjaGFuZ2UnKS5vbignY2hhbmdlJywnLmNoZWNrYm94Q2hpbGQnLGZ1bmN0aW9uKCkgeyBcbiAgICAgICAgdmFyIGNoaWxkQXJyID0gJChcIi5jaGVja2JveENoaWxkXCIpLmNoZWNrYm94KCdpcyBjaGVja2VkJyk7XG4gICAgICAgIHZhciBjaGlsZENoZWNrZWROdW0gPSAwO1xuICAgICAgICBmb3IodmFyIGogaW4gY2hpbGRBcnIpe1xuICAgICAgICAgICAgaWYoY2hpbGRBcnJbal0gPT09IHRydWUpe1xuICAgICAgICAgICAgICAgIGNoaWxkQ2hlY2tlZE51bSArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmKCQoJy5jaGVja2JveENoaWxkJykubGVuZ3RoID09IGNoaWxkQ2hlY2tlZE51bSkge1xuICAgICAgICAgICAgJChcIi5jaGVja2JveEFsbFwiKS5jaGVja2JveCgnc2V0IGNoZWNrZWQnKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAkKFwiLmNoZWNrYm94QWxsXCIpLmNoZWNrYm94KCdzZXQgdW5jaGVja2VkJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBcbiAgICAvLyDlrqLmiLfnrqHnkIbkuK3mibnph4/pgoDor7dcbiAgICAkKCcuY3VzdG9tZXItbWFuYWdlbWVudC1pbnZpdGUnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcbiAgICAgICAgaW52aXRlX2FjY291bnRfYXJyID0gW107XG4gICAgICAgICQoJy5jdXN0b21lcl9tYW5hZ2VtZW50X2NvbicpLmZpbmQoJy5jaGVja2JveENoaWxkJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKCQodGhpcykuY2hlY2tib3goJ2lzIGNoZWNrZWQnKSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGludml0ZV9hY2NvdW50X2Fyci5wdXNoKE51bWJlcigkKHRoaXMpLmF0dHIoJ2N1c3RvbWVyX2lkJykpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmKGludml0ZV9hY2NvdW50X2Fyci5sZW5ndGggPT09IDApe1xuICAgICAgICAgICAgYWxlcnQoJ+acqumAieaLqeS7u+S9leS/oeaBr++8gScpO1xuICAgICAgICB9ZWxzZSBpZihpbnZpdGVfYWNjb3VudF9hcnIubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAkKCcuaW52aXRlX21vZGVsJykuc2hvdygpO1xuICAgICAgICAgICAgJCgnLmludml0ZV9tb2RlbCAuY2FuY2VsJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJCgnLmludml0ZV9tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnLmludml0ZV9tb2RlbCAuc3VyZScpLm9mZignY2xpY2snKS5vbignY2xpY2snLGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICQoJy5pbnZpdGVfbW9kZWwnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOicvYXBpL3YxLjEvcmVjb21tZW5kb3JkZXIvZGVhbGVyLycgKyBkZWFsZXJfaWQgKyAnL2N1c3RvbWVyJyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZToncGF0Y2gnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTonanNvbicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgY2lkczppbnZpdGVfYWNjb3VudF9hcnIsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXRjaDoxLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW52aXRhdGlvbnN0YXR1czoxXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6ZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihkYXRhLmNvZGUgPT09IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCflrqLmiLfpgoDor7fmiJDlip/vvIEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkQ3VzdG9tZXJzKGN1c19jdXJyZW50X3BhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYoZGF0YS5jb2RlID09PSAxKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmFpbGVkU3RyLGZhaWxlZFN0cjEsZmFpbGVkU3RyMjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihkYXRhLmZhaWxlZF9leGNsdXNpb24ubGVuZ3RoICE9PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFpbGVkU3RyMSA9IGRhdGEuZmFpbGVkX2V4Y2x1c2lvbi5qb2luKCcsJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhaWxlZFN0ciA9ICfku6XkuIvlrqLmiLflm6Dkv6Hmga/kuI3lhajpgoDor7flpLHotKU6JyArIGZhaWxlZFN0cjEgKyAnXFxuJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5mYWlsZWR2YWxpZGF0aW9ucy5sZW5ndGggIT09IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWlsZWRTdHIyID0gZGF0YS5mYWlsZWR2YWxpZGF0aW9ucy5qb2luKCcsJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhaWxlZFN0ciArPSAn5Lul5LiL5a6i5oi35Zug5biQ5Y+35bey5a2Y5Zyo6YKA6K+35aSx6LSlOicgKyBmYWlsZWRTdHIyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KGZhaWxlZFN0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAvL+WuouaIt+euoeeQhuWvvOWHulxuICAgICQoJy5jdXNfZXhwb3J0Jykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5jdXNfZXhwb3J0X21vZGVsJykuc2hvdygpO1xuICAgICAgICAkKCcuY3VzX2V4cG9ydF9tb2RlbCAuY2FuY2VsJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCcuY3VzX2V4cG9ydF9tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoJy5jdXNfZXhwb3J0X21vZGVsIC5zdXJlJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCcuY3VzX2V4cG9ydF9tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgIHZhciBjdXNfdXJsID0gJy9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9kZWFsZXIvJyArIGRlYWxlcl9pZCArICcvY3VzdG9tZXJzJztcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gY3VzX3VybCArICc/ZmlsZXNhdmU9MSYmc291cmNldHlwZT0yJztcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgIC8v5b2V5YWl566h55CGXG4gICAgdmFyIGVudGVyaW5nX3BhZ2VzID0gMDtcbiAgICB2YXIgZW50ZXJpbmdfY3VycmVudF9wYWdlID0gMTtcbiAgICB2YXIgZW50ZXJpbmdfaWQ7XG4gICAgdmFyIGVudGVyaW5nU2VhcmNoX3Jlc3VsdHMgPSAnJztcbiAgICB2YXIgZW50ZXJpbmdfYXJyID0gW107XG4gICAgdmFyIGVudGVyaW5nX29rID0gJyc7XG4gICAgdmFyIGVudGVyaW5nX25vID0gJyc7XG4gICAgdmFyIGVudGVyaW5nX3RyID0gJyc7XG4gICAgdmFyIGVudGVyaW5nX290aGVyID0gJyc7XG4gICAgLy8g54K55Ye75b2V5YWl55So5oi35Ye6546w5Y+z6L655YaF5a65XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOicvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvZGVhbGVyLycgKyBkZWFsZXJfaWQgKyAnL2N1c3RvbWVycycsXG4gICAgICAgIHR5cGU6J2dldCcsXG4gICAgICAgIGRhdGFUeXBlOidqc29uJyxcbiAgICAgICAgZGF0YTp7XG4gICAgICAgICAgICBzb3VyY2V0eXBlOjEsXG4gICAgICAgICAgICBwZXJfcGFnZToyMCxcbiAgICAgICAgICAgIHBhZ2U6ZW50ZXJpbmdfY3VycmVudF9wYWdlLFxuICAgICAgICAgICAga2V5d29yZDplbnRlcmluZ1NlYXJjaF9yZXN1bHRzXG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6ZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBlbnRlcmluZ19wYWdlcyA9IGRhdGEucGFnZXM7XG4gICAgICAgICAgICBlbnRlcmluZ1BhZ2lGdW4oZW50ZXJpbmdfcGFnZXMpO1xuICAgICAgICAgICAgbG9hZEVudGVyaW5nKDEpO1xuICAgICAgICAgICAgZW50ZXJpbmdDaGFuZ2VTdGF0dXNGdW4oKTtcbiAgICAgICAgICAgIGVudGVyaW5nU3RhdHVzRnVuKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkKCcuZW50ZXJpbmctbWFuYWdlbWVudCcpLm9mZignY2xpY2snKS5vbignY2xpY2snLGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcubWFuYWdlbWVudF9jb24nKS5jc3MoJ2Rpc3BsYXknLCdub25lJyk7XG4gICAgICAgICQoJy5lbnRlcmluZy1tYW5hZ2VtZW50LWNvbicpLnNob3coKTtcbiAgICB9KTtcbiAgICAvLyDlvZXlhaXnrqHnkIbmkJzntKJcbiAgICAkKCcjY3VzdG9tZXItZW50ZXJpbmctc2VhcmNoJykuYmluZCgnaW5wdXQgcHJvcGVydHljaGFuZ2UnLGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJyNlbnRlcmluZy10Ym9keScpLmVtcHR5KCk7IFxuICAgICAgICBpZigkKCcjY3VzdG9tZXItZW50ZXJpbmctc2VhcmNoJykudmFsKCkubGVuZ3RoID49MSl7XG4gICAgICAgICAgICBlbnRlcmluZ1NlYXJjaF9yZXN1bHRzID0gJCgnI2N1c3RvbWVyLWVudGVyaW5nLXNlYXJjaCcpLnZhbCgpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGVudGVyaW5nU2VhcmNoX3Jlc3VsdHMgPSAnJztcbiAgICAgICAgfSAgICAgICBcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDonL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2RlYWxlci8nICsgZGVhbGVyX2lkICsgJy9jdXN0b21lcnMnLFxuICAgICAgICAgICAgdHlwZTonZ2V0JyxcbiAgICAgICAgICAgIGRhdGFUeXBlOidqc29uJyxcbiAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICAgIHNvdXJjZXR5cGU6MSxcbiAgICAgICAgICAgICAgICBwZXJfcGFnZToyMCxcbiAgICAgICAgICAgICAgICBwYWdlOjEsXG4gICAgICAgICAgICAgICAga2V5d29yZDplbnRlcmluZ1NlYXJjaF9yZXN1bHRzXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczpmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICBlbnRlcmluZ19wYWdlcyA9IGRhdGEucGFnZXM7XG4gICAgICAgICAgICAgICAgZW50ZXJpbmdQYWdpRnVuKGVudGVyaW5nX3BhZ2VzKTtcbiAgICAgICAgICAgICAgICBsb2FkRW50ZXJpbmcoMSk7XG4gICAgICAgICAgICAgICAgZW50ZXJpbmdDaGFuZ2VTdGF0dXNGdW4oKTtcbiAgICAgICAgICAgICAgICBlbnRlcmluZ1N0YXR1c0Z1bigpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICBmdW5jdGlvbiBlbnRlcmluZ1BhZ2lGdW4oZGF0YSl7XG4gICAgICAgIHZhciBwcmVQYWdlID0gXCI8YSBocmVmPSdqYXZhc2NyaXB0OicgY2xhc3M9J2l0ZW0gcHJlLXBhZ2UnIGlkPSdlbnRlcmluZy1wcmUtcGFnZSc+5LiK5LiA6aG1PC9hPlwiO1xuICAgICAgICB2YXIgbmV4dFBhZ2UgPSBcIjxhIGhyZWY9J2phdmFzY3JpcHQ6JyBjbGFzcz0naXRlbSBuZXh0LXBhZ2UnIGlkPSdlbnRlcmluZy1uZXh0LXBhZ2UnPuS4i+S4gOmhtTwvYT5cIjtcbiAgICAgICAgdmFyIHNpbmdsZVBhZ2UgPSBcIlwiO1xuICAgICAgICBmb3IgKHZhciBrID0gMTsgayA8PSBkYXRhOyBrKyspIHtcbiAgICAgICAgICAgIGlmIChrIDw9IDYpIHtcbiAgICAgICAgICAgICAgICBzaW5nbGVQYWdlICs9IFwiPGEgaHJlZj0namF2YXNjcmlwdDonIGNsYXNzPSdpdGVtIHBhZ2knIHNpZ249J3BhZ2knPlwiKyBrICtcIjwvYT5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgYWxsUGFnZSA9IHByZVBhZ2UgKyBzaW5nbGVQYWdlICsgbmV4dFBhZ2U7XG4gICAgICAgICQoJy5lbnRlcmluZy1wYWdpbmF0aW9uJykuZW1wdHkoKTtcbiAgICAgICAgJCgnLmVudGVyaW5nLXBhZ2luYXRpb24nKS5hcHBlbmQoYWxsUGFnZSk7XG4gICAgICAgICQoJy5lbnRlcmluZy1wYWdpbmF0aW9uIC5wYWdpOmZpcnN0JykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBlbnRlcmluZ0NoYW5nZVN0YXR1c0Z1bigpIHtcbiAgICAgICAgLy8g5q+P5LiA6aG1XG4gICAgICAgICQoJy5lbnRlcmluZy1wYWdpbmF0aW9uJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsJy5wYWdpJyxmdW5jdGlvbigpe1xuICAgICAgICAgICAgZW50ZXJpbmdfY3VycmVudF9wYWdlID0gJCh0aGlzKS5odG1sKCk7XG4gICAgICAgICAgICBsb2FkRW50ZXJpbmcoZW50ZXJpbmdfY3VycmVudF9wYWdlKTtcbiAgICAgICAgICAgIGVudGVyaW5nQ3VycmVudFBhZ2VTdGF0dXMoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g5bem5Y+z57+76aG1XG4gICAgICAgICQoJy5lbnRlcmluZy1wYWdpbmF0aW9uIC5wcmUtcGFnZScpLm9mZignY2xpY2snKS5vbignY2xpY2snLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBlbnRlcmluZ19jdXJyZW50X3BhZ2UgPSBlbnRlcmluZ19jdXJyZW50X3BhZ2UgLSAxO1xuICAgICAgICAgICAgaWYgKGVudGVyaW5nX2N1cnJlbnRfcGFnZSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgZW50ZXJpbmdfY3VycmVudF9wYWdlID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxvYWRFbnRlcmluZyhlbnRlcmluZ19jdXJyZW50X3BhZ2UpO1xuICAgICAgICAgICAgZW50ZXJpbmdDdXJyZW50UGFnZVN0YXR1cygpO1xuXG4gICAgICAgIH0pO1xuICAgICAgICAkKCcuZW50ZXJpbmctcGFnaW5hdGlvbiAubmV4dC1wYWdlJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGVudGVyaW5nX2N1cnJlbnRfcGFnZSA9IGVudGVyaW5nX2N1cnJlbnRfcGFnZSAtMCArIDE7XG4gICAgICAgICAgICBpZiAoZW50ZXJpbmdfY3VycmVudF9wYWdlID49IGVudGVyaW5nX3BhZ2VzKSB7XG4gICAgICAgICAgICAgICAgZW50ZXJpbmdfY3VycmVudF9wYWdlID0gZW50ZXJpbmdfcGFnZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2FkRW50ZXJpbmcoZW50ZXJpbmdfY3VycmVudF9wYWdlKTtcbiAgICAgICAgICAgIGVudGVyaW5nQ3VycmVudFBhZ2VTdGF0dXMoKTtcblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbnRlcmluZ0N1cnJlbnRQYWdlU3RhdHVzKCkge1xuICAgICAgICAkKCcuZW50ZXJpbmctcGFnaW5hdGlvbiAucGFnaScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmh0bWwoKSA9PSBlbnRlcmluZ19jdXJyZW50X3BhZ2UpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlbnRlcmluZ19jdXJyZW50X3BhZ2UgPj0gNCAmJiBlbnRlcmluZ19wYWdlcyA+IDYpIHtcbiAgICAgICAgICAgICAgICBpZiAoZW50ZXJpbmdfY3VycmVudF9wYWdlID49IGVudGVyaW5nX3BhZ2VzIC0gMikge1xuICAgICAgICAgICAgICAgICAgICAkKCcuZW50ZXJpbmctcGFnaW5hdGlvbiAucGFnaScpLmVhY2goZnVuY3Rpb24ocGFnaV9pbmRleCxwYWdpX2VsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5vd1BhZ2UgPSBlbnRlcmluZ19wYWdlcyAtIDUgKyBwYWdpX2luZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgJChwYWdpX2VsZSkuaHRtbChub3dQYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICQoJy5lbnRlcmluZy1wYWdpbmF0aW9uIC5wYWdpJykuZWFjaChmdW5jdGlvbihwYWdpX2luZGV4LHBhZ2lfZWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbm93UGFnZU90aGVyID0gZW50ZXJpbmdfY3VycmVudF9wYWdlIC0gMyArIHBhZ2lfaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHBhZ2lfZWxlKS5odG1sKG5vd1BhZ2VPdGhlcik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNlIGlmKGVudGVyaW5nX2N1cnJlbnRfcGFnZSA8IDQgJiYgZW50ZXJpbmdfcGFnZXMgPiA2KXtcbiAgICAgICAgICAgICAgICAkKCcuZW50ZXJpbmctcGFnaW5hdGlvbiAucGFnaScpLmVhY2goZnVuY3Rpb24ocGFnaV9pbmRleCxwYWdpX2VsZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbm93UGFnZXByZSA9IDEgLSAwICsgcGFnaV9pbmRleDtcbiAgICAgICAgICAgICAgICAgICAgJChwYWdpX2VsZSkuaHRtbChub3dQYWdlcHJlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vIOivt+axguW9leWFpeeuoeeQhuaVsOaNrlxuICAgIGZ1bmN0aW9uIGxvYWRFbnRlcmluZyhlbnRlcmluZ19jdXJyZW50X3BhZ2UpIHtcbiAgICAgICAgJChcIi5lbnRlcmluZ0NoZWNrYm94QWxsXCIpLmNoZWNrYm94KCdzZXQgdW5jaGVja2VkJyk7XG4gICAgICAgIGlmKCQoJyNjdXN0b21lci1lbnRlcmluZy1zZWFyY2gnKS52YWwoKS5sZW5ndGggPj0xKXtcbiAgICAgICAgICAgIGVudGVyaW5nU2VhcmNoX3Jlc3VsdHMgPSAkKCcjY3VzdG9tZXItZW50ZXJpbmctc2VhcmNoJykudmFsKCk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgZW50ZXJpbmdTZWFyY2hfcmVzdWx0cyA9ICcnO1xuICAgICAgICB9XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6Jy9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9kZWFsZXIvJyArIGRlYWxlcl9pZCArICcvY3VzdG9tZXJzJyxcbiAgICAgICAgICAgIHR5cGU6J2dldCcsXG4gICAgICAgICAgICBkYXRhVHlwZTonanNvbicsXG4gICAgICAgICAgICBkYXRhOntcbiAgICAgICAgICAgICAgICBzb3VyY2V0eXBlOjEsXG4gICAgICAgICAgICAgICAgcGVyX3BhZ2U6MjAsXG4gICAgICAgICAgICAgICAgcGFnZTplbnRlcmluZ19jdXJyZW50X3BhZ2UsXG4gICAgICAgICAgICAgICAga2V5d29yZDplbnRlcmluZ1NlYXJjaF9yZXN1bHRzXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczpmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAkKCcuZW50ZXJpbmctbWFuYWdlbWVudC1jb24nKS5maW5kKCd0Ym9keScpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBuIGluIGRhdGEuY3VzdG9tZXJzKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5jdXN0b21lcnNbbl0uY3VzdG9tZXJfYWRkcmVzcyA9PT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmN1c3RvbWVyc1tuXS5jdXN0b21lcl9hZGRyZXNzID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5jdXN0b21lcnNbbl0uY3VzdG9tZXJfcGhvbmUgPT09IG51bGwpe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5jdXN0b21lcnNbbl0uY3VzdG9tZXJfcGhvbmUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZihkYXRhLmN1c3RvbWVyc1tuXS5jb250YWN0ID09PSBudWxsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuY3VzdG9tZXJzW25dLmNvbnRhY3QgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZihkYXRhLmN1c3RvbWVyc1tuXS5wb3N0c2NyaXB0ID09PSBudWxsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuY3VzdG9tZXJzW25dLnBvc3RzY3JpcHQgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbnRlcmluZ19vdGhlcj1cIjx0ciBjbGFzcz0ndWkgY2VudGVyIGFsaWduZWQnICBjdXN0b21lcl9pZD1cIiArIGRhdGEuY3VzdG9tZXJzW25dLmN1c3RvbWVyX2lkICtcIj48dGQ+PGRpdiBjbGFzcz0ndWkgY2hlY2tib3ggZW50ZXJpbmdDaGVja2JveENoaWxkJyBjdXN0b21lcl9pZD1cIiArIGRhdGEuY3VzdG9tZXJzW25dLmN1c3RvbWVyX2lkICtcIj48aW5wdXQgdHlwZT0nY2hlY2tib3gnPlwiICtcbiAgICAgICAgICAgICAgICAgICAgXCI8bGFiZWw+PC9sYWJlbD48L2Rpdj48L3RkPjx0ZCBjbGFzcz0nY3VzX25hbWUnPlwiICsgZGF0YS5jdXN0b21lcnNbbl0uY3VzdG9tZXJfbmFtZSArXCI8L3RkPjx0ZCBjbGFzcz0nY3VzX2FkZHJlc3MnPlwiICsgZGF0YS5jdXN0b21lcnNbbl0uY3VzdG9tZXJfYWRkcmVzcyArIFwiPC90ZD5cIiArXG4gICAgICAgICAgICAgICAgICAgIFwiPHRkIGNsYXNzPSdjdXNfcGVvcGxlJz5cIiArIGRhdGEuY3VzdG9tZXJzW25dLmNvbnRhY3QgKyBcIjwvdGQ+PHRkIGNsYXNzPSdjdXNfdGVsJz5cIiArIGRhdGEuY3VzdG9tZXJzW25dLmN1c3RvbWVyX3Bob25lICsgXCI8L3RkPjx0ZD5cIiArIGRhdGEuY3VzdG9tZXJzW25dLnNhbGVzbWFuX25hbWUgKyBcIjwvdGQ+XCIgK1xuICAgICAgICAgICAgICAgICAgICBcIjx0ZCBjbGFzcz0nY3VzX2FjY291bnQnPlwiICsgZGF0YS5jdXN0b21lcnNbbl0ucG9zdHNjcmlwdCArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgZW50ZXJpbmdfb2sgPSBcIjx0ZD48YnV0dG9uIGNsYXNzPSdlbnRlcmluZyBlbnRlcmluZ0FjdGl2ZScgY3VzdG9tZXJfaWQ9XCIgKyBkYXRhLmN1c3RvbWVyc1tuXS5jdXN0b21lcl9pZCArXCI+5bey5b2V5YWlPC9idXR0b24+PC90ZD48L3RyPlwiO1xuICAgICAgICAgICAgICAgICAgICBlbnRlcmluZ19ubyA9IFwiPHRkPjxidXR0b24gY2xhc3M9J2VudGVyaW5nIGVudGVyaW5nTm8nIGN1c3RvbWVyX2lkPVwiICsgZGF0YS5jdXN0b21lcnNbbl0uY3VzdG9tZXJfaWQgK1wiPuW+heW9leWFpTwvYnV0dG9uPjwvdGQ+PC90cj5cIjsgXG5cblxuICAgICAgICAgICAgICAgICAgICBpZihkYXRhLmN1c3RvbWVyc1tuXS5lbnRyeXN0YXR1cyA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW50ZXJpbmdfdHIgPSAgZW50ZXJpbmdfb3RoZXIgKyBlbnRlcmluZ19vaztcbiAgICAgICAgICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW50ZXJpbmdfdHIgPSAgZW50ZXJpbmdfb3RoZXIgKyBlbnRlcmluZ19ubztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkKCcuZW50ZXJpbmctbWFuYWdlbWVudC1jb24nKS5maW5kKCd0Ym9keScpLmFwcGVuZChlbnRlcmluZ190cik7XG4gICAgICAgICAgICAgICAgICAgIGlmKGRhdGEuY3VzdG9tZXJzW25dLmVudHJ5c3RhdHVzID09PSAxKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCJ0cltjdXN0b21lcl9pZD0nXCIgKyBkYXRhLmN1c3RvbWVyc1tuXS5jdXN0b21lcl9pZCArIFwiJ11cIikuYWRkQ2xhc3MoJ2VudGVyaW5nT2tUcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5lbnRlcmluZ0FjdGl2ZVtjdXN0b21lcl9pZD0nXCIgKyBkYXRhLmN1c3RvbWVyc1tuXS5jdXN0b21lcl9pZCArIFwiJ11cIikucmVtb3ZlQ2xhc3MoJ2VudGVyaW5nJyk7IFxuICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5jaGVja2JveFtjdXN0b21lcl9pZD0nXCIgKyBkYXRhLmN1c3RvbWVyc1tuXS5jdXN0b21lcl9pZCArIFwiJ11cIikuZmluZCgnaW5wdXQnKS5hdHRyKCdkaXNhYmxlZCcsJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiLmNoZWNrYm94W2N1c3RvbWVyX2lkPSdcIiArIGRhdGEuY3VzdG9tZXJzW25dLmN1c3RvbWVyX2lkICsgXCInXVwiKS5yZW1vdmVDbGFzcygnZW50ZXJpbmdDaGVja2JveENoaWxkJyk7IFxuICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5jaGVja2JveFtjdXN0b21lcl9pZD0nXCIgKyBkYXRhLmN1c3RvbWVyc1tuXS5jdXN0b21lcl9pZCArIFwiJ11cIikuY2hlY2tib3goJ3NldCBkaXNhYmxlZCcpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbnRlcmluZ1N0YXR1c0Z1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy/lvZXlhaXnrqHnkIbmmK/lkKblvZXlhaVcbiAgICBmdW5jdGlvbiBlbnRlcmluZ1N0YXR1c0Z1bigpe1xuICAgICAgICAkKCcuZW50ZXJpbmctbWFuYWdlbWVudC1jb24nKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywnLmVudGVyaW5nJyxmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGVudGVyaW5nX2lkID0gJCh0aGlzKS5hdHRyKCdjdXN0b21lcl9pZCcpO1xuICAgICAgICAgICAgJCgnLmVudGVyaW5nX21vZGVsJykuc2hvdygpO1xuICAgICAgICAgICAgJCgnLmVudGVyaW5nX21vZGVsIC5jYW5jZWwnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkKCcuZW50ZXJpbmdfbW9kZWwnKS5oaWRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJy5lbnRlcmluZ19tb2RlbCAuc3VyZScpLm9mZignY2xpY2snKS5vbignY2xpY2snLGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICQoJy5lbnRlcmluZ19tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6Jy9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9kZWFsZXIvJyArIGRlYWxlcl9pZCArICcvY3VzdG9tZXIvJyArIGVudGVyaW5nX2lkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOidwYXRjaCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOidqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTp7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaWQ6ZW50ZXJpbmdfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnRyeXN0YXR1czoxXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6ZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihkYXRhLmNvZGUgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn5b2V5YWl5oiQ5Yqf77yBJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZEVudGVyaW5nKGVudGVyaW5nX2N1cnJlbnRfcGFnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn5b2V5YWl5aSx6LSl77yBJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy/lhajpgInlkozlhajkuI3pgIlcbiAgICAgJCgnLmVudGVyaW5nLW1hbmFnZW1lbnQtY29uIC5lbnRlcmluZ0NoZWNrYm94QWxsLmNoZWNrYm94JylcbiAgICAuY2hlY2tib3goe1xuICAgICAgICBvbkNoZWNrZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICQoJy5lbnRlcmluZ0NoZWNrYm94Q2hpbGQnKS5jaGVja2JveCgnY2hlY2snKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25VbmNoZWNrZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICQoJy5lbnRlcmluZ0NoZWNrYm94Q2hpbGQnKS5jaGVja2JveCgndW5jaGVjaycpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgJCgnLmVudGVyaW5nLW1hbmFnZW1lbnQtY29uJykub2ZmKCdjaGFuZ2UnKS5vbignY2hhbmdlJywnLmVudGVyaW5nQ2hlY2tib3hDaGlsZCcsZnVuY3Rpb24oKSB7IFxuICAgICAgICB2YXIgY2hpbGRBcnIgPSAkKFwiLmVudGVyaW5nQ2hlY2tib3hDaGlsZFwiKS5jaGVja2JveCgnaXMgY2hlY2tlZCcpO1xuICAgICAgICB2YXIgY2hpbGRDaGVja2VkTnVtID0gMDtcbiAgICAgICAgZm9yKHZhciBqIGluIGNoaWxkQXJyKXtcbiAgICAgICAgICAgIGlmKGNoaWxkQXJyW2pdID09PSB0cnVlKXtcbiAgICAgICAgICAgICAgICBjaGlsZENoZWNrZWROdW0gKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZigkKCcuZW50ZXJpbmdDaGVja2JveENoaWxkJykubGVuZ3RoID09IGNoaWxkQ2hlY2tlZE51bSkge1xuICAgICAgICAgICAgJChcIi5lbnRlcmluZ0NoZWNrYm94QWxsXCIpLmNoZWNrYm94KCdzZXQgY2hlY2tlZCcpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICQoXCIuZW50ZXJpbmdDaGVja2JveEFsbFwiKS5jaGVja2JveCgnc2V0IHVuY2hlY2tlZCcpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgLy8g5b2V5YWl566h55CG5Lit5om56YeP5b2V5YWlXG4gICAgJCgnLmVudGVyaW5nLW1hbmFnZW1lbnQtZW50ZXJpbmcnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcbiAgICAgICAgZW50ZXJpbmdfYXJyID0gW107XG4gICAgICAgICQoJy5lbnRlcmluZy1tYW5hZ2VtZW50LWNvbicpLmZpbmQoJy5lbnRlcmluZ0NoZWNrYm94Q2hpbGQnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYoJCh0aGlzKS5jaGVja2JveCgnaXMgY2hlY2tlZCcpID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgZW50ZXJpbmdfYXJyLnB1c2goTnVtYmVyKCQodGhpcykuYXR0cignY3VzdG9tZXJfaWQnKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYoZW50ZXJpbmdfYXJyLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgICAgICBhbGVydCgn5pyq6YCJ5oup5Lu75L2V5L+h5oGv77yBJyk7XG4gICAgICAgIH1lbHNlIGlmKGVudGVyaW5nX2Fyci5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICQoJy5lbnRlcmluZ19tb2RlbCcpLnNob3coKTtcbiAgICAgICAgICAgICQoJy5lbnRlcmluZ19tb2RlbCAuY2FuY2VsJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJCgnLmVudGVyaW5nX21vZGVsJykuaGlkZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcuZW50ZXJpbmdfbW9kZWwgLnN1cmUnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkKCcuZW50ZXJpbmdfbW9kZWwnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOicvYXBpL3YxLjEvcmVjb21tZW5kb3JkZXIvZGVhbGVyLycgKyBkZWFsZXJfaWQgKyAnL2N1c3RvbWVyJyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZToncGF0Y2gnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTonanNvbicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgY2lkczplbnRlcmluZ19hcnIsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXRjaDoxLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW50cnlzdGF0dXM6MVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5jb2RlID09PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn5b2V5YWl5oiQ5Yqf77yBJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZEVudGVyaW5nKGVudGVyaW5nX2N1cnJlbnRfcGFnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn5b2V5YWl5aSx6LSl77yBJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g54K55Ye75Lia5Yqh5ZGY566h55CG5Ye6546w5Y+z6L655YaF5a65XG4gICAgJCgnI3NhbF9kYXRlcGlja2VyJykudmFsKHN0YXJ0RGF0ZS5nZXRNb250aCgpICsgMSArICcvJyArIHN0YXJ0RGF0ZS5nZXREYXRlKCkgKyAnLycgKyBzdGFydERhdGUuZ2V0RnVsbFllYXIoKSk7XG4gICAgJCgnI3NhbF9kYXRlcGlja2VyRW5kJykudmFsKGVuZERhdGUuZ2V0TW9udGgoKSArIDEgKyAnLycgKyBlbmREYXRlLmdldERhdGUoKSArICcvJyArIGVuZERhdGUuZ2V0RnVsbFllYXIoKSk7XG4gICAgdmFyIHN0YXJ0ID0gJyc7XG4gICAgdmFyIGVuZCA9ICcnO1xuICAgIHZhciBzYWxlc21lbkRhdGE9e307XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOicvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvZGVhbGVyLycgKyBkZWFsZXJfaWQgKyAnL3NhbGVzbWVuJyxcbiAgICAgICAgdHlwZTonZ2V0JyxcbiAgICAgICAgZGF0YVR5cGU6J2pzb24nLFxuICAgICAgICBkYXRhOntcbiAgICAgICAgICAgIHBlcl9wYWdlOjIwLFxuICAgICAgICAgICAgcGFnZTpzYWxfY3VycmVudF9wYWdlXG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6ZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBzYWxfcGFnZXMgPSBkYXRhLnBhZ2VzO1xuICAgICAgICAgICAgZm9yICh2YXIgc2FsX2sgPSAxOyBzYWxfayA8PSBzYWxfcGFnZXM7IHNhbF9rKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoc2FsX2sgPD0gNikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2FsX3NpbmdsZSA9ICQoJzxhIGhyZWY9XCJqYXZhc2NyaXB0OlwiIGNsYXNzPVwiaXRlbSBwYWdpXCIgc2lnbj1cInBhZ2lcIj4nKyBzYWxfayArJzwvYT4nKTtcbiAgICAgICAgICAgICAgICAgICAgJChcIiNzYWxfbmV4dF9wYWdlXCIpLmJlZm9yZShzYWxfc2luZ2xlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKCcuc2FsX3BhZ2luYXRpb24gLnBhZ2k6Zmlyc3QnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICBzYWxfcGFnaV9jbGljaygpO1xuICAgICAgICAgICAgc2FsZXNtYW5fY2hhbmdlKCk7XG5cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHNhbF9kYXRhKCk7XG4gICAgJCgnLnNhbGVzbWFuX21hbmFnZW1lbnQnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLm1hbmFnZW1lbnRfY29uJykuaGlkZSgpO1xuICAgICAgICBzYWxfYWpheFJlcXVlc3QoKTtcbiAgICAgICAgJCgnLnNhbGVzbWFuX21hbmFnZW1lbnRfY29uJykuc2hvdygpO1xuICAgIH0pO1xuICAgIGZ1bmN0aW9uIHNhbF9kYXRhKCl7XG4gICAgICAgIC8v5pe26Ze05Yik5patXG4gICAgICAgICAgICAvL+aXtumXtOahhueahOW8gOWni+aXtumXtFxuICAgICAgICAgICAgJCgnI3NhbF9kYXRlcGlja2VyJykub24oJ2NoYW5nZScsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBzYWxfYWpheFJlcXVlc3QoKTtcbiAgICAgICAgICAgICAgICBzYWxfY3VycmVudFBhZ2VTdGF0dXMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy/ml7bpl7TmoYbnmoTnu5PmnZ/ml7bpl7RcbiAgICAgICAgICAgICQoJyNzYWxfZGF0ZXBpY2tlckVuZCcpLm9uKCdjaGFuZ2UnLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgc2FsX2FqYXhSZXF1ZXN0KCk7XG4gICAgICAgICAgICAgICAgc2FsX2N1cnJlbnRQYWdlU3RhdHVzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2FsZXNtZW5EYXRhRnVuKHNhbF9jdXJyZW50X3BhZ2Upe1xuICAgICAgICBpZigkKCcjc2FsX2RhdGVwaWNrZXInKS52YWwoKSE9PScnICYmICQoJyNzYWxfZGF0ZXBpY2tlckVuZCcpLnZhbCgpICE9PSAnJyl7XG4gICAgICAgICAgICBzdGFydCA9IHRpbWVGaWx0ZXJzKCQoJyNzYWxfZGF0ZXBpY2tlcicpLnZhbCgpKTtcbiAgICAgICAgICAgIGVuZCA9IHRpbWVGaWx0ZXJzKCQoJyNzYWxfZGF0ZXBpY2tlckVuZCcpLnZhbCgpKTtcbiAgICAgICAgICAgIHNhbGVzbWVuRGF0YSA9IHtcbiAgICAgICAgICAgICAgICBwZXJfcGFnZToyMCxcbiAgICAgICAgICAgICAgICBwYWdlOnNhbF9jdXJyZW50X3BhZ2UsXG4gICAgICAgICAgICAgICAgc3RhcnQ6c3RhcnQsXG4gICAgICAgICAgICAgICAgZW5kOmVuZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBzYWxlc21lbkRhdGEgPSB7XG4gICAgICAgICAgICAgICAgcGVyX3BhZ2U6MjAsXG4gICAgICAgICAgICAgICAgcGFnZTpzYWxfY3VycmVudF9wYWdlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNhbF9wYWdpX2NsaWNrKCkge1xuICAgICAgICAvLyDmr4/kuIDpobVcbiAgICAgICAgJCgnLnNhbF9wYWdpbmF0aW9uJykub24oJ2NsaWNrJywnLnBhZ2knLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBzYWxfY3VycmVudF9wYWdlID0gJCh0aGlzKS5odG1sKCk7XG4gICAgICAgICAgICBzYWxfYWpheFJlcXVlc3QoKTtcbiAgICAgICAgICAgIHNhbF9jdXJyZW50UGFnZVN0YXR1cygpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyDlt6blj7Pnv7vpobVcbiAgICAgICAgJCgnLnNhbF9wYWdpbmF0aW9uIC5wcmUtcGFnZScpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBzYWxfY3VycmVudF9wYWdlID0gc2FsX2N1cnJlbnRfcGFnZSAtIDE7XG4gICAgICAgICAgICBpZiAoc2FsX2N1cnJlbnRfcGFnZSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgc2FsX2N1cnJlbnRfcGFnZSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzYWxfYWpheFJlcXVlc3QoKTtcbiAgICAgICAgICAgIHNhbF9jdXJyZW50UGFnZVN0YXR1cygpO1xuXG4gICAgICAgIH0pO1xuICAgICAgICAkKCcuc2FsX3BhZ2luYXRpb24gLm5leHQtcGFnZScpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBzYWxfY3VycmVudF9wYWdlID0gc2FsX2N1cnJlbnRfcGFnZSAtMCArIDE7XG4gICAgICAgICAgICBpZiAoc2FsX2N1cnJlbnRfcGFnZSA+PSBzYWxfcGFnZXMpIHtcbiAgICAgICAgICAgICAgICBzYWxfY3VycmVudF9wYWdlID0gc2FsX3BhZ2VzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2FsX2FqYXhSZXF1ZXN0KCk7XG4gICAgICAgICAgICBzYWxfY3VycmVudFBhZ2VTdGF0dXMoKTtcblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzYWxfY3VycmVudFBhZ2VTdGF0dXMoKSB7XG4gICAgICAgICQoJy5zYWxfcGFnaW5hdGlvbiAucGFnaScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmh0bWwoKSA9PSBzYWxfY3VycmVudF9wYWdlKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2FsX2N1cnJlbnRfcGFnZSA+PSA0ICYmIHNhbF9wYWdlcyA+IDYpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2FsX2N1cnJlbnRfcGFnZSA+PSBzYWxfcGFnZXMgLSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5zYWxfcGFnaW5hdGlvbiAucGFnaScpLmVhY2goZnVuY3Rpb24ocGFnaV9pbmRleCxwYWdpX2VsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5vd1BhZ2UgPSBzYWxfcGFnZXMgLSA1ICsgcGFnaV9pbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgICQocGFnaV9lbGUpLmh0bWwobm93UGFnZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAkKCcuc2FsX3BhZ2luYXRpb24gLnBhZ2knKS5lYWNoKGZ1bmN0aW9uKHBhZ2lfaW5kZXgscGFnaV9lbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBub3dQYWdlT3RoZXIgPSBzYWxfY3VycmVudF9wYWdlIC0gMyArIHBhZ2lfaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHBhZ2lfZWxlKS5odG1sKG5vd1BhZ2VPdGhlcik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH1cbiAgICAvLyDor7fmsYLkuJrliqHlkZjmlbDmja5cbiAgICBmdW5jdGlvbiBzYWxfYWpheFJlcXVlc3QoKSB7XG4gICAgICAgIHNhbGVzbWVuRGF0YUZ1bihzYWxfY3VycmVudF9wYWdlKTtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDonL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2RlYWxlci8nICsgZGVhbGVyX2lkICsgJy9zYWxlc21lbicsXG4gICAgICAgICAgICB0eXBlOidnZXQnLFxuICAgICAgICAgICAgZGF0YVR5cGU6J2pzb24nLFxuICAgICAgICAgICAgZGF0YTpzYWxlc21lbkRhdGEsXG4gICAgICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIHNhbF9wYWdlcyA9IGRhdGEucGFnZXM7XG4gICAgICAgICAgICAgICAgJCgnLnNhbGVzbWFuX21hbmFnZW1lbnRfY29uJykuZmluZCgndGJvZHknKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGZvcih2YXIgc2FsX24gaW4gZGF0YS5zYWxlc21lbil7XG4gICAgICAgICAgICAgICAgICAgIGlmKGRhdGEuc2FsZXNtZW5bc2FsX25dLnBob25lID09PSBudWxsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuc2FsZXNtZW5bc2FsX25dLnBob25lID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2FsZXNtYW5fdHI9XCI8dHIgY2xhc3M9J3VpIGNlbnRlciBhbGlnbmVkJz48dGQ+PGRpdiBjbGFzcz0ndWkgY2hlY2tib3gnIHNhbGVzbWFuX2lkPVwiICsgZGF0YS5zYWxlc21lbltzYWxfbl0uaWQgK1wiPjxpbnB1dCB0eXBlPSdjaGVja2JveCc+XCIgK1xuICAgICAgICAgICAgICAgICAgICBcIjxsYWJlbD48L2xhYmVsPjwvZGl2PjwvdGQ+PHRkIGNsYXNzPSdzYWxfbmFtZSc+XCIgKyBkYXRhLnNhbGVzbWVuW3NhbF9uXS5uYW1lICtcIjwvdGQ+XCIgK1xuICAgICAgICAgICAgICAgICAgICBcIjx0ZCBjbGFzcz0nc2FsX3RlbCc+XCIgKyBkYXRhLnNhbGVzbWVuW3NhbF9uXS5waG9uZSArIFwiPC90ZD48dGQgY2xhc3M9J3NhbF9hY2NvdW50Jz5cIiArIGRhdGEuc2FsZXNtZW5bc2FsX25dLnVzZXJuYW1lICsgXCI8L3RkPlwiICsgXCI8L3RkPjx0ZCBjbGFzcz0nc2FsX251bSc+XCIgKyBkYXRhLnNhbGVzbWVuW3NhbF9uXS5udW0gKyBcIjwvdGQ+XCIgK1xuICAgICAgICAgICAgICAgICAgICBcIjwvdGQ+PHRkIGNsYXNzPSdzYWxfcHJpY2UnPlwiICsgTnVtYmVyKGRhdGEuc2FsZXNtZW5bc2FsX25dLnNhbGVzKS50b0ZpeGVkKDIpICsgXCI8L3RkPlwiICtcbiAgICAgICAgICAgICAgICAgICAgXCI8dGQ+PGEgaHJlZj0nIycgY2xhc3M9J2NoYW5nZScgc2FsZXNtYW5faWQ9XCIgKyBkYXRhLnNhbGVzbWVuW3NhbF9uXS5pZCArXCI+5L+u5pS5PC9hPjwvdGQ+XCI7XG5cbiAgICAgICAgICAgICAgICAgICAgJCgnLnNhbGVzbWFuX21hbmFnZW1lbnRfY29uJykuZmluZCgndGJvZHknKS5hcHBlbmQoc2FsZXNtYW5fdHIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzYWxlc21hbl9jaGFuZ2UoKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gIC8vIOS4muWKoeWRmOeuoeeQhuS4reeahOS/ruaUuVxuICAgIGZ1bmN0aW9uIHNhbGVzbWFuX2NoYW5nZSgpIHtcbiAgICAgICAgJCgnLnNhbGVzbWFuX21hbmFnZW1lbnRfY29uJykub24oJ2NsaWNrJywnLmNoYW5nZScsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHNhbGVzbWFuX2lkID0gJCh0aGlzKS5hdHRyKCdzYWxlc21hbl9pZCcpO1xuICAgICAgICAgICAgJCgnLmNoYW5nZV9zYWxlc21hbl9tb2RlbCcpLmZpbmQoJy5tb2RlbF9zYWxlc21hbl9uYW1lX2lucHV0JykudmFsKCQoXCIuY2hhbmdlW3NhbGVzbWFuX2lkPSdcIiArIHNhbGVzbWFuX2lkICsgXCInXVwiKS5wYXJlbnRzKCd0cicpLmZpbmQoJy5zYWxfbmFtZScpLnRleHQoKSk7XG4gICAgICAgICAgICAkKCcuY2hhbmdlX3NhbGVzbWFuX21vZGVsJykuZmluZCgnLm1vZGVsX3RlbF9tZXRob2QnKS52YWwoJChcIi5jaGFuZ2Vbc2FsZXNtYW5faWQ9J1wiICsgc2FsZXNtYW5faWQgKyBcIiddXCIpLnBhcmVudHMoJ3RyJykuZmluZCgnLnNhbF90ZWwnKS50ZXh0KCkpO1xuICAgICAgICAgICAgJCgnLmNoYW5nZV9zYWxlc21hbl9tb2RlbCcpLnNob3coKTtcblxuICAgICAgICAgICAgJCgnLmNoYW5nZV9zYWxlc21hbl9tb2RlbCAub3B0X2NhbmNlbCcpLm9mZignY2xpY2snKS5vbignY2xpY2snLGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICQoJy5jaGFuZ2Vfc2FsZXNtYW5fbW9kZWwnKS5oaWRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJy5jaGFuZ2Vfc2FsZXNtYW5fbW9kZWwgLm9wdF9zdXJlJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1vZGVsX3NhbGVzbWFuX25hbWVfaW5wdXQgPSAkKCcuY2hhbmdlX3NhbGVzbWFuX21vZGVsJykuZmluZCgnLm1vZGVsX3NhbGVzbWFuX25hbWVfaW5wdXQnKS52YWwoKTtcbiAgICAgICAgICAgICAgICB2YXIgbW9kZWxfdGVsX21ldGhvZCA9ICQoJy5jaGFuZ2Vfc2FsZXNtYW5fbW9kZWwnKS5maW5kKCcubW9kZWxfdGVsX21ldGhvZCcpLnZhbCgpO1xuICAgICAgICAgICAgICAgIGlmKG1vZGVsX3NhbGVzbWFuX25hbWVfaW5wdXQgIT09ICcnICYmIG1vZGVsX3RlbF9tZXRob2QubWF0Y2gobnVtYmVyX3JlZykgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmNoYW5nZV9zYWxlc21hbl9tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDonL2FwaS92MS4xL3JlY29tbWVuZG9yZGVyL2RlYWxlci8nICsgZGVhbGVyX2lkICsgJy9zYWxlc21hbi8nICsgc2FsZXNtYW5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOidwb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOidqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpZDpzYWxlc21hbl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiQoJy5jaGFuZ2Vfc2FsZXNtYW5fbW9kZWwnKS5maW5kKCcubW9kZWxfc2FsZXNtYW5fbmFtZV9pbnB1dCcpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBob25lOiQoJy5jaGFuZ2Vfc2FsZXNtYW5fbW9kZWwnKS5maW5kKCcubW9kZWxfdGVsX21ldGhvZCcpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiQoJy5jaGFuZ2Vfc2FsZXNtYW5fbW9kZWwnKS5maW5kKCcubW9kZWxfcGFzc3dvcmQnKS52YWwoKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6ZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+S4muWKoeWRmOS/oeaBr+S/ruaUueaIkOWKn++8gScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoXCIuY2hhbmdlW3NhbGVzbWFuX2lkPSdcIiArIHNhbGVzbWFuX2lkICsgXCInXVwiKS5wYXJlbnRzKCd0cicpLmZpbmQoJy5zYWxfbmFtZScpLnRleHQoJCgnLmNoYW5nZV9zYWxlc21hbl9tb2RlbCcpLmZpbmQoJy5tb2RlbF9zYWxlc21hbl9uYW1lX2lucHV0JykudmFsKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoXCIuY2hhbmdlW3NhbGVzbWFuX2lkPSdcIiArIHNhbGVzbWFuX2lkICsgXCInXVwiKS5wYXJlbnRzKCd0cicpLmZpbmQoJy5zYWxfdGVsJykudGV4dCgkKCcuY2hhbmdlX3NhbGVzbWFuX21vZGVsJykuZmluZCgnLm1vZGVsX3RlbF9tZXRob2QnKS52YWwoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgn6K+35bCG5L+h5oGv5aGr5YaZ5a6M5pW05Y+K6KeE6IyD77yBJyk7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyDkuJrliqHlkZjnrqHnkIbkuK3mlrDlop7nlKjmiLdcbiAgICAkKCcuc2FsZXNtYW5fbWFuYWdlbWVudF9jb24gLmFkZEN1c3RvbWVyJykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLmFkZF9zYWxlc21hbl9tb2RlbCcpLnNob3coKTtcbiAgICAgICAgJCgnLmFkZF9zYWxlc21hbl9tb2RlbCAub3B0X2NhbmNlbCcpLm9mZignY2xpY2snKS5vbignY2xpY2snLGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCgnLmFkZF9zYWxlc21hbl9tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnLmFkZF9zYWxlc21hbl9tb2RlbCAub3B0X3N1cmUnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIG1vZGVsX3NhbGVzbWFuX25hbWVfaW5wdXQgPSAkKCcuYWRkX3NhbGVzbWFuX21vZGVsJykuZmluZCgnLm1vZGVsX3NhbGVzbWFuX25hbWVfaW5wdXQnKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBtb2RlbF90ZWxfbWV0aG9kID0gJCgnLmFkZF9zYWxlc21hbl9tb2RlbCcpLmZpbmQoJy5tb2RlbF90ZWxfbWV0aG9kJykudmFsKCk7XG4gICAgICAgICAgICB2YXIgbW9kZWxfYWNjb3VudCA9ICQoJy5hZGRfc2FsZXNtYW5fbW9kZWwnKS5maW5kKCcubW9kZWxfYWNjb3VudCcpLnZhbCgpO1xuICAgICAgICAgICAgaWYobW9kZWxfc2FsZXNtYW5fbmFtZV9pbnB1dCAhPT0gJycgJiYgbW9kZWxfdGVsX21ldGhvZC5tYXRjaChudW1iZXJfcmVnKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICQoJy5hZGRfc2FsZXNtYW5fbW9kZWwnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOicvYXBpL3YxLjEvcmVjb21tZW5kb3JkZXIvZGVhbGVyLycgKyBkZWFsZXJfaWQgKyAnL3NhbGVzbWFuJyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZToncHV0JyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6J2pzb24nLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6JCgnLmFkZF9zYWxlc21hbl9tb2RlbCcpLmZpbmQoJy5tb2RlbF9zYWxlc21hbl9uYW1lX2lucHV0JykudmFsKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBwaG9uZTokKCcuYWRkX3NhbGVzbWFuX21vZGVsJykuZmluZCgnLm1vZGVsX3RlbF9tZXRob2QnKS52YWwoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXNlcm5hbWU6JCgnLmFkZF9zYWxlc21hbl9tb2RlbCcpLmZpbmQoJy5tb2RlbF9hY2NvdW50JykudmFsKClcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczpmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCfkuJrliqHlkZjmt7vliqDmiJDlip/vvIEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhbF9hamF4UmVxdWVzdCgpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTpmdW5jdGlvbihYTUxIdHRwUmVxdWVzdCwgdGV4dFN0YXR1cyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihYTUxIdHRwUmVxdWVzdC5zdGF0dXMgPT09IDQwOSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCfor6XkuJrliqHlkZjotKblj7flt7LlrZjlnKjvvIEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKFhNTEh0dHBSZXF1ZXN0LnN0YXR1cyA9PT0gNTAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+ivt+Whq+WGmeS4muWKoeWRmOi0puWPt+S/oeaBr++8gScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBhbGVydCgn6K+35bCG5L+h5oGv5aGr5YaZ5a6M5pW05Y+K6KeE6IyD77yBJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyDkuJrliqHlkZjnrqHnkIbkuK3mibnph4/liKDpmaRcbiAgICAkKCcuc2FsZXNtYW5fbWFuYWdlbWVudF9kZWxldGUnKS5vbignY2xpY2snLGZ1bmN0aW9uKCkge1xuICAgICAgICBkZWxldGVfc2FsZXNtYW5fYXJyID0gW107XG4gICAgICAgICQoJy5zYWxlc21hbl9tYW5hZ2VtZW50X2NvbicpLmZpbmQoJy5jaGVja2JveCcpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZigkKHRoaXMpLmNoZWNrYm94KCdpcyBjaGVja2VkJykgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBkZWxldGVfc2FsZXNtYW5fYXJyLnB1c2goTnVtYmVyKCQodGhpcykuYXR0cignc2FsZXNtYW5faWQnKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYoZGVsZXRlX3NhbGVzbWFuX2Fyci5sZW5ndGggPT09IDApe1xuICAgICAgICAgICAgYWxlcnQoJ+acqumAieaLqeWIoOmZpOS/oeaBr++8gScpO1xuICAgICAgICB9ZWxzZSBpZihkZWxldGVfc2FsZXNtYW5fYXJyLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgJCgnLnNhbF9kZWxldGVfbW9kZWwnKS5zaG93KCk7XG4gICAgICAgICAgICAkKCcuc2FsX2RlbGV0ZV9tb2RlbCAuY2FuY2VsJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJCgnLnNhbF9kZWxldGVfbW9kZWwnKS5oaWRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJy5zYWxfZGVsZXRlX21vZGVsIC5zdXJlJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJCgnLnNhbF9kZWxldGVfbW9kZWwnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBzYWxfZGVsX2lkIGluIGRlbGV0ZV9zYWxlc21hbl9hcnIpe1xuICAgICAgICAgICAgICAgICAgICAkKFwiLnNhbGVzbWFuX21hbmFnZW1lbnRfY29uIC5jaGVja2JveFtzYWxlc21hbl9pZD0nXCIgKyBkZWxldGVfc2FsZXNtYW5fYXJyW3NhbF9kZWxfaWRdICsgXCInXVwiKS5wYXJlbnRzKCd0cicpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6Jy9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9kZWFsZXIvJyArIGRlYWxlcl9pZCArICcvc2FsZXNtYW4nLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOidkZWxldGUnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTonanNvbicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lkczpkZWxldGVfc2FsZXNtYW5fYXJyXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6ZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn5Lia5Yqh5ZGY5Yig6Zmk5oiQ5Yqf77yBJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH0pO1xuICAgIC8v5Lia5Yqh5ZGY5a+85Ye6XG4gICAgJCgnLnNhbF9leHBvcnQnKS5vbignY2xpY2snLGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcuc2FsX2V4cG9ydF9tb2RlbCcpLnNob3coKTtcbiAgICAgICAgJCgnLnNhbF9leHBvcnRfbW9kZWwgLmNhbmNlbCcpLm9mZignY2xpY2snKS5vbignY2xpY2snLGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCgnLnNhbF9leHBvcnRfbW9kZWwnKS5oaWRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCcuc2FsX2V4cG9ydF9tb2RlbCAuc3VyZScpLm9mZignY2xpY2snKS5vbignY2xpY2snLGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCgnLnNhbF9leHBvcnRfbW9kZWwnKS5oaWRlKCk7XG4gICAgICAgICAgICB2YXIgc2FsX3VybCA9ICcvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvZGVhbGVyLycgKyBkZWFsZXJfaWQgKyAnL3NhbGVzbWVuJztcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gc2FsX3VybCArICc/ZmlsZXNhdmU9MSc7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIC8vIOWVhuWTgeeuoeeQhlxuICAgICAgICAkKCcucHJvZHVjdC1tYW5hZ2VtZW50Jykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCcubWFuYWdlbWVudF9jb24nKS5oaWRlKCk7XG4gICAgICAgICAgICAkKCcucHJvZHVjdC1tYW5hZ2VtZW50LWNvbicpLnNob3coKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBjb250ZW50ID0gbmV3IFZ1ZSh7XG4gICAgICAgICAgICBlbDogXCIjcHJvZHVjdC1tYW5hZ2VtZW50LWNvblwiLFxuICAgICAgICAgICAgYmVmb3JlQ3JlYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjEvcmVjb21tZW5kb3JkZXIvZGVhbGVyL1wiICsgZGVhbGVyX2lkICsgXCIvaXRlbVwiLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYuY2F0cyA9IGRhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBjYXRzOiBbXSxcbiAgICAgICAgICAgICAgICBpdGVtczogW10sXG4gICAgICAgICAgICAgICAgc2VyaWVzSXRlbXM6W10sXG4gICAgICAgICAgICAgICAgcHJvZHVjdFNlcmllczpbXSxcbiAgICAgICAgICAgICAgICBtb3ZlQ2F0SWQ6JycsXG4gICAgICAgICAgICAgICAgbW92ZVByb2R1Y3RBcnI6W10sXG4gICAgICAgICAgICAgICAgY2hlY2tlZEFsbEZsYWc6ZmFsc2UsXG4gICAgICAgICAgICAgICAgY2hlY2tlZFNpbmdsZUZsYWc6ZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cGRhdGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICQoXCIudGVhbC5pdGVtXCIpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucG9wdXAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5saW5lOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaG92ZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXA6IFwiI1wiICsgJCh0aGlzKS5hdHRyKFwiaWRcIikgKyBcIm1lbnVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYm90dG9tIGxlZnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsYXk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93OiAxMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlkZTogMjAwXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgICAgICBzaG93SXRlbXNCeUNhdElkOiBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICBfc2VsZi5wcm9kdWN0U2VyaWVzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBfc2VsZi5jYXRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihfc2VsZi5jYXRzW2ldLmlkPT09aWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLml0ZW1zID0gX3NlbGYuY2F0c1tpXS5pdGVtcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5tb3ZlQ2F0SWQgPSBpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5jaGVja2VkU2luZ2xlRmxhZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLmNoZWNrZWRBbGxGbGFnID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNob3dJdGVtc0J5U2VyaWVzSXRlbUlkOiBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICBfc2VsZi5jaGVja2VkU2luZ2xlRmxhZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBfc2VsZi5jaGVja2VkQWxsRmxhZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gX3NlbGYuY2F0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IF9zZWxmLmNhdHNbaV0uc2VyaWVzLmxlbmd0aCAtIDE7IGogPj0gMDsgai0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgayA9IF9zZWxmLmNhdHNbaV0uc2VyaWVzW2pdLnNlcmllc19pdGVtcy5sZW5ndGggLSAxOyBrID49IDA7IGstLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihfc2VsZi5jYXRzW2ldLnNlcmllc1tqXS5zZXJpZXNfaXRlbXNba10uaWQ9PT1pZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5pdGVtcyA9IF9zZWxmLmNhdHNbaV0uc2VyaWVzW2pdLnNlcmllc19pdGVtc1trXS5pdGVtczsgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5tb3ZlQ2F0SWQgPSBpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY2hlY2tlZEFsbDpmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICBpZigkKCcucHJvZHVjdENoZWNrYm94QWxsIGlucHV0JykucHJvcCgnY2hlY2tlZCcpID09PSB0cnVlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLmNoZWNrZWRTaW5nbGVGbGFnID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLmNoZWNrZWRBbGxGbGFnID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5jaGVja2VkU2luZ2xlRmxhZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYuY2hlY2tlZEFsbEZsYWcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY2hlY2tlZFNpbmdsZTpmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbW92ZUNoaWxkQXJyID0gW107XG4gICAgICAgICAgICAgICAgICAgICQoJy5wcm9kdWN0LW1hbmFnZW1lbnQtY29uJykuZmluZCgnLnByb2R1Y3RDaGVja2JveENoaWxkJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVDaGlsZEFyci5wdXNoKCQodGhpcykuY2hlY2tib3goJ2lzIGNoZWNrZWQnKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGRDaGVja2VkTnVtID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBqIGluIG1vdmVDaGlsZEFycil7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihtb3ZlQ2hpbGRBcnJbal0gPT09IHRydWUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkQ2hlY2tlZE51bSArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmKCQoJy5wcm9kdWN0Q2hlY2tib3hDaGlsZCcpLmxlbmd0aCA9PSBjaGlsZENoZWNrZWROdW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5jaGVja2VkQWxsRmxhZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYuY2hlY2tlZFNpbmdsZUZsYWcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5jaGVja2VkQWxsRmxhZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG1vdmU6ZnVuY3Rpb24oaWQpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICBfc2VsZi5tb3ZlUHJvZHVjdEFyciA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAkKCcucHJvZHVjdC1tYW5hZ2VtZW50LWNvbicpLmZpbmQoJy5wcm9kdWN0Q2hlY2tib3hDaGlsZCcpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZigkKHRoaXMpLmNoZWNrYm94KCdpcyBjaGVja2VkJykgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5tb3ZlUHJvZHVjdEFyci5wdXNoKE51bWJlcigkKHRoaXMpLnBhcmVudHMoJ3RyJykuYXR0cignaXRlbUlkJykpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKF9zZWxmLm1vdmVQcm9kdWN0QXJyLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn6K+35YWI5Yu+6YCJ6KaB56e75Yqo55qE5ZWG5ZOB77yBJyk7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYuc2VyaWVzSXRlbXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLnByb2R1Y3RTZXJpZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBfc2VsZi5jYXRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoX3NlbGYuY2F0c1tpXS5pZD09PWlkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLm1vdmUtYmFjaycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBxID0gX3NlbGYuY2F0c1tpXS5zZXJpZXMubGVuZ3RoIC0gMTsgcSA+PSAwOyBxLS0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYucHJvZHVjdFNlcmllcy5wdXNoKF9zZWxmLmNhdHNbaV0uc2VyaWVzW3FdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGogPSBfc2VsZi5jYXRzW2ldLnNlcmllcy5sZW5ndGggLSAxOyBqID49IDA7IGotLSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGsgPSBfc2VsZi5jYXRzW2ldLnNlcmllc1tqXS5zZXJpZXNfaXRlbXMubGVuZ3RoIC0gMTsgayA+PSAwOyBrLS0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKF9zZWxmLmNhdHNbaV0uc2VyaWVzW2pdLnNlcmllc19pdGVtc1trXS5pZCA9PT0gaWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcubW92ZS1iYWNrJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGUgPSBfc2VsZi5jYXRzW2ldLnNlcmllcy5sZW5ndGggLSAxOyBlID49IDA7IGUtLSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5wcm9kdWN0U2VyaWVzLnB1c2goX3NlbGYuY2F0c1tpXS5zZXJpZXNbZV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLm1vdmUtcHJvZHVjdC1tb2RlbCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5zZXJpZXMtcHJvZHVjdC1zZWxlY3QnKS5vbignY2hhbmdlJyxmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLnNlcmllc0l0ZW1zID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IF9zZWxmLmNhdHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoX3NlbGYuY2F0c1tpXS5pZD09PWlkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgcSA9IF9zZWxmLmNhdHNbaV0uc2VyaWVzLmxlbmd0aCAtIDE7IHEgPj0gMDsgcS0tKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihfc2VsZi5jYXRzW2ldLnNlcmllc1txXS5pZCA9PT0gTnVtYmVyKCQoJy5zZXJpZXMtcHJvZHVjdC1zZWxlY3QnKS52YWwoKSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIHIgPSBfc2VsZi5jYXRzW2ldLnNlcmllc1txXS5zZXJpZXNfaXRlbXMubGVuZ3RoIC0gMTsgciA+PSAwOyByLS0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYuc2VyaWVzSXRlbXMucHVzaChfc2VsZi5jYXRzW2ldLnNlcmllc1txXS5zZXJpZXNfaXRlbXNbcl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaiA9IF9zZWxmLmNhdHNbaV0uc2VyaWVzLmxlbmd0aCAtIDE7IGogPj0gMDsgai0tKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGsgPSBfc2VsZi5jYXRzW2ldLnNlcmllc1tqXS5zZXJpZXNfaXRlbXMubGVuZ3RoIC0gMTsgayA+PSAwOyBrLS0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihfc2VsZi5jYXRzW2ldLnNlcmllc1tqXS5zZXJpZXNfaXRlbXNba10uaWQgPT09IGlkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgbSA9IF9zZWxmLmNhdHNbaV0uc2VyaWVzLmxlbmd0aCAtIDE7IG0gPj0gMDsgbS0tKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihfc2VsZi5jYXRzW2ldLnNlcmllc1ttXS5pZCA9PT0gTnVtYmVyKCQoJy5zZXJpZXMtcHJvZHVjdC1zZWxlY3QnKS52YWwoKSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIG4gPSBfc2VsZi5jYXRzW2ldLnNlcmllc1ttXS5zZXJpZXNfaXRlbXMubGVuZ3RoIC0gMTsgbiA+PSAwOyBuLS0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYuc2VyaWVzSXRlbXMucHVzaChfc2VsZi5jYXRzW2ldLnNlcmllc1ttXS5zZXJpZXNfaXRlbXNbbl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB2YXIgbW92ZVByb2R1Y3REYXRhID0ge307XG4gICAgICAgICAgICAgICAgICAgICQoJy5tb3ZlLXNhdmUnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJyxmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoJCgnLnNlcmllcy1wcm9kdWN0LXNlbGVjdCcpLnZhbCgpID09PSAnJyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCLor7fpgInmi6nllYblk4Hns7vliJfvvIFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZigkKCcuc2VyaWVzLXByb2R1Y3Qtc2VsZWN0JykudmFsKCkgPT09ICdudWxsJyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVQcm9kdWN0RGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzonc2VyaWVzaXRlbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaXRlbV9pZHMnOl9zZWxmLm1vdmVQcm9kdWN0QXJyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29wZXJhdGlvbl90eXBlJzowLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Nlcmllc19pZCc6JCgnLnNlcmllcy1wcm9kdWN0LXNlbGVjdCcpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Nlcmllc2l0ZW1faWQnOiQoJy5zZXJpZXMtaXRlbS1zZWxlY3QnKS52YWwoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3ZlUHJvZHVjdERhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6J3Nlcmllc2l0ZW0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2l0ZW1faWRzJzpfc2VsZi5tb3ZlUHJvZHVjdEFycixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdvcGVyYXRpb25fdHlwZSc6MSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzZXJpZXNfaWQnOiQoJy5zZXJpZXMtcHJvZHVjdC1zZWxlY3QnKS52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzZXJpZXNpdGVtX2lkJzokKCcuc2VyaWVzLWl0ZW0tc2VsZWN0JykudmFsKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjMvcmVjb21tZW5kb3JkZXIvZGVhbGVycy9cIiArIGRlYWxlcl9pZCArIFwiL2l0ZW1zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwYXRjaCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IG1vdmVQcm9kdWN0RGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLm1vdmUtcHJvZHVjdC1tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9pdGVtXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpaSA9IF9zZWxmLmNhdHMubGVuZ3RoIC0gMTsgaWkgPj0gMDsgaWktLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoX3NlbGYuY2F0c1tpaV0uaWQ9PT1pZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYuY2F0cyA9IGRhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5pdGVtcyA9IF9zZWxmLmNhdHNbaWldLml0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZ1ZS5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCfnp7vliqjllYblk4HmiJDlip8nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYuc2VyaWVzSXRlbXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYucHJvZHVjdFNlcmllcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgamogPSBfc2VsZi5jYXRzW2lpXS5zZXJpZXMubGVuZ3RoIC0gMTsgamogPj0gMDsgamotLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrayA9IF9zZWxmLmNhdHNbaWldLnNlcmllc1tqal0uc2VyaWVzX2l0ZW1zLmxlbmd0aCAtIDE7IGtrID49IDA7IGtrLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKF9zZWxmLmNhdHNbaWldLnNlcmllc1tqal0uc2VyaWVzX2l0ZW1zW2trXS5pZD09PWlkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5jYXRzID0gZGF0YS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLml0ZW1zID0gX3NlbGYuY2F0c1tpaV0uc2VyaWVzW2pqXS5zZXJpZXNfaXRlbXNba2tdLml0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZ1ZS5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCfnp7vliqjllYblk4HmiJDlip8nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYuc2VyaWVzSXRlbXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYucHJvZHVjdFNlcmllcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pOyAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAkKCcubW92ZS1jYW5jZWwnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJyxmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLm1vdmUtcHJvZHVjdC1tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLnNlcmllc0l0ZW1zID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5wcm9kdWN0U2VyaWVzID0gW107XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGlzYWJsZTogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciBkaXNhYmxlUHJvZHVjdERhdGEgPSB7fTtcblxuICAgICAgICAgICAgICAgICQoJy5kaXNhYmxlLXByb2R1Y3QtbW9kZWwnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgJCgnLnByb2R1Y3QtZGlzYWJsZScpLm9mZignY2xpY2snKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZVByb2R1Y3REYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnZGlzYWJsZWRmbGFnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdpdGVtX2lkJzogaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3RhdHVzJzogMVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9pdGVtXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkaXNhYmxlUHJvZHVjdERhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmRpc2FibGUtcHJvZHVjdC1tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4xL3JlY29tbWVuZG9yZGVyL2RlYWxlci9cIiArIGRlYWxlcl9pZCArIFwiL2l0ZW1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGlpID0gX3NlbGYuY2F0cy5sZW5ndGggLSAxOyBpaSA+PSAwOyBpaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgcHAgPSBfc2VsZi5jYXRzW2lpXS5pdGVtcy5sZW5ndGggLSAxOyBwcCA+PSAwOyBwcC0tKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKF9zZWxmLmNhdHNbaWldLml0ZW1zW3BwXS5pZD09PWlkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5jYXRzID0gZGF0YS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLml0ZW1zID0gX3NlbGYuY2F0c1tpaV0uaXRlbXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVnVlLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+WBnOeUqOWVhuWTgeaIkOWKnycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqaiA9IF9zZWxmLmNhdHNbaWldLnNlcmllcy5sZW5ndGggLSAxOyBqaiA+PSAwOyBqai0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrayA9IF9zZWxmLmNhdHNbaWldLnNlcmllc1tqal0uc2VyaWVzX2l0ZW1zLmxlbmd0aCAtIDE7IGtrID49IDA7IGtrLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIG1tID0gX3NlbGYuY2F0c1tpaV0uc2VyaWVzW2pqXS5zZXJpZXNfaXRlbXNba2tdLml0ZW1zLmxlbmd0aCAtIDE7IG1tID49IDA7IG1tLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoX3NlbGYuY2F0c1tpaV0uc2VyaWVzW2pqXS5zZXJpZXNfaXRlbXNba2tdLml0ZW1zW21tXS5pZD09PWlkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLmNhdHMgPSBkYXRhLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5pdGVtcyA9IF9zZWxmLmNhdHNbaWldLnNlcmllc1tqal0uc2VyaWVzX2l0ZW1zW2trXS5pdGVtcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZ1ZS5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+WBnOeUqOWVhuWTgeaIkOWKnycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkKCcucHJvZHVjdC1lbmFibGUnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVQcm9kdWN0RGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2Rpc2FibGVkZmxhZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaXRlbV9pZCc6IGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0YXR1cyc6IDBcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjEvcmVjb21tZW5kb3JkZXIvZGVhbGVyL1wiICsgZGVhbGVyX2lkICsgXCIvaXRlbVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGlzYWJsZVByb2R1Y3REYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5kaXNhYmxlLXByb2R1Y3QtbW9kZWwnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9pdGVtXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnZXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpaSA9IF9zZWxmLmNhdHMubGVuZ3RoIC0gMTsgaWkgPj0gMDsgaWktLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgcHAgPSBfc2VsZi5jYXRzW2lpXS5pdGVtcy5sZW5ndGggLSAxOyBwcCA+PSAwOyBwcC0tKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoX3NlbGYuY2F0c1tpaV0uaXRlbXNbcHBdLmlkPT09aWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYuY2F0cyA9IGRhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLml0ZW1zID0gX3NlbGYuY2F0c1tpaV0uaXRlbXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWdWUubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCflkK/nlKjllYblk4HmiJDlip8nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGpqID0gX3NlbGYuY2F0c1tpaV0uc2VyaWVzLmxlbmd0aCAtIDE7IGpqID49IDA7IGpqLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2sgPSBfc2VsZi5jYXRzW2lpXS5zZXJpZXNbampdLnNlcmllc19pdGVtcy5sZW5ndGggLSAxOyBrayA+PSAwOyBray0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIG1tID0gX3NlbGYuY2F0c1tpaV0uc2VyaWVzW2pqXS5zZXJpZXNfaXRlbXNba2tdLml0ZW1zLmxlbmd0aCAtIDE7IG1tID49IDA7IG1tLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihfc2VsZi5jYXRzW2lpXS5zZXJpZXNbampdLnNlcmllc19pdGVtc1tra10uaXRlbXNbbW1dLmlkPT09aWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5jYXRzID0gZGF0YS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5pdGVtcyA9IF9zZWxmLmNhdHNbaWldLnNlcmllc1tqal0uc2VyaWVzX2l0ZW1zW2trXS5pdGVtcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVnVlLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCflkK/nlKjllYblk4HmiJDlip8nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJCgnLnByb2R1Y3QtY2FuY2VsJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuZGlzYWJsZS1wcm9kdWN0LW1vZGVsJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhZGRTZXJpZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICAkKCcuYWRkLXNlcmllcy1tb2RlbCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNlcmllcy1zYXZlJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCQoJy5hZGQtc2VyaWVzLW5hbWUnKS52YWwoKSAhPT0gJycpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjEvcmVjb21tZW5kb3JkZXIvZGVhbGVyL1wiICsgZGVhbGVyX2lkICsgXCIvaXRlbVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncHV0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOidzZXJpZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lkJzokKCcuc2VyaWVzUGFyZW50cycpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ25hbWUnOiQoJy5hZGQtc2VyaWVzLW5hbWUnKS52YWwoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcuYWRkLXNlcmllcy1tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9pdGVtXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5jYXRzID0gZGF0YS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWdWUubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+aWsOWinuezu+WIl+aIkOWKnycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+ivt+i+k+WFpeWGheWuue+8gScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNlcmllcy1jYW5jZWwnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJyxmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmFkZC1zZXJpZXMtbW9kZWwnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYWRkU2VyaWVzUHJvZHVjdDpmdW5jdGlvbihzZXJpZXNJZCl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgICQoJy5hZGQtc2VyaWVzUHJvZHVjdC1tb2RlbCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNlcmllc1Byb2R1Y3Qtc2F2ZScpLm9mZignY2xpY2snKS5vbignY2xpY2snLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZigkKCcuYWRkLXNlcmllc1Byb2R1Y3QtbmFtZScpLnZhbCgpICE9PSAnJyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9pdGVtXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwdXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6J3Nlcmllc2l0ZW0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lkJzpzZXJpZXNJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICduYW1lJzokKCcuYWRkLXNlcmllc1Byb2R1Y3QtbmFtZScpLnZhbCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5hZGQtc2VyaWVzUHJvZHVjdC1tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4xL3JlY29tbWVuZG9yZGVyL2RlYWxlci9cIiArIGRlYWxlcl9pZCArIFwiL2l0ZW1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLmNhdHMgPSBkYXRhLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZ1ZS5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn5paw5aKe57O75YiX5ZWG5ZOB5oiQ5YqfJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn6K+36L6T5YWl5YaF5a6577yBJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAkKCcuc2VyaWVzUHJvZHVjdC1jYW5jZWwnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJyxmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmFkZC1zZXJpZXNQcm9kdWN0LW1vZGVsJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVkaXRvclNlcmllczpmdW5jdGlvbihzZXJpZXNJZCl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgICQoXCIuc2VyaWVzLW5hbWUtaW5wdXRbaW5wdXRTZXJpZXNJZD0nXCIrc2VyaWVzSWQrXCInXVwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICQoXCIuc2VyaWVzLW5hbWUtaW5wdXRbaW5wdXRTZXJpZXNJZD0nXCIrc2VyaWVzSWQrXCInXVwiKS5vbignYmx1cicsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIuc2VyaWVzLW5hbWUtaW5wdXRbaW5wdXRTZXJpZXNJZD0nXCIrc2VyaWVzSWQrXCInXVwiKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4xL3JlY29tbWVuZG9yZGVyL2RlYWxlci9cIiArIGRlYWxlcl9pZCArIFwiL2l0ZW1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6J3NlcmllcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaWQnOnNlcmllc0lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ25hbWUnOiQoXCIuc2VyaWVzLW5hbWUtaW5wdXRbaW5wdXRTZXJpZXNJZD0nXCIrc2VyaWVzSWQrXCInXVwiKS52YWwoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjEvcmVjb21tZW5kb3JkZXIvZGVhbGVyL1wiICsgZGVhbGVyX2lkICsgXCIvaXRlbVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnZXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYuY2F0cyA9IGRhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVkaXRvclNlcmllc0l0ZW06ZnVuY3Rpb24oc2VyaWVzSXRlbUlkKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9zZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgJChcIi5zZXJpZXNJdGVtLW5hbWUtaW5wdXRbaW5wdXRTZXJpZXNJdGVtSWQ9J1wiK3Nlcmllc0l0ZW1JZCtcIiddXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgJChcIi5zZXJpZXNJdGVtLW5hbWUtaW5wdXRbaW5wdXRTZXJpZXNJdGVtSWQ9J1wiK3Nlcmllc0l0ZW1JZCtcIiddXCIpLm9uKCdibHVyJyxmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAkKFwiLnNlcmllc0l0ZW0tbmFtZS1pbnB1dFtpbnB1dFNlcmllc0l0ZW1JZD0nXCIrc2VyaWVzSXRlbUlkK1wiJ11cIikuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9pdGVtXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOidzZXJpZXNpdGVtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdpZCc6c2VyaWVzSXRlbUlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ25hbWUnOiQoXCIuc2VyaWVzSXRlbS1uYW1lLWlucHV0W2lucHV0U2VyaWVzSXRlbUlkPSdcIitzZXJpZXNJdGVtSWQrXCInXVwiKS52YWwoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjEvcmVjb21tZW5kb3JkZXIvZGVhbGVyL1wiICsgZGVhbGVyX2lkICsgXCIvaXRlbVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnZXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYuY2F0cyA9IGRhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVkaXRvclByb2R1Y3RTcGVjaWZpY2F0aW9uOmZ1bmN0aW9uKHByb2R1Y3RJZCl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgICQoXCIucHJvZHVjdC1zcGVjaWZpY2F0aW9uLWlucHV0W2lucHV0UHJvZHVjdElkPSdcIitwcm9kdWN0SWQrXCInXVwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICQoXCIucHJvZHVjdC1zcGVjaWZpY2F0aW9uLWlucHV0W2lucHV0UHJvZHVjdElkPSdcIitwcm9kdWN0SWQrXCInXVwiKS5vbignYmx1cicsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgJChcIi5wcm9kdWN0LXNwZWNpZmljYXRpb24taW5wdXRbaW5wdXRQcm9kdWN0SWQ9J1wiK3Byb2R1Y3RJZCtcIiddXCIpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjEvcmVjb21tZW5kb3JkZXIvZGVhbGVyL1wiICsgZGVhbGVyX2lkICsgXCIvaXRlbVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzonc3BlY2lmaWNhdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaWQnOnByb2R1Y3RJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzcGVjaWZpY2F0aW9uJzokKFwiLnByb2R1Y3Qtc3BlY2lmaWNhdGlvbi1pbnB1dFtpbnB1dFByb2R1Y3RJZD0nXCIrcHJvZHVjdElkK1wiJ11cIikudmFsKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4xL3JlY29tbWVuZG9yZGVyL2RlYWxlci9cIiArIGRlYWxlcl9pZCArIFwiL2l0ZW1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLmNhdHMgPSBkYXRhLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlZGl0b3JQcm9kdWN0SW1hZ2U6ZnVuY3Rpb24ocHJvZHVjdElkKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9zZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgJChcIi5wcm9kdWN0LWltZy1mcm9tW2lucHV0UHJvZHVjdElkPSdcIitwcm9kdWN0SWQrXCInXVwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICQoJy51cGxvYWQtY2FuY2VsJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5wcm9kdWN0LWltZy1mcm9tJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJChcIi5wcm9kdWN0LWltZy1mcm9tXCIpLm9mZignc3VibWl0Jykub24oJ3N1Ym1pdCcsZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnByb2R1Y3QtaW1nLWZyb20nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4xL3JlY29tbWVuZG9yZGVyL2RlYWxlci9cIiArIGRlYWxlcl9pZCArIFwiL2l0ZW1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOidpbWFnZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6ZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4xL3JlY29tbWVuZG9yZGVyL2RlYWxlci9cIiArIGRlYWxlcl9pZCArIFwiL2l0ZW1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnZXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGlpID0gX3NlbGYuY2F0cy5sZW5ndGggLSAxOyBpaSA+PSAwOyBpaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgcHAgPSBfc2VsZi5jYXRzW2lpXS5pdGVtcy5sZW5ndGggLSAxOyBwcCA+PSAwOyBwcC0tKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKF9zZWxmLmNhdHNbaWldLml0ZW1zW3BwXS5pZD09PXByb2R1Y3RJZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYuY2F0cyA9IGRhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5pdGVtcyA9IF9zZWxmLmNhdHNbaWldLml0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZ1ZS5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCflm77niYfkuIrkvKDmiJDlip8nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgamogPSBfc2VsZi5jYXRzW2lpXS5zZXJpZXMubGVuZ3RoIC0gMTsgamogPj0gMDsgamotLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2sgPSBfc2VsZi5jYXRzW2lpXS5zZXJpZXNbampdLnNlcmllc19pdGVtcy5sZW5ndGggLSAxOyBrayA+PSAwOyBray0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBtbSA9IF9zZWxmLmNhdHNbaWldLnNlcmllc1tqal0uc2VyaWVzX2l0ZW1zW2trXS5pdGVtcy5sZW5ndGggLSAxOyBtbSA+PSAwOyBtbS0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKF9zZWxmLmNhdHNbaWldLnNlcmllc1tqal0uc2VyaWVzX2l0ZW1zW2trXS5pdGVtc1ttbV0uaWQ9PT1wcm9kdWN0SWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYuY2F0cyA9IGRhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLml0ZW1zID0gX3NlbGYuY2F0c1tpaV0uc2VyaWVzW2pqXS5zZXJpZXNfaXRlbXNba2tdLml0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVnVlLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn5Zu+54mH5LiK5Lyg5oiQ5YqfJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYWpheFN1Ym1pdChvcHRpb25zKTsgXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7ICAgIFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRlbGV0ZVNlcmllczpmdW5jdGlvbihzZXJpZXJJZCxzZXJpZXJMZW5ndGgpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICBpZihzZXJpZXJMZW5ndGggPT09IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4xL3JlY29tbWVuZG9yZGVyL2RlYWxlci9cIiArIGRlYWxlcl9pZCArIFwiL2l0ZW1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOidkZWxldGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOidqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOidzZXJpZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaWQnOnNlcmllcklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczpmdW5jdGlvbihkYXRhKXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4xL3JlY29tbWVuZG9yZGVyL2RlYWxlci9cIiArIGRlYWxlcl9pZCArIFwiL2l0ZW1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnZXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLmNhdHMgPSBkYXRhLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVnVlLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+ivpeezu+WIl+WIoOmZpOaIkOWKn++8gScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn6K+l57O75YiX5LiN6IO95Yig6Zmk77yBJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGVsZXRlU2VyaWVzUHJvZHVjdDpmdW5jdGlvbihzZXJpZXJQcm9kdWN0SWQsc2VyaWVyUHJvZHVjdExlbmd0aCl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIGlmKHNlcmllclByb2R1Y3RMZW5ndGggPT09IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4xL3JlY29tbWVuZG9yZGVyL2RlYWxlci9cIiArIGRlYWxlcl9pZCArIFwiL2l0ZW1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOidkZWxldGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOidqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOidzZXJpZXNpdGVtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lkJzpzZXJpZXJQcm9kdWN0SWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9pdGVtXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5jYXRzID0gZGF0YS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZ1ZS5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCfor6Xns7vliJfllYblk4HliKDpmaTmiJDlip/vvIEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7ICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCfor6Xns7vliJfllYblk4HkuI3og73liKDpmaTvvIEnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAvLyDmtLvliqjnrqHnkIZcbiAgICAkKCcuYWN0aXZlLW1hbmFnZW1lbnQnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLm1hbmFnZW1lbnRfY29uJykuaGlkZSgpO1xuICAgICAgICAkKCcuYWN0aXZlLW1hbmFnZW1lbnQtY29uJykuc2hvdygpO1xuICAgIH0pO1xuICAgIHZhciBhY3RpdmUgPSBuZXcgVnVlKHtcbiAgICAgICAgZWw6IFwiI2FjdGl2ZS1tYW5hZ2VtZW50LWNvblwiLFxuICAgICAgICBiZWZvcmVDcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIF9zZWxmID0gdGhpcztcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9hY3Rpdml0eVwiLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdnZXQnLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgX3NlbGYuYmFubmVyX2VuYWJsZWQgPSBkYXRhLmJhbm5lcmVuYWJsZWQ7XG4gICAgICAgICAgICAgICAgICAgIF9zZWxmLnBvcHVwX2VuYWJsZWQgPSBkYXRhLnBvcHVwZW5hYmxlZDtcbiAgICAgICAgICAgICAgICAgICAgX3NlbGYuYmFubmVydGh1bWJuYWlsID0gZGF0YS5iYW5uZXJ0aHVtYm5haWw7XG4gICAgICAgICAgICAgICAgICAgIF9zZWxmLmJhbm5lcmp1bXB0aHVtYm5haWwgPSBkYXRhLmJhbm5lcmp1bXB0aHVtYm5haWw7XG4gICAgICAgICAgICAgICAgICAgIF9zZWxmLnBvcHVwdGh1bWJuYWlsID0gZGF0YS5wb3B1cHRodW1ibmFpbDtcbiAgICAgICAgICAgICAgICAgICAgX3NlbGYucG9wdXBqdW1wdGh1bWJuYWlsID0gZGF0YS5wb3B1cGp1bXB0aHVtYm5haWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGJhbm5lcl9lbmFibGVkOiAwLFxuICAgICAgICAgICAgcG9wdXBfZW5hYmxlZDowLFxuICAgICAgICAgICAgYmFubmVydGh1bWJuYWlsOiAnJyxcbiAgICAgICAgICAgIGJhbm5lcmp1bXB0aHVtYm5haWw6ICcnLFxuICAgICAgICAgICAgcG9wdXB0aHVtYm5haWw6JycsXG4gICAgICAgICAgICBwb3B1cGp1bXB0aHVtYm5haWw6JydcbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgcHJldmlld0Jhbm5lcjpmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNiYW5uZXJJbWcnKS52YWwoKT09PVwiXCIpe1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIuivt+eCueWHu+KAnOmAieaLqeaWh+S7tuKAneaMiemSru+8jOmAieaLqeS4iuS8oOWbvueJhyFcIik7XG4gICAgICAgICAgICAgICAgICAgICQoJyNiYW5uZXJJbWcnKS5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBFcnJNc2dFcnJNc2cgPSBcIlwiOy8v6ZSZ6K+v5L+h5oGvXG4gICAgICAgICAgICAgICAgdmFyIGYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJhbm5lckltZ1wiKS5maWxlc1swXTtcbiAgICAgICAgICAgICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBlLnRhcmdldC5yZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIC8v5Yqg6L295Zu+54mH6I635Y+W5Zu+54mH55yf5a6e5a695bqm5ZKM6auY5bqmXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgICAgICAgICBpbWFnZS5vbmxvYWQ9ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9IGltYWdlLndpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IGltYWdlLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHdpZHRoICE9PSA0ODQgfHwgaGVpZ2h0ICE9PSAyNTgpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVyck1zZ0Vyck1zZz1cIuWbvueJh+WwuuWvuOS4jeespuWQiOimgeaxglwiOyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChFcnJNc2dFcnJNc2cpOyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9hY3Rpdml0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOidiYW5uZXJpbWFnZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczpmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9hY3Rpdml0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnZXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHsgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLmJhbm5lcnRodW1ibmFpbCA9IGRhdGEuYmFubmVydGh1bWJuYWlsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pOyAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoXCIjYmFubmVyLWZvcm1cIikuYWpheFN1Ym1pdChvcHRpb25zKTsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSAgXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGltYWdlLnNyYz0gZGF0YTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGYpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByZXZpZXdCYW5uZXJKdW1wOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIF9zZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2Jhbm5lckp1bXBJbWcnKS52YWwoKT09PVwiXCIpe1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIuivt+eCueWHu+KAnOmAieaLqeaWh+S7tuKAneaMiemSru+8jOmAieaLqeS4iuS8oOWbvueJhyFcIik7XG4gICAgICAgICAgICAgICAgICAgICQoJyNiYW5uZXJKdW1wSW1nJykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgRXJyTXNnRXJyTXNnID0gXCJcIjsvL+mUmeivr+S/oeaBr1xuICAgICAgICAgICAgICAgIHZhciBmID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYW5uZXJKdW1wSW1nXCIpLmZpbGVzWzBdO1xuICAgICAgICAgICAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IGUudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgLy/liqDovb3lm77niYfojrflj5blm77niYfnnJ/lrp7lrr3luqblkozpq5jluqZcbiAgICAgICAgICAgICAgICAgICAgdmFyIGltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICAgICAgICAgIGltYWdlLm9ubG9hZD1mdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHdpZHRoID0gaW1hZ2Uud2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gaW1hZ2UuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYod2lkdGggIT09IDY0MCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRXJyTXNnRXJyTXNnPVwi5Zu+54mH5bC65a+45LiN56ym5ZCI6KaB5rGCXCI7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KEVyck1zZ0Vyck1zZyk7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2RlYWxlci9cIiArIGRlYWxlcl9pZCArIFwiL2FjdGl2aXR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6J2Jhbm5lcmp1bXBpbWFnZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczpmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9hY3Rpdml0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnZXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHsgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLmJhbm5lcmp1bXB0aHVtYm5haWwgPSBkYXRhLmJhbm5lcmp1bXB0aHVtYm5haWw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7ICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2Jhbm5lckp1bXAtZm9ybScpLmFqYXhTdWJtaXQob3B0aW9ucyk7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgXG4gICAgICAgICAgICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2Uuc3JjPSBkYXRhO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZik7ICAgIFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByZXZpZXdQb3B1cDpmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXM7ICAgIFxuICAgICAgICAgICAgICAgIGlmICgkKCcjcG9wdXBJbWcnKS52YWwoKT09PVwiXCIpe1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIuivt+eCueWHu+KAnOmAieaLqeaWh+S7tuKAneaMiemSru+8jOmAieaLqeS4iuS8oOWbvueJh1wiKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI3BvcHVwSW1nJykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgRXJyTXNnRXJyTXNnID0gXCJcIjsvL+mUmeivr+S/oeaBr1xuICAgICAgICAgICAgICAgIHZhciBmID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3B1cEltZ1wiKS5maWxlc1swXTtcbiAgICAgICAgICAgICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBlLnRhcmdldC5yZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIC8v5Yqg6L295Zu+54mH6I635Y+W5Zu+54mH55yf5a6e5a695bqm5ZKM6auY5bqmXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgICAgICAgICBpbWFnZS5vbmxvYWQ9ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9IGltYWdlLndpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IGltYWdlLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHdpZHRoICE9PSA1MjAgfHwgaGVpZ2h0ICE9PSA2NDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVyck1zZ0Vyck1zZz1cIuWbvueJh+WwuuWvuOS4jeespuWQiOimgeaxglwiOyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChFcnJNc2dFcnJNc2cpOyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9hY3Rpdml0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOidwb3B1cGltYWdlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2RlYWxlci9cIiArIGRlYWxlcl9pZCArIFwiL2FjdGl2aXR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkgeyAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYucG9wdXB0aHVtYm5haWwgPSBkYXRhLnBvcHVwdGh1bWJuYWlsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pOyAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNwb3B1cC1mb3JtJykuYWpheFN1Ym1pdChvcHRpb25zKTsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSAgXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGltYWdlLnNyYz0gZGF0YTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGYpOyAgICAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHJldmlld1BvcHVwSnVtcDpmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXM7ICAgIFxuICAgICAgICAgICAgICAgIGlmICgkKCcjcG9wdXBKdW1wSW1nJykudmFsKCk9PT1cIlwiKXtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCLor7fngrnlh7vigJzpgInmi6nmlofku7bigJ3mjInpkq7vvIzpgInmi6nkuIrkvKDlm77niYdcIik7XG4gICAgICAgICAgICAgICAgICAgICQoJyNwb3B1cEp1bXBJbWcnKS5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBFcnJNc2dFcnJNc2cgPSBcIlwiOy8v6ZSZ6K+v5L+h5oGvXG4gICAgICAgICAgICAgICAgdmFyIGYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvcHVwSnVtcEltZ1wiKS5maWxlc1swXTtcbiAgICAgICAgICAgICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBlLnRhcmdldC5yZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIC8v5Yqg6L295Zu+54mH6I635Y+W5Zu+54mH55yf5a6e5a695bqm5ZKM6auY5bqmXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgICAgICAgICBpbWFnZS5vbmxvYWQ9ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9IGltYWdlLndpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IGltYWdlLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHdpZHRoICE9PSA2NDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVyck1zZ0Vyck1zZz1cIuWbvueJh+WwuuWvuOS4jeespuWQiOimgeaxglwiOyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChFcnJNc2dFcnJNc2cpOyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9hY3Rpdml0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOidwb3B1cGp1bXBpbWFnZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczpmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9hY3Rpdml0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnZXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHsgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLnBvcHVwanVtcHRodW1ibmFpbCA9IGRhdGEucG9wdXBqdW1wdGh1bWJuYWlsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pOyAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNwb3B1cEp1bXAtZm9ybScpLmFqYXhTdWJtaXQob3B0aW9ucyk7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBpbWFnZS5zcmM9IGRhdGE7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmKTsgXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmFubmVyQWJsZTpmdW5jdGlvbihpc1N1cmUpe1xuICAgICAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9hY3Rpdml0eVwiLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlOmlzU3VyZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJiYW5uZXJlbmFibGVkXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkgeyAgXG4gICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5iYW5uZXJfZW5hYmxlZCA9IGlzU3VyZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFZ1ZS5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoaXNTdXJlID09PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+WBnOeUqOa0u+WKqOaIkOWKn++8gScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn5ZCv55So5rS75Yqo5oiQ5Yqf77yBJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBvcHVwQWJsZTpmdW5jdGlvbihpc1N1cmUpe1xuICAgICAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9hY3Rpdml0eVwiLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlOmlzU3VyZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJwb3B1cGVuYWJsZWRcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7ICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5wb3B1cF9lbmFibGVkID0gaXNTdXJlO1xuICAgICAgICAgICAgICAgICAgICAgICAgVnVlLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpc1N1cmUgPT09IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn5YGc55So5rS75Yqo5oiQ5Yqf77yBJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCflkK/nlKjmtLvliqjmiJDlip/vvIEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xlYXJCYW5uZXJJbWc6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvZGVhbGVyL1wiICsgZGVhbGVyX2lkICsgXCIvYWN0aXZpdHlcIixcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJybWJhbm5lcmltYWdlXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7ICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2RlYWxlci9cIiArIGRlYWxlcl9pZCArIFwiL2FjdGl2aXR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5iYW5uZXJ0aHVtYm5haWwgPSBkYXRhLmJhbm5lcnRodW1ibmFpbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFZ1ZS5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCLlm77niYfmuIXpmaTmiJDlip9cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xlYXJCYW5uZXJKdW1wSW1nOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIF9zZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2RlYWxlci9cIiArIGRlYWxlcl9pZCArIFwiL2FjdGl2aXR5XCIsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTp7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOlwicm1iYW5uZXJqdW1waW1hZ2VcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHsgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvZGVhbGVyL1wiICsgZGVhbGVyX2lkICsgXCIvYWN0aXZpdHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLmJhbm5lcmp1bXB0aHVtYm5haWwgPSBkYXRhLmJhbm5lcmp1bXB0aHVtYm5haWw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBWdWUubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi5Zu+54mH5riF6Zmk5oiQ5YqfXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsZWFyUG9wdXBJbWc6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvZGVhbGVyL1wiICsgZGVhbGVyX2lkICsgXCIvYWN0aXZpdHlcIixcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJybXBvcHVwaW1hZ2VcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHsgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvZGVhbGVyL1wiICsgZGVhbGVyX2lkICsgXCIvYWN0aXZpdHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLnBvcHVwdGh1bWJuYWlsID0gZGF0YS5wb3B1cHRodW1ibmFpbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFZ1ZS5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCLlm77niYfmuIXpmaTmiJDlip9cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xlYXJQb3B1cEp1bXBJbWc6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvZGVhbGVyL1wiICsgZGVhbGVyX2lkICsgXCIvYWN0aXZpdHlcIixcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJybXBvcHVwanVtcGltYWdlXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7ICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2RlYWxlci9cIiArIGRlYWxlcl9pZCArIFwiL2FjdGl2aXR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5wb3B1cGp1bXB0aHVtYm5haWwgPSBkYXRhLnBvcHVwanVtcHRodW1ibmFpbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFZ1ZS5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCLlm77niYfmuIXpmaTmiJDlip9cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBcbn0pKHdpbmRvdy5jbUFwcCA9IHdpbmRvdy5DbUFwcCB8fCB7fSk7XG5cbiJdLCJmaWxlIjoicmVjb21tZW5kb3JkZXIvb3JkZXJfbWdtdC5qcyJ9
