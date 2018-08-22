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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhbmFseXRpY3MvaXRlbV9yYXRpbmcuanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIHZhbHVlcyA9IHt9O1xudmFyIGNhdGVnb3JpZXMgPSB7fTtcbmZ1bmN0aW9uIGZpbGxEYXRhKCl7XG4gICAgdmFyIHRlcm1SYW5nZSA9ICQoXCIuZGF0ZSAuZGF0ZS1jaG9pY2VkXCIpLmF0dHIoXCJ2YWx1ZVwiKTtcbiAgICB2YXIgcGFnZSA9ICQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKCkgfHwgMTtcbiAgICB2YXIgc29ydCA9ICQoXCJ0aCAuYXNjZW5kaW5nXCIpLnBhcmVudCgpLmF0dHIoXCJ2YWx1ZVwiKSB8fCAkKFwidGggLmRlc2NlbmRpbmdcIikucGFyZW50KCkuYXR0cihcInZhbHVlXCIpO1xuICAgIHZhciBvcmRlciA9ICQoXCIuYXNjZW5kaW5nXCIpLmF0dHIoXCJjbGFzc1wiKSB8fCAkKFwiLmRlc2NlbmRpbmdcIikuYXR0cihcImNsYXNzXCIpO1xuICAgIHZhbHVlcy5jYXRlZ29yeSA9IFwiYWxsXCI7XG4gICAgJChcInNlbGVjdC50NFwiKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmICgkKHRoaXMpLnZhbCgpICE9PSBcImFsbFwiKXtcbiAgICAgICAgICAgIHZhbHVlcy5jYXRlZ29yeSA9IE51bWJlcigkKHRoaXMpLnZhbCgpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogXCIvYW5hbHl0aWNzL2NoYWluLXN0b3JlXCIsXG4gICAgICAgIGRhdGE6IHtcImFjdGlvblwiOiBcIml0ZW1yYXRpbmctaXRlbVwiLCBcInRlcm1fcmFuZ2VcIjogdGVybVJhbmdlLCBcInBhZ2VcIjogcGFnZSwgXCJhcmdcIjogd2luZG93LmJ0b2EoSlNPTi5zdHJpbmdpZnkodmFsdWVzKSksIFwic29ydFwiOiBzb3J0LCBcIm9yZGVyXCI6IG9yZGVyfSxcbiAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgJChcIi5wYWdpbmF0aW9uIHAgc3BhblwiKS50ZXh0KGRhdGEuZGF0YS5wYWdlcyk7XG4gICAgICAgICAgICAgICAgJChcIi5zZWxlY3QtcGFnZSBvcHRpb25cIikucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDE7IGogPD0gZGF0YS5kYXRhLnBhZ2VzOyBqKyspe1xuICAgICAgICAgICAgICAgICAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLmFwcGVuZChcIjxvcHRpb24gdmFsdWU9XCIraitcIj7nrKxcIiArIG51bTJDaGluZXNlKGopICsgXCLpobU8L29wdGlvbj5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKHBhZ2UpO1xuICAgICAgICAgICAgICAgIHZhciBuZXdSb3cgPSBcIjx0cj48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48L3RyPlwiO1xuICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0Ym9keSB0clwiKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuZGF0YS5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0Ym9keVwiKS5hcHBlbmQobmV3Um93KTtcbiAgICAgICAgICAgICAgICAgICAgaWkgPSBpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIilcIikuYXR0cihcInZhbHVlXCIsIGRhdGEuZGF0YS5kYXRhW2ldLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoMClcIikudGV4dChpaSk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBkYXRhLmRhdGEuZGF0YVtpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAkKFwidGFibGUgdGhlYWQgdGhbdmFsdWU9J1wiICsga2V5ICtcIiddXCIpLmluZGV4KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcShcIiArIGluZGV4ICsgXCIpXCIpLnRleHQoZGF0YS5kYXRhLmRhdGFbaV1ba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJChcIi50YWJsZS13cmFwIGlucHV0OmNoZWNrYm94Om5vdCg6Y2hlY2tlZClcIikuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBoaWRlVGFibGVDb2woJChcInRhYmxlXCIpLCAkKHRoaXMpLmF0dHIoXCJ2YWx1ZVwiKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJChcIi50YWJsZS13cmFwIGlucHV0OmNoZWNrYm94OmNoZWNrZWRcIikuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBzaG93VGFibGVDb2woJChcInRhYmxlXCIpLCAkKHRoaXMpLmF0dHIoXCJ2YWx1ZVwiKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJChcIi5tb2R1bGUtd3JhcCAubGluZS1yaWdodCAuYmxvY2sgZGl2XCIpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZGF0YS52YWx1ZXNbJCh0aGlzKS5hdHRyKFwibmFtZVwiKV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuaGVpZ2h0KDEzNCAqIGRhdGEuZGF0YS52YWx1ZXNbJCh0aGlzKS5hdHRyKFwibmFtZVwiKV0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5oZWlnaHQoMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkKFwiLm1vZHVsZS13cmFwIC5saW5lLXJpZ2h0IC50ZXh0IHBcIikuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5kYXRhLnZhbHVlc1skKHRoaXMpLmF0dHIoXCJuYW1lXCIpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5oZWlnaHQoMTM0ICogZGF0YS5kYXRhLnZhbHVlc1skKHRoaXMpLmF0dHIoXCJuYW1lXCIpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcyhcImxpbmUtaGVpZ2h0XCIsIFN0cmluZygxMzQgKiBkYXRhLmRhdGEudmFsdWVzWyQodGhpcykuYXR0cihcIm5hbWVcIildKSArIFwicHhcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNoaWxkcmVuKFwic3BhblwiKS50ZXh0KChkYXRhLmRhdGEudmFsdWVzWyQodGhpcykuYXR0cihcIm5hbWVcIildICogMTAwKS50b0ZpeGVkKDIpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuaGVpZ2h0KDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoXCJsaW5lLWhlaWdodFwiLCBTdHJpbmcoXCIwcHhcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jaGlsZHJlbihcInNwYW5cIikudGV4dCgoMCkudG9GaXhlZCgwKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9jYXRpb24uaHJlZiA9IFwiL2xvZ291dFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblxuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogXCIvYW5hbHl0aWNzL2NoYWluLXN0b3JlXCIsXG4gICAgICAgIGRhdGE6IHtcImFjdGlvblwiOiBcIml0ZW1yYXRpbmctaW5pdFwiLCBcImFyZ1wiOiBcInJhbmstaXRlbS1yYW5rXCJ9LFxuICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcyA9IGRhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IHt9O1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaW5kZXg9MDsgaW5kZXggPCBjYXRlZ29yaWVzLmxlbmd0aDsgaW5kZXgrKyl7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBbY2F0ZWdvcmllc1tpbmRleF0ubGV2ZWwwX2lkXSA9IGNhdGVnb3JpZXNbaW5kZXhdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IodmFyIGtleSBpbiB0ZW1wKXtcbiAgICAgICAgICAgICAgICAgICAgJChcInNlbGVjdFtsZXZlbD0nMCddXCIpLmFwcGVuZChcIjxvcHRpb24gdmFsdWU9J1wiICsga2V5ICsgXCInPlwiICsgdGVtcFtrZXldLmxldmVsMF9uYW1lICsgXCI8L29wdGlvbj5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZpbGxEYXRhKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoXCJhW3ZhbHVlPSdpdGVtcmF0aW5nJ11cIikuYWRkQ2xhc3MoXCJzaWRlYmFyLWNvbG9yXCIpO1xuXG4gICAgJChcIi5zaG93IC5zaG93LWxpbmUgZGl2W25hbWVdXCIpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgdmFsdWVzWyQodGhpcykuYXR0cihcIm5hbWVcIildID0gTnVtYmVyKCQodGhpcykudGV4dCgpLnNwbGl0KCclJylbMF0pIC8gMTAwO1xuICAgIH0pO1xuXG4gICAgJChcInNlbGVjdC50NFwiKS5jaGFuZ2UoZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoJCh0aGlzKS52YWwoKSAhPT0gXCJhbGxcIiAmJiBOdW1iZXIoJCh0aGlzKS5hdHRyKFwibGV2ZWxcIikgIT0gMikpe1xuICAgICAgICAgICAgdmFyIHNlbGVjdGVkTGV2ZWwgPSBOdW1iZXIoJCh0aGlzKS5hdHRyKFwibGV2ZWxcIikpO1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRMZXZlbCA9IE51bWJlcigkKHRoaXMpLmF0dHIoXCJsZXZlbFwiKSkgKyAxO1xuICAgICAgICAgICAgdmFyIHNlbGVjdGVkQ2F0ID0gTnVtYmVyKCQodGhpcykudmFsKCkpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGN1cnJlbnRMZXZlbDsgaSA8PSAyOyBpKyspe1xuICAgICAgICAgICAgICAgICQoXCJzZWxlY3RbbGV2ZWw9J1wiICsgaSArIFwiJ10gb3B0aW9uOm5vdChbdmFsdWU9J2FsbCddKVwiKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0ZW1wID0ge307XG4gICAgICAgICAgICBmb3IodmFyIGluZGV4PTA7IGluZGV4IDwgY2F0ZWdvcmllcy5sZW5ndGg7IGluZGV4Kyspe1xuICAgICAgICAgICAgICAgIGlmIChjYXRlZ29yaWVzW2luZGV4XVtcImxldmVsXCIgKyBzZWxlY3RlZExldmVsICsgXCJfaWRcIl0gPT0gc2VsZWN0ZWRDYXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcFtjYXRlZ29yaWVzW2luZGV4XVtcImxldmVsXCIgKyBjdXJyZW50TGV2ZWwgKyBcIl9pZFwiXV0gPSBjYXRlZ29yaWVzW2luZGV4XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiB0ZW1wKXtcbiAgICAgICAgICAgICAgICAkKFwic2VsZWN0W2xldmVsPSdcIiArIGN1cnJlbnRMZXZlbCArIFwiJ11cIikuYXBwZW5kKFwiPG9wdGlvbiB2YWx1ZT0nXCIgKyBrZXkgKyBcIic+XCIgKyB0ZW1wW2tleV1bXCJsZXZlbFwiICsgY3VycmVudExldmVsICsgXCJfbmFtZVwiXSArIFwiPC9vcHRpb24+XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCQodGhpcykudmFsKCkgPT09IFwiYWxsXCIpe1xuICAgICAgICAgICAgY3VycmVudExldmVsID0gTnVtYmVyKCQodGhpcykuYXR0cihcImxldmVsXCIpKSArIDE7XG4gICAgICAgICAgICBmb3IgKGkgPSBjdXJyZW50TGV2ZWw7IGkgPD0gMjsgaSsrKXtcbiAgICAgICAgICAgICAgICAkKFwic2VsZWN0W2xldmVsPSdcIiArIGkgKyBcIiddIG9wdGlvbjpub3QoW3ZhbHVlPSdhbGwnXSlcIikucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZmlsbERhdGEoKTtcbiAgICAgICAgZ2EoJ3NlbmQnLCB7XG4gICAgICAgICAgICBoaXRUeXBlOiAnZXZlbnQnLFxuICAgICAgICAgICAgZXZlbnRDYXRlZ29yeTogJ2l0ZW1yYXRpbmcnLFxuICAgICAgICAgICAgZXZlbnRBY3Rpb246ICdjYXRlZ29yeS1zZWxlY3QnLFxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICQoXCIuZGF0ZSBsaVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykuc2libGluZ3MoXCIuZGF0ZS1jaG9pY2VkXCIpLnJlbW92ZUNsYXNzKCk7XG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJkYXRlLWNob2ljZWRcIik7XG4gICAgICAgIGdhKCdzZW5kJywge1xuICAgICAgICAgICAgaGl0VHlwZTogJ2V2ZW50JyxcbiAgICAgICAgICAgIGV2ZW50Q2F0ZWdvcnk6ICdpdGVtcmF0aW5nJyxcbiAgICAgICAgICAgIGV2ZW50QWN0aW9uOiAnZGF0ZScsXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgJChcIi5hZGQtaW1hZ2U6ZXEoMClcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIG9wID0gJChcIi5leHBsYWluLWJveFwiKS5hdHRyKFwiaGlkZGVuXCIpID09IFwiaGlkZGVuXCIgPyAkKFwiLmV4cGxhaW4tYm94XCIpLnJlbW92ZUF0dHIoXCJoaWRkZW5cIikgOiAkKFwiLmV4cGxhaW4tYm94XCIpLmF0dHIoXCJoaWRkZW5cIiwgXCJoaWRkZW5cIik7XG4gICAgfSk7XG4gICAgJChcIi5hZGQtaW1hZ2U6ZXEoMSlcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIG9wID0gJChcIi5hZGQtaXRlbXNcIikuYXR0cihcImhpZGRlblwiKSA9PSBcImhpZGRlblwiID8gJChcIi5hZGQtaXRlbXNcIikucmVtb3ZlQXR0cihcImhpZGRlblwiKSA6ICQoXCIuYWRkLWl0ZW1zXCIpLmF0dHIoXCJoaWRkZW5cIiwgXCJoaWRkZW5cIik7XG4gICAgfSk7XG5cbiAgICAkKFwiLnBvcHVwLWJveCAuY2hvaWNlLWJ1dHRvbiBpbnB1dC5idG4tY29sb3JcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgJCh0aGlzKS5wYXJlbnRzKFwiLnBvcHVwLWJveFwiKS5maW5kKFwiLnNob3cgLnNob3ctbGluZSBkaXZbbmFtZV1cIikuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFsdWVzWyQodGhpcykuYXR0cihcIm5hbWVcIildID0gTnVtYmVyKCQodGhpcykudGV4dCgpLnNwbGl0KCclJylbMF0pIC8gMTAwO1xuICAgICAgICAgICAgdmFyIGhlaWdodCA9IE51bWJlcigkKHRoaXMpLnRleHQoKS5zcGxpdCgnJScpWzBdKTtcblxuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKFwiLm1vZHVsZS13cmFwXCIpLmZpbmQoXCIubGluZSAubGluZS1sZWZ0IC50ZXh0IHBbbmFtZT0nXCIrICQodGhpcykuYXR0cihcIm5hbWVcIikgK1wiJ10gc3BhblwiKS50ZXh0KGhlaWdodCk7XG4gICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoXCIubW9kdWxlLXdyYXBcIikuZmluZChcIi5saW5lIC5saW5lLWxlZnQgLmJsb2NrIGRpdltuYW1lPSdcIisgJCh0aGlzKS5hdHRyKFwibmFtZVwiKSArXCInXVwiKS5oZWlnaHQoMTM0ICogaGVpZ2h0IC8gMTAwKTtcbiAgICAgICAgICAgICQodGhpcykucGFyZW50cyhcIi5pdGVtLW1vZHVsZS13cmFwXCIpLmZpbmQoXCIubGluZSAubGluZS1sZWZ0IHBbbmFtZT0nXCIrICQodGhpcykuYXR0cihcIm5hbWVcIikgK1wiJ11cIikuY3NzKFwibGluZS1oZWlnaHRcIiwgU3RyaW5nKDEzNCAqIGhlaWdodCAvIDEwMCkgKyBcInB4XCIpO1xuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKFwiLml0ZW0tbW9kdWxlLXdyYXBcIikuZmluZChcIi5saW5lIC5saW5lLWxlZnQgcFtuYW1lPSdcIisgJCh0aGlzKS5hdHRyKFwibmFtZVwiKSArXCInXVwiKS5oZWlnaHQoMTM0ICogaGVpZ2h0IC8gMTAwKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQodGhpcykucGFyZW50cyhcIi5wb3B1cC1ib3hcIikuYXR0cihcImhpZGRlblwiLCBcImhpZGRlblwiKTtcbiAgICAgICAgZmlsbERhdGEoKTtcbiAgICAgICAgZ2EoJ3NlbmQnLCB7XG4gICAgICAgICAgICBoaXRUeXBlOiAnZXZlbnQnLFxuICAgICAgICAgICAgZXZlbnRDYXRlZ29yeTogJ2l0ZW1yYXRpbmcnLFxuICAgICAgICAgICAgZXZlbnRBY3Rpb246ICdyYXRlY2hhbmdlZCcsXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgJChcIi5jaG9pY2UtYnV0dG9uIGlucHV0W25hbWU9J2NhbmNlbCddXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICQodGhpcykucGFyZW50cyhcIi5wb3B1cC1ib3hcIikuZmluZChcIjp0ZXh0XCIpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAkKHRoaXMpLnZhbCh2YWx1ZXNbJCh0aGlzKS5hdHRyKFwibmFtZVwiKV0pO1xuICAgICAgICB9KTtcbiAgICAgICAgJCh0aGlzKS5wYXJlbnRzKFwiLnBvcHVwLWJveFwiKS5hdHRyKFwiaGlkZGVuXCIsIFwiaGlkZGVuXCIpO1xuICAgIH0pO1xuXG4gICAgJChcIi5zZXR0aW5nLnQ0XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBvcCA9ICQodGhpcykucGFyZW50KCkuc2libGluZ3MoXCIucG9wdXAtYm94XCIpLmF0dHIoXCJoaWRkZW5cIikgPT0gXCJoaWRkZW5cIiA/ICQodGhpcykucGFyZW50KCkuc2libGluZ3MoXCIucG9wdXAtYm94XCIpLnJlbW92ZUF0dHIoXCJoaWRkZW5cIikgOiAkKHRoaXMpLnBhcmVudCgpLnNpYmxpbmdzKFwiLnBvcHVwLWJveFwiKS5hdHRyKFwiaGlkZGVuXCIsIFwiaGlkZGVuXCIpO1xuICAgICAgICAkKHRoaXMpLnBhcmVudHMoXCIucG9wdXAtYm94XCIpLmZpbmQoXCI6dGV4dFwiKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgJCh0aGlzKS52YWwodmFsdWVzWyQodGhpcykuYXR0cihcIm5hbWVcIildKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAkKFwiLnBvcHVwLWJveCBpbnB1dDpmaXJzdC1jaGlsZCwgLml0ZW0tcmF0aW5nLWJ1dHRvbiAuZmxvYXQtcmlnaHQ+aW5wdXQ6Zmlyc3QtY2hpbGQsIC5leHBsYWluLWJveCAuZmxvYXQtcmlnaHQ+aW5wdXRcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgJChcIi5hZGQtaXRlbXNcIikuYXR0cihcImhpZGRlblwiLCBcImhpZGRlblwiKTtcbiAgICB9KTtcbiAgICAkKFwiLnBvcHVwLWJveCBpbnB1dDpudGgtY2hpbGQoMilcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgJChcIi5hZGQtaXRlbXNcIikuYXR0cihcImhpZGRlblwiLCBcImhpZGRlblwiKTtcblxuICAgICAgICAkKCdpbnB1dDpjaGVja2JveDpub3QoOmNoZWNrZWQpJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgaGlkZVRhYmxlQ29sKCQoXCJ0YWJsZVwiKSwgJCh0aGlzKS5hdHRyKFwidmFsdWVcIikpO1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnaW5wdXQ6Y2hlY2tib3g6Y2hlY2tlZCcpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHNob3dUYWJsZUNvbCgkKFwidGFibGVcIiksICQodGhpcykuYXR0cihcInZhbHVlXCIpKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgJChcIi5pdGVtLXJhdGluZy1idXR0b24gLmZsb2F0LXJpZ2h0PmlucHV0Om50aC1vZi10eXBlKDIpXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKFwiLmFkZC1pdGVtc1wiKS5hdHRyKFwiaGlkZGVuXCIsIFwiaGlkZGVuXCIpO1xuXG4gICAgICAgICQoJ2lucHV0OmNoZWNrYm94Om5vdCg6Y2hlY2tlZCknKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBoaWRlVGFibGVDb2woJChcInRhYmxlXCIpLCAkKHRoaXMpLmF0dHIoXCJ2YWx1ZVwiKSk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCdpbnB1dDpjaGVja2JveDpjaGVja2VkJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgc2hvd1RhYmxlQ29sKCQoXCJ0YWJsZVwiKSwgJCh0aGlzKS5hdHRyKFwidmFsdWVcIikpO1xuICAgICAgICB9KTtcbiAgICAgICAgc2V0VGJhbGVXaWR0aCgpO1xuICAgIH0pO1xuXG4gICAgJChcIi5zZWxlY3QtcGFnZVwiKS5jaGFuZ2UoZnVuY3Rpb24oKXtcbiAgICAgICAgZmlsbERhdGEoKTtcbiAgICAgICAgZ2EoJ3NlbmQnLCB7XG4gICAgICAgICAgICBoaXRUeXBlOiAnZXZlbnQnLFxuICAgICAgICAgICAgZXZlbnRDYXRlZ29yeTogJ2l0ZW1yYXRpbmcnLFxuICAgICAgICAgICAgZXZlbnRBY3Rpb246ICdwYWdlLXNlbGVjdCcsXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoXCIucGFnZS10dXJpbmcucHJldlwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICBpZiAoJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoKSA9PSAxKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpIC0gMSk7XG4gICAgICAgIGZpbGxEYXRhKCk7XG4gICAgICAgIGdhKCdzZW5kJywge1xuICAgICAgICAgICAgaGl0VHlwZTogJ2V2ZW50JyxcbiAgICAgICAgICAgIGV2ZW50Q2F0ZWdvcnk6ICdpdGVtcmF0aW5nJyxcbiAgICAgICAgICAgIGV2ZW50QWN0aW9uOiAncGFnZS10dXJpbmcnLFxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkKFwiLnBhZ2UtdHVyaW5nLm5leHRcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgaWYgKCQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKCkgPT0gJChcIi5zZWxlY3QtcGFnZSBvcHRpb25cIikubGVuZ3RoKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoTnVtYmVyKCQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKCkpICsgMSk7XG4gICAgICAgIGZpbGxEYXRhKCk7XG4gICAgICAgIGdhKCdzZW5kJywge1xuICAgICAgICAgICAgaGl0VHlwZTogJ2V2ZW50JyxcbiAgICAgICAgICAgIGV2ZW50Q2F0ZWdvcnk6ICdpdGVtcmF0aW5nJyxcbiAgICAgICAgICAgIGV2ZW50QWN0aW9uOiAncGFnZS10dXJpbmcnLFxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkKFwidGFibGVcIikudGFibGVzb3J0KHtmdW5jOiBmdW5jdGlvbigpe2ZpbGxEYXRhKCk7fX0pO1xuICAgICQoXCIuZG93bmxvYWRcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgJChcInRhYmxlXCIpLnRhYmxlRXhwb3J0KHtcbiAgICAgICAgICAgIGhlYWRpbmdzOiB0cnVlLFxuICAgICAgICAgICAgZmlsZU5hbWU6IFwiaXRlbXNcIixcbiAgICAgICAgICAgIGZvcm1hdHM6IFtcImNzdlwiXSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBcImJvdHRvbVwiLFxuICAgICAgICAgICAgaWdub3JlQ1NTOiBcIltzdHlsZSo9J2Rpc3BsYXk6IG5vbmUnXVwiXG4gICAgICAgIH0pO1xuICAgICAgICBnYSgnc2VuZCcsIHtcbiAgICAgICAgICAgIGhpdFR5cGU6ICdldmVudCcsXG4gICAgICAgICAgICBldmVudENhdGVnb3J5OiAnaXRlbXJhdGluZycsXG4gICAgICAgICAgICBldmVudEFjdGlvbjogJ2Rvd25sb2FkJyxcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGFibGVTY3JvbGxGdW4oKTtcbn0pO1xuIl0sImZpbGUiOiJhbmFseXRpY3MvaXRlbV9yYXRpbmcuanMifQ==
