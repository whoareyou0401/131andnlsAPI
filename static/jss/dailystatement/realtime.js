var type = 0;
var work_types = {
    '0': '早',
    '1': '中',
    '2': '晚',
    '3': '大'
};
function fillData() {
    var arg = $(".search input").val();
    //var sort = $("th .ascending").parent().attr("value") || $("th .descending").parent().attr("value");
    //var order = $(".ascending").attr("class") || $(".descending").attr("class");
    var page = $(".select-page").val() || 1;

    $.ajax({
        url: "/api/v1.0/dailystatement/realtime-checkin",
        data: {
            "page": page,
            "start_time": start_time,
            "end_time": end_time,
            "arg": arg,
            "type": type
        },
        type: "GET",
        success: function (data) {
            if (data.success == 1) {
                $(".pagination p span").eq(0).text(data.data.pages);
                $(".pagination p span").eq(1).text(data.data.count);
                $(".select-page option").remove();
                for (var j = 1; j <= data.data.pages; j++) {
                    $(".select-page").append("<option value=" + j + ">第" + num2Chinese(j) + "页</option>");
                }
                $(".select-page").val(page);
                var newRow = "<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                $("table tbody tr").remove();
                for (var i = 0; i < data.data.data.length; i++) {
                    $("table tbody").append(newRow);
                    ii = i + 1;
                    var date = data.data.data[i].date;
                    var guide = data.data.data[i].guide || '无';
                    var store = data.data.data[i].store || '无';
                    var telephone = data.data.data[i].telephone || '无';
                    var time = data.data.data[i].time || '--:--';
                    var phone = data.data.data[i].phone || '无';
                    if (time == 'None'){
                        time = '--:--';
                    }
                    //var work_type = data.data.data[i].work_type || '无';
                    //var leave_type = data.data.data[i].leave_type || '无';
                    //if(work_type!='无'){
                    //    work_type = work_types[work_type];
                    //}
                    $("table tr:eq(" + ii + ") td:eq(0)").text(date);
                    $("table tr:eq(" + ii + ") td:eq(1)").text(guide);
                    $("table tr:eq(" + ii + ") td:eq(2)").text(store);
                    $("table tr:eq(" + ii + ") td:eq(3)").text(telephone);
                    $("table tr:eq(" + ii + ") td:eq(4)").text(time);
                    $("table tr:eq(" + ii + ") td:eq(5)").text(phone);
                    //$("table tr:eq(" + ii + ") td:eq(6)").text(work_type);
                    //$("table tr:eq(" + ii + ") td:eq(7)").text(leave_type);
                }
            } else {
                location.href = "/logout";
            }
        }
    });
}


