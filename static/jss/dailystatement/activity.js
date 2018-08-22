var type = "";
function fillData() {
    var arg = $(".search input").val();
    //var sort = $("th .ascending").parent().attr("value") || $("th .descending").parent().attr("value");
    //var order = $(".ascending").attr("class") || $(".descending").attr("class");
    var page = $(".select-page").val() || 1;

    $.ajax({
        url: "/api/v1.0/dailystatement/activity",
        data: {
            "page": page,
            "start_time": start_time,
            "end_time": end_time,
            "arg": arg
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
                var newRow = "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                $("table tbody tr").remove();
                for (var i = 0; i < data.data.data.length; i++) {
                    $("table tbody").append(newRow);
                    ii = i + 1;
                    //var number = data.data.data[i].number || 0;
                    var guide = data.data.data[i].guide || '无';
                    var store = data.data.data[i].store || '无';
                    var goods = data.data.data[i].goods || '无';
                    var money = data.data.data[i].money || 0;
                    var num = data.data.data[i].num || 0;
                    var add_time = data.data.data[i].add_time || '';
                    var img = data.data.data[i].img || [];
                    $("table tr:eq(" + ii + ") td:eq(0)").text(guide);
                    $("table tr:eq(" + ii + ") td:eq(1)").text(store);
                    $("table tr:eq(" + ii + ") td:eq(2)").text(goods);
                    $("table tr:eq(" + ii + ") td:eq(3)").text(money);
                    $("table tr:eq(" + ii + ") td:eq(4)").text(num);
                    $("table tr:eq(" + ii + ") td:eq(5)").text(add_time);
                    var _h = '';
                    for (var n = 0; n < img.length; n++) {
                        _h += "<a target='_blank' href='" + img[n] + "'><img src='" + img[n] + "' alt='小票图片' /></a>";
                    }
                    $("table tr:eq(" + ii + ") td:eq(6)").html(_h);
                }
                //setTbaleWidth();
            } else {
                location.href = "/logout";
            }
        }
    });
}


