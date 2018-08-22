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
