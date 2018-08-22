$(function(){
		var userPwd=$('.userPwd');
		var reuserPwd=$('.reuserPwd');
		var registerBtn=$('.loginInput');
		//校验两次密码输入是否一致

	 //按钮变色
	 $('.box-input input').change(function(){
	 	$('.submit input').addClass('active');
	 });
	 //点击注册按钮出现的效果
	 $('.login').click(function(){
			if(userPwd.val()!=reuserPwd.val()){
				(this).parent().parent().next().html("您两次输入的密码不一致");

			}
	 });
	 //点击返回按钮跳回道登录界面
	 $('.home-info-nav-a').click(function(){
	 	window.location.href="reset-pwd";
	 });

});
var userPwd=$('.userPwd');
var reuserPwd=$('.reuserPwd');
function is_change_btn_color(userPwd, reuserPwd) {
	console.log('dsgd');
    if (userPwd.val() != '' && reuserPwd.val() != '') {
        $('.submit input').addClass('active');
    } else {
        $('.submit input').removeClass('active')
    }
};
is_change_btn_color(userPwd, reuserPwd);
$('.userId').bind('input propertychange', function() {
    is_change_btn_color(userPwd, reuserPwd);
    });
$('.reuserPwd').bind('input propertychange', function() {
    is_change_btn_color(userPwd, reuserPwd);
});