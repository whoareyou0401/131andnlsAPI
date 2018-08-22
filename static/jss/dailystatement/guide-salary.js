function fillData(){
    var startTime = $("#startTime").attr("value");
    console.log(1);
    var endTime = $("#endTime").attr("value");
    console.log(2);
    var page = $(".select-page").val() || 1;
    console.log(3);
    var arg = $(".search input").val();
    console.log(4);
    var sort = $("th .ascending").parent().attr("value") || $("th .descending").parent().attr("value");
    console.log(5);
    var order = $(".ascending").attr("class") || $(".descending").attr("class");
    console.log(6);
    var intervalTime = compareDate(startTime,endTime);
    console.log(7);
    if ($.trim(arg) !== ""){
        page = 1;
        console.log(8);
    }
    console.log('store');
    console.log(startTime+','+endTime);
    $.ajax({
        url: "/api/v1.0/dailystatement/commission",
        data: {"start_time": startTime, "end_time": endTime, "page":page, "arg":arg, "sort": sort, "order": order},
        type: "GET",
        success: function (data) {
            console.log(9);
            if (data.success == 1) {
                $(".pagination p span").eq(0).text(data.data.pages);
                $(".pagination p span").eq(1).text(data.data.count);
                $(".select-page option").remove();
                for (var j = 1; j <= data.data.pages; j++){
                    $(".select-page").append("<option value="+j+">第" + num2Chinese(j) + "页</option>");
                }
                $(".select-page").val(page);
                // var newRow = "<tr><td></td><td></td><td></td><td></td><td></td></tr>";
                // $("table tbody tr").remove();
                // for (var i = 0; i < data.data.data.length; i++) {
                //     $("table tbody").append(newRow);
                //     ii = i + 1;
                //     iii = i + 1 + (page-1) * 10;
                //     var number = data.data.data[i].number || '无';
                //     var commission = data.data.data[i].commission || 0;
                //     var guide = data.data.data[i].guide || '无';
                //     $("table tr:eq(" + ii + ")").attr("value", data.data.data[i].id);
                //     $("table tr:eq(" + ii + ") td:eq(0)").text(iii);
                //     $("table tr:eq(" + ii + ") td:eq(1)").text(number);
                //     $("table tr:eq(" + ii + ") td:eq(2)").html("<a href='/dailystatement/store-detail/"+ data.data.data[i].id + "'>" + data.data.data[i].store_name+ "</a>");
                //     $("table tr:eq(" + ii + ") td:eq(3)").text(commission);
                //     $("table tr:eq(" + ii + ") td:eq(4)").text(guide);
                // }
              
                setTbaleWidth();
            }else {
                location.href = "/logout";
            }
        }
    });
}


