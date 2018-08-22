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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhbmFseXRpY3MvbWVyY2hhbmRpc2Vfc2VhcmNoLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBjdXJyZW50UGFnZTtcbnZhciB0b3RhbDtcbmZ1bmN0aW9uIGdldEl0ZW1JbmZvKHBhZ2UpIHtcbiAgICB2YXIgdmFsdWUgPSAkKCcucHJvbXB0JykudmFsKCk7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiAnL2FuYWx5dGljcy9hcGkvdjEvc3RkLWl0ZW1zJyxcbiAgICAgICAgZGF0YTogeydhcmcnOiB2YWx1ZSwgJ3BhZ2UnOiBwYWdlfSxcbiAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICAgICAgICAkKCd0Ym9keScpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAkKCcucGFnZS1udW0nKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICQoJy5udW1zJykuaHRtbCgwKTtcbiAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgPT0gMSkge1xuICAgICAgICAgICAgICAgIHZhciBpbWFnZUV4aXN0O1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5yZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtTmFtZSA9ICQoJzx0ZD48YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiL2FuYWx5dGljcy9tZXJjaGFuZGlzZS1zZWFyY2gtaXRlbT9pdGVtPScrIGRhdGEucmVzdWx0c1tpXS5pZCArJ1wiIGNsYXNzPVwiaGVhZGVyXCI+JysgZGF0YS5yZXN1bHRzW2ldLm5hbWUgKyc8L2E+PC90ZD4nKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1CYXJjb2RlID0gJCgnPHRkPicrIGRhdGEucmVzdWx0c1tpXS5iYXJjb2RlICsnPC90ZD4nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEucmVzdWx0c1tpXS5pbWFnZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VFeGlzdCA9ICQoJzx0ZD7ml6Dlm77niYc8L3RkPicpO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUV4aXN0ID0gJCgnPHRkPjxhICB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiL2FuYWx5dGljcy9tZXJjaGFuZGlzZS1zZWFyY2gtaXRlbT9pdGVtPScrIGRhdGEucmVzdWx0c1tpXS5pZCArJ1wiIGNsYXNzPVwiaGVhZGVyXCI+5p+l55yL5Zu+54mHPC9hPjwvdGQ+Jyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1UciA9ICQoJzx0cj48L3RyPicpO1xuICAgICAgICAgICAgICAgICAgICBpdGVtVHIuYXBwZW5kKGl0ZW1OYW1lKS5hcHBlbmQoaXRlbUJhcmNvZGUpLmFwcGVuZChpbWFnZUV4aXN0KTtcbiAgICAgICAgICAgICAgICAgICAgJCgndGJvZHknKS5hcHBlbmQoaXRlbVRyKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMTsgaiA8PSBkYXRhLnRvdGFsOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLm5leHQnKS5iZWZvcmUoJzxhIGNsYXNzPVwiaXRlbSBwYWdlLW51bVwiPicrIGogKyc8L2E+Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY3VycmVudFBhZ2UgPSBkYXRhLnBhZ2U7XG4gICAgICAgICAgICAgICAgdG90YWwgPSBkYXRhLnRvdGFsO1xuICAgICAgICAgICAgICAgICQoJy5udW1zJykuaHRtbChkYXRhLm51bXMpO1xuICAgICAgICAgICAgICAgICQoJ2EucGFnZS1udW0nKS5lcShkYXRhLnBhZ2UtMSkuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNpYmxpbmdzKCdhLnBhZ2UtbnVtJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgICQoJ3Rib2R5JykuY2hpbGRyZW4oKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAkKCd0Ym9keScpLmFwcGVuZCgnPHRyPjx0ZD7msqHmnInljLnphY3nu5Pmnpw8L3RkPjwvdHI+Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuJChkb2N1bWVudCkuYWpheFN1Y2Nlc3MoZnVuY3Rpb24oKXtcbiAgICAkKCdhLnBhZ2UtbnVtJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnaHRtbCxib2R5Jykuc2Nyb2xsVG9wKDApO1xuICAgICAgICBnZXRJdGVtSW5mbygkKHRoaXMpLmh0bWwoKSk7XG4gICAgfSk7XG5cbiAgICBpZiAoY3VycmVudFBhZ2UgPD0gMSkge1xuICAgICAgICAkKCdhLnByZScpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuICAgIH1lbHNlIHtcbiAgICAgICAgJCgnYS5wcmUnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudFBhZ2UgPj0gdG90YWwpIHtcbiAgICAgICAgJCgnYS5uZXh0JykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgfWVsc2Uge1xuICAgICAgICAkKCdhLm5leHQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICB9XG59KTtcblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICQoJy5wcm9tcHQnKS5rZXlkb3duKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgIGdldEl0ZW1JbmZvKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoJy5uZXh0JykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnaHRtbCxib2R5Jykuc2Nyb2xsVG9wKDApO1xuICAgICAgICBjdXJyZW50UGFnZSArKztcbiAgICAgICAgaWYgKGN1cnJlbnRQYWdlID49IHRvdGFsKSB7XG4gICAgICAgICAgICBjdXJyZW50UGFnZSA9IHRvdGFsO1xuICAgICAgICB9XG4gICAgICAgIGdldEl0ZW1JbmZvKGN1cnJlbnRQYWdlKTtcbiAgICB9KTtcblxuICAgICQoJy5wcmUnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAkKCdodG1sLGJvZHknKS5zY3JvbGxUb3AoMCk7XG4gICAgICAgIGN1cnJlbnRQYWdlIC0tO1xuICAgICAgICBpZiAoY3VycmVudFBhZ2UgPD0gMSkge1xuICAgICAgICAgICAgY3VycmVudFBhZ2UgPSAxO1xuICAgICAgICB9XG4gICAgICAgIGdldEl0ZW1JbmZvKGN1cnJlbnRQYWdlKTtcbiAgICB9KTtcbn0pOyJdLCJmaWxlIjoiYW5hbHl0aWNzL21lcmNoYW5kaXNlX3NlYXJjaC5qcyJ9
