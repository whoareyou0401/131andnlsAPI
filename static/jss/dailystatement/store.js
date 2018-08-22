var type = "";
function fillData() {
    var arg = $(".search input").val();
    var sort = $("th .ascending").parent().attr("value") || $("th .descending").parent().attr("value");
    var order = $(".ascending").attr("class") || $(".descending").attr("class");
    var page = $(".select-page").val() || 1;

    $.ajax({
        url: "/api/v1.0/dailystatement/store",
        data: {"page": page, "arg": arg, "sort": sort, "order": order, "type": type},
        type: "GET",
        success: function (data) {
            console.log(data)
            if (data.success == 1) {
                $(".pagination p span").eq(0).text(data.data.pages);
                $(".pagination p span").eq(1).text(data.data.count);
                $(".select-page option").remove();
                for (var j = 1; j <= data.data.pages; j++) {
                    $(".select-page").append("<option value=" + j + ">第" + num2Chinese(j) + "页</option>");
                }
                $(".select-page").val(page);
                var newRow = "<tr><td></td><td></td><td></td></tr>";
                $("table tbody tr").remove();
                for (var i = 0; i < data.data.data.length; i++) {
                    $("table tbody").append(newRow);
                    ii = i + 1;
                    var store_name = data.data.data[i].store_name || '无';
                    var store_address = data.data.data[i].store_address || '';

                    $("table tr:eq(" + ii + ")").attr("value", data.data.data[i].id);
                    $("table tr:eq(" + ii + ") td:eq(0)").html('<input class="checkbox" type="checkbox">');
                    $("table tr:eq(" + ii + ") td:eq(1)").text(store_name);
                    $("table tr:eq(" + ii + ") td:eq(2)").text(store_address)
                }
            } else {
                location.href = "/logout";
            }
        }
    });
}



function clear() {
    $("#store_id").val("");
    $("#store_name").text("");
    $("#store_address").text("");
    $(".add-guide").hide();
    $(".table-wrap").show();
    $(".pagination-wrap").show();
}


