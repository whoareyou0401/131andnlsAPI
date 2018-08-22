function fillData(){
    var termRange = $(".date .date-choiced").attr("value");
    var storeProperty = $(".store-type .store-color").attr("value");
    var page = $(".select-page").val() || 1;
    var arg = $(".search input").val();
    var sort = $("th .ascending").parent().attr("value") || $("th .descending").parent().attr("value");
    var order = $(".ascending").attr("class") || $(".descending").attr("class");
    if ($.trim(arg) !== ""){
        page = 1;
    }
    $.ajax({
        url: "/analytics/chain-store",
        data: {"action": "storeanalysis-stores", "term_range": termRange, "property": storeProperty, "page":page, "arg":arg, "sort": sort, "order": order},
        type: "GET",
        success: function (data) {
            if (data.success == 1) {
                $(".pagination p span").text(data.data.pages);
                $(".select-page option").remove();
                for (var j = 1; j <= data.data.pages; j++){
                    $(".select-page").append("<option value="+j+">第" + num2Chinese(j) + "页</option>");
                }
                $(".select-page").val(page);
                var newRow = "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                $("table tbody tr").remove();
                for (var i = 0; i < data.data.data.length; i++) {
                    $("table tbody").append(newRow);
                    ii = i + 1;
                    $("table tr:eq(" + ii + ")").attr("value", data.data.data[i].id);
                    $("table tr:eq(" + ii + ") td:eq(0)").text(ii);
                    if (data.data.data[i].abnormal === 1){
                        $("table tr:eq(" + ii + ") td:eq(1)").html("<img src='/static/images/analytics/explain.png' alt=''>");
                    }
                    $("table tr:eq(" + ii + ") td:eq(2)").html("<a href='/analytics/store-detail/"+ data.data.data[i].id + "'>" + data.data.data[i].name+ "</a>");
                    // $("table tr:eq(" + ii + ") td:eq(2)").html("<a href='/analytics/store-detail/"+ data.data.data[i].id + "'>" + "xxx"+ "</a>");
                    $("table tr:eq(" + ii + ") td:eq(3)").text(data.data.data[i].display_id);
                    $("table tr:eq(" + ii + ") td:eq(4)").text(data.data.data[i].target_sales);
                    $("table tr:eq(" + ii + ") td:eq(5)").text(data.data.data[i].sales);
                    $("table tr:eq(" + ii + ") td:eq(6)").text(data.data.data[i].completeness);
                    $("table tr:eq(" + ii + ") td:eq(7)").text(data.data.data[i].expect_sales);
                    $("table tr:eq(" + ii + ") td:eq(8)").text(data.data.data[i].difference);
                    $("table tr:eq(" + ii + ") td:eq(9)").text(data.data.data[i].gross_profit);
                    $("table tr:eq(" + ii + ") td:eq(10)").text(data.data.data[i].term_on_term_difference);
                }
                $('input:checkbox:not(:checked)').each(function(){
                    hideTableCol($("table"), $(this).attr("value"));
                });
                $('input:checkbox:checked').each(function(){
                    showTableCol($("table"), $(this).attr("value"));
                });
                setTbaleWidth();
            }else {
                location.href = "/logout";
            }
        }
    });
}


