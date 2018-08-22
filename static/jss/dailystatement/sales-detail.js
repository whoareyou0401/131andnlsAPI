var isnormal = true;

function fillData() {
    var page = $(".select-page").val() || 1;
    var arg = $(".search input").val();
    //var sort = $("th .ascending").parent().attr("value") || $("th .descending").parent().attr("value");
    //var order = $(".ascending").attr("class") || $(".descending").attr("class");
    $.ajax({
        url: "/api/v1.0/dailystatement/sales-detail",
        data: {
            "page": page,
            "start_time": start_time,
            "end_time": end_time,
            "args": arg,
            //"sort": sort,
            //"order": order,
            "key": "",
            "isnormal": isnormal
        },
        type: "GET",
        success: function (data) {
            $(".pagination p span").eq(0).text(data.data.pages);
            $(".pagination p span").eq(1).text(data.data.count);
            $(".select-page option").remove();
            for (var j = 1; j <= data.data.pages; j++) {
                $(".select-page").append("<option value=" + j + ">第" + num2Chinese(j) + "页</option>");
            }
            $(".select-page").val(page);
            var newRow = "<tr><td></td><td></td><td></td><td></td><td></td></tr>";
            $("table tbody tr").remove();
            for (var i = 0; i < data.data.data.length; i++) {
                $("table tbody").append(newRow);
                ii = i + 1;
                if (isnormal) {
                    var col1 = data.data.data[i].sales || 0;
                    var col2 = data.data.data[i].goods || '无';
                    var col3 = data.data.data[i].store || '无';
                    var col4 = data.data.data[i].add_time || '';
                    var col5 = data.data.data[i].guide || '无';
                }
                else {
                    var col1 = (page - 1) * 10 + ii;
                    var col2 = data.data.data[i].name || '无';
                    var col3 = data.data.data[i].telephone || '无';
                    var col4 = data.data.data[i].store_name || '无';
                    var col5 = data.data.data[i].create_time || '无';
                }
                $("table tr:eq(" + ii + ") td:eq(0)").text(col1);
                $("table tr:eq(" + ii + ") td:eq(1)").text(col2);
                $("table tr:eq(" + ii + ") td:eq(2)").text(col3);
                $("table tr:eq(" + ii + ") td:eq(3)").text(col4);
                $("table tr:eq(" + ii + ") td:eq(4)").text(col5);
            }
            ;
            //setTbaleWidth();
        }
    });
}