$(document).ready(function () {
    setupCSRF();
    $('.ui.radio.checkbox')
        .checkbox()
    ;
    $("#selection").dropdown();
    $('.ui.radio.checkbox').click(function () {
        type = $('input[type="radio"]:checked').attr("id");
        fillData();
    });
    $(".sidebar li").eq(3).addClass("active").siblings().removeClass("active");
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

    $(".checkbox_all").click(function () {
        if ($(this).is(':checked')) {
            $(".checkbox").prop("checked", true);
        }
        else {
            $(".checkbox").prop("checked", false);
        }
    });

    function del_table(type) {
        var checkbox = $('.checkbox:checked');
        var checkbox_list = [];
        $(checkbox).each(function () {
            id = $(this).parent().parent().attr('value');
            checkbox_list.push(id);
        });
        checkbox_list = JSON.stringify(checkbox_list);
        $.ajax({
            type: "DELETE",
            url: "/api/v1.0/dailystatement/" + type,
            data: {
                "ids": checkbox_list
            },
            dataType: "json",
            success: function (data) {
                if (data.code == 0) {
                    $(checkbox).each(function () {
                        $(this).parent().parent().remove();
                    });
                }
            }
        });
    }

    $("#delete").click(function () {
        del_table('store');
    });
    $("tbody").on('dblclick', 'tr', function () {
        var td = $(this).children('td');
        var store = td.eq(1).text();
        var address = td.eq(2).text();
        $("#store_name").val(store);
        $("#store_address").val(address);
        $("#store_id").val($(this).attr('value'));
        $(".add-guide").show();
        $(".table-wrap").hide();
        $(".pagination-wrap").hide();
    });

    $("#add").click(function () {
        $(".add-guide").show();
        $(".table-wrap").hide();
        $(".pagination-wrap").hide();
    });

    $("#add-guide").click(function () {
        var store_id = $("#store_id").val();
        var store_name = $("#store_name").val();
        var store_address = $("#store_address").val();
        $.ajax({
            url: "/api/v1.0/dailystatement/store",
            data: {
                "id": store_id,
                "store_name": store_name,
                "store_address": store_address
            },
            type: "POST",
            success: function (data) {

                if(data.code == 1) {
                    alert(data.error_msg);
                }
                fillData();
                clear();
            }

        })
    });

    $("#cancel").click(function () {
        clear();
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkYWlseXN0YXRlbWVudC9zdG9yZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdHlwZSA9IFwiXCI7XG5mdW5jdGlvbiBmaWxsRGF0YSgpIHtcbiAgICB2YXIgYXJnID0gJChcIi5zZWFyY2ggaW5wdXRcIikudmFsKCk7XG4gICAgdmFyIHNvcnQgPSAkKFwidGggLmFzY2VuZGluZ1wiKS5wYXJlbnQoKS5hdHRyKFwidmFsdWVcIikgfHwgJChcInRoIC5kZXNjZW5kaW5nXCIpLnBhcmVudCgpLmF0dHIoXCJ2YWx1ZVwiKTtcbiAgICB2YXIgb3JkZXIgPSAkKFwiLmFzY2VuZGluZ1wiKS5hdHRyKFwiY2xhc3NcIikgfHwgJChcIi5kZXNjZW5kaW5nXCIpLmF0dHIoXCJjbGFzc1wiKTtcbiAgICB2YXIgcGFnZSA9ICQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKCkgfHwgMTtcblxuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogXCIvYXBpL3YxLjAvZGFpbHlzdGF0ZW1lbnQvc3RvcmVcIixcbiAgICAgICAgZGF0YToge1wicGFnZVwiOiBwYWdlLCBcImFyZ1wiOiBhcmcsIFwic29ydFwiOiBzb3J0LCBcIm9yZGVyXCI6IG9yZGVyLCBcInR5cGVcIjogdHlwZX0sXG4gICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgJChcIi5wYWdpbmF0aW9uIHAgc3BhblwiKS5lcSgwKS50ZXh0KGRhdGEuZGF0YS5wYWdlcyk7XG4gICAgICAgICAgICAgICAgJChcIi5wYWdpbmF0aW9uIHAgc3BhblwiKS5lcSgxKS50ZXh0KGRhdGEuZGF0YS5jb3VudCk7XG4gICAgICAgICAgICAgICAgJChcIi5zZWxlY3QtcGFnZSBvcHRpb25cIikucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDE7IGogPD0gZGF0YS5kYXRhLnBhZ2VzOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgJChcIi5zZWxlY3QtcGFnZVwiKS5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPVwiICsgaiArIFwiPuesrFwiICsgbnVtMkNoaW5lc2UoaikgKyBcIumhtTwvb3B0aW9uPlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJChcIi5zZWxlY3QtcGFnZVwiKS52YWwocGFnZSk7XG4gICAgICAgICAgICAgICAgdmFyIG5ld1JvdyA9IFwiPHRyPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjwvdHI+XCI7XG4gICAgICAgICAgICAgICAgJChcInRhYmxlIHRib2R5IHRyXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5kYXRhLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRib2R5XCIpLmFwcGVuZChuZXdSb3cpO1xuICAgICAgICAgICAgICAgICAgICBpaSA9IGkgKyAxO1xuICAgICAgICAgICAgICAgICAgICAvL3ZhciBudW1iZXIgPSBkYXRhLmRhdGEuZGF0YVtpXS5udW1iZXIgfHwgMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWUgPSBkYXRhLmRhdGEuZGF0YVtpXS5uYW1lIHx8ICfml6AnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGVsZXBob25lID0gZGF0YS5kYXRhLmRhdGFbaV0udGVsZXBob25lIHx8ICfml6AnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RvcmVfbmFtZSA9IGRhdGEuZGF0YS5kYXRhW2ldLnN0b3JlX25hbWUgfHwgJ+aXoCc7XG4gICAgICAgICAgICAgICAgICAgIHZhciB1cGRhdGVfdGltZSA9IGRhdGEuZGF0YS5kYXRhW2ldLnVwZGF0ZV90aW1lIHx8ICcnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdHVzID0gZGF0YS5kYXRhLmRhdGFbaV0uc3RhdHVzIHx8IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzID0gJ+mVv+S/gydcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cyA9ICfkvJHlgYcnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMgPSAn56a76IGMJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzID0gJ+efreS/gydcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKVwiKS5hdHRyKFwidmFsdWVcIiwgZGF0YS5kYXRhLmRhdGFbaV0uaWQpO1xuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSgwKVwiKS5odG1sKCc8aW5wdXQgY2xhc3M9XCJjaGVja2JveFwiIHR5cGU9XCJjaGVja2JveFwiPicpO1xuICAgICAgICAgICAgICAgICAgICAvLyQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDEpXCIpLnRleHQobnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoMSlcIikudGV4dChzdG9yZV9uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoMilcIikudGV4dChuYW1lKVxuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSgzKVwiKS50ZXh0KHRlbGVwaG9uZSk7XG4gICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDQpXCIpLnRleHQoc3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoNSlcIikudGV4dCh1cGRhdGVfdGltZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gXCIvbG9nb3V0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkT3B0aW9uKCkge1xuICAgICQoXCIubWVudVwiKS5odG1sKFwiXCIpO1xuICAgICQoXCIjc3RvcmVfaWRcIikuaHRtbChcIlwiKTtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IFwiL2FwaS92MS4wL2RhaWx5c3RhdGVtZW50L3N0b3JlXCIsXG4gICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIGRhdGEuZGF0YSkge1xuICAgICAgICAgICAgICAgICQoXCIubWVudVwiKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdpdGVtJyBkYXRhLXZhbHVlPSdcIiArIGRhdGEuZGF0YVtpXVsnc3RvcmVfbmFtZSddICsgXCInPlwiICsgZGF0YS5kYXRhW2ldWydzdG9yZV9uYW1lJ10gKyBcIjwvZGl2PlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjbGVhcigpIHtcbiAgICAkKFwiI2d1aWRlX2lkXCIpLnZhbChcIlwiKTtcbiAgICAkKFwiI25hbWVcIikudmFsKFwiXCIpO1xuICAgICQoXCIjdGVsZXBob25lXCIpLnZhbChcIlwiKTtcbiAgICAkKFwiI2Jhc2ljX3NhbGFyeVwiKS52YWwoXCJcIik7XG4gICAgJChcIiNzdG9yZV9uYW1lXCIpLnRleHQoXCJcIik7XG4gICAgJChcIiNzdG9yZV9pZFwiKS52YWwoXCJcIik7XG4gICAgJChcIi5hZGQtZ3VpZGVcIikuaGlkZSgpO1xuICAgICQoXCIudGFibGUtd3JhcFwiKS5zaG93KCk7XG4gICAgJChcIi5wYWdpbmF0aW9uLXdyYXBcIikuc2hvdygpO1xufVxuXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICBzZXR1cENTUkYoKTtcbiAgICAkKCcudWkucmFkaW8uY2hlY2tib3gnKVxuICAgICAgICAuY2hlY2tib3goKVxuICAgIDtcbiAgICAkKFwiI3NlbGVjdGlvblwiKS5kcm9wZG93bigpO1xuICAgICQoJy51aS5yYWRpby5jaGVja2JveCcpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdHlwZSA9ICQoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXTpjaGVja2VkJykuYXR0cihcImlkXCIpO1xuICAgICAgICBmaWxsRGF0YSgpO1xuICAgIH0pO1xuICAgICQoXCIuc2lkZWJhciBsaVwiKS5lcSg1KS5hZGRDbGFzcyhcImFjdGl2ZVwiKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgIGZpbGxEYXRhKCk7XG5cbiAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLmNoYW5nZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZpbGxEYXRhKCk7XG4gICAgfSk7XG4gICAgJChcIi5wYWdlLXR1cmluZy5wcmV2XCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKCkgPT0gMSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoKSAtIDEpO1xuICAgICAgICBmaWxsRGF0YSgpO1xuICAgIH0pO1xuICAgICQoXCIucGFnZS10dXJpbmcubmV4dFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpID09ICQoXCIuc2VsZWN0LXBhZ2Ugb3B0aW9uXCIpLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKE51bWJlcigkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpKSArIDEpO1xuICAgICAgICBmaWxsRGF0YSgpO1xuICAgIH0pO1xuXG4gICAgJChcIi5zZWFyY2ggaVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkLnRyaW0oJChcIi5zZWFyY2ggaW5wdXRcIikudmFsKCkpICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBmaWxsRGF0YSgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkKFwiLnNlYXJjaCBpbnB1dFwiKS5rZXlkb3duKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT0gMTMpIHtcbiAgICAgICAgICAgIGZpbGxEYXRhKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoXCIuY2hlY2tib3hfYWxsXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQodGhpcykuaXMoJzpjaGVja2VkJykpIHtcbiAgICAgICAgICAgICQoXCIuY2hlY2tib3hcIikucHJvcChcImNoZWNrZWRcIiwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAkKFwiLmNoZWNrYm94XCIpLnByb3AoXCJjaGVja2VkXCIsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gZGVsX3RhYmxlKHR5cGUpIHtcbiAgICAgICAgdmFyIGNoZWNrYm94ID0gJCgnLmNoZWNrYm94OmNoZWNrZWQnKTtcbiAgICAgICAgdmFyIGNoZWNrYm94X2xpc3QgPSBbXTtcbiAgICAgICAgJChjaGVja2JveCkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuYXR0cigndmFsdWUnKTtcbiAgICAgICAgICAgIGNoZWNrYm94X2xpc3QucHVzaChpZCk7XG4gICAgICAgIH0pO1xuICAgICAgICBjaGVja2JveF9saXN0ID0gSlNPTi5zdHJpbmdpZnkoY2hlY2tib3hfbGlzdCk7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB0eXBlOiBcIkRFTEVURVwiLFxuICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMC9kYWlseXN0YXRlbWVudC9cIiArIHR5cGUsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgXCJpZHNcIjogY2hlY2tib3hfbGlzdFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuY29kZSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICQoY2hlY2tib3gpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAkKFwiI2RlbGV0ZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRlbF90YWJsZSgnZ3VpZGUnKTtcbiAgICB9KTtcbiAgICAkKFwidGJvZHlcIikub24oJ2RibGNsaWNrJywgJ3RyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBhZGRPcHRpb24oKTtcbiAgICAgICAgdmFyIHRkID0gJCh0aGlzKS5jaGlsZHJlbigndGQnKTtcbiAgICAgICAgdmFyIG5hbWUgPSB0ZC5lcSgyKS50ZXh0KCk7XG4gICAgICAgIHZhciB0ZWxlcGhvbmUgPSB0ZC5lcSgzKS50ZXh0KCk7XG4gICAgICAgIC8vIHZhciBiYXNpY19zYWxhcnkgPSB0ZC5lcSg0KS50ZXh0KCk7XG4gICAgICAgIHZhciBzdG9yZSA9IHRkLmVxKDEpLnRleHQoKTtcbiAgICAgICAgdmFyIHN0YXR1cyA9IHRkLmVxKDUpLnRleHQoKTtcbiAgICAgICAgJChcIiNuYW1lXCIpLnZhbChuYW1lKTtcbiAgICAgICAgJChcIiN0ZWxlcGhvbmVcIikudmFsKHRlbGVwaG9uZSk7XG4gICAgICAgICQoXCIjYmFzaWNfc2FsYXJ5XCIpLnZhbCgwKTtcbiAgICAgICAgJChcIiNzdG9yZV9uYW1lXCIpLnRleHQoc3RvcmUpO1xuICAgICAgICAkKFwiI3N0b3JlX2lkXCIpLnZhbChzdG9yZSk7XG4gICAgICAgIGlmIChzdGF0dXMgPT0gJ+mVv+S/gycpIHtcbiAgICAgICAgICAgICQoXCIjc3RhdHVzXCIpLnZhbCgwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhdHVzID09ICfnn63kv4MnKSB7XG4gICAgICAgICAgICAkKFwiI3N0YXR1c1wiKS52YWwoMyk7XG4gICAgICAgIH1cbiAgICAgICAgJChcIiNndWlkZV9pZFwiKS52YWwoJCh0aGlzKS5hdHRyKCd2YWx1ZScpKTtcbiAgICAgICAgJChcIi5hZGQtZ3VpZGVcIikuc2hvdygpO1xuICAgICAgICAkKFwiLnRhYmxlLXdyYXBcIikuaGlkZSgpO1xuICAgICAgICAkKFwiLnBhZ2luYXRpb24td3JhcFwiKS5oaWRlKCk7XG4gICAgfSk7XG5cbiAgICAkKFwiI2FkZFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFkZE9wdGlvbigpO1xuICAgICAgICAkKFwiLmFkZC1ndWlkZVwiKS5zaG93KCk7XG4gICAgICAgICQoXCIudGFibGUtd3JhcFwiKS5oaWRlKCk7XG4gICAgICAgICQoXCIucGFnaW5hdGlvbi13cmFwXCIpLmhpZGUoKTtcbiAgICB9KTtcblxuICAgICQoXCIjYWRkLWd1aWRlXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGd1aWRlX2lkID0gJChcIiNndWlkZV9pZFwiKS52YWwoKTtcbiAgICAgICAgdmFyIG5hbWUgPSAkKFwiI25hbWVcIikudmFsKCk7XG4gICAgICAgIHZhciB0ZWxlcGhvbmUgPSAkKFwiI3RlbGVwaG9uZVwiKS52YWwoKTtcbiAgICAgICAgdmFyIGJhc2ljX3NhbGFyeSA9ICQoXCIjYmFzaWNfc2FsYXJ5XCIpLnZhbCgpIHx8IDA7XG4gICAgICAgIHZhciBzdG9yZV9pZCA9ICQoXCIjc3RvcmVfaWRcIikudmFsKCk7XG4gICAgICAgIHZhciBzdGF0dXMgPSAkKFwiI3N0YXR1c1wiKS52YWwoKTtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjAvZGFpbHlzdGF0ZW1lbnQvZ3VpZGVcIixcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBcImd1aWRlX2lkXCI6IGd1aWRlX2lkLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBuYW1lLFxuICAgICAgICAgICAgICAgIFwidGVsZXBob25lXCI6IHRlbGVwaG9uZSxcbiAgICAgICAgICAgICAgICBcImJhc2ljX3NhbGFyeVwiOiBiYXNpY19zYWxhcnksXG4gICAgICAgICAgICAgICAgXCJzdG9yZV9pZFwiOiBzdG9yZV9pZCxcbiAgICAgICAgICAgICAgICBcInN0YXR1c1wiOiBzdGF0dXNcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICBpZihkYXRhLmNvZGUgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChkYXRhLmVycm9yX21zZyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY2xlYXIoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuICAgIH0pO1xuXG4gICAgJChcIiNjYW5jZWxcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBjbGVhcigpO1xuICAgIH0pO1xufSk7Il0sImZpbGUiOiJkYWlseXN0YXRlbWVudC9zdG9yZS5qcyJ9
