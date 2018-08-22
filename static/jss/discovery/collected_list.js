$(document).ready(function(){
    var collectedTotal = null;
    var currentPage = Number($('#pagination').attr('name'));

    function requestCollected(){
        $.ajax({
            url: 'collected-product',
            type: 'GET',
            data: {'page': currentPage},
            dataType: 'json',
            success: function(collect){
                if (collect.result !== '') {
                    $('.ui.single.line.table').show();
                    for (var i = 0; i < collect.result.length; i++) {
                        var h = 'product-info?area='+ collect.result[i].product_area +'&source='+ collect.result[i].product_source +"&skuid="+collect.result[i].product_id;
                        var fir_td = $('<td><input type="checkbox"></input></td>');

                        var sec_td_a = $('<a href='+ h +'></a>');
                        var sec_td_img = $('<img src='+ collect.result[i].product_image +' class="ui mini rounded image">');

                        var sec_td_name = $('<a href='+ h +' class="content">'+ collect.result[i].product_name +'</a>');
                        var sec_td = $('<td class="sec_td left aligned"></td>');

                        var thi_td = $('<td>'+ collect.result[i].collect_time +'</td>');

                        var for_td = $('<td><a href="javascript:" class="delete" name='+ collect.result[i].product_id +'>删除收藏</a></td>');

                        var tr_wrapper = $('<tr class="center aligned"></tr>');

                        sec_td_a.append(sec_td_img);
                        sec_td.append(sec_td_a).append(sec_td_name);
                        tr_wrapper.append(fir_td).append(sec_td).append(thi_td).append(for_td);
                        $('#product_list').append(tr_wrapper);
                    }
                }else{
                    $('.remind').show();
                }
                collectedTotal = collect.total;

                $('.homepage:eq(1)>a').css('color', '#ff5422');
                $('.homepage:eq(1)>div').addClass('triangle');
            }
        });
    }
    requestCollected();

    $(document).ajaxSuccess(function (event, xhr, settings) {
        if (settings.url === ("collected-product?page="+currentPage)) {
            deleteCollected();
            collectedPagination();
        }
    });

    // 删除收藏的商品
    function deleteCollected(){
        $('.delete').click(function(){
            var product_id = $(this).attr('name');
            $.ajax({
                url: 'product-collect',
                type: 'GET',
                dataType: 'json',
                data: {'skuid': product_id},
                success: function(del){
                    // del=0 删除
                    if (del.success === 0) {
                        if(confirm("您确定要删除该收藏吗?")){
                            $('.delete[name='+ product_id +']').parent().parent('tr').remove();
                            if ($('.delete').length === 0) {
                                $('.remind').show();
                                $('.ui.single.line.table').hide();
                            }
                        }
                    }
                }
            });
        });
    }

    // 分页
    function collectedPagination(){
        for (var i = 1; i <= collectedTotal; i++) {
            if (i <= 6) {
                var single = $('<a href="javascript:" class="item page_item">'+ i +'</a>');
                $("#pagi_next").before(single);
            }
        }

        $('.page_item').each(function(){
            if ($(this).html() == currentPage) {
                $(this).addClass('active');
            }

            if (currentPage >= 4 && collectedTotal > 6) {
                if (currentPage >= collectedTotal - 2) {
                    for (var i = 0; i < $('.pagi').length; i++) {
                        var nowPage = collectedTotal - 5 + i;
                        $('.pagi')[i].innerHTML = nowPage;
                    }
                }else{
                    for (var j = 0; j < $('.pagi').length; j++) {
                        var nowPageOther = currentPage - 3 + j;
                        $('.pagi')[j].innerHTML = nowPageOther;
                    }
                }

            }
        });

        // 每一页
        $('.page_item').click(function() {
            var pageItem = $(this).html();
            reloadPageFun(pageItem);
        });

        // 左右翻页
        $('#pagi_prev, #pagi_next').click(function(){
            if ($(this).attr('id') == 'pagi_prev') {
                currentPage --;
            }else{
                currentPage ++;
            }


            if (currentPage <= 0) {
                currentPage = 1;
            }

            if (currentPage >= collectedTotal) {
                currentPage = collectedTotal;
            }
            reloadPageFun(currentPage);
        });
    }

    function reloadPageFun(param){
        window.location.href = 'collect?page='+ param;
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkaXNjb3ZlcnkvY29sbGVjdGVkX2xpc3QuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICB2YXIgY29sbGVjdGVkVG90YWwgPSBudWxsO1xuICAgIHZhciBjdXJyZW50UGFnZSA9IE51bWJlcigkKCcjcGFnaW5hdGlvbicpLmF0dHIoJ25hbWUnKSk7XG5cbiAgICBmdW5jdGlvbiByZXF1ZXN0Q29sbGVjdGVkKCl7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6ICdjb2xsZWN0ZWQtcHJvZHVjdCcsXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgICAgIGRhdGE6IHsncGFnZSc6IGN1cnJlbnRQYWdlfSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihjb2xsZWN0KXtcbiAgICAgICAgICAgICAgICBpZiAoY29sbGVjdC5yZXN1bHQgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy51aS5zaW5nbGUubGluZS50YWJsZScpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2xsZWN0LnJlc3VsdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGggPSAncHJvZHVjdC1pbmZvP2FyZWE9JysgY29sbGVjdC5yZXN1bHRbaV0ucHJvZHVjdF9hcmVhICsnJnNvdXJjZT0nKyBjb2xsZWN0LnJlc3VsdFtpXS5wcm9kdWN0X3NvdXJjZSArXCImc2t1aWQ9XCIrY29sbGVjdC5yZXN1bHRbaV0ucHJvZHVjdF9pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaXJfdGQgPSAkKCc8dGQ+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiPjwvaW5wdXQ+PC90ZD4nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlY190ZF9hID0gJCgnPGEgaHJlZj0nKyBoICsnPjwvYT4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWNfdGRfaW1nID0gJCgnPGltZyBzcmM9JysgY29sbGVjdC5yZXN1bHRbaV0ucHJvZHVjdF9pbWFnZSArJyBjbGFzcz1cInVpIG1pbmkgcm91bmRlZCBpbWFnZVwiPicpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VjX3RkX25hbWUgPSAkKCc8YSBocmVmPScrIGggKycgY2xhc3M9XCJjb250ZW50XCI+JysgY29sbGVjdC5yZXN1bHRbaV0ucHJvZHVjdF9uYW1lICsnPC9hPicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlY190ZCA9ICQoJzx0ZCBjbGFzcz1cInNlY190ZCBsZWZ0IGFsaWduZWRcIj48L3RkPicpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhpX3RkID0gJCgnPHRkPicrIGNvbGxlY3QucmVzdWx0W2ldLmNvbGxlY3RfdGltZSArJzwvdGQ+Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb3JfdGQgPSAkKCc8dGQ+PGEgaHJlZj1cImphdmFzY3JpcHQ6XCIgY2xhc3M9XCJkZWxldGVcIiBuYW1lPScrIGNvbGxlY3QucmVzdWx0W2ldLnByb2R1Y3RfaWQgKyc+5Yig6Zmk5pS26JePPC9hPjwvdGQ+Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0cl93cmFwcGVyID0gJCgnPHRyIGNsYXNzPVwiY2VudGVyIGFsaWduZWRcIj48L3RyPicpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWNfdGRfYS5hcHBlbmQoc2VjX3RkX2ltZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWNfdGQuYXBwZW5kKHNlY190ZF9hKS5hcHBlbmQoc2VjX3RkX25hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJfd3JhcHBlci5hcHBlbmQoZmlyX3RkKS5hcHBlbmQoc2VjX3RkKS5hcHBlbmQodGhpX3RkKS5hcHBlbmQoZm9yX3RkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNwcm9kdWN0X2xpc3QnKS5hcHBlbmQodHJfd3JhcHBlcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnJlbWluZCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29sbGVjdGVkVG90YWwgPSBjb2xsZWN0LnRvdGFsO1xuXG4gICAgICAgICAgICAgICAgJCgnLmhvbWVwYWdlOmVxKDEpPmEnKS5jc3MoJ2NvbG9yJywgJyNmZjU0MjInKTtcbiAgICAgICAgICAgICAgICAkKCcuaG9tZXBhZ2U6ZXEoMSk+ZGl2JykuYWRkQ2xhc3MoJ3RyaWFuZ2xlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXF1ZXN0Q29sbGVjdGVkKCk7XG5cbiAgICAkKGRvY3VtZW50KS5hamF4U3VjY2VzcyhmdW5jdGlvbiAoZXZlbnQsIHhociwgc2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKHNldHRpbmdzLnVybCA9PT0gKFwiY29sbGVjdGVkLXByb2R1Y3Q/cGFnZT1cIitjdXJyZW50UGFnZSkpIHtcbiAgICAgICAgICAgIGRlbGV0ZUNvbGxlY3RlZCgpO1xuICAgICAgICAgICAgY29sbGVjdGVkUGFnaW5hdGlvbigpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDliKDpmaTmlLbol4/nmoTllYblk4FcbiAgICBmdW5jdGlvbiBkZWxldGVDb2xsZWN0ZWQoKXtcbiAgICAgICAgJCgnLmRlbGV0ZScpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgcHJvZHVjdF9pZCA9ICQodGhpcykuYXR0cignbmFtZScpO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6ICdwcm9kdWN0LWNvbGxlY3QnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgZGF0YTogeydza3VpZCc6IHByb2R1Y3RfaWR9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRlbCl7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRlbD0wIOWIoOmZpFxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVsLnN1Y2Nlc3MgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNvbmZpcm0oXCLmgqjnoa7lrpropoHliKDpmaTor6XmlLbol4/lkJc/XCIpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcuZGVsZXRlW25hbWU9JysgcHJvZHVjdF9pZCArJ10nKS5wYXJlbnQoKS5wYXJlbnQoJ3RyJykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoJy5kZWxldGUnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnJlbWluZCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnVpLnNpbmdsZS5saW5lLnRhYmxlJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyDliIbpobVcbiAgICBmdW5jdGlvbiBjb2xsZWN0ZWRQYWdpbmF0aW9uKCl7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IGNvbGxlY3RlZFRvdGFsOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpIDw9IDYpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2luZ2xlID0gJCgnPGEgaHJlZj1cImphdmFzY3JpcHQ6XCIgY2xhc3M9XCJpdGVtIHBhZ2VfaXRlbVwiPicrIGkgKyc8L2E+Jyk7XG4gICAgICAgICAgICAgICAgJChcIiNwYWdpX25leHRcIikuYmVmb3JlKHNpbmdsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkKCcucGFnZV9pdGVtJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYgKCQodGhpcykuaHRtbCgpID09IGN1cnJlbnRQYWdlKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50UGFnZSA+PSA0ICYmIGNvbGxlY3RlZFRvdGFsID4gNikge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50UGFnZSA+PSBjb2xsZWN0ZWRUb3RhbCAtIDIpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkKCcucGFnaScpLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbm93UGFnZSA9IGNvbGxlY3RlZFRvdGFsIC0gNSArIGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcucGFnaScpW2ldLmlubmVySFRNTCA9IG5vd1BhZ2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCAkKCcucGFnaScpLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbm93UGFnZU90aGVyID0gY3VycmVudFBhZ2UgLSAzICsgajtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5wYWdpJylbal0uaW5uZXJIVE1MID0gbm93UGFnZU90aGVyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOavj+S4gOmhtVxuICAgICAgICAkKCcucGFnZV9pdGVtJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcGFnZUl0ZW0gPSAkKHRoaXMpLmh0bWwoKTtcbiAgICAgICAgICAgIHJlbG9hZFBhZ2VGdW4ocGFnZUl0ZW0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyDlt6blj7Pnv7vpobVcbiAgICAgICAgJCgnI3BhZ2lfcHJldiwgI3BhZ2lfbmV4dCcpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKCdpZCcpID09ICdwYWdpX3ByZXYnKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFBhZ2UgLS07XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFnZSArKztcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBpZiAoY3VycmVudFBhZ2UgPD0gMCkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQYWdlID0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGN1cnJlbnRQYWdlID49IGNvbGxlY3RlZFRvdGFsKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFBhZ2UgPSBjb2xsZWN0ZWRUb3RhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlbG9hZFBhZ2VGdW4oY3VycmVudFBhZ2UpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWxvYWRQYWdlRnVuKHBhcmFtKXtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnY29sbGVjdD9wYWdlPScrIHBhcmFtO1xuICAgIH1cbn0pOyJdLCJmaWxlIjoiZGlzY292ZXJ5L2NvbGxlY3RlZF9saXN0LmpzIn0=
