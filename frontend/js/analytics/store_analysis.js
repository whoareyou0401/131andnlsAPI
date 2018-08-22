function fillData(){
    var termRange = $(".date .date-choiced").attr("value");
    var storeProperty = $(".store-type .store-color").attr("value");
    var page = $(".select-page").val() || 1;
    var arg = $(".search input").val();
    var sort = $("th .ascending").parent().attr("value") || $("th .descending").parent().attr("value");
    var order = $(".ascending").attr("class") || $(".descending").attr("class");
    if ($.trim(arg) !== ""){
        page = 1;
    }
    $.ajax({
        url: "/analytics/chain-store",
        data: {"action": "storeanalysis-stores", "term_range": termRange, "property": storeProperty, "page":page, "arg":arg, "sort": sort, "order": order},
        type: "GET",
        success: function (data) {
            if (data.success == 1) {
                $(".pagination p span").text(data.data.pages);
                $(".select-page option").remove();
                for (var j = 1; j <= data.data.pages; j++){
                    $(".select-page").append("<option value="+j+">第" + num2Chinese(j) + "页</option>");
                }
                $(".select-page").val(page);
                var newRow = "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                $("table tbody tr").remove();
                for (var i = 0; i < data.data.data.length; i++) {
                    $("table tbody").append(newRow);
                    ii = i + 1;
                    $("table tr:eq(" + ii + ")").attr("value", data.data.data[i].id);
                    $("table tr:eq(" + ii + ") td:eq(0)").text(ii);
                    if (data.data.data[i].abnormal === 1){
                        $("table tr:eq(" + ii + ") td:eq(1)").html("<img src='/static/images/analytics/explain.png' alt=''>");
                    }
                    $("table tr:eq(" + ii + ") td:eq(2)").html("<a href='/analytics/store-detail/"+ data.data.data[i].id + "'>" + data.data.data[i].name+ "</a>");
                    // $("table tr:eq(" + ii + ") td:eq(2)").html("<a href='/analytics/store-detail/"+ data.data.data[i].id + "'>" + "xxx"+ "</a>");
                    $("table tr:eq(" + ii + ") td:eq(3)").text(data.data.data[i].display_id);
                    $("table tr:eq(" + ii + ") td:eq(4)").text(data.data.data[i].target_sales);
                    $("table tr:eq(" + ii + ") td:eq(5)").text(data.data.data[i].sales);
                    $("table tr:eq(" + ii + ") td:eq(6)").text(data.data.data[i].completeness);
                    $("table tr:eq(" + ii + ") td:eq(7)").text(data.data.data[i].expect_sales);
                    $("table tr:eq(" + ii + ") td:eq(8)").text(data.data.data[i].difference);
                    $("table tr:eq(" + ii + ") td:eq(9)").text(data.data.data[i].gross_profit);
                    $("table tr:eq(" + ii + ") td:eq(10)").text(data.data.data[i].term_on_term_difference);
                }
                $('input:checkbox:not(:checked)').each(function(){
                    hideTableCol($("table"), $(this).attr("value"));
                });
                $('input:checkbox:checked').each(function(){
                    showTableCol($("table"), $(this).attr("value"));
                });
                setTbaleWidth();
            }else {
                location.href = "/logout";
            }
        }
    });
}


$(document).ready(function(){
    $.ajax({
        url: "/analytics/chain-store",
        data: {"action": "overview-init"},
        type: "GET",
        success: function (data) {
            if (data.success == 1) {
                for (var i = 0; i < data.data.length; i++) {
                    $(".store-type").append("<span value='" + data.data[i].value + "'>" + data.data[i].name + "</span>");
                }
                fillData();
                $(".store-type span").click(function () {
                    $(".store-color").removeClass();
                    $(this).addClass("store-color");
                    fillData();
                    ga('send', {
                        hitType: 'event',
                        eventCategory: 'storelist',
                        eventAction: 'store-type',
                        eventLabel: $(this).text()
                    });
                });
            }
        }
    });

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
        ga('send', {
            hitType: 'event',
            eventCategory: 'storelist',
            eventAction: 'date',
            eventLabel: $(this).text()
        });
    });
    $(".select-page").change(function(){
        fillData();
    });
    $(".page-turing.prev").click(function(){
        if ($(".select-page").val() == 1)
            return;
        $(".select-page").val($(".select-page").val() - 1);
        fillData();
        ga('send', {
            hitType: 'event',
            eventCategory: 'storelist',
            eventAction: 'page-turing',
        });
    });
    $(".page-turing.next").click(function(){
        if ($(".select-page").val() == $(".select-page option").length)
        {
            return;
        }
        $(".select-page").val(Number($(".select-page").val()) + 1);
        fillData();
        ga('send', {
            hitType: 'event',
            eventCategory: 'storelist',
            eventAction: 'page-turing',
        });
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
        ga('send', {
            hitType: 'event',
            eventCategory: 'storelist',
            eventAction: 'search',
            eventLabel: $(this).val()
        });
    });

    $("table").tablesort({func: function(){fillData();}});

    $(".download").click(function(){
        $("table").tableExport({
            headings: true,
            fileName: "stores",
            formats: ["csv"],
            position: "bottom",
            ignoreCSS: "[style*='display: none']"
        });
        ga('send', {
            hitType: 'event',
            eventCategory: 'storelist',
            eventAction: 'download',
        });
    });
        // $(".btn-toolbar.bottom").attr("hidden", "hidden");

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