$(function(){
	var userId=$('.userId');
	var userPwd=$('.userPwd');
	var loginBtn=$('.login');
	var register=$('.register');
	var showPwd=$('.show');
	var forgetBtn=$('.forget');
	var backBtn=$('.home-info-nav-a');
	//显示密码
	 var num=0;
	 showPwd.click(function(){
	    num++;
	    if(num%2==1){
	    	$(this).css({
	    		'background':'url(/static/images/recommendorder/eye.open.png) no-repeat center',
	    		'backgroundSize':'70%'
	    	});
	    	$(this).prev('.userPwd').attr('type','text');
	    }else{
	    	$(this).css({
	    		'background':'url(/static/images/recommendorder/eye.close.png) no-repeat center',
	    		'backgroundSize':'70%'
	    	});
	    	$(this).prev('.userPwd').attr('type','password');
	    }
	});
	 //点击登录
	 // loginBtn.click(function(){
	 // 	window.location.href="recommendorder-wholesale-department";
	 // });
	 // //点击返回按钮跳回道登录界面
	 // backBtn.click(function(){
	 // 	window.location.href="recommendorder-wholesale-department";
	 // });
	 //点击注册按钮进入注册界面
	 register.click(function(){
	 	window.location.href="/register";
	 });
	 //点击忘记密码按钮进入绑定手机
	 forgetBtn.click(function(){
	 	window.location.href="/reset-pwd";
	 });
});
