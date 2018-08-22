var currentPage;
var total;
function getItemInfo(page) {
    var value = $('.prompt').val();
    $.ajax({
        url: '/analytics/api/v1/std-items',
        data: {'arg': value, 'page': page},
        type: 'GET',
        success: function(data) {
            console.log(data)
            $('tbody').children().remove();
            $('.page-num').remove();
            $('.nums').html(0);
            if (data.success == 1) {
                var imageExist;
                for (var i = 0; i < data.results.length; i++) {
                    var itemName = $('<td><a target="_blank" href="/analytics/merchandise-search-item?item='+ data.results[i].id +'" class="header">'+ data.results[i].name +'</a></td>');
                    var itemBarcode = $('<td>'+ data.results[i].barcode +'</td>');
                    if (data.results[i].image === null) {
                        imageExist = $('<td>无图片</td>');
                    }else {
                        imageExist = $('<td><a  target="_blank" href="/analytics/merchandise-search-item?item='+ data.results[i].id +'" class="header">查看图片</a></td>');
                    }
                    var itemTr = $('<tr></tr>');
                    itemTr.append(itemName).append(itemBarcode).append(imageExist);
                    $('tbody').append(itemTr);
                }

                for (var j = 1; j <= data.total; j++) {
                    $('.next').before('<a class="item page-num">'+ j +'</a>');
                }

                currentPage = data.page;
                total = data.total;
                $('.nums').html(data.nums);
                $('a.page-num').eq(data.page-1).addClass('active').siblings('a.page-num').removeClass('active');
            }else {
                $('tbody').children().remove();
                $('tbody').append('<tr><td>没有匹配结果</td></tr>');
            }
        }
    });
}

$(document).ajaxSuccess(function(){
    $('a.page-num').click(function(){
        $('html,body').scrollTop(0);
        getItemInfo($(this).html());
    });

    if (currentPage <= 1) {
        $('a.pre').addClass('disabled');
    }else {
        $('a.pre').removeClass('disabled');
    }

    if (currentPage >= total) {
        $('a.next').addClass('disabled');
    }else {
        $('a.next').removeClass('disabled');
    }
});

$(document).ready(function () {
    $('.prompt').keydown(function(event){
        if (event.keyCode == 13) {
            getItemInfo();
        }
    });

    $('.next').click(function(){
        $('html,body').scrollTop(0);
        currentPage ++;
        if (currentPage >= total) {
            currentPage = total;
        }
        getItemInfo(currentPage);
    });

    $('.pre').click(function(){
        $('html,body').scrollTop(0);
        currentPage --;
        if (currentPage <= 1) {
            currentPage = 1;
        }
        getItemInfo(currentPage);
    });
});