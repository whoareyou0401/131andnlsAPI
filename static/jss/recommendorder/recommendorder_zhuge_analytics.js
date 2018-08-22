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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlcl96aHVnZV9hbmFseXRpY3MuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJChmdW5jdGlvbigpe1xuXHQgd2luZG93LnpodWdlID0gd2luZG93LnpodWdlIHx8IFtdO1xuICAgIHdpbmRvdy56aHVnZS5tZXRob2RzID0gXCJfaW5pdCBkZWJ1ZyBpZGVudGlmeSB0cmFjayB0cmFja0xpbmsgdHJhY2tGb3JtIHBhZ2VcIi5zcGxpdChcIiBcIik7XG4gICAgd2luZG93LnpodWdlLmZhY3RvcnkgPSBmdW5jdGlvbihiKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBhID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIGEudW5zaGlmdChiKTtcbiAgICAgICAgICAgIHdpbmRvdy56aHVnZS5wdXNoKGEpO1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy56aHVnZTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd2luZG93LnpodWdlLm1ldGhvZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGtleSA9IHdpbmRvdy56aHVnZS5tZXRob2RzW2ldO1xuICAgICAgICB3aW5kb3cuemh1Z2Vba2V5XSA9IHdpbmRvdy56aHVnZS5mYWN0b3J5KGtleSk7XG4gICAgfVxuICAgIHdpbmRvdy56aHVnZS5sb2FkID0gZnVuY3Rpb24oYiwgeCkge1xuICAgICAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiemh1Z2UtanNcIikpIHtcbiAgICAgICAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgICAgIHZhciB2ZXJEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHZhciB2ZXJTdHIgPSB2ZXJEYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArIHZlckRhdGUuZ2V0TW9udGgoKS50b1N0cmluZygpICsgdmVyRGF0ZS5nZXREYXRlKCkudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgYS50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcbiAgICAgICAgICAgIGEuaWQgPSBcInpodWdlLWpzXCI7XG4gICAgICAgICAgICBhLmFzeW5jID0gITA7XG4gICAgICAgICAgICBhLnNyYyA9IChsb2NhdGlvbi5wcm90b2NvbCA9PSAnaHR0cDonID8gXCJodHRwOi8vc2RrLnpodWdlaW8uY29tL3podWdlLm1pbi5qcz92PVwiIDogJ2h0dHBzOi8vemdzZGsuemh1Z2Vpby5jb20vemh1Z2UubWluLmpzP3Y9JykgKyB2ZXJTdHI7XG4gICAgICAgICAgICB2YXIgYyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpWzBdO1xuICAgICAgICAgICAgYy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShhLCBjKTtcbiAgICAgICAgICAgIHdpbmRvdy56aHVnZS5faW5pdChiLCB4KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgIHZhciB1c2VyX3JvbGUgPSBnZXRDb29raWUoJ3VzZXJfcm9sZScpO1xuICAgIHdpbmRvdy56aHVnZS5sb2FkKCdkZGZjNWRkOTJlOWE0OTI5OTcyMDBjMmVjMThhZGIyZScpO1xuICAgIGlmICh1c2VyX3JvbGUhPT1cInNhbGVzbWFuXCIpIHtcbiAgICAgICAgXG4gICAgLy8g6KeE5qC8XG4gICAgJCgnLmJvZCcpLm9uKCdjbGljaycsJy5zaG9wX3NwZScsZnVuY3Rpb24oKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+inhOagvCcse1xuICAgICAgICAgICAgJ+inhOagvOWQjeensCc6JCh0aGlzKS5jaGlsZHJlbigpLnRleHQoKSxcbiAgICAgICAgICAgICfllYblk4HlkI3np7AnOiQodGhpcykucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuY2hpbGRyZW4oKS5lcSgwKS5jaGlsZHJlbignLmJveCcpLmNoaWxkcmVuKCdoMycpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAvL+aOqOiNkOWVhuWTgemhtVxuICAgICQoXCIucmVjb19zaG9wX2FsbF92MlwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB6aHVnZS50cmFjaygn5YWo6YCJ57uP6ZSA5ZWG5o6o6I2Q5ZWG5ZOBIO+8iOeDremXqOaOqOiNkO+8iScse1xuICAgICAgICAgICAgJ3JlY29tbWVuZF9zaG9wX2FsbF92Mic6JCh0aGlzKS5wYXJlbnQoKS5jaGlsZHJlbignLm9yZGVyLWFhJykudGV4dCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJy5yZWNvX3NlbGVjdF9zaG9wX3YyJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+mAieaLqei/m+WFpeaOqOiNkOe7j+mUgOWVhiDvvIjng63pl6jmjqjojZDvvIknLHtcbiAgICAgICAgICAgICdyZWNvbW1lbmRfc2VsZWN0X3Nob3BfdjInOiQodGhpcykudGV4dCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJy5yZWNvX3NlbGVjdF92MicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHpodWdlLnRyYWNrKCfli77pgInllYblk4HvvIjng63pl6jmjqjojZDvvIknLHtcbiAgICAgICAgICAgICdyZWNvbW1lbmRfc2VsZWN0X3YyJzokKHRoaXMpLnBhcmVudCgpLmNoaWxkcmVuKCcuaXRlbV9uYW1lJykudGV4dCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJy5yZWNvX3BpY3R1cmVfdjInKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB6aHVnZS50cmFjaygn5ZWG5ZOB5Zu+54mH77yI54Ot6Zeo5o6o6I2Q77yJJyx7XG4gICAgICAgICAgICAncmVjb21tZW5kX3BpY3R1cmVfdjInOiQodGhpcykucGFyZW50KCkuY2hpbGRyZW4oJy5pdGVtX25hbWUnKS50ZXh0KClcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgJCgnLnJlY29fbW9kaWZ5X3YyJykuYmx1cihmdW5jdGlvbiAoKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+S/ruaUueWVhuWTgeaVsOmHj++8iOeDremXqOaOqOiNkO+8iScse1xuICAgICAgICAgICAgJ3JlY29tbWVuZF9tb2RpZnlfdjInOiQodGhpcykudmFsKClcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgJCgnLnJlY29fc2VsZWN0X2FsbF92MicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHpodWdlLnRyYWNrKCflhajpgInvvIjng63pl6jmjqjojZDvvIknLHtcbiAgICAgICAgICAgICdyZWNvbW1lbmRfc2VsZWN0X2FsbF92Mic6JCh0aGlzKS50ZXh0KClcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgJCgnLnJlY29fYWRkX3YyJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+WinuWKoO+8iOeDremXqOaOqOiNkO+8iScse1xuICAgICAgICAgICAgJ3JlY29tbWVuZF9hZGRfdjInOiQodGhpcykudGV4dCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJy5yZWNvX2NvbnRlbnRfcmVjb21tZW5kX3YyJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+eDremXqOaOqOiNkO+8iOeDremXqOaOqOiNkO+8iScse1xuICAgICAgICAgICAgJ3JlY29tbWVuZF9jb250ZW50X3JlY29tbWVuZF92Mic6JCh0aGlzKS50ZXh0KClcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgJCgnLnJlY29fY29udGVudF9jZW50ZXJfdjInKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB6aHVnZS50cmFjaygn5Liq5Lq65Lit5b+DKOeDremXqOaOqOiNkO+8iScse1xuICAgICAgICAgICAgJ3JlY29tbWVuZF9jb250ZW50X2NlbnRlcl92Mic6JCh0aGlzKS50ZXh0KClcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgJCgnLnJlY29fY29udGVudF9kZWFsZXJfdjInKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB6aHVnZS50cmFjaygn5L6b6LSn5ZWG77yI54Ot6Zeo5o6o6I2Q77yJJyx7XG4gICAgICAgICAgICAncmVjb21tZW5kX2NvbnRlbnRfZGVhbGVyX3YyJzokKHRoaXMpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkKCcucmVjb190cm9sbGV5X3YyJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+i0reeJqei9pu+8iOeDremXqOaOqOiNkO+8iScse1xuICAgICAgICAgICAgJ3JlY29tbWVuZF90cm9sbGV5X3YyJzokKHRoaXMpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAvL+e7j+mUgOWVhumhtVxuICAgICQoJy5kZWFsX3NlbGVjdF92MicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHpodWdlLnRyYWNrKCfpgInmi6nov5vlhaXnu4/plIDllYblupfpk7rpobXpnaIg77yI57uP6ZSA5ZWG77yJJyx7XG4gICAgICAgICAgICAnZGVhbGVyX3NlbGVjdF92Mic6JCh0aGlzKS5jaGlsZHJlbignLmRlcGFydG1lbnQnKS50ZXh0KClcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgJCgnLmRlYWxfY29udGVudF9yZWNvbW1lbmRfdjInKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB6aHVnZS50cmFjaygn54Ot6Zeo5o6o6I2Q77yI57uP6ZSA5ZWG77yJJyx7XG4gICAgICAgICAgICAnZGVhbGVyX2NvbnRlbnRfcmVjb21tZW5kX3YyJzokKHRoaXMpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkKCcuZGVhbF9jb250ZW50X2RlYWxlcl92MicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHpodWdlLnRyYWNrKCfkvpvotKfllYbvvIjnu4/plIDllYbvvIknLHtcbiAgICAgICAgICAgICdkZWFsZXJfY29udGVudF9kZWFsZXJfdjInOiQodGhpcykudGV4dCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJy5kZWFsX2NvbnRlbnRfY2VudGVyX3YyJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+S4quS6uuS4reW/g++8iOe7j+mUgOWVhu+8iScse1xuICAgICAgICAgICAgJ2RlYWxlcl9jb250ZW50X2NlbnRlcl92Mic6JCh0aGlzKS50ZXh0KClcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgJCgnLmRlYWxfcmV0dXJuX3YyJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+i/lOWbnuS4i+WNlemhte+8iOe7j+mUgOWVhu+8iScse1xuICAgICAgICAgICAgJ2RlYWxlcl9yZXR1cm5fdjInOiQodGhpcykudGV4dCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIC8v57uP6ZSA5ZWG5bqX6ZO66aG16Z2iXG4gICAgJCgnLnNob3Bfc2VhcmNoX3YyJykuYmx1cihmdW5jdGlvbiAoKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+aQnOe0oicse1xuICAgICAgICAgICAgJ3Nob3Bfc2VhcmNoX3YyJzokKHRoaXMpLnZhbCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJy5zaG9wX2NhdGVnb3J5X3YyJykub24oJ2NsaWNrJywnbGknLGZ1bmN0aW9uKCl7XG4gICAgICAgIHpodWdlLnRyYWNrKCfllYblk4HliIbnsbsnLHtcbiAgICAgICAgICAgICdzaG9wX2NhdGVnb3J5X3YyJzokKHRoaXMpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkKCcuc2hvcF9yYW5raW5nX2NvbXByZWhlbnNpdmVfdjInKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB6aHVnZS50cmFjaygn57u85ZCI5o6S5bqPJyx7XG4gICAgICAgICAgICAnc2hvcF9yYW5raW5nX2NvbXByZWhlbnNpdmVfdjInOiQodGhpcykudGV4dCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJy5zaG9wX3JhbmtpbmdfcHJpY2VfdjInKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB6aHVnZS50cmFjaygn5Lu35qC85o6S5bqPJyx7XG4gICAgICAgICAgICAnc2hvcF9yYW5raW5nX3ByaWNlX3YyJzokKHRoaXMpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkKCcuc2hvcF9yYW5raW5nX3NhbGVzX3YyJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+mUgOmHj+aOkuW6jycse1xuICAgICAgICAgICAgJ3Nob3BfcmFua2luZ19zYWxlc192Mic6JCh0aGlzKS50ZXh0KClcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgJCgnLnNob3BfcHJvbW90aW9uX3YyJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+S/g+mUgOW5v+WRiicse1xuICAgICAgICAgICAgJ3Nob3BfcHJvbW90aW9uX3YyJzokKHRoaXMpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkKCcuc2hvcF9waWN0dXJlX3YyJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+WVhuWTgeWbvueJh++8iOe7j+mUgOWVhuW6l+mTuu+8iScse1xuICAgICAgICAgICAgJ3Nob3BfcGljdHVyZV92Mic6JCh0aGlzKS5wYXJlbnQoKS5jaGlsZHJlbignaDMnKS50ZXh0KClcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgJCgnLnNob3BfbW9kaWZ5X3YyJykuYmx1cihmdW5jdGlvbiAoKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+S/ruaUueWVhuWTgeaVsOmHj++8iOe7j+mUgOWVhuW6l+mTuu+8iScse1xuICAgICAgICAgICAgJ3Nob3BfbW9kaWZ5X3YyJzokKHRoaXMpLnZhbCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJy5zaG9wX3JldHVybl92MicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHpodWdlLnRyYWNrKCfov5Tlm57nu4/plIDllYbpobXvvIjnu4/plIDllYblupfpk7rvvIknLHtcbiAgICAgICAgICAgICdzaG9wX3JldHVybl92Mic6JCh0aGlzKS50ZXh0KClcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgJCgnLnNob3BfY2FsbF92MicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHpodWdlLnRyYWNrKCfmi6jmiZPnlLXor53vvIjnu4/plIDllYblupfpk7rvvIknLHtcbiAgICAgICAgICAgICdzaG9wX2NhbGxfdjInOiQodGhpcykudGV4dCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJy5zaG9wX2NhbGxfbm9fdjInKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB6aHVnZS50cmFjaygn5ouo5omT55S16K+d77yI5by556qX77yJ5Y+W5raIJyx7XG4gICAgICAgICAgICAnc2hvcF9jYWxsX25vX3YyJzokKHRoaXMpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkKCcuc2hvcF9jYWxsX3llc192MicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHpodWdlLnRyYWNrKCfmi6jmiZPnlLXor53vvIjlvLnnqpfvvInnoa7lrponLHtcbiAgICAgICAgICAgICdzaG9wX2NhbGxfeWVzX3YyJzokKHRoaXMpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkKCcuc2hvcF90cm9sbGV5X3YyJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+i0reeJqei9pu+8iOe7j+mUgOWVhuW6l+mTuu+8iScse1xuICAgICAgICAgICAgJ3Nob3BfdHJvbGxleV92Mic6JCh0aGlzKS50ZXh0KClcbiAgICAgICAgfSk7XG4gICAgICAgIHpodWdlLnRyYWNrKCfmnaXmupAo57uP6ZSA5ZWG5bqX6ZO6Jyx7XG4gICAgICAgICAgICAnc291cmNlX3YyJzokKHRoaXMpLnBhcmVudHMoJy5ob21lLWluZm8tbmF2JykuZmluZCgnI2RlYWxlcl9uYW1lJykuaHRtbCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIC8v6LSt54mp6L2m6aG16Z2iXG4gICAgJChcIi50cm9sbGV5X3Nob3BfYWxsX3YyXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHpodWdlLnRyYWNrKCflhajpgInnu4/plIDllYbllYblk4HvvIjotK3nianovabvvIknLHtcbiAgICAgICAgICAgICd0cm9sbGV5X3Nob3BfYWxsX3YyJzokKHRoaXMpLnBhcmVudCgpLmNoaWxkcmVuKCcub3JkZXItYWEnKS50ZXh0KClcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgJCgnLnRyb2xsZXlfc2VsZWN0X3Nob3BfdjInKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB6aHVnZS50cmFjaygn6YCJ5oup6L+b5YWl57uP6ZSA5ZWG5bqX6ZO677yI6LSt54mp6L2m77yJJyx7XG4gICAgICAgICAgICAndHJvbGxleV9zZWxlY3Rfc2hvcF92Mic6JCh0aGlzKS50ZXh0KClcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgJCgnLnRyb2xsZXlfc2VsZWN0X3YyJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+WLvumAieWVhuWTge+8iOi0reeJqei9pu+8iScse1xuICAgICAgICAgICAgJ3Ryb2xsZXlfc2VsZWN0X3YyJzokKHRoaXMpLnBhcmVudCgpLmNoaWxkcmVuKCcuaXRlbV9uYW1lJykudGV4dCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgJCgnLnRyb2xsZXlfcGljdHVyZV92MicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHpodWdlLnRyYWNrKCfllYblk4Hlm77niYfvvIjotK3nianovabvvIknLHtcbiAgICAgICAgICAgICd0cm9sbGV5X3BpY3R1cmVfdjInOiQodGhpcykucGFyZW50KCkuY2hpbGRyZW4oJy5pdGVtX25hbWUnKS50ZXh0KClcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgJCgnLnRyb2xsZXlfbW9kaWZ5X3YyJykuYmx1cihmdW5jdGlvbiAoKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+S/ruaUueWVhuWTgeaVsOmHj++8iOi0reeJqei9pu+8iScse1xuICAgICAgICAgICAgJ3Ryb2xsZXlfbW9kaWZ5X3YyJzokKHRoaXMpLnZhbCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJy50cm9sbGV5X3NlbGVjdF9hbGxfdjInKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB6aHVnZS50cmFjaygn5YWo6YCJ77yI6LSt54mp6L2m77yJJyx7XG4gICAgICAgICAgICAndHJvbGxleV9zZWxlY3RfYWxsX3YyJzokKHRoaXMpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkKCcudHJvbGxleV9hZGRfdjInKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB6aHVnZS50cmFjaygn5LiL5Y2V77yI6LSt54mp6L2m77yJJyx7XG4gICAgICAgICAgICAndHJvbGxleV9hZGRfdjInOiQodGhpcykudGV4dCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJy50cm9sbGV5X2NvbnRlbnRfcmVjb21tZW5kX3YyJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+eDremXqOaOqOiNkO+8iOi0reeJqei9pu+8iScse1xuICAgICAgICAgICAgJ3Ryb2xsZXlfY29udGVudF9yZWNvbW1lbmRfdjInOiQodGhpcykudGV4dCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJy50cm9sbGV5X2NvbnRlbnRfY2VudGVyX3YyJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+S4quS6uuS4reW/g++8iOi0reeJqei9pu+8iScse1xuICAgICAgICAgICAgJ3Ryb2xsZXlfY29udGVudF9jZW50ZXJfdjInOiQodGhpcykudGV4dCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJy50cm9sbGV5X2NvbnRlbnRfZGVhbGVyX3YyJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+S+m+i0p+WVhu+8iOi0reeJqei9pu+8iScse1xuICAgICAgICAgICAgJ3Ryb2xsZXlfY29udGVudF9kZWFsZXJfdjInOiQodGhpcykudGV4dCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIC8v56Gu6K6k6K6i5Y2V6aG1XG4gICAgJCgnLmFmZmlybV9yZXR1cm5fdjInKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB6aHVnZS50cmFjaygn6L+U5Zue77yI56Gu6K6k6K6i5Y2V77yJJyx7XG4gICAgICAgICAgICAnYWZmaXJtX3JldHVybl92Mic6JCh0aGlzKS50ZXh0KClcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgJCgnLmFmZmlybV9zZWxlY3Rfc2hvcF92MicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHpodWdlLnRyYWNrKCfpgInmi6nov5vlhaXnu4/plIDllYblupfpk7rvvIjnoa7orqTorqLljZXvvIknLHtcbiAgICAgICAgICAgICdhZmZpcm1fc2VsZWN0X3Nob3BfdjInOiQodGhpcykudGV4dCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJy5hZmZpcm1fYWRkX3YyJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+aPkOS6pO+8iOehruiupOiuouWNle+8iScse1xuICAgICAgICAgICAgJ2FmZmlybV9hZGRfdjInOiQodGhpcykudGV4dCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJy5hZmZpcm1fYWRkX3llc192MicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHpodWdlLnRyYWNrKCfmj5DkuqTvvIjlvLnnqpfvvInnoa7lrponLHtcbiAgICAgICAgICAgICfpl6jlupflkI3np7AnOiQoJy5uYW1lJykudGV4dCgpLFxuICAgICAgICAgICAgJ+S4i+WNlemHkeminSc6JCgnLnhpYWRhbl9zdW0nKS50ZXh0KCksXG4gICAgICAgICAgICAn57uP6ZSA5ZWG5ZCN56ewJzokKCcuZGVsbmFtZScpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkKCcuYWZmaXJtX2FkZF9ub192MicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHpodWdlLnRyYWNrKCfmj5DkuqTvvIjlvLnnqpfvvInlj5bmtognLHtcbiAgICAgICAgICAgICdhZmZpcm1fYWRkX25vX3YyJzokKHRoaXMpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAvL+S4i+WNleaIkOWKn+aIluWksei0pVxuICAgICQoJy5hZmZpcm1fYWRkX3N1Y2Nlc3NfdjInKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgemh1Z2UudHJhY2soJ+S4i+WNleaIkOWKn++8iOW8ueeql++8iScse1xuICAgICAgICAgICAgJ2FmZmlybV9hZGRfc3VjY2Vzc192Mic6JCh0aGlzKS50ZXh0KClcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgJCgnLmFmZmlybV9hZGRfZmFpbHVyZV92MicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICB6aHVnZS50cmFjaygn5LiL5Y2V5aSx6LSl77yI5by556qX77yJJyx7XG4gICAgICAgICAgICAnYWZmaXJtX2FkZF9mYWlsdXJlX3YyJzokKHRoaXMpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAvL+S4quS6uuS4reW/g+mhtVxuICAgICQoJy5jZW50ZXJfc2VsZWN0X3Nob3BfdjInKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB6aHVnZS50cmFjaygn6YCJ5oup6L+b5YWl57uP6ZSA5ZWG5bqX6ZO677yI5Liq5Lq65Lit5b+D77yJJyx7XG4gICAgICAgICAgICAnY2VudGVyX3NlbGVjdF9zaG9wX3YyJzokKHRoaXMpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkKCcuY2VudGVyX2hpc3RvcnlfdjInKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB6aHVnZS50cmFjaygn5p+l55yL5Y6G5Y+y6K6w5b2VJyx7XG4gICAgICAgICAgICAnY2VudGVyX2hpc3RvcnlfdjInOiQodGhpcykudGV4dCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJy5jZW50ZXJfY29udGVudF9yZWNvbW1lbmRfdjInKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB6aHVnZS50cmFjaygn54Ot6Zeo5o6o6I2Q77yI5Liq5Lq65Lit5b+D77yJJyx7XG4gICAgICAgICAgICAnY2VudGVyX2NvbnRlbnRfcmVjb21tZW5kX3YyJzokKHRoaXMpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkKCcuY2VudGVyX2NvbnRlbnRfY2VudGVyX3YyJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+S4quS6uuS4reW/g++8iOS4quS6uuS4reW/g++8iScse1xuICAgICAgICAgICAgJ2NlbnRlcl9jb250ZW50X2NlbnRlcl92Mic6JCh0aGlzKS50ZXh0KClcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgJCgnLmNlbnRlcl9jb250ZW50X2RlYWxlcl92MicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHpodWdlLnRyYWNrKCfkvpvotKfllYbvvIjkuKrkurrkuK3lv4PvvIknLHtcbiAgICAgICAgICAgICdjZW50ZXJfY29udGVudF9kZWFsZXJfdjInOiQodGhpcykudGV4dCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJy5ob21lLWNvbi1taWQnKS5vbignY2xpY2snLCcuY2VudGVyX2FkZF92MicsZnVuY3Rpb24oKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+i/veWKoOWVhuWTge+8iOS4quS6uuS4reW/g++8iScse1xuICAgICAgICAgICAgJ2NlbnRlcl9hZGRfdjInOiQodGhpcykudGV4dCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJy5ob21lLWNvbi1taWQnKS5vbignY2xpY2snLCcuY2VudGVyX2FnYWluX3YyJyxmdW5jdGlvbigpe1xuICAgICAgICB6aHVnZS50cmFjaygn5YaN5qyh6LSt5Lmw77yI5Liq5Lq65Lit5b+D77yJJyx7XG4gICAgICAgICAgICAnY2VudGVyX2FnYWluX3YyJzokKHRoaXMpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAvL+S4quS6uuWOhuWPsuiusOW9lVxuICAgICQoJy5oaXN0b3J5X3JldHVybl92MicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHpodWdlLnRyYWNrKCfov5Tlm57vvIjljoblj7LorrDlvZXvvIknLHtcbiAgICAgICAgICAgICdoaXN0b3J5X3JldHVybl92Mic6JCh0aGlzKS50ZXh0KClcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgJCgnLmhpc3Rvcnlfc2VsZWN0X3Nob3BfdjInKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB6aHVnZS50cmFjaygn6YCJ5oup6L+b5YWl57uP6ZSA5ZWG5bqX6ZO677yI5Y6G5Y+y6K6w5b2V77yJJyx7XG4gICAgICAgICAgICAnaGlzdG9yeV9zZWxlY3Rfc2hvcF92Mic6JCh0aGlzKS50ZXh0KClcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgLy/ov73liqDorqLljZXlkozlho3mrKHotK3kubBcbiAgICAgJCgnLmhvbWUtY29uLW1pZCcpLm9uKCdjbGljaycsJy5oaXN0b3J5X2FkZF92MicsZnVuY3Rpb24oKSB7XG4gICAgICAgIHpodWdlLnRyYWNrKCfov73liqDllYblk4HvvIjljoblj7LorrDlvZXvvIknLHtcbiAgICAgICAgICAgICdoaXN0b3J5X2FkZF92Mic6JCh0aGlzKS50ZXh0KClcbiAgICAgICAgfSk7XG4gICAgIH0pO1xuICAgICAkKCcuaG9tZS1jb24tbWlkJykub24oJ2NsaWNrJywnLmhpc3RvcnlfYWdhaW5fdjInLGZ1bmN0aW9uKCkge1xuICAgICAgICB6aHVnZS50cmFjaygn5YaN5qyh6LSt5Lmw77yI5Y6G5Y+y6K6w5b2V77yJJyx7XG4gICAgICAgICAgICAnaGlzdG9yeV9hZ2Fpbl92Mic6JCh0aGlzKS50ZXh0KClcbiAgICAgICAgfSk7XG4gICAgIH0pO1xuICAgIC8v5pCc57Si6aG1XG4gICAgJCgnLnNlYXJjaF9waWN0dXJlX3YyJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+WVhuWTgeWbvueJh++8iOaQnOe0oumhte+8iScse1xuICAgICAgICAgICAgJ3NlYXJjaF9waWN0dXJlX3YyJzokKHRoaXMpLnBhcmVudCgpLmNoaWxkcmVuKCdoMycpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkKCcuc2VhcmNoX21vZGlmeV92MicpLmJsdXIoZnVuY3Rpb24gKCl7XG4gICAgICAgIHpodWdlLnRyYWNrKCfkv67mlLnllYblk4HmlbDph4/vvIjmkJzntKLpobXvvIknLHtcbiAgICAgICAgICAgICdzZWFyY2hfbW9kaWZ5X3YyJzokKHRoaXMpLnZhbCgpLFxuICAgICAgICAgICAgJ+WVhuWTgeWQjeensCc6JCh0aGlzKS5wYXJlbnRzKCcuYm94JykuY2hpbGRyZW4oJ2gzJykudGV4dCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIC8v55m75b2V6aG16Z2iXG4gICAgLy8gJCgnLmxvZ2luX2VudHJ5X2FsbF92MicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgLy8gICAgIHpodWdlLmlkZW50aWZ5KFwiJCh0aGlzKS5wYXJlbnRzKCcuY29udGVudCcpLmZpbmQoJyN1c2VybmFtZScpLnZhbCgpXCIse1xuICAgIC8vICAgICAgICAgJ2xvZ2luX2VudHJ5X2FsbF92Mic6JCh0aGlzKS5wYXJlbnRzKCcuY29udGVudCcpLmZpbmQoJyN1c2VybmFtZScpLnZhbCgpXG4gICAgLy8gICAgIH0pO1xuICAgIC8vIH0pO1xuICAgICQoJy5wbGFpbl9jb2RlX3YyJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+WvhueggeaYjueggScse1xuICAgICAgICAgICAgJ3BsYWluX2NvZGVfdjInOiQodGhpcykudGV4dCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJy5mb3JnZXRfcGFzc3dvcmRfdjInKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB6aHVnZS50cmFjaygn5b+Y6K6w5a+G56CBJyx7XG4gICAgICAgICAgICAnZm9yZ2V0X3Bhc3N3b3JkX3YyJzokKHRoaXMpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkKCcucmVnaXN0cmF0aW9uX3YyJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+azqOWGjCcse1xuICAgICAgICAgICAgJ3JlZ2lzdHJhdGlvbl92Mic6JCh0aGlzKS50ZXh0KClcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgLy/lv5jorrDlr4bnoIHpobXpnaJcbiAgICAkKCcuR2V0X3ZlcmlmaWNhdGlvbl9jb2RlX3YyJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+iOt+WPlumqjOivgeegge+8iOmHjee9ru+8iScse1xuICAgICAgICAgICAgJ0dldF92ZXJpZmljYXRpb25fY29kZV92Mic6JCh0aGlzKS50ZXh0KClcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgJCgnLnZlcmlmaWNhdGlvbl92MicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHpodWdlLnRyYWNrKCfpqozor4HvvIjph43nva7vvIknLHtcbiAgICAgICAgICAgICd2ZXJpZmljYXRpb25fdjInOiQodGhpcykudGV4dCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIC8v6YeN572u5a+G56CBXG4gICAgJCgnLlJlc2V0X1Bhc3N3b3JkX3YyJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgemh1Z2UudHJhY2soJ+mHjee9ruWvhueggScse1xuICAgICAgICAgICAgJ1Jlc2V0X1Bhc3N3b3JkX3YyJzokKHRoaXMpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAvL+azqOWGjOi0puaIt+mhtemdolxuICAgICQoJy5HZXRfdmVyaWZpY2F0aW9uX2NvZGVfcmVnaXN0ZXJfdjInKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB6aHVnZS50cmFjaygn6I635Y+W6aqM6K+B56CB77yI5rOo5YaM77yJJyx7XG4gICAgICAgICAgICAnR2V0X3ZlcmlmaWNhdGlvbl9jb2RlX3JlZ2lzdGVyX3YyJzokKHRoaXMpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkKCcucmVnaXN0ZXJfdjInKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZyg4KTtcbiAgICAgICAgemh1Z2UudHJhY2soJ+azqOWGjO+8iOazqOWGjO+8iScse1xuICAgICAgICAgICAgJ3JlZ2lzdGVyX3YyJzokKHRoaXMpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIH1cbiAgICBcblxuXG59KTtcbiJdLCJmaWxlIjoicmVjb21tZW5kb3JkZXIvcmVjb21tZW5kb3JkZXJfemh1Z2VfYW5hbHl0aWNzLmpzIn0=
