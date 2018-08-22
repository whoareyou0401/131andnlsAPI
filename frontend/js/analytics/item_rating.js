var values = {};
var categories = {};
function fillData(){
    var termRange = $(".date .date-choiced").attr("value");
    var page = $(".select-page").val() || 1;
    var sort = $("th .ascending").parent().attr("value") || $("th .descending").parent().attr("value");
    var order = $(".ascending").attr("class") || $(".descending").attr("class");
    values.category = "all";
    $("select.t4").each(function(){
        if ($(this).val() !== "all"){
            values.category = Number($(this).val());
        }
    });
    $.ajax({
        url: "/analytics/chain-store",
        data: {"action": "itemrating-item", "term_range": termRange, "page": page, "arg": window.btoa(JSON.stringify(values)), "sort": sort, "order": order},
        type: "GET",
        success: function (data) {

            if (data.success == 1) {
                $(".pagination p span").text(data.data.pages);
                $(".select-page option").remove();
                for (var j = 1; j <= data.data.pages; j++){
                    $(".select-page").append("<option value="+j+">第" + num2Chinese(j) + "页</option>");
                }
                $(".select-page").val(page);
                var newRow = "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                $("table tbody tr").remove();
                for (var i = 0; i < data.data.data.length; i++) {
                    $("table tbody").append(newRow);
                    ii = i + 1;
                    $("table tr:eq(" + ii + ")").attr("value", data.data.data[i].id);
                    $("table tr:eq(" + ii + ") td:eq(0)").text(ii);
                    for (var key in data.data.data[i]) {
                        index = $("table thead th[value='" + key +"']").index();
                        if (index !== -1){
                            $("table tr:eq(" + ii + ") td:eq(" + index + ")").text(data.data.data[i][key]);
                        }
                    }
                }
                $(".table-wrap input:checkbox:not(:checked)").each(function(){
                    hideTableCol($("table"), $(this).attr("value"));
                });
                $(".table-wrap input:checkbox:checked").each(function(){
                    showTableCol($("table"), $(this).attr("value"));
                });
                $(".module-wrap .line-right .block div").each(function(){
                    if (data.data.values[$(this).attr("name")]) {
                        $(this).height(134 * data.data.values[$(this).attr("name")]);
                    } else {
                        $(this).height(0);
                    }
                });
                $(".module-wrap .line-right .text p").each(function(){
                    if (data.data.values[$(this).attr("name")]) {
                        $(this).height(134 * data.data.values[$(this).attr("name")]);
                        $(this).css("line-height", String(134 * data.data.values[$(this).attr("name")]) + "px");
                        $(this).children("span").text((data.data.values[$(this).attr("name")] * 100).toFixed(2));
                    } else {
                        $(this).height(0);
                        $(this).css("line-height", String("0px"));
                        $(this).children("span").text((0).toFixed(0));
                    }
                });
            } else {
                location.href = "/logout";
            }
        }
    });
}

