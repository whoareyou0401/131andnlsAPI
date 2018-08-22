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

    $(".sidebar li").eq(4).addClass("active").siblings().removeClass("active");
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