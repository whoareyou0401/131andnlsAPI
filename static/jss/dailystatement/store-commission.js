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
        url: "/api/v1.0/dailystatement/commission",
        data: {"start_time": startTime, "end_time": endTime, "arg":arg, "sort": sort, "order": order},
        type: "GET",
        success: function (data) {
            if (data.success == 1) {
                var newRow = "<tr><td></td><td></td><td></td><td></td><td></td></tr>";
                $("table tbody tr").remove();
                for (var i = 0; i < data.data.data.length; i++) {
                    $("table tbody").append(newRow);
                    ii = i + 1;
                    var number = data.data.data[i].number || '无';
                    var commission = data.data.data[i].commission || 0;
                    var guide = data.data.data[i].guide || '无';
                    $("table tr:eq(" + ii + ")").attr("value", data.data.data[i].id);
                    $("table tr:eq(" + ii + ") td:eq(0)").text(ii);
                    $("table tr:eq(" + ii + ") td:eq(1)").text(number);
                    $("table tr:eq(" + ii + ") td:eq(2)").html("<a href='/dailystatement/store-detail/"+ data.data.data[i].id + "'>" + data.data.data[i].store_name+ "</a>");
                    $("table tr:eq(" + ii + ") td:eq(3)").text(commission);
                    $("table tr:eq(" + ii + ") td:eq(4)").text(guide);
                }
              
                setTbaleWidth();
            }else {
                location.href = "/logout";
            }
        }
    });
}


