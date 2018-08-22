function fillData(){
    var startTime = $("#startTime").attr("value");
    var endTime = $("#endTime").attr("value");
    var arg = $(".search input").val();
    var sort = $("th .ascending").parent().attr("value") || $("th .descending").parent().attr("value");
    var order = $(".ascending").attr("class") || $(".descending").attr("class");
    var intervalTime = compareDate(startTime,endTime);
    if ($.trim(arg) !== ""){
        page = 1;
    }
    $.ajax({
        url: "/api/v1.0/dailystatement/work_checkin",
        data: {"start_time": startTime, "end_time": endTime, "arg":arg, "sort": sort, "order": order},
        type: "GET",
        success: function (data) {
            if (data.success == 1) {
                var newRow = "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                $("table tbody tr").remove();
                for (var i = 0; i < data.data.data.length; i++) {
                    $("table tbody").append(newRow);
                    ii = i + 1;
                    var number = data.data.data[i].number || '无';
                    var store_name = data.data.data[i].store_name || '无';
                    var name = data.data.data[i].name || '无';
                    $("table tr:eq(" + ii + ")").attr("value", data.data.data[i].id);
                    $("table tr:eq(" + ii + ") td:eq(0)").text(number);
                    $("table tr:eq(" + ii + ") td:eq(1)").text(data.data.data[i].store_name);
                    $("table tr:eq(" + ii + ") td:eq(2)").text(name);
                    $("table tr:eq(" + ii + ") td:eq(3)").text(data.data.data[i].work_time);
                    $("table tr:eq(" + ii + ") td:eq(4)").text(data.data.data[i].work_address);
                    $("table tr:eq(" + ii + ") td:eq(5)").text(data.data.data[i].worked_time);
                    $("table tr:eq(" + ii + ") td:eq(6)").text(data.data.data[i].worked_address);
                    $("table tr:eq(" + ii + ") td:eq(7)").text(data.data.data[i].phone_model);
                    $("table tr:eq(" + ii + ") td:eq(8)").text(data.data.data[i].phone_platform);
                    $("table tr:eq(" + ii + ") td:eq(9)").text(data.data.data[i].phone_system);
                }
              
                setTbaleWidth();
            }else {
                location.href = "/logout";
            }
        }
    });
}


