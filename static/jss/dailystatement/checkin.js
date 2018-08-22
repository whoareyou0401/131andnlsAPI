var type = 0;
var work_types = {
    '0': '早',
    '1': '中',
    '2': '晚',
    '3': '大',
    '4': '休',
    '5': '夜'
};
var exception_types = {
    '0': '正常',
    '1': '迟到',
    '2': '早退',
    '3': '旷工',
    '4': '位置异常',
    '5': '不足8小时',
    '6': '休假',
    '7': '未排班'
};
function fillData() {
    var arg = $(".search input").val();
    //var sort = $("th .ascending").parent().attr("value") || $("th .descending").parent().attr("value");
    //var order = $(".ascending").attr("class") || $(".descending").attr("class");
    var page = $(".select-page").val() || 1;

    $.ajax({
        url: "/api/v1.0/dailystatement/work-checkin",
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
                var newRow = "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                $("table tbody tr").remove();
                for (var i = 0; i < data.data.data.length; i++) {
                    $("table tbody").append(newRow);
                    ii = i + 1;
                    var date = data.data.data[i].date;
                    var guide = data.data.data[i].guide || '无';
                    var store = data.data.data[i].store || '无';
                    var telephone = data.data.data[i].telephone || '无';
                    var work_time = data.data.data[i].work_time || '--:--';
                    var worked_time = data.data.data[i].worked_time || '--:--';
                    var realtime_checkin_time = data.data.data[i].realtime_checkin_time || '--:--';
                    var phone = data.data.data[i].phone || '无';
                    if (!work_time){
                        work_time = '--:--';
                    }
                    if (!worked_time){
                        worked_time = '--:--';
                    }
                    if (!realtime_checkin_time){
                        realtime_checkin_time = '--:--';
                    }
                    var work_type = data.data.data[i].work_type;
                    //var leave_type = data.data.data[i].leave_type || '无';
                    if(work_type){
                       work_type = work_types[work_type];
                    }
                    else{
                        work_type = '无'
                    }
                    var statement = data.data.data[i].operator_id;
                    if(statement){
                       statement = '已报';
                    }
                    else {
                        statement = '未报';
                    }
                    $("table tr:eq(" + ii + ") td:eq(0)").text(date);
                    $("table tr:eq(" + ii + ") td:eq(1)").text(guide);
                    $("table tr:eq(" + ii + ") td:eq(2)").text(store);
                    $("table tr:eq(" + ii + ") td:eq(3)").text(telephone);
                    $("table tr:eq(" + ii + ") td:eq(4)").text(work_time);
                    $("table tr:eq(" + ii + ") td:eq(5)").text(worked_time);
                    $("table tr:eq(" + ii + ") td:eq(6)").text(realtime_checkin_time);
                    $("table tr:eq(" + ii + ") td:eq(7)").text(phone);
                    $("table tr:eq(" + ii + ") td:eq(8)").text(work_type);
                    $("table tr:eq(" + ii + ") td:eq(9)").text(statement);
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

    $(".sidebar li").eq(0).addClass("active").siblings().removeClass("active");
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
        location.href = "/api/v1.0/dailystatement/work-checkin?download=1&start_time=" + start_time + "&end_time=" + end_time + "&type=" + type
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkYWlseXN0YXRlbWVudC9jaGVja2luLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciB0eXBlID0gMDtcbnZhciB3b3JrX3R5cGVzID0ge1xuICAgICcwJzogJ+aXqScsXG4gICAgJzEnOiAn5LitJyxcbiAgICAnMic6ICfmmZonLFxuICAgICczJzogJ+WkpycsXG4gICAgJzQnOiAn5LyRJyxcbiAgICAnNSc6ICflpJwnXG59O1xudmFyIGV4Y2VwdGlvbl90eXBlcyA9IHtcbiAgICAnMCc6ICfmraPluLgnLFxuICAgICcxJzogJ+i/n+WIsCcsXG4gICAgJzInOiAn5pep6YCAJyxcbiAgICAnMyc6ICfml7flt6UnLFxuICAgICc0JzogJ+S9jee9ruW8guW4uCcsXG4gICAgJzUnOiAn5LiN6LazOOWwj+aXticsXG4gICAgJzYnOiAn5LyR5YGHJyxcbiAgICAnNyc6ICfmnKrmjpLnj60nXG59O1xuZnVuY3Rpb24gZmlsbERhdGEoKSB7XG4gICAgdmFyIGFyZyA9ICQoXCIuc2VhcmNoIGlucHV0XCIpLnZhbCgpO1xuICAgIC8vdmFyIHNvcnQgPSAkKFwidGggLmFzY2VuZGluZ1wiKS5wYXJlbnQoKS5hdHRyKFwidmFsdWVcIikgfHwgJChcInRoIC5kZXNjZW5kaW5nXCIpLnBhcmVudCgpLmF0dHIoXCJ2YWx1ZVwiKTtcbiAgICAvL3ZhciBvcmRlciA9ICQoXCIuYXNjZW5kaW5nXCIpLmF0dHIoXCJjbGFzc1wiKSB8fCAkKFwiLmRlc2NlbmRpbmdcIikuYXR0cihcImNsYXNzXCIpO1xuICAgIHZhciBwYWdlID0gJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoKSB8fCAxO1xuXG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBcIi9hcGkvdjEuMC9kYWlseXN0YXRlbWVudC93b3JrLWNoZWNraW5cIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgXCJwYWdlXCI6IHBhZ2UsXG4gICAgICAgICAgICBcInN0YXJ0X3RpbWVcIjogc3RhcnRfdGltZSxcbiAgICAgICAgICAgIFwiZW5kX3RpbWVcIjogZW5kX3RpbWUsXG4gICAgICAgICAgICBcImFyZ1wiOiBhcmcsXG4gICAgICAgICAgICBcInR5cGVcIjogdHlwZVxuICAgICAgICB9LFxuICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgJChcIi5wYWdpbmF0aW9uIHAgc3BhblwiKS5lcSgwKS50ZXh0KGRhdGEuZGF0YS5wYWdlcyk7XG4gICAgICAgICAgICAgICAgJChcIi5wYWdpbmF0aW9uIHAgc3BhblwiKS5lcSgxKS50ZXh0KGRhdGEuZGF0YS5jb3VudCk7XG4gICAgICAgICAgICAgICAgJChcIi5zZWxlY3QtcGFnZSBvcHRpb25cIikucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDE7IGogPD0gZGF0YS5kYXRhLnBhZ2VzOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgJChcIi5zZWxlY3QtcGFnZVwiKS5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPVwiICsgaiArIFwiPuesrFwiICsgbnVtMkNoaW5lc2UoaikgKyBcIumhtTwvb3B0aW9uPlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJChcIi5zZWxlY3QtcGFnZVwiKS52YWwocGFnZSk7XG4gICAgICAgICAgICAgICAgdmFyIG5ld1JvdyA9IFwiPHRyPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjwvdHI+XCI7XG4gICAgICAgICAgICAgICAgJChcInRhYmxlIHRib2R5IHRyXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5kYXRhLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRib2R5XCIpLmFwcGVuZChuZXdSb3cpO1xuICAgICAgICAgICAgICAgICAgICBpaSA9IGkgKyAxO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0ZSA9IGRhdGEuZGF0YS5kYXRhW2ldLmRhdGU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBndWlkZSA9IGRhdGEuZGF0YS5kYXRhW2ldLmd1aWRlIHx8ICfml6AnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RvcmUgPSBkYXRhLmRhdGEuZGF0YVtpXS5zdG9yZSB8fCAn5pegJztcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlbGVwaG9uZSA9IGRhdGEuZGF0YS5kYXRhW2ldLnRlbGVwaG9uZSB8fCAn5pegJztcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdvcmtfdGltZSA9IGRhdGEuZGF0YS5kYXRhW2ldLndvcmtfdGltZSB8fCAnLS06LS0nO1xuICAgICAgICAgICAgICAgICAgICB2YXIgd29ya2VkX3RpbWUgPSBkYXRhLmRhdGEuZGF0YVtpXS53b3JrZWRfdGltZSB8fCAnLS06LS0nO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGhvbmUgPSBkYXRhLmRhdGEuZGF0YVtpXS5waG9uZSB8fCAn5pegJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF3b3JrX3RpbWUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgd29ya190aW1lID0gJy0tOi0tJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIXdvcmtlZF90aW1lKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtlZF90aW1lID0gJy0tOi0tJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgd29ya190eXBlID0gZGF0YS5kYXRhLmRhdGFbaV0ud29ya190eXBlO1xuICAgICAgICAgICAgICAgICAgICAvL3ZhciBsZWF2ZV90eXBlID0gZGF0YS5kYXRhLmRhdGFbaV0ubGVhdmVfdHlwZSB8fCAn5pegJztcbiAgICAgICAgICAgICAgICAgICAgaWYod29ya190eXBlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgd29ya190eXBlID0gd29ya190eXBlc1t3b3JrX3R5cGVdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JrX3R5cGUgPSAn5pegJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZW1lbnQgPSBkYXRhLmRhdGEuZGF0YVtpXS5vcGVyYXRvcl9pZDtcbiAgICAgICAgICAgICAgICAgICAgaWYoc3RhdGVtZW50KXtcbiAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50ID0gJ+W3suaKpSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgPSAn5pyq5oqlJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSgwKVwiKS50ZXh0KGRhdGUpO1xuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSgxKVwiKS50ZXh0KGd1aWRlKTtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoMilcIikudGV4dChzdG9yZSk7XG4gICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDMpXCIpLnRleHQodGVsZXBob25lKTtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoNClcIikudGV4dCh3b3JrX3RpbWUpO1xuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSg1KVwiKS50ZXh0KHdvcmtlZF90aW1lKTtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoNilcIikudGV4dChwaG9uZSk7XG4gICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDcpXCIpLnRleHQod29ya190eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoOClcIikudGV4dChzdGF0ZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAvLyQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDcpXCIpLnRleHQobGVhdmVfdHlwZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gXCIvbG9nb3V0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgc2V0dXBDU1JGKCk7XG4gICAgJCgnLnVpLnJhZGlvLmNoZWNrYm94JylcbiAgICAgICAgLmNoZWNrYm94KClcbiAgICA7XG5cbiAgICAkKCcudWkucmFkaW8uY2hlY2tib3gnKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHR5cGUgPSAkKCdpbnB1dFt0eXBlPVwicmFkaW9cIl06Y2hlY2tlZCcpLmF0dHIoXCJpZFwiKTtcbiAgICAgICAgZmlsbERhdGEoKTtcbiAgICB9KTtcblxuICAgICQoXCIjc2VsZWN0aW9uXCIpLmRyb3Bkb3duKCk7XG5cbiAgICAkKFwiLnNpZGViYXIgbGlcIikuZXEoMSkuYWRkQ2xhc3MoXCJhY3RpdmVcIikuc2libGluZ3MoKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICBnZXRfdG9kYXkoKTtcbiAgICBmaWxsRGF0YSgpO1xuXG4gICAgJChcIi5zZWxlY3QtcGFnZVwiKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xuICAgICAgICBmaWxsRGF0YSgpO1xuICAgIH0pO1xuICAgICQoXCIucGFnZS10dXJpbmcucHJldlwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpID09IDEpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKCQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKCkgLSAxKTtcbiAgICAgICAgZmlsbERhdGEoKTtcbiAgICB9KTtcbiAgICAkKFwiLnBhZ2UtdHVyaW5nLm5leHRcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoKSA9PSAkKFwiLnNlbGVjdC1wYWdlIG9wdGlvblwiKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbChOdW1iZXIoJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoKSkgKyAxKTtcbiAgICAgICAgZmlsbERhdGEoKTtcbiAgICB9KTtcblxuICAgICQoXCIuc2VhcmNoIGlcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJC50cmltKCQoXCIuc2VhcmNoIGlucHV0XCIpLnZhbCgpKSAhPT0gXCJcIikge1xuICAgICAgICAgICAgZmlsbERhdGEoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJChcIi5zZWFyY2ggaW5wdXRcIikua2V5ZG93bihmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LndoaWNoID09IDEzKSB7XG4gICAgICAgICAgICBmaWxsRGF0YSgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkKFwiLmRvd25sb2FkXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbG9jYXRpb24uaHJlZiA9IFwiL2FwaS92MS4wL2RhaWx5c3RhdGVtZW50L3dvcmstY2hlY2tpbj9kb3dubG9hZD0xJnN0YXJ0X3RpbWU9XCIgKyBzdGFydF90aW1lICsgXCImZW5kX3RpbWU9XCIgKyBlbmRfdGltZSArIFwiJnR5cGU9XCIgKyB0eXBlXG4gICAgfSk7XG59KTsiXSwiZmlsZSI6ImRhaWx5c3RhdGVtZW50L2NoZWNraW4uanMifQ==
