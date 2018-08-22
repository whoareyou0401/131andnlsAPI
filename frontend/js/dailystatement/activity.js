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

    $(".sidebar li").eq(2).addClass("active").siblings().removeClass("active");
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