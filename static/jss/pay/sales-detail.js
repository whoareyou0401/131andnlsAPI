var isnormal = true;

function fillData() {
    var page = $(".select-page").val() || 1;
    var arg = $(".search input").val();
    //var sort = $("th .ascending").parent().attr("value") || $("th .descending").parent().attr("value");
    //var order = $(".ascending").attr("class") || $(".descending").attr("class");
    $.ajax({
        url: "/api/v1.2/pay/sales-profile",
        data: {
            "page": page,
            "start_time": start_time,
            "end_time": end_time,
            "key_word": arg,
            //"sort": sort,
            //"order": order,

        },
        type: "GET",
        success: function (data) {
            console.log(data);
            $(".pagination p span").eq(0).text(data.data.pages + 1);
            $(".pagination p span").eq(1).text(data.data.count);
            $(".select-page option").remove();
            for (var j = 1; j <= data.data.pages + 1; j++) {
                $(".select-page").append("<option value=" + j + ">第" + num2Chinese(j) + "页</option>");
            }
            $(".select-page").val(page);
            var newRow = "<tr><td></td><td></td><td></td><td></td></tr>";
            $("table tbody tr").remove();
            for (var i = 0; i < data.data.data.length; i++) {
                $("table tbody").append(newRow);
                ii = i + 1;

                var col1 = data.data.data[i].barcode ;
                var col2 = data.data.data[i].item_name || '无';
                var col3 = data.data.data[i].price || '无';
                var col4 = data.data.data[i].num || '';

                $("table tr:eq(" + ii + ") td:eq(0)").text(col1);
                $("table tr:eq(" + ii + ") td:eq(1)").text(col2);
                $("table tr:eq(" + ii + ") td:eq(2)").text(col3);
                $("table tr:eq(" + ii + ") td:eq(3)").text(col4);
            };
            //setTbaleWidth();
        }
    });
}