$(document).ready(function () {

    $.ajax({
        url: "/analytics/chain-store",
        data: {"action": "itemrating-init", "arg": "rank-item-rank"},
        type: "GET",
        success: function (data) {
            if (data.success == 1) {
                categories = data.data;
                var temp = {};
                for(var index=0; index < categories.length; index++){
                    temp[categories[index].level0_id] = categories[index];
                }
                for(var key in temp){
                    $("select[level='0']").append("<option value='" + key + "'>" + temp[key].level0_name + "</option>");
                }
                fillData();
            }
        }
    });

    $("a[value='itemrating']").addClass("sidebar-color");

    $(".show .show-line div[name]").each(function(){
        values[$(this).attr("name")] = Number($(this).text().split('%')[0]) / 100;
    });

    $("select.t4").change(function(){
        if($(this).val() !== "all" && Number($(this).attr("level") != 2)){
            var selectedLevel = Number($(this).attr("level"));
            var currentLevel = Number($(this).attr("level")) + 1;
            var selectedCat = Number($(this).val());
            for (var i = currentLevel; i <= 2; i++){
                $("select[level='" + i + "'] option:not([value='all'])").remove();
            }
            var temp = {};
            for(var index=0; index < categories.length; index++){
                if (categories[index]["level" + selectedLevel + "_id"] == selectedCat) {
                    temp[categories[index]["level" + currentLevel + "_id"]] = categories[index];
                }
            }
            for(var key in temp){
                $("select[level='" + currentLevel + "']").append("<option value='" + key + "'>" + temp[key]["level" + currentLevel + "_name"] + "</option>");
            }
        } else if ($(this).val() === "all"){
            currentLevel = Number($(this).attr("level")) + 1;
            for (i = currentLevel; i <= 2; i++){
                $("select[level='" + i + "'] option:not([value='all'])").remove();
            }
        }
        fillData();
        ga('send', {
            hitType: 'event',
            eventCategory: 'itemrating',
            eventAction: 'category-select',
        });
    });

    $(".date li").click(function () {
        $(this).siblings(".date-choiced").removeClass();
        $(this).addClass("date-choiced");
        ga('send', {
            hitType: 'event',
            eventCategory: 'itemrating',
            eventAction: 'date',
        });
    });

    $(".add-image:eq(0)").click(function(){
        var op = $(".explain-box").attr("hidden") == "hidden" ? $(".explain-box").removeAttr("hidden") : $(".explain-box").attr("hidden", "hidden");
    });
    $(".add-image:eq(1)").click(function(){
        var op = $(".add-items").attr("hidden") == "hidden" ? $(".add-items").removeAttr("hidden") : $(".add-items").attr("hidden", "hidden");
    });

    $(".popup-box .choice-button input.btn-color").click(function(){
        $(this).parents(".popup-box").find(".show .show-line div[name]").each(function(){
            values[$(this).attr("name")] = Number($(this).text().split('%')[0]) / 100;
            var height = Number($(this).text().split('%')[0]);

            $(this).parents(".module-wrap").find(".line .line-left .text p[name='"+ $(this).attr("name") +"'] span").text(height);
            $(this).parents(".module-wrap").find(".line .line-left .block div[name='"+ $(this).attr("name") +"']").height(134 * height / 100);
            $(this).parents(".item-module-wrap").find(".line .line-left p[name='"+ $(this).attr("name") +"']").css("line-height", String(134 * height / 100) + "px");
            $(this).parents(".item-module-wrap").find(".line .line-left p[name='"+ $(this).attr("name") +"']").height(134 * height / 100);
        });
        $(this).parents(".popup-box").attr("hidden", "hidden");
        fillData();
        ga('send', {
            hitType: 'event',
            eventCategory: 'itemrating',
            eventAction: 'ratechanged',
        });
    });

    $(".choice-button input[name='cancel']").click(function(){
        $(this).parents(".popup-box").find(":text").each(function(){
             $(this).val(values[$(this).attr("name")]);
        });
        $(this).parents(".popup-box").attr("hidden", "hidden");
    });

    $(".setting.t4").click(function(){
        var op = $(this).parent().siblings(".popup-box").attr("hidden") == "hidden" ? $(this).parent().siblings(".popup-box").removeAttr("hidden") : $(this).parent().siblings(".popup-box").attr("hidden", "hidden");
        $(this).parents(".popup-box").find(":text").each(function(){
             $(this).val(values[$(this).attr("name")]);
        });
    });

    $(".popup-box input:first-child, .item-rating-button .float-right>input:first-child, .explain-box .float-right>input").click(function(){
        $(".add-items").attr("hidden", "hidden");
    });
    $(".popup-box input:nth-child(2)").click(function(){
        $(".add-items").attr("hidden", "hidden");

        $('input:checkbox:not(:checked)').each(function(){
            hideTableCol($("table"), $(this).attr("value"));
        });
        $('input:checkbox:checked').each(function(){
            showTableCol($("table"), $(this).attr("value"));
        });
    });
    $(".item-rating-button .float-right>input:nth-of-type(2)").click(function() {
        $(".add-items").attr("hidden", "hidden");

        $('input:checkbox:not(:checked)').each(function(){
            hideTableCol($("table"), $(this).attr("value"));
        });
        $('input:checkbox:checked').each(function(){
            showTableCol($("table"), $(this).attr("value"));
        });
        setTbaleWidth();
    });

    $(".select-page").change(function(){
        fillData();
        ga('send', {
            hitType: 'event',
            eventCategory: 'itemrating',
            eventAction: 'page-select',
        });
    });
    $(".page-turing.prev").click(function(){
        if ($(".select-page").val() == 1)
            return;
        $(".select-page").val($(".select-page").val() - 1);
        fillData();
        ga('send', {
            hitType: 'event',
            eventCategory: 'itemrating',
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
            eventCategory: 'itemrating',
            eventAction: 'page-turing',
        });
    });
    $("table").tablesort({func: function(){fillData();}});
    $(".download").click(function(){
        $("table").tableExport({
            headings: true,
            fileName: "items",
            formats: ["csv"],
            position: "bottom",
            ignoreCSS: "[style*='display: none']"
        });
        ga('send', {
            hitType: 'event',
            eventCategory: 'itemrating',
            eventAction: 'download',
        });
    });
    tableScrollFun();
});
