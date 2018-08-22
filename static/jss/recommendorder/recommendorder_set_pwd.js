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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlcl9zZXRfcHdkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiQoZnVuY3Rpb24oKXtcblx0Ly/ngrnlh7vov5Tlm57mjInpkq7ot7Plm57pgZPnu5HlrprmiYvmnLrnlYzpnaJcblx0JCgnLmhvbWUtaW5mby1uYXYtYScpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdCBcdHdpbmRvdy5sb2NhdGlvbi5ocmVmPVwibWxvZ2luXCI7XG5cdCB9KTtcbiAgICAvL+eCueWHu+iOt+WPlumqjOivgeeggeeahOagt+W8j+aUueWPmFxuICAgICQoJy51c2VySWQnKS5iaW5kKCdpbnB1dCBwcm9wZXJ0eWNoYW5nZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKCQoJy51c2VySWQnKS52YWwoKS5sZW5ndGg+MCl7XG4gICAgICAgICAgICAkKCcjYnRuJykuY3NzKHtcbiAgICAgICAgICAgICAgICAnYmFja2dyb3VuZCc6JyNmZjRhMGMnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAkKCcjYnRuJykuY3NzKHtcbiAgICAgICAgICAgICAgICAnYmFja2dyb3VuZCc6JyNmZmM4YjYnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iXSwiZmlsZSI6InJlY29tbWVuZG9yZGVyL3JlY29tbWVuZG9yZGVyX3NldF9wd2QuanMifQ==
