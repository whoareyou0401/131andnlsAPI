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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlcl9sb2dpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIkKGZ1bmN0aW9uKCl7XG5cdHZhciB1c2VySWQ9JCgnLnVzZXJJZCcpO1xuXHR2YXIgdXNlclB3ZD0kKCcudXNlclB3ZCcpO1xuXHR2YXIgbG9naW5CdG49JCgnLmxvZ2luJyk7XG5cdHZhciByZWdpc3Rlcj0kKCcucmVnaXN0ZXInKTtcblx0dmFyIHNob3dQd2Q9JCgnLnNob3cnKTtcblx0dmFyIGZvcmdldEJ0bj0kKCcuZm9yZ2V0Jyk7XG5cdHZhciBiYWNrQnRuPSQoJy5ob21lLWluZm8tbmF2LWEnKTtcblx0Ly/mmL7npLrlr4bnoIFcblx0IHZhciBudW09MDtcblx0IHNob3dQd2QuY2xpY2soZnVuY3Rpb24oKXtcblx0ICAgIG51bSsrO1xuXHQgICAgaWYobnVtJTI9PTEpe1xuXHQgICAgXHQkKHRoaXMpLmNzcyh7XG5cdCAgICBcdFx0J2JhY2tncm91bmQnOid1cmwoL3N0YXRpYy9pbWFnZXMvcmVjb21tZW5kb3JkZXIvZXllLm9wZW4ucG5nKSBuby1yZXBlYXQgY2VudGVyJyxcblx0ICAgIFx0XHQnYmFja2dyb3VuZFNpemUnOic3MCUnXG5cdCAgICBcdH0pO1xuXHQgICAgXHQkKHRoaXMpLnByZXYoJy51c2VyUHdkJykuYXR0cigndHlwZScsJ3RleHQnKTtcblx0ICAgIH1lbHNle1xuXHQgICAgXHQkKHRoaXMpLmNzcyh7XG5cdCAgICBcdFx0J2JhY2tncm91bmQnOid1cmwoL3N0YXRpYy9pbWFnZXMvcmVjb21tZW5kb3JkZXIvZXllLmNsb3NlLnBuZykgbm8tcmVwZWF0IGNlbnRlcicsXG5cdCAgICBcdFx0J2JhY2tncm91bmRTaXplJzonNzAlJ1xuXHQgICAgXHR9KTtcblx0ICAgIFx0JCh0aGlzKS5wcmV2KCcudXNlclB3ZCcpLmF0dHIoJ3R5cGUnLCdwYXNzd29yZCcpO1xuXHQgICAgfVxuXHR9KTtcblx0IC8v54K55Ye755m75b2VXG5cdCAvLyBsb2dpbkJ0bi5jbGljayhmdW5jdGlvbigpe1xuXHQgLy8gXHR3aW5kb3cubG9jYXRpb24uaHJlZj1cInJlY29tbWVuZG9yZGVyLXdob2xlc2FsZS1kZXBhcnRtZW50XCI7XG5cdCAvLyB9KTtcblx0IC8vIC8v54K55Ye76L+U5Zue5oyJ6ZKu6Lez5Zue6YGT55m75b2V55WM6Z2iXG5cdCAvLyBiYWNrQnRuLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdCAvLyBcdHdpbmRvdy5sb2NhdGlvbi5ocmVmPVwicmVjb21tZW5kb3JkZXItd2hvbGVzYWxlLWRlcGFydG1lbnRcIjtcblx0IC8vIH0pO1xuXHQgLy/ngrnlh7vms6jlhozmjInpkq7ov5vlhaXms6jlhoznlYzpnaJcblx0IHJlZ2lzdGVyLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdCBcdHdpbmRvdy5sb2NhdGlvbi5ocmVmPVwiL3JlZ2lzdGVyXCI7XG5cdCB9KTtcblx0IC8v54K55Ye75b+Y6K6w5a+G56CB5oyJ6ZKu6L+b5YWl57uR5a6a5omL5py6XG5cdCBmb3JnZXRCdG4uY2xpY2soZnVuY3Rpb24oKXtcblx0IFx0d2luZG93LmxvY2F0aW9uLmhyZWY9XCIvcmVzZXQtcHdkXCI7XG5cdCB9KTtcbn0pO1xuIl0sImZpbGUiOiJyZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlcl9sb2dpbi5qcyJ9