$(document).ready(function () {
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

    $("table").tablesort({
        func: function () {
            fillData();
        }
    });

    $("#download").click(function () {
        console.log('hjlsdaihdjioahsdiu');
        // $("table").tableExport({
        //     headings: true,
        //     fileName: "stores",
        //     formats: ["csv"],
        //     position: "bottom",
        //     ignoreCSS: "[style*='display: none']"
        // });
        var arg = $(".search input").val();
        window.location.href = "/api/v1.2/pay/sales-profile-excel?start_time="+start_time+"&end_time="+end_time+"&key_word="+arg;
    //     $.ajax({
    //     url: "/api/v1.2/pay/sales-profile-excel",
    //     data: {
    //         "start_time": start_time,
    //         "end_time": end_time,
    //         "key_word": arg,
    //     },
    //     type: "GET",
    //     success: function (data) {
    //         // console.log(data);
    //         // if(data.code == 0) {
    //         //     alert('已下载');
    //         // } else{
    //         //     alert('下载失败');
    //         // }
    //     }
    // });
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


});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJwYXkvc2FsZXMtZGV0YWlsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBpc25vcm1hbCA9IHRydWU7XG5cbmZ1bmN0aW9uIGZpbGxEYXRhKCkge1xuICAgIHZhciBwYWdlID0gJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoKSB8fCAxO1xuICAgIHZhciBhcmcgPSAkKFwiLnNlYXJjaCBpbnB1dFwiKS52YWwoKTtcbiAgICAvL3ZhciBzb3J0ID0gJChcInRoIC5hc2NlbmRpbmdcIikucGFyZW50KCkuYXR0cihcInZhbHVlXCIpIHx8ICQoXCJ0aCAuZGVzY2VuZGluZ1wiKS5wYXJlbnQoKS5hdHRyKFwidmFsdWVcIik7XG4gICAgLy92YXIgb3JkZXIgPSAkKFwiLmFzY2VuZGluZ1wiKS5hdHRyKFwiY2xhc3NcIikgfHwgJChcIi5kZXNjZW5kaW5nXCIpLmF0dHIoXCJjbGFzc1wiKTtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IFwiL2FwaS92MS4yL3BheS9zYWxlcy1wcm9maWxlXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwicGFnZVwiOiBwYWdlLFxuICAgICAgICAgICAgXCJzdGFydF90aW1lXCI6IHN0YXJ0X3RpbWUsXG4gICAgICAgICAgICBcImVuZF90aW1lXCI6IGVuZF90aW1lLFxuICAgICAgICAgICAgXCJrZXlfd29yZFwiOiBhcmcsXG4gICAgICAgICAgICAvL1wic29ydFwiOiBzb3J0LFxuICAgICAgICAgICAgLy9cIm9yZGVyXCI6IG9yZGVyLFxuXG4gICAgICAgIH0sXG4gICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICQoXCIucGFnaW5hdGlvbiBwIHNwYW5cIikuZXEoMCkudGV4dChkYXRhLmRhdGEucGFnZXMgKyAxKTtcbiAgICAgICAgICAgICQoXCIucGFnaW5hdGlvbiBwIHNwYW5cIikuZXEoMSkudGV4dChkYXRhLmRhdGEuY291bnQpO1xuICAgICAgICAgICAgJChcIi5zZWxlY3QtcGFnZSBvcHRpb25cIikucmVtb3ZlKCk7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMTsgaiA8PSBkYXRhLmRhdGEucGFnZXMgKyAxOyBqKyspIHtcbiAgICAgICAgICAgICAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLmFwcGVuZChcIjxvcHRpb24gdmFsdWU9XCIgKyBqICsgXCI+56ysXCIgKyBudW0yQ2hpbmVzZShqKSArIFwi6aG1PC9vcHRpb24+XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJChcIi5zZWxlY3QtcGFnZVwiKS52YWwocGFnZSk7XG4gICAgICAgICAgICB2YXIgbmV3Um93ID0gXCI8dHI+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PC90cj5cIjtcbiAgICAgICAgICAgICQoXCJ0YWJsZSB0Ym9keSB0clwiKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5kYXRhLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAkKFwidGFibGUgdGJvZHlcIikuYXBwZW5kKG5ld1Jvdyk7XG4gICAgICAgICAgICAgICAgaWkgPSBpICsgMTtcblxuICAgICAgICAgICAgICAgIHZhciBjb2wxID0gZGF0YS5kYXRhLmRhdGFbaV0uYmFyY29kZSA7XG4gICAgICAgICAgICAgICAgdmFyIGNvbDIgPSBkYXRhLmRhdGEuZGF0YVtpXS5pdGVtX25hbWUgfHwgJ+aXoCc7XG4gICAgICAgICAgICAgICAgdmFyIGNvbDMgPSBkYXRhLmRhdGEuZGF0YVtpXS5wcmljZSB8fCAn5pegJztcbiAgICAgICAgICAgICAgICB2YXIgY29sNCA9IGRhdGEuZGF0YS5kYXRhW2ldLm51bSB8fCAnJztcblxuICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDApXCIpLnRleHQoY29sMSk7XG4gICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoMSlcIikudGV4dChjb2wyKTtcbiAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSgyKVwiKS50ZXh0KGNvbDMpO1xuICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDMpXCIpLnRleHQoY29sNCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy9zZXRUYmFsZVdpZHRoKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgJChcIi5zaWRlYmFyIGxpXCIpLmVxKDApLmFkZENsYXNzKFwiYWN0aXZlXCIpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgZ2V0X3RvZGF5KCk7XG4gICAgZmlsbERhdGEoKTtcblxuICAgICQoXCIuc2VsZWN0LXBhZ2VcIikuY2hhbmdlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZmlsbERhdGEoKTtcbiAgICB9KTtcbiAgICAkKFwiLnBhZ2UtdHVyaW5nLnByZXZcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoKSA9PSAxKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpIC0gMSk7XG4gICAgICAgIGZpbGxEYXRhKCk7XG4gICAgfSk7XG4gICAgJChcIi5wYWdlLXR1cmluZy5uZXh0XCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKCkgPT0gJChcIi5zZWxlY3QtcGFnZSBvcHRpb25cIikubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoTnVtYmVyKCQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKCkpICsgMSk7XG4gICAgICAgIGZpbGxEYXRhKCk7XG4gICAgfSk7XG5cbiAgICAkKFwiLnNlYXJjaCBpXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQudHJpbSgkKFwiLnNlYXJjaCBpbnB1dFwiKS52YWwoKSkgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGZpbGxEYXRhKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoXCIuc2VhcmNoIGlucHV0XCIpLmtleWRvd24oZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC53aGljaCA9PSAxMykge1xuICAgICAgICAgICAgZmlsbERhdGEoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJChcInRhYmxlXCIpLnRhYmxlc29ydCh7XG4gICAgICAgIGZ1bmM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZpbGxEYXRhKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoXCIjZG93bmxvYWRcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnaGpsc2RhaWhkamlvYWhzZGl1Jyk7XG4gICAgICAgIC8vICQoXCJ0YWJsZVwiKS50YWJsZUV4cG9ydCh7XG4gICAgICAgIC8vICAgICBoZWFkaW5nczogdHJ1ZSxcbiAgICAgICAgLy8gICAgIGZpbGVOYW1lOiBcInN0b3Jlc1wiLFxuICAgICAgICAvLyAgICAgZm9ybWF0czogW1wiY3N2XCJdLFxuICAgICAgICAvLyAgICAgcG9zaXRpb246IFwiYm90dG9tXCIsXG4gICAgICAgIC8vICAgICBpZ25vcmVDU1M6IFwiW3N0eWxlKj0nZGlzcGxheTogbm9uZSddXCJcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIHZhciBhcmcgPSAkKFwiLnNlYXJjaCBpbnB1dFwiKS52YWwoKTtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9hcGkvdjEuMi9wYXkvc2FsZXMtcHJvZmlsZS1leGNlbD9zdGFydF90aW1lPVwiK3N0YXJ0X3RpbWUrXCImZW5kX3RpbWU9XCIrZW5kX3RpbWUrXCIma2V5X3dvcmQ9XCIrYXJnO1xuICAgIC8vICAgICAkLmFqYXgoe1xuICAgIC8vICAgICB1cmw6IFwiL2FwaS92MS4yL3BheS9zYWxlcy1wcm9maWxlLWV4Y2VsXCIsXG4gICAgLy8gICAgIGRhdGE6IHtcbiAgICAvLyAgICAgICAgIFwic3RhcnRfdGltZVwiOiBzdGFydF90aW1lLFxuICAgIC8vICAgICAgICAgXCJlbmRfdGltZVwiOiBlbmRfdGltZSxcbiAgICAvLyAgICAgICAgIFwia2V5X3dvcmRcIjogYXJnLFxuICAgIC8vICAgICB9LFxuICAgIC8vICAgICB0eXBlOiBcIkdFVFwiLFxuICAgIC8vICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIC8vICAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7XG4gICAgLy8gICAgICAgICAvLyBpZihkYXRhLmNvZGUgPT0gMCkge1xuICAgIC8vICAgICAgICAgLy8gICAgIGFsZXJ0KCflt7LkuIvovb0nKTtcbiAgICAvLyAgICAgICAgIC8vIH0gZWxzZXtcbiAgICAvLyAgICAgICAgIC8vICAgICBhbGVydCgn5LiL6L295aSx6LSlJyk7XG4gICAgLy8gICAgICAgICAvLyB9XG4gICAgLy8gICAgIH1cbiAgICAvLyB9KTtcbiAgICB9KTtcbiAgICAkKFwidGJvZHlcIikub24oJ2RibGNsaWNrJywgJ3RyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGQgPSAkKHRoaXMpLmNoaWxkcmVuKCd0ZCcpO1xuICAgICAgICB2YXIgdGljayA9ICc8aW1nIGNsYXNzPVwic3VyZVwiIHNyYz1cIi9zdGF0aWMvaW1hZ2VzL2RhaWx5c3RhdGVtZW50L2ljX3RpY2sucG5nXCIgYWx0PVwiXCI+JztcbiAgICAgICAgdmFyIGNhbmNlbCA9ICc8aW1nIGNsYXNzPVwiY2FuY2VsXCIgc3JjPVwiL3N0YXRpYy9pbWFnZXMvZGFpbHlzdGF0ZW1lbnQvY2xvc2UucG5nXCIgYWx0PVwiXCI+JztcbiAgICAgICAgdmFyIGlucHV0ID0gXCI8aW5wdXQgY2xhc3M9J3JlcXVpcmUnXCI7XG4gICAgICAgIHRkLmVxKDApLmh0bWwoY2FuY2VsKTtcbiAgICAgICAgdGQuZXEoMSkuaHRtbCh0aWNrKTtcbiAgICAgICAgdGQuZXEoMikuaHRtbChpbnB1dCArICd2YWx1ZT1cIicgKyB0ZC5lcSgyKS50ZXh0KCkgKyAnXCI+Jyk7XG4gICAgICAgIHRkLmVxKDMpLmh0bWwoaW5wdXQgKyAndmFsdWU9XCInICsgdGQuZXEoMykudGV4dCgpICsgJ1wiPicpO1xuICAgICAgICB0ZC5lcSg0KS5odG1sKGlucHV0ICsgJ3ZhbHVlPVwiJyArIHRkLmVxKDQpLnRleHQoKSArICdcIj4nKTtcbiAgICAgICAgdGQuZXEoNSkuaHRtbChpbnB1dCArICd2YWx1ZT1cIicgKyB0ZC5lcSg1KS50ZXh0KCkgKyAnXCI+Jyk7XG4gICAgICAgIHRkLmVxKDYpLmh0bWwoaW5wdXQgKyAndmFsdWU9XCInICsgdGQuZXEoNikudGV4dCgpICsgJ1wiPicpO1xuICAgIH0pO1xuXG5cbn0pOyJdLCJmaWxlIjoicGF5L3NhbGVzLWRldGFpbC5qcyJ9
