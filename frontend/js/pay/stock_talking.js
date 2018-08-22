var isnormal = true;

function fillData() {
    var page = $(".select-page").val() || 1;
    var arg = $(".search input").val();
    //var sort = $("th .ascending").parent().attr("value") || $("th .descending").parent().attr("value");
    //var order = $(".ascending").attr("class") || $(".descending").attr("class");
    $.ajax({
        url: "/api/v1.1/pay/pc-stock-taking",
        data: {
            'page': page

        },
        type: "GET",
        success: function (data) {
            console.log(data);
            $(".pagination p span").eq(0).text(data.data.pages + 1);
            $(".pagination p span").eq(1).text(data.data.count);
            $(".select-page option").remove();
            for (var j = 1; j <= data.data.pages; j++) {
                $(".select-page").append("<option value=" + j + ">第" + num2Chinese(j) + "页</option>");
            }
            $(".select-page").val(page);
            var newRow = "<tr><td></td><td></td><td></td><td></td></tr>";
            $("table tbody tr").remove();
            for (var i = 0; i < data.data.data.length; i++) {
                $("table tbody").append(newRow);
                ii = i + 1;

                var col1 = data.data.data[i].item_name ;
                var col2 = data.data.data[i].barcode || '无';
                var col3 = data.data.data[i].amount || '无';
                var col4 = data.data.data[i].name || '无';
                $("table tr:eq(" + ii + ")").attr("value", data.data.data[i].substock_id);

                $("table tr:eq(" + ii + ") td:eq(0)").text(col1);
                $("table tr:eq(" + ii + ") td:eq(1)").text(col2);
                $("table tr:eq(" + ii + ") td:eq(2)").text(col3);
                $("table tr:eq(" + ii + ") td:eq(3)").text(col4);
            };
            //setTbaleWidth();
        }
    });
}

function start() {
    $.ajax({
        url: "/api/v1.1/pay/pc-stock-taking",
        data: {
        },
        type: "POST",
        success: function (data) {
            if (data.code == 0) {
                alert('可以开始使用小程序盘点');
            } else {
                alert('失败了');
            }
        }
    });
}

function end() {
    $.ajax({
        url: "/api/v1.1/pay/pc-stock-taking",
        data: {
        },
        type: "PATCH",
        success: function (data) {
            console.log(data);
            if (data.code == 0){
                fillData();
                alert('完成');
            } else if (data.code == 3) {
                alert('没有正在进行的盘点');
            } else {
                alert('失败了');
            }
        }
    });
}

function clear() {
    $("#name").val("");
    $("#amount").val("");
    $(".add-guide").hide();
    $(".table-wrap").show();
    $(".pagination-wrap").show();
}

$("tbody").on('dblclick', 'tr', function () {
        var td = $(this).children('td');
        var name = td.eq(0).text();
        var amount = td.eq(2).text();
        $("#substock_id").val($(this).attr('value'));
        $("#name").html(name);
        $("#amount").val(amount);
        $(".add-guide").show();
        $(".table-wrap").hide();
        $(".pagination-wrap").hide();
    });

    $("#cancel").click(function () {
        clear();
    });


$(document).ready(function () {
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

    $("table").tablesort({
        func: function () {
            fillData();
        }
    });

    $("#alter-amount").click(function () {
        var td = $(this).children('td');
        var name = td.eq(0).text();
        var amount = document.getElementById("amount").value;
        var substock_id = document.getElementById("substock_id").value;

        console.log(amount,substock_id);
        $.ajax({
            url: "/api/v1.1/pay/pc-stock-taking",
            data: {
                'sid': substock_id,
                'num': amount
            },
            type: "PUT",
            success: function (data) {
                clear();
                fillData();
            }

        })
    });
    $("#download").click(function () {
        // $("table").tableExport({
        //     headings: true,
        //     fileName: "stores",
        //     formats: ["csv"],
        //     position: "bottom",
        //     ignoreCSS: "[style*='display: none']"
        // });
        var arg = $(".search input").val();
        window.location.href = "/api/v1.2/pay/sales-profile-excel?start_time="+start_time+"&end_time="+end_time+"&key_word="+arg;
    //     $.ajax({
    //     url: "/api/v1.2/pay/sales-profile-excel",
    //     data: {
    //         "start_time": start_time,
    //         "end_time": end_time,
    //         "key_word": arg,
    //     },
    //     type: "GET",
    //     success: function (data) {
    //         // console.log(data);
    //         // if(data.code == 0) {
    //         //     alert('已下载');
    //         // } else{
    //         //     alert('下载失败');
    //         // }
    //     }
    // });
    });



});