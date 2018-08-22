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