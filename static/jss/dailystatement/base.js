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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkYWlseXN0YXRlbWVudC9iYXNlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbnZhciBzdGFydF90aW1lO1xudmFyIGVuZF90aW1lO1xuXG5mdW5jdGlvbiBkZWxfdGFibGUodHlwZSkge1xuICAgIHZhciBjaGVja2JveCA9ICQoJy5jaGVja2JveDpjaGVja2VkJyk7XG4gICAgdmFyIGNoZWNrYm94X2xpc3QgPSBbXVxuICAgICQoY2hlY2tib3gpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBpZCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuYXR0cigndmFsdWUnKTtcbiAgICAgICAgY2hlY2tib3hfbGlzdC5wdXNoKGlkKTtcbiAgICB9KTtcbiAgICBjaGVja2JveF9saXN0ID0gSlNPTi5zdHJpbmdpZnkoY2hlY2tib3hfbGlzdClcbiAgICAkLmFqYXgoe1xuICAgICAgICB0eXBlOiBcIkRFTEVURVwiLFxuICAgICAgICB1cmw6IFwiL2FwaS92MS4wL2RhaWx5c3RhdGVtZW50L1wiICsgdHlwZSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgXCJpZHNcIjogY2hlY2tib3hfbGlzdCxcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgaWYgKGRhdGEuY29kZSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgJChjaGVja2JveCkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkucGFyZW50KCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA7XG5cbiAgICAgICAgfSxcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gY2hlY2tfaW5wdXQoKSB7XG4gICAgdmFyIGZsYWcgPSAwO1xuICAgICQoXCJpbnB1dFtjbGFzcz0ncmVxdWlyZSddXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xuICAgICAgICBpZiAoJCh0aGlzKS52YWwoKSA9PSAnJykge1xuICAgICAgICAgICAgZmxhZyA9IDE7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGZsYWdcbn1cblxuZnVuY3Rpb24gYWRkX29wdGlvbigpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgdmFyIGRpZmYgPSBkYXRlLmdldEZ1bGxZZWFyKCkgLSAyMDE3ICsgMTtcbiAgICAkKFwiLnllYXItc2VsZWN0aW9uXCIpLmh0bWwoXCJcIik7XG4gICAgJChcIi5tb250aC1zZWxlY3Rpb25cIikuaHRtbChcIlwiKTtcbiAgICAkKFwiLmRheS1zZWxlY3Rpb25cIikuaHRtbChcIlwiKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRpZmY7IGkrKykge1xuICAgICAgICB2YXIgbmV3eWVhciA9IDIwMTcgKyBpO1xuICAgICAgICB2YXIgb3B0aW9uID0gXCI8b3B0aW9uPlwiICsgbmV3eWVhciArIFwiPC9vcHRpb24+XCI7XG4gICAgICAgICQoXCIueWVhci1zZWxlY3Rpb25cIikuYXBwZW5kKG9wdGlvbik7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgMTM7IGkrKykge1xuICAgICAgICB2YXIgb3B0aW9uID0gXCI8b3B0aW9uPlwiICsgaSArIFwiPC9vcHRpb24+XCI7XG4gICAgICAgICQoXCIubW9udGgtc2VsZWN0aW9uXCIpLmFwcGVuZChvcHRpb24pO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IDMyOyBpKyspIHtcbiAgICAgICAgdmFyIG9wdGlvbiA9IFwiPG9wdGlvbj5cIiArIGkgKyBcIjwvb3B0aW9uPlwiO1xuICAgICAgICAkKFwiLmRheS1zZWxlY3Rpb25cIikuYXBwZW5kKG9wdGlvbik7XG4gICAgfVxuICAgICQoXCIueWVhci1zZWxlY3Rpb25cIikudmFsKGRhdGUuZ2V0RnVsbFllYXIoKSk7XG4gICAgJChcIi5tb250aC1zZWxlY3Rpb25cIikudmFsKGRhdGUuZ2V0TW9udGgoKSsxKTtcbiAgICAkKFwiI2VuZC1kYXlcIikudmFsKGRhdGUuZ2V0RGF0ZSgpKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0RGF0ZSh5ZWFyLCBtb250aCwgZGF5KSB7XG4gICAgaWYgKG1vbnRoIDwgMTApIHtcbiAgICAgICAgbW9udGggPSBcIjBcIiArIG1vbnRoO1xuICAgIH1cbiAgICBpZiAoZGF5IDwgMTApIHtcbiAgICAgICAgZGF5ID0gXCIwXCIgKyBkYXk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKHllYXIgKyBcIi1cIiArIG1vbnRoICsgXCItXCIgKyBkYXkpO1xuICAgIHJldHVybiAoeWVhciArIFwiLVwiICsgbW9udGggKyBcIi1cIiArIGRheSk7XG59XG5cbmZ1bmN0aW9uIGdldE1vbnRoRGF5cyhteU1vbnRoKSB7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgdmFyIG1vbnRoU3RhcnREYXRlID0gbmV3IERhdGUoeWVhciwgbXlNb250aCwgMSk7XG4gICAgdmFyIG1vbnRoRW5kRGF0ZSA9IG5ldyBEYXRlKHllYXIsIG15TW9udGggKyAxLCAxKTtcbiAgICB2YXIgZGF5cyA9IChtb250aEVuZERhdGUgLSBtb250aFN0YXJ0RGF0ZSkgLyAoMTAwMCAqIDYwICogNjAgKiAyNCk7XG4gICAgcmV0dXJuIGRheXM7XG59XG5cbmZ1bmN0aW9uIGdldF90b2RheSgpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgc3RhcnRfdGltZSA9IGZvcm1hdERhdGUoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCkrMSwgZGF0ZS5nZXREYXRlKCkpO1xuICAgIGVuZF90aW1lID0gc3RhcnRfdGltZTtcbn1cblxuZnVuY3Rpb24gZ2V0X2xhc3R3ZWVrX3RpbWUoKSB7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgIHZhciBtb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcbiAgICB2YXIgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XG4gICAgdmFyIGRheXMgPSBkYXRlLmdldERheSgpO1xuICAgIHZhciBzdGFydF9kYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgsIGRheSAtIGRheXMgLSA2KTtcbiAgICB2YXIgZW5kX2RhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgZGF5IC0gZGF5cyk7XG4gICAgc3RhcnRfdGltZSA9IGZvcm1hdERhdGUoc3RhcnRfZGF0ZS5nZXRGdWxsWWVhcigpLCBzdGFydF9kYXRlLmdldE1vbnRoKCkgKyAxLCBzdGFydF9kYXRlLmdldERhdGUoKSk7XG4gICAgZW5kX3RpbWUgPSBmb3JtYXREYXRlKGVuZF9kYXRlLmdldEZ1bGxZZWFyKCksIGVuZF9kYXRlLmdldE1vbnRoKCkgKyAxLCBlbmRfZGF0ZS5nZXREYXRlKCkpO1xuXG59XG5cbmZ1bmN0aW9uIGdldF9sYXN0bW9udGhfdGltZSgpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgdmFyIHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgdmFyIG1vbnRoID0gZGF0ZS5nZXRNb250aCgpO1xuICAgIHZhciBsYXN0bW9udGggPSBtb250aCAtIDE7XG4gICAgdmFyIHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBsYXN0bW9udGgsIDEpO1xuICAgIHZhciBlbmRfZGF0ZSA9IG5ldyBEYXRlKHllYXIsIGxhc3Rtb250aCwgZ2V0TW9udGhEYXlzKGxhc3Rtb250aCkpO1xuICAgIHN0YXJ0X3RpbWUgPSBmb3JtYXREYXRlKHN0YXJ0X2RhdGUuZ2V0RnVsbFllYXIoKSwgc3RhcnRfZGF0ZS5nZXRNb250aCgpICsgMSwgc3RhcnRfZGF0ZS5nZXREYXRlKCkpO1xuICAgIGVuZF90aW1lID0gZm9ybWF0RGF0ZShlbmRfZGF0ZS5nZXRGdWxsWWVhcigpLCBlbmRfZGF0ZS5nZXRNb250aCgpICsgMSwgZW5kX2RhdGUuZ2V0RGF0ZSgpKTtcbn1cblxuZnVuY3Rpb24gZ2V0X3VzZXJfdGltZSgpIHtcbiAgICB2YXIgc3RhcnRfZGF0ZSA9IG5ldyBEYXRlKCQoXCIjc3RhcnQteWVhclwiKS52YWwoKSwgJChcIiNzdGFydC1tb250aFwiKS52YWwoKSwgJChcIiNzdGFydC1kYXlcIikudmFsKCkpO1xuICAgIHZhciBlbmRfZGF0ZSA9IG5ldyBEYXRlKCQoXCIjZW5kLXllYXJcIikudmFsKCksICQoXCIjZW5kLW1vbnRoXCIpLnZhbCgpLCAkKFwiI2VuZC1kYXlcIikudmFsKCkpO1xuICAgIHZhciBpbnRlcnZhbFRpbWUgPSBlbmRfZGF0ZSAtIHN0YXJ0X2RhdGU7XG4gICAgdmFyIGludGVydmFsRGF5cyA9ICgoaW50ZXJ2YWxUaW1lKS50b0ZpeGVkKDIpIC8gODY0MDAwMDApICsgMTtcbiAgICBpZiAoaW50ZXJ2YWxEYXlzIDwgMCkge1xuICAgICAgICBhbGVydChcIuivt+ato+ehrumAieaLqei1t+Wni+aXtumXtO+8gVwiKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHN0YXJ0X3RpbWUgPSBmb3JtYXREYXRlKCQoXCIjc3RhcnQteWVhclwiKS52YWwoKSwgJChcIiNzdGFydC1tb250aFwiKS52YWwoKSwgJChcIiNzdGFydC1kYXlcIikudmFsKCkpO1xuICAgICAgICBlbmRfdGltZSA9IGZvcm1hdERhdGUoJChcIiNlbmQteWVhclwiKS52YWwoKSwgJChcIiNlbmQtbW9udGhcIikudmFsKCksICQoXCIjZW5kLWRheVwiKS52YWwoKSlcbiAgICB9XG59XG5cbiQoXCIuZGF0ZSAuYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAkKFwiLmRhdGUgLmJ1dHRvblwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgIGlmICgkKHRoaXMpLmF0dHIoXCJpZFwiKSA9PSBcImRhdGUtc2VsZWN0XCIpIHtcbiAgICAgICAgYWRkX29wdGlvbigpO1xuICAgICAgICAkKFwiLnRyaWFuZ2xlXCIpLnNob3coKTtcbiAgICAgICAgJChcIi5kYXRlLXNlbGVjdFwiKS5zaG93KCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAkKFwiLnRyaWFuZ2xlXCIpLmhpZGUoKTtcbiAgICAgICAgJChcIi5kYXRlLXNlbGVjdFwiKS5oaWRlKCk7XG4gICAgfVxufSk7XG5cbiQoXCIjbGFzdHdlZWtcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgIGdldF9sYXN0d2Vla190aW1lKCk7XG4gICAgZmlsbERhdGEoKTtcbn0pO1xuJChcIiNsYXN0bW9udGhcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgIGdldF9sYXN0bW9udGhfdGltZSgpO1xuICAgIGZpbGxEYXRhKCk7XG59KTtcbiQoXCIjdXNlcnRpbWVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgIGdldF91c2VyX3RpbWUoKTtcbiAgICBmaWxsRGF0YSgpO1xufSk7XG5cbiQoXCIuZGF0YVwiKS5ob3ZlcihmdW5jdGlvbiAoKXtcbiAgICAkKFwiLnNpZGViYXItY2hpbGRcIikuc2hvdygpO1xufSk7Il0sImZpbGUiOiJkYWlseXN0YXRlbWVudC9iYXNlLmpzIn0=
