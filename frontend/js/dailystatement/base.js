// var date = new Date();
var start_time;
var end_time;

function del_table(type) {
    var checkbox = $('.checkbox:checked');
    var checkbox_list = []
    $(checkbox).each(function () {
        id = $(this).parent().parent().attr('value');
        checkbox_list.push(id);
    });
    checkbox_list = JSON.stringify(checkbox_list)
    $.ajax({
        type: "DELETE",
        url: "/api/v1.0/dailystatement/" + type,
        data: {
            "ids": checkbox_list,
        },
        dataType: "json",
        success: function (data) {
            if (data.code == 0) {
                $(checkbox).each(function () {
                    $(this).parent().parent().remove();
                });
            }
            ;

        },
    });
}

function check_input() {
    var flag = 0;
    $("input[class='require']").each(function () {
        $(this).removeClass('error');
        if ($(this).val() == '') {
            flag = 1;
            $(this).addClass('error');
        }
    });
    return flag
}

function add_option() {
    var date = new Date();
    var diff = date.getFullYear() - 2017 + 1;
    $(".year-selection").html("");
    $(".month-selection").html("");
    $(".day-selection").html("");
    for (var i = 0; i < diff; i++) {
        var newyear = 2017 + i;
        var option = "<option>" + newyear + "</option>";
        $(".year-selection").append(option);
    }
    for (var i = 1; i < 13; i++) {
        var option = "<option>" + i + "</option>";
        $(".month-selection").append(option);
    }
    for (var i = 1; i < 32; i++) {
        var option = "<option>" + i + "</option>";
        $(".day-selection").append(option);
    }
    $(".year-selection").val(date.getFullYear());
    $(".month-selection").val(date.getMonth()+1);
    $("#end-day").val(date.getDate());
}

function formatDate(year, month, day) {
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    console.log(year + "-" + month + "-" + day);
    return (year + "-" + month + "-" + day);
}

function getMonthDays(myMonth) {
    var date = new Date();
    year = date.getFullYear();
    var monthStartDate = new Date(year, myMonth, 1);
    var monthEndDate = new Date(year, myMonth + 1, 1);
    var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
}

function get_today() {
    var date = new Date();
    start_time = formatDate(date.getFullYear(), date.getMonth()+1, date.getDate());
    end_time = start_time;
}

function get_lastweek_time() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var days = date.getDay();
    var start_date = new Date(year, month, day - days - 6);
    var end_date = new Date(year, month, day - days);
    start_time = formatDate(start_date.getFullYear(), start_date.getMonth() + 1, start_date.getDate());
    end_time = formatDate(end_date.getFullYear(), end_date.getMonth() + 1, end_date.getDate());

}

function get_lastmonth_time() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var lastmonth = month - 1;
    var start_date = new Date(year, lastmonth, 1);
    var end_date = new Date(year, lastmonth, getMonthDays(lastmonth));
    start_time = formatDate(start_date.getFullYear(), start_date.getMonth() + 1, start_date.getDate());
    end_time = formatDate(end_date.getFullYear(), end_date.getMonth() + 1, end_date.getDate());
}

function get_user_time() {
    var start_date = new Date($("#start-year").val(), $("#start-month").val(), $("#start-day").val());
    var end_date = new Date($("#end-year").val(), $("#end-month").val(), $("#end-day").val());
    var intervalTime = end_date - start_date;
    var intervalDays = ((intervalTime).toFixed(2) / 86400000) + 1;
    if (intervalDays < 0) {
        alert("请正确选择起始时间！");
    }
    else {
        start_time = formatDate($("#start-year").val(), $("#start-month").val(), $("#start-day").val());
        end_time = formatDate($("#end-year").val(), $("#end-month").val(), $("#end-day").val())
    }
}

$(".date .button").click(function () {
    $(".date .button").removeClass("active");
    $(this).addClass("active");
    if ($(this).attr("id") == "date-select") {
        add_option();
        $(".triangle").show();
        $(".date-select").show();
    }
    else {
        $(".triangle").hide();
        $(".date-select").hide();
    }
});

$("#lastweek").click(function () {
    get_lastweek_time();
    fillData();
});
$("#lastmonth").click(function () {
    get_lastmonth_time();
    fillData();
});
$("#usertime").click(function () {
    get_user_time();
    fillData();
});

$(".data").hover(function (){
    $(".sidebar-child").show();
});