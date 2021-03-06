$(function(){
    window.zhuge = window.zhuge || [];
    window.zhuge.methods = "_init debug identify track trackLink trackForm page".split(" ");
    window.zhuge.factory = function(b) {
        return function() {
            var a = Array.prototype.slice.call(arguments);
            a.unshift(b);
            window.zhuge.push(a);
            return window.zhuge;
        };
    };
    for (var i = 0; i < window.zhuge.methods.length; i++) {
        var key = window.zhuge.methods[i];
        window.zhuge[key] = window.zhuge.factory(key);
    }
    window.zhuge.load = function(b, x) {
        if (!document.getElementById("zhuge-js")) {
            var a = document.createElement("script");
            var verDate = new Date();
            var verStr = verDate.getFullYear().toString() + verDate.getMonth().toString() + verDate.getDate().toString();

            a.type = "text/javascript";
            a.id = "zhuge-js";
            a.async = !0;
            a.src = (location.protocol == 'http:' ? "http://sdk.zhugeio.com/zhuge.min.js?v=" : 'https://zgsdk.zhugeio.com/zhuge.min.js?v=') + verStr;
            var c = document.getElementsByTagName("script")[0];
            c.parentNode.insertBefore(a, c);
            window.zhuge._init(b, x);
        }
    };
    var user_role = getCookie('user_role');
    
    window.zhuge.load('9c403b77bf4b43ed9ac472c83e997331');
    if (user_role === "salesman") {
        var salesmanId = Number(window.location.href.match(/(salesman\/)\d+\//)[0].split('/')[1]);
        zhuge.identify(user_role + salesmanId,{
            '用户类型': user_role
        });
        // 规格
        $('.bod').on('click','.shop_spe',function(){
            zhuge.track('规格-B',{
                '规格名称':$(this).children().text(),
                '商品名称':$(this).parent().parent().parent().children().eq(0).children('.box').children('h3').text()
            });
        });
         //订单中心
        $('.history_return_B1').click(function(){
            zhuge.track('返回（订单中心）-B',{
                'history_return_B1':$(this).text()
            });
        });
       
        //业务员版本热门推荐页面
        $('.reco_select_all_v2').click(function(){
            zhuge.track('全选（热门推荐）-B',{
                'recommend_select_all_B1':$(this).text()
            });
        });
        $('.reco_add_v2').click(function(){
            zhuge.track('增加（热门推荐）-B',{
                'recommend_add_B1':$(this).text()
            });
        });
        $('.reco_content_recommend_v2').click(function(){
            zhuge.track('热门推荐（热门推荐）-B',{
                'recommend_content_recommend_B1':$(this).text()
            });
        });
        $('.reco_content_center_v2').click(function(){
            zhuge.track('个人中心（热门推荐）-B',{
                'recommend_content_center_B1':$(this).text()
            });
        });
        $('.reco_content_dealer_v2').click(function(){
            zhuge.track('供货商（热门推荐）-B',{
                'recommend_trolley_B1':$(this).text()
            });
        });
        $('.reco_return_v2').click(function(){
            zhuge.track('返回下单页（热门推荐）-B',{
                'recommend_return_B1':$(this).text()
            });
        });
        //购物车页面
         $('body').on('click','.trolley_shop_all_v2',function(){
            zhuge.track('全选经销商商品（购物车）-B',{
                'trolley_shop_all_B1':$(this).parent().children('.order-aa').text()
            });
        });
        $(".Bonus_B1").click(function(){
            zhuge.track('加赠品（业务员购物车）-B',{
                'Bonus_B1':$(this).text()
            });
        });
        $('body').on('click','.trolley_select_shop_v2',function(){
            zhuge.track('选择进入经销商店铺（购物车）-B',{
                'trolley_select_shop_B1':$(this).text()
            });
        });
        $('body').on('click','.trolley_select_v2',function(){
            zhuge.track('勾选商品（购物车）-B',{
                'trolley_select_B1':$(this).parent().children('.item_name').text()
            });
        });
        $('body').on('click','.trolley_modify_v2',function(){
            zhuge.track('修改商品数量（购物车）-B',{
                'trolley_modify_B1':$(this).val()
            });
        });
        $('body').on('click','.trolley_select_all_v2',function(){
            zhuge.track('全选（购物车）-B',{
                'trolley_select_all_B1':$(this).text()
            });
        });
        $('body').on('click','.trolley-modify-price-B1',function(){
            zhuge.track('修改价格（购物车）-B',{
                'trolley-modify-price-B1':$(this).text()
            });
        });
        $('.trolley_add_v2').click(function(){
            zhuge.track('下单（购物车）-B',{
                'trolley_add_B1':$(this).text()
            });
        });
        $('.trolley_content_recommend_v2').click(function(){
            zhuge.track('热门推荐（购物车）-B',{
                'trolley_content_recommend_B1':$(this).text()
            });
        });
        $('.trolley_content_center_v2').click(function(){
            zhuge.track('个人中心（购物车）-B',{
                'trolley_content_center_B1':$(this).text()
            });
        });
        $('.trolley_content_dealer_v2').click(function(){
            zhuge.track('供货商（购物车）-B',{
                'trolley_content_dealer_B1':$(this).text()
            });
        });
        
        $('body').on('click','.affirm-select-shop-B1',function(){
            zhuge.track('选择进入经销商店铺（确认订单）-B',{
                'affirm-select-shop-B1':$(this).text()
            });
        });
        $('body').on('blur','.modify-input',function(){
            zhuge.track('输入价格(修改价格) -B',{
                'modify-input':$(this).text()
            });
        });
        $('body').on('click','.modify-comfirm-input',function(){
            zhuge.track('确认输入价格(修改价格) -B',{
                'modify-comfirm-input':$('modify-input').text()
            });
        });
        $('body').on('click','.modify-select',function(){
            zhuge.track('选择价格(修改价格) -B',{
                'modify-select':$(this).text()
            });
        });
        $('body').on('click','.modify-comfirm',function(){
            zhuge.track('确认(修改价格) -B',{
                'modify-comfirm':$('modify-input').text()
            });
        });
        //确认订单页
        $('.affirm_return_v2').click(function(){
            zhuge.track('返回（确认订单）-B',{
                'affirm_select_shop_B1':$(this).text()
            });
        });
        $('.affirm_select_shop_v2').click(function(){
            zhuge.track('选择进入经销商店铺（确认订单）-B',{
                'affirm_select_shop_v2':$(this).text()
            });
        });
        $('.affirm_add_v2').click(function(){
            zhuge.track('提交（确认订单）-B',{
                'affirm_add_B1':$(this).text()
            });
        });
        $('.affirm_add_yes_v2').click(function(){
            zhuge.track('提交（弹窗）确定-B',{
                'affirm_add_yes_B1':$(this).text()
            });
        });
        $('.affirm_add_no_v2').click(function(){
            zhuge.track('提交（弹窗）取消-B',{
                'affirm_add_no_B1':$(this).text()
            });
        });
        //下单成功或失败
        $('.affirm_add_success_v2').click(function(){
             zhuge.track('下单成功（弹窗）-B',{
                'affirm_add_success_B1':$(this).text()
            });
        });
        $('.affirm_add_failure_v2').click(function(){
             zhuge.track('下单失败（弹窗）-B',{
                'affirm_add_failure_B1':$(this).text()
            });
        });
         //个人中心页
        $('.center_select_shop_v2').click(function(){
            zhuge.track('选择进入经销商店铺（个人中心）-B',{
                'center_select_shop_B1':$(this).text()
            });
        });
        $('body').on('click','.center_history_v2',function(){
            zhuge.track('查看历史记录-B',{
                'center_history_B1':$(this).text()
            });
        });
        $('body').on('click','.center_content_recommend_v2',function(){
            zhuge.track('热门推荐（个人中心）-B',{
                'center_content_recommend_B1':$(this).text()
            });
        });
        $('body').on('click','.center_content_center_v2',function(){
            zhuge.track('个人中心（个人中心）-B',{
                'center_content_center_B1':$(this).text()
            });
        });
        $('body').on('click','.center_content_dealer_v2',function(){
            zhuge.track('供货商（个人中心）-B',{
                'center_content_dealer_B1':$(this).text()
            });
        });
        $('.home-con-mid').on('click','.center_add_v2',function(){
            zhuge.track('追加商品（个人中心）-B',{
                'center_add_B1':$(this).text()
            });
        });
        $('.home-con-mid').on('click','.center_again_v2',function(){
            zhuge.track('再次购买（个人中心）-B',{
                'center_again_B1':$(this).text()
            });
        });
        //个人历史记录
        $('.history_return_v2').click(function(){
            zhuge.track('返回（历史记录）',{
                'history_return_v2':$(this).text()
            });
        });
        $('.history_select_shop_v2').click(function(){
            zhuge.track('选择进入经销商店铺（历史记录）',{
                'history_select_shop_v2':$(this).text()
            });
        });
        //追加订单和再次购买
         $('.home-con-mid').on('click','.history_add_v2',function() {
            zhuge.track('追加商品（历史记录）',{
                'history_add_v2':$(this).text()
            });
         });
         $('.home-con-mid').on('click','.history_again_v2',function() {
            zhuge.track('再次购买（历史记录）',{
                'history_again_v2':$(this).text()
            });
         });
        //订单中心
        $('.history_return_B1').click(function(){
            zhuge.track('返回（订单中心）-B',{
                'history_return_B1':$(this).text()
            });
        });
        $('.shop_search_v2').blur(function (){
            zhuge.track('搜索-B',{
                'shop_search_B1':$(this).val()
            });
        });
        $('.shop_category_v2').on('click','li',function(){
            zhuge.track('商品分类-B',{
                'shop_category_v2':$(this).html()
            });
        });
        $('.shop_ranking_comprehensive_v2').click(function(){
            zhuge.track('综合排序-B',{
                'shop_ranking_comprehensive_B1':$(this).text()
            });
        });
        $('.shop_ranking_price_v2').click(function(){
            zhuge.track('价格排序-B',{
                'shop_ranking_price_B1':$(this).text()
            });
        });
        $('.shop_ranking_sales_v2').click(function(){
            zhuge.track('销量排序-B',{
                'shop_ranking_sales_B1':$(this).text()
            });
        });
        $('#item-list').on('click','.shop_picture_v2',function(){
            zhuge.track('商品图片（经销商店铺）-B',{
                'shop_picture_B1':$(this).parent('.list-con').find('h3').html()
            });
        });
        $('#item-list').on('click','.shop_modify_v2',function (){
            zhuge.track('修改商品数量（经销商店铺）-B',{
                'shop_modify_B1':$(this).val()
            });
        });
        $('.shop_return_v2').click(function(){
            zhuge.track('返回经销商页（经销商店铺）-B',{
                'shop_return_B1':$(this).text()
            });
        });
        $('.shop_call_v2').click(function(){
            zhuge.track('拨打电话（经销商店铺）-B',{
                'shop_call_B1':$(this).text()
            });
        });
        $('.shop_call_no_v2').click(function(){
            zhuge.track('拨打电话（弹窗）取消-B',{
                'shop_call_no_B1':$(this).text()
            });
        });
        $('.shop_call_yes_v2').click(function(){
            zhuge.track('拨打电话（弹窗）确定-B',{
                'shop_call_yes_B1':$(this).text()
            });
        });
        $('.shop_trolley_v2').click(function(){
            zhuge.track('购物车（经销商店铺）-B',{
                'shop_trolley_B1':$(this).text()
            });
            zhuge.track('来源(经销商店铺）-B',{
                'source_B1':$(this).parents('.home-info-nav').find('#dealer_name').html()
            });
        });
         //设置页面
        $('.set_return_B1').click(function(){
            zhuge.track('返回（设置）-B',{
                'set_return_B1':$(this).text()
            });
        });
        $('.set_help_B1').click(function(){
            zhuge.track('帮助中心（设置）-B',{
                'set_help_B1':$(this).text()
            });
        });
        $('.set_exit_B1').click(function(){
            zhuge.track('退出账号（设置）-B',{
                'set_exit_B1':$(this).text()
            });
        });
        $('.set-info').on('click','.set_help_question_B1',function(){
            zhuge.track('选择问题-B',{
                'set_help_question_B1':$(this).find('.help_question span').html()
            });
        });
        //下单页面
        $('.order-showtime-v3').on('click', function () {
            zhuge.track('展示时间筛选(下单)',{
                'order-showtime-v3': '展示时间筛选(下单)'
            });
        });
        $('.order-search-v3').on('blur', function () {
            zhuge.track('搜索(下单)',{
                '搜索内容': $(this).val()
            });
        });
    }
    //超萌业务员首页
    $('.expansion_B1').click(function(){
        zhuge.track('拓展(首页)-B',{
            'function_expansion_B1':$(this).text()
        });
    });
    $('.sgin_B1').click(function(){
        zhuge.track('下单(首页)-B',{
            'functon_sgin_B1':$(this).text()
        });
    });
    $('.bagman_B1').click(function(){
        zhuge.track('车销-B',{
            'function_bagman_B1':$(this).text()
        });
    });
    $('.set-B1').click(function(){
        zhuge.track('设置(首页)-B',{
            'function_set_B1':$(this).text()
        });
    });
    $('.history_B1').click(function(){
        zhuge.track('订单历史(首页)-B',{
            'function_history_B1':$(this).text()
        });
    });
    //拓展门店页
     $('body').on('click','.expansion_return_B1',function(){
        zhuge.track('返回（巡店）-B',{
            'expansion_return_B1':$(this).text()
        });
    });
    $('body').on('click','.expansion_here_B1',function(){
        zhuge.track('去这里（巡店）-B',{
            'expansion_here_B1':$(this).text()
        });
    });
    $('body').on('click','#expansion-bars-B1',function(){
        zhuge.track('Bars（巡店）-B',{
            'expansion-bars-B1':$(this).text()
        });
    });
    $('body').on('click','#expansion-entry-B1',function(){
        zhuge.track('录入商家（巡店）-B',{
            'expansion-entry-B1':$(this).text()
        });
    });
    $('body').on('click','#expansion-account-B1',function(){
        zhuge.track('生成账号（巡店）-B',{
            'expansion-account-B1':$(this).text()
        });
    });
    //门店导航
    $('.shop_return_B1').click(function(){
        zhuge.track('返回（门店导航）-B',{
            'shop_return_B1':$(this).text()
        });
    });
    $('.shop_bus_B1').click(function(){
        zhuge.track('公交（门店导航） -B',{
            'shop_bus_B1':$(this).text()
        });
    });
    $('.shop_car_B1').click(function(){
        zhuge.track('驾车 （门店导航）-B',{
            'shop_car_B1':$(this).text()
        });
    });
    $('.shop_food_B1').click(function(){
        zhuge.track('步行 （门店导航）-B',{
            'shop_food_B1':$(this).text()
        });
    });
    //录入商家 
    $('#entry-return-B1').click(function(){
        zhuge.track('返回（录入商家）-B',{
            '地址':$("#address").text(),
            '店名':$("#store_name").val(),
            '联系方式':$("#tel").val(),
            '联系人':$("#tel_people").val(),
            '备注':$("#ps").val()
        });
    });
    $('.entry-name-B1').blur(function(){
        zhuge.track('店名（录入商家）-B',{
            '地址':$("#address").text(),
            '店名':$("#store_name").val(),
            '联系方式':$("#tel").val(),
            '联系人':$("#tel_people").val(),
            '备注':$("#ps").val()
        });
    });
    $('.entry-tel-B1').blur(function(){
        zhuge.track('联系方式（录入商家）-B',{
            '地址':$("#address").text(),
            '店名':$("#store_name").val(),
            '联系方式':$("#tel").val(),
            '联系人':$("#tel_people").val(),
            '备注':$("#ps").val()
        });
    });
    $('.entry-contacts-B1').blur(function(){
        zhuge.track('联系人（录入商家）-B',{
            '地址':$("#address").text(),
            '店名':$("#store_name").val(),
            '联系方式':$("#tel").val(),
            '联系人':$("#tel_people").val(),
            '备注':$("#ps").val()
        });
    });
    $('.entry-remarks-B1').blur(function(){
        zhuge.track('备注（录入商家）-B',{
            '地址':$("#address").text(),
            '店名':$("#store_name").val(),
            '联系方式':$("#tel").val(),
            '联系人':$("#tel_people").val(),
            '备注':$("#ps").val()
        });
    });
    $('.entry-submit-B1').blur(function(){
        zhuge.track('提交（录入商家）-B',{
            '地址':$("#address").text(),
            '店名':$("#store_name").val(),
            '联系方式':$("#tel").val(),
            '联系人':$("#tel_people").val(),
            '备注':$("#ps").val()
        });
    });
    $('#entry-confirmation-return-B1').click(function(){
        zhuge.track('返回（录入商家确认页）-B',{
            '地址':$("#address").text(),
            '店名':$("#store_name").val(),
            '联系方式':$("#tel").val(),
            '联系人':$("#tel_people").val(),
            '备注':$("#ps").val()
        });
    });
    $('#entry-confirmation-cancel-B1').click(function(){
        zhuge.track('取消（录入商家确认页）-B',{
            '地址':$("#address").text(),
            '店名':$("#store_name").val(),
            '联系方式':$("#tel").val(),
            '联系人':$("#tel_people").val(),
            '备注':$("#ps").val()
        });
    });
    $('#entry-confirmation-back-B1').click(function(){
        zhuge.track('确认（录入商家确认页）-B',{
            '地址':$("#address").text(),
            '店名':$("#store_name").val(),
            '联系方式':$("#tel").val(),
            '联系人':$("#tel_people").val(),
            '备注':$("#ps").val()
        });
    });
    
    $('.entry-confirmation-popup-success-B1').click(function(){
        zhuge.track('新增成功（录入商家确认页）-B',{
            '地址':$("#address").text(),
            '店名':$("#store_name").val(),
            '联系方式':$("#tel").val(),
            '联系人':$("#tel_people").val(),
            '备注':$("#ps").val()
        });
    });
    $('.entry-confirmation-popup-success-B1').click(function(){
        zhuge.track('新增失败（录入商家确认页）-B',{
            '地址':$("#address").text(),
            '店名':$("#store_name").val(),
            '联系方式':$("#tel").val(),
            '联系人':$("#tel_people").val(),
            '备注':$("#ps").val()
        });
    });
    //生成账号
    $('#account-back-B1').click(function(){
        zhuge.track('返回（生成账号）-B',{
            'ccount-back-B1':$(this).text()
        });
    });
    $('.account-search-B1').blur(function(){
        zhuge.track('搜索（生成账号）-B',{
            '搜索内容':$(this).val()
        });
    });
    $('.account-generate-B1').click(function(){
        zhuge.track('生成（生成账号）-B',{
            '生成账号':$(this).parent().children('.left').children('.customer-name').text()
        });
    });
    $('#generate-input-B1').click(function(){
        zhuge.track('输入账号（填写生成账号）-B',{
            '账号':$('#generate-input-B1').val()
        });
    });
    $('#generate-enter-statement-B1').click(function(){
        zhuge.track('进入声明（填写生成账号）-B',{
            '声明':'声明'
        });
    });
    $('#generate-cancel-B1').click(function(){
        zhuge.track('取消（填写生成账号）-B',{
            '账号':$('#generate-input-B1').val()
        });
    });
    $('#generate-confirm-B1').click(function(){
        zhuge.track('生成（填写生成账号）-B',{
            '账号':$('#generate-input-B1').val()
        });
    });
    $('#generate-affirm-B1').click(function(){
        zhuge.track('确认（免责声明）-B',{
            '免责声明':'免责声明'
        });
    });
    $('#cheak-account-cancel-B1').click(function(){
        zhuge.track('取消（填写生成账号）-B',{
            '账号':$('#generate-input-B1').val()
        });
    });
    $('#cheak-account-comfirm-B1').click(function(){
        zhuge.track('取消（填写生成账号）-B',{
            '账号':$('#generate-input-B1').val()
        });
    });
    $('body').on('click','.account-status-success',function(){
        zhuge.track('成功（生成账号）-B',{
            '成功':'成功'
        });
    });
    $('body').on('click','.account-status-fail',function(){
        zhuge.track('激活成功（生成账号完成）-B',{
            '激活成功':'激活成功'
        });
    });
    $('.generate-cheak-statement-B1').click(function(){
        zhuge.track('勾选声明（填写生成账号）-B',{
            '成功':'成功'
        });
    });
    //签到下单页面
    $('.sign_return_B1').click(function(){
        zhuge.track('返回（签到下单）-B',{
            'sign_return_B1':$(this).text()
        });
    });
    $('.sign_sign_B1').click(function(){
        zhuge.track('签到-B',{
            'sign_sign_B1':$(this).text()
        });
    });
    $('.sign_history_B1').click(function(){
        zhuge.track('签到历史-B',{
            'sign_history_B1':$(this).text()
        });
    });
    // 门店
    if (user_role === "customer") {
        var customerId = Number(window.location.href.match(/(customer\/)\d+\//)[0].split('/')[1]);
        zhuge.identify(user_role + customerId,{
            '用户类型': user_role
        });
        // 规格
        $('.bod').on('click','.shop_spe',function(){
            zhuge.track('规格',{
                '规格名称':$(this).children().text(),
                '商品名称':$(this).parent().parent().parent().children().eq(0).children('.box').children('h3').text()
            });
        });
        //推荐商品页
        $(".reco_shop_all_v2").click(function(){
            zhuge.track('全选经销商推荐商品 （热门推荐）',{
                'recommend_shop_all_v2':$(this).parent().children('.order-aa').text()
            });
        });
        $('.reco_select_shop_v2').click(function(){
            zhuge.track('选择进入推荐经销商 （热门推荐）',{
                'recommend_select_shop_v2':$(this).text()
            });
        });
        $('.reco_select_v2').click(function(){
            zhuge.track('勾选商品（热门推荐）',{
                'recommend_select_v2':$(this).parent().children('.item_name').text()
            });
        });
        $('.reco_picture_v2').click(function(){
            zhuge.track('商品图片（热门推荐）',{
                'recommend_picture_v2':$(this).parent().children('.item_name').text()
            });
        });
        $('.reco_modify_v2').blur(function (){
            zhuge.track('修改商品数量（热门推荐）',{
                'recommend_modify_v2':$(this).val()
            });
        });
        $('.reco_select_all_v2').click(function(){
            zhuge.track('全选（热门推荐）',{
                'recommend_select_all_v2':$(this).text()
            });
        });
        $('.reco_add_v2').click(function(){
            zhuge.track('增加（热门推荐）',{
                'recommend_add_v2':$(this).text()
            });
        });
        $('.reco_content_recommend_v2').click(function(){
            zhuge.track('热门推荐（热门推荐）',{
                'recommend_content_recommend_v2':$(this).text()
            });
        });
        $('.reco_content_center_v2').click(function(){
            zhuge.track('个人中心(热门推荐）',{
                'recommend_content_center_v2':$(this).text()
            });
        });
        $('.reco_content_dealer_v2').click(function(){
            zhuge.track('供货商（热门推荐）',{
                'recommend_content_dealer_v2':$(this).text()
            });
        });
        //经销商页
        $('.deal_select_v2').click(function(){
            zhuge.track('选择进入经销商店铺页面 （经销商）',{
                'dealer_select_v2':$(this).children('.department').text()
            });
        });
        $('.deal_content_recommend_v2').click(function(){
            zhuge.track('热门推荐（经销商）',{
                'dealer_content_recommend_v2':$(this).text()
            });
        });
        $('.deal_content_dealer_v2').click(function(){
            zhuge.track('供货商（经销商）',{
                'dealer_content_dealer_v2':$(this).text()
            });
        });
        $('.deal_content_center_v2').click(function(){
            zhuge.track('个人中心（经销商）',{
                'dealer_content_center_v2':$(this).text()
            });
        });
        $('.deal_return_v2').click(function(){
            zhuge.track('返回下单页（经销商）',{
                'dealer_return_v2':$(this).text()
            });
        });
        //经销商店铺页面
        $('.shop_search_v2').blur(function (){
            zhuge.track('搜索',{
                'shop_search_v2':$(this).val()
            });
        });
        $('.shop_category_v2').on('click','li',function(){
            zhuge.track('商品分类',{
                'shop_category_v2':$(this).text()
            });
        });
        $('.shop_ranking_comprehensive_v2').click(function(){
            zhuge.track('综合排序',{
                'shop_ranking_comprehensive_v2':$(this).text()
            });
        });
        $('.shop_ranking_price_v2').click(function(){
            zhuge.track('价格排序',{
                'shop_ranking_price_v2':$(this).text()
            });
        });
        $('.shop_ranking_sales_v2').click(function(){
            zhuge.track('销量排序',{
                'shop_ranking_sales_v2':$(this).text()
            });
        });
        $('.shop_promotion_v2').click(function(){
            zhuge.track('促销广告',{
                'shop_promotion_v2':$(this).text()
            });
        });
        $('.bod').on('click','.shop_picture_v2',function(){
            zhuge.track('商品图片（经销商店铺）',{
                'shop_picture_v2':$(this).parent().children('h3').text()
            });
        });
        $('.bod').on('click','.shop_modify_v2',function(){
            zhuge.track('修改商品数量（经销商店铺）',{
                'shop_modify_v2':$(this).val()
            });
        });
        $('.bod').on('click','.shop_return_v2',function(){
            zhuge.track('返回经销商页（经销商店铺）',{
                'shop_return_v2':$(this).text()
            });
        });
        $('.shop_call_v2').click(function(){
            zhuge.track('拨打电话（经销商店铺）',{
                'shop_call_v2':$(this).text()
            });
        });
        $('.shop_call_no_v2').click(function(){
            zhuge.track('拨打电话（弹窗）取消',{
                'shop_call_no_v2':$(this).text()
            });
        });
        $('.shop_call_yes_v2').click(function(){
            zhuge.track('拨打电话（弹窗）确定',{
                'shop_call_yes_v2':$(this).text()
            });
        });
        $('.shop_trolley_v2').click(function(){
            zhuge.track('购物车（经销商店铺）',{
                'shop_trolley_v2':$(this).text()
            });
            zhuge.track('来源(经销商店铺',{
                'source_v2':$(this).parents('.home-info-nav').find('#dealer_name').html()
            });
        });
        //购物车页面
        $("#main").on('click','.trolley_shop_all_v2',function(){
            zhuge.track('全选经销商商品（购物车）',{
                'trolley_shop_all_v2':$(this).parent().children('.order-aa').text()
            });
        });
        $("#main").on('click','.trolley_select_shop_v2',function(){
            zhuge.track('选择进入经销商店铺（购物车）',{
                'trolley_select_shop_v2':$(this).text()
            });
        });
        $("#main").on('click','.trolley_select_v2',function(){
            zhuge.track('勾选商品（购物车）',{
                'trolley_select_v2':$(this).parent().children('.item_name').text()
            });
        });
        $("#main").on('click','.trolley_picture_v2',function(){
            zhuge.track('商品图片（购物车）',{
                'trolley_picture_v2':$(this).parent().children('.item_name').text()
            });
        });
        $("#main").on('click','.trolley_modify_v2',function(){
            zhuge.track('修改商品数量（购物车）',{
                'trolley_modify_v2':$(this).val()
            });
        });
        $("#main").on('click','.trolley_select_all_v2',function(){
            zhuge.track('全选（购物车）',{
                'trolley_select_all_v2':$(this).text()
            });
        });
        $('.trolley_add_v2').click(function(){
            zhuge.track('下单（购物车）',{
                'trolley_add_v2':$(this).text()
            });
        });
        $('.trolley_content_recommend_v2').click(function(){
            zhuge.track('热门推荐（购物车）',{
                'trolley_content_recommend_v2':$(this).text()
            });
        });
        $('.trolley_content_center_v2').click(function(){
            zhuge.track('个人中心（购物车）',{
                'trolley_content_center_v2':$(this).text()
            });
        });
        $('.trolley_content_dealer_v2').click(function(){
            zhuge.track('供货商（购物车）',{
                'trolley_content_dealer_v2':$(this).text()
            });
        });
        //确认订单页
        $('.affirm_return_v2').click(function(){
            zhuge.track('返回（确认订单）',{
                'affirm_return_v2':$(this).text()
            });
        });
        $('body').on('click','.affirm_select_shop_v2',function(){
            zhuge.track('选择进入经销商店铺（确认订单）',{
                'affirm_select_shop_v2':$(this).text()
            });
        });
        $('.affirm_add_v2').click(function(){
            zhuge.track('提交（确认订单）',{
                'affirm_add_v2':$(this).text()
            });
        });
        $('.affirm_add_yes_v2').click(function(){
            zhuge.track('提交（弹窗）确定',{
                '门店名称':$('.name').text(),
                '下单金额':$('.xiadan_sum').text(),
                '经销商名称':$('.delname').text()
            });
        });
        $('.affirm_add_no_v2').click(function(){
            zhuge.track('提交（弹窗）取消',{
                'affirm_add_no_v2':$(this).text()
            });
        });
        //下单成功或失败
        $('.affirm_add_success_v2').click(function(){
             zhuge.track('下单成功（弹窗）',{
                'affirm_add_success_v2':$(this).text()
            });
        });
        $('.affirm_add_failure_v2').click(function(){
             zhuge.track('下单失败（弹窗）',{
                'affirm_add_failure_v2':$(this).text()
            });
        });
        //个人中心页
        $('.center_select_shop_v2').click(function(){
            zhuge.track('选择进入经销商店铺（个人中心）',{
                'center_select_shop_v2':$(this).text()
            });
        });
        $('body').on('click','.center_history_v2',function(){
            zhuge.track('查看历史记录',{
                'center_history_v2':$(this).text()
            });
        });
        $('body').on('click','.center_content_recommend_v2',function(){
            zhuge.track('热门推荐（个人中心）',{
                'center_content_recommend_v2':$(this).text()
            });
        });
        $('body').on('click','.center_content_center_v2',function(){
            zhuge.track('个人中心（个人中心）',{
                'center_content_center_v2':$(this).text()
            });
        });
        $('body').on('click','.center_content_dealer_v2',function(){
            zhuge.track('供货商（个人中心）',{
                'center_content_dealer_v2':$(this).text()
            });
        });
        $('.home-con-mid').on('click','.center_add_v2',function(){
            zhuge.track('追加商品（个人中心）',{
                'center_add_v2':$(this).text()
            });
        });
        $('.home-con-mid').on('click','.center_again_v2',function(){
            zhuge.track('再次购买（个人中心）',{
                'center_again_v2':$(this).text()
            });
        });
        //个人历史记录
        $('.history_return_v2').click(function(){
            zhuge.track('返回（历史记录）',{
                'history_return_v2':$(this).text()
            });
        });
        $('body').on('click','.history_select_shop_v2',function(){
            zhuge.track('选择进入经销商店铺（历史记录）',{
                'history_select_shop_v2':$(this).text()
            });
        });
        //追加订单和再次购买
         $('.home-con-mid').on('click','.history_add_v2',function() {
            zhuge.track('追加商品（历史记录）',{
                'history_add_v2':$(this).text()
            });
         });
         $('.home-con-mid').on('click','.history_again_v2',function() {
            zhuge.track('再次购买（历史记录）',{
                'history_again_v2':$(this).text()
            });
         });
        //搜索页
        $('.search_picture_v2').click(function(){
            zhuge.track('商品图片（搜索页）',{
                'search_picture_v2':$(this).parent().children('h3').text()
            });
        });
        $('.search_modify_v2').blur(function (){
            zhuge.track('修改商品数量（搜索页）',{
                'search_modify_v2':$(this).val(),
                '商品名称':$(this).parents('.box').children('h3').text()
            });
        });
        //登录页面
        // $('.login_entry_all_v2').click(function(){
        //     zhuge.identify("$(this).parents('.content').find('#username').val()",{
        //         'login_entry_all_v2':$(this).parents('.content').find('#username').val()
        //     });
        // });
        $('body').on('click','.plain_code_v2',function(){
            zhuge.track('密码明码',{
                'plain_code_v2':$(this).text()
            });
        });
        $('body').on('click','.forget_password_v2',function(){
            zhuge.track('忘记密码',{
                'forget_password_v2':$(this).text()
            });
        });
        $('.registration_v2').click(function(){
            zhuge.track('注册',{
                'registration_v2':$(this).text()
            });
        });
        //忘记密码页面
        $('.Get_verification_code_v2').click(function(){
            zhuge.track('获取验证码（重置）',{
                'Get_verification_code_v2':$(this).text()
            });
        });
        $('.verification_v2').click(function(){
            zhuge.track('验证（重置）',{
                'verification_v2':$(this).text()
            });
        });
        //重置密码
        $('.Reset_Password_v2').click(function(){
            zhuge.track('重置密码',{
                'Reset_Password_v2':$(this).text()
            });
        });
        //注册账户页面
        $('.Get_verification_code_register_v2').click(function(){
            zhuge.track('获取验证码（注册）',{
                'Get_verification_code_register_v2':$(this).text()
            });
        });
        $('.register_v2').click(function(){
            zhuge.track('注册（注册）',{
                'register_v2':$(this).text()
            });
        });
    }
    if (user_role === "dealer") {
        var dealerId = Number(window.location.href.match(/(dealer\/)\d+\//)[0].split('/')[1]);
        zhuge.identify(user_role + dealerId,{
            '用户类型': user_role
        });
    }
   
});