$(document).ready(function () {
    $(".sidebar li").eq(0).addClass("active").siblings().removeClass("active");
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

    $("table").tablesort({
        func: function () {
            fillData();
        }
    });

    $(".download").click(function () {
        location.href = "/api/v1.0/dailystatement/sales-detail?download=1&isnormal=" + isnormal + "&start_time=" + start_time + "&end_time=" + end_time
    });
    $("tbody").on('dblclick', 'tr', function () {
        var td = $(this).children('td');
        var tick = '<img class="sure" src="/static/images/dailystatement/ic_tick.png" alt="">';
        var cancel = '<img class="cancel" src="/static/images/dailystatement/close.png" alt="">';
        var input = "<input class='require'";
        td.eq(0).html(cancel);
        td.eq(1).html(tick);
        td.eq(2).html(input + 'value="' + td.eq(2).text() + '">');
        td.eq(3).html(input + 'value="' + td.eq(3).text() + '">');
        td.eq(4).html(input + 'value="' + td.eq(4).text() + '">');
        td.eq(5).html(input + 'value="' + td.eq(5).text() + '">');
        td.eq(6).html(input + 'value="' + td.eq(6).text() + '">');
    });
    $("#abnormal").click(function () {
        if (isnormal) {
            isnormal = false;
            $("#abnormal").text("异常人员列表");
            $("#abnormal").addClass("active");
            $("table thead th:eq(0) span").text("序号");
            $("table thead th:eq(1) span").text("导购");
            $("table thead th:eq(2) span").text("电话");
            $("table thead th:eq(3) span").text("门店");
            $("table thead th:eq(4) span").text("入职时间");
        }
        else {
            isnormal = true;
            $("#abnormal").text("查看异常人员");
            $("#abnormal").removeClass("active");
            $("table thead th:eq(0) span").text("销量");
            $("table thead th:eq(1) span").text("商品名称");
            $("table thead th:eq(2) span").text("门店");
            $("table thead th:eq(3) span").text("上报时间");
            $("table thead th:eq(4) span").text("上报人");
        }
        fillData();
    })

});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkYWlseXN0YXRlbWVudC9zYWxlcy1kZXRhaWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIGlzbm9ybWFsID0gdHJ1ZTtcblxuZnVuY3Rpb24gZmlsbERhdGEoKSB7XG4gICAgdmFyIHBhZ2UgPSAkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpIHx8IDE7XG4gICAgdmFyIGFyZyA9ICQoXCIuc2VhcmNoIGlucHV0XCIpLnZhbCgpO1xuICAgIC8vdmFyIHNvcnQgPSAkKFwidGggLmFzY2VuZGluZ1wiKS5wYXJlbnQoKS5hdHRyKFwidmFsdWVcIikgfHwgJChcInRoIC5kZXNjZW5kaW5nXCIpLnBhcmVudCgpLmF0dHIoXCJ2YWx1ZVwiKTtcbiAgICAvL3ZhciBvcmRlciA9ICQoXCIuYXNjZW5kaW5nXCIpLmF0dHIoXCJjbGFzc1wiKSB8fCAkKFwiLmRlc2NlbmRpbmdcIikuYXR0cihcImNsYXNzXCIpO1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogXCIvYXBpL3YxLjAvZGFpbHlzdGF0ZW1lbnQvc2FsZXMtZGV0YWlsXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwicGFnZVwiOiBwYWdlLFxuICAgICAgICAgICAgXCJzdGFydF90aW1lXCI6IHN0YXJ0X3RpbWUsXG4gICAgICAgICAgICBcImVuZF90aW1lXCI6IGVuZF90aW1lLFxuICAgICAgICAgICAgXCJhcmdzXCI6IGFyZyxcbiAgICAgICAgICAgIC8vXCJzb3J0XCI6IHNvcnQsXG4gICAgICAgICAgICAvL1wib3JkZXJcIjogb3JkZXIsXG4gICAgICAgICAgICBcImtleVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJpc25vcm1hbFwiOiBpc25vcm1hbFxuICAgICAgICB9LFxuICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgJChcIi5wYWdpbmF0aW9uIHAgc3BhblwiKS5lcSgwKS50ZXh0KGRhdGEuZGF0YS5wYWdlcyk7XG4gICAgICAgICAgICAkKFwiLnBhZ2luYXRpb24gcCBzcGFuXCIpLmVxKDEpLnRleHQoZGF0YS5kYXRhLmNvdW50KTtcbiAgICAgICAgICAgICQoXCIuc2VsZWN0LXBhZ2Ugb3B0aW9uXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDE7IGogPD0gZGF0YS5kYXRhLnBhZ2VzOyBqKyspIHtcbiAgICAgICAgICAgICAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLmFwcGVuZChcIjxvcHRpb24gdmFsdWU9XCIgKyBqICsgXCI+56ysXCIgKyBudW0yQ2hpbmVzZShqKSArIFwi6aG1PC9vcHRpb24+XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJChcIi5zZWxlY3QtcGFnZVwiKS52YWwocGFnZSk7XG4gICAgICAgICAgICB2YXIgbmV3Um93ID0gXCI8dHI+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PC90cj5cIjtcbiAgICAgICAgICAgICQoXCJ0YWJsZSB0Ym9keSB0clwiKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5kYXRhLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAkKFwidGFibGUgdGJvZHlcIikuYXBwZW5kKG5ld1Jvdyk7XG4gICAgICAgICAgICAgICAgaWkgPSBpICsgMTtcbiAgICAgICAgICAgICAgICBpZiAoaXNub3JtYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbDEgPSBkYXRhLmRhdGEuZGF0YVtpXS5zYWxlcyB8fCAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sMiA9IGRhdGEuZGF0YS5kYXRhW2ldLmdvb2RzIHx8ICfml6AnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sMyA9IGRhdGEuZGF0YS5kYXRhW2ldLnN0b3JlIHx8ICfml6AnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sNCA9IGRhdGEuZGF0YS5kYXRhW2ldLmFkZF90aW1lIHx8ICcnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sNSA9IGRhdGEuZGF0YS5kYXRhW2ldLmd1aWRlIHx8ICfml6AnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbDEgPSAocGFnZSAtIDEpICogMTAgKyBpaTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbDIgPSBkYXRhLmRhdGEuZGF0YVtpXS5uYW1lIHx8ICfml6AnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sMyA9IGRhdGEuZGF0YS5kYXRhW2ldLnRlbGVwaG9uZSB8fCAn5pegJztcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbDQgPSBkYXRhLmRhdGEuZGF0YVtpXS5zdG9yZV9uYW1lIHx8ICfml6AnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sNSA9IGRhdGEuZGF0YS5kYXRhW2ldLmNyZWF0ZV90aW1lIHx8ICfml6AnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSgwKVwiKS50ZXh0KGNvbDEpO1xuICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDEpXCIpLnRleHQoY29sMik7XG4gICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoMilcIikudGV4dChjb2wzKTtcbiAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSgzKVwiKS50ZXh0KGNvbDQpO1xuICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDQpXCIpLnRleHQoY29sNSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA7XG4gICAgICAgICAgICAvL3NldFRiYWxlV2lkdGgoKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAkKFwiLnNpZGViYXIgbGlcIikuZXEoMCkuYWRkQ2xhc3MoXCJhY3RpdmVcIikuc2libGluZ3MoKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICBnZXRfbGFzdHdlZWtfdGltZSgpO1xuICAgIGZpbGxEYXRhKCk7XG5cbiAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLmNoYW5nZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZpbGxEYXRhKCk7XG4gICAgfSk7XG4gICAgJChcIi5wYWdlLXR1cmluZy5wcmV2XCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKCkgPT0gMSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoKSAtIDEpO1xuICAgICAgICBmaWxsRGF0YSgpO1xuICAgIH0pO1xuICAgICQoXCIucGFnZS10dXJpbmcubmV4dFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpID09ICQoXCIuc2VsZWN0LXBhZ2Ugb3B0aW9uXCIpLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKE51bWJlcigkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpKSArIDEpO1xuICAgICAgICBmaWxsRGF0YSgpO1xuICAgIH0pO1xuXG4gICAgJChcIi5zZWFyY2ggaVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkLnRyaW0oJChcIi5zZWFyY2ggaW5wdXRcIikudmFsKCkpICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBmaWxsRGF0YSgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkKFwiLnNlYXJjaCBpbnB1dFwiKS5rZXlkb3duKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT0gMTMpIHtcbiAgICAgICAgICAgIGZpbGxEYXRhKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoXCJ0YWJsZVwiKS50YWJsZXNvcnQoe1xuICAgICAgICBmdW5jOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmaWxsRGF0YSgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkKFwiLmRvd25sb2FkXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbG9jYXRpb24uaHJlZiA9IFwiL2FwaS92MS4wL2RhaWx5c3RhdGVtZW50L3NhbGVzLWRldGFpbD9kb3dubG9hZD0xJmlzbm9ybWFsPVwiICsgaXNub3JtYWwgKyBcIiZzdGFydF90aW1lPVwiICsgc3RhcnRfdGltZSArIFwiJmVuZF90aW1lPVwiICsgZW5kX3RpbWVcbiAgICB9KTtcbiAgICAkKFwidGJvZHlcIikub24oJ2RibGNsaWNrJywgJ3RyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGQgPSAkKHRoaXMpLmNoaWxkcmVuKCd0ZCcpO1xuICAgICAgICB2YXIgdGljayA9ICc8aW1nIGNsYXNzPVwic3VyZVwiIHNyYz1cIi9zdGF0aWMvaW1hZ2VzL2RhaWx5c3RhdGVtZW50L2ljX3RpY2sucG5nXCIgYWx0PVwiXCI+JztcbiAgICAgICAgdmFyIGNhbmNlbCA9ICc8aW1nIGNsYXNzPVwiY2FuY2VsXCIgc3JjPVwiL3N0YXRpYy9pbWFnZXMvZGFpbHlzdGF0ZW1lbnQvY2xvc2UucG5nXCIgYWx0PVwiXCI+JztcbiAgICAgICAgdmFyIGlucHV0ID0gXCI8aW5wdXQgY2xhc3M9J3JlcXVpcmUnXCI7XG4gICAgICAgIHRkLmVxKDApLmh0bWwoY2FuY2VsKTtcbiAgICAgICAgdGQuZXEoMSkuaHRtbCh0aWNrKTtcbiAgICAgICAgdGQuZXEoMikuaHRtbChpbnB1dCArICd2YWx1ZT1cIicgKyB0ZC5lcSgyKS50ZXh0KCkgKyAnXCI+Jyk7XG4gICAgICAgIHRkLmVxKDMpLmh0bWwoaW5wdXQgKyAndmFsdWU9XCInICsgdGQuZXEoMykudGV4dCgpICsgJ1wiPicpO1xuICAgICAgICB0ZC5lcSg0KS5odG1sKGlucHV0ICsgJ3ZhbHVlPVwiJyArIHRkLmVxKDQpLnRleHQoKSArICdcIj4nKTtcbiAgICAgICAgdGQuZXEoNSkuaHRtbChpbnB1dCArICd2YWx1ZT1cIicgKyB0ZC5lcSg1KS50ZXh0KCkgKyAnXCI+Jyk7XG4gICAgICAgIHRkLmVxKDYpLmh0bWwoaW5wdXQgKyAndmFsdWU9XCInICsgdGQuZXEoNikudGV4dCgpICsgJ1wiPicpO1xuICAgIH0pO1xuICAgICQoXCIjYWJub3JtYWxcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoaXNub3JtYWwpIHtcbiAgICAgICAgICAgIGlzbm9ybWFsID0gZmFsc2U7XG4gICAgICAgICAgICAkKFwiI2Fibm9ybWFsXCIpLnRleHQoXCLlvILluLjkurrlkZjliJfooahcIik7XG4gICAgICAgICAgICAkKFwiI2Fibm9ybWFsXCIpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgJChcInRhYmxlIHRoZWFkIHRoOmVxKDApIHNwYW5cIikudGV4dChcIuW6j+WPt1wiKTtcbiAgICAgICAgICAgICQoXCJ0YWJsZSB0aGVhZCB0aDplcSgxKSBzcGFuXCIpLnRleHQoXCLlr7zotK1cIik7XG4gICAgICAgICAgICAkKFwidGFibGUgdGhlYWQgdGg6ZXEoMikgc3BhblwiKS50ZXh0KFwi55S16K+dXCIpO1xuICAgICAgICAgICAgJChcInRhYmxlIHRoZWFkIHRoOmVxKDMpIHNwYW5cIikudGV4dChcIumXqOW6l1wiKTtcbiAgICAgICAgICAgICQoXCJ0YWJsZSB0aGVhZCB0aDplcSg0KSBzcGFuXCIpLnRleHQoXCLlhaXogYzml7bpl7RcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpc25vcm1hbCA9IHRydWU7XG4gICAgICAgICAgICAkKFwiI2Fibm9ybWFsXCIpLnRleHQoXCLmn6XnnIvlvILluLjkurrlkZhcIik7XG4gICAgICAgICAgICAkKFwiI2Fibm9ybWFsXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgJChcInRhYmxlIHRoZWFkIHRoOmVxKDApIHNwYW5cIikudGV4dChcIumUgOmHj1wiKTtcbiAgICAgICAgICAgICQoXCJ0YWJsZSB0aGVhZCB0aDplcSgxKSBzcGFuXCIpLnRleHQoXCLllYblk4HlkI3np7BcIik7XG4gICAgICAgICAgICAkKFwidGFibGUgdGhlYWQgdGg6ZXEoMikgc3BhblwiKS50ZXh0KFwi6Zeo5bqXXCIpO1xuICAgICAgICAgICAgJChcInRhYmxlIHRoZWFkIHRoOmVxKDMpIHNwYW5cIikudGV4dChcIuS4iuaKpeaXtumXtFwiKTtcbiAgICAgICAgICAgICQoXCJ0YWJsZSB0aGVhZCB0aDplcSg0KSBzcGFuXCIpLnRleHQoXCLkuIrmiqXkurpcIik7XG4gICAgICAgIH1cbiAgICAgICAgZmlsbERhdGEoKTtcbiAgICB9KVxuXG59KTsiXSwiZmlsZSI6ImRhaWx5c3RhdGVtZW50L3NhbGVzLWRldGFpbC5qcyJ9