$(document).ready(function(){
    $(".sidebar li").eq(0).addClass("active").siblings().removeClass("active");
    var d = new Date();
    var start_time = d.getFullYear()+"-"+(d.getMonth()+1)+"-1";
    var end_time = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    $("#startTime").attr("value",start_time);
    $("#endTime").attr("value",end_time);
    fillData();
    

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
    });
    $(".select-page").change(function(){
        fillData();
    });
    $(".page-turing.prev").click(function(){
        if ($(".select-page").val() == 1)
            return;
        $(".select-page").val($(".select-page").val() - 1);
        fillData();
    });
    $(".page-turing.next").click(function(){
        if ($(".select-page").val() == $(".select-page option").length)
        {
            return;
        }
        $(".select-page").val(Number($(".select-page").val()) + 1);
        fillData();
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
    });

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkYWlseXN0YXRlbWVudC9ndWlkZS1zYWxhcnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gZmlsbERhdGEoKXtcbiAgICB2YXIgc3RhcnRUaW1lID0gJChcIiNzdGFydFRpbWVcIikuYXR0cihcInZhbHVlXCIpO1xuICAgIGNvbnNvbGUubG9nKDEpO1xuICAgIHZhciBlbmRUaW1lID0gJChcIiNlbmRUaW1lXCIpLmF0dHIoXCJ2YWx1ZVwiKTtcbiAgICBjb25zb2xlLmxvZygyKTtcbiAgICB2YXIgcGFnZSA9ICQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKCkgfHwgMTtcbiAgICBjb25zb2xlLmxvZygzKTtcbiAgICB2YXIgYXJnID0gJChcIi5zZWFyY2ggaW5wdXRcIikudmFsKCk7XG4gICAgY29uc29sZS5sb2coNCk7XG4gICAgdmFyIHNvcnQgPSAkKFwidGggLmFzY2VuZGluZ1wiKS5wYXJlbnQoKS5hdHRyKFwidmFsdWVcIikgfHwgJChcInRoIC5kZXNjZW5kaW5nXCIpLnBhcmVudCgpLmF0dHIoXCJ2YWx1ZVwiKTtcbiAgICBjb25zb2xlLmxvZyg1KTtcbiAgICB2YXIgb3JkZXIgPSAkKFwiLmFzY2VuZGluZ1wiKS5hdHRyKFwiY2xhc3NcIikgfHwgJChcIi5kZXNjZW5kaW5nXCIpLmF0dHIoXCJjbGFzc1wiKTtcbiAgICBjb25zb2xlLmxvZyg2KTtcbiAgICB2YXIgaW50ZXJ2YWxUaW1lID0gY29tcGFyZURhdGUoc3RhcnRUaW1lLGVuZFRpbWUpO1xuICAgIGNvbnNvbGUubG9nKDcpO1xuICAgIGlmICgkLnRyaW0oYXJnKSAhPT0gXCJcIil7XG4gICAgICAgIHBhZ2UgPSAxO1xuICAgICAgICBjb25zb2xlLmxvZyg4KTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coJ3N0b3JlJyk7XG4gICAgY29uc29sZS5sb2coc3RhcnRUaW1lKycsJytlbmRUaW1lKTtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IFwiL2FwaS92MS4wL2RhaWx5c3RhdGVtZW50L2NvbW1pc3Npb25cIixcbiAgICAgICAgZGF0YToge1wic3RhcnRfdGltZVwiOiBzdGFydFRpbWUsIFwiZW5kX3RpbWVcIjogZW5kVGltZSwgXCJwYWdlXCI6cGFnZSwgXCJhcmdcIjphcmcsIFwic29ydFwiOiBzb3J0LCBcIm9yZGVyXCI6IG9yZGVyfSxcbiAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDkpO1xuICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgJChcIi5wYWdpbmF0aW9uIHAgc3BhblwiKS5lcSgwKS50ZXh0KGRhdGEuZGF0YS5wYWdlcyk7XG4gICAgICAgICAgICAgICAgJChcIi5wYWdpbmF0aW9uIHAgc3BhblwiKS5lcSgxKS50ZXh0KGRhdGEuZGF0YS5jb3VudCk7XG4gICAgICAgICAgICAgICAgJChcIi5zZWxlY3QtcGFnZSBvcHRpb25cIikucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDE7IGogPD0gZGF0YS5kYXRhLnBhZ2VzOyBqKyspe1xuICAgICAgICAgICAgICAgICAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLmFwcGVuZChcIjxvcHRpb24gdmFsdWU9XCIraitcIj7nrKxcIiArIG51bTJDaGluZXNlKGopICsgXCLpobU8L29wdGlvbj5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKHBhZ2UpO1xuICAgICAgICAgICAgICAgIC8vIHZhciBuZXdSb3cgPSBcIjx0cj48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48L3RyPlwiO1xuICAgICAgICAgICAgICAgIC8vICQoXCJ0YWJsZSB0Ym9keSB0clwiKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAvLyBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuZGF0YS5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICQoXCJ0YWJsZSB0Ym9keVwiKS5hcHBlbmQobmV3Um93KTtcbiAgICAgICAgICAgICAgICAvLyAgICAgaWkgPSBpICsgMTtcbiAgICAgICAgICAgICAgICAvLyAgICAgaWlpID0gaSArIDEgKyAocGFnZS0xKSAqIDEwO1xuICAgICAgICAgICAgICAgIC8vICAgICB2YXIgbnVtYmVyID0gZGF0YS5kYXRhLmRhdGFbaV0ubnVtYmVyIHx8ICfml6AnO1xuICAgICAgICAgICAgICAgIC8vICAgICB2YXIgY29tbWlzc2lvbiA9IGRhdGEuZGF0YS5kYXRhW2ldLmNvbW1pc3Npb24gfHwgMDtcbiAgICAgICAgICAgICAgICAvLyAgICAgdmFyIGd1aWRlID0gZGF0YS5kYXRhLmRhdGFbaV0uZ3VpZGUgfHwgJ+aXoCc7XG4gICAgICAgICAgICAgICAgLy8gICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpXCIpLmF0dHIoXCJ2YWx1ZVwiLCBkYXRhLmRhdGEuZGF0YVtpXS5pZCk7XG4gICAgICAgICAgICAgICAgLy8gICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDApXCIpLnRleHQoaWlpKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoMSlcIikudGV4dChudW1iZXIpO1xuICAgICAgICAgICAgICAgIC8vICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSgyKVwiKS5odG1sKFwiPGEgaHJlZj0nL2RhaWx5c3RhdGVtZW50L3N0b3JlLWRldGFpbC9cIisgZGF0YS5kYXRhLmRhdGFbaV0uaWQgKyBcIic+XCIgKyBkYXRhLmRhdGEuZGF0YVtpXS5zdG9yZV9uYW1lKyBcIjwvYT5cIik7XG4gICAgICAgICAgICAgICAgLy8gICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDMpXCIpLnRleHQoY29tbWlzc2lvbik7XG4gICAgICAgICAgICAgICAgLy8gICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDQpXCIpLnRleHQoZ3VpZGUpO1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgc2V0VGJhbGVXaWR0aCgpO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uLmhyZWYgPSBcIi9sb2dvdXRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgJChcIi5zaWRlYmFyIGxpXCIpLmVxKDApLmFkZENsYXNzKFwiYWN0aXZlXCIpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciBzdGFydF90aW1lID0gZC5nZXRGdWxsWWVhcigpK1wiLVwiKyhkLmdldE1vbnRoKCkrMSkrXCItMVwiO1xuICAgIHZhciBlbmRfdGltZSA9IGQuZ2V0RnVsbFllYXIoKStcIi1cIisoZC5nZXRNb250aCgpKzEpK1wiLVwiK2QuZ2V0RGF0ZSgpO1xuICAgICQoXCIjc3RhcnRUaW1lXCIpLmF0dHIoXCJ2YWx1ZVwiLHN0YXJ0X3RpbWUpO1xuICAgICQoXCIjZW5kVGltZVwiKS5hdHRyKFwidmFsdWVcIixlbmRfdGltZSk7XG4gICAgZmlsbERhdGEoKTtcbiAgICBcblxuICAgICQoXCJhW3ZhbHVlPSdzdG9yZWFuYWx5c2lzJ11cIikuYWRkQ2xhc3MoXCJzaWRlYmFyLWNvbG9yXCIpO1xuXG4gICAgJChcIi5kYXRlIGxpXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJChcIi5kYXRlLWNob2ljZWRcIikucmVtb3ZlQ2xhc3MoKTtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcImRhdGUtY2hvaWNlZFwiKTtcbiAgICAgICAgZmlsbERhdGEoKTtcbiAgICAgICAgdmFyIF9sZWZ0ID0gJCh0aGlzKS5zY3JvbGxMZWZ0KCk7XG4gICAgICAgICQoJ3RhYmxlIHRoJykuZXEoMCkuY3NzKCdsZWZ0JywgX2xlZnQpO1xuICAgICAgICAkKCd0YWJsZSB0aCcpLmVxKDEpLmNzcygnbGVmdCcsIF9sZWZ0KTtcbiAgICAgICAgJCgndGFibGUgdGgnKS5lcSgyKS5jc3MoJ2xlZnQnLCBfbGVmdCk7XG4gICAgICAgICQoJ3RhYmxlIHRoJykuZXEoMykuY3NzKCdsZWZ0JywgX2xlZnQpLmFkZENsYXNzKCdib3gtc2hhZG93Jyk7XG4gICAgICAgICQoJ3RhYmxlIHRkOm50aC1jaGlsZCgxKScpLmNzcygnbGVmdCcsIF9sZWZ0KTtcbiAgICAgICAgJCgndGFibGUgdGQ6bnRoLWNoaWxkKDIpJykuY3NzKCdsZWZ0JywgX2xlZnQpO1xuICAgICAgICAkKCd0YWJsZSB0ZDpudGgtY2hpbGQoMyknKS5jc3MoJ2xlZnQnLCBfbGVmdCk7XG4gICAgICAgICQoJ3RhYmxlIHRkOm50aC1jaGlsZCg0KScpLmNzcygnbGVmdCcsIF9sZWZ0KS5hZGRDbGFzcygnYm94LXNoYWRvdycpO1xuICAgICAgICBpZiAoTnVtYmVyKCQodGhpcykuc2Nyb2xsTGVmdCgpKSA9PT0gMCkge1xuICAgICAgICAgICAgJCgndGFibGUgdGgnKS5lcSgzKS5yZW1vdmVDbGFzcygnYm94LXNoYWRvdycpO1xuICAgICAgICAgICAgJCgndGFibGUgdGQ6bnRoLWNoaWxkKDQpJykucmVtb3ZlQ2xhc3MoJ2JveC1zaGFkb3cnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICQoXCIuc2VsZWN0LXBhZ2VcIikuY2hhbmdlKGZ1bmN0aW9uKCl7XG4gICAgICAgIGZpbGxEYXRhKCk7XG4gICAgfSk7XG4gICAgJChcIi5wYWdlLXR1cmluZy5wcmV2XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmICgkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpID09IDEpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKCQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKCkgLSAxKTtcbiAgICAgICAgZmlsbERhdGEoKTtcbiAgICB9KTtcbiAgICAkKFwiLnBhZ2UtdHVyaW5nLm5leHRcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgaWYgKCQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKCkgPT0gJChcIi5zZWxlY3QtcGFnZSBvcHRpb25cIikubGVuZ3RoKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoTnVtYmVyKCQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKCkpICsgMSk7XG4gICAgICAgIGZpbGxEYXRhKCk7XG4gICAgfSk7XG4gICAgJChcIi5hZGQtaW1hZ2U6ZXEoMClcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIG9wID0gJChcIi5leHBsYWluLWJveFwiKS5hdHRyKFwiaGlkZGVuXCIpID09IFwiaGlkZGVuXCIgPyAkKFwiLmV4cGxhaW4tYm94XCIpLnJlbW92ZUF0dHIoXCJoaWRkZW5cIikgOiAkKFwiLmV4cGxhaW4tYm94XCIpLmF0dHIoXCJoaWRkZW5cIiwgXCJoaWRkZW5cIik7XG4gICAgfSk7XG4gICAgJChcIi5hZGQtaW1hZ2U6ZXEoMSlcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIG9wID0gJChcIi5hZGQtaXRlbXNcIikuYXR0cihcImhpZGRlblwiKSA9PSBcImhpZGRlblwiID8gJChcIi5hZGQtaXRlbXNcIikucmVtb3ZlQXR0cihcImhpZGRlblwiKSA6ICQoXCIuYWRkLWl0ZW1zXCIpLmF0dHIoXCJoaWRkZW5cIiwgXCJoaWRkZW5cIik7XG4gICAgfSk7XG4gICAgJChcIi5mbG9hdC1yaWdodCBpbnB1dDplcSgwKSwgLmZsb2F0LXJpZ2h0IGlucHV0OmVxKDEpXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICQoXCIuYWRkLWl0ZW1zXCIpLmF0dHIoXCJoaWRkZW5cIiwgXCJoaWRkZW5cIik7XG4gICAgfSk7XG4gICAgJChcIi5mbG9hdC1yaWdodCBpbnB1dDplcSgyKVwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAkKFwiLmFkZC1pdGVtc1wiKS5hdHRyKFwiaGlkZGVuXCIsIFwiaGlkZGVuXCIpO1xuXG4gICAgICAgICQoJ2lucHV0OmNoZWNrYm94Om5vdCg6Y2hlY2tlZCknKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBoaWRlVGFibGVDb2woJChcInRhYmxlXCIpLCAkKHRoaXMpLmF0dHIoXCJ2YWx1ZVwiKSk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCdpbnB1dDpjaGVja2JveDpjaGVja2VkJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgc2hvd1RhYmxlQ29sKCQoXCJ0YWJsZVwiKSwgJCh0aGlzKS5hdHRyKFwidmFsdWVcIikpO1xuICAgICAgICB9KTtcbiAgICAgICAgc2V0VGJhbGVXaWR0aCgpO1xuICAgIH0pO1xuXG4gICAgJChcIi5zZWFyY2ggaW1nXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmICgkLnRyaW0oJChcIi5zZWFyY2ggaW5wdXRcIikudmFsKCkpICE9PSBcIlwiKXtcbiAgICAgICAgICAgIGZpbGxEYXRhKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoXCIuc2VhcmNoIGlucHV0XCIpLmtleWRvd24oZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT0gMTMpe1xuICAgICAgICAgICAgZmlsbERhdGEoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJChcInRhYmxlXCIpLnRhYmxlc29ydCh7ZnVuYzogZnVuY3Rpb24oKXtmaWxsRGF0YSgpO319KTtcblxuICAgICQoXCIuZG93bmxvYWRcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgJChcInRhYmxlXCIpLnRhYmxlRXhwb3J0KHtcbiAgICAgICAgICAgIGhlYWRpbmdzOiB0cnVlLFxuICAgICAgICAgICAgZmlsZU5hbWU6IFwic3RvcmVzXCIsXG4gICAgICAgICAgICBmb3JtYXRzOiBbXCJjc3ZcIl0sXG4gICAgICAgICAgICBwb3NpdGlvbjogXCJib3R0b21cIixcbiAgICAgICAgICAgIGlnbm9yZUNTUzogXCJbc3R5bGUqPSdkaXNwbGF5OiBub25lJ11cIlxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICQoJy50YWJsZS1ib3JkZXInKS5zY3JvbGwoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfbGVmdCA9ICQodGhpcykuc2Nyb2xsTGVmdCgpO1xuICAgICAgICAkKCd0YWJsZSB0aCcpLmVxKDApLmNzcygnbGVmdCcsIF9sZWZ0KTtcbiAgICAgICAgJCgndGFibGUgdGgnKS5lcSgxKS5jc3MoJ2xlZnQnLCBfbGVmdCk7XG4gICAgICAgICQoJ3RhYmxlIHRoJykuZXEoMikuY3NzKCdsZWZ0JywgX2xlZnQpO1xuICAgICAgICAkKCd0YWJsZSB0aCcpLmVxKDMpLmNzcygnbGVmdCcsIF9sZWZ0KS5hZGRDbGFzcygnYm94LXNoYWRvdycpO1xuICAgICAgICAkKCd0YWJsZSB0ZDpudGgtY2hpbGQoMSknKS5jc3MoJ2xlZnQnLCBfbGVmdCk7XG4gICAgICAgICQoJ3RhYmxlIHRkOm50aC1jaGlsZCgyKScpLmNzcygnbGVmdCcsIF9sZWZ0KTtcbiAgICAgICAgJCgndGFibGUgdGQ6bnRoLWNoaWxkKDMpJykuY3NzKCdsZWZ0JywgX2xlZnQpO1xuICAgICAgICAkKCd0YWJsZSB0ZDpudGgtY2hpbGQoNCknKS5jc3MoJ2xlZnQnLCBfbGVmdCkuYWRkQ2xhc3MoJ2JveC1zaGFkb3cnKTtcbiAgICAgICAgaWYgKE51bWJlcigkKHRoaXMpLnNjcm9sbExlZnQoKSkgPT09IDApIHtcbiAgICAgICAgICAgICQoJ3RhYmxlIHRoJykuZXEoMykucmVtb3ZlQ2xhc3MoJ2JveC1zaGFkb3cnKTtcbiAgICAgICAgICAgICQoJ3RhYmxlIHRkOm50aC1jaGlsZCg0KScpLnJlbW92ZUNsYXNzKCdib3gtc2hhZG93Jyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyJdLCJmaWxlIjoiZGFpbHlzdGF0ZW1lbnQvZ3VpZGUtc2FsYXJ5LmpzIn0=