$(document).ready(function () {
    setupCSRF();

    $("#selection").dropdown();

    $(".sidebar li").eq(1).addClass("active").siblings().removeClass("active");
    get_lastweek_time();
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
        window.location.href = "/api/v1.0/dailystatement/activity?start_time=" + start_time + "&end_time=" + end_time + "&download=1"
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkYWlseXN0YXRlbWVudC9hY3Rpdml0eS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdHlwZSA9IFwiXCI7XG5mdW5jdGlvbiBmaWxsRGF0YSgpIHtcbiAgICB2YXIgYXJnID0gJChcIi5zZWFyY2ggaW5wdXRcIikudmFsKCk7XG4gICAgLy92YXIgc29ydCA9ICQoXCJ0aCAuYXNjZW5kaW5nXCIpLnBhcmVudCgpLmF0dHIoXCJ2YWx1ZVwiKSB8fCAkKFwidGggLmRlc2NlbmRpbmdcIikucGFyZW50KCkuYXR0cihcInZhbHVlXCIpO1xuICAgIC8vdmFyIG9yZGVyID0gJChcIi5hc2NlbmRpbmdcIikuYXR0cihcImNsYXNzXCIpIHx8ICQoXCIuZGVzY2VuZGluZ1wiKS5hdHRyKFwiY2xhc3NcIik7XG4gICAgdmFyIHBhZ2UgPSAkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpIHx8IDE7XG5cbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IFwiL2FwaS92MS4wL2RhaWx5c3RhdGVtZW50L2FjdGl2aXR5XCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwicGFnZVwiOiBwYWdlLFxuICAgICAgICAgICAgXCJzdGFydF90aW1lXCI6IHN0YXJ0X3RpbWUsXG4gICAgICAgICAgICBcImVuZF90aW1lXCI6IGVuZF90aW1lLFxuICAgICAgICAgICAgXCJhcmdcIjogYXJnXG4gICAgICAgIH0sXG4gICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzID09IDEpIHtcbiAgICAgICAgICAgICAgICAkKFwiLnBhZ2luYXRpb24gcCBzcGFuXCIpLmVxKDApLnRleHQoZGF0YS5kYXRhLnBhZ2VzKTtcbiAgICAgICAgICAgICAgICAkKFwiLnBhZ2luYXRpb24gcCBzcGFuXCIpLmVxKDEpLnRleHQoZGF0YS5kYXRhLmNvdW50KTtcbiAgICAgICAgICAgICAgICAkKFwiLnNlbGVjdC1wYWdlIG9wdGlvblwiKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMTsgaiA8PSBkYXRhLmRhdGEucGFnZXM7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLmFwcGVuZChcIjxvcHRpb24gdmFsdWU9XCIgKyBqICsgXCI+56ysXCIgKyBudW0yQ2hpbmVzZShqKSArIFwi6aG1PC9vcHRpb24+XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbChwYWdlKTtcbiAgICAgICAgICAgICAgICB2YXIgbmV3Um93ID0gXCI8dHI+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PC90cj5cIjtcbiAgICAgICAgICAgICAgICAkKFwidGFibGUgdGJvZHkgdHJcIikucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmRhdGEuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdGJvZHlcIikuYXBwZW5kKG5ld1Jvdyk7XG4gICAgICAgICAgICAgICAgICAgIGlpID0gaSArIDE7XG4gICAgICAgICAgICAgICAgICAgIC8vdmFyIG51bWJlciA9IGRhdGEuZGF0YS5kYXRhW2ldLm51bWJlciB8fCAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZ3VpZGUgPSBkYXRhLmRhdGEuZGF0YVtpXS5ndWlkZSB8fCAn5pegJztcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0b3JlID0gZGF0YS5kYXRhLmRhdGFbaV0uc3RvcmUgfHwgJ+aXoCc7XG4gICAgICAgICAgICAgICAgICAgIHZhciBnb29kcyA9IGRhdGEuZGF0YS5kYXRhW2ldLmdvb2RzIHx8ICfml6AnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbW9uZXkgPSBkYXRhLmRhdGEuZGF0YVtpXS5tb25leSB8fCAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbnVtID0gZGF0YS5kYXRhLmRhdGFbaV0ubnVtIHx8IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhZGRfdGltZSA9IGRhdGEuZGF0YS5kYXRhW2ldLmFkZF90aW1lIHx8ICcnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW1nID0gZGF0YS5kYXRhLmRhdGFbaV0uaW1nIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSgwKVwiKS50ZXh0KGd1aWRlKTtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoMSlcIikudGV4dChzdG9yZSk7XG4gICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDIpXCIpLnRleHQoZ29vZHMpO1xuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSgzKVwiKS50ZXh0KG1vbmV5KTtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoNClcIikudGV4dChudW0pO1xuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSg1KVwiKS50ZXh0KGFkZF90aW1lKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9oID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIG4gPSAwOyBuIDwgaW1nLmxlbmd0aDsgbisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaCArPSBcIjxhIHRhcmdldD0nX2JsYW5rJyBocmVmPSdcIiArIGltZ1tuXSArIFwiJz48aW1nIHNyYz0nXCIgKyBpbWdbbl0gKyBcIicgYWx0PSflsI/npajlm77niYcnIC8+PC9hPlwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDYpXCIpLmh0bWwoX2gpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL3NldFRiYWxlV2lkdGgoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9jYXRpb24uaHJlZiA9IFwiL2xvZ291dFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG5cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgIHNldHVwQ1NSRigpO1xuXG4gICAgJChcIiNzZWxlY3Rpb25cIikuZHJvcGRvd24oKTtcblxuICAgICQoXCIuc2lkZWJhciBsaVwiKS5lcSgyKS5hZGRDbGFzcyhcImFjdGl2ZVwiKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgIGdldF9sYXN0d2Vla190aW1lKCk7XG4gICAgZmlsbERhdGEoKTtcblxuICAgICQoXCIuc2VsZWN0LXBhZ2VcIikuY2hhbmdlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZmlsbERhdGEoKTtcbiAgICB9KTtcbiAgICAkKFwiLnBhZ2UtdHVyaW5nLnByZXZcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoKSA9PSAxKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpIC0gMSk7XG4gICAgICAgIGZpbGxEYXRhKCk7XG4gICAgfSk7XG4gICAgJChcIi5wYWdlLXR1cmluZy5uZXh0XCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKCkgPT0gJChcIi5zZWxlY3QtcGFnZSBvcHRpb25cIikubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoTnVtYmVyKCQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKCkpICsgMSk7XG4gICAgICAgIGZpbGxEYXRhKCk7XG4gICAgfSk7XG5cbiAgICAkKFwiLnNlYXJjaCBpXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQudHJpbSgkKFwiLnNlYXJjaCBpbnB1dFwiKS52YWwoKSkgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGZpbGxEYXRhKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoXCIuc2VhcmNoIGlucHV0XCIpLmtleWRvd24oZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC53aGljaCA9PSAxMykge1xuICAgICAgICAgICAgZmlsbERhdGEoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJChcIi5kb3dubG9hZFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvYXBpL3YxLjAvZGFpbHlzdGF0ZW1lbnQvYWN0aXZpdHk/c3RhcnRfdGltZT1cIiArIHN0YXJ0X3RpbWUgKyBcIiZlbmRfdGltZT1cIiArIGVuZF90aW1lICsgXCImZG93bmxvYWQ9MVwiXG4gICAgfSk7XG59KTsiXSwiZmlsZSI6ImRhaWx5c3RhdGVtZW50L2FjdGl2aXR5LmpzIn0=
