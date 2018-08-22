function fillData(){
    var startTime = $("#startTime").attr("value");
    var endTime = $("#endTime").attr("value");
    var arg = $(".search input").val();
    var sort = $("th .ascending").parent().attr("value") || $("th .descending").parent().attr("value");
    var order = $(".ascending").attr("class") || $(".descending").attr("class");
    var intervalTime = compareDate(startTime,endTime);
    if ($.trim(arg) !== ""){
        page = 1;
    }
    $.ajax({
        url: "/api/v1.0/dailystatement/commission",
        data: {"start_time": startTime, "end_time": endTime, "arg":arg, "sort": sort, "order": order},
        type: "GET",
        success: function (data) {
            if (data.success == 1) {
                var newRow = "<tr><td></td><td></td><td></td><td></td><td></td></tr>";
                $("table tbody tr").remove();
                for (var i = 0; i < data.data.data.length; i++) {
                    $("table tbody").append(newRow);
                    ii = i + 1;
                    var number = data.data.data[i].number || '无';
                    var commission = data.data.data[i].commission || 0;
                    var guide = data.data.data[i].guide || '无';
                    $("table tr:eq(" + ii + ")").attr("value", data.data.data[i].id);
                    $("table tr:eq(" + ii + ") td:eq(0)").text(ii);
                    $("table tr:eq(" + ii + ") td:eq(1)").text(number);
                    $("table tr:eq(" + ii + ") td:eq(2)").html("<a href='/dailystatement/store-detail/"+ data.data.data[i].id + "'>" + data.data.data[i].store_name+ "</a>");
                    $("table tr:eq(" + ii + ") td:eq(3)").text(commission);
                    $("table tr:eq(" + ii + ") td:eq(4)").text(guide);
                }
              
                setTbaleWidth();
            }else {
                location.href = "/logout";
            }
        }
    });
}


$(document).ready(function(){$(".sidebar li").eq(0).addClass("active").siblings().removeClass("active");

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var year_select = "#year-select option[value='"+ year + "']";
    var month_select = "#month-select option[value='" + month + "']";
    $(year_select).attr("selected",true);
    $(month_select).attr("selected",true);
    var d = new Date();
    var start_time = d.getFullYear()+"-"+(d.getMonth()+1)+"-1";
    var end_time = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    $("#startTime").attr("value",start_time);
    $("#endTime").attr("value",end_time);
    fillData();
    

    $("a[value='storeanalysis']").addClass("sidebar-color");

    $(".date li").click(function () {
        $(".date-choiced").removeClass();
        $(this).addClass("date-choiced");
        fillData();
        var _left = $(this).scrollLeft();
        $('table th').eq(0).css('left', _left);
        $('table th').eq(1).css('left', _left);
        $('table th').eq(2).css('left', _left);
        $('table th').eq(3).css('left', _left).addClass('box-shadow');
        $('table td:nth-child(1)').css('left', _left);
        $('table td:nth-child(2)').css('left', _left);
        $('table td:nth-child(3)').css('left', _left);
        $('table td:nth-child(4)').css('left', _left).addClass('box-shadow');
        if (Number($(this).scrollLeft()) === 0) {
            $('table th').eq(3).removeClass('box-shadow');
            $('table td:nth-child(4)').removeClass('box-shadow');
        }
    });
    $(".select-page").change(function(){
        fillData();
    });
    $(".page-turing.prev").click(function(){
        if ($(".select-page").val() == 1)
            return;
        $(".select-page").val($(".select-page").val() - 1);
        fillData();
    });
    $(".page-turing.next").click(function(){
        if ($(".select-page").val() == $(".select-page option").length)
        {
            return;
        }
        $(".select-page").val(Number($(".select-page").val()) + 1);
        fillData();
    });
    $(".add-image:eq(0)").click(function(){
        var op = $(".explain-box").attr("hidden") == "hidden" ? $(".explain-box").removeAttr("hidden") : $(".explain-box").attr("hidden", "hidden");
    });
    $(".add-image:eq(1)").click(function(){
        var op = $(".add-items").attr("hidden") == "hidden" ? $(".add-items").removeAttr("hidden") : $(".add-items").attr("hidden", "hidden");
    });
    $(".float-right input:eq(0), .float-right input:eq(1)").click(function(){
        $(".add-items").attr("hidden", "hidden");
    });
    $(".float-right input:eq(2)").click(function(){
        $(".add-items").attr("hidden", "hidden");

        $('input:checkbox:not(:checked)').each(function(){
            hideTableCol($("table"), $(this).attr("value"));
        });
        $('input:checkbox:checked').each(function(){
            showTableCol($("table"), $(this).attr("value"));
        });
        setTbaleWidth();
    });

    $(".search img").click(function(){
        if ($.trim($(".search input").val()) !== ""){
            fillData();
        }
    });

    $(".search input").keydown(function(event){
        if (event.which == 13){
            fillData();
        }
    });

    $("table").tableExport({
            headings: true,
            fileName: "stores",
            formats: ["csv","xls"],
            exportButtons: true,
            position: "bottom",
            ignoreCSS: "[style*='display: none']"
        });

    $("table").tablesort({func: function(){fillData();}});

    $(".download").click(function(){
        $("table").tableExport({
            headings: true,
            fileName: "stores",
            formats: ["csv","xls"],
            exportButtons: true,
            position: "bottom",
            ignoreCSS: "[style*='display: none']"
        });
    });

    $('.table-border').scroll(function() {
        var _left = $(this).scrollLeft();
        $('table th').eq(0).css('left', _left);
        $('table th').eq(1).css('left', _left);
        $('table th').eq(2).css('left', _left);
        $('table th').eq(3).css('left', _left).addClass('box-shadow');
        $('table td:nth-child(1)').css('left', _left);
        $('table td:nth-child(2)').css('left', _left);
        $('table td:nth-child(3)').css('left', _left);
        $('table td:nth-child(4)').css('left', _left).addClass('box-shadow');
        if (Number($(this).scrollLeft()) === 0) {
            $('table th').eq(3).removeClass('box-shadow');
            $('table td:nth-child(4)').removeClass('box-shadow');
        }
    });
});