$(document).ready(function(){
    $.ajax({
        url: "/analytics/chain-store",
        data: {"action": "overview-init"},
        type: "GET",
        success: function (data) {
            if (data.success == 1) {
                for (var i = 0; i < data.data.length; i++) {
                    $(".store-type").append("<span value='" + data.data[i].value + "'>" + data.data[i].name + "</span>");
                }
                fillData();
                $(".store-type span").click(function () {
                    $(".store-color").removeClass();
                    $(this).addClass("store-color");
                    fillData();
                    ga('send', {
                        hitType: 'event',
                        eventCategory: 'storelist',
                        eventAction: 'store-type',
                        eventLabel: $(this).text()
                    });
                });
            }
        }
    });

    $("a[value='storeanalysis']").addClass("sidebar-color");

    $(".date li").click(function () {
        $(".date-choiced").removeClass();
        $(this).addClass("date-choiced");
        fillData();
        var _left = $(this).scrollLeft();
        $('table th').eq(0).css('left', _left);
        $('table th').eq(1).css('left', _left);
        $('table th').eq(2).css('left', _left);
        $('table th').eq(3).css('left', _left).addClass('box-shadow');
        $('table td:nth-child(1)').css('left', _left);
        $('table td:nth-child(2)').css('left', _left);
        $('table td:nth-child(3)').css('left', _left);
        $('table td:nth-child(4)').css('left', _left).addClass('box-shadow');
        if (Number($(this).scrollLeft()) === 0) {
            $('table th').eq(3).removeClass('box-shadow');
            $('table td:nth-child(4)').removeClass('box-shadow');
        }
        ga('send', {
            hitType: 'event',
            eventCategory: 'storelist',
            eventAction: 'date',
            eventLabel: $(this).text()
        });
    });
    $(".select-page").change(function(){
        fillData();
    });
    $(".page-turing.prev").click(function(){
        if ($(".select-page").val() == 1)
            return;
        $(".select-page").val($(".select-page").val() - 1);
        fillData();
        ga('send', {
            hitType: 'event',
            eventCategory: 'storelist',
            eventAction: 'page-turing',
        });
    });
    $(".page-turing.next").click(function(){
        if ($(".select-page").val() == $(".select-page option").length)
        {
            return;
        }
        $(".select-page").val(Number($(".select-page").val()) + 1);
        fillData();
        ga('send', {
            hitType: 'event',
            eventCategory: 'storelist',
            eventAction: 'page-turing',
        });
    });
    $(".add-image:eq(0)").click(function(){
        var op = $(".explain-box").attr("hidden") == "hidden" ? $(".explain-box").removeAttr("hidden") : $(".explain-box").attr("hidden", "hidden");
    });
    $(".add-image:eq(1)").click(function(){
        var op = $(".add-items").attr("hidden") == "hidden" ? $(".add-items").removeAttr("hidden") : $(".add-items").attr("hidden", "hidden");
    });
    $(".float-right input:eq(0), .float-right input:eq(1)").click(function(){
        $(".add-items").attr("hidden", "hidden");
    });
    $(".float-right input:eq(2)").click(function(){
        $(".add-items").attr("hidden", "hidden");

        $('input:checkbox:not(:checked)').each(function(){
            hideTableCol($("table"), $(this).attr("value"));
        });
        $('input:checkbox:checked').each(function(){
            showTableCol($("table"), $(this).attr("value"));
        });
        setTbaleWidth();
    });

    $(".search img").click(function(){
        if ($.trim($(".search input").val()) !== ""){
            fillData();
        }
    });

    $(".search input").keydown(function(event){
        if (event.which == 13){
            fillData();
        }
        ga('send', {
            hitType: 'event',
            eventCategory: 'storelist',
            eventAction: 'search',
            eventLabel: $(this).val()
        });
    });

    $("table").tablesort({func: function(){fillData();}});

    $(".download").click(function(){
        $("table").tableExport({
            headings: true,
            fileName: "stores",
            formats: ["csv"],
            position: "bottom",
            ignoreCSS: "[style*='display: none']"
        });
        ga('send', {
            hitType: 'event',
            eventCategory: 'storelist',
            eventAction: 'download',
        });
    });
        // $(".btn-toolbar.bottom").attr("hidden", "hidden");

    $('.table-border').scroll(function() {
        var _left = $(this).scrollLeft();
        $('table th').eq(0).css('left', _left);
        $('table th').eq(1).css('left', _left);
        $('table th').eq(2).css('left', _left);
        $('table th').eq(3).css('left', _left).addClass('box-shadow');
        $('table td:nth-child(1)').css('left', _left);
        $('table td:nth-child(2)').css('left', _left);
        $('table td:nth-child(3)').css('left', _left);
        $('table td:nth-child(4)').css('left', _left).addClass('box-shadow');
        if (Number($(this).scrollLeft()) === 0) {
            $('table th').eq(3).removeClass('box-shadow');
            $('table td:nth-child(4)').removeClass('box-shadow');
        }
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhbmFseXRpY3Mvc3RvcmVfYW5hbHlzaXMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gZmlsbERhdGEoKXtcbiAgICB2YXIgdGVybVJhbmdlID0gJChcIi5kYXRlIC5kYXRlLWNob2ljZWRcIikuYXR0cihcInZhbHVlXCIpO1xuICAgIHZhciBzdG9yZVByb3BlcnR5ID0gJChcIi5zdG9yZS10eXBlIC5zdG9yZS1jb2xvclwiKS5hdHRyKFwidmFsdWVcIik7XG4gICAgdmFyIHBhZ2UgPSAkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpIHx8IDE7XG4gICAgdmFyIGFyZyA9ICQoXCIuc2VhcmNoIGlucHV0XCIpLnZhbCgpO1xuICAgIHZhciBzb3J0ID0gJChcInRoIC5hc2NlbmRpbmdcIikucGFyZW50KCkuYXR0cihcInZhbHVlXCIpIHx8ICQoXCJ0aCAuZGVzY2VuZGluZ1wiKS5wYXJlbnQoKS5hdHRyKFwidmFsdWVcIik7XG4gICAgdmFyIG9yZGVyID0gJChcIi5hc2NlbmRpbmdcIikuYXR0cihcImNsYXNzXCIpIHx8ICQoXCIuZGVzY2VuZGluZ1wiKS5hdHRyKFwiY2xhc3NcIik7XG4gICAgaWYgKCQudHJpbShhcmcpICE9PSBcIlwiKXtcbiAgICAgICAgcGFnZSA9IDE7XG4gICAgfVxuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogXCIvYW5hbHl0aWNzL2NoYWluLXN0b3JlXCIsXG4gICAgICAgIGRhdGE6IHtcImFjdGlvblwiOiBcInN0b3JlYW5hbHlzaXMtc3RvcmVzXCIsIFwidGVybV9yYW5nZVwiOiB0ZXJtUmFuZ2UsIFwicHJvcGVydHlcIjogc3RvcmVQcm9wZXJ0eSwgXCJwYWdlXCI6cGFnZSwgXCJhcmdcIjphcmcsIFwic29ydFwiOiBzb3J0LCBcIm9yZGVyXCI6IG9yZGVyfSxcbiAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgPT0gMSkge1xuICAgICAgICAgICAgICAgICQoXCIucGFnaW5hdGlvbiBwIHNwYW5cIikudGV4dChkYXRhLmRhdGEucGFnZXMpO1xuICAgICAgICAgICAgICAgICQoXCIuc2VsZWN0LXBhZ2Ugb3B0aW9uXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAxOyBqIDw9IGRhdGEuZGF0YS5wYWdlczsgaisrKXtcbiAgICAgICAgICAgICAgICAgICAgJChcIi5zZWxlY3QtcGFnZVwiKS5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPVwiK2orXCI+56ysXCIgKyBudW0yQ2hpbmVzZShqKSArIFwi6aG1PC9vcHRpb24+XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbChwYWdlKTtcbiAgICAgICAgICAgICAgICB2YXIgbmV3Um93ID0gXCI8dHI+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PC90cj5cIjtcbiAgICAgICAgICAgICAgICAkKFwidGFibGUgdGJvZHkgdHJcIikucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmRhdGEuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdGJvZHlcIikuYXBwZW5kKG5ld1Jvdyk7XG4gICAgICAgICAgICAgICAgICAgIGlpID0gaSArIDE7XG4gICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpXCIpLmF0dHIoXCJ2YWx1ZVwiLCBkYXRhLmRhdGEuZGF0YVtpXS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDApXCIpLnRleHQoaWkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5kYXRhLmRhdGFbaV0uYWJub3JtYWwgPT09IDEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoMSlcIikuaHRtbChcIjxpbWcgc3JjPScvc3RhdGljL2ltYWdlcy9hbmFseXRpY3MvZXhwbGFpbi5wbmcnIGFsdD0nJz5cIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoMilcIikuaHRtbChcIjxhIGhyZWY9Jy9hbmFseXRpY3Mvc3RvcmUtZGV0YWlsL1wiKyBkYXRhLmRhdGEuZGF0YVtpXS5pZCArIFwiJz5cIiArIGRhdGEuZGF0YS5kYXRhW2ldLm5hbWUrIFwiPC9hPlwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoMilcIikuaHRtbChcIjxhIGhyZWY9Jy9hbmFseXRpY3Mvc3RvcmUtZGV0YWlsL1wiKyBkYXRhLmRhdGEuZGF0YVtpXS5pZCArIFwiJz5cIiArIFwieHh4XCIrIFwiPC9hPlwiKTtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoMylcIikudGV4dChkYXRhLmRhdGEuZGF0YVtpXS5kaXNwbGF5X2lkKTtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoNClcIikudGV4dChkYXRhLmRhdGEuZGF0YVtpXS50YXJnZXRfc2FsZXMpO1xuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSg1KVwiKS50ZXh0KGRhdGEuZGF0YS5kYXRhW2ldLnNhbGVzKTtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoNilcIikudGV4dChkYXRhLmRhdGEuZGF0YVtpXS5jb21wbGV0ZW5lc3MpO1xuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSg3KVwiKS50ZXh0KGRhdGEuZGF0YS5kYXRhW2ldLmV4cGVjdF9zYWxlcyk7XG4gICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDgpXCIpLnRleHQoZGF0YS5kYXRhLmRhdGFbaV0uZGlmZmVyZW5jZSk7XG4gICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDkpXCIpLnRleHQoZGF0YS5kYXRhLmRhdGFbaV0uZ3Jvc3NfcHJvZml0KTtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoMTApXCIpLnRleHQoZGF0YS5kYXRhLmRhdGFbaV0udGVybV9vbl90ZXJtX2RpZmZlcmVuY2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkKCdpbnB1dDpjaGVja2JveDpub3QoOmNoZWNrZWQpJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBoaWRlVGFibGVDb2woJChcInRhYmxlXCIpLCAkKHRoaXMpLmF0dHIoXCJ2YWx1ZVwiKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJCgnaW5wdXQ6Y2hlY2tib3g6Y2hlY2tlZCcpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgc2hvd1RhYmxlQ29sKCQoXCJ0YWJsZVwiKSwgJCh0aGlzKS5hdHRyKFwidmFsdWVcIikpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHNldFRiYWxlV2lkdGgoKTtcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gXCIvbG9nb3V0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogXCIvYW5hbHl0aWNzL2NoYWluLXN0b3JlXCIsXG4gICAgICAgIGRhdGE6IHtcImFjdGlvblwiOiBcIm92ZXJ2aWV3LWluaXRcIn0sXG4gICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzID09IDEpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAkKFwiLnN0b3JlLXR5cGVcIikuYXBwZW5kKFwiPHNwYW4gdmFsdWU9J1wiICsgZGF0YS5kYXRhW2ldLnZhbHVlICsgXCInPlwiICsgZGF0YS5kYXRhW2ldLm5hbWUgKyBcIjwvc3Bhbj5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZpbGxEYXRhKCk7XG4gICAgICAgICAgICAgICAgJChcIi5zdG9yZS10eXBlIHNwYW5cIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkKFwiLnN0b3JlLWNvbG9yXCIpLnJlbW92ZUNsYXNzKCk7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJzdG9yZS1jb2xvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgZmlsbERhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgZ2EoJ3NlbmQnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoaXRUeXBlOiAnZXZlbnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRDYXRlZ29yeTogJ3N0b3JlbGlzdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudEFjdGlvbjogJ3N0b3JlLXR5cGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRMYWJlbDogJCh0aGlzKS50ZXh0KClcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoXCJhW3ZhbHVlPSdzdG9yZWFuYWx5c2lzJ11cIikuYWRkQ2xhc3MoXCJzaWRlYmFyLWNvbG9yXCIpO1xuXG4gICAgJChcIi5kYXRlIGxpXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJChcIi5kYXRlLWNob2ljZWRcIikucmVtb3ZlQ2xhc3MoKTtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcImRhdGUtY2hvaWNlZFwiKTtcbiAgICAgICAgZmlsbERhdGEoKTtcbiAgICAgICAgdmFyIF9sZWZ0ID0gJCh0aGlzKS5zY3JvbGxMZWZ0KCk7XG4gICAgICAgICQoJ3RhYmxlIHRoJykuZXEoMCkuY3NzKCdsZWZ0JywgX2xlZnQpO1xuICAgICAgICAkKCd0YWJsZSB0aCcpLmVxKDEpLmNzcygnbGVmdCcsIF9sZWZ0KTtcbiAgICAgICAgJCgndGFibGUgdGgnKS5lcSgyKS5jc3MoJ2xlZnQnLCBfbGVmdCk7XG4gICAgICAgICQoJ3RhYmxlIHRoJykuZXEoMykuY3NzKCdsZWZ0JywgX2xlZnQpLmFkZENsYXNzKCdib3gtc2hhZG93Jyk7XG4gICAgICAgICQoJ3RhYmxlIHRkOm50aC1jaGlsZCgxKScpLmNzcygnbGVmdCcsIF9sZWZ0KTtcbiAgICAgICAgJCgndGFibGUgdGQ6bnRoLWNoaWxkKDIpJykuY3NzKCdsZWZ0JywgX2xlZnQpO1xuICAgICAgICAkKCd0YWJsZSB0ZDpudGgtY2hpbGQoMyknKS5jc3MoJ2xlZnQnLCBfbGVmdCk7XG4gICAgICAgICQoJ3RhYmxlIHRkOm50aC1jaGlsZCg0KScpLmNzcygnbGVmdCcsIF9sZWZ0KS5hZGRDbGFzcygnYm94LXNoYWRvdycpO1xuICAgICAgICBpZiAoTnVtYmVyKCQodGhpcykuc2Nyb2xsTGVmdCgpKSA9PT0gMCkge1xuICAgICAgICAgICAgJCgndGFibGUgdGgnKS5lcSgzKS5yZW1vdmVDbGFzcygnYm94LXNoYWRvdycpO1xuICAgICAgICAgICAgJCgndGFibGUgdGQ6bnRoLWNoaWxkKDQpJykucmVtb3ZlQ2xhc3MoJ2JveC1zaGFkb3cnKTtcbiAgICAgICAgfVxuICAgICAgICBnYSgnc2VuZCcsIHtcbiAgICAgICAgICAgIGhpdFR5cGU6ICdldmVudCcsXG4gICAgICAgICAgICBldmVudENhdGVnb3J5OiAnc3RvcmVsaXN0JyxcbiAgICAgICAgICAgIGV2ZW50QWN0aW9uOiAnZGF0ZScsXG4gICAgICAgICAgICBldmVudExhYmVsOiAkKHRoaXMpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLmNoYW5nZShmdW5jdGlvbigpe1xuICAgICAgICBmaWxsRGF0YSgpO1xuICAgIH0pO1xuICAgICQoXCIucGFnZS10dXJpbmcucHJldlwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICBpZiAoJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoKSA9PSAxKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpIC0gMSk7XG4gICAgICAgIGZpbGxEYXRhKCk7XG4gICAgICAgIGdhKCdzZW5kJywge1xuICAgICAgICAgICAgaGl0VHlwZTogJ2V2ZW50JyxcbiAgICAgICAgICAgIGV2ZW50Q2F0ZWdvcnk6ICdzdG9yZWxpc3QnLFxuICAgICAgICAgICAgZXZlbnRBY3Rpb246ICdwYWdlLXR1cmluZycsXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoXCIucGFnZS10dXJpbmcubmV4dFwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICBpZiAoJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoKSA9PSAkKFwiLnNlbGVjdC1wYWdlIG9wdGlvblwiKS5sZW5ndGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbChOdW1iZXIoJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoKSkgKyAxKTtcbiAgICAgICAgZmlsbERhdGEoKTtcbiAgICAgICAgZ2EoJ3NlbmQnLCB7XG4gICAgICAgICAgICBoaXRUeXBlOiAnZXZlbnQnLFxuICAgICAgICAgICAgZXZlbnRDYXRlZ29yeTogJ3N0b3JlbGlzdCcsXG4gICAgICAgICAgICBldmVudEFjdGlvbjogJ3BhZ2UtdHVyaW5nJyxcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgJChcIi5hZGQtaW1hZ2U6ZXEoMClcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIG9wID0gJChcIi5leHBsYWluLWJveFwiKS5hdHRyKFwiaGlkZGVuXCIpID09IFwiaGlkZGVuXCIgPyAkKFwiLmV4cGxhaW4tYm94XCIpLnJlbW92ZUF0dHIoXCJoaWRkZW5cIikgOiAkKFwiLmV4cGxhaW4tYm94XCIpLmF0dHIoXCJoaWRkZW5cIiwgXCJoaWRkZW5cIik7XG4gICAgfSk7XG4gICAgJChcIi5hZGQtaW1hZ2U6ZXEoMSlcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIG9wID0gJChcIi5hZGQtaXRlbXNcIikuYXR0cihcImhpZGRlblwiKSA9PSBcImhpZGRlblwiID8gJChcIi5hZGQtaXRlbXNcIikucmVtb3ZlQXR0cihcImhpZGRlblwiKSA6ICQoXCIuYWRkLWl0ZW1zXCIpLmF0dHIoXCJoaWRkZW5cIiwgXCJoaWRkZW5cIik7XG4gICAgfSk7XG4gICAgJChcIi5mbG9hdC1yaWdodCBpbnB1dDplcSgwKSwgLmZsb2F0LXJpZ2h0IGlucHV0OmVxKDEpXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICQoXCIuYWRkLWl0ZW1zXCIpLmF0dHIoXCJoaWRkZW5cIiwgXCJoaWRkZW5cIik7XG4gICAgfSk7XG4gICAgJChcIi5mbG9hdC1yaWdodCBpbnB1dDplcSgyKVwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAkKFwiLmFkZC1pdGVtc1wiKS5hdHRyKFwiaGlkZGVuXCIsIFwiaGlkZGVuXCIpO1xuXG4gICAgICAgICQoJ2lucHV0OmNoZWNrYm94Om5vdCg6Y2hlY2tlZCknKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBoaWRlVGFibGVDb2woJChcInRhYmxlXCIpLCAkKHRoaXMpLmF0dHIoXCJ2YWx1ZVwiKSk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCdpbnB1dDpjaGVja2JveDpjaGVja2VkJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgc2hvd1RhYmxlQ29sKCQoXCJ0YWJsZVwiKSwgJCh0aGlzKS5hdHRyKFwidmFsdWVcIikpO1xuICAgICAgICB9KTtcbiAgICAgICAgc2V0VGJhbGVXaWR0aCgpO1xuICAgIH0pO1xuXG4gICAgJChcIi5zZWFyY2ggaW1nXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmICgkLnRyaW0oJChcIi5zZWFyY2ggaW5wdXRcIikudmFsKCkpICE9PSBcIlwiKXtcbiAgICAgICAgICAgIGZpbGxEYXRhKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoXCIuc2VhcmNoIGlucHV0XCIpLmtleWRvd24oZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT0gMTMpe1xuICAgICAgICAgICAgZmlsbERhdGEoKTtcbiAgICAgICAgfVxuICAgICAgICBnYSgnc2VuZCcsIHtcbiAgICAgICAgICAgIGhpdFR5cGU6ICdldmVudCcsXG4gICAgICAgICAgICBldmVudENhdGVnb3J5OiAnc3RvcmVsaXN0JyxcbiAgICAgICAgICAgIGV2ZW50QWN0aW9uOiAnc2VhcmNoJyxcbiAgICAgICAgICAgIGV2ZW50TGFiZWw6ICQodGhpcykudmFsKClcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAkKFwidGFibGVcIikudGFibGVzb3J0KHtmdW5jOiBmdW5jdGlvbigpe2ZpbGxEYXRhKCk7fX0pO1xuXG4gICAgJChcIi5kb3dubG9hZFwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAkKFwidGFibGVcIikudGFibGVFeHBvcnQoe1xuICAgICAgICAgICAgaGVhZGluZ3M6IHRydWUsXG4gICAgICAgICAgICBmaWxlTmFtZTogXCJzdG9yZXNcIixcbiAgICAgICAgICAgIGZvcm1hdHM6IFtcImNzdlwiXSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBcImJvdHRvbVwiLFxuICAgICAgICAgICAgaWdub3JlQ1NTOiBcIltzdHlsZSo9J2Rpc3BsYXk6IG5vbmUnXVwiXG4gICAgICAgIH0pO1xuICAgICAgICBnYSgnc2VuZCcsIHtcbiAgICAgICAgICAgIGhpdFR5cGU6ICdldmVudCcsXG4gICAgICAgICAgICBldmVudENhdGVnb3J5OiAnc3RvcmVsaXN0JyxcbiAgICAgICAgICAgIGV2ZW50QWN0aW9uOiAnZG93bmxvYWQnLFxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAgICAgLy8gJChcIi5idG4tdG9vbGJhci5ib3R0b21cIikuYXR0cihcImhpZGRlblwiLCBcImhpZGRlblwiKTtcblxuICAgICQoJy50YWJsZS1ib3JkZXInKS5zY3JvbGwoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfbGVmdCA9ICQodGhpcykuc2Nyb2xsTGVmdCgpO1xuICAgICAgICAkKCd0YWJsZSB0aCcpLmVxKDApLmNzcygnbGVmdCcsIF9sZWZ0KTtcbiAgICAgICAgJCgndGFibGUgdGgnKS5lcSgxKS5jc3MoJ2xlZnQnLCBfbGVmdCk7XG4gICAgICAgICQoJ3RhYmxlIHRoJykuZXEoMikuY3NzKCdsZWZ0JywgX2xlZnQpO1xuICAgICAgICAkKCd0YWJsZSB0aCcpLmVxKDMpLmNzcygnbGVmdCcsIF9sZWZ0KS5hZGRDbGFzcygnYm94LXNoYWRvdycpO1xuICAgICAgICAkKCd0YWJsZSB0ZDpudGgtY2hpbGQoMSknKS5jc3MoJ2xlZnQnLCBfbGVmdCk7XG4gICAgICAgICQoJ3RhYmxlIHRkOm50aC1jaGlsZCgyKScpLmNzcygnbGVmdCcsIF9sZWZ0KTtcbiAgICAgICAgJCgndGFibGUgdGQ6bnRoLWNoaWxkKDMpJykuY3NzKCdsZWZ0JywgX2xlZnQpO1xuICAgICAgICAkKCd0YWJsZSB0ZDpudGgtY2hpbGQoNCknKS5jc3MoJ2xlZnQnLCBfbGVmdCkuYWRkQ2xhc3MoJ2JveC1zaGFkb3cnKTtcbiAgICAgICAgaWYgKE51bWJlcigkKHRoaXMpLnNjcm9sbExlZnQoKSkgPT09IDApIHtcbiAgICAgICAgICAgICQoJ3RhYmxlIHRoJykuZXEoMykucmVtb3ZlQ2xhc3MoJ2JveC1zaGFkb3cnKTtcbiAgICAgICAgICAgICQoJ3RhYmxlIHRkOm50aC1jaGlsZCg0KScpLnJlbW92ZUNsYXNzKCdib3gtc2hhZG93Jyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyJdLCJmaWxlIjoiYW5hbHl0aWNzL3N0b3JlX2FuYWx5c2lzLmpzIn0=
