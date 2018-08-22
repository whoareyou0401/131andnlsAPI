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
    window.zhuge.load('ddfc5dd92e9a492997200c2ec18adb2e');
    if (user_role!=="salesman") {
        
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
    $('.reco_trolley_v2').click(function(){
        zhuge.track('购物车（热门推荐）',{
            'recommend_trolley_v2':$(this).text()
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
    $('.shop_picture_v2').click(function(){
        zhuge.track('商品图片（经销商店铺）',{
            'shop_picture_v2':$(this).parent().children('h3').text()
        });
    });
    $('.shop_modify_v2').blur(function (){
        zhuge.track('修改商品数量（经销商店铺）',{
            'shop_modify_v2':$(this).val()
        });
    });
    $('.shop_return_v2').click(function(){
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
    $(".trolley_shop_all_v2").click(function(){
        zhuge.track('全选经销商商品（购物车）',{
            'trolley_shop_all_v2':$(this).parent().children('.order-aa').text()
        });
    });
    $('.trolley_select_shop_v2').click(function(){
        zhuge.track('选择进入经销商店铺（购物车）',{
            'trolley_select_shop_v2':$(this).text()
        });
    });
    $('.trolley_select_v2').click(function(){
        zhuge.track('勾选商品（购物车）',{
            'trolley_select_v2':$(this).parent().children('.item_name').text()
        });
    });

    $('.trolley_picture_v2').click(function(){
        zhuge.track('商品图片（购物车）',{
            'trolley_picture_v2':$(this).parent().children('.item_name').text()
        });
    });
    $('.trolley_modify_v2').blur(function (){
        zhuge.track('修改商品数量（购物车）',{
            'trolley_modify_v2':$(this).val()
        });
    });
    $('.trolley_select_all_v2').click(function(){
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
    $('.affirm_select_shop_v2').click(function(){
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
    $('.center_history_v2').click(function(){
        zhuge.track('查看历史记录',{
            'center_history_v2':$(this).text()
        });
    });
    $('.center_content_recommend_v2').click(function(){
        zhuge.track('热门推荐（个人中心）',{
            'center_content_recommend_v2':$(this).text()
        });
    });
    $('.center_content_center_v2').click(function(){
        zhuge.track('个人中心（个人中心）',{
            'center_content_center_v2':$(this).text()
        });
    });
    $('.center_content_dealer_v2').click(function(){
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
    $('.plain_code_v2').click(function(){
        zhuge.track('密码明码',{
            'plain_code_v2':$(this).text()
        });
    });
    $('.forget_password_v2').click(function(){
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
        console.log(8);
        zhuge.track('注册（注册）',{
            'register_v2':$(this).text()
        });
    });

    }
    


});