$(document).ready(function () {
    setupCSRF();
    $('.ui.radio.checkbox')
        .checkbox()
    ;

    $('.ui.radio.checkbox').click(function () {
        type = $('input[type="radio"]:checked').attr("id");
        fillData();
    });

    $("#selection").dropdown();

    $(".sidebar li").eq(6).addClass("active").siblings().removeClass("active");
    get_today();
    fillData();

    $(".select-page").change(function () {
        fillData();
    });
    $(".page-turing.prev").click(function () {
        if ($(".select-page").val() == 1)
            return;
        $(".select-page").val($(".select-page").val() - 1);
        fillData();
    });
    $(".page-turing.next").click(function () {
        if ($(".select-page").val() == $(".select-page option").length) {
            return;
        }
        $(".select-page").val(Number($(".select-page").val()) + 1);
        fillData();
    });

    $(".search i").click(function () {
        if ($.trim($(".search input").val()) !== "") {
            fillData();
        }
    });

    $(".search input").keydown(function (event) {
        if (event.which == 13) {
            fillData();
        }
    });

    $(".download").click(function () {
        location.href = "/api/v1.0/dailystatement/realtime-checkin?download=1&start_time=" + start_time + "&end_time=" + end_time + "&type=" + type
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkYWlseXN0YXRlbWVudC9yZWFsdGltZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdHlwZSA9IDA7XG52YXIgd29ya190eXBlcyA9IHtcbiAgICAnMCc6ICfml6knLFxuICAgICcxJzogJ+S4rScsXG4gICAgJzInOiAn5pmaJyxcbiAgICAnMyc6ICflpKcnXG59O1xuZnVuY3Rpb24gZmlsbERhdGEoKSB7XG4gICAgdmFyIGFyZyA9ICQoXCIuc2VhcmNoIGlucHV0XCIpLnZhbCgpO1xuICAgIC8vdmFyIHNvcnQgPSAkKFwidGggLmFzY2VuZGluZ1wiKS5wYXJlbnQoKS5hdHRyKFwidmFsdWVcIikgfHwgJChcInRoIC5kZXNjZW5kaW5nXCIpLnBhcmVudCgpLmF0dHIoXCJ2YWx1ZVwiKTtcbiAgICAvL3ZhciBvcmRlciA9ICQoXCIuYXNjZW5kaW5nXCIpLmF0dHIoXCJjbGFzc1wiKSB8fCAkKFwiLmRlc2NlbmRpbmdcIikuYXR0cihcImNsYXNzXCIpO1xuICAgIHZhciBwYWdlID0gJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoKSB8fCAxO1xuXG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBcIi9hcGkvdjEuMC9kYWlseXN0YXRlbWVudC9yZWFsdGltZS1jaGVja2luXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwicGFnZVwiOiBwYWdlLFxuICAgICAgICAgICAgXCJzdGFydF90aW1lXCI6IHN0YXJ0X3RpbWUsXG4gICAgICAgICAgICBcImVuZF90aW1lXCI6IGVuZF90aW1lLFxuICAgICAgICAgICAgXCJhcmdcIjogYXJnLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IHR5cGVcbiAgICAgICAgfSxcbiAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgPT0gMSkge1xuICAgICAgICAgICAgICAgICQoXCIucGFnaW5hdGlvbiBwIHNwYW5cIikuZXEoMCkudGV4dChkYXRhLmRhdGEucGFnZXMpO1xuICAgICAgICAgICAgICAgICQoXCIucGFnaW5hdGlvbiBwIHNwYW5cIikuZXEoMSkudGV4dChkYXRhLmRhdGEuY291bnQpO1xuICAgICAgICAgICAgICAgICQoXCIuc2VsZWN0LXBhZ2Ugb3B0aW9uXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAxOyBqIDw9IGRhdGEuZGF0YS5wYWdlczsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICQoXCIuc2VsZWN0LXBhZ2VcIikuYXBwZW5kKFwiPG9wdGlvbiB2YWx1ZT1cIiArIGogKyBcIj7nrKxcIiArIG51bTJDaGluZXNlKGopICsgXCLpobU8L29wdGlvbj5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKHBhZ2UpO1xuICAgICAgICAgICAgICAgIHZhciBuZXdSb3cgPSBcIjx0cj48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48L3RyPlwiO1xuICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0Ym9keSB0clwiKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuZGF0YS5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0Ym9keVwiKS5hcHBlbmQobmV3Um93KTtcbiAgICAgICAgICAgICAgICAgICAgaWkgPSBpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGUgPSBkYXRhLmRhdGEuZGF0YVtpXS5kYXRlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZ3VpZGUgPSBkYXRhLmRhdGEuZGF0YVtpXS5ndWlkZSB8fCAn5pegJztcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0b3JlID0gZGF0YS5kYXRhLmRhdGFbaV0uc3RvcmUgfHwgJ+aXoCc7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZWxlcGhvbmUgPSBkYXRhLmRhdGEuZGF0YVtpXS50ZWxlcGhvbmUgfHwgJ+aXoCc7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0aW1lID0gZGF0YS5kYXRhLmRhdGFbaV0udGltZSB8fCAnLS06LS0nO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGhvbmUgPSBkYXRhLmRhdGEuZGF0YVtpXS5waG9uZSB8fCAn5pegJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRpbWUgPT0gJ05vbmUnKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWUgPSAnLS06LS0nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vdmFyIHdvcmtfdHlwZSA9IGRhdGEuZGF0YS5kYXRhW2ldLndvcmtfdHlwZSB8fCAn5pegJztcbiAgICAgICAgICAgICAgICAgICAgLy92YXIgbGVhdmVfdHlwZSA9IGRhdGEuZGF0YS5kYXRhW2ldLmxlYXZlX3R5cGUgfHwgJ+aXoCc7XG4gICAgICAgICAgICAgICAgICAgIC8vaWYod29ya190eXBlIT0n5pegJyl7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgIHdvcmtfdHlwZSA9IHdvcmtfdHlwZXNbd29ya190eXBlXTtcbiAgICAgICAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDApXCIpLnRleHQoZGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDEpXCIpLnRleHQoZ3VpZGUpO1xuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSgyKVwiKS50ZXh0KHN0b3JlKTtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoMylcIikudGV4dCh0ZWxlcGhvbmUpO1xuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSg0KVwiKS50ZXh0KHRpbWUpO1xuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSg1KVwiKS50ZXh0KHBob25lKTtcbiAgICAgICAgICAgICAgICAgICAgLy8kKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSg2KVwiKS50ZXh0KHdvcmtfdHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIC8vJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoNylcIikudGV4dChsZWF2ZV90eXBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uLmhyZWYgPSBcIi9sb2dvdXRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICBzZXR1cENTUkYoKTtcbiAgICAkKCcudWkucmFkaW8uY2hlY2tib3gnKVxuICAgICAgICAuY2hlY2tib3goKVxuICAgIDtcblxuICAgICQoJy51aS5yYWRpby5jaGVja2JveCcpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdHlwZSA9ICQoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXTpjaGVja2VkJykuYXR0cihcImlkXCIpO1xuICAgICAgICBmaWxsRGF0YSgpO1xuICAgIH0pO1xuXG4gICAgJChcIiNzZWxlY3Rpb25cIikuZHJvcGRvd24oKTtcblxuICAgICQoXCIuc2lkZWJhciBsaVwiKS5lcSg0KS5hZGRDbGFzcyhcImFjdGl2ZVwiKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgIGdldF90b2RheSgpO1xuICAgIGZpbGxEYXRhKCk7XG5cbiAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLmNoYW5nZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZpbGxEYXRhKCk7XG4gICAgfSk7XG4gICAgJChcIi5wYWdlLXR1cmluZy5wcmV2XCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKCkgPT0gMSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoKSAtIDEpO1xuICAgICAgICBmaWxsRGF0YSgpO1xuICAgIH0pO1xuICAgICQoXCIucGFnZS10dXJpbmcubmV4dFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpID09ICQoXCIuc2VsZWN0LXBhZ2Ugb3B0aW9uXCIpLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKE51bWJlcigkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpKSArIDEpO1xuICAgICAgICBmaWxsRGF0YSgpO1xuICAgIH0pO1xuXG4gICAgJChcIi5zZWFyY2ggaVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkLnRyaW0oJChcIi5zZWFyY2ggaW5wdXRcIikudmFsKCkpICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBmaWxsRGF0YSgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkKFwiLnNlYXJjaCBpbnB1dFwiKS5rZXlkb3duKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT0gMTMpIHtcbiAgICAgICAgICAgIGZpbGxEYXRhKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoXCIuZG93bmxvYWRcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBsb2NhdGlvbi5ocmVmID0gXCIvYXBpL3YxLjAvZGFpbHlzdGF0ZW1lbnQvcmVhbHRpbWUtY2hlY2tpbj9kb3dubG9hZD0xJnN0YXJ0X3RpbWU9XCIgKyBzdGFydF90aW1lICsgXCImZW5kX3RpbWU9XCIgKyBlbmRfdGltZSArIFwiJnR5cGU9XCIgKyB0eXBlXG4gICAgfSk7XG59KTsiXSwiZmlsZSI6ImRhaWx5c3RhdGVtZW50L3JlYWx0aW1lLmpzIn0=
