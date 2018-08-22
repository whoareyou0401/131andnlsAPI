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
                var newRow = "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
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
                    var phone = data.data.data[i].phone || '无';
                    if (!work_time){
                        work_time = '--:--';
                    }
                    if (!worked_time){
                        worked_time = '--:--';
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
                    $("table tr:eq(" + ii + ") td:eq(6)").text(phone);
                    $("table tr:eq(" + ii + ") td:eq(7)").text(work_type);
                    $("table tr:eq(" + ii + ") td:eq(8)").text(statement);
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

    $(".download").click(function () {
        location.href = "/api/v1.0/dailystatement/work-checkin?download=1&start_time=" + start_time + "&end_time=" + end_time + "&type=" + type
    });
});