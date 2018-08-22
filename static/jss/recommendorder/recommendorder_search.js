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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlcl9zZWFyY2guanMiXSwic291cmNlc0NvbnRlbnQiOlsiJChmdW5jdGlvbigpe1xuXHQgLy/ngrnlh7vnlLXor53mjInpkq5cbiAgICAkKCcuaG9tZS1pbmZvLW5hdi1iJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2coMTAwMCk7XG4gICAgICAgICQoJy5tb2RlbCcpLmNzcyh7XG4gICAgICAgICAgICAnZGlzcGxheSc6J2Jsb2NrJ1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLmNhbGwnKS5jc3Moe1xuICAgICAgICAgICAgJ2Rpc3BsYXknOidibG9jaydcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgLy/ngrnlh7vlj5bmtojmjInpkq7mqKHmgIHmtojlpLFcbiAgICAkKCcuY2FuY2VsJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2coOTkpO1xuICAgICAgICAkKCcubW9kZWwnKS5jc3Moe1xuICAgICAgICAgICAgJ2Rpc3BsYXknOidub25lJ1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLmNhbGwnKS5jc3Moe1xuICAgICAgICAgICAgJ2Rpc3BsYXknOidub25lJ1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAvL+eCueWHu+ehruWumuaMiemSruWPr+S7peaJk+eUteivnVxuICAgICQoJy5zdXJlJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2coOTk0KTtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9XCJ0ZWw6Ly84MzA2NjAwMlwiO1xuICAgIH0pO1xuXG4gICAgLy8gY2xpY2sgdGhlIHBsYWNlIG9yZGVyIGJ1dHRvblxuICAgICQoJyNwbGFjZS1vcmRlcicpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnUGxhY2Ugb3JkZXIgY2xpY2tlZCcpO1xuICAgICAgICB2YXIgaXRlbVN0ciA9IGFwcC50b0l0ZW1TdHJpbmcoKTtcbiAgICAgICAgdmFyIG5ld19ocmVmID0gJy9yZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlci1vcmRlcj9vcmRlcj0nICsgaXRlbVN0cjtcbiAgICAgICAgY29uc29sZS5sb2cobmV3X2hyZWYpO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IG5ld19ocmVmO1xuICAgICAgICBjb25zb2xlLmxvZygnanVtcGVkJyk7XG4gICAgfSk7XG4gICAgLy91bC1ib3jliJfooajnmoTpq5jkuq5cbiAgICAgJCgnLmxpc3QnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5zaWJsaW5ncygpLmNoaWxkcmVuKCcubGlzdCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgfSk7XG4gICAgIC8v54K55Ye75Zu+54mH5Ye6546w5qih5oCB5pi+56S65aSn5Zu+XG4gICAgICQoJy5saXN0Jykub24oJ2NsaWNrJywnLmltZ0JpZycsZnVuY3Rpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2coMCk7XG4gICAgICAgICQoJy5tb2RlbEltZycpLmNzcyh7XG4gICAgICAgICAgICAnZGlzcGxheSc6J2Jsb2NrJ1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLmltZ0JpZ1Nob3cnKS5jc3Moe1xuICAgICAgICAgICAgJ2Rpc3BsYXknOidibG9jaydcbiAgICAgICAgfSk7XG4gICAgIH0pO1xuICAgICAvL+eCueWHu+S7u+aEj+aMiemSruaooeaAgea2iOWksVxuICAgICAkKCcubW9kZWxJbWcnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZyg3Nyk7XG4gICAgICAgICQodGhpcykuY3NzKHtcbiAgICAgICAgICAgICdkaXNwbGF5Jzonbm9uZSdcbiAgICAgICAgfSk7XG4gICAgIH0pO1xuICAgICAvL+eCueWHu+i/lOWbnuaMiemSrui3s+WbnumBk+eZu+W9leeVjOmdolxuICAgICAkKCcuaG9tZS1pbmZvLW5hdi1hJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9XCJyZWNvbW1lbmRvcmRlci13aG9sZXNhbGUtZGVwYXJ0bWVudFwiO1xuICAgICB9KTtcblxuIH0pOyJdLCJmaWxlIjoicmVjb21tZW5kb3JkZXIvcmVjb21tZW5kb3JkZXJfc2VhcmNoLmpzIn0=
