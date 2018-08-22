var isnormal = true;

function fillData() {
    var page = $(".select-page").val() || 1;
    var arg = $(".search input").val();
    //var sort = $("th .ascending").parent().attr("value") || $("th .descending").parent().attr("value");
    //var order = $(".ascending").attr("class") || $(".descending").attr("class");
    $.ajax({
        url: "/api/v1.1/pay/pc-stock-taking",
        data: {
            'page': page

        },
        type: "GET",
        success: function (data) {
            console.log(data);
            $(".pagination p span").eq(0).text(data.data.pages + 1);
            $(".pagination p span").eq(1).text(data.data.count);
            $(".select-page option").remove();
            for (var j = 1; j <= data.data.pages; j++) {
                $(".select-page").append("<option value=" + j + ">第" + num2Chinese(j) + "页</option>");
            }
            $(".select-page").val(page);
            var newRow = "<tr><td></td><td></td><td></td><td></td></tr>";
            $("table tbody tr").remove();
            for (var i = 0; i < data.data.data.length; i++) {
                $("table tbody").append(newRow);
                ii = i + 1;

                var col1 = data.data.data[i].item_name ;
                var col2 = data.data.data[i].barcode || '无';
                var col3 = data.data.data[i].amount || '无';
                var col4 = data.data.data[i].name || '无';
                $("table tr:eq(" + ii + ")").attr("value", data.data.data[i].substock_id);

                $("table tr:eq(" + ii + ") td:eq(0)").text(col1);
                $("table tr:eq(" + ii + ") td:eq(1)").text(col2);
                $("table tr:eq(" + ii + ") td:eq(2)").text(col3);
                $("table tr:eq(" + ii + ") td:eq(3)").text(col4);
            };
            //setTbaleWidth();
        }
    });
}

function start() {
    $.ajax({
        url: "/api/v1.1/pay/pc-stock-taking",
        data: {
        },
        type: "POST",
        success: function (data) {
            if (data.code == 0) {
                alert('可以开始使用小程序盘点');
            } else {
                alert('失败了');
            }
        }
    });
}

function end() {
    $.ajax({
        url: "/api/v1.1/pay/pc-stock-taking",
        data: {
        },
        type: "PATCH",
        success: function (data) {
            console.log(data);
            if (data.code == 0){
                fillData();
                alert('完成');
            } else if (data.code == 3) {
                alert('没有正在进行的盘点');
            } else {
                alert('失败了');
            }
        }
    });
}

function clear() {
    $("#name").val("");
    $("#amount").val("");
    $(".add-guide").hide();
    $(".table-wrap").show();
    $(".pagination-wrap").show();
}

$("tbody").on('dblclick', 'tr', function () {
        var td = $(this).children('td');
        var name = td.eq(0).text();
        var amount = td.eq(2).text();
        $("#substock_id").val($(this).attr('value'));
        $("#name").html(name);
        $("#amount").val(amount);
        $(".add-guide").show();
        $(".table-wrap").hide();
        $(".pagination-wrap").hide();
    });

    $("#cancel").click(function () {
        clear();
    });


