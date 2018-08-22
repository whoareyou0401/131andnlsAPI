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