var type = "";
function fillData() {
    var arg = $(".search input").val();
    var sort = $("th .ascending").parent().attr("value") || $("th .descending").parent().attr("value");
    var order = $(".ascending").attr("class") || $(".descending").attr("class");
    var page = $(".select-page").val() || 1;

    $.ajax({
        url: "/api/v1.0/dailystatement/guide",
        data: {"page": page, "arg": arg, "sort": sort, "order": order, "type": type},
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
                    //var number = data.data.data[i].number || 0;
                    var name = data.data.data[i].name || '无';
                    var telephone = data.data.data[i].telephone || '无';
                    var store_name = data.data.data[i].store_name || '无';
                    var update_time = data.data.data[i].update_time || '';
                    var status = data.data.data[i].status || 0;
                    if (status == 0) {
                        status = '长促'
                    }
                    if (status == 1) {
                        status = '休假'
                    }
                    if (status == 2) {
                        status = '离职'
                    }
                    if (status == 3) {
                        status = '短促'
                    }
                    $("table tr:eq(" + ii + ")").attr("value", data.data.data[i].id);
                    $("table tr:eq(" + ii + ") td:eq(0)").html('<input class="checkbox" type="checkbox">');
                    //$("table tr:eq(" + ii + ") td:eq(1)").text(number);
                    $("table tr:eq(" + ii + ") td:eq(1)").text(store_name);
                    $("table tr:eq(" + ii + ") td:eq(2)").text(name)
                    $("table tr:eq(" + ii + ") td:eq(3)").text(telephone);
                    $("table tr:eq(" + ii + ") td:eq(4)").text(status);
                    $("table tr:eq(" + ii + ") td:eq(5)").text(update_time);
                }
            } else {
                location.href = "/logout";
            }
        }
    });
}

function addOption() {
    $(".menu").html("");
    $("#store_id").html("");
    $.ajax({
        url: "/api/v1.0/dailystatement/store",
        type: "GET",
        success: function (data) {
            for (var i in data.data) {
                $(".menu").append("<div class='item' data-value='" + data.data[i]['store_name'] + "'>" + data.data[i]['store_name'] + "</div>");
            }
        }
    });
}

function clear() {
    $("#guide_id").val("");
    $("#name").val("");
    $("#telephone").val("");
    $("#basic_salary").val("");
    $("#store_name").text("");
    $("#store_id").val("");
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
        del_table('guide');
    });
    $("tbody").on('dblclick', 'tr', function () {
        addOption();
        var td = $(this).children('td');
        var name = td.eq(2).text();
        var telephone = td.eq(3).text();
        // var basic_salary = td.eq(4).text();
        var store = td.eq(1).text();
        var status = td.eq(5).text();
        $("#name").val(name);
        $("#telephone").val(telephone);
        $("#basic_salary").val(0);
        $("#store_name").text(store);
        $("#store_id").val(store);
        if (status == '长促') {
            $("#status").val(0);
        }
        if (status == '短促') {
            $("#status").val(3);
        }
        $("#guide_id").val($(this).attr('value'));
        $(".add-guide").show();
        $(".table-wrap").hide();
        $(".pagination-wrap").hide();
    });

    $("#add").click(function () {
        addOption();
        $(".add-guide").show();
        $(".table-wrap").hide();
        $(".pagination-wrap").hide();
    });

    $("#add-guide").click(function () {
        var guide_id = $("#guide_id").val();
        var name = $("#name").val();
        var telephone = $("#telephone").val();
        var basic_salary = $("#basic_salary").val() || 0;
        var store_id = $("#store_id").val();
        var status = $("#status").val();
        $.ajax({
            url: "/api/v1.0/dailystatement/guide",
            data: {
                "guide_id": guide_id,
                "name": name,
                "telephone": telephone,
                "basic_salary": basic_salary,
                "store_id": store_id,
                "status": status
            },
            type: "POST",
            success: function (data) {

                if(data.code == 1) {
                    alert(data.error_msg);
                }

                clear();
            }

        })
    });

    $("#cancel").click(function () {
        clear();
    });
});