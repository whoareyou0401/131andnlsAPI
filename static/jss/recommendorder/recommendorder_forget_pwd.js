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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlcl9mb3JnZXRfcHdkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiQoZnVuY3Rpb24oKXtcblx0XHR2YXIgdXNlclB3ZD0kKCcudXNlclB3ZCcpO1xuXHRcdHZhciByZXVzZXJQd2Q9JCgnLnJldXNlclB3ZCcpO1xuXHRcdHZhciByZWdpc3RlckJ0bj0kKCcubG9naW5JbnB1dCcpO1xuXHRcdC8v5qCh6aqM5Lik5qyh5a+G56CB6L6T5YWl5piv5ZCm5LiA6Ie0XG5cblx0IC8v5oyJ6ZKu5Y+Y6ImyXG5cdCAkKCcuYm94LWlucHV0IGlucHV0JykuY2hhbmdlKGZ1bmN0aW9uKCl7XG5cdCBcdCQoJy5zdWJtaXQgaW5wdXQnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdCB9KTtcblx0IC8v54K55Ye75rOo5YaM5oyJ6ZKu5Ye6546w55qE5pWI5p6cXG5cdCAkKCcubG9naW4nKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdFx0aWYodXNlclB3ZC52YWwoKSE9cmV1c2VyUHdkLnZhbCgpKXtcblx0XHRcdFx0KHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLm5leHQoKS5odG1sKFwi5oKo5Lik5qyh6L6T5YWl55qE5a+G56CB5LiN5LiA6Ie0XCIpO1xuXG5cdFx0XHR9XG5cdCB9KTtcblx0IC8v54K55Ye76L+U5Zue5oyJ6ZKu6Lez5Zue6YGT55m75b2V55WM6Z2iXG5cdCAkKCcuaG9tZS1pbmZvLW5hdi1hJykuY2xpY2soZnVuY3Rpb24oKXtcblx0IFx0d2luZG93LmxvY2F0aW9uLmhyZWY9XCJyZXNldC1wd2RcIjtcblx0IH0pO1xuXG59KTtcbnZhciB1c2VyUHdkPSQoJy51c2VyUHdkJyk7XG52YXIgcmV1c2VyUHdkPSQoJy5yZXVzZXJQd2QnKTtcbmZ1bmN0aW9uIGlzX2NoYW5nZV9idG5fY29sb3IodXNlclB3ZCwgcmV1c2VyUHdkKSB7XG5cdGNvbnNvbGUubG9nKCdkc2dkJyk7XG4gICAgaWYgKHVzZXJQd2QudmFsKCkgIT0gJycgJiYgcmV1c2VyUHdkLnZhbCgpICE9ICcnKSB7XG4gICAgICAgICQoJy5zdWJtaXQgaW5wdXQnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJCgnLnN1Ym1pdCBpbnB1dCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgIH1cbn07XG5pc19jaGFuZ2VfYnRuX2NvbG9yKHVzZXJQd2QsIHJldXNlclB3ZCk7XG4kKCcudXNlcklkJykuYmluZCgnaW5wdXQgcHJvcGVydHljaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICBpc19jaGFuZ2VfYnRuX2NvbG9yKHVzZXJQd2QsIHJldXNlclB3ZCk7XG4gICAgfSk7XG4kKCcucmV1c2VyUHdkJykuYmluZCgnaW5wdXQgcHJvcGVydHljaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICBpc19jaGFuZ2VfYnRuX2NvbG9yKHVzZXJQd2QsIHJldXNlclB3ZCk7XG59KTsiXSwiZmlsZSI6InJlY29tbWVuZG9yZGVyL3JlY29tbWVuZG9yZGVyX2ZvcmdldF9wd2QuanMifQ==