$(document).ready(function(){
    $(".sidebar li").eq(1).addClass("active").siblings().removeClass("active");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkYWlseXN0YXRlbWVudC93b3JrX2NoZWNraW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gZmlsbERhdGEoKXtcbiAgICB2YXIgc3RhcnRUaW1lID0gJChcIiNzdGFydFRpbWVcIikuYXR0cihcInZhbHVlXCIpO1xuICAgIHZhciBlbmRUaW1lID0gJChcIiNlbmRUaW1lXCIpLmF0dHIoXCJ2YWx1ZVwiKTtcbiAgICB2YXIgYXJnID0gJChcIi5zZWFyY2ggaW5wdXRcIikudmFsKCk7XG4gICAgdmFyIHNvcnQgPSAkKFwidGggLmFzY2VuZGluZ1wiKS5wYXJlbnQoKS5hdHRyKFwidmFsdWVcIikgfHwgJChcInRoIC5kZXNjZW5kaW5nXCIpLnBhcmVudCgpLmF0dHIoXCJ2YWx1ZVwiKTtcbiAgICB2YXIgb3JkZXIgPSAkKFwiLmFzY2VuZGluZ1wiKS5hdHRyKFwiY2xhc3NcIikgfHwgJChcIi5kZXNjZW5kaW5nXCIpLmF0dHIoXCJjbGFzc1wiKTtcbiAgICB2YXIgaW50ZXJ2YWxUaW1lID0gY29tcGFyZURhdGUoc3RhcnRUaW1lLGVuZFRpbWUpO1xuICAgIGlmICgkLnRyaW0oYXJnKSAhPT0gXCJcIil7XG4gICAgICAgIHBhZ2UgPSAxO1xuICAgIH1cbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IFwiL2FwaS92MS4wL2RhaWx5c3RhdGVtZW50L3dvcmtfY2hlY2tpblwiLFxuICAgICAgICBkYXRhOiB7XCJzdGFydF90aW1lXCI6IHN0YXJ0VGltZSwgXCJlbmRfdGltZVwiOiBlbmRUaW1lLCBcImFyZ1wiOmFyZywgXCJzb3J0XCI6IHNvcnQsIFwib3JkZXJcIjogb3JkZXJ9LFxuICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld1JvdyA9IFwiPHRyPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjwvdHI+XCI7XG4gICAgICAgICAgICAgICAgJChcInRhYmxlIHRib2R5IHRyXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5kYXRhLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRib2R5XCIpLmFwcGVuZChuZXdSb3cpO1xuICAgICAgICAgICAgICAgICAgICBpaSA9IGkgKyAxO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbnVtYmVyID0gZGF0YS5kYXRhLmRhdGFbaV0ubnVtYmVyIHx8ICfml6AnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RvcmVfbmFtZSA9IGRhdGEuZGF0YS5kYXRhW2ldLnN0b3JlX25hbWUgfHwgJ+aXoCc7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuYW1lID0gZGF0YS5kYXRhLmRhdGFbaV0ubmFtZSB8fCAn5pegJztcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIilcIikuYXR0cihcInZhbHVlXCIsIGRhdGEuZGF0YS5kYXRhW2ldLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoMClcIikudGV4dChudW1iZXIpO1xuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSgxKVwiKS50ZXh0KGRhdGEuZGF0YS5kYXRhW2ldLnN0b3JlX25hbWUpO1xuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSgyKVwiKS50ZXh0KG5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSgzKVwiKS50ZXh0KGRhdGEuZGF0YS5kYXRhW2ldLndvcmtfdGltZSk7XG4gICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDQpXCIpLnRleHQoZGF0YS5kYXRhLmRhdGFbaV0ud29ya19hZGRyZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoNSlcIikudGV4dChkYXRhLmRhdGEuZGF0YVtpXS53b3JrZWRfdGltZSk7XG4gICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDYpXCIpLnRleHQoZGF0YS5kYXRhLmRhdGFbaV0ud29ya2VkX2FkZHJlc3MpO1xuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSg3KVwiKS50ZXh0KGRhdGEuZGF0YS5kYXRhW2ldLnBob25lX21vZGVsKTtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoOClcIikudGV4dChkYXRhLmRhdGEuZGF0YVtpXS5waG9uZV9wbGF0Zm9ybSk7XG4gICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDkpXCIpLnRleHQoZGF0YS5kYXRhLmRhdGFbaV0ucGhvbmVfc3lzdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHNldFRiYWxlV2lkdGgoKTtcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gXCIvbG9nb3V0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICQoXCIuc2lkZWJhciBsaVwiKS5lcSgxKS5hZGRDbGFzcyhcImFjdGl2ZVwiKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgIHZhciBkID0gbmV3IERhdGUoKTtcbiAgICB2YXIgc3RhcnRfdGltZSA9IGQuZ2V0RnVsbFllYXIoKStcIi1cIisoZC5nZXRNb250aCgpKzEpK1wiLTFcIjtcbiAgICB2YXIgZW5kX3RpbWUgPSBkLmdldEZ1bGxZZWFyKCkrXCItXCIrKGQuZ2V0TW9udGgoKSsxKStcIi1cIitkLmdldERhdGUoKTtcbiAgICAkKFwiI3N0YXJ0VGltZVwiKS5hdHRyKFwidmFsdWVcIixzdGFydF90aW1lKTtcbiAgICAkKFwiI2VuZFRpbWVcIikuYXR0cihcInZhbHVlXCIsZW5kX3RpbWUpO1xuICAgIGZpbGxEYXRhKCk7XG4gICAgXG5cbiAgICAkKFwiYVt2YWx1ZT0nc3RvcmVhbmFseXNpcyddXCIpLmFkZENsYXNzKFwic2lkZWJhci1jb2xvclwiKTtcblxuICAgICQoXCIuZGF0ZSBsaVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoXCIuZGF0ZS1jaG9pY2VkXCIpLnJlbW92ZUNsYXNzKCk7XG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJkYXRlLWNob2ljZWRcIik7XG4gICAgICAgIGZpbGxEYXRhKCk7XG4gICAgICAgIHZhciBfbGVmdCA9ICQodGhpcykuc2Nyb2xsTGVmdCgpO1xuICAgICAgICAkKCd0YWJsZSB0aCcpLmVxKDApLmNzcygnbGVmdCcsIF9sZWZ0KTtcbiAgICAgICAgJCgndGFibGUgdGgnKS5lcSgxKS5jc3MoJ2xlZnQnLCBfbGVmdCk7XG4gICAgICAgICQoJ3RhYmxlIHRoJykuZXEoMikuY3NzKCdsZWZ0JywgX2xlZnQpO1xuICAgICAgICAkKCd0YWJsZSB0aCcpLmVxKDMpLmNzcygnbGVmdCcsIF9sZWZ0KS5hZGRDbGFzcygnYm94LXNoYWRvdycpO1xuICAgICAgICAkKCd0YWJsZSB0ZDpudGgtY2hpbGQoMSknKS5jc3MoJ2xlZnQnLCBfbGVmdCk7XG4gICAgICAgICQoJ3RhYmxlIHRkOm50aC1jaGlsZCgyKScpLmNzcygnbGVmdCcsIF9sZWZ0KTtcbiAgICAgICAgJCgndGFibGUgdGQ6bnRoLWNoaWxkKDMpJykuY3NzKCdsZWZ0JywgX2xlZnQpO1xuICAgICAgICAkKCd0YWJsZSB0ZDpudGgtY2hpbGQoNCknKS5jc3MoJ2xlZnQnLCBfbGVmdCkuYWRkQ2xhc3MoJ2JveC1zaGFkb3cnKTtcbiAgICAgICAgaWYgKE51bWJlcigkKHRoaXMpLnNjcm9sbExlZnQoKSkgPT09IDApIHtcbiAgICAgICAgICAgICQoJ3RhYmxlIHRoJykuZXEoMykucmVtb3ZlQ2xhc3MoJ2JveC1zaGFkb3cnKTtcbiAgICAgICAgICAgICQoJ3RhYmxlIHRkOm50aC1jaGlsZCg0KScpLnJlbW92ZUNsYXNzKCdib3gtc2hhZG93Jyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLmNoYW5nZShmdW5jdGlvbigpe1xuICAgICAgICBmaWxsRGF0YSgpO1xuICAgIH0pO1xuICAgICQoXCIucGFnZS10dXJpbmcucHJldlwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICBpZiAoJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoKSA9PSAxKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpIC0gMSk7XG4gICAgICAgIGZpbGxEYXRhKCk7XG4gICAgfSk7XG4gICAgJChcIi5wYWdlLXR1cmluZy5uZXh0XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmICgkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpID09ICQoXCIuc2VsZWN0LXBhZ2Ugb3B0aW9uXCIpLmxlbmd0aClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKE51bWJlcigkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpKSArIDEpO1xuICAgICAgICBmaWxsRGF0YSgpO1xuICAgIH0pO1xuICAgICQoXCIuYWRkLWltYWdlOmVxKDApXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBvcCA9ICQoXCIuZXhwbGFpbi1ib3hcIikuYXR0cihcImhpZGRlblwiKSA9PSBcImhpZGRlblwiID8gJChcIi5leHBsYWluLWJveFwiKS5yZW1vdmVBdHRyKFwiaGlkZGVuXCIpIDogJChcIi5leHBsYWluLWJveFwiKS5hdHRyKFwiaGlkZGVuXCIsIFwiaGlkZGVuXCIpO1xuICAgIH0pO1xuICAgICQoXCIuYWRkLWltYWdlOmVxKDEpXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBvcCA9ICQoXCIuYWRkLWl0ZW1zXCIpLmF0dHIoXCJoaWRkZW5cIikgPT0gXCJoaWRkZW5cIiA/ICQoXCIuYWRkLWl0ZW1zXCIpLnJlbW92ZUF0dHIoXCJoaWRkZW5cIikgOiAkKFwiLmFkZC1pdGVtc1wiKS5hdHRyKFwiaGlkZGVuXCIsIFwiaGlkZGVuXCIpO1xuICAgIH0pO1xuICAgICQoXCIuZmxvYXQtcmlnaHQgaW5wdXQ6ZXEoMCksIC5mbG9hdC1yaWdodCBpbnB1dDplcSgxKVwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAkKFwiLmFkZC1pdGVtc1wiKS5hdHRyKFwiaGlkZGVuXCIsIFwiaGlkZGVuXCIpO1xuICAgIH0pO1xuICAgICQoXCIuZmxvYXQtcmlnaHQgaW5wdXQ6ZXEoMilcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgJChcIi5hZGQtaXRlbXNcIikuYXR0cihcImhpZGRlblwiLCBcImhpZGRlblwiKTtcblxuICAgICAgICAkKCdpbnB1dDpjaGVja2JveDpub3QoOmNoZWNrZWQpJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgaGlkZVRhYmxlQ29sKCQoXCJ0YWJsZVwiKSwgJCh0aGlzKS5hdHRyKFwidmFsdWVcIikpO1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnaW5wdXQ6Y2hlY2tib3g6Y2hlY2tlZCcpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHNob3dUYWJsZUNvbCgkKFwidGFibGVcIiksICQodGhpcykuYXR0cihcInZhbHVlXCIpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNldFRiYWxlV2lkdGgoKTtcbiAgICB9KTtcblxuICAgICQoXCIuc2VhcmNoIGltZ1wiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICBpZiAoJC50cmltKCQoXCIuc2VhcmNoIGlucHV0XCIpLnZhbCgpKSAhPT0gXCJcIil7XG4gICAgICAgICAgICBmaWxsRGF0YSgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkKFwiLnNlYXJjaCBpbnB1dFwiKS5rZXlkb3duKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgaWYgKGV2ZW50LndoaWNoID09IDEzKXtcbiAgICAgICAgICAgIGZpbGxEYXRhKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoXCJ0YWJsZVwiKS50YWJsZXNvcnQoe2Z1bmM6IGZ1bmN0aW9uKCl7ZmlsbERhdGEoKTt9fSk7XG5cbiAgICAkKFwiLmRvd25sb2FkXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICQoXCJ0YWJsZVwiKS50YWJsZUV4cG9ydCh7XG4gICAgICAgICAgICBoZWFkaW5nczogdHJ1ZSxcbiAgICAgICAgICAgIGZpbGVOYW1lOiBcInN0b3Jlc1wiLFxuICAgICAgICAgICAgZm9ybWF0czogW1wiY3N2XCJdLFxuICAgICAgICAgICAgcG9zaXRpb246IFwiYm90dG9tXCIsXG4gICAgICAgICAgICBpZ25vcmVDU1M6IFwiW3N0eWxlKj0nZGlzcGxheTogbm9uZSddXCJcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAkKCcudGFibGUtYm9yZGVyJykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX2xlZnQgPSAkKHRoaXMpLnNjcm9sbExlZnQoKTtcbiAgICAgICAgJCgndGFibGUgdGgnKS5lcSgwKS5jc3MoJ2xlZnQnLCBfbGVmdCk7XG4gICAgICAgICQoJ3RhYmxlIHRoJykuZXEoMSkuY3NzKCdsZWZ0JywgX2xlZnQpO1xuICAgICAgICAkKCd0YWJsZSB0aCcpLmVxKDIpLmNzcygnbGVmdCcsIF9sZWZ0KTtcbiAgICAgICAgJCgndGFibGUgdGgnKS5lcSgzKS5jc3MoJ2xlZnQnLCBfbGVmdCkuYWRkQ2xhc3MoJ2JveC1zaGFkb3cnKTtcbiAgICAgICAgJCgndGFibGUgdGQ6bnRoLWNoaWxkKDEpJykuY3NzKCdsZWZ0JywgX2xlZnQpO1xuICAgICAgICAkKCd0YWJsZSB0ZDpudGgtY2hpbGQoMiknKS5jc3MoJ2xlZnQnLCBfbGVmdCk7XG4gICAgICAgICQoJ3RhYmxlIHRkOm50aC1jaGlsZCgzKScpLmNzcygnbGVmdCcsIF9sZWZ0KTtcbiAgICAgICAgJCgndGFibGUgdGQ6bnRoLWNoaWxkKDQpJykuY3NzKCdsZWZ0JywgX2xlZnQpLmFkZENsYXNzKCdib3gtc2hhZG93Jyk7XG4gICAgICAgIGlmIChOdW1iZXIoJCh0aGlzKS5zY3JvbGxMZWZ0KCkpID09PSAwKSB7XG4gICAgICAgICAgICAkKCd0YWJsZSB0aCcpLmVxKDMpLnJlbW92ZUNsYXNzKCdib3gtc2hhZG93Jyk7XG4gICAgICAgICAgICAkKCd0YWJsZSB0ZDpudGgtY2hpbGQoNCknKS5yZW1vdmVDbGFzcygnYm94LXNoYWRvdycpO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsiXSwiZmlsZSI6ImRhaWx5c3RhdGVtZW50L3dvcmtfY2hlY2tpbi5qcyJ9
