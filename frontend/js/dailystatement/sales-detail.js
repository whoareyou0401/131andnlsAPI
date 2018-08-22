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