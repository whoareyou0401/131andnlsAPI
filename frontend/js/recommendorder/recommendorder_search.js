$(function(){
	 //点击电话按钮
    $('.home-info-nav-b').click(function(){
        console.log(1000);
        $('.model').css({
            'display':'block'
        });
        $('.call').css({
            'display':'block'
        });
    });
    //点击取消按钮模态消失
    $('.cancel').click(function(){
        console.log(99);
        $('.model').css({
            'display':'none'
        });
        $('.call').css({
            'display':'none'
        });
    });
    //点击确定按钮可以打电话
    $('.sure').click(function(){
        console.log(994);
        window.location.href="tel://83066002";
    });

    // click the place order button
    $('#place-order').click(function() {
        console.log('Place order clicked');
        var itemStr = app.toItemString();
        var new_href = '/recommendorder/recommendorder-order?order=' + itemStr;
        console.log(new_href);
        window.location.href = new_href;
        console.log('jumped');
    });
    //ul-box列表的高亮
     $('.list').click(function(){
        $(this).addClass('active');
        $(this).parent().siblings().children('.list').removeClass('active');
     });
     //点击图片出现模态显示大图
     $('.list').on('click','.imgBig',function(){
        console.log(0);
        $('.modelImg').css({
            'display':'block'
        });
        $('.imgBigShow').css({
            'display':'block'
        });
     });
     //点击任意按钮模态消失
     $('.modelImg').click(function(){
        console.log(77);
        $(this).css({
            'display':'none'
        });
     });
     //点击返回按钮跳回道登录界面
     $('.home-info-nav-a').click(function(){
        window.location.href="recommendorder-wholesale-department";
     });

 });