$(document).ready(function () {
    $(".sidebar li").eq(1).addClass("active").siblings().removeClass("active");
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

    $("#alter-amount").click(function () {
        var td = $(this).children('td');
        var name = td.eq(0).text();
        var amount = document.getElementById("amount").value;
        var substock_id = document.getElementById("substock_id").value;

        console.log(amount,substock_id);
        $.ajax({
            url: "/api/v1.1/pay/pc-stock-taking",
            data: {
                'sid': substock_id,
                'num': amount
            },
            type: "PUT",
            success: function (data) {
                clear();
                fillData();
            }

        })
    });
    $("#download").click(function () {
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



});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJwYXkvc3RvY2tfdGFsa2luZy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgaXNub3JtYWwgPSB0cnVlO1xuXG5mdW5jdGlvbiBmaWxsRGF0YSgpIHtcbiAgICB2YXIgcGFnZSA9ICQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKCkgfHwgMTtcbiAgICB2YXIgYXJnID0gJChcIi5zZWFyY2ggaW5wdXRcIikudmFsKCk7XG4gICAgLy92YXIgc29ydCA9ICQoXCJ0aCAuYXNjZW5kaW5nXCIpLnBhcmVudCgpLmF0dHIoXCJ2YWx1ZVwiKSB8fCAkKFwidGggLmRlc2NlbmRpbmdcIikucGFyZW50KCkuYXR0cihcInZhbHVlXCIpO1xuICAgIC8vdmFyIG9yZGVyID0gJChcIi5hc2NlbmRpbmdcIikuYXR0cihcImNsYXNzXCIpIHx8ICQoXCIuZGVzY2VuZGluZ1wiKS5hdHRyKFwiY2xhc3NcIik7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBcIi9hcGkvdjEuMS9wYXkvcGMtc3RvY2stdGFraW5nXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICdwYWdlJzogcGFnZVxuXG4gICAgICAgIH0sXG4gICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICQoXCIucGFnaW5hdGlvbiBwIHNwYW5cIikuZXEoMCkudGV4dChkYXRhLmRhdGEucGFnZXMgKyAxKTtcbiAgICAgICAgICAgICQoXCIucGFnaW5hdGlvbiBwIHNwYW5cIikuZXEoMSkudGV4dChkYXRhLmRhdGEuY291bnQpO1xuICAgICAgICAgICAgJChcIi5zZWxlY3QtcGFnZSBvcHRpb25cIikucmVtb3ZlKCk7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMTsgaiA8PSBkYXRhLmRhdGEucGFnZXM7IGorKykge1xuICAgICAgICAgICAgICAgICQoXCIuc2VsZWN0LXBhZ2VcIikuYXBwZW5kKFwiPG9wdGlvbiB2YWx1ZT1cIiArIGogKyBcIj7nrKxcIiArIG51bTJDaGluZXNlKGopICsgXCLpobU8L29wdGlvbj5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbChwYWdlKTtcbiAgICAgICAgICAgIHZhciBuZXdSb3cgPSBcIjx0cj48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48L3RyPlwiO1xuICAgICAgICAgICAgJChcInRhYmxlIHRib2R5IHRyXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmRhdGEuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0Ym9keVwiKS5hcHBlbmQobmV3Um93KTtcbiAgICAgICAgICAgICAgICBpaSA9IGkgKyAxO1xuXG4gICAgICAgICAgICAgICAgdmFyIGNvbDEgPSBkYXRhLmRhdGEuZGF0YVtpXS5pdGVtX25hbWUgO1xuICAgICAgICAgICAgICAgIHZhciBjb2wyID0gZGF0YS5kYXRhLmRhdGFbaV0uYmFyY29kZSB8fCAn5pegJztcbiAgICAgICAgICAgICAgICB2YXIgY29sMyA9IGRhdGEuZGF0YS5kYXRhW2ldLmFtb3VudCB8fCAn5pegJztcbiAgICAgICAgICAgICAgICB2YXIgY29sNCA9IGRhdGEuZGF0YS5kYXRhW2ldLm5hbWUgfHwgJ+aXoCc7XG4gICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIilcIikuYXR0cihcInZhbHVlXCIsIGRhdGEuZGF0YS5kYXRhW2ldLnN1YnN0b2NrX2lkKTtcblxuICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDApXCIpLnRleHQoY29sMSk7XG4gICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoMSlcIikudGV4dChjb2wyKTtcbiAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSgyKVwiKS50ZXh0KGNvbDMpO1xuICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDMpXCIpLnRleHQoY29sNCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy9zZXRUYmFsZVdpZHRoKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBcIi9hcGkvdjEuMS9wYXkvcGMtc3RvY2stdGFraW5nXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgfSxcbiAgICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBpZiAoZGF0YS5jb2RlID09IDApIHtcbiAgICAgICAgICAgICAgICBhbGVydCgn5Y+v5Lul5byA5aeL5L2/55So5bCP56iL5bqP55uY54K5Jyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsZXJ0KCflpLHotKXkuoYnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBlbmQoKSB7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBcIi9hcGkvdjEuMS9wYXkvcGMtc3RvY2stdGFraW5nXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgfSxcbiAgICAgICAgdHlwZTogXCJQQVRDSFwiLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICBpZiAoZGF0YS5jb2RlID09IDApe1xuICAgICAgICAgICAgICAgIGZpbGxEYXRhKCk7XG4gICAgICAgICAgICAgICAgYWxlcnQoJ+WujOaIkCcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLmNvZGUgPT0gMykge1xuICAgICAgICAgICAgICAgIGFsZXJ0KCfmsqHmnInmraPlnKjov5vooYznmoTnm5jngrknKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoJ+Wksei0peS6hicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICQoXCIjbmFtZVwiKS52YWwoXCJcIik7XG4gICAgJChcIiNhbW91bnRcIikudmFsKFwiXCIpO1xuICAgICQoXCIuYWRkLWd1aWRlXCIpLmhpZGUoKTtcbiAgICAkKFwiLnRhYmxlLXdyYXBcIikuc2hvdygpO1xuICAgICQoXCIucGFnaW5hdGlvbi13cmFwXCIpLnNob3coKTtcbn1cblxuJChcInRib2R5XCIpLm9uKCdkYmxjbGljaycsICd0cicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRkID0gJCh0aGlzKS5jaGlsZHJlbigndGQnKTtcbiAgICAgICAgdmFyIG5hbWUgPSB0ZC5lcSgwKS50ZXh0KCk7XG4gICAgICAgIHZhciBhbW91bnQgPSB0ZC5lcSgyKS50ZXh0KCk7XG4gICAgICAgICQoXCIjc3Vic3RvY2tfaWRcIikudmFsKCQodGhpcykuYXR0cigndmFsdWUnKSk7XG4gICAgICAgICQoXCIjbmFtZVwiKS5odG1sKG5hbWUpO1xuICAgICAgICAkKFwiI2Ftb3VudFwiKS52YWwoYW1vdW50KTtcbiAgICAgICAgJChcIi5hZGQtZ3VpZGVcIikuc2hvdygpO1xuICAgICAgICAkKFwiLnRhYmxlLXdyYXBcIikuaGlkZSgpO1xuICAgICAgICAkKFwiLnBhZ2luYXRpb24td3JhcFwiKS5oaWRlKCk7XG4gICAgfSk7XG5cbiAgICAkKFwiI2NhbmNlbFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNsZWFyKCk7XG4gICAgfSk7XG5cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICQoXCIuc2lkZWJhciBsaVwiKS5lcSgxKS5hZGRDbGFzcyhcImFjdGl2ZVwiKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgIGdldF90b2RheSgpO1xuICAgIGZpbGxEYXRhKCk7XG5cbiAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLmNoYW5nZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZpbGxEYXRhKCk7XG4gICAgfSk7XG4gICAgJChcIi5wYWdlLXR1cmluZy5wcmV2XCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKCkgPT0gMSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoKSAtIDEpO1xuICAgICAgICBmaWxsRGF0YSgpO1xuICAgIH0pO1xuICAgICQoXCIucGFnZS10dXJpbmcubmV4dFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpID09ICQoXCIuc2VsZWN0LXBhZ2Ugb3B0aW9uXCIpLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKE51bWJlcigkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpKSArIDEpO1xuICAgICAgICBmaWxsRGF0YSgpO1xuICAgIH0pO1xuXG4gICAgJChcIi5zZWFyY2ggaVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkLnRyaW0oJChcIi5zZWFyY2ggaW5wdXRcIikudmFsKCkpICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBmaWxsRGF0YSgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkKFwiLnNlYXJjaCBpbnB1dFwiKS5rZXlkb3duKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT0gMTMpIHtcbiAgICAgICAgICAgIGZpbGxEYXRhKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoXCJ0YWJsZVwiKS50YWJsZXNvcnQoe1xuICAgICAgICBmdW5jOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmaWxsRGF0YSgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkKFwiI2FsdGVyLWFtb3VudFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0ZCA9ICQodGhpcykuY2hpbGRyZW4oJ3RkJyk7XG4gICAgICAgIHZhciBuYW1lID0gdGQuZXEoMCkudGV4dCgpO1xuICAgICAgICB2YXIgYW1vdW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbW91bnRcIikudmFsdWU7XG4gICAgICAgIHZhciBzdWJzdG9ja19pZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3Vic3RvY2tfaWRcIikudmFsdWU7XG5cbiAgICAgICAgY29uc29sZS5sb2coYW1vdW50LHN1YnN0b2NrX2lkKTtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjEvcGF5L3BjLXN0b2NrLXRha2luZ1wiLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICdzaWQnOiBzdWJzdG9ja19pZCxcbiAgICAgICAgICAgICAgICAnbnVtJzogYW1vdW50XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogXCJQVVRcIixcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgY2xlYXIoKTtcbiAgICAgICAgICAgICAgICBmaWxsRGF0YSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfSk7XG4gICAgJChcIiNkb3dubG9hZFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vICQoXCJ0YWJsZVwiKS50YWJsZUV4cG9ydCh7XG4gICAgICAgIC8vICAgICBoZWFkaW5nczogdHJ1ZSxcbiAgICAgICAgLy8gICAgIGZpbGVOYW1lOiBcInN0b3Jlc1wiLFxuICAgICAgICAvLyAgICAgZm9ybWF0czogW1wiY3N2XCJdLFxuICAgICAgICAvLyAgICAgcG9zaXRpb246IFwiYm90dG9tXCIsXG4gICAgICAgIC8vICAgICBpZ25vcmVDU1M6IFwiW3N0eWxlKj0nZGlzcGxheTogbm9uZSddXCJcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIHZhciBhcmcgPSAkKFwiLnNlYXJjaCBpbnB1dFwiKS52YWwoKTtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9hcGkvdjEuMi9wYXkvc2FsZXMtcHJvZmlsZS1leGNlbD9zdGFydF90aW1lPVwiK3N0YXJ0X3RpbWUrXCImZW5kX3RpbWU9XCIrZW5kX3RpbWUrXCIma2V5X3dvcmQ9XCIrYXJnO1xuICAgIC8vICAgICAkLmFqYXgoe1xuICAgIC8vICAgICB1cmw6IFwiL2FwaS92MS4yL3BheS9zYWxlcy1wcm9maWxlLWV4Y2VsXCIsXG4gICAgLy8gICAgIGRhdGE6IHtcbiAgICAvLyAgICAgICAgIFwic3RhcnRfdGltZVwiOiBzdGFydF90aW1lLFxuICAgIC8vICAgICAgICAgXCJlbmRfdGltZVwiOiBlbmRfdGltZSxcbiAgICAvLyAgICAgICAgIFwia2V5X3dvcmRcIjogYXJnLFxuICAgIC8vICAgICB9LFxuICAgIC8vICAgICB0eXBlOiBcIkdFVFwiLFxuICAgIC8vICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIC8vICAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7XG4gICAgLy8gICAgICAgICAvLyBpZihkYXRhLmNvZGUgPT0gMCkge1xuICAgIC8vICAgICAgICAgLy8gICAgIGFsZXJ0KCflt7LkuIvovb0nKTtcbiAgICAvLyAgICAgICAgIC8vIH0gZWxzZXtcbiAgICAvLyAgICAgICAgIC8vICAgICBhbGVydCgn5LiL6L295aSx6LSlJyk7XG4gICAgLy8gICAgICAgICAvLyB9XG4gICAgLy8gICAgIH1cbiAgICAvLyB9KTtcbiAgICB9KTtcblxuXG5cbn0pOyJdLCJmaWxlIjoicGF5L3N0b2NrX3RhbGtpbmcuanMifQ==
