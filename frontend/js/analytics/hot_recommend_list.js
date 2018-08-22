$(document).ready(function () {
    $('.item-wrap>img').click(function(){
        if($(this).attr('src') == '/static/images/analytics/ic_star_nor.png'){
            $(this).attr('src', '/static/images/analytics/ic_star_pre.png');
        }else {
            $(this).attr('src', '/static/images/analytics/ic_star_nor.png');
        }
    });
});