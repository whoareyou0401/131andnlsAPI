(function() {
    $('.menu_info').on('click',function() {
        if($('.menu_con').css('display') == 'none') {
            $('.menu_con').css('display','block');
        }else if($('.menu_con').css('display') == 'block') {
            $('.menu_con').css('display','none');
        }
    });
    $('.search_method').on('click',function() {
        $('.search_method_text').show();
        $('.search_method_text').on('click','li',function() {
            $('.search_method').text($(this).text());
            $('.search_method_text').hide();
            if($(this).text() === '地图搜索') {
                $('.search_store').hide();
                $('.search-box').show();
                $('.search_store_con').hide();
                $('#container').show();
            }else if($(this).text() === '商家名称') {
                $('.search-box').hide();
                $('.search_store').show();
                $('.search_history_con').hide();
                $('.search_con').hide();
                $('#container').show();   
            }
        });    
    }); 
})();