$(document).ready(function(){$(".sidebar li").eq(0).addClass("active").siblings().removeClass("active");

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var year_select = "#year-select option[value='"+ year + "']";
    var month_select = "#month-select option[value='" + month + "']";
    $(year_select).attr("selected",true);
    $(month_select).attr("selected",true);
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

    $("table").tableExport({
            headings: true,
            fileName: "stores",
            formats: ["csv","xls"],
            exportButtons: true,
            position: "bottom",
            ignoreCSS: "[style*='display: none']"
        });

    $("table").tablesort({func: function(){fillData();}});

    $(".download").click(function(){
        $("table").tableExport({
            headings: true,
            fileName: "stores",
            formats: ["csv","xls"],
            exportButtons: true,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkYWlseXN0YXRlbWVudC9zdG9yZS1jb21taXNzaW9uLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGZpbGxEYXRhKCl7XG4gICAgdmFyIHN0YXJ0VGltZSA9ICQoXCIjc3RhcnRUaW1lXCIpLmF0dHIoXCJ2YWx1ZVwiKTtcbiAgICB2YXIgZW5kVGltZSA9ICQoXCIjZW5kVGltZVwiKS5hdHRyKFwidmFsdWVcIik7XG4gICAgdmFyIGFyZyA9ICQoXCIuc2VhcmNoIGlucHV0XCIpLnZhbCgpO1xuICAgIHZhciBzb3J0ID0gJChcInRoIC5hc2NlbmRpbmdcIikucGFyZW50KCkuYXR0cihcInZhbHVlXCIpIHx8ICQoXCJ0aCAuZGVzY2VuZGluZ1wiKS5wYXJlbnQoKS5hdHRyKFwidmFsdWVcIik7XG4gICAgdmFyIG9yZGVyID0gJChcIi5hc2NlbmRpbmdcIikuYXR0cihcImNsYXNzXCIpIHx8ICQoXCIuZGVzY2VuZGluZ1wiKS5hdHRyKFwiY2xhc3NcIik7XG4gICAgdmFyIGludGVydmFsVGltZSA9IGNvbXBhcmVEYXRlKHN0YXJ0VGltZSxlbmRUaW1lKTtcbiAgICBpZiAoJC50cmltKGFyZykgIT09IFwiXCIpe1xuICAgICAgICBwYWdlID0gMTtcbiAgICB9XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBcIi9hcGkvdjEuMC9kYWlseXN0YXRlbWVudC9jb21taXNzaW9uXCIsXG4gICAgICAgIGRhdGE6IHtcInN0YXJ0X3RpbWVcIjogc3RhcnRUaW1lLCBcImVuZF90aW1lXCI6IGVuZFRpbWUsIFwiYXJnXCI6YXJnLCBcInNvcnRcIjogc29ydCwgXCJvcmRlclwiOiBvcmRlcn0sXG4gICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzID09IDEpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3Um93ID0gXCI8dHI+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PC90cj5cIjtcbiAgICAgICAgICAgICAgICAkKFwidGFibGUgdGJvZHkgdHJcIikucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmRhdGEuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdGJvZHlcIikuYXBwZW5kKG5ld1Jvdyk7XG4gICAgICAgICAgICAgICAgICAgIGlpID0gaSArIDE7XG4gICAgICAgICAgICAgICAgICAgIHZhciBudW1iZXIgPSBkYXRhLmRhdGEuZGF0YVtpXS5udW1iZXIgfHwgJ+aXoCc7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21taXNzaW9uID0gZGF0YS5kYXRhLmRhdGFbaV0uY29tbWlzc2lvbiB8fCAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZ3VpZGUgPSBkYXRhLmRhdGEuZGF0YVtpXS5ndWlkZSB8fCAn5pegJztcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIilcIikuYXR0cihcInZhbHVlXCIsIGRhdGEuZGF0YS5kYXRhW2ldLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoMClcIikudGV4dChpaSk7XG4gICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDEpXCIpLnRleHQobnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoMilcIikuaHRtbChcIjxhIGhyZWY9Jy9kYWlseXN0YXRlbWVudC9zdG9yZS1kZXRhaWwvXCIrIGRhdGEuZGF0YS5kYXRhW2ldLmlkICsgXCInPlwiICsgZGF0YS5kYXRhLmRhdGFbaV0uc3RvcmVfbmFtZSsgXCI8L2E+XCIpO1xuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSgzKVwiKS50ZXh0KGNvbW1pc3Npb24pO1xuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSg0KVwiKS50ZXh0KGd1aWRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHNldFRiYWxlV2lkdGgoKTtcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gXCIvbG9nb3V0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpeyQoXCIuc2lkZWJhciBsaVwiKS5lcSgwKS5hZGRDbGFzcyhcImFjdGl2ZVwiKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuXG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgIHZhciBtb250aCA9IGRhdGUuZ2V0TW9udGgoKSsxO1xuICAgIHZhciB5ZWFyX3NlbGVjdCA9IFwiI3llYXItc2VsZWN0IG9wdGlvblt2YWx1ZT0nXCIrIHllYXIgKyBcIiddXCI7XG4gICAgdmFyIG1vbnRoX3NlbGVjdCA9IFwiI21vbnRoLXNlbGVjdCBvcHRpb25bdmFsdWU9J1wiICsgbW9udGggKyBcIiddXCI7XG4gICAgJCh5ZWFyX3NlbGVjdCkuYXR0cihcInNlbGVjdGVkXCIsdHJ1ZSk7XG4gICAgJChtb250aF9zZWxlY3QpLmF0dHIoXCJzZWxlY3RlZFwiLHRydWUpO1xuICAgIHZhciBkID0gbmV3IERhdGUoKTtcbiAgICB2YXIgc3RhcnRfdGltZSA9IGQuZ2V0RnVsbFllYXIoKStcIi1cIisoZC5nZXRNb250aCgpKzEpK1wiLTFcIjtcbiAgICB2YXIgZW5kX3RpbWUgPSBkLmdldEZ1bGxZZWFyKCkrXCItXCIrKGQuZ2V0TW9udGgoKSsxKStcIi1cIitkLmdldERhdGUoKTtcbiAgICAkKFwiI3N0YXJ0VGltZVwiKS5hdHRyKFwidmFsdWVcIixzdGFydF90aW1lKTtcbiAgICAkKFwiI2VuZFRpbWVcIikuYXR0cihcInZhbHVlXCIsZW5kX3RpbWUpO1xuICAgIGZpbGxEYXRhKCk7XG4gICAgXG5cbiAgICAkKFwiYVt2YWx1ZT0nc3RvcmVhbmFseXNpcyddXCIpLmFkZENsYXNzKFwic2lkZWJhci1jb2xvclwiKTtcblxuICAgICQoXCIuZGF0ZSBsaVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoXCIuZGF0ZS1jaG9pY2VkXCIpLnJlbW92ZUNsYXNzKCk7XG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJkYXRlLWNob2ljZWRcIik7XG4gICAgICAgIGZpbGxEYXRhKCk7XG4gICAgICAgIHZhciBfbGVmdCA9ICQodGhpcykuc2Nyb2xsTGVmdCgpO1xuICAgICAgICAkKCd0YWJsZSB0aCcpLmVxKDApLmNzcygnbGVmdCcsIF9sZWZ0KTtcbiAgICAgICAgJCgndGFibGUgdGgnKS5lcSgxKS5jc3MoJ2xlZnQnLCBfbGVmdCk7XG4gICAgICAgICQoJ3RhYmxlIHRoJykuZXEoMikuY3NzKCdsZWZ0JywgX2xlZnQpO1xuICAgICAgICAkKCd0YWJsZSB0aCcpLmVxKDMpLmNzcygnbGVmdCcsIF9sZWZ0KS5hZGRDbGFzcygnYm94LXNoYWRvdycpO1xuICAgICAgICAkKCd0YWJsZSB0ZDpudGgtY2hpbGQoMSknKS5jc3MoJ2xlZnQnLCBfbGVmdCk7XG4gICAgICAgICQoJ3RhYmxlIHRkOm50aC1jaGlsZCgyKScpLmNzcygnbGVmdCcsIF9sZWZ0KTtcbiAgICAgICAgJCgndGFibGUgdGQ6bnRoLWNoaWxkKDMpJykuY3NzKCdsZWZ0JywgX2xlZnQpO1xuICAgICAgICAkKCd0YWJsZSB0ZDpudGgtY2hpbGQoNCknKS5jc3MoJ2xlZnQnLCBfbGVmdCkuYWRkQ2xhc3MoJ2JveC1zaGFkb3cnKTtcbiAgICAgICAgaWYgKE51bWJlcigkKHRoaXMpLnNjcm9sbExlZnQoKSkgPT09IDApIHtcbiAgICAgICAgICAgICQoJ3RhYmxlIHRoJykuZXEoMykucmVtb3ZlQ2xhc3MoJ2JveC1zaGFkb3cnKTtcbiAgICAgICAgICAgICQoJ3RhYmxlIHRkOm50aC1jaGlsZCg0KScpLnJlbW92ZUNsYXNzKCdib3gtc2hhZG93Jyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLmNoYW5nZShmdW5jdGlvbigpe1xuICAgICAgICBmaWxsRGF0YSgpO1xuICAgIH0pO1xuICAgICQoXCIucGFnZS10dXJpbmcucHJldlwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICBpZiAoJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoKSA9PSAxKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpIC0gMSk7XG4gICAgICAgIGZpbGxEYXRhKCk7XG4gICAgfSk7XG4gICAgJChcIi5wYWdlLXR1cmluZy5uZXh0XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmICgkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpID09ICQoXCIuc2VsZWN0LXBhZ2Ugb3B0aW9uXCIpLmxlbmd0aClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKE51bWJlcigkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpKSArIDEpO1xuICAgICAgICBmaWxsRGF0YSgpO1xuICAgIH0pO1xuICAgICQoXCIuYWRkLWltYWdlOmVxKDApXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBvcCA9ICQoXCIuZXhwbGFpbi1ib3hcIikuYXR0cihcImhpZGRlblwiKSA9PSBcImhpZGRlblwiID8gJChcIi5leHBsYWluLWJveFwiKS5yZW1vdmVBdHRyKFwiaGlkZGVuXCIpIDogJChcIi5leHBsYWluLWJveFwiKS5hdHRyKFwiaGlkZGVuXCIsIFwiaGlkZGVuXCIpO1xuICAgIH0pO1xuICAgICQoXCIuYWRkLWltYWdlOmVxKDEpXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBvcCA9ICQoXCIuYWRkLWl0ZW1zXCIpLmF0dHIoXCJoaWRkZW5cIikgPT0gXCJoaWRkZW5cIiA/ICQoXCIuYWRkLWl0ZW1zXCIpLnJlbW92ZUF0dHIoXCJoaWRkZW5cIikgOiAkKFwiLmFkZC1pdGVtc1wiKS5hdHRyKFwiaGlkZGVuXCIsIFwiaGlkZGVuXCIpO1xuICAgIH0pO1xuICAgICQoXCIuZmxvYXQtcmlnaHQgaW5wdXQ6ZXEoMCksIC5mbG9hdC1yaWdodCBpbnB1dDplcSgxKVwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAkKFwiLmFkZC1pdGVtc1wiKS5hdHRyKFwiaGlkZGVuXCIsIFwiaGlkZGVuXCIpO1xuICAgIH0pO1xuICAgICQoXCIuZmxvYXQtcmlnaHQgaW5wdXQ6ZXEoMilcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgJChcIi5hZGQtaXRlbXNcIikuYXR0cihcImhpZGRlblwiLCBcImhpZGRlblwiKTtcblxuICAgICAgICAkKCdpbnB1dDpjaGVja2JveDpub3QoOmNoZWNrZWQpJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgaGlkZVRhYmxlQ29sKCQoXCJ0YWJsZVwiKSwgJCh0aGlzKS5hdHRyKFwidmFsdWVcIikpO1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnaW5wdXQ6Y2hlY2tib3g6Y2hlY2tlZCcpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHNob3dUYWJsZUNvbCgkKFwidGFibGVcIiksICQodGhpcykuYXR0cihcInZhbHVlXCIpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNldFRiYWxlV2lkdGgoKTtcbiAgICB9KTtcblxuICAgICQoXCIuc2VhcmNoIGltZ1wiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICBpZiAoJC50cmltKCQoXCIuc2VhcmNoIGlucHV0XCIpLnZhbCgpKSAhPT0gXCJcIil7XG4gICAgICAgICAgICBmaWxsRGF0YSgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkKFwiLnNlYXJjaCBpbnB1dFwiKS5rZXlkb3duKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgaWYgKGV2ZW50LndoaWNoID09IDEzKXtcbiAgICAgICAgICAgIGZpbGxEYXRhKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoXCJ0YWJsZVwiKS50YWJsZUV4cG9ydCh7XG4gICAgICAgICAgICBoZWFkaW5nczogdHJ1ZSxcbiAgICAgICAgICAgIGZpbGVOYW1lOiBcInN0b3Jlc1wiLFxuICAgICAgICAgICAgZm9ybWF0czogW1wiY3N2XCIsXCJ4bHNcIl0sXG4gICAgICAgICAgICBleHBvcnRCdXR0b25zOiB0cnVlLFxuICAgICAgICAgICAgcG9zaXRpb246IFwiYm90dG9tXCIsXG4gICAgICAgICAgICBpZ25vcmVDU1M6IFwiW3N0eWxlKj0nZGlzcGxheTogbm9uZSddXCJcbiAgICAgICAgfSk7XG5cbiAgICAkKFwidGFibGVcIikudGFibGVzb3J0KHtmdW5jOiBmdW5jdGlvbigpe2ZpbGxEYXRhKCk7fX0pO1xuXG4gICAgJChcIi5kb3dubG9hZFwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAkKFwidGFibGVcIikudGFibGVFeHBvcnQoe1xuICAgICAgICAgICAgaGVhZGluZ3M6IHRydWUsXG4gICAgICAgICAgICBmaWxlTmFtZTogXCJzdG9yZXNcIixcbiAgICAgICAgICAgIGZvcm1hdHM6IFtcImNzdlwiLFwieGxzXCJdLFxuICAgICAgICAgICAgZXhwb3J0QnV0dG9uczogdHJ1ZSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBcImJvdHRvbVwiLFxuICAgICAgICAgICAgaWdub3JlQ1NTOiBcIltzdHlsZSo9J2Rpc3BsYXk6IG5vbmUnXVwiXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgJCgnLnRhYmxlLWJvcmRlcicpLnNjcm9sbChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF9sZWZ0ID0gJCh0aGlzKS5zY3JvbGxMZWZ0KCk7XG4gICAgICAgICQoJ3RhYmxlIHRoJykuZXEoMCkuY3NzKCdsZWZ0JywgX2xlZnQpO1xuICAgICAgICAkKCd0YWJsZSB0aCcpLmVxKDEpLmNzcygnbGVmdCcsIF9sZWZ0KTtcbiAgICAgICAgJCgndGFibGUgdGgnKS5lcSgyKS5jc3MoJ2xlZnQnLCBfbGVmdCk7XG4gICAgICAgICQoJ3RhYmxlIHRoJykuZXEoMykuY3NzKCdsZWZ0JywgX2xlZnQpLmFkZENsYXNzKCdib3gtc2hhZG93Jyk7XG4gICAgICAgICQoJ3RhYmxlIHRkOm50aC1jaGlsZCgxKScpLmNzcygnbGVmdCcsIF9sZWZ0KTtcbiAgICAgICAgJCgndGFibGUgdGQ6bnRoLWNoaWxkKDIpJykuY3NzKCdsZWZ0JywgX2xlZnQpO1xuICAgICAgICAkKCd0YWJsZSB0ZDpudGgtY2hpbGQoMyknKS5jc3MoJ2xlZnQnLCBfbGVmdCk7XG4gICAgICAgICQoJ3RhYmxlIHRkOm50aC1jaGlsZCg0KScpLmNzcygnbGVmdCcsIF9sZWZ0KS5hZGRDbGFzcygnYm94LXNoYWRvdycpO1xuICAgICAgICBpZiAoTnVtYmVyKCQodGhpcykuc2Nyb2xsTGVmdCgpKSA9PT0gMCkge1xuICAgICAgICAgICAgJCgndGFibGUgdGgnKS5lcSgzKS5yZW1vdmVDbGFzcygnYm94LXNoYWRvdycpO1xuICAgICAgICAgICAgJCgndGFibGUgdGQ6bnRoLWNoaWxkKDQpJykucmVtb3ZlQ2xhc3MoJ2JveC1zaGFkb3cnKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7Il0sImZpbGUiOiJkYWlseXN0YXRlbWVudC9zdG9yZS1jb21taXNzaW9uLmpzIn0=
