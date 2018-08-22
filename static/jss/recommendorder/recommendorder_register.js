$(function(){
        var userId=$('.userId');
        var yanzhengBtn=$('.yanzhengId');
        var yanzheng=$('.yanzheng');
        var userPwd=$('.userPwd');
        var reuserPwd=$('.reuserPwd');
        var registerBtn=$('.loginInput');
        var flagId=false;
        var flagYz=false;
        var flagPwd=false;
        var flagRePwd=false;
        var regId=/^1[3578]\d{9}$/;
        var regPwd=/^[a-zA-Z]\w{5,}$/;
        //判断是否是手机号
         userId.blur(function(){
            if(regId.test(userId.val())){
                flagId=true;
                $(this).parent().parent().next().html("");
            }else{
                $(this).parent().parent().next().html("您输入的手机号不合法请重新输入");
            }
         });
         //判断验证码问题
         yanzheng.blur(function(){
            if (yanzheng.val().length!==0) {
                flagYz=true;
                $(this).parent().parent().next().html("");
            }else{
                $(this).parent().parent().next().html("请输入正确验证码");
            }
         });
        // 密码问题
         userPwd.blur(function(){
            if(regPwd.test(userPwd.val())){
                flagPwd=true;
                $(this).parent().parent().next().html("");
            }else{
                $(this).parent().parent().next().html("密码的第一位为字母且长度不小于6");
            }
            console.log(flagPwd);
         });

     //点击返回按钮跳回道登录界面
     $('.home-info-nav-a').click(function(){
        window.location.href="mlogin";
     });
     //点击获取验证码按钮
    $('.userId').bind('input propertychange', function(){
        if($('.userId').val().length>0){
            $('#btn').css({
                'background':'#ff4a0c'
            });
        }else{
            $('#btn').css({
                'background':'#ffc8b6'
            });
        }
    });
    function is_change_btn_color_register(userPwd, userId,yanzheng,reuserPwd) {
        if (userPwd.val() != '' && userId.val() != ''&& yanzheng.val() != ''&& reuserPwd.val() != '') {
            $('.submit input').addClass('active');
        } else {
            $('.submit input').removeClass('active')
        }
    };
    is_change_btn_color_register(userPwd, userId,yanzheng,reuserPwd);
    $('.userId').bind('input propertychange', function() {

        is_change_btn_color_register(userPwd, userId,yanzheng,reuserPwd);
    });
    $('.userPwd').bind('input propertychange', function() {
        is_change_btn_color_register(userPwd, userId,yanzheng,reuserPwd);
    });
    $('.yanzheng').bind('input propertychange', function() {

        is_change_btn_color_register(userPwd, userId,yanzheng,reuserPwd);
    });
    $('.reuserPwd').bind('input propertychange', function() {
        is_change_btn_color_register(userPwd, userId,yanzheng,reuserPwd);
    });


});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlcl9yZWdpc3Rlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIkKGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB1c2VySWQ9JCgnLnVzZXJJZCcpO1xuICAgICAgICB2YXIgeWFuemhlbmdCdG49JCgnLnlhbnpoZW5nSWQnKTtcbiAgICAgICAgdmFyIHlhbnpoZW5nPSQoJy55YW56aGVuZycpO1xuICAgICAgICB2YXIgdXNlclB3ZD0kKCcudXNlclB3ZCcpO1xuICAgICAgICB2YXIgcmV1c2VyUHdkPSQoJy5yZXVzZXJQd2QnKTtcbiAgICAgICAgdmFyIHJlZ2lzdGVyQnRuPSQoJy5sb2dpbklucHV0Jyk7XG4gICAgICAgIHZhciBmbGFnSWQ9ZmFsc2U7XG4gICAgICAgIHZhciBmbGFnWXo9ZmFsc2U7XG4gICAgICAgIHZhciBmbGFnUHdkPWZhbHNlO1xuICAgICAgICB2YXIgZmxhZ1JlUHdkPWZhbHNlO1xuICAgICAgICB2YXIgcmVnSWQ9L14xWzM1NzhdXFxkezl9JC87XG4gICAgICAgIHZhciByZWdQd2Q9L15bYS16QS1aXVxcd3s1LH0kLztcbiAgICAgICAgLy/liKTmlq3mmK/lkKbmmK/miYvmnLrlj7dcbiAgICAgICAgIHVzZXJJZC5ibHVyKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZihyZWdJZC50ZXN0KHVzZXJJZC52YWwoKSkpe1xuICAgICAgICAgICAgICAgIGZsYWdJZD10cnVlO1xuICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkucGFyZW50KCkubmV4dCgpLmh0bWwoXCJcIik7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLm5leHQoKS5odG1sKFwi5oKo6L6T5YWl55qE5omL5py65Y+35LiN5ZCI5rOV6K+36YeN5paw6L6T5YWlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgfSk7XG4gICAgICAgICAvL+WIpOaWremqjOivgeeggemXrumimFxuICAgICAgICAgeWFuemhlbmcuYmx1cihmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYgKHlhbnpoZW5nLnZhbCgpLmxlbmd0aCE9PTApIHtcbiAgICAgICAgICAgICAgICBmbGFnWXo9dHJ1ZTtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLm5leHQoKS5odG1sKFwiXCIpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5uZXh0KCkuaHRtbChcIuivt+i+k+WFpeato+ehrumqjOivgeeggVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH0pO1xuICAgICAgICAvLyDlr4bnoIHpl67pophcbiAgICAgICAgIHVzZXJQd2QuYmx1cihmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYocmVnUHdkLnRlc3QodXNlclB3ZC52YWwoKSkpe1xuICAgICAgICAgICAgICAgIGZsYWdQd2Q9dHJ1ZTtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLm5leHQoKS5odG1sKFwiXCIpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5uZXh0KCkuaHRtbChcIuWvhueggeeahOesrOS4gOS9jeS4uuWtl+avjeS4lOmVv+W6puS4jeWwj+S6jjZcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhmbGFnUHdkKTtcbiAgICAgICAgIH0pO1xuXG4gICAgIC8v54K55Ye76L+U5Zue5oyJ6ZKu6Lez5Zue6YGT55m75b2V55WM6Z2iXG4gICAgICQoJy5ob21lLWluZm8tbmF2LWEnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZj1cIm1sb2dpblwiO1xuICAgICB9KTtcbiAgICAgLy/ngrnlh7vojrflj5bpqozor4HnoIHmjInpkq5cbiAgICAkKCcudXNlcklkJykuYmluZCgnaW5wdXQgcHJvcGVydHljaGFuZ2UnLCBmdW5jdGlvbigpe1xuICAgICAgICBpZigkKCcudXNlcklkJykudmFsKCkubGVuZ3RoPjApe1xuICAgICAgICAgICAgJCgnI2J0bicpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ2JhY2tncm91bmQnOicjZmY0YTBjJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgJCgnI2J0bicpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ2JhY2tncm91bmQnOicjZmZjOGI2J1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBmdW5jdGlvbiBpc19jaGFuZ2VfYnRuX2NvbG9yX3JlZ2lzdGVyKHVzZXJQd2QsIHVzZXJJZCx5YW56aGVuZyxyZXVzZXJQd2QpIHtcbiAgICAgICAgaWYgKHVzZXJQd2QudmFsKCkgIT0gJycgJiYgdXNlcklkLnZhbCgpICE9ICcnJiYgeWFuemhlbmcudmFsKCkgIT0gJycmJiByZXVzZXJQd2QudmFsKCkgIT0gJycpIHtcbiAgICAgICAgICAgICQoJy5zdWJtaXQgaW5wdXQnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcuc3VibWl0IGlucHV0JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIH1cbiAgICB9O1xuICAgIGlzX2NoYW5nZV9idG5fY29sb3JfcmVnaXN0ZXIodXNlclB3ZCwgdXNlcklkLHlhbnpoZW5nLHJldXNlclB3ZCk7XG4gICAgJCgnLnVzZXJJZCcpLmJpbmQoJ2lucHV0IHByb3BlcnR5Y2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaXNfY2hhbmdlX2J0bl9jb2xvcl9yZWdpc3Rlcih1c2VyUHdkLCB1c2VySWQseWFuemhlbmcscmV1c2VyUHdkKTtcbiAgICB9KTtcbiAgICAkKCcudXNlclB3ZCcpLmJpbmQoJ2lucHV0IHByb3BlcnR5Y2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlzX2NoYW5nZV9idG5fY29sb3JfcmVnaXN0ZXIodXNlclB3ZCwgdXNlcklkLHlhbnpoZW5nLHJldXNlclB3ZCk7XG4gICAgfSk7XG4gICAgJCgnLnlhbnpoZW5nJykuYmluZCgnaW5wdXQgcHJvcGVydHljaGFuZ2UnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBpc19jaGFuZ2VfYnRuX2NvbG9yX3JlZ2lzdGVyKHVzZXJQd2QsIHVzZXJJZCx5YW56aGVuZyxyZXVzZXJQd2QpO1xuICAgIH0pO1xuICAgICQoJy5yZXVzZXJQd2QnKS5iaW5kKCdpbnB1dCBwcm9wZXJ0eWNoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpc19jaGFuZ2VfYnRuX2NvbG9yX3JlZ2lzdGVyKHVzZXJQd2QsIHVzZXJJZCx5YW56aGVuZyxyZXVzZXJQd2QpO1xuICAgIH0pO1xuXG5cbn0pO1xuIl0sImZpbGUiOiJyZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlcl9yZWdpc3Rlci5qcyJ9
