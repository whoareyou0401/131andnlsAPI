$(function(){
    var userId=$('.userId');
    var userPwd=$('.userPwd');
    function is_change_btn_color(userPwd, userId) {
        if (userPwd.val() != '' && userId.val() != '') {
            $('.submit input').addClass('active');
        } else {
            $('.submit input').removeClass('active')
        }
    };
    is_change_btn_color(userPwd, userId);
    $('.userId').bind('input propertychange', function() {

        is_change_btn_color(userPwd, userId);
    });
    $('.userPwd').bind('input propertychange', function() {
        is_change_btn_color(userPwd, userId);
    });
    $('.yanzheng').bind('input propertychange', function() {

        is_change_btn_color(userPwd, userId);
    });
    $('.reuserPwd').bind('input propertychange', function() {
        is_change_btn_color(userPwd, userId);
    });
})
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9jb21tb20uanMiXSwic291cmNlc0NvbnRlbnQiOlsiJChmdW5jdGlvbigpe1xuICAgIHZhciB1c2VySWQ9JCgnLnVzZXJJZCcpO1xuICAgIHZhciB1c2VyUHdkPSQoJy51c2VyUHdkJyk7XG4gICAgZnVuY3Rpb24gaXNfY2hhbmdlX2J0bl9jb2xvcih1c2VyUHdkLCB1c2VySWQpIHtcbiAgICAgICAgaWYgKHVzZXJQd2QudmFsKCkgIT0gJycgJiYgdXNlcklkLnZhbCgpICE9ICcnKSB7XG4gICAgICAgICAgICAkKCcuc3VibWl0IGlucHV0JykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCgnLnN1Ym1pdCBpbnB1dCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICB9XG4gICAgfTtcbiAgICBpc19jaGFuZ2VfYnRuX2NvbG9yKHVzZXJQd2QsIHVzZXJJZCk7XG4gICAgJCgnLnVzZXJJZCcpLmJpbmQoJ2lucHV0IHByb3BlcnR5Y2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaXNfY2hhbmdlX2J0bl9jb2xvcih1c2VyUHdkLCB1c2VySWQpO1xuICAgIH0pO1xuICAgICQoJy51c2VyUHdkJykuYmluZCgnaW5wdXQgcHJvcGVydHljaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXNfY2hhbmdlX2J0bl9jb2xvcih1c2VyUHdkLCB1c2VySWQpO1xuICAgIH0pO1xuICAgICQoJy55YW56aGVuZycpLmJpbmQoJ2lucHV0IHByb3BlcnR5Y2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaXNfY2hhbmdlX2J0bl9jb2xvcih1c2VyUHdkLCB1c2VySWQpO1xuICAgIH0pO1xuICAgICQoJy5yZXVzZXJQd2QnKS5iaW5kKCdpbnB1dCBwcm9wZXJ0eWNoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpc19jaGFuZ2VfYnRuX2NvbG9yKHVzZXJQd2QsIHVzZXJJZCk7XG4gICAgfSk7XG59KSJdLCJmaWxlIjoicmVjb21tZW5kb3JkZXIvY29tbW9tLmpzIn0=
