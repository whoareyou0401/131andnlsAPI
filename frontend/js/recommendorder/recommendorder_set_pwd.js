$(function(){
	//点击返回按钮跳回道绑定手机界面
	$('.home-info-nav-a').click(function(){
	 	window.location.href="mlogin";
	 });
    //点击获取验证码的样式改变
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
});
